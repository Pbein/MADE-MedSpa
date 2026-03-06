import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function getSubscriptionId(invoice: Stripe.Invoice): string | undefined {
  const sub = invoice.parent?.subscription_details?.subscription;
  if (typeof sub === "string") return sub;
  if (typeof sub === "object" && sub) return sub.id;
  return undefined;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe webhook signature verification failed:", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCancelled(subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = getSubscriptionId(invoice);
        if (subId) {
          await handlePaymentSucceeded(subId);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = getSubscriptionId(invoice);
        if (subId) {
          await handlePaymentFailed(subId);
        }
        break;
      }

      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "payment") {
          await handleCheckoutCompleted(session);
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }
  } catch (err) {
    console.error(`Error processing Stripe event ${event.type}:`, err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const member = await convex.query(api.members.getByStripeSubscriptionId, {
    stripeSubscriptionId: subscription.id,
  });

  if (!member) {
    console.log(
      `No member found for subscription ${subscription.id}, may be new signup`
    );
    return;
  }

  const statusMap: Record<string, string> = {
    active: "active",
    past_due: "past_due",
    canceled: "cancelled",
    unpaid: "past_due",
    trialing: "active",
  };

  const newStatus = statusMap[subscription.status] || "pending";
  const nextBilling = (subscription.billing_cycle_anchor || Math.floor(Date.now() / 1000) + 30 * 86400) * 1000;

  await convex.mutation(api.members.updateStatus, {
    id: member._id,
    status: newStatus as "active" | "past_due" | "cancelled" | "pending" | "expired",
  });

  await convex.mutation(api.members.updateSubscription, {
    id: member._id,
    stripeSubscriptionId: subscription.id,
    nextBillingDate: nextBilling,
  });
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  const member = await convex.query(api.members.getByStripeSubscriptionId, {
    stripeSubscriptionId: subscription.id,
  });

  if (member) {
    await convex.mutation(api.members.updateStatus, {
      id: member._id,
      status: "cancelled",
    });
  }
}

async function handlePaymentSucceeded(subscriptionId: string) {
  const member = await convex.query(api.members.getByStripeSubscriptionId, {
    stripeSubscriptionId: subscriptionId,
  });

  if (member && member.status !== "active") {
    await convex.mutation(api.members.updateStatus, {
      id: member._id,
      status: "active",
    });
  }
}

async function handlePaymentFailed(subscriptionId: string) {
  const member = await convex.query(api.members.getByStripeSubscriptionId, {
    stripeSubscriptionId: subscriptionId,
  });

  if (member) {
    await convex.mutation(api.members.updateStatus, {
      id: member._id,
      status: "past_due",
    });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata;
  if (!metadata?.cartItems) return;

  const items = JSON.parse(metadata.cartItems);
  const subtotal = session.amount_subtotal || 0;
  const total = session.amount_total || 0;

  const orderNumber = `MADE-${Date.now().toString(36).toUpperCase()}`;

  const orderId = await convex.mutation(api.orders.create, {
    orderNumber,
    items,
    subtotal,
    tax: total - subtotal,
    shipping: 0,
    total,
    stripePaymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id || "",
    customerEmail: session.customer_details?.email || "",
    customerName: session.customer_details?.name || "",
  });

  await convex.mutation(api.orders.updateStatus, {
    id: orderId,
    status: "paid",
  });
}

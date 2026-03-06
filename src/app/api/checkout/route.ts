import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

interface CartItem {
  productId: string;
  productName: string;
  price: number; // in cents
  quantity: number;
  imageUrl?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { items, customerEmail, userId } = (await req.json()) as {
      items: CartItem[];
      customerEmail?: string;
      userId?: string;
    };

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.productName,
            ...(item.imageUrl ? { images: [item.imageUrl] } : {}),
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      }));

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/shop/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop/cart`,
      ...(customerEmail ? { customer_email: customerEmail } : {}),
      metadata: {
        userId: userId || "",
        cartItems: JSON.stringify(
          items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            priceAtPurchase: item.price,
          }))
        ),
      },
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout session creation failed:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

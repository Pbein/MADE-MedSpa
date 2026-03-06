import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(payload).digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

interface CalcomPayload {
  triggerEvent: string;
  payload: {
    uid: string;
    title: string;
    startTime: string;
    endTime: string;
    attendees: Array<{
      name: string;
      email: string;
      phone?: string;
    }>;
    eventTypeSlug?: string;
    status?: string;
    rescheduleUid?: string;
  };
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-cal-signature-256");

  if (!signature || !process.env.CALCOM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  const isValid = verifyWebhookSignature(
    body,
    signature,
    process.env.CALCOM_WEBHOOK_SECRET
  );

  if (!isValid) {
    console.error("Cal.com webhook signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let data: CalcomPayload;
  try {
    data = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { triggerEvent, payload } = data;
  const attendee = payload.attendees?.[0];

  try {
    switch (triggerEvent) {
      case "BOOKING_CREATED": {
        // Check for duplicate (idempotency)
        const existing = await convex.query(api.bookings.getByCalBookingId, {
          calBookingId: payload.uid,
        });

        if (existing) {
          console.log(`Booking ${payload.uid} already exists, skipping`);
          break;
        }

        await convex.mutation(api.bookings.create, {
          calBookingId: payload.uid,
          calEventTypeSlug: payload.eventTypeSlug || "",
          guestName: attendee?.name || "Unknown",
          guestEmail: attendee?.email || "",
          guestPhone: attendee?.phone,
          startTime: new Date(payload.startTime).getTime(),
          endTime: new Date(payload.endTime).getTime(),
          status: "confirmed",
          createdAt: Date.now(),
        });
        break;
      }

      case "BOOKING_CANCELLED": {
        const booking = await convex.query(api.bookings.getByCalBookingId, {
          calBookingId: payload.uid,
        });

        if (booking) {
          await convex.mutation(api.bookings.updateStatus, {
            id: booking._id,
            status: "cancelled",
          });
        }
        break;
      }

      case "BOOKING_RESCHEDULED": {
        // Cancel old booking
        if (payload.rescheduleUid) {
          const oldBooking = await convex.query(api.bookings.getByCalBookingId, {
            calBookingId: payload.rescheduleUid,
          });
          if (oldBooking) {
            await convex.mutation(api.bookings.updateStatus, {
              id: oldBooking._id,
              status: "rescheduled",
            });
          }
        }

        // Create new booking
        await convex.mutation(api.bookings.create, {
          calBookingId: payload.uid,
          calEventTypeSlug: payload.eventTypeSlug || "",
          guestName: attendee?.name || "Unknown",
          guestEmail: attendee?.email || "",
          guestPhone: attendee?.phone,
          startTime: new Date(payload.startTime).getTime(),
          endTime: new Date(payload.endTime).getTime(),
          status: "confirmed",
          createdAt: Date.now(),
        });
        break;
      }

      default:
        console.log(`Unhandled Cal.com event: ${triggerEvent}`);
    }
  } catch (err) {
    console.error(`Error processing Cal.com event ${triggerEvent}:`, err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

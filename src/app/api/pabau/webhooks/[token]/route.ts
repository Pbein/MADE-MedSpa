import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../../convex/_generated/api";
import { getPabauConfig, isPabauConfigured } from "@/lib/pabau/config";
import { verifyPabauUrlToken } from "@/lib/pabau/verifyWebhook";
import { dispatchWebhook, type WebhookAction } from "@/lib/pabau/webhookHandlers";

interface IncomingWebhook {
  event_id?: string;
  id?: string;
  entity?: string;
  entity_type?: string;
  object_type?: string;
  source?: string;
  action?: string;
  event?: string;
  data?: unknown;
  payload?: unknown;
}

function getConvexClient(): ConvexHttpClient {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) throw new Error("NEXT_PUBLIC_CONVEX_URL not configured.");
  return new ConvexHttpClient(url);
}

function pickEventId(body: IncomingWebhook): string | null {
  return body.event_id ?? body.id ?? null;
}

function pickEntityType(body: IncomingWebhook): string | null {
  // Pabau's UI calls them "booking" / "client" / "lead"; docs say "appointment". Accept all.
  const raw = (body.entity_type ?? body.entity ?? body.object_type ?? body.source ?? "")
    .toString()
    .toLowerCase();
  if (!raw) return null;
  if (raw === "booking") return "appointment";
  return raw;
}

const CREATE_ALIASES = new Set(["create", "created", "new"]);
const DELETE_ALIASES = new Set(["delete", "deleted", "removed"]);

function normalizeAction(action: string | undefined): {
  normalized: WebhookAction;
  original: string;
} | null {
  if (!action) return null;
  const original = action;
  const lower = action.toLowerCase();
  if (CREATE_ALIASES.has(lower)) return { normalized: "create", original };
  if (DELETE_ALIASES.has(lower)) return { normalized: "delete", original };
  // All other Pabau-specific events (update, won, lost, reopen, canceled, reschedule,
  // blockout_canceled) map to "update" — they're state transitions on an existing entity.
  return { normalized: "update", original };
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  if (!isPabauConfigured()) {
    return NextResponse.json({ ok: false, error: "Pabau not configured." }, { status: 503 });
  }

  const { token } = await params;
  const { webhookSecret } = getPabauConfig();
  const verification = verifyPabauUrlToken(token, webhookSecret);
  if (!verification.ok) {
    console.warn("[pabau/webhook] token failed:", verification.reason);
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const rawBody = await req.text();
  let body: IncomingWebhook;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const eventId = pickEventId(body);
  const entityType = pickEntityType(body);
  const actionResult = normalizeAction(body.action ?? body.event);

  if (!eventId || !entityType || !actionResult) {
    return NextResponse.json(
      { ok: false, error: "Missing event_id, entity_type, or action." },
      { status: 400 },
    );
  }
  const action = actionResult.normalized;

  const basePayload = body.data ?? body.payload ?? body;
  const payload = {
    ...(typeof basePayload === "object" && basePayload !== null ? basePayload : { raw: basePayload }),
    _pabauOriginalAction: actionResult.original,
  };
  const convex = getConvexClient();

  let insertResult: { id: string; duplicate: boolean };
  try {
    insertResult = await convex.mutation(api.pabauWebhookEvents.insert, {
      eventId,
      entityType,
      action,
      payload,
    });
  } catch (err) {
    console.error("[pabau/webhook] failed to insert event", err);
    return NextResponse.json({ ok: false, error: "Failed to log event." }, { status: 500 });
  }

  if (insertResult.duplicate) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const eventRowId = insertResult.id as unknown as never;
  const result = await dispatchWebhook(entityType, { eventId, action, payload });

  try {
    if (result.ok && result.ignored) {
      await convex.mutation(api.pabauWebhookEvents.markIgnored, {
        id: eventRowId,
        reason: result.reason ?? "ignored",
      });
    } else if (result.ok) {
      await convex.mutation(api.pabauWebhookEvents.markProcessed, { id: eventRowId });
    } else {
      await convex.mutation(api.pabauWebhookEvents.markFailed, {
        id: eventRowId,
        errorMessage: result.reason ?? "unknown error",
      });
    }
  } catch (err) {
    console.error("[pabau/webhook] failed to update event status", err);
  }

  return NextResponse.json({ ok: true, processed: result.ok && !result.ignored });
}

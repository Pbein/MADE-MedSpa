import "server-only";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

export type WebhookAction = "create" | "update" | "delete";

export interface WebhookHandlerInput {
  eventId: string;
  action: WebhookAction;
  payload: unknown;
}

export interface WebhookHandlerResult {
  ok: boolean;
  reason?: string;
  ignored?: boolean;
}

export type WebhookHandler = (
  input: WebhookHandlerInput,
) => Promise<WebhookHandlerResult>;

// --- Convex client ---------------------------------------------------------

function getConvexClient(): ConvexHttpClient {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) throw new Error("NEXT_PUBLIC_CONVEX_URL not configured.");
  return new ConvexHttpClient(url);
}

// --- Helpers ---------------------------------------------------------------

function asRecord(v: unknown): Record<string, unknown> {
  return typeof v === "object" && v !== null
    ? (v as Record<string, unknown>)
    : {};
}

function pickString(rec: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const val = rec[k];
    if (val === undefined || val === null) continue;
    if (typeof val === "string") {
      if (val.length > 0) return val;
    } else if (typeof val === "number") {
      return String(val);
    }
  }
  return undefined;
}

function pickAny(rec: Record<string, unknown>, ...keys: string[]): unknown {
  for (const k of keys) {
    const val = rec[k];
    if (val !== undefined && val !== null) return val;
  }
  return undefined;
}

function buildName(rec: Record<string, unknown>): string | undefined {
  // Try several common shapes Pabau emits.
  const direct = pickString(rec, "name", "full_name", "fullName");
  if (direct) return direct;
  const first = pickString(rec, "first_name", "firstName", "given_name");
  const last = pickString(rec, "last_name", "lastName", "family_name", "surname");
  const combined = [first, last].filter(Boolean).join(" ").trim();
  return combined.length > 0 ? combined : undefined;
}

function pickOccurredAt(rec: Record<string, unknown>): number {
  const candidates = [
    rec.occurred_at,
    rec.event_time,
    rec.eventTime,
    rec.updated_at,
    rec.updatedAt,
    rec.created_at,
    rec.createdAt,
    rec.timestamp,
  ];
  for (const c of candidates) {
    if (typeof c === "number" && Number.isFinite(c)) {
      // Pabau timestamps may be in seconds; if value is suspiciously small,
      // treat as seconds and convert to ms.
      return c < 1e12 ? c * 1000 : c;
    }
    if (typeof c === "string" && c.length > 0) {
      const parsed = Date.parse(c);
      if (!Number.isNaN(parsed)) return parsed;
    }
  }
  return Date.now();
}

interface ExtractedEvent {
  pabauEntityId: string | undefined;
  payloadSummary: Record<string, unknown> | undefined;
  occurredAt: number;
}

type Extractor = (payload: Record<string, unknown>) => ExtractedEvent;

const extractClient: Extractor = (p) => ({
  pabauEntityId: pickString(p, "id", "client_id", "clientId"),
  payloadSummary: {
    name: buildName(p),
    email: pickString(p, "email", "email_address"),
    mobile: pickString(p, "mobile", "phone", "phone_number", "telephone"),
  },
  occurredAt: pickOccurredAt(p),
});

const extractLead: Extractor = (p) => ({
  pabauEntityId: pickString(p, "id", "lead_id", "leadId"),
  payloadSummary: {
    name: buildName(p),
    email: pickString(p, "email", "email_address"),
    mobile: pickString(p, "mobile", "phone", "phone_number", "telephone"),
    lead_status: pickString(p, "lead_status", "leadStatus", "status"),
    lead_source: pickString(p, "lead_source", "leadSource", "source"),
  },
  occurredAt: pickOccurredAt(p),
});

const extractAppointment: Extractor = (p) => ({
  pabauEntityId: pickString(p, "id", "appointment_id", "appointmentId", "booking_id", "bookingId"),
  payloadSummary: {
    start_date: pickAny(p, "start_date", "startDate", "start_time", "startTime"),
    service_id: pickAny(p, "service_id", "serviceId"),
    client_id: pickAny(p, "client_id", "clientId"),
    status: pickString(p, "status", "appointment_status"),
  },
  occurredAt: pickOccurredAt(p),
});

const extractMinimal: Extractor = (p) => ({
  pabauEntityId: pickString(p, "id", "activity_id", "activityId", "invoice_id", "invoiceId"),
  payloadSummary: undefined,
  occurredAt: pickOccurredAt(p),
});

const EXTRACTORS: Record<string, Extractor> = {
  client: extractClient,
  lead: extractLead,
  appointment: extractAppointment,
  activity: extractMinimal,
  invoice: extractMinimal,
};

async function recordActivity(
  entityType: string,
  input: WebhookHandlerInput,
): Promise<WebhookHandlerResult> {
  const extractor = EXTRACTORS[entityType] ?? extractMinimal;
  const rec = asRecord(input.payload);
  const extracted = extractor(rec);

  try {
    const convex = getConvexClient();
    await convex.mutation(api.pabauActivityLog.insertEvent, {
      entityType,
      action: input.action,
      pabauEntityId: extracted.pabauEntityId,
      pabauEventId: input.eventId,
      occurredAt: extracted.occurredAt,
      payloadSummary: extracted.payloadSummary,
    });
    return { ok: true, ignored: false };
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : String(err),
    };
  }
}

const handlers: Record<string, WebhookHandler> = {
  client: (input) => recordActivity("client", input),
  lead: (input) => recordActivity("lead", input),
  appointment: (input) => recordActivity("appointment", input),
  activity: (input) => recordActivity("activity", input),
  invoice: (input) => recordActivity("invoice", input),
};

export function getHandler(entityType: string): WebhookHandler | null {
  return handlers[entityType] ?? null;
}

export async function dispatchWebhook(
  entityType: string,
  input: WebhookHandlerInput,
): Promise<WebhookHandlerResult> {
  const handler = getHandler(entityType);
  if (!handler) {
    return {
      ok: true,
      ignored: true,
      reason: `Unknown entity type "${entityType}"; ack but skip.`,
    };
  }
  try {
    return await handler(input);
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : String(err),
    };
  }
}

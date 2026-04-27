import { NextRequest, NextResponse } from "next/server";
import { pabau } from "@/lib/pabau/client";
import { getPabauConfig, isPabauConfigured } from "@/lib/pabau/config";
import { leadInputToPabauPayload, validateLeadInput } from "@/lib/pabau/schemas/lead";
import {
  PabauCircuitOpenError,
  PabauError,
  PabauRateLimitError,
} from "@/lib/pabau/types";

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 5;
const ipHits = new Map<string, number[]>();

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const recent = (ipHits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    ipHits.set(ip, recent);
    return false;
  }
  recent.push(now);
  ipHits.set(ip, recent);
  return true;
}

export async function POST(req: NextRequest) {
  if (!isPabauConfigured()) {
    return NextResponse.json(
      { success: false, error: "Pabau is not configured on the server." },
      { status: 503 },
    );
  }

  const ip = clientIp(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many submissions. Please try again in a minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const validation = validateLeadInput(body);
  if (!validation.ok || !validation.value) {
    return NextResponse.json(
      { success: false, error: "Validation failed.", fieldErrors: validation.errors },
      { status: 400 },
    );
  }

  const { leadSourceId } = getPabauConfig();
  const payload = leadInputToPabauPayload(validation.value, { leadSourceId });

  console.log("[pabau/leads] outgoing payload:", JSON.stringify(payload, null, 2));

  try {
    const result = await pabau.leads.create(payload);
    console.log("[pabau/leads] response:", JSON.stringify(result));
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error ?? "Pabau rejected the lead.",
          ...(process.env.NODE_ENV !== "production" ? { _debug: result } : {}),
        },
        { status: 502 },
      );
    }
    return NextResponse.json({ success: true, leadId: result.lead_id });
  } catch (err) {
    if (err instanceof PabauRateLimitError || err instanceof PabauCircuitOpenError) {
      return NextResponse.json(
        {
          success: false,
          error: "Our system is briefly busy. Please try again in a few minutes.",
        },
        { status: 503 },
      );
    }
    if (err instanceof PabauError) {
      console.error(
        "[pabau/leads] PabauError",
        "status:", err.status,
        "message:", err.message,
        "responseBody:", err.responseBody,
      );
      return NextResponse.json(
        {
          success: false,
          error: "Could not submit your message. Please email us directly.",
          ...(process.env.NODE_ENV !== "production"
            ? { _debug: { status: err.status, message: err.message, responseBody: err.responseBody } }
            : {}),
        },
        { status: 502 },
      );
    }
    console.error("[pabau/leads] unexpected error", err);
    return NextResponse.json(
      { success: false, error: "Unexpected error. Please email us directly." },
      { status: 500 },
    );
  }
}

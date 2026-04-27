import { NextResponse } from "next/server";
import { pabau } from "@/lib/pabau/client";
import { isPabauConfigured } from "@/lib/pabau/config";

export async function GET() {
  if (!isPabauConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Pabau not configured." },
      { status: 503 },
    );
  }
  try {
    const { sources, pathTried } = await pabau.leadSources.list();
    return NextResponse.json({ ok: true, leadSources: sources, pathTried });
  } catch (err) {
    console.error("[pabau/lead-sources] failed", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to fetch." },
      { status: 502 },
    );
  }
}

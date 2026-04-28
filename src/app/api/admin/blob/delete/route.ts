import { del } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as { url?: string };
    const url = body?.url;
    if (typeof url !== "string" || url.length === 0) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    const isBlobUrl = url.includes(".public.blob.vercel-storage.com");
    if (!isBlobUrl) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    await del(url);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

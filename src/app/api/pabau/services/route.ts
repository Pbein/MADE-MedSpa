import { NextResponse } from "next/server";

const PABAU_API_KEY = process.env.PABAU_API_KEY;

export async function GET() {
  if (!PABAU_API_KEY) {
    return NextResponse.json(
      { error: "Pabau API key not configured" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://api.oauth.pabau.com/${PABAU_API_KEY}/services`,
      { next: { revalidate: 300 } } // cache for 5 minutes
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `Pabau API returned ${res.status}` },
        { status: res.statusText === "Forbidden" ? 403 : 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch from Pabau" },
      { status: 502 }
    );
  }
}

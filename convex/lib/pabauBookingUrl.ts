// Convex-side twin of src/lib/pabauBookingUrl.ts (src/ and convex/ can't share
// a module). Pabau migrated this client's public booking slug from the
// onboarding placeholder `made-51g64` to `made-med-spa` (2026-04-27) but its
// `/services` API still emits per-service `booking_url` values on the dead
// slug, which 404 as "This account doesn't exist". We never trust the slug
// Pabau hands us — we keep only the deep-link params and re-home them onto the
// canonical base so synced rows self-heal. See docs/launch-tracker.md.

const FALLBACK_BASE = "https://partner.pabau.com/online-bookings/made-med-spa";

function canonicalBookingBase(): string {
  const configured = process.env.PABAU_BOOKING_BASE_URL?.trim();
  const base = configured || FALLBACK_BASE;
  try {
    const u = new URL(base);
    return `${u.origin}${u.pathname}`.replace(/\/$/, "");
  } catch {
    return base.replace(/\/$/, "");
  }
}

export function normalizePabauBookingUrl(
  rawUrl: string | undefined | null,
): string | null {
  if (!rawUrl || !rawUrl.trim()) return null;

  let u: URL;
  try {
    u = new URL(rawUrl.trim());
  } catch {
    return null;
  }

  // Leave non-Pabau links alone — only the Pabau slug is ours to correct.
  if (!/(^|\.)pabau\.com$/i.test(u.hostname)) return rawUrl.trim();

  const params = new URLSearchParams();
  const category = u.searchParams.get("category");
  const services = u.searchParams.get("services");
  if (category) params.set("category", category);
  if (services) params.set("services", services);

  const qs = params.toString();
  const base = canonicalBookingBase();
  return qs ? `${base}?${qs}` : base;
}

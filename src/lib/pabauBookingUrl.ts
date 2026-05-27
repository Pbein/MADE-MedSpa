// Pabau migrated this client's public booking slug from the onboarding
// placeholder `made-51g64` to `made-med-spa` (2026-04-27). Pabau's `/services`
// API still emits per-service `booking_url` values built on the dead slug,
// which render as "This account doesn't exist". We never trust the slug Pabau
// hands us — we keep only the `?category=&services=` deep-link params and
// re-home them onto our canonical booking base. See docs/launch-tracker.md.

const FALLBACK_BASE = "https://partner.pabau.com/online-bookings/made-med-spa";

// Origin + path of the canonical booking portal, with any query/hash stripped.
// Prefers the public env var (so a future slug change is a config edit, not a
// code edit) and falls back to the known-good literal.
export function canonicalBookingBase(): string {
  const configured = process.env.NEXT_PUBLIC_PABAU_BOOKING_URL?.trim();
  const base = configured || FALLBACK_BASE;
  try {
    const u = new URL(base);
    return `${u.origin}${u.pathname}`.replace(/\/$/, "");
  } catch {
    return base.replace(/\/$/, "");
  }
}

// Rewrites a Pabau booking URL onto the canonical slug, preserving its
// `?category=&services=` deep-link params so the visitor lands pre-scoped on
// the service they chose. Non-Pabau URLs (a custom admin-set link) are passed
// through untouched. Returns null when there's nothing usable (caller should
// then fall back to the generic booking entry point).
export function normalizePabauBookingUrl(
  rawUrl: string | undefined | null,
  base: string = canonicalBookingBase(),
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
  return qs ? `${base}?${qs}` : base;
}

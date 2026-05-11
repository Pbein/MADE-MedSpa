// Normalizes any href that points at the bare /booking page so it scrolls
// straight to the Pabau iframe. Admin-set CTA links often come back as plain
// "/booking" — without an anchor the booking page lands the user on the hero
// instead of the booking widget they just clicked toward.
//
// Also rewrites "/book" → "/booking#pabau-iframe" directly. next.config.ts
// has a /book → /booking redirect, but server redirects drop the fragment, so
// going through the redirect strands the user at the top of /booking.
export function normalizeBookingHref<T extends string | undefined | null>(
  href: T,
): T | string {
  if (!href) return href;
  const trimmed = href.trim();
  // Already targets a specific anchor — leave it alone.
  if (trimmed.includes("#")) return href;
  // Pathnames we treat as "the booking page" — both the canonical /booking
  // and the legacy /book shortcut (which has a 308 redirect to /booking).
  // Bypass the redirect entirely so we don't lose the hash fragment.
  const bookingPathRegex =
    /^(?:https?:\/\/[^/]+)?\/book(?:ing)?\/?(\?.*)?$/;
  if (!bookingPathRegex.test(trimmed)) return href;
  // Rewrite the path portion to canonical /booking and append the anchor.
  // Preserve any query string so admin-set tracking params still work.
  const match = trimmed.match(bookingPathRegex);
  const query = match?.[1] ?? "";
  return `/booking${query}#pabau-iframe`;
}

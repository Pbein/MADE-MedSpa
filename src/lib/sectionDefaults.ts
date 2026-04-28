// ── Section default colors ───────────────────────────────────────────────────
// Single source of truth for per-section default colors. Used in two places:
//   1. Page wrappers (e.g. src/app/page.tsx) — set CSS vars so descendants
//      inherit the right colors when admin hasn't customized.
//   2. Admin SectionDesignPanel — seed picker swatches with the SECTION's
//      true defaults so the swatch matches what the live site renders.
//
// If a section is not listed, it falls back to GLOBAL_DEFAULTS (light page).

export interface SectionDefaultColors {
  surface: string;     // background
  onSurface: string;   // headline / primary text
  secondary: string;   // body / accent text
}

const GLOBAL_DEFAULTS: SectionDefaultColors = {
  surface: "#F7F6EB",   // Silk
  onSurface: "#391E1E", // Espresso
  secondary: "#84262C", // Blush
};

// Hero on the home page: dark video bg, cream headlines, cream-dim body.
const HOME_HERO_DEFAULTS: SectionDefaultColors = {
  surface: "#391E1E",   // Espresso (matches the dark video tone)
  onSurface: "#F7F6EB", // Silk
  secondary: "#E8E0D5", // Glaze (cream-dim)
};

// Hero on the contact page: espresso bg, silk text. Mirrors ContactPageClient
// constants ESPRESSO/SILK/GLAZE.
const CONTACT_HERO_DEFAULTS: SectionDefaultColors = {
  surface: "#391E1E",
  onSurface: "#F7F6EB",
  secondary: "#E8E0D5",
};

// Hero on the booking page: espresso video bg with cream text, same as home.
const BOOKING_HERO_DEFAULTS: SectionDefaultColors = {
  surface: "#391E1E",
  onSurface: "#F7F6EB",
  secondary: "#E8E0D5",
};

const REGISTRY: Record<string, SectionDefaultColors> = {
  "home/hero": HOME_HERO_DEFAULTS,
  "contact/hero": CONTACT_HERO_DEFAULTS,
  "booking/hero": BOOKING_HERO_DEFAULTS,
};

export function getSectionDefaultColors(
  pageKey: string,
  sectionKey: string
): SectionDefaultColors {
  return REGISTRY[`${pageKey}/${sectionKey}`] ?? GLOBAL_DEFAULTS;
}

/**
 * Build CSS-variable inline styles for a section wrapper from its default
 * colors. These are merged BEFORE admin overrides so customizations still win.
 */
export function getSectionDefaultStyles(
  pageKey: string,
  sectionKey: string
): Record<string, string> {
  const defaults = getSectionDefaultColors(pageKey, sectionKey);
  if (defaults === GLOBAL_DEFAULTS) return {};
  return {
    "--color-surface": defaults.surface,
    "--color-on-surface": defaults.onSurface,
    "--color-on-surface-variant": `${defaults.secondary}99`, // ~60% alpha
  };
}

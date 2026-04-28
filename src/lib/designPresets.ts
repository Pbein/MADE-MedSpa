import type { CSSProperties } from "react";

// ── Design Presets ───────────────────────────────────────────────────────────
// Curated CSS style sets that admins can apply to individual sections.
// Each preset returns CSS properties applied to the section wrapper div.
// Palette derives from the MADE Branding spec sheet:
//   Silk #F7F6EB · Glaze #E8E0D5 · Blush #84262C · Merlot #571A1E
//   Espresso #391E1E · Matcha #838D60 · Olive #413E2A

export interface DesignPreset {
  key: string;
  name: string;
  description: string;
  /** Preview swatch color for the admin UI */
  swatch: string;
  /** CSS properties applied to the section wrapper */
  styles: CSSProperties;
  /** Whether this preset uses light text (for dark backgrounds) */
  lightText?: boolean;
}

// Brand color tokens (kept here as literal hex for preset swatches and
// gradient definitions — runtime UI should still prefer var() refs).
const SILK = "#F7F6EB";
const GLAZE = "#E8E0D5";
const BLUSH = "#84262C";
const MERLOT = "#571A1E";
const ESPRESSO = "#391E1E";
const MATCHA = "#838D60";
const OLIVE = "#413E2A";

export const DESIGN_PRESETS: DesignPreset[] = [
  {
    key: "default",
    name: "Default",
    description: "No custom styling — uses the page default",
    swatch: SILK,
    styles: {},
  },
  {
    key: "silk",
    name: "Silk",
    description: "Soft cream — primary page background",
    swatch: SILK,
    styles: { background: SILK },
  },
  {
    key: "glaze",
    name: "Glaze",
    description: "Warm beige — grounded section contrast",
    swatch: GLAZE,
    styles: { background: GLAZE },
  },
  {
    key: "espresso",
    name: "Espresso",
    description: "Deep brown — dark editorial section with cream text",
    swatch: ESPRESSO,
    lightText: true,
    styles: { background: ESPRESSO, color: SILK },
  },
  {
    key: "merlot",
    name: "Merlot",
    description: "Deep wine — luxe accent background with cream text",
    swatch: MERLOT,
    lightText: true,
    styles: { background: MERLOT, color: SILK },
  },
  {
    key: "blush",
    name: "Blush",
    description: "Brand red — bold accent background with cream text",
    swatch: BLUSH,
    lightText: true,
    styles: { background: BLUSH, color: SILK },
  },
  {
    key: "matcha",
    name: "Matcha",
    description: "Sage green — earthy accent with cream text",
    swatch: MATCHA,
    lightText: true,
    styles: { background: MATCHA, color: SILK },
  },
  {
    key: "olive",
    name: "Olive",
    description: "Deep olive — earthy dark with cream text",
    swatch: OLIVE,
    lightText: true,
    styles: { background: OLIVE, color: SILK },
  },
];

/** Get a preset by key */
export function getPreset(key: string): DesignPreset | undefined {
  return DESIGN_PRESETS.find((p) => p.key === key);
}

/** Get CSS properties for a preset key, returns empty object for unknown keys */
export function getPresetStyles(key: string | undefined): CSSProperties {
  if (!key || key === "default") return {};
  return getPreset(key)?.styles || {};
}

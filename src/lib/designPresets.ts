import type { CSSProperties } from "react";

// ── Design Presets ───────────────────────────────────────────────────────────
// Curated CSS style sets that admins can apply to individual sections.
// Each preset returns CSS properties applied to the section wrapper div.

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

export const DESIGN_PRESETS: DesignPreset[] = [
  {
    key: "default",
    name: "Default",
    description: "No custom styling — uses the page default",
    swatch: "#f6f1ea",
    styles: {},
  },
  {
    key: "warm-silk",
    name: "Warm Silk",
    description: "Soft silk-to-powder gradient with gentle warmth",
    swatch: "#f6f1ea",
    styles: {
      background: "linear-gradient(180deg, #f6f1ea 0%, #efe7df 50%, #f6f1ea 100%)",
    },
  },
  {
    key: "editorial-wash",
    name: "Editorial Wash",
    description: "Subtle center glow with warm vignette — editorial feel",
    swatch: "#efe7df",
    styles: {
      background: "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.35) 0%, transparent 50%), linear-gradient(180deg, #efe7df 0%, #e8ddd5 50%, #efe7df 100%)",
    },
  },
  {
    key: "espresso-dark",
    name: "Espresso Dark",
    description: "Rich dark espresso background with light text",
    swatch: "#391e1e",
    lightText: true,
    styles: {
      background: "linear-gradient(180deg, #391e1e 0%, #2d1515 50%, #391e1e 100%)",
      color: "#f6f1ea",
    },
  },
  {
    key: "blush-accent",
    name: "Blush Accent",
    description: "Soft rose-dust tinted surface — feminine warmth",
    swatch: "#d8c0bb",
    styles: {
      background: "linear-gradient(180deg, #f2e8e5 0%, #ecddd8 50%, #f2e8e5 100%)",
    },
  },
  {
    key: "glaze-neutral",
    name: "Glaze Neutral",
    description: "Warm glaze background — grounded and calm",
    swatch: "#e8e0d5",
    styles: {
      background: "linear-gradient(180deg, #ede5da 0%, #e8e0d5 50%, #ede5da 100%)",
    },
  },
  {
    key: "powder-soft",
    name: "Powder Soft",
    description: "Light powder tone — airy and minimal",
    swatch: "#efe7df",
    styles: {
      background: "#efe7df",
    },
  },
  {
    key: "cream-glow",
    name: "Cream Glow",
    description: "Warm cream with a soft center highlight",
    swatch: "#f8f3ed",
    styles: {
      background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 45%), #f3ece4",
    },
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

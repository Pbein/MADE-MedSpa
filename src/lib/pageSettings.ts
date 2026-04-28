import { CSSProperties } from "react";
import { getSectionDefaultStyles } from "./sectionDefaults";

/**
 * Server-side helper: converts page settings metadata into CSS variable
 * overrides that can be spread onto a wrapper div's style prop.
 */
export function buildStyleOverrides(
  metadata: Record<string, unknown> | null | undefined
): CSSProperties {
  if (!metadata) return {};
  const colors = (metadata as { colors?: Record<string, string> }).colors;
  if (!colors) return {};

  const map: Record<string, string> = {
    primary: "--color-primary",
    secondary: "--color-secondary",
    surface: "--color-surface",
    surfaceLow: "--color-surface-low",
    onSurface: "--color-on-surface",
    onSurfaceVariant: "--color-on-surface-variant",
    outline: "--color-outline",
  };

  const style: Record<string, string> = {};
  for (const [key, cssVar] of Object.entries(map)) {
    if (colors[key]) style[cssVar] = colors[key];
  }
  return style as CSSProperties;
}

/**
 * Server-side helper: check if a section is visible in page settings.
 */
export function isSectionVisible(
  metadata: Record<string, unknown> | null | undefined,
  sectionKey: string
): boolean {
  if (!metadata) return true;
  const sections = (metadata as { sections?: Record<string, boolean> }).sections;
  if (!sections) return true;
  return sections[sectionKey] !== false;
}

/**
 * Server-side helper: get hero text overrides.
 */
export function getHeroOverrides(
  metadata: Record<string, unknown> | null | undefined
): { headline?: string; subtitle?: string; ctaText?: string; ctaLink?: string } {
  if (!metadata) return {};
  return (metadata as { hero?: Record<string, string> }).hero || {};
}

/**
 * Server-side helper: merge section content from a pre-fetched siteContent
 * record with default values. Used in server components where hooks can't run.
 * Accepts any record shape from getByKey or getByKeys queries.
 */
export function getSectionContent<T extends Record<string, unknown>>(
  contentRecord: Record<string, unknown> | null | undefined,
  defaults: T
): T {
  if (!contentRecord) return defaults;
  const metadata = (contentRecord as { metadata?: unknown }).metadata;
  if (!metadata || typeof metadata !== "object") return defaults;
  return { ...defaults, ...(metadata as Partial<T>) };
}

/**
 * Server-side helper: get per-section color overrides from page settings.
 * Returns CSS variable overrides for a specific section.
 */
export function getSectionColorOverrides(
  pageSettingsMetadata: Record<string, unknown> | null | undefined,
  sectionKey: string
): import("react").CSSProperties {
  if (!pageSettingsMetadata) return {};
  const sections = (pageSettingsMetadata as {
    sections?: Record<string, boolean | { visible?: boolean; colors?: Record<string, string> }>;
  }).sections;
  if (!sections) return {};

  const sectionConfig = sections[sectionKey];
  if (!sectionConfig || typeof sectionConfig === "boolean") return {};
  if (!sectionConfig.colors) return {};

  return buildStyleOverrides({ colors: sectionConfig.colors });
}

/**
 * Server-side helper: get full section design (defaults + preset + colors + bg image).
 *
 * Layered, last-write-wins:
 *   1. Section defaults from sectionDefaults registry (e.g. home/hero defaults
 *      to espresso bg + cream text — without this the picker would lie about
 *      the section's actual rendered defaults).
 *   2. Preset styles (single brand colors).
 *   3. Per-color admin overrides.
 *   4. Background image.
 *
 * pageKey is required so the registry lookup can find section-specific
 * defaults (e.g. "home", "contact", "booking").
 */
export function getSectionDesignServer(
  pageSettingsMetadata: Record<string, unknown> | null | undefined,
  sectionKey: string,
  pageKey?: string
): import("react").CSSProperties {
  const result: Record<string, string> = {};

  // 1. Section defaults — always applied so the rendered defaults match the
  //    admin picker's swatches, even if no admin customization exists yet.
  if (pageKey) {
    Object.assign(result, getSectionDefaultStyles(pageKey, sectionKey));
  }

  if (!pageSettingsMetadata) return result as import("react").CSSProperties;
  const sections = (pageSettingsMetadata as {
    sections?: Record<string, boolean | {
      visible?: boolean;
      colors?: Record<string, string>;
      designStyle?: string;
      backgroundImage?: string;
    }>;
  }).sections;
  if (!sections) return result as import("react").CSSProperties;

  const config = sections[sectionKey];
  if (!config || typeof config === "boolean") return result as import("react").CSSProperties;

  // 2. Preset (brand-palette single colors).
  if (config.designStyle && config.designStyle !== "default") {
    const presetMap: Record<string, Record<string, string>> = {
      silk:     { background: "#F7F6EB" },
      glaze:    { background: "#E8E0D5" },
      espresso: { background: "#391E1E", color: "#F7F6EB" },
      merlot:   { background: "#571A1E", color: "#F7F6EB" },
      blush:    { background: "#84262C", color: "#F7F6EB" },
      matcha:   { background: "#838D60", color: "#F7F6EB" },
      olive:    { background: "#413E2A", color: "#F7F6EB" },
    };
    const preset = presetMap[config.designStyle];
    if (preset) Object.assign(result, preset);
  }

  // 3. Per-color overrides.
  if (config.colors) {
    if (config.colors.surface) result["--color-surface"] = config.colors.surface;
    if (config.colors.onSurface) {
      result["--color-on-surface"] = config.colors.onSurface;
      result["--color-primary"] = config.colors.onSurface;
      result.color = config.colors.onSurface;
    }
    if (config.colors.secondary) result["--color-secondary"] = config.colors.secondary;
    if (config.colors.buttonBg) result["--btn-bg"] = config.colors.buttonBg;
    if (config.colors.buttonText) result["--btn-text"] = config.colors.buttonText;
    if (config.colors.divider) result["--divider-color"] = config.colors.divider;
  }

  // 4. Background image.
  if (config.backgroundImage) {
    result.backgroundImage = `url('${config.backgroundImage}')`;
    result.backgroundSize = "cover";
    result.backgroundPosition = "center";
    result.backgroundRepeat = "no-repeat";
  }

  return result as import("react").CSSProperties;
}

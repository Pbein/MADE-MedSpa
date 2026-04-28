import { CSSProperties } from "react";

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
 * Server-side helper: get full section design (preset + colors + bg image).
 * Returns CSSProperties to spread onto a section wrapper div.
 */
export function getSectionDesignServer(
  pageSettingsMetadata: Record<string, unknown> | null | undefined,
  sectionKey: string
): import("react").CSSProperties {
  if (!pageSettingsMetadata) return {};
  const sections = (pageSettingsMetadata as {
    sections?: Record<string, boolean | {
      visible?: boolean;
      colors?: Record<string, string>;
      designStyle?: string;
      backgroundImage?: string;
    }>;
  }).sections;
  if (!sections) return {};

  const config = sections[sectionKey];
  if (!config || typeof config === "boolean") return {};

  const result: Record<string, string> = {};

  // Apply preset
  if (config.designStyle && config.designStyle !== "default") {
    try {
      // Dynamic import would be ideal but we're in a sync function
      // Import the preset styles inline
      const presetMap: Record<string, Record<string, string>> = {
        "warm-silk": { background: "linear-gradient(180deg, #f6f1ea 0%, #efe7df 50%, #f6f1ea 100%)" },
        "editorial-wash": { background: "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.35) 0%, transparent 50%), linear-gradient(180deg, #efe7df 0%, #e8ddd5 50%, #efe7df 100%)" },
        "espresso-dark": { background: "linear-gradient(180deg, #391e1e 0%, #2d1515 50%, #391e1e 100%)", color: "#f6f1ea" },
        "blush-accent": { background: "linear-gradient(180deg, #f2e8e5 0%, #ecddd8 50%, #f2e8e5 100%)" },
        "glaze-neutral": { background: "linear-gradient(180deg, #ede5da 0%, #e8e0d5 50%, #ede5da 100%)" },
        "powder-soft": { background: "#efe7df" },
        "cream-glow": { background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 45%), #f3ece4" },
      };
      const preset = presetMap[config.designStyle];
      if (preset) Object.assign(result, preset);
    } catch { /* ignore */ }
  }

  // Apply custom colors
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

  // Apply background image
  if (config.backgroundImage) {
    result.backgroundImage = `url('${config.backgroundImage}')`;
    result.backgroundSize = "cover";
    result.backgroundPosition = "center";
    result.backgroundRepeat = "no-repeat";
  }

  return result as import("react").CSSProperties;
}

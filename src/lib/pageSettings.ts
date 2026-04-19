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

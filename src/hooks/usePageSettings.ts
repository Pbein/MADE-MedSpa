"use client";

import { useQuery } from "convex/react";
import { useSearchParams } from "next/navigation";
import { api } from "../../convex/_generated/api";
import { CSSProperties, useMemo } from "react";
import { getPresetStyles } from "@/lib/designPresets";

// ── Types ────────────────────────────────────────────────────────────────────

export interface PageColors {
  primary?: string;
  secondary?: string;
  surface?: string;
  surfaceLow?: string;
  onSurface?: string;
  onSurfaceVariant?: string;
  outline?: string;
}

export interface PageHeroOverrides {
  headline?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface PageSections {
  [sectionKey: string]: boolean;
}

export interface PageSettings {
  colors: PageColors;
  hero: PageHeroOverrides;
  sections: PageSections;
}

export interface ResolvedPageSettings {
  /** CSS variable overrides to spread onto a wrapper element's style */
  styleOverrides: CSSProperties;
  /** Check if a section should be visible (defaults to true if not set) */
  isSectionVisible: (sectionKey: string) => boolean;
  /** Get CSS styles for a specific section (preset + custom colors + bg image) */
  getSectionDesign: (sectionKey: string) => CSSProperties;
  /** Hero text overrides (undefined = use default) */
  hero: PageHeroOverrides;
  /** Raw settings from DB (null if not yet loaded) */
  raw: PageSettings | null;
  /** Whether settings are still loading */
  isLoading: boolean;
  /** Whether this is an unsaved preview from the admin */
  isPreview: boolean;
}

// ── Page definitions ─────────────────────────────────────────────────────────
// Each page's available sections for the admin UI

export const PAGE_DEFINITIONS: Record<
  string,
  { label: string; path: string; sections: { key: string; label: string }[] }
> = {
  home: {
    label: "Homepage",
    path: "/",
    sections: [
      { key: "hero", label: "Hero (Video/Image)" },
      { key: "featured", label: "Featured Services" },
      { key: "about", label: "About Teaser" },
      { key: "testimonials", label: "Testimonials" },
      { key: "cta", label: "CTA Banner" },
    ],
  },
  about: {
    label: "About",
    path: "/about",
    sections: [
      { key: "hero", label: "Hero" },
      { key: "story", label: "Our Story" },
      { key: "mission", label: "Mission" },
      { key: "values", label: "Values" },
      { key: "team", label: "Team Members" },
      { key: "cta", label: "CTA Banner" },
    ],
  },
  services: {
    label: "Services",
    path: "/services",
    sections: [
      { key: "hero", label: "Hero" },
      { key: "filters", label: "Category Filters" },
      { key: "grid", label: "Services Grid" },
      { key: "cta", label: "CTA Banner" },
    ],
  },
  membership: {
    label: "Membership",
    path: "/membership",
    sections: [
      { key: "hero", label: "Hero" },
      { key: "tiers", label: "Membership Tiers" },
      { key: "cta", label: "CTA Banner" },
    ],
  },
  shop: {
    label: "Shop",
    path: "/shop",
    sections: [
      { key: "hero", label: "Hero" },
      { key: "filters", label: "Category Filters" },
      { key: "grid", label: "Products Grid" },
      { key: "cta", label: "CTA Banner" },
    ],
  },
  contact: {
    label: "Contact",
    path: "/contact",
    sections: [
      { key: "hero", label: "Hero" },
      { key: "form", label: "Contact Form" },
      { key: "info", label: "Business Info" },
    ],
  },
  faq: {
    label: "FAQ",
    path: "/faq",
    sections: [
      { key: "hero", label: "Hero" },
      { key: "filters", label: "Category Filters" },
      { key: "accordion", label: "FAQ Accordion" },
      { key: "cta", label: "CTA Banner" },
    ],
  },
  booking: {
    label: "Booking",
    path: "/booking",
    sections: [
      { key: "hero", label: "Hero" },
      { key: "expect", label: "What to Expect" },
      { key: "prep", label: "Preparation Tips" },
      { key: "policy", label: "Cancellation Policy" },
      { key: "cta", label: "CTA Banner" },
    ],
  },
};

// ── Hook ─────────────────────────────────────────────────────────────────────

function buildOverrides(colors: PageColors | undefined): CSSProperties {
  if (!colors) return {};
  const style: Record<string, string> = {};
  const map: Record<string, string> = {
    primary: "--color-primary",
    secondary: "--color-secondary",
    surface: "--color-surface",
    surfaceLow: "--color-surface-low",
    onSurface: "--color-on-surface",
    onSurfaceVariant: "--color-on-surface-variant",
    outline: "--color-outline",
  };
  for (const [key, cssVar] of Object.entries(map)) {
    const val = colors[key as keyof PageColors];
    if (val) style[cssVar] = val;
  }
  return style as CSSProperties;
}

export function usePageSettings(pageKey: string): ResolvedPageSettings {
  const content = useQuery(api.siteContent.getByKey, {
    key: `page_settings_${pageKey}`,
  });
  const searchParams = useSearchParams();

  return useMemo(() => {
    // Check for preview params (unsaved draft from admin)
    const previewParam = searchParams.get("_preview");
    let previewSettings: PageSettings | null = null;
    if (previewParam) {
      try {
        previewSettings = JSON.parse(decodeURIComponent(previewParam));
      } catch {
        // Invalid preview param, ignore
      }
    }

    const isPreview = previewSettings !== null;
    const isLoading = !isPreview && content === undefined;
    const settings = previewSettings || (content?.metadata as PageSettings) || null;

    // Helper to parse section config (handles both boolean and object formats)
    const getSectionConfig = (sectionKey: string) => {
      if (!settings?.sections) return null;
      const val = settings.sections[sectionKey];
      if (typeof val === "boolean") return { visible: val };
      if (typeof val === "object" && val !== null) return val as Record<string, unknown>;
      return null;
    };

    return {
      styleOverrides: buildOverrides(settings?.colors),
      isSectionVisible: (sectionKey: string) => {
        const config = getSectionConfig(sectionKey);
        if (!config) return true;
        return config.visible !== false;
      },
      getSectionDesign: (sectionKey: string) => {
        const config = getSectionConfig(sectionKey);
        if (!config) return {};

        const result: CSSProperties = {};

        // Apply preset styles first
        const presetStyles = getPresetStyles(config.designStyle as string | undefined);
        Object.assign(result, presetStyles);

        // Apply custom colors (override preset)
        const colors = config.colors as Record<string, string> | undefined;
        if (colors?.surface) (result as Record<string, string>)["--color-surface"] = colors.surface;
        if (colors?.onSurface) {
          (result as Record<string, string>)["--color-on-surface"] = colors.onSurface;
          (result as Record<string, string>)["--color-primary"] = colors.onSurface;
          result.color = colors.onSurface;
        }
        if (colors?.secondary) (result as Record<string, string>)["--color-secondary"] = colors.secondary;
        if (colors?.buttonBg) (result as Record<string, string>)["--btn-bg"] = colors.buttonBg;
        if (colors?.buttonText) (result as Record<string, string>)["--btn-text"] = colors.buttonText;
        if (colors?.divider) (result as Record<string, string>)["--divider-color"] = colors.divider;

        // Apply background image (on top of preset/color bg)
        const bgImage = config.backgroundImage as string | undefined;
        if (bgImage) {
          result.backgroundImage = `url('${bgImage}')`;
          result.backgroundSize = "cover";
          result.backgroundPosition = "center";
          result.backgroundRepeat = "no-repeat";
        }

        return result;
      },
      hero: settings?.hero || {},
      raw: settings,
      isLoading,
      isPreview,
    };
  }, [content, searchParams]);
}

"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { CSSProperties, useMemo } from "react";

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
  /** Hero text overrides (undefined = use default) */
  hero: PageHeroOverrides;
  /** Raw settings from DB (null if not yet loaded) */
  raw: PageSettings | null;
  /** Whether settings are still loading */
  isLoading: boolean;
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

export function usePageSettings(pageKey: string): ResolvedPageSettings {
  const content = useQuery(api.siteContent.getByKey, {
    key: `page_settings_${pageKey}`,
  });

  return useMemo(() => {
    const isLoading = content === undefined;
    const settings = (content?.metadata as PageSettings) || null;

    // Build CSS variable overrides from color settings
    const styleOverrides: CSSProperties = {};
    if (settings?.colors) {
      const c = settings.colors;
      if (c.primary) (styleOverrides as Record<string, string>)["--color-primary"] = c.primary;
      if (c.secondary) (styleOverrides as Record<string, string>)["--color-secondary"] = c.secondary;
      if (c.surface) (styleOverrides as Record<string, string>)["--color-surface"] = c.surface;
      if (c.surfaceLow) (styleOverrides as Record<string, string>)["--color-surface-low"] = c.surfaceLow;
      if (c.onSurface) (styleOverrides as Record<string, string>)["--color-on-surface"] = c.onSurface;
      if (c.onSurfaceVariant) (styleOverrides as Record<string, string>)["--color-on-surface-variant"] = c.onSurfaceVariant;
      if (c.outline) (styleOverrides as Record<string, string>)["--color-outline"] = c.outline;
    }

    return {
      styleOverrides,
      isSectionVisible: (sectionKey: string) => {
        if (!settings?.sections) return true;
        return settings.sections[sectionKey] !== false;
      },
      hero: settings?.hero || {},
      raw: settings,
      isLoading,
    };
  }, [content]);
}

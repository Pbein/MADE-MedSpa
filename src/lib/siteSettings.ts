import { fetchQuery } from "convex/nextjs";
import type { Metadata } from "next";
import { api } from "../../convex/_generated/api";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface BusinessInfo {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  hoursWeekday: string;
  hoursSaturday: string;
  hoursSunday: string;
  priceRange: string;
}

export interface SocialLinks {
  instagram: string;
  tiktok: string;
  facebook: string;
  youtube: string;
}

export interface OgImage {
  url: string;
}

export interface SiteSettings {
  business: BusinessInfo;
  social: SocialLinks;
  ogDefault: OgImage;
}

// ─── Hardcoded fallbacks (match the client launch doc) ─────────────────────

export const DEFAULT_BUSINESS: BusinessInfo = {
  name: "MADE Med Spa",
  tagline: "Luxury Regenerative Aesthetics in McLean, VA",
  email: "info@mademedspa.com",
  phone: "",
  streetAddress: "1311-A Dolley Madison Blvd, Suite 1B",
  city: "McLean",
  state: "VA",
  postalCode: "22101",
  hoursWeekday: "Mon–Fri: 10:00 AM – 6:00 PM",
  hoursSaturday: "Sat: 10:00 AM – 3:00 PM",
  hoursSunday: "Closed",
  priceRange: "$$-$$$",
};

export const DEFAULT_SOCIAL: SocialLinks = {
  instagram: "",
  tiktok: "",
  facebook: "",
  youtube: "",
};

export const DEFAULT_OG: OgImage = {
  url: "/og-image.png",
};

// ─── Site-wide settings keys in siteContent ────────────────────────────────

export const SETTINGS_KEYS = {
  business: "site_settings_business",
  social: "site_settings_social",
  og: "site_settings_og_default",
} as const;

// ─── Per-page SEO key (extended metadata includes optional og_image_url) ──

export function seoKey(pageKey: string): string {
  return `seo_${pageKey}`;
}

export interface PageSeoMetadata {
  title?: string;
  description?: string;
  keywords?: string;
  og_image_url?: string;
}

// ─── Server-side readers ────────────────────────────────────────────────────

function merge<T extends object>(defaults: T, override: unknown): T {
  if (!override || typeof override !== "object") return defaults;
  const out = { ...defaults } as T;
  for (const [k, v] of Object.entries(override as Record<string, unknown>)) {
    if (v === undefined || v === null) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    (out as Record<string, unknown>)[k] = v;
  }
  return out;
}

/**
 * Fetches all site-wide settings in a single roundtrip, with fallbacks.
 * Safe to call from server components / generateMetadata / route handlers.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const keys = [SETTINGS_KEYS.business, SETTINGS_KEYS.social, SETTINGS_KEYS.og];
    const results = await fetchQuery(api.siteContent.getByKeys, { keys });

    const businessDoc = results[SETTINGS_KEYS.business];
    const socialDoc = results[SETTINGS_KEYS.social];
    const ogDoc = results[SETTINGS_KEYS.og];

    return {
      business: merge(DEFAULT_BUSINESS, (businessDoc as { metadata?: unknown })?.metadata),
      social: merge(DEFAULT_SOCIAL, (socialDoc as { metadata?: unknown })?.metadata),
      ogDefault: merge(DEFAULT_OG, (ogDoc as { metadata?: unknown })?.metadata),
    };
  } catch {
    return {
      business: DEFAULT_BUSINESS,
      social: DEFAULT_SOCIAL,
      ogDefault: DEFAULT_OG,
    };
  }
}

/**
 * Resolves the OG image URL for a given page.
 * Priority: per-page override → site default → hardcoded fallback.
 */
export async function getPageOgImage(pageKey: string): Promise<string> {
  try {
    const [pageSeo, settings] = await Promise.all([
      fetchQuery(api.siteContent.getByKey, { key: seoKey(pageKey) }),
      getSiteSettings(),
    ]);

    const pageOverride = (pageSeo as { metadata?: PageSeoMetadata } | null)?.metadata?.og_image_url;
    if (pageOverride && pageOverride.trim()) return pageOverride;
    return settings.ogDefault.url;
  } catch {
    return DEFAULT_OG.url;
  }
}

/**
 * Convenience: fetch the per-page SEO record (title / description / keywords / og override).
 */
export async function getPageSeo(pageKey: string): Promise<PageSeoMetadata> {
  try {
    const doc = await fetchQuery(api.siteContent.getByKey, { key: seoKey(pageKey) });
    return ((doc as { metadata?: PageSeoMetadata } | null)?.metadata ?? {}) as PageSeoMetadata;
  } catch {
    return {};
  }
}

// ─── Per-page metadata builder (for use in layout.tsx generateMetadata) ────

export interface PageMetadataOptions {
  pageKey: string;
  defaultTitle: string;
  defaultDescription: string;
  path: string;
  defaultKeywords?: string[];
}

/**
 * Builds a Next.js Metadata object for a single page, merging:
 *   - per-page SEO record (title / description / keywords / og image override)
 *   - site-wide default OG image
 *   - hardcoded fallbacks passed in
 */
export async function getPageMetadata(opts: PageMetadataOptions): Promise<Metadata> {
  const [pageSeo, settings] = await Promise.all([
    getPageSeo(opts.pageKey),
    getSiteSettings(),
  ]);

  const title = pageSeo.title?.trim() || opts.defaultTitle;
  const description = pageSeo.description?.trim() || opts.defaultDescription;
  const keywords = pageSeo.keywords?.trim()
    ? pageSeo.keywords.split(",").map((k) => k.trim()).filter(Boolean)
    : opts.defaultKeywords;
  const ogUrl = pageSeo.og_image_url?.trim() || settings.ogDefault.url;
  const canonical = `https://mademedspa.com${opts.path}`;

  return {
    title,
    description,
    ...(keywords && keywords.length > 0 ? { keywords } : {}),
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl],
    },
  };
}

// ─── Address formatting helper ──────────────────────────────────────────────

export function formatFullAddress(b: BusinessInfo): string {
  return `${b.streetAddress}, ${b.city}, ${b.state} ${b.postalCode}`;
}

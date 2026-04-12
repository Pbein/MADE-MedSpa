# MADE Med Spa — Performance & SEO Analysis

**Date:** April 12, 2026  
**Site:** MADE Med Spa (Next.js 16 + Convex + Clerk + Framer Motion)  
**Purpose:** Identify every optimization opportunity for page speed, Core Web Vitals, and SEO — without changing any code yet.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Image & Media Audit](#2-image--media-audit)
3. [Rendering & Data Fetching](#3-rendering--data-fetching)
4. [JavaScript Bundle Analysis](#4-javascript-bundle-analysis)
5. [Core Web Vitals Breakdown](#5-core-web-vitals-breakdown)
6. [SEO Content & Metadata Audit](#6-seo-content--metadata-audit)
7. [Structured Data / Schema Markup](#7-structured-data--schema-markup)
8. [AI & Modern SEO Opportunities](#8-ai--modern-seo-opportunities)
9. [Marketing SEO & Local Search](#9-marketing-seo--local-search)
10. [Prioritized Action Plan](#10-prioritized-action-plan)

---

## 1. Executive Summary

The site is beautifully designed with a strong editorial aesthetic, but performance is bottlenecked by three main issues:

1. **Unoptimized images** — 20+ MB of PNGs served at full resolution with no format conversion, lazy loading, or responsive sizing.
2. **Client-heavy rendering** — Most pages use `"use client"` with blocking Convex queries, meaning users see nothing until JavaScript loads, executes, connects to Convex, and fetches data.
3. **Blocking provider chain** — Clerk auth SDK (~65KB) must load before Convex SDK (~35KB) can initialize, creating a synchronous waterfall before any content renders.

**Estimated current performance (mobile 3G):**
- First Contentful Paint: ~3-4s
- Largest Contentful Paint: ~5-7s (hero image/video)
- Total page weight: ~2-4MB per page (images + JS)

**Estimated performance after optimization:**
- First Contentful Paint: <1s
- Largest Contentful Paint: <2.5s
- Total page weight: ~400-800KB per page

---

## 2. Image & Media Audit

### 2a. Static Images in `/public/` (served to every visitor)

| File | Size | Used On | Problem |
|------|------|---------|---------|
| `testimonial-bg.png` | **6.0 MB** | Home (testimonials section) | Enormous — should be ~100KB as WebP |
| `contact-hero-bg.png` | **3.0 MB** | Contact page hero | Should be ~80KB as WebP |
| `values-bg.png` | **1.7 MB** | About + Booking pages | Should be ~60KB as WebP |
| `hero-poster.png` | **990 KB** | Home hero (video fallback) | Should be ~80KB as WebP |
| `booking-hero-poster.png` | **489 KB** | Booking hero | Should be ~50KB as WebP |
| `editorial-break-bg.png` | **298 KB** | Home editorial section | Acceptable but could be ~40KB |
| **Total static images** | **~12.5 MB** | | **Could be ~400KB total** |

### 2b. Video Files

| File | Size | Used On | Problem |
|------|------|---------|---------|
| `faq-hero.mp4` | **4.6 MB** | Booking page background | No compression, no WebM alternative |
| `hero.mp4` | **3.4 MB** | Home hero background | No compression, no WebM alternative |
| **Total video** | **8.0 MB** | | **Could be ~2-3MB with H.265/VP9** |

### 2c. How Images Are Currently Served

- **Zero use of `next/image`** — Every image is a raw `<img>` tag
- **No format conversion** — All PNGs, no WebP or AVIF
- **No responsive sizes** — Same 3000px image served to a 375px mobile screen
- **No lazy loading** — All images load immediately, even below the fold
- **No srcset** — No responsive image breakpoints
- **No blur placeholders** — Content shifts when images pop in

### 2d. Convex-Stored Images

Images uploaded through admin are stored in Convex cloud storage as full-resolution files. The upload flow:
1. Admin uploads image → sent to Convex storage at original size
2. URL stored as string in `siteContent` table
3. Client fetches URL via `useQuery` → renders in raw `<img>` tag

**Problems:**
- No server-side image processing or CDN optimization
- Each image requires a separate Convex query (e.g., `featured_service_image_1`, `_2`, `_3` = 3 separate round-trips)
- Images don't benefit from Next.js image optimization pipeline

### 2e. What We Should Do

| Change | Impact | Effort |
|--------|--------|--------|
| Convert all PNGs to WebP/AVIF | **~90% file size reduction** | Low |
| Replace `<img>` with `next/image` | Auto-optimization, lazy load, srcset, blur placeholder | Medium |
| Compress videos with FFmpeg (H.265 + WebM) | ~50-60% reduction | Low |
| Add `loading="lazy"` to below-fold images | Faster initial load | Low |
| Batch Convex image queries into single fetch | Fewer round-trips | Medium |
| Serve video only on desktop, poster on mobile | Huge mobile savings | Low |

---

## 3. Rendering & Data Fetching

### 3a. The Core Problem: Everything Is Client-Rendered

Almost every page has `"use client"` at the top, meaning:
- The browser downloads the JS bundle
- React hydrates the entire component tree
- Convex queries fire *after* hydration
- User sees blank/skeleton until data returns

**Current rendering by page:**

| Page | Rendering | Convex Queries on Load | Could Be Server? |
|------|-----------|----------------------|-------------------|
| `/` (Home) | Client | 6+ queries (hero, services, images, testimonials) | Yes |
| `/about` | Hybrid | 1 server + 6 client queries | Mostly yes |
| `/services` | Hybrid | 1 server + services list client | Mostly yes |
| `/services/[slug]` | Hybrid | 1 server + detail client | Yes |
| `/faq` | Client | FAQ list (no pagination) | Yes |
| `/booking` | Client | 0 queries (all static content!) | Entirely yes |
| `/contact` | Client | Business info + hero | Yes |

### 3b. The Blocking Provider Chain

```
User requests page
  → Server sends HTML shell + JS bundle
    → Browser parses JS
      → ClerkProvider initializes (~65KB SDK)
        → Clerk auth resolves
          → ConvexClientProvider initializes (~35KB SDK)
            → Convex connection established
              → useQuery() calls fire
                → Data returns
                  → Components finally render with content
```

This chain means **nothing renders until ~100KB of auth + database SDKs load and initialize**. On mobile 3G, that's 2-3 seconds of blank screen.

### 3c. What We Should Do

| Change | Impact | Effort |
|--------|--------|--------|
| Convert static pages to Server Components | Content in initial HTML, no JS needed | Medium |
| Use `fetchQuery()` server-side instead of `useQuery()` client-side | Data embedded in HTML response | Medium |
| Add `<Suspense>` boundaries around providers | Progressive rendering | Low |
| Add `loading.tsx` files per route | Instant loading state | Low |
| Pre-render `/booking` as fully static (no Convex needed) | Instant load | Low |
| Pre-render `/faq` with ISR (revalidate every hour) | Near-instant load | Medium |
| Add `generateStaticParams()` for service pages | Static generation at build | Medium |

---

## 4. JavaScript Bundle Analysis

### 4a. Client-Side Bundle Composition (estimated)

| Library | Size (gzipped) | Used For | Avoidable? |
|---------|---------------|----------|------------|
| React + React-DOM | ~30KB | Core framework | No |
| Framer Motion | ~42KB | Scroll animations, page transitions | Mostly yes |
| Clerk Auth | ~65KB | Login (only used by admin) | Partially |
| Convex Client | ~35KB | Database queries | Partially |
| App code | ~20KB | Components, styles | No |
| **Total** | **~192KB gzipped** | | |

### 4b. Framer Motion Analysis

Framer Motion is imported in **19 files** across the codebase. However, ~80% of animations are simple fade-up-on-scroll effects that CSS can handle natively:

```css
/* This replaces most Framer Motion usage */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-on-scroll {
  animation: fade-up 0.6s ease-out both;
}
```

Combined with `IntersectionObserver` for scroll triggers, this eliminates ~42KB from the bundle.

**Keep Framer Motion only for:**
- Mobile menu AnimatePresence (open/close)
- Complex stagger sequences (if any)

### 4c. Clerk Auth on Public Pages

Clerk adds ~65KB to every page, but authentication is only needed for `/admin/*` routes. Public visitors never log in.

**Fix:** Lazy-load Clerk only on admin routes using `next/dynamic`.

### 4d. What We Should Do

| Change | Impact | Effort |
|--------|--------|--------|
| Replace Framer Motion with CSS animations + IntersectionObserver | **-42KB** from bundle | Medium-High |
| Lazy-load Clerk on admin routes only | **-65KB** on public pages | Medium |
| Move Convex queries server-side (reduces client SDK need) | **-20KB** potential | Medium |
| Add route-based code splitting with `next/dynamic` | Smaller per-page bundles | Low |
| **Total potential savings** | **~127KB (66% reduction)** | |

---

## 5. Core Web Vitals Breakdown

### 5a. LCP (Largest Contentful Paint) — Currently Poor

The LCP element on most pages is the hero background image or video.

**Current waterfall:**
```
0ms    — HTML arrives
200ms  — JS bundle starts downloading
800ms  — JS parsed, React hydration begins
1200ms — Clerk SDK initializes
1600ms — Convex connects
1800ms — useQuery fires for hero image
2200ms — Convex returns hero URL
2400ms — Browser starts downloading 990KB hero-poster.png
3400ms — Image renders (LCP) ← TOO LATE
```

**Optimized waterfall:**
```
0ms    — HTML arrives with hero image URL embedded (server-rendered)
50ms   — Browser sees <img> tag, starts prefetching hero image
200ms  — 80KB WebP hero image arrives
300ms  — Image renders (LCP) ← FAST
```

### 5b. CLS (Cumulative Layout Shift) — Likely OK

- Images use aspect-ratio classes (good)
- Fonts use `display: "swap"` (minor shift acceptable)
- No major layout shift triggers found

**Risk areas:**
- Images without explicit width/height could shift on load
- Newsletter form state changes (focus/unfocus)

### 5c. INP (Interaction to Next Paint) — Moderate Risk

- Framer Motion animations on every interaction add JS processing
- Multiple useQuery hooks re-render components when data arrives
- Mobile menu uses AnimatePresence (heavier than CSS)

### 5d. TTFB (Time to First Byte)

- Server components would improve TTFB by eliminating client-side data fetching
- Currently, server sends a mostly-empty HTML shell, then client does all the work

---

## 6. SEO Content & Metadata Audit

### 6a. Page-Level Metadata

| Page | Title | Description | Canonical | OpenGraph | Score |
|------|-------|-------------|-----------|-----------|-------|
| `/` (Home) | Yes (template) | Yes (155 chars) | Yes | Yes | 10/10 |
| `/about` | Yes | Yes (73 chars) | No | No | 5/10 |
| `/services` | Yes | Yes (114 chars) | No | No | 5/10 |
| `/services/[slug]` | Dynamic | Dynamic | Yes | Yes | 9/10 |
| `/contact` | Yes | Yes (76 chars) | No | No | 5/10 |
| `/faq` | Yes | Yes (98 chars) | No | No | 5/10 |
| `/booking` | No (default) | No (default) | No | No | 1/10 |
| `/privacy` | No (default) | No (default) | No | No | 1/10 |

### 6b. What's Missing

- **Canonical URLs** on 6 of 8 pages — search engines may index duplicate URLs
- **OpenGraph tags** missing on static pages — poor social sharing appearance
- **Booking page has zero custom metadata** — critical conversion page invisible to search
- **Description lengths** — About (73 chars) and Contact (76 chars) are too short; aim for 150-160 chars
- **No dynamic OG images** — every page shares the same generic og-image.png

### 6c. Heading Hierarchy — Excellent

Every page has exactly one H1 with proper H2/H3 nesting. No issues found.

### 6d. Alt Text — Very Good

All meaningful images have descriptive alt text. Decorative images correctly use `alt=""` with `aria-hidden="true"`.

### 6e. Internal Linking — Good, Room to Improve

- Navigation covers all main pages
- Service cards link to detail pages
- Related services section exists on detail pages
- **Missing:** Cross-links between related content (e.g., FAQ answers linking to service pages)
- **Missing:** Breadcrumb links on most pages (only service detail has them)

---

## 7. Structured Data / Schema Markup

### 7a. Current Implementation

The site has a solid `MedicalBusiness` schema in the root layout with:
- Business name, description, URL
- Physical address + geo coordinates
- Opening hours
- 7 service offerings as `MedicalProcedure`
- Area served (McLean, Northern VA, etc.)

### 7b. What's Missing

| Schema Type | Status | Impact |
|-------------|--------|--------|
| `FAQPage` schema on /faq | Missing | FAQs could appear as rich results in Google |
| `Review` / `AggregateRating` | Missing | Star ratings in search results |
| `BreadcrumbList` | Missing | Breadcrumb trail in search results |
| `Person` schema for team | Missing | Knowledge panel potential |
| `sameAs` (social profiles) | Missing | Connects business across platforms |
| `Service` with pricing | Missing | Price info in search results |
| `ImageObject` for services | Missing | Image rich results |

### 7c. Data Quality Issues

- Phone number is placeholder: `+1-555-123-4567`
- Email may be placeholder
- `medicalSpecialty` set to "Dermatology" — should be "PlasticSurgery" or custom aesthetics value
- `priceRange` is generic "$$-$$$" instead of actual range

---

## 8. AI & Modern SEO Opportunities

### 8a. AI Search Optimization (Google SGE / AI Overviews)

AI search engines (Google AI Overviews, Perplexity, ChatGPT search) prioritize:

1. **Direct, authoritative answers** — FAQ page should have clear Q&A format with concise answers
2. **Entity-rich content** — Service pages should explicitly name procedures, ingredients, timeframes, pricing
3. **E-E-A-T signals** (Experience, Expertise, Authoritativeness, Trust):
   - Karlyne's credentials and experience should be prominently featured
   - "Nurse" qualification is actually a strong trust signal for aesthetics
   - Testimonials with specific details (not just "great experience")
4. **Structured data** — Schema markup helps AI understand and cite your content

### 8b. Content Gaps for AI Visibility

| Missing Content | Why It Matters |
|----------------|----------------|
| Blog / Educational articles | Long-tail queries ("how long does Botox last", "Sculptra vs fillers") |
| Procedure detail pages with FAQs | AI Overviews pull from pages that answer specific questions |
| Before/after descriptions | "What to expect" content gets cited in AI answers |
| Pricing transparency | "How much does Botox cost in McLean VA" is a high-intent query |
| Provider bio page | E-E-A-T signal — AI trusts content from credentialed providers |

### 8c. Technical AI-Readiness

| Factor | Status | Fix |
|--------|--------|-----|
| Clean HTML structure | Good | — |
| Fast page load (AI crawlers time out) | Poor | Fix rendering issues |
| Schema markup | Partial | Add FAQ, Review, Breadcrumb schemas |
| Content depth | Thin | Add educational content |
| Mobile-first | Good | — |

---

## 9. Marketing SEO & Local Search

### 9a. Local SEO Signals

**Strong:**
- Google Business schema with address + coordinates
- Area served includes 7 Northern Virginia localities
- NAP (Name, Address, Phone) in structured data

**Missing:**
- No Google Business Profile link/integration mentioned
- No local landing pages (e.g., "/botox-mclean-va")
- No "Directions" or Google Maps embed on contact page
- Service areas not mentioned in page copy (only in schema)
- No local backlink strategy evident

### 9b. Keyword Targeting

**Current keyword coverage (from root metadata):**
```
med spa McLean VA, medical aesthetics Northern Virginia,
Botox McLean, dermal fillers Virginia, luxury med spa,
facial rejuvenation McLean, skin care treatments Northern Virginia,
aesthetic treatments Tysons Corner, beauty treatments Great Falls VA,
anti-aging McLean Virginia, cosmetic treatments Vienna VA,
med spa near me, aesthetic nurse McLean...
```

**Missing high-value keywords:**
- "lip filler McLean VA" / "lip filler near me"
- "Sculptra McLean" / "Sculptra Northern Virginia"
- "PRF facial near me"
- "natural looking Botox"
- "best med spa Northern Virginia" (competitive but important)
- "med spa consultation McLean"

### 9c. Conversion Path SEO

The booking page (`/booking`) has **zero custom metadata**. This is a critical gap because:
- Someone searching "book med spa appointment McLean" should find this page
- It has no title, description, or OpenGraph tags
- It's the most important conversion page on the site

### 9d. Sitemap Issues

- All pages use `new Date()` as `lastModified` — tells Google everything changed today, every day
- Static pages (Privacy, Terms) marked with overly aggressive change frequencies
- Should use actual content modification dates

---

## 10. Prioritized Action Plan

### Phase 1: Quick Wins (1-2 hours, biggest impact)

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 1 | **Compress all PNGs to WebP** — testimonial-bg alone goes from 6MB → ~100KB | Massive | 15 min |
| 2 | **Compress videos with FFmpeg** — H.265 + reduce resolution for mobile | Large | 15 min |
| 3 | **Add metadata to /booking page** — title, description, OpenGraph, canonical | Medium | 10 min |
| 4 | **Add canonical URLs to all pages** | Medium | 15 min |
| 5 | **Add `loading="lazy"` to below-fold images** | Medium | 10 min |
| 6 | **Fix sitemap `lastModified` dates** | Low | 10 min |
| 7 | **Fix placeholder phone/email in schema** | Low | 5 min |

### Phase 2: Server Rendering Migration (2-4 hours, major speed gain)

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 8 | **Convert /booking to fully static** (it has zero data dependencies) | Large | 15 min |
| 9 | **Move all Convex queries server-side** with `fetchQuery()` | Massive | 2 hrs |
| 10 | **Add `<Suspense>` boundaries** around provider chain | Large | 30 min |
| 11 | **Add `loading.tsx` files** for each route | Medium | 30 min |
| 12 | **Replace `<img>` with `next/image`** across all components | Large | 1 hr |

### Phase 3: Bundle Optimization (2-3 hours)

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 13 | **Replace Framer Motion with CSS animations** for fade-up-on-scroll | -42KB bundle | 2 hrs |
| 14 | **Lazy-load Clerk SDK** only on admin routes | -65KB on public pages | 1 hr |
| 15 | **Add route-level code splitting** with `next/dynamic` | Smaller bundles | 30 min |

### Phase 4: SEO Enrichment (1-2 hours)

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 16 | **Add `FAQPage` schema** to /faq (rich results in Google) | High | 20 min |
| 17 | **Add `Review` schema** from testimonials | High | 20 min |
| 18 | **Add `BreadcrumbList` schema** to service pages | Medium | 15 min |
| 19 | **Expand page descriptions** to 150-160 chars | Medium | 15 min |
| 20 | **Add OpenGraph tags** to all static pages | Medium | 15 min |

### Phase 5: Content & Marketing SEO (ongoing)

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 21 | **Add educational blog section** for long-tail keywords | High | Large |
| 22 | **Create local landing pages** ("/botox-mclean-va") | High | Medium |
| 23 | **Add pricing transparency** to service pages | Medium | Small |
| 24 | **Expand service descriptions** with FAQ subsections | Medium | Medium |
| 25 | **Add Google Maps embed** to contact page | Low | Small |

---

## Expected Results

| Metric | Current (est.) | After Phase 1-2 | After All Phases |
|--------|---------------|-----------------|-----------------|
| Page weight (mobile) | 3-5 MB | 400-800 KB | 300-500 KB |
| First Contentful Paint | 3-4s | 1-1.5s | <1s |
| Largest Contentful Paint | 5-7s | 2-3s | <2.5s |
| JS bundle (public pages) | ~192KB gz | ~150KB gz | ~65KB gz |
| Lighthouse Performance | ~40-55 | ~70-80 | ~90+ |
| SEO metadata coverage | 40% | 80% | 100% |
| Schema markup types | 2 | 5 | 7+ |
| Google rich result eligibility | Low | Medium | High |

---

*This document is a read-only analysis. No code changes have been made.*

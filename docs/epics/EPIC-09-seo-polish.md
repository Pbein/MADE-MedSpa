# Epic 9: SEO, Performance & Polish

## Goal

Optimize the site for search engines, ensure accessibility compliance, handle errors gracefully, and polish the overall user experience for production readiness.

---

## User Stories

### 9.1: Metadata & Open Graph
- [ ] **Complete**

**As a** business owner,
**I want** proper metadata on every page,
**So that** the site ranks well in search engines and looks professional when shared on social media.

**Acceptance Criteria:**
- [ ] Unique `<title>` tag on every page (format: "Page Name | MADE Med Spa")
- [ ] Unique `<meta name="description">` on every page
- [ ] Open Graph tags (og:title, og:description, og:image, og:url) on every page
- [ ] Twitter Card meta tags
- [ ] Canonical URLs set on all pages
- [ ] Dynamic metadata for service and product detail pages
- [ ] Default OG image for pages without specific images
- [ ] `robots.txt` configured

**Implementation Notes:**
- Use Next.js `generateMetadata` function in each page
- Create a reusable metadata helper function
- OG images can be generated with `next/og` (ImageResponse API)

---

### 9.2: Structured Data (Schema.org)
- [ ] **Complete**

**As a** business owner,
**I want** structured data markup on the site,
**So that** search engines understand our content and display rich results.

**Acceptance Criteria:**
- [ ] `LocalBusiness` schema on home page (name, address, phone, hours)
- [ ] `MedicalBusiness` or `HealthAndBeautyBusiness` schema
- [ ] `Service` schema on each service detail page
- [ ] `Product` schema on each product detail page
- [ ] `FAQPage` schema on the FAQ page
- [ ] `BreadcrumbList` schema on pages with breadcrumbs
- [ ] `Organization` schema with logo and social profiles
- [ ] Validated with Google's Rich Results Test

**Implementation Notes:**
- Use JSON-LD format via `<script type="application/ld+json">`
- Create reusable schema generator functions
- Test with Google's Structured Data Testing Tool

---

### 9.3: Sitemap & Indexing
- [ ] **Complete**

**As a** business owner,
**I want** a sitemap and proper indexing configuration,
**So that** search engines can discover and index all pages.

**Acceptance Criteria:**
- [ ] Dynamic XML sitemap at `/sitemap.xml`
- [ ] Includes all public pages, services, products
- [ ] Excludes admin, dashboard, checkout pages
- [ ] `lastmod` dates accurate
- [ ] Priority and changefreq set appropriately
- [ ] `robots.txt` references sitemap
- [ ] Google Search Console submission documented

**Implementation Notes:**
- Use Next.js `sitemap.ts` (App Router sitemap generation)
- Query Convex for dynamic service and product slugs
- Regenerate on build or use ISR

---

### 9.4: Accessibility (a11y)
- [ ] **Complete**

**As a** visitor with disabilities,
**I want** the site to be accessible,
**So that** I can navigate and use all features regardless of ability.

**Acceptance Criteria:**
- [ ] WCAG 2.1 AA compliance
- [ ] All images have meaningful `alt` text
- [ ] Proper heading hierarchy (h1-h6)
- [ ] Keyboard navigable (all interactive elements focusable)
- [ ] Focus indicators visible
- [ ] ARIA labels on interactive components
- [ ] Color contrast ratios meet AA standards (4.5:1 text, 3:1 large text)
- [ ] Form fields have associated labels
- [ ] Screen reader tested (VoiceOver, NVDA)
- [ ] Skip-to-content link

**Implementation Notes:**
- Use axe-core or Lighthouse for automated testing
- shadcn/ui components have built-in accessibility
- Manual testing with keyboard-only navigation
- Test with browser accessibility tools

---

### 9.5: Error Handling
- [ ] **Complete**

**As a** visitor,
**I want** helpful error pages and graceful error handling,
**So that** I'm not confused when something goes wrong.

**Acceptance Criteria:**
- [ ] Custom 404 page with brand styling and helpful links
- [ ] Custom 500 error page with brand styling
- [ ] Error boundaries for component-level failures
- [ ] Toast notifications for form/action errors
- [ ] Graceful handling of Convex connection issues
- [ ] Graceful handling of third-party service failures (Stripe, Cal.com)
- [ ] Loading states prevent premature error display

**Implementation Notes:**
- Use Next.js `not-found.tsx` and `error.tsx` files
- Error boundaries with fallback UI
- Sonner or shadcn/ui toast for inline errors

---

### 9.6: Performance Optimization
- [ ] **Complete**

**As a** visitor,
**I want** the site to load quickly,
**So that** I have a smooth experience and don't leave due to slow loading.

**Acceptance Criteria:**
- [ ] Lighthouse Performance score > 90
- [ ] Core Web Vitals passing (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] Images optimized with Next.js Image (lazy loading, srcset, WebP)
- [ ] Fonts optimized with `next/font`
- [ ] JavaScript bundle analyzed and optimized
- [ ] Dynamic imports for heavy components (Cal.com embed, galleries)
- [ ] Static pages pre-rendered where possible
- [ ] API response times monitored
- [ ] CDN caching configured via Vercel

**Implementation Notes:**
- Use `next/dynamic` for code splitting
- Analyze bundle with `@next/bundle-analyzer`
- Use Vercel Analytics for real user metrics
- Consider ISR for service/product pages

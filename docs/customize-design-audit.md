# Customize-Design Audit

**Date:** 2026-04-27
**Scope:** Phase 1 of customize-design rework. Catalog every (section × token) combination to identify which currently honor admin overrides and which don't.

## Summary

The customize-design panel sets six CSS variables on the section wrapper. **Components that read those variables work correctly. Components that hardcode hex values or Tailwind hex utilities ignore the override.**

The button-color tokens (`--btn-bg`, `--btn-text`) flow through cleanly because the global `.btn-primary` CSS class uses them. **Headline / Body / Background / Divider tokens fail in many sections because components hardcode hex values for these.**

## Scoreboard (lower hex count = closer to working)

### Section components (`src/components/sections/`)

| Component | hex literals | Tailwind hex (`bg-[#`, `text-[#`) | Status |
|---|---:|---:|---|
| AboutTeaser.tsx | 0 | 0 | ✅ Clean |
| AreasWeServe.tsx | 0 | 0 | ✅ Clean |
| LocationMap.tsx | 0 | 0 | ✅ Clean |
| PageHeaderCompact.tsx | 0 | 0 | ✅ Clean |
| TestimonialSection.tsx | 0 | 0 | ✅ Clean |
| EditorialBreak.tsx | 1 | 0 | ⚠ Minor |
| PageHero.tsx | 1 | 0 | ⚠ Minor |
| ServiceCard.tsx | 1 | 1 | ⚠ Minor |
| FeaturedServices.tsx | 3 | 0 | ⚠ Gradient stops |
| **CTABanner.tsx** | **5** | **2** | ❌ **Worst — `dark` mode hardcodes everything** |
| **HeroSection.tsx** | **8** | **1** | ❌ **Worst — hero text + bg + divider all hardcoded** |

### Page-level inline sections (`src/app/**/page.tsx` etc.)

| File | hex | tw-hex | var(--color | Status |
|---|---:|---:|---:|---|
| `src/app/page.tsx` | 0 | 0 | 0 | N/A — composes components only |
| `src/app/about/AboutPageClient.tsx` | 1 | 0 | 26 | ⚠ Minor |
| `src/app/services/ServicesPageClient.tsx` | 0 | 0 | 9 | ✅ Clean |
| `src/app/services/[slug]/ServiceDetailClient.tsx` | 0 | 0 | 18 | ✅ Clean |
| `src/app/membership/page.tsx` | 4 | 0 | 10 | ❌ Tier card gradients hardcoded |
| `src/app/shop/page.tsx` | 2 | 0 | 29 | ⚠ Minor |
| `src/app/contact/ContactPageClient.tsx` | 3 | 0 | 0 | ❌ Inline `ESPRESSO` / `GLAZE` constants |
| `src/app/faq/page.tsx` | 0 | 0 | 16 | ✅ Clean |
| `src/app/booking/page.tsx` | 2 | 0 | 21 | ⚠ Minor |
| `src/app/testimonials/page.tsx` | 0 | 0 | 21 | ✅ Clean |
| `src/app/before-and-after/page.tsx` | 0 | 0 | 15 | ✅ Clean |

## (Section × Token) Matrix

Tokens (T1-T6) match the customize-design panel: T1=Background, T2=Headline Text, T3=Body Text, T4=Button Color, T5=Button Text, T6=Divider Line.

Legend: ✅ honors override · ❌ hardcoded · — not used in this section · ? needs visual check

### Home (`/`)

| Section | T1 BG | T2 Headline | T3 Body | T4 Btn | T5 BtnText | T6 Divider |
|---|---|---|---|---|---|---|
| Hero (HeroSection.tsx, dark variant) | ❌ #391e1e | ❌ #f7f6eb | ❌ #f7f6eb | ✅ via .btn-primary | ✅ via .btn-primary | ❌ bg-[#f7f6eb]/30 |
| Featured Services | ❌ gradient hex | ✅ | ✅ | ✅ | ✅ | — |
| About Teaser | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Testimonials section | ✅ | ✅ | ✅ | — | — | ✅ (--color-outline-variant) |
| CTA Banner (`dark={true}` default) | ❌ bg-[#f0ede4] | ❌ #391e1e | ❌ #391e1e | ✅ | ✅ | ❌ #391e1e |

### About (`/about`)

| Section | T1 | T2 | T3 | T4 | T5 | T6 |
|---|---|---|---|---|---|---|
| Hero (PageHero) | ⚠ 1 hex | ⚠ | ✅ | ✅ | ✅ | ✅ |
| Story / Editorial / Mission / Values | ⚠ 1 hex (#391e1e fallback in 1 place) | ✅ | ✅ | — | — | ✅ |
| Team Members | ✅ | ✅ | ✅ | — | — | — |
| CTA Banner | ❌ Same as home | ❌ | ❌ | ✅ | ✅ | ❌ |

### Services (`/services`)

| Section | T1 | T2 | T3 | T4 | T5 | T6 |
|---|---|---|---|---|---|---|
| Hero | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Services Grid (ServiceCard) | ⚠ tw-hex 1 | ⚠ hex 1 | ✅ | — | — | — |
| CTA Banner | ❌ Same as home | ❌ | ❌ | ✅ | ✅ | ❌ |

### Membership (`/membership`)

| Section | T1 | T2 | T3 | T4 | T5 | T6 |
|---|---|---|---|---|---|---|
| Hero | ❌ #f0e8e1 | ⚠ | ✅ | ✅ | ✅ | ✅ |
| Tiers | ❌ gradient #391e1e | ✅ | ✅ | ❌ inline gradient | ❌ inline gradient | — |
| CTA Banner | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |

### Shop (`/shop`)

| Section | T1 | T2 | T3 | T4 | T5 | T6 |
|---|---|---|---|---|---|---|
| Hero / Grid | ⚠ | ✅ | ✅ | ✅ | ✅ | ✅ |
| CTA Banner | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |

### Contact (`/contact`)

| Section | T1 | T2 | T3 | T4 | T5 | T6 |
|---|---|---|---|---|---|---|
| Hero / Form | ❌ ESPRESSO/GLAZE constants | ❌ | ❌ | ✅ | ✅ | ❌ |

### FAQ (`/faq`), Testimonials (`/testimonials`), Before & After (`/before-and-after`)

These are all clean — use `var(--color-*)` consistently. They're the model the others should follow.

### Booking (`/booking`)

| Section | T1 | T2 | T3 | T4 | T5 | T6 |
|---|---|---|---|---|---|---|
| Hero | ⚠ | ✅ | ✅ | ✅ | ✅ | ✅ |
| What to Expect / Prep / Policy | ✅ | ✅ | ✅ | — | — | ✅ |

## Key findings

1. **CTABanner is the single biggest issue.** It's used on home, about, services, shop, membership, faq, before-and-after — that's 7 pages. The `dark={true}` default hardcodes every text color, divider, and background. Fixing this one component lifts ~7 sections to ✅.

2. **HeroSection.tsx is the second biggest.** Used on home page only, but has 8 hardcoded hex values across the headline, subtitle, divider, and various decorative elements. Most can become CSS variables with sensible fallbacks.

3. **Page-level inline section markup is inconsistent.** `/contact` defines local `ESPRESSO` and `GLAZE` constants that are passed to inline styles — needs converting to CSS vars. `/membership` has hardcoded tier-card gradients. Other pages already use the right pattern.

4. **Button + Button Text already work.** No change needed for T4/T5 in any section. The global `.btn-primary` and `.btn-light` CSS classes correctly read `var(--btn-bg)` / `var(--btn-text)`.

5. **Decorative gradients are tricky.** `FeaturedServices` uses a multi-stop gradient in CSS that includes hex literals as gradient stops. We can convert these to CSS variables, but the visual transitions are tuned — replacements need visual verification.

## Recommendations for Phase 2 (architecture)

1. **Define the canonical token set** so every component agrees on what `--color-*` means semantically:
   - `--color-surface` — section background
   - `--color-on-surface` — primary text on surface (alias for `--color-primary` in current code; should consolidate)
   - `--color-on-surface-variant` — body / muted text
   - `--color-secondary` — accent (the blush)
   - `--btn-bg`, `--btn-text` — button-specific (already wired)
   - `--divider-color` — divider lines

2. **Establish the fallback pattern.** Every `var()` reference should include a fallback that matches the pre-rework hardcoded value, so the design looks identical when no override is set:
   ```tsx
   color: "var(--color-primary, #391e1e)"
   ```

3. **Eliminate the `dark` prop on CTABanner.** Replace with a single set of color references that default to the existing dark look but honor section-level overrides. The section's customize-design wrapper sets the variables, the component just consumes them.

4. **Decide on inline-page color constants.** `/contact` should drop the local `ESPRESSO`/`GLAZE` constants in favor of `var(--color-*)`. Same for `/membership` tier-card gradients.

## Phase 3 fix order (priority by leverage)

1. **CTABanner.tsx** — fix once, fixes 7 sections
2. **HeroSection.tsx** — fix once, fixes home hero
3. **Membership tier-card gradients** — fix the inline `style={{ background: "..." }}`
4. **Contact page** — replace `ESPRESSO`/`GLAZE` constants
5. **EditorialBreak / PageHero / FeaturedServices / ServiceCard** — minor cleanup, low individual leverage but needed for completeness
6. Any remaining stragglers from a final grep pass after the above

## What's NOT in scope for this audit

- **Typography (font family, size, weight, italic, align)** — separate audit in Phase 4 once colors are bulletproof.
- **Layout / spacing tokens** — out of scope; we're not exposing those to admins.
- **Animation / motion** — out of scope.

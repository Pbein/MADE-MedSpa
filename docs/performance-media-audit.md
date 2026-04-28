# Media Performance Audit

**Date:** 2026-04-25
**Scope:** Inventory of heavy media assets affecting Core Web Vitals (LCP, CLS, total page weight). Not a deep performance refactor — surgical, lowest-hanging-fruit fixes.

## Summary

| Metric | Before | After |
|---|---:|---:|
| `media/` videos (uncompressed) | 8.36 MB | **2.97 MB** (compressed `-web` versions) |
| `public/videos/` (served to users) | **10.59 MB** (incl. `-original.mp4`) | **2.72 MB** (originals moved out of `public/`) |
| `media/Background Images/` PNGs (untracked) | 4.96 MB | unchanged (not currently referenced) |

**Net savings on the public-served bundle: ~7.87 MB removed from `public/videos/`** by moving heavy originals to `media/originals/` (gitignored).

---

## Task 1 — Asset Inventory

### Hero / Background Videos (Core Web Vitals impact)

| Path | Size (Before) | Size (After) | Where Used | Action Taken |
|---|---:|---:|---|---|
| `media/hero.mp4` | 4,801,460 B (4.80 MB) | — moved to `media/originals/` | Source / not referenced in code | Compressed → `media/hero-web.mp4` (1.36 MB, -71.6%); original moved to `media/originals/` |
| `media/veo_Video_20260411_154435.mp4` | 3,562,345 B (3.56 MB) | — moved to `media/originals/` | Source / not referenced in code | Compressed → `media/veo_Video_20260411_154435-web.mp4` (1.61 MB, -54.8%); original moved to `media/originals/` |
| `public/videos/hero.mp4` | 1,273,488 B (1.27 MB) | unchanged | `src/components/sections/HeroSection.tsx` (home LCP) | Already compressed and under 2 MB target — left in place |
| `public/videos/faq-hero.mp4` | 1,443,386 B (1.44 MB) | unchanged | `src/app/booking/page.tsx` | Already compressed — left in place |
| `public/videos/hero-original.mp4` | 3,562,345 B (3.56 MB) | — moved out of `public/` | Not referenced (orphan source) | Moved to `media/originals/`, added to `.gitignore` |
| `public/videos/faq-hero-original.mp4` | 4,801,460 B (4.80 MB) | — moved out of `public/` | Not referenced (orphan source) | Moved to `media/originals/`, added to `.gitignore` |

**Note:** The `-original.mp4` files in `public/videos/` were untracked (per initial `git status`) but Next.js's static asset handler still served any file in `public/` — keeping them there was wasted space and a footgun (someone could accidentally reference them). Now they're moved out and gitignored.

### Background PNGs in `media/Background Images/`

These are project source assets and **not currently referenced anywhere in `src/`** (verified via grep). They are only used as art-direction sources / handoffs to design. Optimized WebP versions live in `public/images/`.

| Path | Size | Used in `src/`? | Action |
|---|---:|---|---|
| `media/Background Images/Background.png` | 304,679 B (305 KB) | No | Leave (source asset; not served) |
| `media/Background Images/ChatGPT Image Apr 19, 2026, 01_06_38 AM.png` | 2,072,746 B (2.07 MB) | No | Leave (untracked source) — recommend deletion if not used |
| `media/Background Images/about.original.png` | 5,533,655 B (5.53 MB) | No | Leave (already a "source of truth"; gitignored OK) |
| `media/Background Images/about.png` | 3,502,872 B (3.50 MB) | No | Leave |
| `media/Background Images/brushstrokes.png` | 304,929 B (305 KB) | No | Leave |
| `media/Background Images/contact-espresso.png` | 3,047,639 B (3.05 MB) | No | Leave |
| `media/Background Images/contact.png` | 7,311,639 B (7.31 MB) | No | Leave |
| `media/Background Images/hero-frame.png` | 1,053,261 B (1.05 MB) | No | Leave |
| `media/Background Images/memberships.png` | 2,886,020 B (2.89 MB) | No (untracked source) | Leave |
| `media/Background Images/services.png` | 6,231,042 B (6.23 MB) | No | Leave |
| `media/Background Images/testimonial.png` | 3,724,436 B (3.72 MB) | No | Leave |

These **do not affect Core Web Vitals** because they aren't served. Production serves the optimized `public/images/*.webp` versions (e.g., `hero-poster.webp` at 36 KB, `values-bg.webp` at 100 KB). No action required.

### Images Actually Served (`public/images/`)

All public images are already WebP and well-sized:
- `hero-poster.webp`: 36,566 B (37 KB) — home LCP poster, used with `priority`
- `booking-hero-poster.webp`: 33,266 B (33 KB) — booking page poster
- `values-bg.webp`, `testimonial-bg.webp`, `editorial-break-bg.webp`, etc.: all under 100 KB
- **Outliers worth noting:**
  - `contact-hero-bg.png`: 1,455,586 B (1.46 MB) — recommend converting to WebP (would be ~150–200 KB). **Not blocking launch.**
  - `membership-atmosphere-bg.webp`: 467,064 B (467 KB) — borderline; OK for now.

---

## Task 2 — Compression Results

`ffmpeg` was available locally. Used the prescribed command:

```
ffmpeg -i input.mp4 -vcodec h264 -acodec aac -b:v 1.5M -movflags +faststart -vf "scale=1920:-2" -an output-web.mp4
```

| File | Before | After | Reduction |
|---|---:|---:|---:|
| `media/hero.mp4` → `media/hero-web.mp4` | 4.80 MB | 1.36 MB | **−71.6%** (3.44 MB saved) |
| `media/veo_Video_20260411_154435.mp4` → `media/veo_Video_20260411_154435-web.mp4` | 3.56 MB | 1.61 MB | **−54.8%** (1.95 MB saved) |

**Note on code references:** Neither source file in `media/` is referenced from `src/`. The currently-served videos in `public/videos/hero.mp4` (1.27 MB) and `public/videos/faq-hero.mp4` (1.44 MB) were **already compressed** before this audit and meet the 2–3 MB hero-video budget. The `-web.mp4` versions in `media/` are kept as future-ready replacements; no code changes required.

**Originals preserved:** All originals moved to `media/originals/` (gitignored). `.gitignore` now contains:

```
media/originals/
public/videos/*-original.mp4
```

---

## Task 3 — Next.js Image / Video Best Practices

### 3.1 `<img>` → `<Image>` Conversions

**Public-facing pages:**

| File | Lines | Status |
|---|---|---|
| `src/app/shop/page.tsx` | 196, 289 (originals) | **Converted** to `next/image` `<Image fill sizes=... />`. Source is a Convex storage URL (`*.convex.cloud`), already whitelisted in `next.config.ts` `remotePatterns`. Container divs already have fixed aspect ratios, so layout is preserved. Added `relative` to one container to make `fill` work. |

**Admin pages (intentionally NOT converted, documented):**

| File | Lines | Reason |
|---|---|---|
| `src/app/admin/layout.tsx` | 241, 336 | Clerk `user.imageUrl` — third-party domain not in `next.config.ts` `remotePatterns`; admin-only, low traffic. |
| `src/app/admin/media/page.tsx` | 377 | Dynamic upload preview; dimensions unknown. |
| `src/app/admin/seo/page.tsx` | 268 | OG image preview; dynamic external URLs. ESLint disable already present. |
| `src/app/admin/settings/page.tsx` | 261 | OG upload preview. |
| `src/components/admin/ImageUpload.tsx` | 75 | Generic admin upload preview component. |
| `src/components/admin/SectionEditorCard.tsx` | 154 | Admin section editor preview; dynamic. |
| `src/components/admin/SectionDesignPanel.tsx` | 326 | Admin design panel thumbnail; dynamic. |

These are all admin-only routes (gated by `/admin` middleware, low traffic), so they don't affect the launch's CWV scores.

### 3.2 LCP Priority

**Home page hero (`HeroSection.tsx`):** ✓ Already correct
- Poster image uses `<Image priority sizes="100vw" fill />`
- Video has `autoPlay muted preload="metadata"` (changed from `preload="auto"` — see below)

**Booking page hero:** ✓ Already correct
- Poster uses `<Image priority />`

### 3.3 Lazy-Loading

All public-page below-the-fold images use `next/image`, which lazy-loads by default. Shop page product grid images now use `next/image` (lazy by default) — previously they were raw `<img>` with no `loading` attribute. **Improvement: better lazy behavior on `/shop`.**

### 3.4 Hero Video `preload`

**Changed in `src/components/sections/HeroSection.tsx`:**
- `preload="auto"` → `preload="metadata"` (saves bandwidth on initial page load; the video still autoplays once metadata is ready)
- Added `poster={posterSrc}` attribute as a native fallback in addition to the layered `<Image>` poster

**Changed in `src/app/booking/page.tsx`:**
- Added `poster="/images/booking-hero-poster.webp"` so Safari/iOS show a still frame before playback (it was already `preload="metadata"`).

### 3.5 Background-Image CSS

Searched `src/` for `background-image: url(...)`. Only one match: `src/app/globals.css:177` — an inline SVG noise filter `data:` URI. **No PNG background-images served via CSS.** No action needed.

---

## Files Changed

**Code:**
- `src/components/sections/HeroSection.tsx` — `preload="auto"` → `preload="metadata"`, added `poster` attribute
- `src/app/booking/page.tsx` — added `poster` attribute to hero video
- `src/app/shop/page.tsx` — converted 2 `<img>` to `next/image` `<Image fill>`, added `Image` import, made one container `relative` for `fill` positioning

**Filesystem:**
- Compressed: `media/hero-web.mp4`, `media/veo_Video_20260411_154435-web.mp4` (new files)
- Moved to `media/originals/` (gitignored): `media/hero.mp4`, `media/veo_Video_20260411_154435.mp4`, `public/videos/hero-original.mp4`, `public/videos/faq-hero-original.mp4`

**Config:**
- `.gitignore` — added `media/originals/` and `public/videos/*-original.mp4` exclusions

---

## Follow-ups (out of scope for this audit)

1. **Convert `public/images/contact-hero-bg.png` (1.46 MB) to WebP.** Should drop to ~150–200 KB. Requires a quick `cwebp` or sharp pass plus a single code reference update.
2. **Consider WebM versions** of `hero.mp4` and `faq-hero.mp4` for Chrome/Firefox (smaller than H.264 at the same quality). Add as a `<source type="video/webm">` before the MP4 source.
3. **Cleanup unused source PNGs** in `media/Background Images/` if confirmed unused — saves ~36 MB on disk (does not affect production but reduces repo bloat if any are tracked).
4. **Admin `<img>` tags** — consider `<Image unoptimized />` if adding Clerk's image domain to `next.config.ts` is undesirable. Low priority since admin is not customer-facing.

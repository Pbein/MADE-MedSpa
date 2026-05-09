# MADE Med Spa — Launch Tracker

> **Source of truth.** Migrated from Asana on 2026-05-08 (free tier expiring).
> Asana export JSON preserved at `docs/.asana-export.json` for reference.
>
> **Status legend:** `[ ]` open · `[x]` done · `[~]` partial / in progress

## How to use this doc

1. Check the box `[ ]` → `[x]` when work lands. Add a date note inline.
2. New tasks: append to the right priority section. Use a `P0/P1/P2/P3` prefix in the title.
3. Move "Discuss" items into the relevant priority section once decided.
4. Big sweeps of context: each task has the original Asana notes in a `<details>` block.

## Quick stats

- **81 tasks** imported from Asana
- **11 marked done** in 2026-05-04 → 2026-05-07 session
- **2 marked partial** (see notes)
- **67 still open**

By priority:
- **P0**: 40 total, 9 done
- **P1**: 18 total, 2 done
- **P2**: 7 total, 0 done
- **P3**: 4 total, 0 done
- **Discuss**: 3 total, 0 done
- **Other**: 9 total, 0 done

---

## ✅ Manual Verification Checklist (Philip)

> Things shipped to `main` that I (Philip) need to eyeball or click-test myself before calling them done. Distinct from QA tasks Karlyne reports back on. Check the box when you've actually exercised it on **production** (not localhost).

### Recently shipped — needs verification

- [ ] **Favicon shows MADE logo in browser tab** _(shipped `dadf6a9`, 2026-05-09)_
  - Open https://mademedspa.com in a fresh window (or hard-refresh `Ctrl+Shift+R`).
  - Tab shows the cream-bg "MADE / MED SPA" wordmark, not the previous Next.js default.
  - Bookmark the page → bookmark icon also shows MADE.
  - On iOS Safari → Add to Home Screen → home-screen icon shows MADE (validates `apple-icon.png`).
  - Source-of-truth files: `src/app/{icon.png,apple-icon.png,favicon.ico}`. Regenerate with `node scripts/generate-favicon.mjs` if the source logo changes.

- [ ] **Admin image compression actually fires (end-to-end)** _(shipped `7f56e5a`, 2026-05-07)_
  - Sign in at https://mademedspa.com/admin → go to `/admin/team` (any uploader works).
  - Open DevTools → Network tab → filter "blob".
  - Upload a >2MB phone photo (JPG straight off iPhone is ideal).
  - Expected: the PUT request to `*.public.blob.vercel-storage.com` carries a payload **~300–400 KB** (not the original size) and Content-Type `image/webp`.
  - Console should be clean — no `[uploadBlob] compression failed` warnings.
  - Resulting URL should end in `.webp`.
  - **Known gap**: 6 direct `uploadBlob()` callsites still default to `purpose: "general"` instead of an explicit purpose. Functional but not optimal — see "Open issues" below.

- [ ] **Service categories seeded on production** _(P0 task #10, see below)_
  - Visit https://mademedspa.com/admin/categories → click "Seed default categories" if list is empty.
  - Then visit https://mademedspa.com/services → category filter chips render and filter works.

- [ ] **Clerk production secret rolled** _(P0 task #12, see below)_
  - Old prod secret was pasted in chat 2026-05-04 → must be rotated via Clerk dashboard → updated in Vercel Production env.

- [ ] **`ADMIN_EMAILS` set on Vercel Preview environment** _(P0 task #14, see below)_
  - Vercel dashboard → Project → Settings → Env Vars → confirm `ADMIN_EMAILS` exists for Preview scope. CLI couldn't add this; must be done via UI.

- [ ] **Logo, footer, booking flow shipped end-of-Apr — re-eyeball on prod**
  - Nav logo size feels right at desktop + mobile (not "small next to giant CTA")
  - Footer is the compact alcove-style version, not the old tall one
  - `/booking` auto-scrolls to the Pabau iframe on page load (not stuck at the top)
  - Every footer + nav CTA reads "Book Consultation" / "Explore Services" (no leftover "Book Now" / "View All Services")

- [ ] **Shop redesign + product detail pages**
  - https://mademedspa.com/shop renders 2 cols mobile / 3 tablet / 4 desktop, square cards, no stretched photos
  - Click any product → `/shop/[slug]` loads with full description and Pabau CTA
  - No leftover "Provider Favorites" sidebar

- [ ] **Adaptive team section on /about**
  - With current 1 team member: editorial spotlight layout (image left + bio right, not a tiny lonely card)
  - When/if a 2nd member is added via `/admin/team`, layout reflows to a 2-up grid

### Karlyne's 2026-05-09 feedback round — fix-then-verify

> Working through her 11-item texted list one item at a time. Each item below has: her verbatim quote, current state, fix approach, files touched, and how to verify.
>
> Check the top-level box only when shipped to `main` AND verified on https://mademedspa.com.

#### #1 — Favicon: logo in browser tab

- [x] **Status:** ✅ Shipped `dadf6a9` (2026-05-09)
- **Karlyne (verbatim):** _"My logo isn't in the browser tab yet"_
- **Source she sent:** `assets/MADE.jpg` — square cream-bg "MADE / MED SPA" wordmark
- **Approach:** Generated icon set from the square logo via Sharp:
  - `src/app/icon.png` (512×512) — Next.js auto-derives smaller sizes
  - `src/app/apple-icon.png` (180×180) — iOS home-screen
  - `src/app/favicon.ico` (multi-size: 16/32/48) — legacy browser-tab fallback
  - Reusable script at `scripts/generate-favicon.mjs` (rerun if source logo changes)
- **Files:** `src/app/{icon,apple-icon}.png`, `src/app/favicon.ico`, `scripts/generate-favicon.mjs`
- **Verify:**
  - [ ] Hard-refresh prod (`Ctrl+Shift+R`) → tab icon shows MADE wordmark
  - [ ] Bookmark the page → bookmark shows MADE
  - [ ] iOS Safari → Add to Home Screen → home-screen icon = MADE

---

#### #2 — Hero headline "where confidence is made" too big

- [x] **Status:** ✅ Shipped `1f5ad36` (2026-05-09) — pending Karlyne approval
- **Karlyne (verbatim):** _"on the home page 'where confidence is made' is still too big. It needs to be smaller like the inspiration website I send you"_
- **Inspiration site:** Not yet linked in tracker — ask her for the URL if my reduction misses
- **Root cause:** Three-line `<h1>` in `HeroSection.tsx` had max desktop sizes of `lg:text-[7rem]` (112px) and `lg:text-[6.5rem]` (104px). Editorial luxury sites typically sit around 60–72px max.
- **Approach:** ~30% desktop reduction across all three lines, mobile sizes preserved (already calm). Maintains the visual hierarchy (light → focal → dim) but at a quieter scale.

  | Line | Old `lg:` | New `lg:` | Old `md:` | New `md:` |
  |---|---|---|---|---|
  | headline_1 (light intro) | 6.5rem (104px) | text-6xl (60px) | text-7xl (72px) | text-5xl (48px) |
  | headline_2 (focal) | 7rem (112px) | text-7xl (72px) | text-7xl (72px) | text-6xl (60px) |
  | headline_3 (dim outro) | 5.5rem (88px) | text-5xl (48px) | text-6xl (60px) | text-4xl (36px) |

- **Files:** `src/components/sections/HeroSection.tsx`
- **Verify:**
  - [ ] Desktop: focal line reads as substantial editorial, not screaming
  - [ ] Tablet: still strong but no longer dominating
  - [ ] Mobile: unchanged (regression check)
- **Fallback if too small:** bump headline_2 to `lg:text-8xl` (96px). Or get the inspiration link and match exactly.

---

#### #3 — Button hover state too red

- [x] **Status:** ✅ Shipped `1f5f406` (2026-05-09) — pending Karlyne approval
- **Karlyne (verbatim):** _"The highlighted button when you hover over it is too red. It needs to be a deeper burgundy."_
- **Root cause:** `.btn-primary:hover` swapped from `--color-espresso` (`#391e1e`, very dark warm brown) to `--color-blush` (`#84262c`, much-lighter much-redder brick). That's a huge jump in hue + lightness — reads as red, not burgundy.
- **Approach:** Added a new `--color-burgundy: #5b2729` palette token (this wine color was already living anonymously inside `--gradient-featured`). Pointed `.btn-primary:hover` at it. Now hover *darkens-into-wine* instead of *jumps-to-brick*.
- **Scope kept tight:** Focus-visible outlines (`:focus-visible`) still use `--color-blush` because they're a11y attention-grabbers, not aesthetic surfaces. Admin section-preset "Blush" surface unchanged. Only the explicit hover she flagged.
- **Files:** `src/app/globals.css` (palette token added line 19, `.btn-primary:hover` line 322)
- **Verify:**
  - [ ] Hover over "Book Consultation" CTA on home hero → background transitions to deep wine, not pink/red
  - [ ] Same on contact form submit, services CTAs, membership CTAs (anything `.btn-primary`)
  - [ ] If she still wants it darker, drop to `#4a1f22`. If she wants more red kept, bump to `#6e2629`.

---

#### #4 — Header fonts still need to change  ⏸️ DEFERRED — saving for last

- [ ] **Status:** Deferred to end of feedback round (2026-05-09 decision: Philip considering buying real Futura license)
- **Karlyne (verbatim):** _"still need to change header fonts"_
- **Current state on prod:** H1 = Playfair Display, H2/H3 = Glacial Indifference (free Futura substitute) ALL CAPS 0.4em letter-spacing weight 500. Body = Montserrat 400.
- **Why deferred:** Brand spec specifies real Futura. Current implementation uses Glacial Indifference as a free stand-in. Philip wants to evaluate whether to license real Futura before doing any more font work — no point tweaking the substitute if we're going to swap the family entirely.
- **Licensing options to evaluate:**
  - **Adobe Fonts** (~$20/mo with Creative Cloud) — includes Futura PT + Futura PT Condensed. Self-serve via `<link>` tag. Cleanest CDN delivery.
  - **Linotype / Monotype Futura** (one-time desktop license + separate webfont license) — typically $50–200+ per weight. Buy once, host yourself via `next/font/local`. No subscription.
  - **Futura Now** (Monotype) — newer redrawing; ~$50/mo for the full family on Monotype Fonts service.
- **Approach when we resume:**
  1. Confirm with Karlyne that real Futura is what she wants (it's possible she likes Glacial Indifference but a different section's headers are off)
  2. Pick licensing path
  3. Replace the cdnfonts.com `@import` in `globals.css:7` with the Futura source (Adobe Fonts CSS or self-hosted woff2)
  4. Update `--font-label` fallback chain in `globals.css:111` to put real Futura first
  5. Diff the rendered weight/letter-spacing — Futura's geometric forms may need slightly different tracking than Glacial Indifference
- **Open question to ask Karlyne:** Is the issue (a) "font is wrong" → switch to real Futura, or (b) "font doesn't appear at all on some section" → bug fix in CSS specificity / load order, or (c) "I want it bigger / smaller" → sizing tweak?
- **Files (when resumed):** `src/app/globals.css` (lines 7, 111, possibly h2/h3 weight), `src/app/layout.tsx` (if self-hosting via next/font/local)
- **Verify (when resumed):**
  - [ ] Headers across home, /about, /services, /shop visibly match brand-spec Futura
  - [ ] Karlyne signs off on the font face
  - [ ] No FOUT (flash of unstyled text) on slow connections

---

#### #5 — Testimonial font too large on homepage

- [x] **Status:** ✅ Shipped `b49d860` (2026-05-09) — pending Karlyne approval
- **Karlyne (verbatim):** _"The testimonial font needs to be smaller on the homepage"_
- **Root cause:** `<blockquote>` in `TestimonialSection.tsx:155` was sized `text-2xl sm:text-3xl md:text-4xl` (24 → 30 → 36 px). At 36px on tablet/desktop with 200+-char client quotes, it read as billboard copy rather than intimate testimony. The decorative `"` quote mark above (line 136) was also disproportionately large at 160px.
- **Approach:** Drop both the body and the decorative mark by one tier across all breakpoints. Italic Playfair quotes typically work best 20–30px range. Tightened `maxWidth` from 52rem → 48rem so the column doesn't feel sparse at the smaller size.

  | Element | Old | New | Old `md:` | New `md:` |
  |---|---|---|---|---|
  | Quote body | text-2xl sm:text-3xl md:text-4xl | text-xl sm:text-2xl md:text-3xl | 36 px | 30 px |
  | Decorative `"` mark | text-6xl sm:text-[8rem] md:text-[10rem] | text-5xl sm:text-7xl md:text-8xl | 160 px | 96 px |
  | maxWidth | 52rem | 48rem | — | — |

- **Kept:** Italic Playfair styling, `.accent-quote` class, `font-light` weight, leading, attribution hierarchy (label-micro for name, smaller for treatment).
- **Files:** `src/components/sections/TestimonialSection.tsx` (lines 136, 155, 159)
- **Verify:**
  - [ ] Testimonial quotes feel intimate/readable, not poster-sized
  - [ ] Decorative `"` mark above each quote still reads as a luxury flourish, just proportional to the text now
  - [ ] Attribution line (name + treatment) still smaller than quote (hierarchy preserved)
  - [ ] Mobile: still legible at 20px (regression check)
- **Fallback if too small:** bump back up by one tier just on `md:` → `md:text-3xl` → `md:text-4xl` (30 → 36 px).

---

#### #6 — Services page lists too many services

- [x] **Status:** ✅ Shipped `534c3ef` (2026-05-09) — pending Karlyne approval
- **Karlyne (verbatim):** _"Services page lists too many services. I only wanted to show categories such as Botox, laser, facial treatment, weight loss and have the top main services, and then they can click to view more"_
- **Decision: no schema migration, no new route.** Used existing `services.sortOrder` field (already there, already controlled via /admin/services) as the "featured" ranking instead of adding an `isFeatured` flag. One file change.
- **Approach implemented:**
  1. **Default landing** (no filter selected, no search): `/services` renders one section per active category. Each section = eyebrow ("Treatment Category") + headline (category name) + decorative divider + 3-up grid of top services + "View all (N) in [Category] →" link if more remain.
  2. **Filtered view** (user clicks a category pill or types a search): falls back to the existing flat grid behavior so power-user filtering still works.
  3. **Top-N logic:** `services.slice(0, 3)` after the existing sortOrder ASC sort. Karlyne reorders in /admin/services to change which services surface as "top 3" per category.
  4. **Orphan handling:** services whose `category` field doesn't match any active `serviceCategories.name` fall into a synthetic "Other" bucket at the end so nothing disappears (defensive against partial Pabau syncs).
- **What Karlyne gets to control without a dev:**
  - Category names + ordering → `/admin/categories` (already shipped)
  - Which services appear as "top 3" → reorder via sortOrder in `/admin/services` (already shipped)
  - How many = N → currently hardcoded `TOP_PER_CATEGORY = 3` constant; trivial to expose later if she wants to tune
- **Files:** `src/app/services/ServicesPageClient.tsx` (added `CategoryGroups` component, branched render based on `activeCategory === "All" && !search`)
- **Verify:**
  - [ ] /services lands on category-grouped view, NOT the wall of 30+ services
  - [ ] Each active category shows up to 3 services + "View all" if there are more
  - [ ] Click "View all in [Category]" → page filters to that category and scrolls to grid
  - [ ] Click a category pill at top → flat grid for that category (existing behavior intact)
  - [ ] Search input → flat grid filtered by search (existing behavior intact)
  - [ ] Click a category in the flat-grid view back to "All" → returns to category-grouped view
  - [ ] No services missing — anything with a non-matching category surfaces under "Other"
- **Follow-ups if Karlyne wants more:**
  - Per-category hero image/background → would need `serviceCategories.imageUrl` + admin upload UI
  - Explicit "feature this service" toggle (instead of relying on sortOrder) → add `isFeatured` boolean + admin checkbox
  - Configurable N → expose `topPerCategory` as page-settings field

---

#### #7 — Hero has pink colors, doesn't match brand kit

- [x] **Status:** ⚠️ Partial fix shipped `0c67c72` (2026-05-09) — pending Karlyne approval, may need follow-up
- **Karlyne (verbatim):** _"the hero colors are pink, and those need to be changed too match my brand kit."_
- **Investigation:** Audited every CSS surface in the hero render path:
  - **CTA button** — espresso bg + cream text, no pink. (Fixed in #3 anyway.)
  - **Eyebrow/headline text** — `#f7f6eb` Silk cream, no pink.
  - **Decorative divider line** — Silk cream, no pink.
  - **Pink-adjacent palette tokens** (`--color-rose-dust`, `--gradient-hero-soft`) — defined in globals.css but **not actually applied to hero**. Confirmed via grep: `--gradient-hero-soft` is defined at line 75 and never referenced anywhere else.
  - **Gradient overlay** — pure espresso (`rgba(57,30,30,*)`) until the bottom hand-off, where it transitioned `0.25 espresso wash 92% → #ede8da solid 100%`. The `#ede8da` is technically yellow-cream (RGB 237,232,218) but **on warm-balanced displays it reads pinkish** — and the meandering 8% twilight zone leaks video color through.
  - **Video itself** (`/public/videos/hero-v2.mp4`) — possibly contains rose-toned frames. Without re-watching the video on her exact device + display I can't confirm. If pink persists after this fix, this is the cause.
- **Fix shipped:**
  1. Hold the espresso wash longer at the bottom (`0.25 → 0.55 alpha at 96%` instead of fading at 92%) — mutes any video color leaking through in the lower band.
  2. Hand-off color changed from `#ede8da` → `#F7F6EB` to exactly match `GLOBAL_DEFAULTS.surface` (the Silk used by the next section). Clean architectural seam, no pink twilight.
- **Files:** `src/components/sections/HeroSection.tsx` (lines 100-115)
- **Did NOT touch:** The unused pink-tinted tokens (`--color-rose-dust`, `--gradient-hero-soft`, `--gradient-warm-atmosphere`). They're not applied to the hero, and removing them risks breaking other future use cases. Documented as an opt-in cleanup if needed later.
- **Verify:**
  - [ ] Bottom edge of hero hands off cleanly to next section, no pink twilight band
  - [ ] No rose tones visible at the headline or CTA zone
- **If pink STILL visible after this fix → it's the video.** Options:
  1. Re-encode `hero-v2.mp4` with a desaturation/cool-tone filter applied (`ffmpeg -vf "hue=s=0.85,colorbalance=rs=-0.05"`) and bump version to `hero-v3.mp4` per CLAUDE.md procedure
  2. Replace the video entirely with neutral footage
  3. Lower the hero overlay opacity even more so video shows through less
  - **Need from Karlyne:** A screenshot of where she sees pink so we can confirm cause.

---

#### #8 — CTA buttons need rounded/softer corners

- [x] **Status:** ✅ Shipped `49c651a` (2026-05-09) — pending Karlyne approval
- **Karlyne (verbatim):** _"Make the buttons rounded and softer like the book now, book your consultation."_ _(She's pointing to her own buttons as the reference — she wants ALL buttons to match that softness.)_
- **Discovered current state:** `.btn-primary`, `.btn-outline`, `.btn-light` had **no border-radius set at all** (defaulted to 0 = sharp). The design system header comment in globals.css explicitly read "Sharp corners · No-line rule · Massive whitespace" — that was the original deliberate aesthetic.
- **Decision:** Pill shape (`border-radius: 999px`), not soft rectangle. Reasoning: alcoveaesthetics.com (the reference Karlyne sent for the footer redesign) uses pills. Most modern luxury med spa CTAs do (Glossier-adjacent aesthetic). Soft-rectangle would have felt half-hearted.
- **Approach:** Single CSS file change. Added `border-radius: 999px` to all three button utility classes. All site-wide CTAs (nav, hero, sections, footer, contact form, Pabau iframe link) inherit via class. No per-component changes needed.
- **Also updated:** Design-system header comment in globals.css now says "Pill-rounded buttons" instead of "Sharp corners" so future devs don't re-impose the old aesthetic.
- **Files:** `src/app/globals.css` (lines 11-14 comment, 312, 343, 367)
- **Verify:**
  - [ ] Home hero "Book Consultation" CTA — fully pill rounded
  - [ ] Nav CTA (top-right and mobile menu) — pill rounded
  - [ ] Footer CTAs — pill rounded
  - [ ] Contact form submit — pill rounded
  - [ ] Services CTA banner, About teaser CTA, Memberships CTA — all pill rounded
  - [ ] No "before/after" mismatch on any page (sharp corner anywhere = missed override)
- **Fallback if she wanted softer-rect not pill:** swap `999px` to `1rem` (16px) for soft rectangle, or `0.5rem` (8px) for gentle softening.

---

#### #9 — Mobile hero video shows play-button overlay (not autoplaying)

- [x] **Status:** ✅ Shipped `620a3a6` (2026-05-09) — pending Karlyne approval on a real iPhone
- **Karlyne (verbatim):** _"On the mobile version on the landing page the play button is showing on the video. It's not actively playing"_
- **Root cause:** iOS Safari sometimes refuses to autoplay even with the correct attributes (`autoPlay muted playsInline`) due to Low Power Mode, battery saver, or recent autoplay intervention rules. When that happens iOS renders its own play-button overlay on the paused video. The previous code relied entirely on the browser honoring the attributes — no fallback for the rejection case.
- **Three-part fix shipped:**
  1. **Explicit `videoRef.current.play()` in useEffect on mount** — wrapped in try/catch. iOS either accepts (video plays) or rejects with a Promise reject (we catch and set `videoFailed=true`).
  2. **`videoFailed` unmounts the entire `<video>` element** — the existing `{!videoFailed ? <video /> : null}` ternary now does its real job: if play() rejected, the `<video>` doesn't exist, so iOS has nothing to overlay a play button onto. Just the poster image renders, and that's a clean fallback.
  3. **`preload="metadata"` → `preload="auto"`** so iOS has enough buffered video to honor the autoplay attempt.
  4. **Defensive attributes** to kill any other native overlays: `disablePictureInPicture`, `disableRemotePlayback`, `controls={false}`.
- **Bandwidth tradeoff acknowledged:** `preload="auto"` loads the first few seconds of the ~15MB video on initial page load (not the whole thing). At MADE's projected traffic on Vercel Pro's 1 TB Fast Data Transfer bucket, well within budget. If we ever hit ceiling we can swap back to `preload="metadata"` and accept the iOS unreliability.
- **Files:** `src/components/sections/HeroSection.tsx` (added useRef + useEffect, updated `<video>` props)
- **Verify:**
  - [ ] iPhone Safari (real device, normal power): video autoplays, no play-button overlay
  - [ ] iPhone Safari (Low Power Mode ON): video DOESN'T play, but only the poster shows — no broken play-button overlay
  - [ ] Android Chrome: video autoplays
  - [ ] Desktop Chrome/Safari/Firefox: regression check — video still plays as before
- **If iPhone STILL shows play overlay after this:** Open Safari DevTools (Mac → iPhone via USB → Develop menu → iPhone → Inspect mademedspa.com). Console will show whether `videoRef.play()` rejected. If it rejected, our fallback should have hidden the video. If overlay still shows, something else is wrong — possibly an iOS bug or a browser extension.

---

#### #10 — Memberships nav link goes to /services

- [ ] **Status:** Not started — quick fix
- **Karlyne (verbatim):** _"When you go to the memberships, it doesn't link to the memberships. It only takes you to sevices."_
- **Diagnosis:** Likely the nav item in `src/components/layout/Navigation.tsx` has `href="/services"` instead of `href="/memberships"`. Possible the `/memberships` route doesn't exist yet and we silently fell back.
- **Approach:**
  1. Confirm `/memberships` route exists at `src/app/membership/page.tsx` (note: directory is singular `membership`)
  2. If route exists → fix nav `href`
  3. If route is plural mismatch → either rename folder or update href to `/membership`
- **Files:** `src/components/layout/Navigation.tsx`, possibly `src/app/membership/`
- **Verify:**
  - [ ] Click Memberships in nav → lands on /memberships (or /membership) page, not /services
  - [ ] Page renders her membership tiers (admin-managed content)

---

#### #11 — Pabau booking iframe is small / laggy

- [ ] **Status:** Not started — needs investigation
- **Karlyne (verbatim):** _"and when you go on to book an appointment, the Pabu booking is hidden. It doesn't take up the entire page and it looks like it's lagging. I don't know if we can fix that.."_
- **Two issues mixed:**
  1. **Sizing:** Iframe doesn't fill viewport — fixable on our side (CSS `width: 100%; min-height: 100vh` or similar)
  2. **Lag:** Could be Pabau's iframe being slow to load (their problem) or our iframe loading at low priority
- **Approach:**
  1. Inspect `src/app/booking/page.tsx` iframe styles → make it explicit full-width + tall enough that the embedded UI isn't clipped
  2. Add `loading="eager"` (currently may default to lazy) so it starts fetching immediately
  3. If lag is on Pabau's end, document it as an upstream limitation in the tracker; nothing further we can do
  4. Consider a skeleton loader while the iframe boots so the page doesn't feel broken
- **Files:** `src/app/booking/page.tsx`
- **Verify:**
  - [ ] /booking iframe fills the viewport edge-to-edge
  - [ ] Page doesn't show a tiny iframe with whitespace around it
  - [ ] Loading state (spinner or skeleton) shown until iframe interactive
  - [ ] Page auto-scrolls to iframe (already shipped — regression check)

### Open issues to circle back to

- [ ] **6 direct `uploadBlob()` callers don't pass `purpose`** — fall back to `"general"` (still compressed, just not the ideal target).
  - `src/components/admin/SectionEditorCard.tsx:124,134` — section bg / video poster
  - `src/components/admin/SectionDesignPanel.tsx:292` — section design bg
  - `src/app/admin/media/page.tsx:222` — media library
  - `src/app/admin/seo/page.tsx:148` — should be `"og"`
  - `src/app/admin/settings/page.tsx:209` — should be `"logo"`
  - `src/app/admin/settings/page.tsx:402` — should be `"background"`

### Production smoke (per-deploy ritual)

Quick happy-path click-through after each push to `main`. Aim for ~5 min.

- [ ] Home page loads, hero video plays (desktop + mobile), no console errors
- [ ] Nav links: About, Services, Memberships, Shop, Booking — each loads its own page
- [ ] `/booking` scrolls to Pabau iframe
- [ ] `/shop` grid + at least one `/shop/[slug]` detail
- [ ] `/admin` redirects to sign-in if signed out, loads dashboard if signed in
- [ ] One admin save round-trip (e.g. edit hero subtitle in `/admin/pages/home`, save, reload public site, see change)
- [ ] Footer renders, social links work, no broken images
- [ ] `view-source:` shows favicon `<link>` tags pointing at `/icon.png` + `/apple-icon.png`

---

## 📋 Session Log — 2026-05-04 to 2026-05-07

Captures work shipped to production. Some items here aren't represented in the Asana list (new work that came up mid-session).

### 2026-05-04 — Production cutover
- Switched Vercel Production from Clerk `pk_test_` to `pk_live_` keys
- Set `ADMIN_EMAILS` on Production (was missing entirely)
- Created Clerk Production instance, custom domain `clerk.mademedspa.com` via GoDaddy DNS (5 CNAMEs: clerk, accounts, clkmail, clk._domainkey, clk2._domainkey)
- Locked Clerk to Restricted signup mode + email/password (Google OAuth removed)
- Diagnosed + fixed: production Vercel was pointed at `energized-akita-520` Convex (dev-labeled) so all fixes to `grand-mole-440` (prod-labeled) were no-ops. Updated `convex/auth.config.ts` to register both Clerk issuers (dev + prod) so the same Convex deployment serves local dev (test Clerk) and production (custom domain) without breaking either.

### 2026-05-04 / 05 — Brand typography overhaul
- Killed global `h1-h6 { font-style: italic }` in `globals.css`. Italics now live ONLY on `.accent-quote` (testimonials, pull-quotes).
- H1 → Playfair Display, sentence case, no italic
- H2/H3 → Jost (later swapped to Glacial Indifference), ALL CAPS, letter-spacing 0.4em, weight 500
- Body → Montserrat 400, line-height 1.8
- Buttons + nav links → label style (Jost/GI uppercase)
- Stripped italic from 30+ headings across sections, page heroes, navigation, footer, accordion, page CTAs
- New `/admin/typography-spec` printable reference for client (annotated samples)

### 2026-05-05 — Service categories backend
- New Convex `serviceCategories` table (name, slug, sortOrder, isActive, pabauKeywords[], isDefault)
- `inferCategory()` now reads from DB at Pabau sync time (was hardcoded keyword map)
- New `categoryLocked` flag on services preserves admin overrides across syncs
- New `/admin/categories` page: add / rename / reorder / activate / delete + edit Pabau keyword list per category
- `/services` filter and `/admin/services` dropdown both pull from DB
- Migration path safe for production: seed via "Seed default categories" button on first load

### 2026-05-05 — Logo + footer + booking flow
- Brand logo SVGs (espresso/white) in `/public/images/`. Nav + Footer use them as default; admin upload still wins as override. Larger nav size (56px desktop, 44px mobile) for visual balance with CTA button.
- Footer rebuilt to match alcoveaesthetics.com pattern: single-column mobile with collapsible Menu accordion, three columns on desktop. No newsletter, no payment icons, no promo banner. Cut height by ~50%.
- Booking iframe gets `id="pabau-iframe"` + `scroll-mt-24`. All 11 CTA hrefs (4 hardcoded + 7 admin-editable defaults) updated to `/booking#pabau-iframe`.
- CTA copy standardized: "Book Consultation" replaces mixed "Book Appointment" / "Book Now" / "Book Your Consult". "Explore Services" replaces "View All Services" / "Browse Services" / "View Services".

### 2026-05-05 — CSP + Clerk custom domain allowlist
- Added `https://clerk.mademedspa.com` and `https://accounts.mademedspa.com` to `script-src`, `connect-src`, `frame-src` directives. Console no longer spams CSP report-only warnings on every page load.

### 2026-05-07 — Shop redesign + Glacial Indifference
- Drop side-by-side "Provider Favorites" (was forcing square photos into rectangle). Single unified grid: 2 cols mobile / 3 tablet / 4 desktop. Square aspect ratio with `object-contain` + neutral padding so any product shape renders intact.
- Cards minimal: image + category + name + price + "View" arrow. Description moved to detail page.
- New `/shop/[slug]` product detail page with `getBySlugOrId` query (slug derived from name on the fly, no schema migration). Two-column desktop layout, full description, Pabau CTA.
- Swapped Jost → Glacial Indifference for headers/labels (loaded from `fonts.cdnfonts.com` via @import). Added `fonts.cdnfonts.com` to CSP `style-src` + `font-src`. Tried weight 400 (thinner) but reverted to 500 per client feedback.
- Mission body text bumped to `text-lg md:text-xl`.
- Adaptive team section: 1 person → editorial spotlight, 2/3/4+ → progressively wider grid.

### 2026-05-07 — Image compression on every admin upload
- Karlyne uploads any size — `browser-image-compression` resizes + compresses in a Web Worker before Vercel Blob upload.
- Per-purpose specs from launch-readiness handoff: service photo 1600px ~400KB WebP, product 1200px ~300KB WebP, headshot 1200px ~400KB WebP, avatar 400px ~100KB WebP, background 2400px ~500KB WebP, OG 1200px ~300KB JPEG, logo pass-through, general fallback 2000px ~500KB WebP.
- SVG / GIF / video skip compression. Compression failure falls back to original (uploads never break).
- Wired `purpose` prop through `<ImageUpload>` component + every direct `uploadBlob` callsite.

### Cleanup not in Asana
- Pushed everything to `main` (was sitting on a feature branch for days; production was running ahead of git history)
- Added `/assets/` to `.gitignore` (32MB local-only brand reference PDFs)
- Fixed CSS @import order — Tailwind v4 inlines its ruleset, so font @imports must come before `@import "tailwindcss"`
- Set `images.unoptimized` in dev mode (large blob photos were timing out the dev image proxy — production unchanged)

---

## 🔴 P0 — Launch Critical (must-fix before / immediately after launch)

- [x] **[P0 LAUNCH-CRITICAL] Switch Vercel from pk_test_ to pk_live_ Clerk keys before launch**
  - _✅ Done_ — 2026-05-04 — keys swapped via Vercel CLI; production redeployed.
  <details><summary>Original Asana notes</summary>

> Live mademedspa.com is currently running with **Clerk development keys** (pk_test_ / sk_test_). Browser console shows the warning every page load:
> 
> > Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production.
> 
> **Why this matters at launch:**
> - Clerk dev instances cap at low MAU (typically ~100 active users)
> - Rate limits on sign-ins/sign-ups are aggressive
> - Sessions can be invalidated unexpectedly
> - The `convex` JWT template we just created lives in the **Development** Clerk instance — it will NOT carry over to the Production Clerk instance. Same for users (Karlyne's account doesn't *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P0 Lessons] Document Clerk JWT template requirement in onboarding docs**
  <details><summary>Original Asana notes</summary>

> Critical lesson learned 2026-04-27: the Clerk-Convex auth chain was completely broken until we manually created a JWT template named `convex` in Clerk dashboard.
> 
> **Without this template:**
> - ConvexProviderWithClerk silently fails to fetch a JWT for Convex calls
> - Every Convex mutation receives an unauthenticated request
> - ctx.auth.getUserIdentity() returns null
> - The Apr-19 main code was effectively allowing **anonymous writes to siteContent.upsert and any other admin mutation** — anyone in the world with the Convex URL could have edited the CMS without being signed in
> 
> The `assertAdmin` gate added this session is what surfaced this hole. Pre-launch, both must be in place: assertAdmin (code *(truncated — see Asana export JSON)*

  </details>

- [x] **[P0 Personal — Philip] Fix /admin/pages/home Primary Button Link from `/book` to `/booking`**
  - _✅ Done_ — Section defaults updated to /booking#pabau-iframe in src/lib/sectionDefinitions.ts.
  <details><summary>Original Asana notes</summary>

> Live site mademedspa.com/ has a 404 on `/book` because the home hero CTA's Primary Button Link in Convex siteContent is `/book` (typo) instead of `/booking`.
> 
> Admin uploads/saves work now (the JWT template fix unblocked everything). 30-second fix:
> 
> 1. Sign in to mademedspa.com/admin
> 2. Go to Edit Pages → Home
> 3. Find the Hero section
> 4. Change Primary Button Link from `/book` → `/booking`
> 5. Save
> 
> Verify: refresh mademedspa.com/, click 'Book Your Appointment' — should go to /booking instead of 404.
> 
> Also added a permanent /book → /booking redirect to next.config.ts (commit 0d29ab5) as defense against future typos. But that redirect only takes effect after the feature branch deploys to prod — *(truncated — see Asana export JSON)*

  </details>

- [x] **🚨 [P0 LAUNCH-BLOCKING] Create 'convex' JWT template in Clerk PRODUCTION instance**
  - _✅ Done_ — Auth queries work in admin → template exists. Verify in Clerk dashboard if anything breaks.
  <details><summary>Original Asana notes</summary>

> **Lesson learned 2026-04-27:** The Clerk-Convex auth chain was completely broken in the dev instance until we created a JWT template named 'convex' in Clerk Dashboard → Configure → JWT Templates. Without this template:
> - Clerk's `useAuth()` doesn't issue a JWT for Convex calls
> - Convex receives unauthenticated requests
> - `ctx.auth.getUserIdentity()` returns null
> - `assertAdmin` rejects every admin write
> 
> **The Apr-19 main code 'worked' only because no mutation actually checked auth — anyone in the world with the Convex URL could write to siteContent.upsert without being signed in.** That's a serious pre-launch security hole that's now closed by `assertAdmin`, but only if the JWT template exi *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P0 Operational] Plan ownership transfer to Karlyne (post-launch, 2-4 weeks after live)**
  <details><summary>Original Asana notes</summary>

> Vision: Karlyne ends up owning ALL infrastructure/credentials so Philip can step away cleanly.
> 
> Current ownership state (everything is on Philip's accounts):
> - GitHub repo: github.com/Pbein/MADE-MedSpa
> - Convex deployment: dev:energized-akita-520 (Philip's Convex team)
> - Vercel project: under Philip's Vercel account
> - Clerk app: KarklyneMedSpa under Philip's Clerk workspace
> - Domain DNS: ??? (verify who registered mademedspa.com)
> - Pabau API key: ✅ already Karlyne's
> 
> **Transfer plan (do 2-4 weeks AFTER launch is stable, not before):**
> 
> Why not before: Philip knows the system, Karlyne doesn't — if anything breaks during transfer, having Philip own the platforms means quick fixes. Also avoids *(truncated — see Asana export JSON)*

  </details>

- [x] **[P0 Security] Lock Clerk to Restricted signup mode (no public signups)** *(was due 2026-04-30)*
  - _✅ Done_ — 2026-05-04 — done manually in Clerk dashboard.
  <details><summary>Original Asana notes</summary>

> Currently the Clerk app is in Public signup mode — anyone can create an account on KarklyneMedSpa even though only Karlyne + Philip should ever access /admin. The email allowlist blocks them at 403 once they try to navigate to /admin, but the random Clerk account still exists.
> 
> Fix: Clerk dashboard → Configure → User & Authentication → Sign-up modes → Restricted.
> 
> With Restricted:
> - New users can ONLY sign up if explicitly invited via Clerk's invitation system
> - Karlyne + Philip are already signed in — not affected
> - If marketing team adds a new admin, send them a Clerk invitation, they sign up via the invitation link
> 
> Why: defense-in-depth. The email allowlist is still in place (and should *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P0 Process] Document the 'shared dev Convex powers production' gotcha + checklist**
  - _ℹ️_ — We hit this exact issue on 2026-05-05 — production Vercel pointed at energized-akita-520 (the 'dev' Convex deployment) so all my fixes to grand-mole-440 (the 'prod' deployment) were no-ops until I realized. Auth.config.ts now supports both Clerk issuers via dual-env-var pattern. Documentation still TODO.
  <details><summary>Original Asana notes</summary>

> Lesson from this session: production mademedspa.com Vercel deploy uses the dev:energized-akita-520 Convex deployment because Convex prod hasn't been created yet. This means:
> 
> - Schema changes pushed via `npx convex codegen` are LIVE on prod immediately
> - Mutations added to dev Convex affect prod traffic
> - Security gates added to mutations affect prod even without deploying Next.js
> 
> What almost happened: Worker A's assertAdmin gate went live on dev Convex when we ran codegen, BEFORE the matching Next.js middleware was deployed. If a real visitor tried to do something admin (which they couldn't, since they aren't signed in), it would have failed silently. More concerning: the original Apr-19 p *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P0 Auth] Update Clerk JWT template to include email claim (long-term proper fix)**
  <details><summary>Original Asana notes</summary>

> Lesson from this session: Convex's assertAdmin couldn't read identity.email because Clerk's default 'convex' JWT template only includes the audience claim. We worked around this by also accepting Clerk user IDs (subject) in the allowlist — but the proper fix is having email in the JWT.
> 
> Steps in Clerk dashboard:
> 1. Configure → JWT Templates → 'convex' template
> 2. Edit the Claims JSON — currently:
>    {
>      "aud": "convex"
>    }
> 3. Change to:
>    {
>      "aud": "convex",
>      "email": "{{user.primary_email_address.email_address}}"
>    }
> 4. Save
> 5. Force re-sign-in (sign out + back in) to get a fresh JWT with the email claim
> 
> Verify: hit any admin mutation — the Convex logs will show identity.emai *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P0 Pabau] Verify packages widget + Book Now button work with new slug `made-med-spa`**
  <details><summary>Original Asana notes</summary>

> Follow-up after Pabau fixed the booking slug (2026-04-27). The widget URLs the client texted earlier referenced the OLD slug `made-51g64`. Confirm both still work — or are now broken — with the new slug.
> 
> **Test in incognito:**
> 
> 1. Book Now button widget:
>    https://pabau.com/widgets/online-bookings/book-now-button.js?company_slug=made-med-spa
>    - Should return JS that renders a Book Now button
>    - When clicked, deep-links should now resolve (not 'account doesn't exist')
> 
> 2. Packages widget:
>    https://pabau.com/widgets/pabau-packages.js?slug=made-med-spa
>    - Should return JS that renders membership packages
>    - Empty state acceptable IF Karlyne hasn't created any packages with sold_onli *(truncated — see Asana export JSON)*

  </details>

- [x] **[P0 Discovery] Get logo PNG from Karlyne**
  - _✅ Done_ — Files in /assets (gitignored) + /public/images/. SVG preferred.
  <details><summary>Original Asana notes</summary>

> Blocking the logo upload feature we built (admin /admin/settings).
> 
> Ask Karlyne for:
> - PNG with transparent background
> - 2x resolution preferred (e.g., 600x200 or higher)
> - Mid-tone palette ideally (the nav has both light and dark backgrounds across pages — a single logo color won't look great on both)
> 
> If she has only a colored logo (espresso/dark logo on light bg, or white/cream logo on dark bg):
> - Get whichever color matches the cream/silk nav (most common state)
> - Flag that we may need a 2-variant solution post-launch (light + dark version) — already noted in launch task list as future-paid follow-up
> 
> Once received: drop file in /admin/settings logo card and verify nav + footer render co *(truncated — see Asana export JSON)*

  </details>

- [x] **[P0 Personal — Philip] Update Karlyne's email reference everywhere it was assumed wrong**
  - _✅ Done_ — ADMIN_EMAILS includes karlyne08@gmail.com on Production.
  <details><summary>Original Asana notes</summary>

> Confirmed via Clerk dashboard 2026-04-27: Karlyne's actual email is `karlyne08@gmail.com` (NOT `karlyne@mademedspa.com` which was assumed in earlier docs).
> 
> Updated this session:
> - Convex dev ADMIN_EMAILS: ✅ set with correct value
> - .env.local ADMIN_EMAILS: ✅ set with correct value
> 
> Still needs review:
> - docs/PRODUCTION-DEPLOYMENT.md — the assumed `karlyne@mademedspa.com` example value in the ADMIN_EMAILS table row. Replace with placeholder like `<her-email>@gmail.com` or just `<karlyne-clerk-email>` to avoid hardcoding.
> - Any email templates we drafted (the support ticket email mentioned this domain)
> - Auto-memory entries about Karlyne (if any reference an email)
> 
> When production cutover ha *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P0 Process] Add 'Convex env vars set first' to deployment runbook checklist**
  <details><summary>Original Asana notes</summary>

> Lesson from this session: Worker A's `assertAdmin` mutations went live on Convex dev when codegen ran, but ADMIN_EMAILS wasn't set yet → every admin write rejected. Karlyne (or anyone signing in) would have hit this in production if we'd cut over without setting the env var first.
> 
> Update docs/PRODUCTION-DEPLOYMENT.md to make this airtight:
> 
> 1. **Reorder Step 1 (Convex Production Deployment):** before running `npx convex deploy --prod`, run `npx convex env set ADMIN_EMAILS "..." --prod` AND any other env vars Convex needs (PABAU_API_KEY, PABAU_API_BASE_URL, etc.)
> 2. **Add to Pre-Flight Checklist:** "Confirmed all required Convex env vars staged"
> 3. **Add to Step 6 Smoke Test:** "Sign in as a *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P0 Personal — Philip] Test lead 3029083 cleanup confirmation**
  <details><summary>Original Asana notes</summary>

> Verify the test lead `SMOKETEST DELETE-ME` (lead_id 3029083) created by Worker G during smoke-test development is deleted from Pabau Leads list.
> 
> If still there: delete it manually. If gone: mark this task complete.
> 
> While in Pabau, also delete any other lead test data created during this session's testing (e.g., 'Jane Doe' / 'TEST Philip' leads from contact form testing).
> 
> ~2 min.

  </details>

- [ ] **[P0 Personal — Philip] Run the Tier 1-6 test plan on dev now**
  <details><summary>Original Asana notes</summary>

> Test plan from prior message in this session. Booking is now unblocked (slug fixed). Run through these on localhost (npm run dev) before merging to main:
> 
> **Tier 1 — Smoke (5 min):**
> - Localhost loads, all public pages render, /accessibility footer link works, /admin loads + Pabau Sync works
> 
> **Tier 2 — Booking + CTAs (10 min) [NEWLY UNBLOCKED]:**
> - Home Book CTA → /booking → Pabau loads with services
> - /booking page Book CTA → Pabau loads
> - Membership tier 'Get Started' → Pabau loads (each tier)
> - Service detail page Book CTA → Pabau loads
> - Footer + nav Book buttons → Pabau loads
> 
> **Tier 3 — Pabau lead pipeline (5 min):**
> - /contact form submits → lead arrives in Pabau Leads
> - Eyebrow labe *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P0 Vercel cutover] Update NEXT_PUBLIC_PABAU_BOOKING_URL on Vercel to new slug**
  <details><summary>Original Asana notes</summary>

> Current Vercel value is stale: `https://partner.pabau.com/online-bookings/made-51g64`
> 
> Update to: `https://partner.pabau.com/online-bookings/made-med-spa`
> 
> Locations:
> - Vercel → Settings → Environment Variables → Production scope
> - Vercel → Settings → Environment Variables → Preview scope (if used for preview deploys)
> 
> After setting, trigger a redeploy (push or click Redeploy) so the new value is picked up.
> 
> Note: this matters now because production mademedspa.com Vercel deploy still serves the Apr-19 code which references that env var directly via `process.env.NEXT_PUBLIC_PABAU_BOOKING_URL`. Until our feature branch is merged AND the env var is updated, prod Book CTAs are broken.

  </details>

- [ ] **[P0 Cleanup] Delete test lead from Pabau (lead_id 3029083, name SMOKETEST DELETE-ME)**
  <details><summary>Original Asana notes</summary>

> Worker G's smoke-test script ran during build verification and inadvertently created a real lead in Pabau:
> - Lead ID: 3029083
> - Name: SMOKETEST DELETE-ME
> - Email: smoketest@example.com
> - Phone: 555-0100
> - Source: Official Website - MADE
> 
> Delete it from Pabau Leads list. ~30 seconds.
> 
> Follow-up considerations for the smoke test (separate tasks worth filing):
> 1. Gate probe 9 (real lead creation) behind --include-write-probes flag so npm run smoke is read-only by default
> 2. Add Pabau-side filter that auto-archives leads where firstName='SMOKETEST'
> 3. Long-term: extend /api/pabau/leads route to accept dryRun:true flag that validates without persisting
> 
> Recommend (1) before any CI integration of *(truncated — see Asana export JSON)*

  </details>

- [x] **[P0] Comprehensive CTA + link audit — every clickable on the site**
  - _✅ Done_ — 2026-05-05 — Audited all hrefs. Standardized 'Book Consultation' (was mixed Book Appointment/Now/Consult). Standardized 'Explore Services' (was View All/Browse). All /booking CTAs updated to /booking#pabau-iframe so they scroll to the iframe.
  <details><summary>Original Asana notes</summary>

> Once the booking URL is resolved, walk every page and confirm every clickable goes somewhere working. Catch the long tail of broken links before launch.
> 
> File a follow-up task per broken link. Do this ON STAGING (not prod) right after deploy.
> 
> Check per page:
> 
> **Home (/):**
> - Hero CTA → booking? confirm working
> - Hero secondary 'Explore Services' → /services
> - Featured services 'View All' → /services
> - About 'Discover Our Method' → /about
> - Testimonial section CTA
> - Bottom CTA banner buttons
> 
> **Services (/services + /services/[slug]):**
> - Each service card 'View' → /services/[slug]
> - Each service detail page 'Book' → specific Pabau URL working?
> - 'Back to all services'
> - Bottom CTA
> 
> **Member *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P0 Discuss] Clarify admin About section claim with client**
  <details><summary>Original Asana notes</summary>

> Client said admin portal 'is missing the about section.' VERIFIED: the About editor exists at /admin/pages/about with full section editing (hero, story, mission, values, team, CTA). It's nested under 'Edit Pages' → click the About card.
> 
> Action:
> 1. Send her a short Loom or screenshot showing where it is (under Edit Pages → About)
> 2. Ask her to clarify what specifically she expected to see — possible interpretations:
>    - She didn't find it (discoverability issue → rename or surface better)
>    - She wanted About as a top-level sidebar item (5-min change)
>    - She wanted a SPECIFIC sub-thing (Karlyne's bio? team management? mission statement?) and didn't realize that's what 'About' covers
>    - *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P0 Backups] Confirm Convex PITR + content export script**
  <details><summary>Original Asana notes</summary>

> If something nukes admin content (bad migration, accidental delete), we need recovery.
> 
> 1. **Convex Point-in-Time Recovery:**
>   - Check if PITR is enabled for the prod deployment (Convex dashboard → Settings)
>   - If not on a paid plan, upgrade to enable (probably required for this client)
>   - Document recovery procedure in docs/PRODUCTION-DEPLOYMENT.md (how to restore to a timestamp)
> 
> 2. **Admin content export script** (scripts/export-admin-content.mjs):
>   - Export all admin-managed Convex tables to JSON: services, faqs, teamMembers, testimonials, memberships, shopProducts, siteContent
>   - Save to docs/backups/<date>.json
>   - Run weekly via GitHub Actions cron (or as a Convex scheduled actio *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P0 Testing] Critical-path tests: Pabau webhook receiver**
  <details><summary>Original Asana notes</summary>

> Webhooks are the engine for keeping site data in sync. If signature verification breaks or idempotency fails, we either accept forged events or double-process real ones.
> 
> Tests required:
> 
> 1. verifyPabauUrlToken:
>   - Returns ok=false when token missing
>   - Returns ok=false when token length differs from secret (defeats length-comparison side-channel)
>   - Returns ok=true when constant-time match
>   - Returns ok=false when token byte differs (timing-safe)
> 
> 2. normalizeAction in /api/pabau/webhooks/[token]/route.ts:
>   - 'created' → 'create'
>   - 'updated' → 'update'
>   - 'deleted' → 'delete'
>   - 'won' / 'lost' / 'reopen' → 'update'
>   - 'canceled' / 'reschedule' / 'blockout_canceled' → 'update'
>   - *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P0 Pre-launch] Schema validation + OG preview check**
  <details><summary>Original Asana notes</summary>

> Validate structured data is parseable by Google before launch. Bad schema = no rich results.
> 
> Steps:
> 1. Run https://search.google.com/test/rich-results against the production URL once cutover is done. Check:
>   - LocalBusiness / MedicalBusiness schema in src/app/layout.tsx renders correctly with geo coords + areaServed cities
>   - FAQ schema on /faq page renders
>   - No errors or warnings
> 
> 2. Run https://www.opengraph.xyz/ against / and /services and /contact. Confirm:
>   - OG image renders (mademedspa.com OG image, not placeholder)
>   - Title and description match the page
>   - Twitter Card preview looks right
> 
> 3. Verify sitemap.xml at /sitemap.xml lists all public pages (services subpages, etc.) *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P0 Cutover] Verify SSL + redirects post-deploy**
  <details><summary>Original Asana notes</summary>

> After production cutover (separate task), validate the domain side:
> 
> - HTTPS enforced on https://mademedspa.com (curl http://mademedspa.com → 301 to https)
> - www → apex redirect: https://www.mademedspa.com → https://mademedspa.com
> - SSL cert valid + auto-renewing (Vercel handles this; verify cert chain on https://www.ssllabs.com/ssltest/, target A+)
> - No mixed-content warnings (all images/scripts loaded over https)
> - All sitemap URLs use https + apex domain
> - Canonical URLs (in <head>) point to apex https
> 
> Also:
> - Email DNS records (SPF, DKIM, DMARC) present if she sends email from @mademedspa.com
> - DNS records documented somewhere safe (1Password / handoff doc) so client can transfer if reg *(truncated — see Asana export JSON)*

  </details>

- [~] **[P0 Security] Add security headers (CSP, HSTS, X-Frame-Options)**
  - _⚠️ Partial_ — HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CSP all in next.config.ts. Still in Report-Only — flip to enforced after 1 week soak.
  <details><summary>Original Asana notes</summary>

> Currently the site relies on Vercel/Next defaults. Add explicit security headers for production.
> 
> In next.config.ts (under headers()):
> - Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
> - X-Frame-Options: DENY (or SAMEORIGIN if we ever embed our own)
> - X-Content-Type-Options: nosniff
> - Referrer-Policy: strict-origin-when-cross-origin
> - Permissions-Policy: camera=(), microphone=(), geolocation=() — disable APIs we don't use
> - Content-Security-Policy: start in report-only mode for 1 week, then enforce
>   - Allow: self, Convex domains, Clerk domains, Google Maps embed, Pabau iframe (for booking)
>   - This is the trickiest one — start permissive then tighten
> 
> Also audit:
> - N *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P0 Handoff] Admin walkthrough video + /admin/system guide update**
  <details><summary>Original Asana notes</summary>

> Marketing team needs to be self-sufficient. Two deliverables:
> 
> 1. **Walkthrough video** (5-10 min screen recording):
>   - How to edit a service (and which fields are Pabau-locked vs site-only)
>   - How to feature/hide a Pabau review
>   - How to check sync health on /admin/pabau
>   - What to do if /admin/pabau/webhooks shows failures
>   - How to update /privacy or /terms text via /admin/pages
>   - Where leads now live (Pabau, not /admin/contacts after E1 cleanup)
> 
> 2. **/admin/system guide page update** (src/app/admin/system/page.tsx):
>   - Replace any 'edit services here' copy with 'services live in Pabau'
>   - Add troubleshooting tree: 'service not showing? → check webhook log → check sync timestamp *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P0 Testing] Set up Vitest + test scaffolding**
  <details><summary>Original Asana notes</summary>

> We have zero automated tests. Set up the minimum repeatable harness so the critical-path tests below have somewhere to live.
> 
> Steps:
> - Install vitest + @vitest/ui + happy-dom (lightweight DOM env)
> - Add `test`, `test:watch`, `test:ui` scripts to package.json
> - Create vitest.config.ts with path aliases matching tsconfig (@/lib, @/components)
> - Create tests/ directory with subfolders: tests/lib/pabau, tests/api, tests/components
> - Add .github/workflows/test.yml (or skip if not using GH Actions yet) — at minimum, add a 'pretest' lint step
> - Add convex-test for Convex query/mutation tests if it's worth it (otherwise skip — Convex internal logic is mostly thin)
> 
> Deliverable: `npm run test` passes *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P0 Testing] Critical-path tests: Pabau lead pipeline**
  <details><summary>Original Asana notes</summary>

> The lead form is the single most important conversion surface. If it breaks silently, leads vanish.
> 
> Tests required:
> 
> 1. validateLeadInput (src/lib/pabau/schemas/lead.ts):
>   - Rejects missing firstName/lastName/email/message
>   - Rejects invalid email
>   - Rejects oversized message (>5000 chars)
>   - Trims and normalizes (email lowercased, phone trimmed)
>   - Marketing consent default = false when omitted
> 
> 2. leadInputToPabauPayload:
>   - Maps treatment_interest to custom_fields
>   - Sends lead_source as numeric value (not string)
>   - Sets all six aliases (lead_source, lead_source_id, marketing_source, etc.)
> 
> 3. /api/pabau/leads route handler (mock fetch):
>   - 200 + lead_id on success
>   - 400 + fi *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P0 Monitoring] Error tracking setup (Sentry or Vercel)**
  <details><summary>Original Asana notes</summary>

> Currently we'd never know if production is throwing errors. Pick one:
> 
> **Option A — Sentry (recommended):**
> - @sentry/nextjs SDK
> - Free tier: 5k errors/mo, plenty for a low-traffic med spa
> - Source maps uploaded on build
> - Captures Convex action errors, API route errors, client-side errors
> - Email/Slack alerts on new error types
> 
> **Option B — Vercel Observability (built-in):**
> - Already enabled if on Pro plan
> - Less detail but zero setup
> - Decent for getting started
> 
> Minimum acceptance: an artificially-thrown error in /api/pabau/leads is visible in the dashboard within 1 minute, with stack trace.
> 
> Also wire alerting:
> - Slack/email on any 5xx in /api/pabau/* routes (the Pabau pipe is the risk *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P0 Pre-launch] Mobile + cross-browser QA pass**
  <details><summary>Original Asana notes</summary>

> Test the full user flow on real devices/browsers — not just Chrome desktop. Med spa clientele skews iPhone Safari + older Android. Catches issues automated tests can't.
> 
> Devices/browsers minimum:
> - iPhone Safari (latest iOS)
> - iPhone Safari (1 version older)
> - Android Chrome
> - Desktop Safari (macOS)
> - Desktop Firefox
> - Desktop Edge
> 
> Flows on each:
> - Home → nav, video plays, CTAs tappable
> - Contact form → fill + submit (use a unique test name like 'QA-Safari-iPhone' so we can identify in Pabau)
> - Booking CTA → Pabau loads in new tab
> - Map embed → tap 'Get Directions' → opens native maps app
> - Hamburger nav (mobile) → opens, all links work
> 
> Bugs file as separate tasks tagged [P0 QA].

  </details>

- [ ] **[P0 Testing] Smoke-test script for post-deploy validation**
  <details><summary>Original Asana notes</summary>

> After every production deploy, run this single command to verify the integration is alive. Prevents silent prod regressions.
> 
> Deliverable: scripts/smoke-test.mjs that does (against production URL):
> - GET / → 200
> - GET /contact → 200, page contains 'Tell us a little about you'
> - GET /api/pabau/lead-sources → 200 ok=true (auth env vars set in prod)
> - POST /api/pabau/leads with deliberately invalid payload → 400 fieldErrors
> - POST /api/pabau/webhooks/<wrong-token> → 401
> - POST /api/pabau/webhooks/<correct-token> with valid test event → 200, eventId in response
> - GET /admin/pabau/webhooks (after Clerk auth) → page contains the test event
> 
> Usage: `node scripts/smoke-test.mjs https://mademedspa.co *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P0 Pre-launch] Lighthouse + Core Web Vitals + a11y audit**
  <details><summary>Original Asana notes</summary>

> Run Lighthouse against production for /, /services, /membership, /shop, /testimonials, /contact, /faq. Target: 90+ on Performance, 95+ on Accessibility, 100 on SEO and Best Practices. Capture initial scores as baseline.
> 
> Must-fix issues before launch:
> - Accessibility violations (color contrast on the espresso/blush combos, button labels, image alt text, form label associations)
> - Largest Contentful Paint > 2.5s on mobile (likely the hero video)
> - Cumulative Layout Shift > 0.1 (motion/framer animations can cause this)
> 
> Nice-to-fix:
> - Total bundle size warnings
> - Unused JavaScript (likely framer-motion if used sparingly)
> 
> File a follow-up task per failure that can't be fixed in this pass.

  </details>

- [ ] **[P0 Content] Fill remaining client data in admin (address, hours, phone, socials, headshot, service images)**
  <details><summary>Original Asana notes</summary>

> Launch-info doc has all values, just needs paste:
> - Footer phone is empty (seed.ts:663-664 has phone: '' / phoneHref: '') — confirm number with client and seed
> - Real headshot for Karlyne (currently no imageUrl on team member)
> - Real images on services (most have no imageUrl)
> - Verify Instagram + TikTok URLs in business_info siteContent are correct
> - Confirm address: 1311-A Dolley Madison Blvd, Suite 1B, McLean, VA 22101

  </details>

- [x] **[P0] Production cutover — Convex + Clerk + Vercel env**
  - _✅ Done_ — 2026-05-04 — Clerk pk_live_/sk_live_ pushed, ADMIN_EMAILS set on Production, Convex CLERK_FRONTEND_API_URL_DEV + _URL set, dual-issuer auth.config.ts deployed.
  <details><summary>Original Asana notes</summary>

> Site is live on mademedspa.com but pointed at dev:energized-akita-520 Convex and pk_test Clerk keys. Real visitors are hitting dev infra; arbitrary signups via dev Clerk = compounds the admin-allowlist hole.
> 
> Follow docs/PRODUCTION-DEPLOYMENT.md Steps 1–5. Add a step the runbook misses: export current dev Convex data first (services edits, siteContent, business_info) so seeding prod doesn't lose what's already in dev.
> 
> DO NOT deploy until: Pabau env vars resolved (lead source ID, webhook secret), admin allowlist shipped, _generated/api.d.ts + schema.ts + services.ts + shopProducts.ts changes committed.

  </details>

- [ ] **[P0 Compliance] Update privacy policy with Pabau processor disclosure**
  <details><summary>Original Asana notes</summary>

> Per pabau-integration-plan.md S2.6, paste this paragraph into Convex siteContent.privacy_policy via /admin/pages:
> 
> 'When you submit a form on our website, your information is transmitted directly to our patient management system (Pabau) where it is securely stored and managed by MADE Med Spa staff. We do not retain a separate copy on our website.'
> 
> Current privacy policy already mentions Pabau as third-party processor — confirm this paragraph is additive or replaces the existing Pabau line, then have client approve.

  </details>

- [ ] **[P0 Pabau] End-to-end smoke test integration on staging**
  <details><summary>Original Asana notes</summary>

> After PABAU_LEAD_SOURCE_ID is confirmed (250922 == 'Official Website - MADE'):
> - Submit a real form on staging, verify lead arrives in Pabau with right source ID
> - Trigger a Pabau webhook test for client/lead/booking, verify each lands in /admin/pabau/webhooks as 'processed'
> - Submit form with PABAU_API_KEY unset → mailto fallback button appears with prefilled body
> - Hit /api/pabau/leads 6× from one IP → 6th returns 429
> 
> ~30 min total.

  </details>

- [x] **[P0 Security] Add admin email allowlist in middleware + Convex mutations**
  - _✅ Done_ — Already in place; verified working when /admin loaded post-cutover.
  <details><summary>Original Asana notes</summary>

> Currently src/middleware.ts only calls auth.protect() — any signed-in Clerk user can access /admin. The admin layout has no role check, and the users table has a `role` field that nothing reads.
> 
> Fix:
> - Add ADMIN_EMAILS env var (comma-separated)
> - In middleware, after auth.protect(), pull session claim email and 403/redirect if not in list
> - Mirror the same allowlist check at the top of every Convex mutation that writes admin-managed data (services, memberships, shopProducts, siteContent, etc.) — middleware does not run on Convex calls
> 
> Verify: sign in with a non-allowlisted gmail → bounced from /admin and Convex mutations reject.

  </details>

- [ ] **[P0] User-flow click-test on production (smoke test)**
  <details><summary>Original Asana notes</summary>

> Document and walk through these flows after prod cutover. Minimum:
> - Home → every nav link loads
> - Home → 'Book consultation' → Pabau booking page loads with services visible
> - Membership → each tier 'Get Started' → goes somewhere coherent
> - Services → individual service page → 'Book' CTA → Pabau
> - Shop → product → 'Shop' / 'Inquire' → coherent destination
> - Footer → phone (works), email (mailto opens), Instagram, TikTok
> - Contact form → submit valid → 'Thank you'; submit with no Pabau key → mailto fallback
> - /privacy, /terms, /faq, /about, /testimonials render
> - 404 on a bad URL renders a real 404 page
> 
> File every issue as a follow-up task.

  </details>

- [ ] **[P0 Pabau] Fix broken purchase links — use Pabau widgets/booking URLs (CLIENT-PROVIDED)**
  <details><summary>Original Asana notes</summary>

> Membership tiers + shop products fall back to NEXT_PUBLIC_PABAU_BOOKING_URL (consultation page) which causes 'this account doesn't exist' errors when clicked. Most services also have unset pabauBookingUrl.
> 
> **UPDATE 2026-04-26:** Client provided two embed assets:
> 
> 1. **Booking iframe:** https://partner.pabau.com/online-bookings/made-51g64
> 2. **Packages widget (script):**
> <div class="pabauPackages" style="width:100%">
>   <script src="https://pabau.com/widgets/pabau-packages.js?slug=made-51g64"></script>
> </div>
> 
> **New approach per asset:**
> 
> **Memberships (/membership):** the packages widget IS the answer. Embed it on the membership page. Each tier 'Get Started' click is now handled inside the w *(truncated — see Asana export JSON)*

  </details>

- [~] **[P0 Design] Apply final design spec from client (delivered 2026-04-27)**
  - _⚠️ Partial_ — Typography sweep done (Playfair / Glacial Indifference / Montserrat, ALL CAPS H2/H3 0.4em, no italic on headers). Brand colors verified vs spec. Logo integrated. Shop redesigned. Footer compacted. Some sections may still need polish per the 21MB Visual Branding Guide PDF (too big for me to read — extract pages if needed).
  <details><summary>Original Asana notes</summary>

> Client receives final design spec (fonts, colors, etc.) from design team on 2026-04-27 and forwards to us. Most of the site already uses CSS custom properties (--color-espresso, --color-blush, etc.), so this should be a config change in src/app/globals.css + Tailwind theme + font swaps in layout.tsx — not page-by-page rewrites.
> 
> Allocate Day 4 (2026-04-29) to apply changes once spec is in hand. Triage any structural changes vs token swaps.

  </details>

- [ ] **[P0] Cross-check site services against MADE Med Spa Services.xlsx**
  <details><summary>Original Asana notes</summary>

> Client provided docs/Client Returned/MADE Med Spa Services.xlsx showing which services should be bookable online vs hidden from the site. Audit current services list against that sheet:
> - Hide services flagged as not-online-bookable (set isActive=false or add a `showOnSite` flag)
> - Confirm online-bookable services have a working pabauBookingUrl
> - Reconcile any service in Pabau missing from the site (or vice versa)
> 
> Coordinate with Pabau sync — ideally services sync from Pabau and the spreadsheet just informs which to hide.

  </details>

- [ ] **[P0 Pabau] Register live webhook URL in Pabau, retire dev secret**
  <details><summary>Original Asana notes</summary>

> Webhook URL currently points at mademedspa.com which isn't fully cut over yet. After prod deploy:
> - Register https://mademedspa.com/api/pabau/webhooks in Pabau dashboard with PABAU_WEBHOOK_SECRET
> - Send test event from Pabau, verify it lands in /admin/pabau/webhooks as 'processed'
> - Retire the dev webhook secret to prevent stale dev events from leaking into prod

  </details>

---

## 🟡 P1 — Important (within ~2 weeks of launch)

- [ ] **[P1 Performance] Revisit hero video serving — Convex storage stutters under load**
  <details><summary>Original Asana notes</summary>

> **Status as of 2026-04-27:** observed mild lag/stutter on the hero background video on both localhost and live mademedspa.com after uploading via /admin/media. Currently 'seems OK' but flagged to revisit — likely to get worse with real visitor traffic.
> 
> **Root cause:** files uploaded via /admin/media land in Convex storage (`<deployment>.convex.cloud/api/storage/<id>`). Convex storage:
> - Is a single-region origin server (not edge-cached)
> - Has limited HTTP range-request optimization
> - Was designed for admin file uploads / gallery photos / profile images, not hot-loop streaming media
> 
> Vercel's `public/videos/` static files are served via Vercel's global edge CDN with full range support — butt *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P1 Future-paid] Build admin self-service: 'Manage Admins' page**
  <details><summary>Original Asana notes</summary>

> Goal: Karlyne (and any super-admin) can add/remove admins from the website UI without touching env vars or running CLI commands.
> 
> **Architecture:**
> 
> 1. New Convex table `admins`:
>    - email (string, indexed)
>    - clerkUserId (optional string — set when they accept the invitation and sign in)
>    - role: 'admin' | 'super-admin'
>    - addedBy (email or userId of inviter)
>    - addedAt (timestamp)
>    - lastActiveAt (timestamp, updated on each authenticated call)
>    - revokedAt (timestamp, optional — soft delete)
>    - notes (optional, free text)
> 
> 2. Migrate `assertAdmin` logic:
>    - Currently reads `process.env.ADMIN_EMAILS`
>    - Change to: query the `admins` table for matching email/userId, check *(truncated — see Asana export JSON)*

  </details>

- [x] **[P1 Personal — Philip] Get logo file from Karlyne + upload via /admin/settings**
  - _✅ Done_ — Karlyne sent espresso + white + charcoal SVGs/PNGs. Integrated as Nav + Footer fallback.
  <details><summary>Original Asana notes</summary>

> Pre-launch personal action item.
> 
> Ask her for:
> - PNG with transparent background (most flexible across nav backgrounds)
> - Higher resolution preferred (600x200+ is fine, 1200x400 better)
> 
> When received:
> 1. Upload via /admin/settings → Logo card
> 2. Verify it renders in nav (max-height 40px desktop, 32px mobile) and footer (max-height 60px)
> 3. Check both light-bg pages (/, /services) and dark-bg states (hero overlays)
> 
> If the single logo color doesn't work on both light + dark backgrounds:
> - Use whichever looks best in the most-visited state
> - File a follow-up for 2-variant logo support (already in Asana as P3 future-paid)

  </details>

- [ ] **[P1 UX audit] Audit all file upload surfaces for type validation messaging**
  <details><summary>Original Asana notes</summary>

> Lesson learned from MOV upload silent failure (2026-04-27). Fixed:
> - src/components/admin/SectionEditorCard.tsx (page editors)
> - src/app/admin/media/page.tsx (global media slots)
> 
> Still need to audit:
> - src/components/admin/ImageUpload.tsx (used in service edit, team edit, FAQ, etc.)
> - src/app/admin/seo/page.tsx (OG image upload)
> - src/components/admin/SectionDesignPanel.tsx (background image upload)
> - src/app/admin/settings/page.tsx (logo upload — just used, may already be OK)
> - Any image upload in /admin/team, /admin/services individual page
> 
> **Pattern to apply:**
> 1. Validate file.type before upload — reject anything outside image/* (or specific list)
> 2. Show always-visible help text under *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P1 Lessons doc] Document Pabau onboarding gotcha for future client work**
  <details><summary>Original Asana notes</summary>

> Lesson worth preserving for future Pabau-using clients: auto-generated-looking slugs (e.g., `made-51g64` with random suffix) are usually onboarding placeholder slugs that haven't been finalized. Pabau's admin dashboard will show them as the 'public booking URL' even when they don't actually map to a real public portal.
> 
> **Day-1 checklist for any Pabau client:**
> 1. Open the public booking URL displayed in Promote tab IN INCOGNITO (not signed in) — verify it loads
> 2. If it returns 'account doesn't exist' — the slug is unmapped. Open a Pabau support ticket with diagnostic info (the GraphQL widget script will load valid JS even when the portal page doesn't, which is a smoking gun for Pabau suppo *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P1 Followup] Convex production data cleanup for newsletterSubscribers table**
  <details><summary>Original Asana notes</summary>

> Worker F removed newsletterSubscribers from convex/schema.ts but Convex doesn't auto-drop the table data when the schema definition is removed. Once we deploy to prod, the operator must manually purge the rows.
> 
> Procedure (post-deploy, before launch):
> 1. Temporarily re-add newsletterSubscribers schema definition (so Convex queries work)
> 2. Add convex/cleanup.ts with an internalMutation `dropNewsletterSubscribers` that paginates and deletes
> 3. Run: npx convex run cleanup:dropNewsletterSubscribers --prod
> 4. Verify: npx convex data --prod | grep newsletterSubscribers (no rows)
> 5. Remove the temporarily-re-added schema definition + cleanup.ts
> 6. Redeploy
> 
> Alternative: npx convex import --replace *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P1 Followup] Make smoke-test probe 9 (real lead creation) opt-in**
  <details><summary>Original Asana notes</summary>

> Current state: scripts/smoke-test.mjs probe 9 creates a real Pabau lead on every run. Already created lead_id 3029083 during initial verification.
> 
> Problem: every CI run pollutes Pabau CRM and triggers Karlyne's lead-handling automations (notification emails, marketing assignment, etc.).
> 
> Fix: gate probe 9 behind a CLI flag.
> 
> ```
> node scripts/smoke-test.mjs https://mademedspa.com           # default: read-only, skips probe 9
> node scripts/smoke-test.mjs https://mademedspa.com --write   # includes probe 9
> ```
> 
> Also: print clearer warning at script start when --write is enabled. Add a follow-up confirmation prompt unless --yes is also passed.
> 
> ~30 min change. Do before any CI integration of smo *(truncated — see Asana export JSON)*

  </details>

- [x] **[P1 Feature] Replace 'MADE' nav text with logo image**
  - _✅ Done_ — 2026-05-05 — Brand SVGs in /public/images/. Espresso variant on light bg, white on dark/hero. Admin upload still wins as override.
  <details><summary>Original Asana notes</summary>

> Client request 2026-04-26: replace the 'MADE' wordmark in the top-left of the nav with her logo image. Admin should be able to swap it via /admin (presumably under Site Settings or Edit Pages → global).
> 
> **Implementation:**
> 1. Add `logoUrl` field to siteContent.business_info (already a v.any() metadata field, just store it there) OR add a dedicated siteContent key 'site_logo' with imageUrl
> 2. Admin UI: add to /admin/settings (Site Settings) since the logo is global, not page-specific. Reuse existing ImageUpload component
> 3. Update src/components/layout/Navigation.tsx:
>    - Replace the 'MADE' <span> with <Image src={logoUrl} alt='MADE Med Spa' /> when logoUrl is set
>    - Fall back to 'MADE' w *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P1 Operational] Define post-launch maintenance + paid update offering**
  <details><summary>Original Asana notes</summary>

> Memory: client agreed to flat $1500 for site launch. Anything beyond launch (e.g., new pages, in-site booking, intake forms, blog, gift cards integration) needs a paid maintenance/update agreement.
> 
> Deliverable: a short doc (or email template) outlining:
> - Hourly rate or per-feature pricing for post-launch updates
> - Monthly maintenance retainer option (X hours/mo for site upkeep, content edits, light feature work, monitoring)
> - What's covered free post-launch (e.g., 30-day bug-fix window for bugs in scope)
> - What requires new agreement (new features, content overhauls, integrations)
> 
> Why this matters now: client has already mentioned wanting in-site booking and before/after — those are post- *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P1 UX] Add 'About' as top-level admin nav item (discoverability fix)**
  <details><summary>Original Asana notes</summary>

> Likely root cause of client's 'admin portal is missing about section' comment: the About editor is nested under Edit Pages and isn't visible at a glance.
> 
> Quick fix: add a top-level 'About' link in src/app/admin/layout.tsx sidebar that deep-links to /admin/pages/about.
> 
> While we're there, audit all top-level nav links for discoverability:
> - Currently: Dashboard, Manage (Services/Memberships/Shop/Team/FAQs/Testimonials/Pabau Reviews), Website (Edit Pages, SEO, Contacts, Pabau Sync, Webhooks), Settings
> - 'Edit Pages' as a top-level link is opaque — a marketing person doesn't know that's where /about lives
> 
> Proposed: under 'Manage', add direct deep-links for each page:
> - About → /admin/pages/ab *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P1 Compliance] ADA accessibility statement page**
  <details><summary>Original Asana notes</summary>

> Med spas have been targets of ADA Title III lawsuits in the US. Industry baseline:
> 
> 1. **Accessibility statement page** at /accessibility:
>   - Commit to WCAG 2.1 AA conformance
>   - Contact email for accessibility issues (use info@mademedspa.com or dedicated alias)
>   - Brief description of accessibility features (keyboard nav, alt text, etc.)
>   - Last reviewed date
> 
> 2. **Footer link** to /accessibility (small, alongside privacy/terms)
> 
> 3. **One-time WCAG AA audit** as part of the Lighthouse a11y pass — fix any failures.
> 
> 4. **Skip-to-main-content link** (currently missing — keyboard users hit nav on every page).
> 
> Cookie banner: SKIP. US med spa, no PII collection beyond form (which has explic *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P1 Monitoring] Uptime + Pabau usage threshold alerts**
  <details><summary>Original Asana notes</summary>

> Two separate alerts:
> 
> 1. **Uptime monitoring** (UptimeRobot free tier):
>   - Monitor https://mademedspa.com/ every 5 min
>   - Monitor https://mademedspa.com/api/pabau/lead-sources every 15 min (validates Pabau env vars + reachability — but doesn't burn quota)
>   - Email + SMS alert on 2 consecutive failures
> 
> 2. **Pabau usage threshold** (custom — Convex scheduled action):
>   - Daily at 9am, query api.pabauApiUsage.todaysUsage
>   - If writes > 7000 (70% of 10k cap) OR reads anomalously high (>5000), send Slack/email
>   - Code lives in convex/pabauUsageAlert.ts (new) + cron entry
> 
> This catches the silent runaway: a bug that double-fires writes won't show in error tracking but will burn the daily cap *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P1 Analytics] GA4 + Search Console + Bing Webmaster**
  <details><summary>Original Asana notes</summary>

> Per docs/PRODUCTION-DEPLOYMENT.md these are post-launch tasks. Schedule for launch day + 1.
> 
> 1. **Google Analytics 4:**
>   - Create GA4 property
>   - Get measurement ID, paste into NEXT_PUBLIC_GA_MEASUREMENT_ID
>   - Wire via Next.js Script component (next/script with afterInteractive strategy)
>   - Add a 'lead_form_submit' GA event when ContactForm posts successfully → set as a conversion in GA
>   - Verify with GA realtime view: visit /, see yourself land
> 
> 2. **Google Search Console:**
>   - Add property: https://mademedspa.com
>   - Verify ownership via DNS TXT record (preferred — survives redeploys)
>   - Submit sitemap: https://mademedspa.com/sitemap.xml
>   - Request indexing for / and /services and *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P1 Performance] Media + image weight audit**
  <details><summary>Original Asana notes</summary>

> Current media folder contains uncompressed assets that will hurt Core Web Vitals:
> 
> - media/hero.mp4 (likely several MB)
> - media/veo_Video_20260411_154435.mp4 (likely large)
> - public/videos/hero-original.mp4, faq-hero-original.mp4
> - media/Background Images/*.png (unknown size)
> 
> Actions:
> - Compress hero video: ffmpeg -i hero.mp4 -vcodec h264 -acodec aac -b:v 1.5M -movflags +faststart hero-web.mp4 (target <2MB for LCP)
> - Generate WebP/AVIF for all PNGs in media/
> - Verify <Image> from next/image used everywhere a static asset renders (not <img>)
> - Add poster attribute to all <video> tags so non-autoplay devices show a still
> - Verify hero video is loaded with `preload=metadata` not `auto`
> - Consi *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P1] Soak verification + cleanup phase (E1 + E5.6)**
  <details><summary>Original Asana notes</summary>

> After 1 week of stable production:
> - Drop contactSubmissions Convex table (E1.2)
> - Retire /admin/contacts page + sidebar link (E1.1)
> - Delete unused testimonials archive code (E5.6 — old `testimonials` table)
> - Remove api.contactSubmissions.countNew query from admin layout
> 
> Do NOT do this pre-launch — keep the old paths active as fallback.

  </details>

- [ ] **[P1 SEO] Geo SEO content depth — per-city pages or richer single page**
  <details><summary>Original Asana notes</summary>

> Client wanted 'Areas We Serve' primarily for SEO. Current state: section + LocalBusiness schema. To actually rank for 'botox in Tysons', we need either:
> - Separate /areas-we-serve/tysons page per city, OR
> - Richer single page with city-specific service breakdowns
> 
> ~half day. Coordinate with marketing team on which target cities.
> 
> Deferred to post-launch (week 1).

  </details>

- [ ] **[P1] Implement real handlers for client.create / lead.create webhooks**
  <details><summary>Original Asana notes</summary>

> Currently client/lead/appointment/activity/invoice handlers are stubs that log + return 200 (src/lib/pabau/webhookHandlers/index.ts).
> 
> Real handlers would power admin dashboard stats:
> - 'X new leads this week'
> - 'X new clients this month'
> - 'X bookings this week'
> 
> Deferred to post-launch (week 1).

  </details>

- [ ] **[P1] Areas We Serve content review**
  <details><summary>Original Asana notes</summary>

> Default copy I wrote for the Areas We Serve section is generic. Have client tweak per-city blurbs to be authentic to MADE's positioning.
> 
> File: src/components/sections/AreasWeServe.tsx

  </details>

---

## 🟢 P2 — Backlog

- [ ] **[P2 Backlog] Lead form double-submit protection (idempotency)**
  <details><summary>Original Asana notes</summary>

> Edge case: visitor double-clicks Submit on /contact — currently each click sends a separate POST to /api/pabau/leads, potentially creating two leads in Pabau.
> 
> Fix: idempotency key in the lead route.
> - Generate a random key client-side, attach to request as X-Idempotency-Key header
> - Server caches the {key → result} in memory for 60s
> - Repeat submissions within window return the cached result instead of re-POSTing to Pabau
> 
> Alternative simpler approach: disable submit button immediately on click (not just isSubmitting) and don't re-enable until response. Less robust but no infra change.
> 
> Low priority — not currently happening in the wild. Backlog.

  </details>

- [ ] **[P2 Cleanup] Remove orphan newsletterSubscribers table + related code**
  <details><summary>Original Asana notes</summary>

> AI added a `newsletterSubscribers` Convex table during scaffolding but client never asked for a newsletter and has no plans to do one. Orphan code should be removed before launch.
> 
> Steps:
> 1. Drop newsletterSubscribers from convex/schema.ts
> 2. Delete convex/newsletter.ts (subscribe, list mutations/queries)
> 3. Search for any UI components that reference the newsletter (footer signup form, /newsletter page, etc.) and remove them
> 4. Run `npx convex dev` to confirm clean migration
> 5. Type check + grep to ensure no orphan references
> 
> If she ever wants a newsletter post-launch, recreate then — cheap to do.

  </details>

- [ ] **[P2 Backlog] Spam protection on contact form (honeypot field)**
  <details><summary>Original Asana notes</summary>

> Currently /api/pabau/leads has IP rate-limit (5/min) + Zod validation but no bot-specific defense. If MADE gets crawled by spam bots, junk leads will pollute Pabau.
> 
> Minimum (zero-friction, blocks ~95% of bots): hidden honeypot input field.
> - Add <input name='website_url' style='display:none' tabIndex={-1} autoComplete='off' /> to ContactForm
> - Server: if request body contains a non-empty website_url, silently reject as spam (return 200 success without forwarding to Pabau)
> - Bots fill all fields including hidden ones; humans don't
> 
> If bot traffic grows: upgrade to Cloudflare Turnstile (Google reCAPTCHA alternative, no privacy concerns).
> 
> Not currently a problem. Backlog — ship if Pabau leads *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P2] Branded map embed (Mapbox or styled Google Maps)**
  <details><summary>Original Asana notes</summary>

> If client wants brand-matching colors instead of default Google embed for the LocationMap component.
> 
> File: src/components/sections/LocationMap.tsx
> 
> Nice-to-have when there's runway.

  </details>

- [ ] **[P2] Webhook retry queue automation**
  <details><summary>Original Asana notes</summary>

> Currently failed webhooks need manual replay from /admin/pabau/webhooks. Could auto-retry with exponential backoff.
> 
> Nice-to-have when there's runway.

  </details>

- [ ] **[P2 Pabau] Reviews enrichment — fetch full payload via /reviews/{id}**
  <details><summary>Original Asana notes</summary>

> If Pabau reviews list endpoint comes back without rating/treatment fields, fetch full payload via /reviews/{id} per review rather than just the list response.
> 
> Nice-to-have when there's runway.

  </details>

- [ ] **[P2] Service-page lead form variants with source tagging**
  <details><summary>Original Asana notes</summary>

> Sticky 'Request a consultation' CTA on each service page that posts to /api/pabau/leads with a different source tag per page, so client can see in Pabau which page converted each lead.
> 
> Nice-to-have when there's runway.

  </details>

---

## ⚪ P3 — Future / Post-Launch v2

- [ ] **[P3 Future-paid] Admin font-size override controls per section**
  <details><summary>Original Asana notes</summary>

> Client request 2026-04-26: ability to change font size from /admin/pages customize design.
> 
> **Recommend pushing back on this for launch.** Reasons:
> 
> 1. **Risk of layout breakage.** The site uses a tight typography scale (label-micro, body-editorial, headline-editorial, hero-display, etc.) with sizes tuned per breakpoint. A global 'make everything 1.2x bigger' control will overflow buttons, break grid columns, push images below the fold, etc. Fixing every collision is unbounded work.
> 
> 2. **Per-section size sliders** would be safer but require auditing every component for size-tolerance. Each section might support a single size knob (small/default/large) with clamps to prevent wreckage. ~2-3 d *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P3 Future-paid] Admin font picker in Edit Pages customize design**
  <details><summary>Original Asana notes</summary>

> Client request 2026-04-26: ability to change font from /admin/pages customize design.
> 
> **Recommend pushing back on this for launch.** Reasons:
> 
> 1. **Fonts are brand identity, not a runtime knob.** The editorial 'Stitch' design (espresso/blush palette + serif headlines + sans body) is intentional and tuned. Swapping fonts at runtime breaks the carefully-chosen pairings, line-heights, letter-spacing, and weight choices. The site's premium feel comes from font discipline.
> 
> 2. **Truly arbitrary font input is risky** (admin types 'Bangers' → site looks like a circus). A curated picker with 4-6 options is safer but still risks brand drift.
> 
> 3. **Scope** — implementing this properly requires:
>    - *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P3 Future-paid] Pre-treatment intake / 'Are you a candidate?' qualifier form**
  <details><summary>Original Asana notes</summary>

> Idea banked from launch-week scope discussion. NOT included in $1500 launch flat-rate — belongs to future paid update agreement.
> 
> Concept: visitor lands on a service page (e.g., Botox) and sees a quick qualifier form ('Are you 18+? Pregnant? On blood thinners? What's your goal?') before being routed to either:
> - Book Now (qualifies)
> - Contact for consult (needs review)
> - Disqualified message (e.g., not safe for treatment)
> 
> Value: filters bookings to better-qualified leads, reduces no-shows, sets client expectations. Pabau likely has intake forms via their Forms feature — could be either embedded Pabau form or our own that pushes to Pabau as a custom field.
> 
> Do NOT pursue without explicit cli *(truncated — see Asana export JSON)*

  </details>

- [ ] **[P3 Booking] Full in-site booking flow via Pabau API (POST-LAUNCH)**
  <details><summary>Original Asana notes</summary>

> Client's actual request: replicate the contact-form pattern but for booking — visitor fills form on our site, we POST to Pabau which creates the appointment.
> 
> DO NOT BUILD PRE-LAUNCH. This is a 1–2 week project with significant complexity:
> 
> **Why it's hard:**
> 1. Need to fetch available time slots via Pabau API (per-service, per-staff, per-day) — async, possibly slow
> 2. Need to fetch service durations + prices to render the picker
> 3. Need to handle calendar conflicts gracefully (slot just got taken between view + submit)
> 4. Booking with deposits requires payment integration (Stripe — Pabau likely doesn't expose payment via API)
> 5. Confirmation emails — does Pabau auto-send when API creates an *(truncated — see Asana export JSON)*

  </details>

---

## 💬 Discuss — Decisions needed from client / stakeholders

- [ ] **[Discuss] Clarify marketing team's SEO controls scope**
  <details><summary>Original Asana notes</summary>

> Stakeholder memory says marketing team needs SEO controls. /admin/seo exists but worth confirming with client what 'controls' means:
> - Per-page meta tags?
> - Sitemap exclusions?
> - Structured-data overrides?
> - All of the above?
> 
> Blocks: design of /admin/seo enhancements.

  </details>

- [ ] **[Discuss] Define webhook activity scope beyond logging**
  <details><summary>Original Asana notes</summary>

> Currently we log all webhook events but only act on services/products/reviews via polling. If client wants any Pabau-driven action on the site (e.g., 'show appointment count this week' on dashboard), define that scope before building.
> 
> Related to: real handlers for client/lead/appointment task.

  </details>

- [ ] **[Discuss] Confirm Reviews vs Testimonials display strategy with client**
  <details><summary>Original Asana notes</summary>

> Current model: curated marketing testimonials primary, Pabau 'Recent Reviews' supplementary. Confirm with client this is what she wants — she might prefer:
> - Merge them into one feed
> - Style Pabau reviews differently
> - Remove curated and go all-Pabau
> 
> Blocks: any further work on /testimonials page.

  </details>

---

## 📌 Other / Operations

- [ ] **🟢 START HERE — Tomorrow's session brief (read first)**
  <details><summary>Original Asana notes</summary>

> 🚨 NEW #1 PRIORITY (added 2026-04-26): Pabau booking domain returns 'This account doesn't exist' — every Book/Get Started CTA on the site is broken. RESOLVE THIS FIRST. See task '🚨 [P0 BLOCKER] Resolve Pabau booking domain'. Until fixed, the booking iframe quick-win, the membership widget, every service Book button, and the production cutover are all blocked.
> 
> Likely fix: 30-min Pabau config (enable online booking + identify correct URL host). Until verified, don't sink time into anything booking-adjacent.
> 
> READY TO START (no blockers, suggested order of leverage):
> 
> 1. 🚨 RESOLVE PABAU BOOKING DOMAIN — do this first thing, confirm with client + Pabau support if needed
> 2. Vitest scaffolding *(truncated — see Asana export JSON)*

  </details>

- [ ] **Push working branch to git + deploy to Vercel**
  <details><summary>Original Asana notes</summary>

> Suggested commit message:
> feat: pabau lead push live, webhook receiver + polling sync, geo SEO section
> 
> Includes:
> - Pabau lead create endpoint wired (/leads/create)
> - Webhook receiver with URL-token auth
> - 15-min polling cron for services/products/reviews
> - AreasWeServe section + LocationMap on /contact
> - Admin sync health dashboard, lead source lookup, webhook log
> - Pabau Reviews curation page (separate from curated testimonials)

  </details>

- [ ] **Sanity-check 'Look up IDs' at /admin/pabau**
  <details><summary>Original Asana notes</summary>

> Should fetch via /marketing-sources and return:
>   - 250892
>   - 250922 → Official Website - MADE
> 
> If this breaks, the lead push will lose its source tag.

  </details>

- [ ] **Verify /contact eyebrow labels readable on localhost**
  <details><summary>Original Asana notes</summary>

> REACH OUT and SEND A MESSAGE labels were tiny grey label-micro. Bumped to 15px, weight 600, dark espresso at 75% opacity. Reload /contact and confirm they read at a glance.
> 
> File: src/app/contact/ContactPageClient.tsx

  </details>

- [ ] **1-week production soak — monitor /admin/pabau/webhooks daily** *(was due 2026-05-02)*
  <details><summary>Original Asana notes</summary>

> Watch for failed webhook events, sync errors, or 429 rate limits.
> 
> Daily checklist:
> - Open /admin/pabau → check sync health cards (any stale/never timestamps in red?)
> - Open /admin/pabau/webhooks → any failed events? Re-queue if so
> - Check /admin/pabau usage panel → are we approaching write cap?
> 
> Soak ends one week after first successful production lead.

  </details>

- [ ] **Confirm Vercel env vars match local**
  <details><summary>Original Asana notes</summary>

> Required in Vercel (Production + Preview):
> 
> **Pabau (UPDATED with new slug):**
> - PABAU_API_KEY = (existing — confirm still set)
> - PABAU_COMPANY_ID = 16557
> - PABAU_WEBHOOK_SECRET = e3e39d77436ac71eb2bd064a07cdb204f6eb801ca457cd6ba3658c1ab900f28b
> - PABAU_LEAD_SOURCE_ID = 250922
> - **NEXT_PUBLIC_PABAU_BOOKING_URL = https://partner.pabau.com/online-bookings/made-med-spa** ← NEW SLUG, current Vercel value is stale (made-51g64)
> 
> **Admin allowlist (NEW — added this session, currently missing in Vercel):**
> - ADMIN_EMAILS = philipbein10697@gmail.com,karlyne08@gmail.com
>   (Without this set in production, Next.js middleware will throw at config-load. Both Vercel AND Convex prod need the same value — see *(truncated — see Asana export JSON)*

  </details>

- [ ] **After soak: drop contactSubmissions table + retire /admin/contacts**
  <details><summary>Original Asana notes</summary>

> Deferred E1 cleanup from pabau-integration-plan.md.
> 
> Steps (only after 1-week soak passes):
> 1. Export current contactSubmissions to CSV (one-off script)
> 2. Remove /admin/contacts route and sidebar link
> 3. Remove dashboard 'X new contacts' alert
> 4. Drop contactSubmissions from convex/schema.ts
> 5. Delete convex/contactSubmissions.ts
> 6. Verify build + Convex deploy clean

  </details>

- [ ] **Trigger Pabau webhook tests (3 webhooks)**
  <details><summary>Original Asana notes</summary>

> In Pabau Developer Hub → Webhooks → click Test on each of the 3 webhooks (client / lead / booking).
> 
> Verify on production /admin/pabau/webhooks:
> - All three events appear within seconds
> - Status shows 'processed' or 'ignored' (both confirm pipe works)
> - 'failed' = check Vercel logs

  </details>

- [ ] **Submit test lead from production URL**
  <details><summary>Original Asana notes</summary>

> Submit form on https://mademedspa.com/contact with a recognizable test name.
> 
> Verify in Pabau → Leads:
> - Lead appears with name/email/phone
> - Lead Source column = 'Official Website - MADE'
> - Pipeline stage = 'New Lead'

  </details>

---

## Followups discovered in this session (not in original Asana)

These came up during 2026-05-04 → 2026-05-07 work and need ongoing tracking:

- [ ] **Migrate Glacial Indifference to self-hosted** — currently loaded from `fonts.cdnfonts.com` via @import (no preload, slight CDN dependency). Once client confirms she likes the font, download .woff2 from fontesk.com → `/public/fonts/` → wire via `next/font/local`.
- [ ] **Backfill compression for existing Vercel Blob photos** — new uploads get compressed automatically, but ~30+ already-uploaded full-size JPGs are still in Blob. Either ask Karlyne to re-upload through admin, or write a one-shot migration script (download → compress with sharp → upload → update siteContent URLs).
- [ ] **Roll Clerk production secret key** — `sk_live_...` was pasted in chat during cutover. Best practice: roll via Clerk dashboard → API keys → Roll secret. Re-push to Vercel via `vercel env rm CLERK_SECRET_KEY production -y` + `vercel env add`.
- [ ] **`ADMIN_EMAILS` on Vercel Preview environment** — CLI silently failed during cutover. Add via dashboard so preview deploys can access /admin without auth wall.
- [ ] **Seed default service categories on production** — `/admin/categories` is live but empty. Click "Seed default categories" once to install Injectables/Skin/Body/Wellness with their Pabau keyword rules.
- [ ] **Visual Branding Guide PDF** — `assets/MADE MED SPA - Visual Branding Guide 2026.pdf` is 21MB, exceeds in-tool read limit. Extract specific pages if there's spec content beyond colors/typography (image treatments, voice/tone, photography style, social templates).
- [ ] **Privacy policy Pabau processor disclosure** — defer to Karlyne. Don't draft legal copy as a developer.
- [ ] **Switch CSP from Report-Only to enforced** — `Content-Security-Policy-Report-Only` in `next.config.ts`. After 1 week soak with no console violations, flip to `Content-Security-Policy`.

---

## Migration notes

**Free Asana tier expiring** — this doc is now the canonical task list. The original Asana data lives in `docs/.asana-export.json` for reference.

**To regenerate this doc** after a fresh Asana export: `node scripts/asana-to-markdown.mjs > docs/launch-tracker.md`. Update the `sessionResolution` map in the script with newly-completed items first.

**Adding new tasks**: just edit this file directly. Bullet, checkbox, priority prefix in title. The script is for refreshing from Asana, not authoritative once the doc is the source of truth.

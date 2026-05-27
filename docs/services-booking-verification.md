# Services & Booking Flow — Fix Verification (action list for Philip)

**Created:** 2026-05-27. Follow-up to the services/booking audit.
**Read alongside:** `docs/launch-tracker.md` (tasks #748 Pabau slug verify, #852 Vercel env cutover, #1258 broken purchase links) and `docs/services-categories-rework.md` (category plan).

This doc is a **manual, in-person checklist**. The code changes are done and on
branch `claude/services-booking-flow-audit-1GqQE`. The steps below are the
runtime + human-verification tasks only *you* can do (they need prod Convex
auth, Pabau access, and eyes on the live site).

---

## What changed in code (context)

- **Booking links self-heal.** `normalizePabauBookingUrl()` strips Pabau's dead
  `made-51g64` slug and re-homes the `?category=&services=` deep-link params onto
  the canonical `made-med-spa` base. Applied at sync write-time, at the service
  detail page read-time, and in the admin manual import. Non-Pabau links pass
  through untouched.
- **Admin can now edit a service's Booking URL** in `/admin/services` (with a
  "Test ↗" button).
- **Categories stay the curated 5** (Botox · Laser · Facial Treatment · Weight
  Loss · Wellness) and `/admin/categories` now has a **"Re-apply category rules
  to all services"** button so re-tagging is one click, not a code change.
- **Dummy seed services are no longer inserted** by the seeder, and a cleanup
  mutation removes any already in a deployment.

Service routing is unchanged on purpose: service "Book Now" opens Pabau in a new
tab; `/booking` keeps the embedded iframe.

---

## A. Runtime steps (run once, in order, against PRODUCTION)

> All `npx convex run` commands take `--prod` to target production. Run a
> `dryRun` first where offered and read the summary before committing.

- [ ] **A1. Confirm env vars.**
  - Vercel (Production + Preview): `NEXT_PUBLIC_PABAU_BOOKING_URL = https://partner.pabau.com/online-bookings/made-med-spa`
    (this is launch-tracker #852 — confirm it's no longer the stale `made-51g64`).
  - Convex (optional): `PABAU_BOOKING_BASE_URL` — only set this if the slug ever
    changes again. If unset, the code defaults to `made-med-spa`.
- [ ] **A2. Deploy the branch** (merge to main → Vercel deploy + `npx convex deploy --prod`).
- [ ] **A3. Delete dummy seed services — preview first:**
  ```
  npx convex run services:deleteSeedServicesInternal '{"dryRun":true}' --prod
  ```
  Review `deletedNames` (should be the ~34 demo services like "Botox / Dysport",
  "Dermal Fillers", "HydraFacial MD"…) and `skippedPabau` (real synced services —
  should be empty or expected). Then run for real:
  ```
  npx convex run services:deleteSeedServicesInternal --prod
  ```
- [ ] **A4. Normalize any stored dead-slug booking URLs:**
  ```
  npx convex run services:normalizeBookingUrlsInternal --prod
  ```
  (The live site is already corrected at read-time; this cleans the stored data
  and what the admin Booking URL field shows.)
- [ ] **A5. Ensure the 5 categories exist.** In `/admin/categories`, if the list
  is empty/legacy, click **"Set up recommended categories"**. (CLI equivalent:
  `npx convex run serviceCategories:replaceWithKarlyneCategoriesInternal --prod`.)
- [ ] **A6. Sync services from Pabau.** In `/admin/pabau`, click **Sync Services**.
  This pulls live services, applies `bookable_online`, and stores normalized
  booking URLs.
- [ ] **A7. Re-tag services to the categories.** In `/admin/categories`, click
  **"Re-apply category rules to all services"**. Confirm the per-category counts
  look right.
- [ ] **A8. (Optional) Defensive non-bookable sweep:**
  `npx convex run services:bulkHideNonBookable '{"dryRun":true}'` then without
  dryRun — catches anything Pabau's `bookable_online` flag missed against your
  spreadsheet.

---

## B. In-person verification (incognito browser, not signed in)

- [ ] **B1. THE slug check (was the original bug).** Open `/services` → a NeoHair
  / laser service → **Book Now**. Confirm it lands on **that specific service**
  in Pabau (pre-selected), **not** "This account doesn't exist" and **not** the
  generic category list. This confirms category/service IDs survived the slug
  migration. *(If it shows "account doesn't exist", the deep-link IDs didn't
  survive the rename — tell me and we'll rebuild links from IDs instead.)*
- [ ] **B2.** `/services` shows **only services you marked bookable** — no Botox/
  Xeomin/Jeuveau, no filler brand SKUs, no chemical peels, no "Series of N"
  packages. (If any still show, re-check A6/A8.)
- [ ] **B3.** The five category sections appear (Botox · Laser · Facial Treatment ·
  Weight Loss · Wellness), each service sits under the **right** category, and the
  filter pills + search work.
- [ ] **B4.** A few service detail pages: Book Now (top + sticky mobile bar + final
  CTA) all open the correct Pabau deep link in a new tab.
- [ ] **B5.** `/booking` loads the embedded Pabau iframe (no blank box).
- [ ] **B6.** Membership "Get Started" and Shop CTAs still reach Pabau (these use
  the canonical slug already).

---

## C. Images (owner task — Karlyne)

- [ ] **C1.** Pabau does not send service images. In `/admin/services`, services
  missing an image show a yellow **"No image"** badge — upload one per service so
  the public cards/detail pages aren't placeholders.

---

## D. Open scope decision — broader "dummy seed data"

I deleted **only the dummy *services*** (the cause of the broken tiles). The
seeder (`convex/seed.ts`) also ships placeholder **FAQs, testimonials, membership
tiers, shop products, site content, and a team member**. Those may be content the
site is actively showing, so I did **not** auto-purge them.

- [ ] **D1.** Decide per area whether each is real content or dummy to remove.
  Tell me which to purge and I'll add targeted cleanup (same safe pattern as the
  services delete). Don't blanket-delete these without checking — it can blank the
  live site.

---

## E. Cross-references (already-tracked manual tasks)

- `docs/launch-tracker.md` #748 — verify Pabau Book-Now button + packages widget
  under `made-med-spa` (overlaps with B1).
- `docs/launch-tracker.md` #852 — Vercel `NEXT_PUBLIC_PABAU_BOOKING_URL` cutover
  (overlaps with A1).
- `docs/PRODUCTION-DEPLOYMENT.md` Step 6 — general post-deploy smoke test.

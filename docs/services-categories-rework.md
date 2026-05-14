# Services Page — Category Rework

**Status:** Drafted 2026-05-10. Pending Karlyne sign-off on category set + non-bookable hide.
**Supersedes the "fix" claimed in `launch-tracker.md` #6** — the layout change shipped but the category labels and the unfiltered service list mean Karlyne doesn't see what she asked for.

---

## What Karlyne asked for (verbatim)

> "Services page lists too many services. I only wanted to show categories such as Botox, laser, facial treatment, weight loss and have the top main services, and then they can click to view more"

Three things to deliver:
1. **Fewer services on screen at once** — current page shows ~30+ tiles in one wall.
2. **Categories named the way she talks about them** — Botox, Laser, Facial Treatment, Weight Loss.
3. **Top services per category + "view more" drill-in** — not the full list dumped into the page.

---

## Current state vs. what she sees

The previous fix (#6 in launch tracker) added category-grouped sections with top-3 + "View all" links. The mechanism is correct. The output isn't, for two reasons:

### Reason 1 — Category labels don't match her vocabulary

Seeded categories in `convex/serviceCategories.ts:158-186`:

| Seeded label | Karlyne's word | Effect |
|---|---|---|
| Injectables | Botox | She doesn't recognize her ask |
| Skin | Facial treatment | Partial match (keyword "skin" only catches some) |
| Body | (none) | Catch-all bucket — gets ~90 services dumped into it |
| Wellness | (none) | Only IV-related services land here |
| (missing) | Laser | All Aerolase services fall into "Body" |
| (missing) | Weight Loss | Semaglutide falls into "Body" |

### Reason 2 — Every Pabau service is syncing in, including non-bookable variants

`convex/pabauSync.ts` pulls all 144 services from Pabau and marks them all `isActive: true`. The spreadsheet she returned has a **`Bookable Online`** column saying only 89 of those should appear publicly. The other 55 are brand-specific variants (e.g. 18 dermal filler products) chosen in-office, not booked online.

Net effect: even if we rename categories tomorrow, "Botox" would show 7 neurotoxin variants (only 2 are meant to be public) and "Fillers" would show 19 brand SKUs (only 1 generic tile is meant to be public). The "too many services" complaint persists.

This is also tracked in launch-tracker.md as a separate P0: line 1100, "Cross-check site services against MADE Med Spa Services.xlsx". The two issues are independent in scope but must ship together for the page to feel right.

---

## What the spreadsheet shows

Source: `docs/Client Returned/MADE Med Spa Services.xlsx`. Total 144 services across 13 Pabau sections; **89 flagged Bookable Online**.

| Pabau section | Total | Bookable online | Notes |
|---|---:|---:|---|
| CONSULTATIONS | 5 | 5 | Includes Weight Loss Consultation, EBOO Consultation, etc. |
| NEUROTOXINS | 7 | 2 | Generic *Neurotoxin Appointment* + Dysport. Botox/Xeomin/Jeuveau/Upneeq are off-site. |
| DERMAL FILLERS | 19 | 1 | One generic *Dermal Fillers* tile; 18 brand SKUs are off-site. |
| PRP / PRF | 3 | 1 | EZ Gel 1st session only. |
| MICRONEEDLING | 10 | 10 | All public. |
| FACIALS & SKIN | 26 | 23 | Most facials public; just HydraFacial boosters are off-site. |
| CHEMICAL PEELS | 4 | 0 | Zero public. |
| TEETH WHITENING | 1 | 1 | Public. |
| IV HYDRATION & WELLNESS | 8 | 6 | Drips + B12 public; bag add-on + EBOO off-site. |
| WEIGHT MANAGEMENT (Semaglutide) | 1 | 0 | Semaglutide itself is off-site; the *Weight Loss Consultation* in CONSULTATIONS is the public entry point. |
| DERMATOLOGY | 5 | 1 | Only Latisse public. |
| AEROLASE — NeoSkin / NeoClear / NeoGenesis | 24 | 11 | Single sessions public; "Series of N" packages off-site. |
| AEROLASE — NeoHair (laser hair removal) | 31 | 28 | Most body areas public. |

---

## Recommended plan ("match her words exactly")

Two phases. Both must ship together.

### Phase 1 — Hide non-bookable services *(prerequisite)*

Without this, renaming categories is cosmetic. Choose one:

- **(A) Code path:** Add a `bookableOnline` field to `services` schema. If the Pabau API returns `bookable_online` (or equivalent), wire it through `pabauSync.ts` so the field auto-populates, and treat `bookableOnline === false` as `isActive: false` on the public site. **Need to check the Pabau API response shape — open question for the integration team.**
- **(B) Manual path:** One-time admin sweep. In `/admin/services`, mark the 55 non-bookable services as Inactive against the spreadsheet. Risk: next Pabau sync re-activates them (`upsertFromPabau` sets `isActive: true` on every sync — see `convex/services.ts:206`). So (B) without a code change to respect existing `isActive: false` is fragile.

**Cleanest end-state:** small code change in `services.upsertFromPabau` to *not* re-activate a service that's been admin-set to inactive. Optional follow-up: read the Pabau "Bookable Online" flag at sync time as the source of truth.

### Phase 2 — Rebuild the category set to her four (+ one catch-all)

In `/admin/categories`, hard-delete the seeded four and create:

| Category (display name) | Pabau keywords (auto-tag rule) | Public services it picks up |
|---|---|---|
| **Botox** | `inject, neurotoxin, tox, botox, dysport, xeomin, jeuveau, filler, restylane, juvederm, kysse, kybella, sculptra, radiesse, prp, prf, ez gel` | ~4 (Neurotoxin Appt, Dysport, Dermal Fillers, EZ Gel) |
| **Laser** | `laser, aerolase, neohair, neoclear, neoskin, neogenesis` | ~39 (NeoSkin 11 + NeoHair 28) |
| **Facial Treatment** | `facial, hydra, dermaplan, peel, microneedling, skinpen, sylfirm` | ~33 (Facials 23 + Microneedling 10) |
| **Weight Loss** | `weight, semaglutide, glp` *(set as `isDefault` if Karlyne wants it as fallback; otherwise only catches the consultation)* | 1 (Weight Loss Consultation) |
| **Wellness** *(optional 5th)* | `iv, drip, vitamin, eboo, ozone, red light, b12, latisse, teeth, whitening` | ~8 (IV drips, B12, EBOO, Red Light, Latisse, Teeth Whitening) |

The "Wellness" 5th tile is the catch-all for what doesn't fit her literal four. Without it, those services would land in the synthetic "Other" bucket the code already creates (see `ServicesPageClient.tsx:48`) — fine but less polished.

### What stays the same

- The category-grouped layout (top-3 + "View all in [Category] →") already shipped in `ServicesPageClient.tsx:23-115`. No code change to the layout itself.
- `/admin/categories` UI for category management is built (`src/app/admin/categories/page.tsx`).
- `/admin/services` for sortOrder reordering (controls which 3 surface as "top") is built.

### What this looks like for Karlyne

Lands on `/services`, sees:
- Hero
- 4 (or 5) category sections, each with: eyebrow + headline + 3-up grid of cards + "View all (N) in [Category] →"
- Total visible cards on first screen: ~12-15 instead of 30+
- Click "View all in Laser" → flat grid of all laser services for that category
- Click a category pill at top of grid → same flat-grid behavior

That's a 1:1 match for her four asks (fewer items, her category names, top services, view-more drill-in).

---

## Open questions for Karlyne

Send these to her before implementing Phase 2. Do not assume answers.

1. **Confirm the four category names**: Botox, Laser, Facial Treatment, Weight Loss — is that the exact set? Use those exact words, or is "Botox & Injectables" / "Laser Treatments" / "Facials & Skin" closer to how she'd want them headlined?

2. **What about IV drips, B12 shots, red light therapy, EBOO, teeth whitening, Latisse, prescription protocols?** ~10 services don't fit her four. Three options:
   - **(a)** Add a 5th category called "Wellness" (or her preferred word).
   - **(b)** Fold them into one of the existing four (e.g., IV under "Facial Treatment"? Doesn't really fit).
   - **(c)** Drop them from the public services page entirely — Karlyne lists them somewhere else (membership page? individual links?).

3. **Laser is going to be 39 services.** Even with top-3 + "View all", the drill-in page is heavy. Two options:
   - **(a)** Keep one "Laser" tile, accept the long drill-in page.
   - **(b)** Split into "Laser Skin" (NeoSkin/NeoClear/NeoGenesis, 11 services) and "Laser Hair Removal" (NeoHair, 28 services) — that's how Pabau itself splits them.

4. **Weight Loss as a 1-item section** — the only public-bookable item is the *Weight Loss Consultation* (Semaglutide itself is `Bookable Online: No`). Two options:
   - **(a)** Keep "Weight Loss" as a category with one card → effectively a CTA tile that drives to the consult booking. Communicates the offering at a glance.
   - **(b)** Drop the category and leave the Weight Loss Consultation in a "Consultations" bucket alongside New Client / Injectable Follow-Up consults.

5. **Bookable Online column — confirm we should hide all 55 non-bookable services from `/services`.** That removes 18 dermal filler brand SKUs, 5 neurotoxin brand variants, all 4 chemical peels, all chemical-peel boosters, the "Series of N" laser packages, etc. Verify she's good with that — these are the "in-office only" items per her spreadsheet, but worth confirming nothing she actually wants discoverable gets hidden.

6. **Top 3 per category — is 3 the right number, or 4?** Code currently has `TOP_PER_CATEGORY = 3` in `ServicesPageClient.tsx:18`. Trivially configurable.

---

## Implementation notes (for whoever picks this up)

### No-code path (if all answers are admin-side)
1. Karlyne (or Philip) opens `/admin/categories`.
2. Hard-delete the seeded four.
3. Add 4–5 new categories per the table above.
4. Click "Sync Services" — keyword inference re-buckets everything.
5. For any service that lands in the wrong bucket, edit it in `/admin/services` (sets `categoryLocked: true`, immune to future sync overrides).

### Code path (Phase 1 prerequisite)
- File: `convex/services.ts:178-209` (`upsertFromPabau`)
- Change: don't set `isActive: true` on existing services that have `isActive: false` set by admin. Add a `manuallyHidden` flag (or repurpose `isActive` with a sticky-off semantic).
- Optional: if Pabau API returns `bookable_online` in the services payload, plumb it into `upsertFromPabau` and use it as the source of truth for `isActive`.
- Investigation needed: confirm Pabau API response shape — `convex/pabauSync.ts:21-32` defines `PabauServiceRaw` with no `bookable_online` field, but the actual API may return it.

### Schema considerations
- `services.bookableOnline` field — add as `v.optional(v.boolean())` for backwards compat. Update `convex/schema.ts`.
- No migration needed for existing services; default to `undefined` and treat as bookable.

---

## Plan — epics & user stories

Three small epics. Phase 1 (engineering prerequisite) and Phase 2 (admin/category) ship together; Phase 3 is the sign-off loop with Karlyne. None depend on her answers to start — every category choice she makes later is admin-editable in `/admin/categories`.

### Epic 1 — Make hide stick & seed bookable filter

> **As Karlyne, when I land on `/services` I see only the services I marked Bookable Online in my spreadsheet — not the in-office-only brand variants.**

- **E1.S1** — Make admin-set Inactive sticky across Pabau syncs. Add `hiddenByAdmin` flag to `services` schema; `upsertFromPabau` respects it; admin toggle mutations set it.
- **E1.S2** — Bulk-hide the 55 non-bookable services from the xlsx via a one-shot admin mutation matched by exact name.
- **E1.S3** — Confirm whether Pabau API already returns a `bookable_online` field; if yes, plumb it as the source of truth so future syncs auto-hide without manual sweeps.

### Epic 2 — Match Karlyne's category vocabulary

> **As Karlyne, the categories on `/services` are named the way I talk about treatments — Botox, Laser, Facial Treatment, Weight Loss — not Injectables/Skin/Body/Wellness.**

- **E2.S1** — Replace the four seeded categories with the proposed five (Botox / Laser / Facial Treatment / Weight Loss / Wellness) via an idempotent admin mutation. Karlyne can rename/reorder/edit keywords in `/admin/categories` without a dev.
- **E2.S2** — Run Pabau sync to re-bucket services into the new categories. Spot-check `/services`.

### Epic 3 — Sign-off loop

> **As the dev team, we know exactly which categories ship to production because Karlyne signed off on the names, the cut list, and the layout details.**

- **E3.S1** — Send Karlyne the 6 open questions in this doc. Update doc with her answers. Adjust admin-side config to match. No code changes needed — all answers map to admin UI knobs.

### What's safe to start now (without Karlyne's answers)

All of E1 and E2.S1 + E2.S2. The categories created by E2.S1 are her literal four names + a Wellness catch-all, sourced from her own words; if she comes back with edits, every name/keyword/order is editable in `/admin/categories` without touching code.

What's blocked by E3.S1: only the *finalization*. Production cut should wait for her sign-off.

---

## Draft message for Karlyne (E3.S1)

Below is a copy/paste version Philip can send to Karlyne. Phrased plainly, no jargon, frames the engineering work as already done so she's only making a few decisions, not approving infrastructure.

> Hi Karlyne,
>
> Following up on your note about the services page showing too many treatments. Took another look at it against the service menu spreadsheet you returned in April, and we're set up to make this match what you asked for ("show categories like Botox, laser, facial treatment, weight loss with the top services and a way to view more"). Before we flip the switch on the live site, want to confirm a few details with you so it lands the way you actually want it.
>
> 1. **Category names.** The plan is five sections on the services page: **Botox · Laser · Facial Treatment · Weight Loss · Wellness**. Are those the right names, or do you want any of them tweaked? (e.g., "Botox & Injectables" instead of "Botox"? "Laser Treatments"? Anything you'd phrase differently?)
>
> 2. **Wellness as a fifth tile.** You named four categories. We added a fifth ("Wellness") to catch the IV drips, B12 shots, EBOO, red light therapy, teeth whitening, and Latisse — about 8 services that don't fit the other four. Three options:
>     - Keep "Wellness" as a fifth section (recommended)
>     - Drop those services off the public page entirely
>     - Fold them into one of the other four (let us know which)
>
> 3. **Laser is going to be a big section** — looks like ~39 services across NeoSkin, NeoClear, NeoGenesis, and NeoHair. Even with only 3 visible per section + a "View all" link, the View All page would be long. Want us to:
>     - Keep one "Laser" section (simpler), or
>     - Split into "Laser Skin" and "Laser Hair Removal" (matches how Pabau itself separates them)?
>
> 4. **Weight Loss as a section.** The only thing publicly bookable in this category right now is the Weight Loss Consultation (Semaglutide itself is marked in-office only on your sheet). So the section would be a single tile that says "Weight Loss Consultation → book." Two options:
>     - Keep it as a section (the tile makes it visible at a glance, even if it's just one card)
>     - Drop the section and move the Weight Loss Consultation under another bucket
>
> 5. **Hiding the in-office-only services.** Your spreadsheet has 55 treatments marked Bookable Online: No — things like the 18 specific filler brand products (Volux, Restylane variants, Kysse, Belotero, etc.), individual neurotoxin brands (Botox, Xeomin, Jeuveau), the chemical peels, the laser series packages, etc. Those would disappear from the website services page (still visible to you in your admin). The bookable generic versions stay (e.g., "Dermal Fillers" tile, "Neurotoxin Appointment" tile). Confirm that's what you want — checking nothing important to you gets hidden.
>
> 6. **Top 3 vs top 4 per section.** Right now it shows the top 3 services per category, then "View all in [Category] →". Is 3 the right number or would 4 feel better?
>
> Once you reply, the changes are mostly admin-side and we can have it live the same day. Thanks!

---

## Implementation status (2026-05-10)

Engineering for Epics 1 & 2 is shipped to dev Convex. Three runtime steps remain — Philip needs to invoke them from the Convex dashboard (or via `npx convex run` with admin auth) since the mutations are admin-gated.

**Shipped:**
- `services.bookableOnline` field added to schema (auto-set by Pabau sync).
- `services.hiddenByAdmin` field added (admin override; sticks across syncs).
- `pabauSync.syncServices` now reads Pabau's `bookable_online` flag (live API confirmed to return 0/1) and plumbs it through `upsertFromPabau`.
- Public `/services` queries (`list`, `listByCategory`, `getBySlug`) filter out anything where `isActive: false` OR `bookableOnline === false`.
- `services.toggleActive`/`update`/`remove` mutations now flip `hiddenByAdmin` so admin hides survive the next 15-min sync.
- `services.bulkHideNonBookable` mutation: defensive name-based hide using the 55 names extracted from the spreadsheet (in `convex/data/nonBookableServices.ts`). Useful as fallback or for pre-Pabau cleanup.
- `serviceCategories.replaceWithKarlyneCategories` mutation: hard-deletes the four legacy seed categories and creates the five proposed (Botox / Laser / Facial Treatment / Weight Loss / Wellness) with tuned Pabau keyword lists.
- `scripts/extract-non-bookable.py` regenerates the name list when Karlyne updates the spreadsheet.

**Live state of Pabau (verified 2026-05-10 via `/services` GET):** only 20 services configured, not the 144 in the spreadsheet. Karlyne is mid-load. As more services land in Pabau with proper `bookable_online` flags, the sync handles them automatically. The bulk-hide mutation is therefore a no-op against current state (none of the 55 names match the 20 currently-synced names) but useful once Karlyne loads the rest.

**Runtime steps already executed against dev Convex (2026-05-10):**

1. ✅ `serviceCategories:replaceWithKarlyneCategoriesInternal` — created 5 categories (Botox, Laser, Facial Treatment, Weight Loss, Wellness with isDefault). Removed 0 legacy because dev DB had none.
2. ❌ `pabauSync:syncServices` — failed, `PABAU_API_KEY` not set on the dev Convex deployment env. Working around via the rebucket internal (next step).
3. ✅ `services:rebucketAllInternal` — re-ran inferCategory() against all 30 existing services without hitting Pabau. Result: 21 → Laser, 4 → Botox, 3 → Wellness, 2 → Facial Treatment, 0 Weight Loss (no semaglutide/glp services in dev DB; confirmed accurate against current Pabau state).
4. ✅ Public `services.list` returns the same 30 with the new buckets. /services page should now render 4 of 5 sections (Weight Loss empty until Karlyne loads it in Pabau).

**Remaining for Philip (production-only):**

1. Set `PABAU_API_KEY` on the production Convex deployment (`npx convex env set PABAU_API_KEY ... --prod`) if not already present.
2. From production Convex dashboard, invoke `serviceCategories.replaceWithKarlyneCategories` (admin-gated mutation; needs his Clerk session OR run the `replaceWithKarlyneCategoriesInternal` variant via CLI).
3. Invoke `pabauSync.syncServices` to pick up `bookable_online` flags from Pabau and re-bucket via the new categories.
4. Visit prod `/services` and verify the five-section layout.
5. (Optional defensive) `services.bulkHideNonBookable({ dryRun: true })` after sync to catch any non-bookable name matches Pabau missed.
6. After Karlyne signs off on category set (E3.S1), commit + deploy.

**Reversibility:** every step is reversible from `/admin/categories` and `/admin/services`. Keyword lists, names, ordering, active state — all admin-editable without code.

---

## Decision history

- 2026-04-?? — Karlyne reports too many services on /services.
- 2026-05-09 — `534c3ef` ships category-grouped layout with top-3 + view-all (#6 in launch tracker). Layout works; categories don't match her ask.
- 2026-05-10 — Discovered the spreadsheet has a `Bookable Online` column halving the public service count from 144 to 89; root-cause review concludes the #6 fix is incomplete because (a) seeded categories don't match her vocabulary and (b) non-bookable variants weren't being hidden. This doc supersedes #6.
- 2026-05-10 — Confirmed via live `/services` API call that Pabau returns `bookable_online: 0|1` per service. Plumbed it through sync as the source of truth. Bulk-hide name-based mutation kept as defensive fallback. Engineering for Epics 1 & 2 shipped to dev Convex; 3 admin-side steps left for Philip + Karlyne sign-off.

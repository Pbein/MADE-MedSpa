# Shop → Shopify Migration — Status & Plan

**Created:** 2026-05-27. **Status:** Not started — deferred to the end of the build.
**Owner of this decision:** Karlyne (client). This doc captures where we are so
whoever picks up the shop work (Philip, Karlyne, or a subcontractor — undecided)
has the full context.

---

## TL;DR

- The med-spa **site comes first** (booking, services, home, UI — everything the
  way Karlyne wants it). The **shop is the last thing** we wire up.
- **Pabau is being dropped for the shop.** Karlyne researched it and chose
  **Shopify** because Pabau doesn't handle storefront + product fulfillment.
- **Karlyne handles fulfillment herself** — receiving orders, packaging,
  shipping. The shop is effectively a **separate business** from the med spa;
  that's her call.
- Our job is to **integrate a finished Shopify store with the site's `/shop`** so
  the on-site shop works. *How* we integrate is an open decision (3 options
  below). *Who builds the Shopify store* is also open.

### Karlyne's words (verbatim)

> "Okay so the storefront will be connected through Shopify, since after doing
> research I found it to be the best option. I will personally handle order
> fulfillment, including receiving orders, packaging products, and shipping them
> directly to customers."

---

## Open decisions (BLOCKING — need answers before any shop work)

1. **Who builds the Shopify store itself?**
   - Philip — only if paid well for it (it's a separate scope from the med-spa site).
   - Karlyne — she sets it up herself.
   - Subcontracted to a third party.
   - *Until this is decided, treat Shopify store creation as out of scope.*

2. **Which integration approach?** (see "Integration options" below — link-out /
   embed / headless). Drives the effort estimate and the on-site UX.

3. **Commercial terms** if Philip builds/integrates — separate line item from the
   med-spa site work.

4. **Timing** — confirmed as *after* the rest of the site is signed off and live.

---

## Current `/shop` implementation (what exists today, Pabau-based)

The shop is fully built but wired to **Pabau**, which is the part being replaced.
Touch points whoever does the migration will need to change:

**Public pages**
- `src/app/shop/page.tsx` — product grid. Reads `api.shopProducts.list` (Convex).
  "Buy" CTAs fall back to `NEXT_PUBLIC_PABAU_BOOKING_URL`.
- `src/app/shop/[slug]/page.tsx` — product detail. CTA is
  `product.pabauLink ? "Shop on Pabau" : "Inquire to Purchase"` and routes to
  `pabauLink || BOOKING_URL`. *(This is the "in-clinic dead-end" CTA flagged in
  the UX review — it gets solved for free once Shopify replaces the buy flow.)*

**Admin**
- `src/app/admin/shop/page.tsx` — product CRUD; has a `pabauLink` field.
- `src/app/admin/pages/shop/page.tsx` — shop page content/section editor.

**Data + sync (Convex)**
- `shopProducts` table (`convex/schema.ts`): `name, description, price, category,
  imageUrl, pabauLink, pabauProductId, pabauSyncedAt, sortOrder, isActive, isSeed`.
- `convex/shopProducts.ts` — queries/mutations + `upsertFromPabau` /
  `softDeleteByPabauId`.
- `convex/pabauSync.ts` `syncProducts` + `syncProductsCron`, scheduled in
  `convex/crons.ts` (every 15 min).

**Note:** the seeded demo products in `convex/seed.ts` are placeholder data (see
`docs/services-booking-verification.md` §D for the seed-cleanup decision).

---

## What changes when we move to Shopify

Regardless of approach:
- **Stop syncing products from Pabau** — remove/disable `syncProducts` +
  `syncProductsCron`, or repoint the catalog source to Shopify.
- **Shopify becomes the system of record** for products, inventory, prices,
  orders, payments, and shipping. Karlyne manages it in Shopify admin.
- **Replace the buy CTAs** so "Add to cart"/"Buy" goes to Shopify checkout, not
  a Pabau link.
- **Product images come from Shopify's CDN** — good for our Convex/Vercel
  bandwidth budget (see `CLAUDE.md`); we don't store shop media ourselves.
- **CSP update** (`next.config.ts`): if we embed or call Shopify, add the Shopify
  domains to `script-src` / `frame-src` / `connect-src` (same way
  `partner.pabau.com` is allowlisted today).
- **New cost:** Shopify is a separate monthly subscription (~$39/mo Basic at
  time of writing) on top of Vercel/Convex — Karlyne's operating cost.

---

## Integration options (the decision in #2)

### Option 1 — Link out to the Shopify storefront (simplest)
`/shop` (and/or each product's Buy button) links to the hosted Shopify store
(e.g. `shop.mademedspa.com` or `mademedspa.myshopify.com`). Could keep our
existing Convex catalog purely for on-site display and just swap `pabauLink` →
`shopifyUrl`, or replace `/shop` with a redirect.
- **Pros:** least work; Shopify owns cart/checkout/inventory entirely; nothing to
  maintain on our side; ships fast.
- **Cons:** visitor leaves mademedspa.com; two catalogs to keep in sync if we
  keep the Convex display copy; weakest brand continuity.
- **Best when:** we want it live with minimal spend/effort.

### Option 2 — Embed Shopify in the site (Buy Button / storefront embed)
Use Shopify's **Buy Button** JS SDK (or an embedded storefront) inside the
existing `/shop` UI. Products/cart/checkout handled by Shopify's widget; the page
still lives on mademedspa.com.
- **Pros:** stays on-site; Shopify still owns checkout/payments/inventory; modest
  effort; no custom backend.
- **Cons:** widget styling is constrained (won't perfectly match the editorial
  design); extra client JS; CSP additions needed.
- **Best when:** we want on-site shopping without building a headless stack.

### Option 3 — Headless (Shopify Storefront GraphQL API)
Pull products from Shopify's **Storefront API**, render them in our own React UI,
build cart on-site, hand off to Shopify-hosted checkout for payment.
- **Pros:** full brand/UX control; one design language; best experience.
- **Cons:** most engineering (catalog fetching, cart state, checkout handoff,
  webhooks for inventory); ongoing maintenance; biggest cost — this is the
  "paid really well" tier of work.
- **Best when:** the shop is a long-term priority worth investing in.

**Recommendation (pending Karlyne):** start with **Option 1 or 2** to get a
working shop quickly and cheaply, since fulfillment and operations live entirely
in Shopify anyway. Reserve **Option 3** for later only if the storefront becomes
a serious revenue channel worth the build. Whichever we pick, the rest of the
site ships first.

---

## Next steps (when shop work is greenlit)

1. Resolve the open decisions above (who builds it, which integration, terms,
   timing).
2. Confirm the Shopify store exists and is populated (Karlyne or builder).
3. Pick the integration option; if Option 2/3, allowlist Shopify domains in
   `next.config.ts` CSP.
4. Repoint `/shop` + `/shop/[slug]` buy CTAs to Shopify; retire the Pabau product
   sync (`syncProducts`, `syncProductsCron`, cron entry).
5. Decide the fate of the Convex `shopProducts` catalog (keep as display mirror,
   or drop in favor of Shopify as the single source).
6. Verify end-to-end: browse `/shop` → add/buy → Shopify checkout → Karlyne
   receives the order for fulfillment.

---

## Related docs
- `docs/services-booking-verification.md` — current services/booking rollout (the
  work that comes *before* the shop).
- `CLAUDE.md` — media/bandwidth guardrails (Shopify CDN keeps shop media off
  Convex, which is aligned with these).

# MADE Med Spa — Sprint Plan

## Context

The client reviewed the current site and requested:
1. Soften the repeated green/red colors at the bottom of each page
2. Add a Membership section with 4 pricing tiers
3. Add an Online Shop section
4. Both membership and shop must be editable through /admin

Additional decisions made during planning:
- Nav restructured to: Services | Membership | Shop | About | Contact + [Book Appointment]
- FAQ moves to footer (low-intent page, CTA button already covers booking)
- Pabau API is live and returns services, packages, and booking URLs per service
- Memberships and shop are admin-managed via Convex (Pabau has no membership API)
- Products endpoint returns empty — admin-managed until client populates Pabau

## Pabau API Reference

- Base URL: `https://api.oauth.pabau.com/{api_key}/`
- Booking portal: `https://partner.pabau.com/online-bookings/made-51g64`
- Working endpoints: `/services` (20 results), `/packages` (12 results), `/products` (0 results)
- Each service includes a `booking_url` for deep-linking to that specific service
- Rate limit: 25,000 calls/day

---

## Epic 1: Footer & CTA Color Softening

> *As a visitor, I should feel a consistent, warm visual flow from content to footer — not a jarring color shift at the bottom of every page.*

### Stories

**1.1 — Soften CTABanner background**
- Replace hardcoded olive `#413e2a` with warm cream/glaze (`#f7f6eb` or `#d7cfc5`)
- Switch text from light-on-dark to espresso-on-cream
- Update CTA button to use espresso or blush styling on the lighter background
- File: `src/components/sections/CTABanner.tsx`

**1.2 — Review footer transition**
- Ensure the cream CTA → dark espresso footer transition feels smooth
- Check all 5 pages that use CTABanner (home, about, services, booking, faq)
- Verify mobile appearance

### Acceptance
- Bottom of every page flows: content → warm cream CTA → dark footer
- No "green and red" color clash
- Client approves the softened look

---

## Epic 2: Membership Page

> *As a potential client, I want to compare membership tiers at a glance so I can pick the right level of commitment for my goals and budget.*

### Stories

**2.1 — Membership data model (Convex)**
- Create `convex/memberships.ts` with schema:
  - name, price, billingPeriod, tagline, benefits (string[]), isFeatured, pabauLink, sortOrder, isActive
- Mutations: create, update, remove, toggleActive, reorder
- Queries: list (active, sorted), listAll (admin)

**2.2 — Seed the 4 membership tiers**
- IN THE MAKING — $25/mo
- WELL MADE — $50/mo
- MADE FOR YOU — $100/mo (featured)
- THE RESERVE — $200/mo
- Copy benefits exactly from client's reference image

**2.3 — Membership page (`/membership`)**
- 4-card pricing grid matching client's reference layout
- "Most popular" badge on featured tier
- Each card: name, price, tagline, divider, benefits list
- CTA button per card → links to pabauLink (or booking portal fallback)
- Responsive: 4-col desktop → 2-col tablet → 1-col mobile
- Uses brand palette (warm browns, cream, glaze)

**2.4 — Membership admin (`/admin/memberships`)**
- List all tiers with drag-to-reorder or sort controls
- Add / Edit modal: name, price, billing period, tagline, benefits (add/remove), featured toggle, Pabau link, active toggle
- Delete with confirmation
- Follow existing admin UI patterns (matches services, content admin pages)

### Acceptance
- Visitor sees 4 membership cards that match the reference image style
- Admin can add a 5th tier, remove one, edit pricing or benefits, and changes appear live
- CTA buttons link to Pabau membership purchase (or booking portal until link is provided)

---

## Epic 3: Shop Page

> *As a potential client, I want to browse available products so I can see what the spa offers and purchase through their platform.*

### Stories

**3.1 — Shop data model (Convex)**
- Create `convex/shopProducts.ts` with schema:
  - name, description, price, category, imageUrl, pabauLink, sortOrder, isActive
- Mutations: create, update, remove, toggleActive, reorder
- Queries: list (active, sorted), listAll (admin), listByCategory

**3.2 — Shop page (`/shop`)**
- Product grid: image, name, short description, price, category badge
- Category filter tabs (if multiple categories exist)
- Each product card CTA → links to pabauLink (external purchase)
- Empty state: friendly message if no products yet ("Coming soon" or similar)
- Responsive: 3-col desktop → 2-col tablet → 1-col mobile
- Brand-consistent styling

**3.3 — Shop admin (`/admin/shop`)**
- List all products with sort controls
- Add / Edit modal: name, description, price, category, image upload, Pabau link, active toggle
- Delete with confirmation
- Follow existing admin UI patterns

**3.4 — Future: Pabau product sync (deferred)**
- When client adds products to Pabau, build a sync that pulls from `/products` endpoint
- Admin becomes an override layer (custom images, descriptions) on top of Pabau data
- Not building this now — products endpoint is empty

### Acceptance
- Visitor sees a product catalog (or a polished empty state if no products yet)
- Admin can add products with images, prices, and Pabau links
- Products appear on the shop page immediately after saving

---

## Epic 4: Navigation Restructure

> *As a visitor, I want to find membership and shop information without the nav feeling cluttered, following the pattern used by top med spa sites.*

### Stories

**4.1 — Update desktop nav**
- New order: Services | Membership | Shop | About | Contact
- Remove FAQ and Booking from top nav
- Keep [Book Appointment] CTA button
- File: `src/components/layout/Header.tsx` (or equivalent nav component)

**4.2 — Update mobile nav**
- Hamburger menu: same 5 items + Book Appointment
- Add FAQ as a secondary/footer item in the mobile menu (still accessible)

**4.3 — Update footer nav**
- Add FAQ link to footer (moved from main nav)
- Add Membership and Shop links to footer
- Ensure footer has complete site navigation as a fallback

### Acceptance
- Desktop nav has 5 items + CTA, feels clean and uncluttered
- FAQ is still accessible from footer and mobile menu
- All new pages (membership, shop) are reachable from nav and footer

---

## Build Order

| Phase | What | Why first |
|-------|------|-----------|
| 1 | Epic 1 (footer colors) | Smallest change, immediate client win |
| 2 | Epic 2 (membership) | Client's primary request, has reference image |
| 3 | Epic 3 (shop) | Depends on same patterns as membership |
| 4 | Epic 4 (nav restructure) | Needs membership + shop pages to exist first |

Each phase: build → test in browser → verify mobile → move to next.

---

## Known Issues & Notes

### Data ownership model (Pabau vs. Admin)
- **Pabau = source of truth for business data** (prices, durations, availability)
- **Site admin = source of truth for website presentation** (descriptions, images, sort order, featured flags)
- Sync direction: Pabau → Site only (read-only pull). We do NOT write back to Pabau from the site.
- Admin panel for Pabau-linked services should show price/duration as read-only "from Pabau" fields
- Admin panel for site-only services (not in Pabau) allows full editing
- Future: add "Last synced" timestamp and auto-refresh, clear labeling in admin UI

### Services data: Pabau vs. Convex
- Pabau has 20 Aerolase NeoHair laser services (real prices, booking URLs)
- Convex has 10 manually entered services (injectables, skin, body, wellness) with estimated prices
- Admin can import Pabau services via /admin/pabau sync tool
- Imported services get per-service booking URLs for deep-linking

### Launch checklist dependencies (docs/MADE-Med-Spa-Launch-Checklist.md)
- Placeholder data still in footer: fake address, phone, email (has typo: "mademedpsa.com")
- Team members may include fictional people (Sophia Laurent, Mia Chen, Olivia Hart)
- Service prices are estimated — client hasn't confirmed
- These are separate from this sprint but should be resolved before launch

### Brand voice guardrail
- Karlyne is "Nurse Karlyne" (aesthetic nurse injector), NOT a doctor
- Verify team data in Convex doesn't say "Dr. Karlyne"
- See memory: project_brand_voice.md for tone guidelines

### Pabau membership link
- Still needed from client: the specific Pabau membership purchase URL
- Fallback: link to general booking portal until provided

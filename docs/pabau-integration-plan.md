# Pabau-as-Source-of-Truth Integration Plan

**Status:** Draft — pending Pabau rep clarifications
**Goal:** Eliminate site-only contact storage. Pabau is the engine; the marketing site is a read-replica with a single write surface (lead form).

---

## North Star

- **Writes:** site → Pabau, never site → Convex (except sync-cache writes triggered by Pabau)
- **Reads:** Pabau → webhooks/cron → Convex cache → site
- **Convex's job:** be a fast read-replica + hold site-presentation overlays (featured flags, display order, SEO copy)
- **Admin portal's job:** observability + presentation overlays, NOT content editing for Pabau-owned entities

---

## Pabau API Rate Limits (verified from official docs)

Source: [Pabau Rate Limits](https://support.pabau.com/en/api/rate-limits)

- **Throttle:** 1 request per 2 seconds (≈30/min, ~43,200/day theoretical max)
- **Daily fair-use POST/PUT cap:** 10,000 per 24 hours
- **Daily GET cap:** not formally documented, but throttle implies the 43.2k ceiling
- **Scope:** company-wide (not per-key) — every integration touching the same Pabau company shares the budget
- **Breach response:** HTTP 429; repeat breaches → POST/PUT blocking
- **No documented Retry-After header** — we'll back off 5 min on 429 by default

### Our budget plan

**Reads (GET):**
| Source | Calls/day | Notes |
|---|---|---|
| Cron poll services | 96 | every 15 min |
| Cron poll products | 96 | every 15 min |
| Cron poll reviews | 96 | every 15 min |
| Cron poll packages | 96 | every 15 min (if used) |
| Webhook → fetch full entity (if needed) | ~20 | event-driven |
| Manual admin sync | ~50 | bursty, throttled |
| **Total reads** | **~454/day** | <1.1% of theoretical ceiling |

**Writes (POST/PUT):**
| Source | Calls/day | Notes |
|---|---|---|
| Lead form submissions | 1–100 | depends on traffic |
| **Total writes** | **<100/day** | <1% of 10k cap |

Conclusion: 15-minute polling is comfortably within budget. Budget is 96% headroom for reads, 99% for writes. Even at 5-minute polling we'd still be <3% of read ceiling.

### Rate-limit-aware design rules

1. **Throttle every Pabau call** through a shared queue: minimum 2.5s spacing (buffer over the 2s limit). Burst calls queue, never parallel-fire.
2. **Manual sync rate-limit:** per admin user, 1 sync request per entity per 30s. Hard cap: 4 manual syncs per minute across all admins.
3. **Circuit breaker:** on 429, pause all outbound Pabau calls for 5 min, surface red banner in admin.
4. **Daily call counter:** new `pabauApiUsage` Convex table tracking counts per day per method. Admin dashboard shows usage / budget remaining. Alert at 70% of POST cap.
5. **Cron resilience:** if cron run is skipped (deploy, outage), next run picks up where it left off — never "catch up" by firing rapid sequential calls.

---

## Pre-flight — Blocking questions for client's Pabau rep

These must be answered before E2 starts. Track answers in this section as they come in.

| # | Question | Answer | Date |
|---|---|---|---|
| Q1 | Webhook coverage for `service`, `product`, `package`, `review` entities? Or polling required? | _pending_ | — |
| Q2 | Webhook signing scheme (HMAC header? shared secret query param?) | _pending_ | — |
| Q3 | What `lead_source` ID should "MADE website" leads be tagged with? | _pending_ | — |
| Q4 | Custom field IDs for treatment-interest, preferred-contact, marketing-consent on the lead object | _pending_ | — |
| Q5 | Reviews endpoint payload schema + are reviews auto-published or moderated in Pabau? | _pending_ | — |
| Q6 | Rate limits for `POST /leads` and webhook delivery retry policy | _pending_ | — |
| Q7 | Pabau `company_id` for MADE | _pending_ | — |
| Q8 | Webhook subscription: self-serve in dashboard or does rep configure? | _pending_ | — |

---

# EPICS

## E1 — Decommission site-only contact storage
**Goal:** Remove dead-weight code so we don't carry two systems.
**Definition of done:** No code path writes contact/lead data to Convex. Build still passes. Admin portal shows no `/admin/contacts` link.
**Exit gate:** E2 has a working Pabau lead push in staging *before* we delete (otherwise launch with broken form).

## E2 — Pabau lead push (contact form)
**Goal:** Contact form posts directly to Pabau leads endpoint, server-side, with no Convex involvement.
**Definition of done:** Form submission creates a lead in Pabau test environment with all expected fields populated; failure modes covered (Pabau down, validation error, rate limit).

## E3 — Webhook receiver foundation
**Goal:** Stand up the receiver before wiring entities, so each entity is a small additive PR.
**Definition of done:** Receiver verifies signatures, deduplicates events via idempotency table, logs to admin debug page, returns 200 within 3s.

## E4 — Pabau → Convex sync (existing entities)
**Goal:** Replace manual "Sync from Pabau" button with event-driven mirror for services, products, memberships.
**Definition of done:** Creating/editing/deleting a service in Pabau is reflected on the site within 60s without admin intervention.

## E5 — Reviews from Pabau on /testimonials
**Goal:** Real reviews flow from Pabau to the testimonials page; admin curates which appear, not the content.
**Definition of done:** /testimonials renders only Pabau-sourced reviews; admin can hide/feature/reorder but cannot edit text.

## E6 — Site CTA cleanup
**Goal:** One contact path on the site (the form) and one booking path (Pabau deep link). Remove duplicates.
**Definition of done:** No page outside `/contact` contains a duplicate contact form or "send us an email" form. All "Reach out" CTAs route to either the contact form or Pabau booking.

## E7 — Admin portal repositioning
**Goal:** Admin becomes a sync observability + site-presentation tool, not a content editor for Pabau-owned data.
**Definition of done:** Pabau-owned fields are read-only with a "view in Pabau" link. Sync health is visible at a glance. Marketing team has self-serve overlays (featured, order, SEO copy).

## E8 — Documentation + handoff
**Goal:** Future maintainers and the marketing team understand the new model.
**Definition of done:** Pabau integration doc exists; privacy policy updated; admin in-app guide reflects new flow.

---

# USER STORIES (sequenced)

Stories are ordered by build sequence. Each has acceptance criteria, files touched, and verification step.

## E2 — Pabau lead push (do FIRST so we have a working alternative before deleting)

### S2.1 — Add Pabau env vars + secrets management
- **As** developer
- **I want** Pabau credentials documented and loaded from env
- **So that** every API integration uses one consistent config source
- **Acceptance:**
  - `.env.local.example` lists `PABAU_API_KEY`, `PABAU_COMPANY_ID`, `PABAU_WEBHOOK_SECRET`, `PABAU_LEAD_SOURCE_ID`
  - `src/lib/pabau/config.ts` exports a typed config object with runtime validation
  - Production deploy doc updated with required Vercel env vars
- **Files:** `.env.local.example`, `src/lib/pabau/config.ts` (new), `docs/PRODUCTION-DEPLOYMENT.md`
- **Verify:** `npm run build` fails fast with a clear error if a required key is missing
- **Depends on:** Q3, Q7

### S2.2 — Build Pabau API client (server-only, rate-limited)
- **As** developer
- **I want** a single typed client wrapping all Pabau calls with throttling baked in
- **So that** retries, rate limits, and error shapes are consistent and we never breach 429
- **Acceptance:**
  - `src/lib/pabau/client.ts` exports `pabau.leads.create()`, `pabau.services.list()`, `pabau.reviews.list()`, `pabau.products.list()`
  - All methods server-only (throws if called client-side)
  - Built-in 2.5s minimum spacing between any two outbound calls (shared queue)
  - 3 retries with exponential backoff for 5xx, no retry for 4xx (except 429)
  - 429 handling: open circuit breaker for 5 min, return cached if available, throw `PabauRateLimitError` otherwise
  - Every call increments `pabauApiUsage` counter (Convex)
  - Logs request/response with key redacted
- **Files:** `src/lib/pabau/client.ts` (new), `src/lib/pabau/types.ts` (new), `src/lib/pabau/throttle.ts` (new), `convex/pabauApiUsage.ts` (new)
- **Verify:** Unit test: 5 rapid calls take ≥10s (4 gaps × 2.5s); mock 502 retries 3× then throws; mock 429 trips circuit breaker

### S2.3 — Map form fields to Pabau lead schema
- **As** developer
- **I want** the contact form fields to match Pabau's expected lead payload 1-to-1
- **So that** no transformation logic lives in the submit handler
- **Acceptance:**
  - Form fields: `first_name`, `last_name`, `email`, `mobile`, `treatment_interest` (dropdown, mapped to Pabau custom field), `message` → `notes`, `marketing_consent` (checkbox)
  - Hidden field: `lead_source` from env, `lead_status` = "Open Lead" (or whatever Q3/Q4 returns)
  - Schema documented as a Zod schema in `src/lib/pabau/schemas/lead.ts`
- **Files:** `src/components/forms/ContactForm.tsx`, `src/lib/pabau/schemas/lead.ts` (new)
- **Verify:** Submit form in dev → log payload matches Pabau docs verbatim
- **Depends on:** Q4

### S2.4 — Build `/api/pabau/leads` POST route
- **As** site visitor
- **I want** to submit the contact form and reach Pabau
- **So that** my inquiry is routed to Karlyne's CRM workflow
- **Acceptance:**
  - Route validates request body with the Zod schema from S2.3
  - Calls `pabau.leads.create()`
  - Returns `{ success: true, leadId }` on 200
  - Returns `{ success: false, error: <safe message> }` on 4xx/5xx with appropriate status
  - Rate limited: 5 submissions per IP per minute (basic abuse protection)
- **Files:** `src/app/api/pabau/leads/route.ts` (new)
- **Verify:** Submit form against staging Pabau → lead appears in Pabau dashboard

### S2.5 — Wire form to new endpoint + handle failure
- **As** site visitor
- **I want** clear feedback when submission succeeds or fails
- **So that** I know whether to follow up another way
- **Acceptance:**
  - Success: thank-you state, "we'll be in touch within 24 hours"
  - Failure: error state with `mailto:` fallback button ("Email us directly") prefilled with the form contents
  - No localStorage / sessionStorage of form data (privacy)
- **Files:** `src/components/forms/ContactForm.tsx`
- **Verify:** Kill Pabau key in env → submit → mailto fallback appears with form data prefilled

### S2.6 — Update privacy policy + form consent copy
- **As** site visitor
- **I want** transparent disclosure about where my data goes
- **So that** the site is compliant and trustworthy
- **Acceptance:**
  - Below the form, micro-copy: "By submitting, you agree to be contacted by MADE Med Spa. Your info is handled in our secure CRM (Pabau)." → DONE in `ContactForm.tsx`
  - Marketing consent checkbox is **opt-in, unchecked by default** → DONE
  - Privacy policy text lives in Convex `siteContent` (content-managed by admin, not code). Client/admin must update it via `/admin/pages` to mention Pabau as third-party processor before launch.
  - Suggested paragraph to send to admin to paste in: "When you submit a form on our website, your information is transmitted directly to our patient management system (Pabau) where it is securely stored and managed by MADE Med Spa staff. We do not retain a separate copy on our website."
- **Files:** `src/components/forms/ContactForm.tsx` (DONE), Convex `siteContent.privacy_policy` (admin task)
- **Verify:** Confirm with client that the privacy paragraph above is acceptable, then they paste it via admin portal

---

## E3 — Webhook receiver foundation

### S3.1 — Add `pabauWebhookEvents` idempotency table
- **As** developer
- **I want** a record of every webhook event received
- **So that** retries don't double-write and we have an audit log
- **Acceptance:**
  - New Convex table: `pabauWebhookEvents` with fields `eventId` (unique), `entityType`, `action`, `payload`, `receivedAt`, `processedAt`, `status` ("received" | "processed" | "failed"), `errorMessage`
  - Index on `by_eventId` for fast dedup lookup
- **Files:** `convex/schema.ts`, `convex/pabauWebhookEvents.ts` (new)
- **Verify:** Convex dashboard shows new table

### S3.2 — Build webhook receiver route with signature verification
- **As** developer
- **I want** to verify every webhook came from Pabau before acting
- **So that** the endpoint can't be spoofed
- **Acceptance:**
  - `POST /api/pabau/webhooks` accepts JSON
  - Verifies signature per Q2 mechanism (HMAC over raw body, constant-time compare)
  - Rejects with 401 if signature invalid
  - Rejects with 400 if body schema invalid
  - Returns 200 within 3s; heavy work happens via Convex action queued from the route
  - Idempotency: if `eventId` already in `pabauWebhookEvents`, return 200 without reprocessing
- **Files:** `src/app/api/pabau/webhooks/route.ts` (new), `src/lib/pabau/verifyWebhook.ts` (new)
- **Verify:** Send forged request → 401. Send valid request → 200. Send same request twice → second is no-op.
- **Depends on:** Q2

### S3.3 — Webhook event router (entity-type dispatch)
- **As** developer
- **I want** a single dispatch layer that routes events to entity handlers
- **So that** adding new entities is one new handler file, not new routing logic
- **Acceptance:**
  - `src/lib/pabau/webhookHandlers/index.ts` maps `entityType` → handler module
  - Handlers receive `(action, payload)` and return `{ ok: true }` or `{ ok: false, error }`
  - Unknown entity types log and return 200 (don't fail Pabau's retry loop on entities we don't care about)
- **Files:** `src/lib/pabau/webhookHandlers/index.ts` (new)
- **Verify:** Send `client.create` event → router dispatches; send `unknown.create` → logs + returns 200

### S3.4 — Admin webhook log page
- **As** admin
- **I want** to see incoming webhook events
- **So that** I can debug when something doesn't appear on the site
- **Acceptance:**
  - `/admin/pabau/webhooks` lists last 100 events: timestamp, entity, action, status, error (if any)
  - "Replay" button on failed events
  - Filter by status / entity type
- **Files:** `src/app/admin/pabau/webhooks/page.tsx` (new), `src/app/admin/layout.tsx` (sidebar link)
- **Verify:** Trigger a Pabau event → appears in log within 60s

---

## E4 — Pabau → Convex sync (existing entities)

### S4.1 — Add `pabauSyncedAt` watermark to mirrored tables
- **As** developer
- **I want** to know when each row was last synced from Pabau
- **So that** stale data is visible in admin and reconciliation jobs can detect drift
- **Acceptance:**
  - `services`, `shopProducts`, `memberships` tables get `pabauSyncedAt: number` field
  - Admin row views show "Last synced: 2m ago"
- **Files:** `convex/schema.ts`, `src/app/admin/services/page.tsx`, `src/app/admin/shop/page.tsx`, `src/app/admin/memberships/page.tsx`

### S4.2 — Service webhook handler
- **As** admin
- **I want** services edited in Pabau to update on the site automatically
- **So that** I never have to remember to click "Sync"
- **Acceptance:**
  - Handler for `service.create`, `service.update`, `service.delete` (or whatever Q1 confirms)
  - Upsert by `pabauServiceId`; delete = soft-delete (set `isActive: false`) so historical bookings don't break
- **Files:** `src/lib/pabau/webhookHandlers/service.ts` (new)
- **Verify:** Edit a service in Pabau staging → site shows update on next page load
- **Depends on:** Q1 (if services not in webhooks, build polling instead — see S4.5)

### S4.3 — Shop product webhook handler
- Same shape as S4.2, for `shopProducts`
- **Files:** `src/lib/pabau/webhookHandlers/product.ts` (new)
- **Depends on:** Q1

### S4.4 — Membership webhook handler
- Same shape as S4.2, for `memberships`
- Note: memberships may not exist as a Pabau entity (they were admin-managed). Confirm with client whether memberships move to Pabau or stay admin-only.
- **Files:** `src/lib/pabau/webhookHandlers/membership.ts` (new)

### S4.5 — Polling fallback for entities not covered by webhooks
- **As** developer
- **I want** a Convex scheduled action to poll Pabau every 15 minutes
- **So that** entities without webhook coverage stay fresh
- **Acceptance:**
  - Convex cron: every 15 min calls `pabau.services.list()`, `pabau.products.list()`, `pabau.reviews.list()` (only those NOT covered by webhooks per Q1)
  - Diff against current Convex state; upsert changed, soft-delete missing
  - Updates `pabauSyncedAt` on every row touched
  - Logs run summary to a `pabauSyncRuns` table
- **Files:** `convex/crons.ts` (new or updated), `convex/pabauSync.ts` (new)
- **Verify:** Wait 15 min → sync run logged; manually delete a service in Pabau → marked inactive on site within 15 min

### S4.6 — Manual "Sync now" button (rate-limited)
- **As** admin
- **I want** to force a sync without waiting for the next cron tick
- **So that** when I add or edit something in Pabau I can verify it on the site immediately
- **Acceptance:**
  - `/admin/pabau` has per-entity buttons: "Sync Services", "Sync Products", "Sync Reviews", "Sync Memberships", and a master "Sync All"
  - Each button:
    - Disabled for 30s after click (per entity, per admin user) — visual cooldown timer on button
    - Calls the same sync function the cron uses (single source of truth)
    - Shows toast: "Syncing services…" → "Synced — 3 added, 1 updated, 0 removed"
    - On rate-limit error: red toast "Rate limited — try again in 5 min"
  - "Sync All" runs sequentially (not parallel) respecting the 2.5s throttle
  - Last manual sync timestamp + admin user shown next to each button
  - Reuses cron's logic — `convex/pabauSync.ts` exports a single `syncEntity(entityType)` function called by both cron and admin
- **Files:** `src/app/admin/pabau/page.tsx`, `convex/pabauSync.ts`
- **Verify:** Add a service in Pabau staging → click "Sync Services" → service appears on site within seconds. Click again within 30s → button disabled. Click 5 entities rapidly → throttle enforces 2.5s spacing.

---

## E5 — Reviews on /testimonials from Pabau

### S5.1 — Add `pabauReviews` table
- **As** developer
- **I want** a table that mirrors Pabau reviews + holds site-only display flags
- **So that** content comes from Pabau but curation stays site-side
- **Acceptance:**
  - `pabauReviews` table: `pabauReviewId` (unique), `name`, `quote`, `treatment`, `rating`, `pabauCreatedAt`, `pabauUpdatedAt`, `pabauSyncedAt`, `isFeatured`, `displayOrder`, `isHidden`
  - Index on `by_pabauReviewId`
- **Files:** `convex/schema.ts`, `convex/pabauReviews.ts` (new — query + curation mutations only, no content mutations)
- **Depends on:** Q5

### S5.2 — Reviews sync (webhook or cron per Q1)
- Same pattern as S4.2
- On insert: default `displayOrder` = max + 1, `isFeatured` = false, `isHidden` = false
- On update: only refresh content fields, **never touch curation flags**
- **Files:** `src/lib/pabau/webhookHandlers/review.ts` (new) OR addition to `convex/pabauSync.ts`

### S5.3 — Migrate existing hardcoded testimonials
- **As** developer
- **I want** existing curated testimonials exported before deletion
- **So that** if Karlyne wants to reuse them as Pabau reviews she can paste them in
- **Acceptance:**
  - One-off script `scripts/export-testimonials.ts` writes current Convex `testimonials` → `docs/testimonials-archive.csv`
  - File committed for history
- **Files:** `scripts/export-testimonials.ts` (new), `docs/testimonials-archive.csv` (new)

### S5.4 — Swap testimonials page data source
- **As** site visitor
- **I want** to see real reviews from MADE clients
- **So that** social proof is authentic
- **Acceptance:**
  - `/testimonials` reads from `pabauReviews` (excluding `isHidden`)
  - Featured reviews appear first; rest sorted by `displayOrder` then `pabauCreatedAt` desc
  - Empty state: "Reviews coming soon" (handles cold-start before first sync)
- **Files:** `src/app/testimonials/page.tsx`, `src/app/page.tsx` (homepage testimonial section)
- **Verify:** Add a test review in Pabau → appears on /testimonials within 60s (or 15 min if polling)

### S5.5 — Convert `/admin/testimonials` to curation-only
- **As** admin
- **I want** to feature, hide, or reorder reviews without editing their content
- **So that** review text remains authentic and Pabau-owned
- **Acceptance:**
  - List view of all `pabauReviews`
  - Per row: toggle `isFeatured`, toggle `isHidden`, drag to reorder (or numeric input for `displayOrder`)
  - "Edit" / "Create" / "Delete" buttons removed
  - "View in Pabau" link per row
- **Files:** `src/app/admin/testimonials/page.tsx`
- **Verify:** Toggle featured → site reflects without a Pabau call

### S5.6 — Drop old testimonials table
- After S5.4 ships and is verified stable for 1 week, remove old `testimonials` table from `convex/schema.ts`
- **Files:** `convex/schema.ts`, delete `convex/testimonials.ts`

---

## E1 — Decommission site-only contact storage (do AFTER E2 is live)

### S1.1 — Remove `/admin/contacts`
- Delete `src/app/admin/contacts/page.tsx`
- Remove sidebar link in `src/app/admin/layout.tsx`
- Remove "X new contacts" badge + alert in `src/app/admin/page.tsx`
- **Verify:** No 404s, no broken links

### S1.2 — Drop `contactSubmissions` Convex code
- Delete `convex/contactSubmissions.ts`
- Remove `contactSubmissions` from `convex/schema.ts`
- Remove any imports of `api.contactSubmissions` across the codebase
- **Verify:** `npm run build` + `npx convex dev` both clean

### S1.3 — One-off export of existing submissions before delete
- Export current `contactSubmissions` rows to CSV (in case any pre-launch test data is useful)
- Save to `docs/contactSubmissions-archive.csv`, commit, then drop table

---

## E6 — Site CTA cleanup

### S6.1 — Audit all "Reach out" / "Contact us" CTAs
- **As** developer
- **I want** an inventory of every contact CTA on the site
- **So that** none are missed
- **Acceptance:** List of (file, line, current behavior, target behavior) covering: `/services`, `/shop`, `/membership`, `/faq`, `/testimonials`, home, footer
- **Files:** Add inventory to this doc as a checklist

### S6.2 — Standardize page-bottom CTAs
- **As** site visitor
- **I want** clear, consistent next steps at the bottom of each page
- **So that** I'm never confused about how to take action
- **Acceptance:**
  - Service / membership / shop pages: bottom CTA = "Book a consultation" → Pabau booking deep link
  - FAQ / testimonials / about: bottom CTA = "Have a question? Get in touch" → `/contact`
  - No page outside `/contact` contains form fields
- **Files:** all pages identified in S6.1
- **Verify:** Click each CTA — confirm correct destination

### S6.3 — Footer CTA
- **As** site visitor
- **I want** one clear contact entry point in the footer
- **So that** I don't see multiple competing options
- **Acceptance:** Footer has phone (tel:), email (mailto:), one "Contact" link → `/contact`
- **Files:** `src/components/Footer.tsx` (or wherever footer lives)

---

## E7 — Admin portal repositioning

### S7.1 — Convert `/admin/services` to read-only-with-overlays
- Pabau-owned fields (name, description, price, duration, category): **read-only**, badge "Synced from Pabau"
- Site-only fields (`featured`, `displayOrder`, `seoDescription`, `heroImage`): editable
- "View in Pabau" link per service
- **Files:** `src/app/admin/services/page.tsx`

### S7.2 — Same for `/admin/shop` and `/admin/memberships`
- Same pattern as S7.1
- **Files:** `src/app/admin/shop/page.tsx`, `src/app/admin/memberships/page.tsx`

### S7.3 — `/admin/pabau` becomes sync health dashboard
- Top of page: per-entity card showing `lastSyncedAt`, `lastWebhookReceivedAt`, count, status (green/yellow/red based on staleness)
- Manual sync buttons (from S4.6)
- Link to `/admin/pabau/webhooks` event log
- **Files:** `src/app/admin/pabau/page.tsx`

### S7.4 — Update `/admin/system` (in-app guide) to explain new model
- Replace existing copy explaining "you edit services here" → "services live in Pabau; here you control display order + featuring"
- Add troubleshooting section: "service not showing? Check webhook log → check sync timestamp → click Sync now"
- **Files:** `src/app/admin/system/page.tsx`

---

## E8 — Documentation + handoff

### S8.1 — Write `docs/pabau-integration.md`
- Endpoints used (with URLs)
- Webhook event types we listen to + what they do
- Polling fallback list
- Failure behavior + fallback paths
- Env vars + where they come from
- **Files:** `docs/pabau-integration.md` (new)

### S8.2 — Update `docs/sprint-plan.md`
- Mark integration work done; replace future-tense plans with current-state description
- **Files:** `docs/sprint-plan.md`

### S8.3 — Update `docs/MADE-Website-Overview.html`
- Reflect Pabau-as-source-of-truth model in the architecture description
- **Files:** `docs/MADE-Website-Overview.html`

### S8.4 — Update `docs/PRODUCTION-DEPLOYMENT.md`
- Add: Pabau env vars in Vercel, webhook URL to register in Pabau dashboard, post-deploy verification (send test webhook, send test lead)
- **Files:** `docs/PRODUCTION-DEPLOYMENT.md`

### S8.5 — Walkthrough video / written handoff for marketing team
- Screen recording: "how to feature a review", "how to check if a service synced", "what to do if something looks wrong"
- 5 min max
- **Files:** linked from `/admin/system` page

---

# RECOMMENDED BUILD SEQUENCE

```
Pre-flight: Get answers to Q1–Q8 from Pabau rep ────────────┐
                                                            ▼
Phase A — Lead push live (low risk, additive)
  E2.1 → E2.2 → E2.3 → E2.4 → E2.5 → E2.6
  ▼
  Verify: lead arrives in Pabau staging from a real form submit
  ▼
Phase B — Webhook engine (foundation for all read-side sync)
  E3.1 → E3.2 → E3.3 → E3.4
  ▼
  Verify: send test webhook from Pabau, see it in admin log
  ▼
Phase C — Reviews (lowest-stakes entity to prove the pipe)
  E5.1 → E5.2 → E5.3 → E5.4 → E5.5
  ▼
  Verify: real review in Pabau appears on /testimonials
  ▼
Phase D — Existing entities sync
  E4.1 → E4.2 → E4.3 → E4.4 → E4.5 → E4.6
  ▼
  Verify: service edit in Pabau updates site
  ▼
Phase E — Cleanup (only after A–D verified stable for ≥1 week)
  E1.1 → E1.2 → E1.3
  E6.1 → E6.2 → E6.3
  E7.1 → E7.2 → E7.3 → E7.4
  E5.6 (drop old testimonials table)
  ▼
Phase F — Handoff
  E8.1 → E8.2 → E8.3 → E8.4 → E8.5
```

**Why this order:**
1. **Lead push first** — gives us a working alternative before we delete the old contact flow
2. **Webhooks before sync handlers** — handlers are cheap once the receiver is solid
3. **Reviews before services** — reviews are net-new, so a bug just means "no reviews yet" (no regression). Services breaking would be a customer-facing outage
4. **Cleanup last** — never delete the old path until the new one has soaked

---

# VERIFICATION CHECKLIST (run before each phase ships)

## After Phase A (lead push)
- [ ] Submit form on staging → lead in Pabau with all fields populated
- [ ] Submit form with Pabau env unset → mailto fallback appears with prefilled data
- [ ] Submit form with invalid email → form-level validation blocks
- [ ] Hit the endpoint 6× rapidly from one IP → 6th call returns 429
- [ ] Privacy policy links work from form

## After Phase B (webhook engine)
- [ ] Forged webhook (bad signature) → 401
- [ ] Valid webhook → 200, appears in `/admin/pabau/webhooks`
- [ ] Same `eventId` sent twice → 2nd is no-op (check `processedAt` unchanged)
- [ ] Receiver returns within 3s under load (basic load test)

## After Phase C (reviews)
- [ ] Add review in Pabau → appears on /testimonials within 60s (or 15 min if polling)
- [ ] Toggle "featured" in admin → review moves to top without Pabau call
- [ ] Hide review in admin → disappears from /testimonials
- [ ] Edit review text in Pabau → site updates; admin curation flags untouched
- [ ] Cold-start (zero reviews) → "Reviews coming soon" empty state

## After Phase D (services/products/memberships)
- [ ] Edit a service price in Pabau → site shows new price within 60s
- [ ] Delete a service in Pabau → marked inactive on site (not hard-deleted)
- [ ] `pabauSyncedAt` timestamp visible in admin and updates correctly
- [ ] Manual "Sync now" works as expected

## After Phase E (cleanup)
- [ ] No references to `contactSubmissions` anywhere in codebase (`grep` clean)
- [ ] No `/admin/contacts` route (404 on direct visit)
- [ ] No form fields on any non-`/contact` page
- [ ] Build + type check + Convex deploy all clean

## After Phase F (handoff)
- [ ] Marketing team can articulate: "where do reviews come from?" — answer: Pabau
- [ ] Marketing team can articulate: "how do I make a review featured?" — answer: admin toggle
- [ ] Production deploy doc has Pabau setup steps verified by deploying to a fresh Vercel project

---

# ROLLBACK PLAN

If Pabau integration breaks in production:

| Failure | Impact | Rollback |
|---|---|---|
| Lead form push fails | New leads not captured | Form already falls back to `mailto:` per S2.5 — no rollback needed, just monitor |
| Webhook receiver down | Site data goes stale | Polling fallback (S4.5) keeps data within 15 min |
| Sync writes bad data to Convex | Site shows wrong info | Restore Convex from snapshot; pause cron; investigate |
| Pabau API key leaked | Credential compromise | Rotate key in Pabau, update Vercel env, redeploy |

**Pre-launch:** confirm Convex point-in-time recovery is enabled.

---

# OPEN ITEMS / FUTURE

- [ ] Consider Pabau client (not lead) creation flow if Karlyne wants form submissions to become full client records, not leads. Decision deferred — leads are correct default.
- [ ] Appointment webhooks (`appointment.create`) — could power "X bookings this week" stats on admin dashboard, but out of scope for v1.
- [ ] Two-way sync for hero images / SEO copy: today these are site-only. If Pabau ever adds image management, decide whether to mirror.
- [ ] Webhook retry queue: if a handler fails, currently logged + manual replay only. Could automate retry with backoff later.

# Pabau Integration — Reference

**Status:** Implementation complete pending Pabau rep answers (Q1–Q8 in `pabau-integration-plan.md`).
**Model:** Pabau is the source of truth. The site is a marketing surface; Convex is a read-replica + holds site-only display flags.

---

## Data flow

```
                  Site visitor
                       │
                       ▼
        ┌────────────────────────────┐
        │   /contact lead form        │
        │   (1-to-1 with Pabau)       │
        └────────────────────────────┘
                       │ POST
                       ▼
        ┌────────────────────────────┐
        │  /api/pabau/leads           │  ← server-only, throttled
        │  (validates, redacts key)   │
        └────────────────────────────┘
                       │
                       ▼
                    Pabau

Pabau writes ─────────────────────► our site
  │
  ├─ Webhook  ──► /api/pabau/webhooks  ──► Convex tables (cache)
  │                  (HMAC-SHA256 verify)
  │
  └─ Polling  ──► Convex cron (15m) ───► /services, /products, /reviews
                                         ──► upsert/soft-delete in Convex
```

---

## Endpoints used

| Direction | Path | Method | Purpose |
|---|---|---|---|
| Site → Pabau | `/{api_key}/leads` | POST | Create lead from contact form |
| Site → Pabau | `/{api_key}/services` | GET | Sync services (15m cron + manual) |
| Site → Pabau | `/{api_key}/products` | GET | Sync shop products (15m cron + manual) |
| Site → Pabau | `/{api_key}/reviews` | GET | Sync reviews (15m cron + manual) |
| Pabau → Site | `/api/pabau/webhooks` | POST | Inbound events: client/lead/appointment/activity/invoice |

Base URL: `https://api.oauth.pabau.com` (override with `PABAU_API_BASE_URL` if Pabau provides a pod-specific URL).

---

## Rate limits (verified)

Source: https://support.pabau.com/en/api/rate-limits

- **Throttle:** 1 request per 2 seconds (company-wide)
- **Daily POST/PUT cap:** 10,000 / 24h
- **Breach response:** HTTP 429 → 5-min circuit breaker opens; admin sees red banner

Our enforcement (`src/lib/pabau/throttle.ts`):
- Global queue with 2.5s minimum spacing (buffer above the documented 2s)
- 5-min circuit breaker on 429
- All calls counted in `pabauApiUsage` Convex table for budget visibility

Daily projection:
- Reads: ~454/day (~1.1% of theoretical 43k ceiling)
- Writes: <100/day (~1% of 10k cap)

---

## Webhook events

Subscribed entities (per Pabau docs):

| Entity | create | update | delete | Handler |
|---|---|---|---|---|
| `client` | ✓ | ✓ | ✓ | stub (logs only) |
| `lead` | ✓ | ✓ | ✓ | stub (logs only) |
| `appointment` | ✓ | ✓ | ✓ | stub (logs only) |
| `activity` | ✓ | ✓ | ✓ | stub (logs only) |
| `invoice` | ✓ | ✓ | ✓ | stub (logs only) |

**Service / product / review entities are NOT in the published webhook list.** Polling covers those (15-min cron). If Pabau confirms webhook coverage for these entities (Q1), promote them to webhook handlers and reduce cron frequency or remove the cron.

### Verification

`src/lib/pabau/verifyWebhook.ts` — HMAC-SHA256 hex over raw request body, constant-time compare. Header expected: `x-pabau-signature` or `x-pabau-webhook-signature`. Supports optional `sha256=` prefix.

If Pabau uses a different scheme (Q2), only this file needs to change.

### Idempotency

Every event is logged to `pabauWebhookEvents` with the Pabau `event_id` as the dedup key. Duplicate deliveries are acked and skipped — no double-write risk.

### Replay

Failed events can be re-queued from `/admin/pabau/webhooks`.

---

## Convex tables (Pabau-related)

| Table | Purpose | Curation flags |
|---|---|---|
| `services` | Mirror of Pabau services | `isActive` (site override), `sortOrder`, `imageUrl` |
| `shopProducts` | Mirror of Pabau products | `isActive`, `sortOrder`, `imageUrl`, `category` |
| `pabauReviews` | Mirror of Pabau reviews (read-only content) | `isFeatured`, `isHidden`, `displayOrder` |
| `pabauWebhookEvents` | Idempotency log + audit trail | — |
| `pabauApiUsage` | Per-day usage counter (admin visibility) | — |

**Sync watermark:** `pabauSyncedAt` field on every Pabau-mirrored row. Admin shows "Last synced X ago" badge.

**Soft delete:** removed entities become `isActive: false` rather than hard-deleted. Preserves slugs and any external links.

**Curation flags are never overwritten by sync** — admins can feature/hide reviews without losing those choices on the next sync.

---

## Environment variables

| Variable | Purpose | Required |
|---|---|---|
| `PABAU_API_KEY` | API key from Pabau Developer Hub | yes |
| `PABAU_COMPANY_ID` | Numeric company ID | yes |
| `PABAU_WEBHOOK_SECRET` | HMAC secret shared with Pabau webhook config | yes (for webhooks) |
| `PABAU_LEAD_SOURCE_ID` | "Website" lead source ID for tagging | recommended |
| `PABAU_API_BASE_URL` | Override only if Pabau provides pod URL | no (defaults to `https://api.oauth.pabau.com`) |
| `NEXT_PUBLIC_PABAU_BOOKING_URL` | Public booking deep-link (already in use) | yes |

`src/lib/pabau/config.ts` validates these on first load and throws with a clear error if any required var is missing.

---

## Failure modes + behavior

| Scenario | Behavior | User impact |
|---|---|---|
| `/leads` POST fails (network) | Error response → form shows mailto fallback | None — fallback captures lead |
| `/leads` POST returns 429 | Circuit breaker opens 5 min → mailto fallback | None |
| Webhook arrives during outage | Pabau retries (per their config); idempotency dedups | Slight delay in site update |
| Cron run fails | Next 15-min tick retries | Up to 30-min staleness |
| `PABAU_API_KEY` missing | All Pabau calls return 503 → mailto fallback for leads | Site otherwise functional with cached data |
| 429 sustained | Reads + writes blocked 5 min; admin alert | Manual sync disabled, cron skips, contact form falls back to mailto |

---

## Manual sync

Admin can force a sync from `/admin/pabau`:
- Per-entity buttons (Reviews / Services / Products)
- 30s cooldown per button (per admin user) prevents button-mashing
- Memberships button is informational — memberships are admin-managed, not Pabau-sourced
- Same code path as cron (`syncEntity` action in `convex/pabauSync.ts`) — single source of truth

---

## Testing

Pre-launch smoke test (run after Pabau rep answers Q1–Q8):

1. **Lead flow:** submit form on staging → lead appears in Pabau staging dashboard within 5 seconds
2. **Lead failure:** unset `PABAU_API_KEY` → submit form → mailto fallback button appears with prefilled body
3. **Webhook signature:** POST forged event to `/api/pabau/webhooks` → 401
4. **Webhook idempotency:** POST same valid event twice → second call no-op (visible in `/admin/pabau/webhooks`)
5. **Service sync:** edit a service in Pabau staging → click "Sync Services" in admin → updated price visible on `/services` within seconds
6. **Service soft-delete:** delete a service in Pabau staging → after sync, service marked inactive (not removed from DB)
7. **Reviews:** add a review in Pabau → after cron tick (≤15 min) or manual sync, review appears on `/testimonials`

---

## File map

```
src/lib/pabau/
├── config.ts          ─ env loader + validation
├── client.ts          ─ typed Pabau API client (server-only, throttled)
├── throttle.ts        ─ global 2.5s queue + circuit breaker
├── types.ts           ─ DTOs + error classes
├── verifyWebhook.ts   ─ HMAC signature verification
├── schemas/
│   └── lead.ts        ─ form input validator + Pabau payload mapper
└── webhookHandlers/
    └── index.ts       ─ entity router (stub handlers, ready for expansion)

src/app/api/pabau/
├── leads/route.ts     ─ POST endpoint for contact form
├── services/route.ts  ─ legacy GET (used by manual import flow)
└── webhooks/route.ts  ─ inbound webhook receiver

convex/
├── pabauSync.ts       ─ syncReviews/syncServices/syncProducts actions
├── pabauReviews.ts    ─ read queries + curation mutations
├── pabauApiUsage.ts   ─ usage counter + syncHealth dashboard query
├── pabauWebhookEvents.ts ─ idempotency + audit log
├── crons.ts           ─ 15-min polling jobs
├── services.ts        ─ + internal upsertFromPabau / softDeleteByPabauId
└── shopProducts.ts    ─ + internal upsertFromPabau / softDeleteByPabauId
```

---

## What is NOT integrated (deliberately)

- **Memberships** — no Pabau entity; remain admin-managed in Convex
- **Bookings/appointments writes from site** — visitors book via Pabau directly (`NEXT_PUBLIC_PABAU_BOOKING_URL`)
- **Payments** — handled in Pabau, never touched by the site
- **Client/patient PII** — site only writes leads (post-conversion this becomes Pabau's responsibility)

---

## Future work

- Promote service/product/review polling to webhooks once Pabau confirms coverage (Q1) — eliminates 288 daily GETs
- Wire real handlers for `client`, `lead`, `appointment` events (currently stub) — useful for future features like "X bookings this week" admin stat
- Reviews enrichment: fetch full review payload via `/reviews/{id}` if list endpoint omits fields
- Two-way sync for service hero images / SEO copy if Pabau ever supports image management

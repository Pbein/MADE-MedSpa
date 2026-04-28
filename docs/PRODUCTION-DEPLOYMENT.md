# Production Deployment Runbook — MADE Med Spa

## Overview

This site runs on three services that each need production configuration:
1. **Convex** — real-time database and backend functions
2. **Clerk** — authentication for the admin portal
3. **Vercel** (or hosting platform) — serves the Next.js site

Currently everything runs on development instances. This guide walks through switching to production.

---

## Pre-Flight Checklist

Before starting, confirm you have:
- [ ] Access to [Convex Dashboard](https://dashboard.convex.dev)
- [ ] Access to [Clerk Dashboard](https://dashboard.clerk.com)
- [ ] Access to hosting platform (Vercel, etc.)
- [ ] Domain `mademedspa.com` DNS access
- [ ] Client has provided: phone number, booking URL (still pending)
- [ ] Final list of admin email addresses (Karlyne + marketing team + dev) — see "Pre-cutover security setup" below

---

## Pre-cutover security setup (admin allowlist)

`/admin` is gated by an email allowlist in `ADMIN_EMAILS`. Without this set in
production, the deploy will fail at config-load time (`parseAdminEmails` throws
when `NODE_ENV === "production"` and the var is empty). The allowlist must be
populated in **both** environments before cutover:

### 1. Vercel (Next.js middleware)
Settings → Environment Variables → add for the **Production** scope:

| Variable | Value |
|---|---|
| `ADMIN_EMAILS` | `karlyne@mademedspa.com,marketing@mademedspa.com,philip@…` (comma-separated, no spaces required) |

Trigger a redeploy after setting so the new value is picked up.

### 2. Convex production deployment (mutations)
The Convex deployment has its own env store — Vercel env vars do **not** reach
Convex. Set the same value there:

```bash
npx convex env set ADMIN_EMAILS "karlyne@mademedspa.com,marketing@mademedspa.com,philip@…" --prod
```

Verify:
```bash
npx convex env list --prod | grep ADMIN_EMAILS
```

### 3. Verification (post-deploy)
- Sign in to `/admin` as a non-allowlisted Clerk user → expect HTTP 403.
- Sign in as an allowlisted user → admin pages load, mutations succeed.
- Public routes (`/`, `/services`, `/contact`) work without auth.
- Browser devtools → Network: a non-allowlisted signed-in user calling an admin
  mutation directly should see a Convex error `"Unauthorized: not an admin"`.

### Adding/removing admins post-launch
Update `ADMIN_EMAILS` in **both** Vercel and Convex (the values must match).
Removed users keep their Clerk session token until it expires (typically <1 hr)
but cannot perform new admin mutations once Convex is updated. For immediate
revocation, also revoke the user's session in the Clerk dashboard.

---

## Step 1: Convex Production Deployment (~15 min)

### 1a. Create production deployment
1. Go to https://dashboard.convex.dev
2. Select the `karlynemedspa` project
3. Click **"Create Production Deployment"** (or check if one already exists)
4. Note the new deployment ID (format: `prod:xxx-xxx-xxx`)
5. Note the new URLs:
   - `NEXT_PUBLIC_CONVEX_URL` = `https://xxx.convex.cloud`
   - `NEXT_PUBLIC_CONVEX_SITE_URL` = `https://xxx.convex.site`

### 1b. Deploy schema and functions to production
```bash
npx convex deploy --prod
```
This pushes your schema, queries, mutations, and actions to the production deployment.

### 1c. Data strategy
Production starts with an **empty database**. Two options:

**Option A: Seed data (recommended)**
```bash
# Set CONVEX_DEPLOYMENT to prod ID temporarily
CONVEX_DEPLOYMENT=prod:xxx npx convex run seed:run
```
This populates services, FAQs, testimonials, team, business info, legal pages, and 4 membership tiers from the seed file. The client can then edit everything via the admin portal.

**Option B: Manual entry**
The client enters everything through the admin portal from scratch. Only recommended if she wants to start completely fresh.

### 1d. Verify
- Open the Convex dashboard → Production deployment
- Check that tables have data (services, faqs, testimonials, etc.)
- Run a test query in the dashboard to confirm

---

## Step 2: Clerk Production Keys (~10 min)

### 2a. Switch to production mode
1. Go to https://dashboard.clerk.com
2. Select your application
3. Go to **Settings → Production** (or create a production instance)
4. Copy the new keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = `pk_live_...`
   - `CLERK_SECRET_KEY` = `sk_live_...`

### 2b. Configure production domain
1. In Clerk dashboard → **Domains**
2. Add `mademedspa.com` and `www.mademedspa.com`
3. Set the home URL to `https://mademedspa.com`

### 2c. Set Clerk Frontend API URL
1. In Clerk dashboard, find the Frontend API URL
2. This goes into `CLERK_FRONTEND_API_URL` environment variable
3. This is required for Convex auth integration

### 2d. Update Convex auth config
Check `convex/auth.config.ts` — it may need the production Clerk domain/URL. Update if it references a dev-specific Clerk endpoint.

---

## Step 3: Environment Variables on Hosting Platform (~10 min)

Set ALL of these on your hosting platform (Vercel dashboard → Settings → Environment Variables):

| Variable | Dev Value | Prod Value |
|----------|-----------|------------|
| `CONVEX_DEPLOYMENT` | `dev:energized-akita-520` | `prod:xxx` (from Step 1) |
| `NEXT_PUBLIC_CONVEX_URL` | `https://energized-akita-520.convex.cloud` | New prod URL |
| `NEXT_PUBLIC_CONVEX_SITE_URL` | `https://energized-akita-520.convex.site` | New prod URL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_...` | `pk_live_...` (from Step 2) |
| `CLERK_SECRET_KEY` | `sk_test_...` | `sk_live_...` (from Step 2) |
| `CLERK_FRONTEND_API_URL` | (may not be set) | From Clerk dashboard |
| `ADMIN_EMAILS` | (optional locally) | **Required.** Comma-separated admin emails. Also set in Convex (see "Pre-cutover security setup"). |
| `PABAU_API_KEY` | `98a9j6...` | Same (already prod) |
| `NEXT_PUBLIC_PABAU_BOOKING_URL` | Current URL | Confirm with client |
| `NEXT_PUBLIC_SITE_URL` | `https://mademedspa.com` | Same |

**Important:** Do NOT commit these to git. They go in the hosting platform's environment variable settings only.

---

## Step 4: Domain & DNS (~5 min)

If using Vercel:
1. Go to Vercel → Project Settings → Domains
2. Add `mademedspa.com` and `www.mademedspa.com`
3. Set up redirect: `www.mademedspa.com` → `mademedspa.com`
4. Vercel provides DNS records to add at your domain registrar
5. Wait for DNS propagation (usually <30 min with Vercel)
6. Verify HTTPS is working

---

## Step 5: Deploy (~5 min)

```bash
# Merge branches to main
git checkout main
git merge feature/membership-shop-nav
git merge feature/admin-portal-redesign

# Push to trigger deployment
git push origin main
```

If using Vercel, the push to `main` automatically triggers a production build and deploy.

---

## Step 6: Post-Deploy Smoke Test (~15 min)

### Public site
- [ ] Homepage loads with video, sections render correctly
- [ ] Navigation works — all links, Explore dropdown
- [ ] Services page shows all services
- [ ] Membership page shows 4 tiers
- [ ] Shop page renders (may show "Coming Soon" if no products)
- [ ] Testimonials page shows all reviews with filtering
- [ ] Contact form submits successfully
- [ ] Booking link goes to Pabau
- [ ] FAQ page shows all questions with search
- [ ] Footer shows correct business info
- [ ] Mobile responsive — test on phone

### Admin portal
- [ ] Login works at `/admin` (Clerk auth)
- [ ] Dashboard shows correct stats
- [ ] Page editors load and save
- [ ] Image/video upload works
- [ ] Contact submissions appear
- [ ] SEO settings save

### SEO
- [ ] View page source — structured data present
- [ ] OG tags render correctly
- [ ] Canonical URLs point to `mademedspa.com`
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`

---

## Step 7: Google Search Console (~10 min)

1. Go to https://search.google.com/search-console
2. Add property `https://mademedspa.com`
3. Verify ownership (DNS TXT record or HTML meta tag)
4. Submit sitemap: `https://mademedspa.com/sitemap.xml`
5. Request indexing for the homepage

---

## Step 8: Security headers — enforce CSP after soak

The site ships with explicit security headers configured in `next.config.ts`:

- **Strict-Transport-Security** — forces HTTPS for 1 year, includes subdomains, preload-eligible
- **X-Frame-Options: DENY** — blocks our pages from being framed elsewhere
- **X-Content-Type-Options: nosniff** — disables MIME sniffing
- **Referrer-Policy: strict-origin-when-cross-origin**
- **Permissions-Policy** — disables camera/microphone/geolocation APIs
- **Content-Security-Policy-Report-Only** — currently in **Report-Only mode** (logs violations to the browser console without blocking)

### 8a. Verify with securityheaders.com

1. After deploying, visit https://securityheaders.com/
2. Enter `https://mademedspa.com` and scan
3. Target rating: **A** (Report-Only mode) → **A+** after enforcement
4. Scan should show all six headers present

### 8b. Soak period — what to watch for (1 week)

While `Content-Security-Policy-Report-Only` is active, open DevTools → Console on production pages and look for `[Report Only] Refused to load…` warnings. Expected sources of violations during soak:

- **Clerk dev preview** — any leftover dev-mode Clerk endpoints (should be gone in prod, but flag if seen)
- **Pabau widgets** — if the embedded packages widget loads from a host not yet allowlisted (currently `pabau.com` for scripts and `*.pabau.com` for frames)
- **Third-party scripts added later** — see "Future surfaces" below
- **Inline event handlers / new external scripts** the marketing team adds via the admin

Log any violations you see. If they're legitimate (i.e., something we want to keep), add the host to the appropriate directive in `next.config.ts`. If they're noise (random extension probes, etc.), ignore.

### 8c. Enforce CSP

After 1 week of clean reports:

1. In `next.config.ts`, change the header key from
   `Content-Security-Policy-Report-Only` → `Content-Security-Policy`
2. Re-deploy
3. Re-scan on https://securityheaders.com/ — rating should bump to **A+**
4. Smoke-test the booking iframe, admin login (Clerk), Convex realtime, and any contact-form post

If anything breaks, revert the header key to Report-Only, fix the allowlist, and try again.

### 8d. Future surfaces (when to update CSP)

| When you add… | Add to which directive | Hostname(s) |
|---|---|---|
| Google Analytics 4 | `script-src`, `connect-src`, `img-src` | `https://*.googletagmanager.com`, `https://*.google-analytics.com`, `https://*.analytics.google.com` |
| Google Tag Manager | `script-src`, `connect-src` | `https://*.googletagmanager.com` |
| Meta Pixel / Facebook | `script-src`, `connect-src`, `img-src` | `https://connect.facebook.net`, `https://*.facebook.com` |
| Hotjar / PostHog / Sentry | `script-src`, `connect-src` | Their respective CDN/ingest hosts |
| New embedded video host | `frame-src` | e.g. `https://*.youtube.com`, `https://*.vimeo.com` |
| Stripe (if added later) | `script-src`, `frame-src`, `connect-src` | `https://js.stripe.com`, `https://api.stripe.com` |

Always re-test in Report-Only mode first when adding a new third-party.

---

## Rollback Plan

If something goes wrong after deploying:

1. **Vercel:** Redeploy to a previous commit from the Vercel dashboard (instant)
2. **Convex:** Production data is independent — rolling back code doesn't affect data
3. **Clerk:** Auth keys don't change unless you rotate them
4. **DNS:** Revert DNS changes at registrar if domain issues

---

## Post-Launch (Week 1)

- [ ] Monitor Vercel deployment logs for errors
- [ ] Check Google Search Console for crawl errors
- [ ] Verify Pabau booking links work from production
- [ ] Client tests admin portal on production
- [ ] Set up Google Analytics when GA4 ID is provided
- [ ] Monitor Core Web Vitals in Search Console

---

## Credentials Handoff

At launch, provide the client with access to:
- [ ] GitHub repository (or transfer ownership)
- [ ] Convex dashboard (add as team member)
- [ ] Clerk dashboard (add as team member)
- [ ] Vercel project (add as team member)
- [ ] Domain registrar credentials
- [ ] This deployment document
- [ ] Admin guide (accessible at `/admin/guide` on the site)

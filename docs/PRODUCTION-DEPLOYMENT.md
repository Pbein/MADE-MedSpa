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

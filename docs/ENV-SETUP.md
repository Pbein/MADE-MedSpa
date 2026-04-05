# MADE Med Spa - Environment Variables Setup

## Overview

This document lists all environment variables required to run the MADE Med Spa application. Copy `.env.local.example` to `.env.local` and fill in the values.

---

## Required Variables

### Convex

| Variable | Description | Example |
| --- | --- | --- |
| `CONVEX_DEPLOYMENT` | Convex deployment identifier (auto-set by `npx convex dev`) | `dev:your-project-abc123` |
| `NEXT_PUBLIC_CONVEX_URL` | Public Convex deployment URL | `https://your-project-abc123.convex.cloud` |

### Clerk (Authentication)

| Variable | Description | Example |
| --- | --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (safe for client) | `pk_test_...` |
| `CLERK_SECRET_KEY` | Clerk secret key (server-only) | `sk_test_...` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in page path | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up page path | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Redirect after sign-in | `/` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Redirect after sign-up | `/` |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook signing secret (for user sync) | `whsec_...` |

### Stripe (Payments)

| Variable | Description | Example |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | Stripe secret key (server-only) | `sk_test_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (client) | `pk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook endpoint signing secret | `whsec_...` |
| `STRIPE_ESSENTIAL_PRICE_ID` | Stripe Price ID for Essential membership tier | `price_...` |
| `STRIPE_PREMIUM_PRICE_ID` | Stripe Price ID for Premium membership tier | `price_...` |
| `STRIPE_ELITE_PRICE_ID` | Stripe Price ID for Elite membership tier | `price_...` |
| `STRIPE_VIP_PRICE_ID` | Stripe Price ID for VIP membership tier | `price_...` |
| `NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL` | Stripe Customer Portal link (optional, can generate dynamically) | `https://billing.stripe.com/...` |

### Cal.com (Booking)

| Variable | Description | Example |
| --- | --- | --- |
| `NEXT_PUBLIC_CALCOM_EMBED_URL` | Cal.com scheduling page URL for embed | `https://cal.com/made-medspa` |
| `CALCOM_API_KEY` | Cal.com API key (for programmatic access, optional) | `cal_...` |
| `CALCOM_WEBHOOK_SECRET` | Cal.com webhook signing secret | `whsec_...` |

### Pabau (EMR / CRM)

| Variable | Description | Example |
| --- | --- | --- |
| `PABAU_API_KEY` | Pabau API authentication key | `pab_...` |
| `PABAU_API_URL` | Pabau API base URL (GraphQL) | `https://api.pabau.com/graphql` |
| `PABAU_COMPANY_ID` | Pabau company/practice identifier | `comp_...` |

### Resend (Email)

| Variable | Description | Example |
| --- | --- | --- |
| `RESEND_API_KEY` | Resend API key for transactional emails | `re_...` |
| `RESEND_FROM_EMAIL` | Sender email address (must be verified domain) | `hello@mademedispa.com` |
| `RESEND_REPLY_TO_EMAIL` | Reply-to email address | `info@mademedispa.com` |

### Application

| Variable | Description | Example |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Public application URL | `https://mademedispa.com` (prod) or `http://localhost:3000` (dev) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key for contact page embed (optional) | `AIza...` |

---

## Optional / Development Variables

| Variable | Description | Example |
| --- | --- | --- |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (if using Cloudinary for media) | `made-medspa` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abc...` |
| `ANALYZE` | Enable Next.js bundle analyzer | `true` |

---

## Convex Environment Variables

Some variables must also be set in the Convex dashboard (for server-side Convex functions that call external APIs):

```bash
npx convex env set STRIPE_SECRET_KEY sk_test_...
npx convex env set STRIPE_WEBHOOK_SECRET whsec_...
npx convex env set PABAU_API_KEY pab_...
npx convex env set PABAU_API_URL https://api.pabau.com/graphql
npx convex env set PABAU_COMPANY_ID comp_...
npx convex env set RESEND_API_KEY re_...
npx convex env set RESEND_FROM_EMAIL hello@mademedispa.com
npx convex env set CLERK_WEBHOOK_SECRET whsec_...
npx convex env set CALCOM_WEBHOOK_SECRET whsec_...
```

---

## Vercel Deployment

When deploying to Vercel, set all environment variables in the Vercel project settings. Use Vercel's environment variable groups to separate:

- **Production**: Live API keys, production URLs
- **Preview**: Test API keys, preview URLs
- **Development**: Test API keys, localhost URLs

**Important**: Never commit `.env.local` to version control. Ensure `.gitignore` includes:

```
.env.local
.env.*.local
```

---

## Variable Validation

The application validates required environment variables at startup. If any required variable is missing, the app will fail to start with a descriptive error message. See `lib/env.ts` for the validation schema.

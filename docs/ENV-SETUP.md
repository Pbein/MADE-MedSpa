# MADE Med Spa - Environment Variables

Copy `.env.local.example` to `.env.local` and fill in the values.

## Required Variables

| Variable | Scope | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_CONVEX_URL` | Client | Convex deployment URL (e.g., `https://your-project-abc123.convex.cloud`) |
| `CONVEX_DEPLOYMENT` | Server | Convex deployment identifier (auto-set by `npx convex dev`) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Client | Clerk publishable key (e.g., `pk_test_...`) |
| `CLERK_SECRET_KEY` | Server | Clerk secret key (e.g., `sk_test_...`) |
| `NEXT_PUBLIC_PABAU_BOOKING_URL` | Client | Pabau online booking page URL (used by all "Book Now" buttons) |
| `NEXT_PUBLIC_SITE_URL` | Client | Production site URL (e.g., `https://mademedispa.com`) |

## Setup

```bash
# 1. Start Convex (sets CONVEX_DEPLOYMENT and NEXT_PUBLIC_CONVEX_URL automatically)
npx convex dev

# 2. Get Clerk keys from https://dashboard.clerk.com
# 3. Get Pabau booking URL from Pabau dashboard > Online Booking settings
# 4. Set NEXT_PUBLIC_SITE_URL to your production domain (or http://localhost:3000 for dev)
```

## Vercel Deployment

Set all variables in Vercel project settings. Use environment groups to separate production, preview, and development values.

Never commit `.env.local` to version control.

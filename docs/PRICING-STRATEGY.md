# MADE MedSpa — Pricing & Cost Breakdown

> **Prepared for:** MADE MedSpa (Client)
> **Prepared by:** Development Team
> **Date:** March 2026
> **Goal:** Transparent pricing with honest cost breakdown so the client knows exactly what they're paying for.

---

## Table of Contents

1. [What Was Built](#1-what-was-built)
2. [Hard Costs — What It Actually Costs to Run](#2-hard-costs--what-it-actually-costs-to-run)
3. [Client Offer Options](#3-client-offer-options)
4. [Comparison: What This Would Cost Elsewhere](#4-comparison-what-this-would-cost-elsewhere)
5. [Recommendation](#5-recommendation)

---

## 1. What Was Built

A fully custom med spa website and business management platform — not a template.

### The Full Feature List

| Feature | Details |
|---------|---------|
| **Public Website** (13 pages) | Home, About, Contact, FAQ, Services, Service details, Shop, Product details, Cart, Checkout, Booking, Booking confirmation, Membership |
| **Admin Dashboard** (13 pages) | Manage products, orders, services, bookings, members, contacts, FAQs, site content |
| **E-commerce** | Product catalog, shopping cart, Stripe checkout, order tracking |
| **Membership System** | 4 tiers with Stripe recurring billing, customer portal, lifecycle webhooks |
| **Booking System** | Cal.com integration for 10 services with status management |
| **Authentication** | Clerk-based auth with role-based access (admin/member/customer) |
| **Email** | Resend integration for transactional emails |
| **Custom Design** | Luxury brand design system — custom typography, colors, animations |

### Tech Stack

Next.js 16, React 19, TypeScript, Convex (database), Tailwind CSS 4, Framer Motion, Clerk (auth), Stripe (payments), Resend (email), Cal.com (booking).

### Code Stats

- ~14,000 lines of TypeScript/React
- 26 pages, 15 backend files, 4 API routes
- 218 placeholder images (client supplies final photography)

---

## 2. Hard Costs — What It Actually Costs to Run

These are the real, unavoidable costs. No markup, no fluff.

### Monthly Infrastructure

| Service | Plan | Monthly Cost | Notes |
|---------|------|-------------|-------|
| **Vercel** (Hosting) | Pro (required for commercial use) | **$20/mo** | Hosting, CDN, SSL, edge functions. Hobby plan is free but non-commercial only. |
| **Convex** (Database) | Free Starter | **$0/mo** | 1M function calls/month — more than enough for a single-location med spa |
| **Clerk** (Auth) | Free | **$0/mo** | Up to 10,000 MAU free |
| **Stripe** (Payments) | No monthly fee | **$0/mo** | Transaction fees only (see below) |
| **Resend** (Email) | Free | **$0/mo** | 3,000 emails/month free — plenty for booking confirmations, etc. |
| **Cal.com** (Booking) | Free | **$0/mo** | Free tier for individual use |
| **Domain** (.com) | Annual | **~$1.25/mo** | ~$15/year |

### Total Fixed Monthly Cost: ~$21/month (~$255/year)

That's it. Twenty-one dollars a month to run this entire platform.

### Stripe Transaction Fees (Variable — Comes Out of Customer Payments)

Stripe charges **2.9% + $0.30 per transaction**. This is industry standard — Square, PayPal, everyone charges roughly the same.

| Monthly Revenue | Stripe Takes | You Keep |
|----------------|-------------|----------|
| $1,000 | ~$32 | ~$968 |
| $5,000 | ~$148 | ~$4,852 |
| $10,000 | ~$293 | ~$9,707 |

> **Important:** Stripe fees are not an out-of-pocket cost. They come out of customer payments automatically. You never write a check to Stripe.

### When Would Costs Increase?

| Trigger | What Happens | New Cost |
|---------|-------------|----------|
| Convex exceeds 1M function calls/month | Upgrade to pay-as-you-go or Pro ($25/mo) | Unlikely for months/years |
| Need team email features | Resend Pro | $20/mo |
| Need advanced booking (team calendar) | Cal.com Team | $12/mo |
| Very high traffic (unlikely early on) | Vercel overages | Covered by $20 monthly credit |

> **Bottom line:** You can realistically run this site for **$21/month** for the foreseeable future. If the business grows significantly, costs might go up to $50–$75/month — still far cheaper than any alternative.

---

## 3. Client Offer Options

Three options — pick what works best.

---

### Option A: "Just the Build" — $1,500

> *Lowest price. Site delivered, you take it from here.*

| Included | |
|----------|--|
| Complete website & admin dashboard | ✅ |
| Deployment to Vercel (production) | ✅ |
| All service accounts set up (Stripe, Clerk, Convex, etc.) | ✅ |
| 14 days post-launch bug fixes | ✅ |
| Handoff documentation | ✅ |

**Your ongoing cost:** ~$21/month (infrastructure only)

**Best for:** Client who's comfortable managing things through the admin dashboard or has someone technical available.

---

### Option B: "Build + Support" — $2,500

> *Build plus 3 months of hands-on support while you get comfortable.*

| Included | |
|----------|--|
| Everything in Option A | ✅ |
| 3 months post-launch support (up to 3 hrs/month) | ✅ |
| 1 round of design tweaks after launch | ✅ |
| Admin training walkthrough | ✅ |
| Help swapping placeholder images for real photos | ✅ |

**Your ongoing cost:** ~$21/month (infrastructure only)
**After 3 months:** Self-manage or optional support at $100/month

**Best for:** Client who wants a smooth transition and someone to call if something's off.

---

### Option C: "All-In Monthly" — $500 upfront + $150/month

> *Minimal upfront, we handle everything ongoing.*

| Included | |
|----------|--|
| Complete website & admin dashboard | ✅ |
| Deployment & setup | ✅ |
| We manage all infrastructure (you don't touch Vercel/Convex/etc.) | ✅ |
| Ongoing bug fixes & updates | ✅ |
| Up to 3 hrs/month support & small changes | ✅ |
| Admin training walkthrough | ✅ |

**Your ongoing cost:** $150/month (all-inclusive — infrastructure included)

**6-month total:** $1,400 ($500 + $150×6)
**12-month total:** $2,300 ($500 + $150×12)

**Best for:** Client who wants zero tech headaches and a single monthly bill.

---

### Side-by-Side

| | Option A | Option B | Option C |
|---|---------|---------|---------|
| **Upfront** | $1,500 | $2,500 | $500 |
| **Monthly** | ~$21 (infra) | ~$21 (infra) | $150 (all-in) |
| **Year 1 total** | ~$1,755 | ~$2,755 | ~$2,300 |
| **Year 2 total** | ~$255 | ~$255 | ~$1,800 |
| **Support included** | 14 days | 3 months | Ongoing |
| **Who manages infra** | Client | Client (with help) | Us |
| **Best for** | DIY-comfortable | Balanced | Hands-off |

---

## 4. Comparison: What This Would Cost Elsewhere

### Template/DIY Route

| Platform | Monthly | What's Missing |
|----------|---------|---------------|
| Squarespace | $33–$65/mo | No admin dashboard, no membership system, no custom design, generic templates |
| Wix | $17–$159/mo | No real backend, limited e-commerce, no booking integration |
| WordPress + plugins | $30–$100/mo + $2K–$5K setup | Slow, plugin conflicts, security maintenance burden, no real-time features |

> Even the "cheap" options cost $400–$1,900/year in platform fees alone — and you still don't get a custom admin dashboard, membership system, or booking integration. Our all-in infrastructure cost is **$255/year**.

### Hiring Someone Else

| Who | Typical Cost | Timeline |
|-----|-------------|----------|
| Freelancer (basic site) | $2,000–$5,000 | 4–8 weeks |
| Freelancer (with e-commerce + memberships) | $8,000–$15,000 | 8–16 weeks |
| Small agency | $15,000–$30,000 | 10–16 weeks |

> Our pricing is significantly below what you'd find elsewhere, and you get more functionality.

---

## 5. Recommendation

### We recommend **Option B ($2,500)**.

Here's why:

1. **Fair price** — well below what you'd pay anywhere else for this level of work
2. **3 months of support** — gives you time to get comfortable with the admin dashboard and work out any issues
3. **Low ongoing cost** — after setup, the site runs for ~$21/month
4. **You own everything** — the code, the domain, all service accounts are in your name

### What the Client Should Know

- **You own everything.** Code, domain, all accounts. Nothing is locked to us.
- **No vendor lock-in.** All services (Vercel, Convex, Stripe, Clerk) are in your name.
- **The admin dashboard handles most day-to-day work.** Products, services, orders, bookings, members, FAQs, content — all manageable without touching code.
- **Stripe fees are standard.** 2.9% + $0.30 is what everyone pays. It comes out of customer payments, not your pocket.
- **Infrastructure is cheap.** ~$21/month is real. No hidden fees, no hosting markup.

### Setup Checklist (What We Handle)

- [ ] Register/transfer domain
- [ ] Deploy to Vercel (production)
- [ ] Set up Convex production database
- [ ] Configure Clerk authentication
- [ ] Set up Stripe (production keys, webhooks)
- [ ] Configure Resend (domain verification)
- [ ] Connect Cal.com booking
- [ ] Seed initial data (services, membership tiers, FAQs)
- [ ] SSL certificate (automatic via Vercel)
- [ ] DNS configuration
- [ ] Swap placeholder images for client's photography
- [ ] Final QA & launch

### Service Accounts (All in Client's Name)

| Service | URL | Credentials With |
|---------|-----|-----------------|
| Vercel | vercel.com | Client |
| Convex | convex.dev | Client |
| Clerk | clerk.com | Client |
| Stripe | stripe.com | Client |
| Resend | resend.com | Client |
| Cal.com | cal.com | Client |
| Domain registrar | namecheap.com (suggested) | Client |

> All accounts are created in the client's name. We help set them up, but the client owns and controls everything.

---

*Pricing valid as of March 2026. Infrastructure costs based on current service provider pricing.*

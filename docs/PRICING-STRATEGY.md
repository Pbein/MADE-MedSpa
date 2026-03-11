# MADE MedSpa — Pricing & Cost Breakdown

> **Prepared for:** MADE MedSpa (Client)
> **Prepared by:** Development Team
> **Date:** March 2026
> **Goal:** Transparent pricing with honest cost breakdown so the client knows exactly what they're paying for.

---

## Table of Contents

1. [What's Being Built — Full Scope](#1-whats-being-built--full-scope)
2. [Current Progress](#2-current-progress)
3. [Hard Costs — What It Actually Costs to Run](#3-hard-costs--what-it-actually-costs-to-run)
4. [Revenue Potential for the Client](#4-revenue-potential-for-the-client)
5. [Client Offer Options](#5-client-offer-options)
6. [Optional Add-Ons (Not Required for Launch)](#6-optional-add-ons-not-required-for-launch)
7. [Comparison: What This Would Cost Elsewhere](#7-comparison-what-this-would-cost-elsewhere)
8. [Recommendation](#8-recommendation)

---

## 1. What's Being Built — Full Scope

A fully custom med spa website and business management platform — not a template. 11 epics, 68 user stories.

### Core Platform (Included in All Offers)

| Feature | Details |
|---------|---------|
| **Public Website** (13 pages) | Home, About, Contact, FAQ, Services, Service details, Shop, Product details, Cart, Checkout, Booking, Booking confirmation, Membership |
| **Admin Dashboard** (13 pages) | Manage products, orders, services, bookings, members, contacts, FAQs, site content |
| **E-commerce** | Product catalog, shopping cart, Stripe checkout, order tracking |
| **Membership System** | 4 tiers ($99–$599/mo), Stripe recurring billing, customer portal, lifecycle webhooks |
| **Booking System** | Cal.com integration for 10 services with status management |
| **Authentication** | Clerk-based auth with role-based access (admin/member/customer) |
| **Email** | Resend integration for transactional emails (booking confirmations, order receipts, etc.) |
| **Custom Design** | Luxury brand design system — custom typography, colors, scroll animations |
| **SEO Foundation** | Metadata, structured data, sitemap, robots.txt |
| **Accessibility** | WCAG 2.1 AA compliance, keyboard navigation, screen reader support |

### Tech Stack

Next.js 16, React 19, TypeScript, Convex (database), Tailwind CSS 4, Framer Motion, Clerk (auth), Stripe (payments), Resend (email), Cal.com (booking).

### Code Stats

- ~14,000+ lines of TypeScript/React
- 26 pages, 15+ backend files, 4 API routes
- 218 placeholder images (client supplies final photography)

---

## 2. Current Progress

Being transparent — here's exactly where things stand:

| Phase | Epic | Status | Stories |
|-------|------|--------|---------|
| Foundation | Project infrastructure | **Complete** | 6/6 |
| Core Site | Public pages (Home, About, Contact) | **~90% done** | 7/8 |
| Core Site | Services pages | **~90% done** | 4/5 |
| Core Site | FAQ page | **Complete** | 4/4 |
| Functionality | Booking system (Cal.com) | **~50% done** | 3/6 — needs Cal.com account |
| Functionality | Membership system | **~60% done** | 4/7 — needs Stripe production keys |
| E-Commerce | Shop, cart, checkout, orders | **~40% done** | 2/8 done, 5 in progress |
| Admin | Admin dashboard (all pages) | **UI built** | 0/8 complete, 8 in progress (UI done, some wiring needed) |
| Polish | SEO, accessibility, performance | **Not started** | 0/6 |
| Media | Photo/video content system | **Not started** | 0/5 |
| CRM | Hermes integration (optional) | **Not started** | 0/5 |

**Overall: 30/68 stories complete, 16 in progress, 22 not started**

### What's Needed from the Client to Finish

Several features are blocked waiting on client accounts/decisions:

- **Stripe production keys** — needed to finish membership billing & e-commerce checkout
- **Cal.com account** — needed to wire up the booking calendar
- **Client photography** — 218 placeholder images need to be swapped
- **Domain name** — needed for deployment, email sending, and SSL
- **Decision on Hermes CRM** — optional, can launch without it

---

## 3. Hard Costs — What It Actually Costs to Run

These are the real, unavoidable costs. No markup.

### Monthly Infrastructure (Required)

| Service | Plan | Monthly Cost | Notes |
|---------|------|-------------|-------|
| **Vercel** (Hosting) | Pro | **$20/mo** | Required for commercial use. Hobby plan is free but non-commercial only. Includes CDN, SSL, edge functions, 1TB bandwidth. |
| **Convex** (Database) | Free Starter | **$0/mo** | 1M function calls/month, plenty for a single-location med spa. Could run on free tier for months or years. |
| **Clerk** (Auth) | Free | **$0/mo** | Up to 10,000 monthly active users free. A med spa won't hit this. |
| **Stripe** (Payments) | No monthly fee | **$0/mo** | Transaction fees only — comes out of customer payments (see below). |
| **Resend** (Email) | Free | **$0/mo** | 3,000 emails/month free. Booking confirmations, order receipts, etc. More than enough. |
| **Cal.com** (Booking) | Free | **$0/mo** | Free tier for individual use. If multiple practitioners need calendars, Team plan is $12/mo. |
| **Domain** (.com) | Annual | **~$1.25/mo** | ~$15/year at Namecheap, Cloudflare, etc. |

### Total Fixed Monthly Cost: ~$21/month (~$255/year)

That's it. Twenty-one dollars a month to run the entire platform.

### Stripe Transaction Fees (Variable — Deducted from Customer Payments)

Stripe charges **2.9% + $0.30 per transaction**. This is the industry standard — Square, PayPal, everyone charges roughly the same. This is NOT an out-of-pocket cost; it comes out of the customer's payment before the money hits your account.

| Transaction Type | Fee | Example |
|-----------------|-----|---------|
| Membership payment ($99/mo) | 2.9% + $0.30 | $3.17 fee → you receive $95.83 |
| Membership payment ($199/mo) | 2.9% + $0.30 | $6.07 fee → you receive $192.93 |
| Product purchase ($50) | 2.9% + $0.30 | $1.75 fee → you receive $48.25 |

### When Would Costs Go Up?

| Trigger | What Changes | New Cost |
|---------|-------------|----------|
| Convex exceeds 1M function calls/month | Upgrade to Pro | +$25/mo (unlikely for 1-2 years) |
| Multiple practitioners need booking calendars | Cal.com Team | +$12/mo |
| Email volume exceeds 3,000/month | Resend Pro | +$20/mo |
| High traffic spikes | Vercel overages | Covered by included $20 monthly credit |
| Hermes CRM (if added later) | Depends on Hermes pricing | TBD |

> **Bottom line:** Realistically **$21/month** for the foreseeable future. If the business grows significantly, maybe $50–$75/month. Still far cheaper than any alternative.

---

## 4. Revenue Potential for the Client

This site isn't just a cost — it's a revenue engine. Here's what the built-in systems can generate:

### Membership Revenue (Recurring)

| Tier | Monthly Price | If 10 Members | If 25 Members |
|------|-------------|---------------|---------------|
| Essential | $99/mo | $990/mo | $2,475/mo |
| Premium | $199/mo | $1,990/mo | $4,975/mo |
| Elite | $349/mo | $3,490/mo | $8,725/mo |
| VIP | $599/mo | $5,990/mo | $14,975/mo |

Even a modest membership base of **20 members across tiers** could mean **$3,000–$6,000/month in recurring revenue** — from a site that costs $21/month to run.

### E-commerce Revenue (One-Time Sales)

Skincare product sales through the built-in shop. No Shopify fees, no platform cuts — just Stripe's standard 2.9% + $0.30.

### Booking Revenue

Every online booking that converts to a service appointment. The booking system reduces phone tag and no-shows.

> The site pays for itself many times over with even a small number of members or product sales.

---

## 5. Client Offer Options

Three options. All include the complete platform once finished.

---

### Option A: "Just the Build" — $1,500

> *Lowest price. Site delivered, you take it from here.*

| Included | |
|----------|--|
| Complete website & admin dashboard (all 68 stories) | ✅ |
| Deployment to Vercel (production) | ✅ |
| All service accounts set up (Stripe, Clerk, Convex, Cal.com, Resend) | ✅ |
| 14 days post-launch bug fixes | ✅ |
| Handoff documentation | ✅ |

**Your ongoing cost:** ~$21/month (infrastructure only)

**Best for:** Client who's comfortable managing things through the admin dashboard or has someone technical around.

---

### Option B: "Build + Support" — $2,500

> *Build plus 3 months of hands-on support while you get comfortable.*

| Included | |
|----------|--|
| Everything in Option A | ✅ |
| 3 months post-launch support (up to 3 hrs/month) | ✅ |
| 1 round of design tweaks after launch | ✅ |
| Admin training walkthrough (1 hour) | ✅ |
| Help swapping placeholder images for real photos | ✅ |
| SEO optimization & Google Search Console setup | ✅ |

**Your ongoing cost:** ~$21/month (infrastructure only)
**After 3 months:** Self-manage, or optional support at $100/month

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

## 6. Optional Add-Ons (Not Required for Launch)

These are planned features from the project roadmap that can be added later. They are NOT needed to launch — the core site works without them.

### Hermes CRM Integration — $500 (or included in Option B/C support hours)

| What It Does | Details |
|-------------|---------|
| Syncs all customer touchpoints to a CRM | Contact forms, bookings, purchases, memberships |
| Customer journey tracking | See every interaction a client has had |
| Automated tagging | Members tagged by tier, customers by purchase history |

**Additional cost:** Depends on Hermes pricing (may have a free tier). This is a "nice to have" — the admin dashboard already shows contacts, bookings, and orders without it.

### Before/After Photo Gallery — $300

| What It Does | Details |
|-------------|---------|
| Interactive comparison slider | Side-by-side before/after treatment photos |
| Filterable by service type | Show results for specific treatments |
| Lightbox full-screen viewing | Professional presentation |

**Additional cost:** None (uses Convex file storage, already included). Client needs to provide the actual before/after photos.

### Media Management System — $300

| What It Does | Details |
|-------------|---------|
| Admin-managed photo/video uploads | Upload and organize media from the admin dashboard |
| Image optimization | Automatic compression and WebP conversion |
| Facility tour gallery | Showcase treatment rooms, lobby, amenities |
| Video sections | Embed videos on home, about, and service pages |

**Additional cost:** Likely none if using Convex file storage. Cloudinary integration available if advanced image transforms needed (free tier: 25K transformations/month).

### Advanced SEO Package — Included in all options

Already planned as part of the core build (Epic 9):
- Meta tags & Open Graph on every page
- Schema.org structured data (LocalBusiness, Service, Product, FAQ)
- Dynamic XML sitemap
- robots.txt
- Performance optimization (Lighthouse 90+ target)

---

## 7. Comparison: What This Would Cost Elsewhere

### Template/DIY Route

| Platform | Monthly | What's Missing |
|----------|---------|---------------|
| Squarespace | $33–$65/mo | No admin dashboard, no membership system, no custom design, generic templates |
| Wix | $17–$159/mo | No real backend, limited e-commerce, no booking integration |
| WordPress + plugins | $30–$100/mo + $2K–$5K setup | Slow, plugin conflicts, security maintenance, no real-time features |

> Even the "cheap" options cost $400–$1,900/year in platform fees — and you don't get a custom admin dashboard, membership system, or booking integration. Our infrastructure cost is **$255/year**.

### Hiring Someone Else

| Who | Typical Cost | Timeline |
|-----|-------------|----------|
| Freelancer (basic site) | $2,000–$5,000 | 4–8 weeks |
| Freelancer (with e-commerce + memberships) | $8,000–$15,000 | 8–16 weeks |
| Small agency | $15,000–$30,000 | 10–16 weeks |

### The Real Comparison

The closest apples-to-apples for what this platform does (custom site + e-commerce + memberships + booking + admin dashboard) would run **$10,000–$25,000** from a freelancer or small agency. Our most expensive option is $2,500.

---

## 8. Recommendation

### We recommend **Option B ($2,500)**.

Here's why:

1. **Fair price** — a fraction of what this would cost elsewhere
2. **3 months of support** — time to get comfortable, swap in real photos, iron out any kinks
3. **SEO setup included** — Google Search Console, structured data, sitemap — so the site actually gets found
4. **Low ongoing cost** — ~$21/month after support period
5. **You own everything** — code, domain, all accounts in your name

### What the Client Needs to Provide

- [ ] Domain name (we help register)
- [ ] Professional photography (we provide a shot list)
- [ ] Stripe account (we help set up)
- [ ] Cal.com account (we help set up)
- [ ] Service descriptions & pricing confirmation
- [ ] Product inventory details (if launching shop immediately)
- [ ] Membership tier pricing confirmation ($99/$199/$349/$599 or adjusted)

### Setup Checklist (What We Handle)

- [ ] Register/transfer domain
- [ ] Deploy to Vercel (production)
- [ ] Set up Convex production database
- [ ] Configure Clerk authentication
- [ ] Set up Stripe (production keys, products, webhooks)
- [ ] Configure Resend (domain verification, email templates)
- [ ] Connect Cal.com booking calendar
- [ ] Seed initial data (services, membership tiers, FAQs)
- [ ] SSL certificate (automatic via Vercel)
- [ ] DNS configuration
- [ ] Swap placeholder images for client's photography
- [ ] SEO setup (meta tags, structured data, sitemap, Search Console)
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

> All accounts are created in the client's name. We help set them up, but the client owns and controls everything. No lock-in, no hostage situations.

### What the Client Should Know

1. **You own everything.** Code, domain, all accounts. Nothing is locked to us.
2. **No vendor lock-in.** All services are in your name and you can manage them directly.
3. **The admin dashboard handles most day-to-day work.** Products, services, orders, bookings, members, FAQs, content — all manageable without touching code.
4. **Stripe fees are standard.** 2.9% + $0.30 is what everyone pays. It comes out of customer payments, not your pocket.
5. **Infrastructure is cheap.** ~$21/month is real. No hidden fees, no hosting markup.
6. **The site can generate revenue immediately.** Memberships ($99–$599/mo each), product sales, and bookings — the platform is designed to pay for itself quickly.

---

*Pricing valid as of March 2026. Infrastructure costs based on current service provider pricing.*

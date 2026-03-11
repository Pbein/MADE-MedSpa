# MADE MedSpa — Pricing Strategy & Client Offer Breakdown

> **Prepared for:** MADE MedSpa (Client)
> **Prepared by:** Development Team
> **Date:** March 2026
> **Goal:** Give the client the best possible deal with transparent pricing and multiple offer tiers so they feel in control of their investment.

---

## Table of Contents

1. [What Was Built — Full Scope](#1-what-was-built--full-scope)
2. [Market Rate Comparison](#2-market-rate-comparison)
3. [Fixed Costs (Infrastructure & Services)](#3-fixed-costs-infrastructure--services)
4. [Variable Costs](#4-variable-costs)
5. [Design & Build Value Breakdown](#5-design--build-value-breakdown)
6. [Ongoing Maintenance & Support](#6-ongoing-maintenance--support)
7. [Total Cost of Ownership Summary](#7-total-cost-of-ownership-summary)
8. [Client Offer Options](#8-client-offer-options)
9. [What Competitors Would Charge](#9-what-competitors-would-charge)
10. [Recommendation](#10-recommendation)

---

## 1. What Was Built — Full Scope

This is not a template site. This is a **fully custom, production-grade web application** built with enterprise-level technology. Here is everything included:

### Frontend (26 Pages)

| Section | Pages | Details |
|---------|-------|---------|
| **Public Site** | 13 pages | Home, About, Contact, FAQ, Services listing, Service detail (dynamic), Shop catalog, Product detail (dynamic), Cart, Checkout success, Booking, Booking confirmation, Membership overview |
| **Admin Dashboard** | 13 pages | Dashboard overview, Products CRUD, Orders management, Services management, Bookings management, Members management, Contact submissions, FAQ management, Content CMS |

### Core Features Built

| Feature | What It Does | Complexity |
|---------|-------------|------------|
| **E-commerce System** | Full product catalog, shopping cart (guest + authenticated), Stripe Checkout, order tracking, inventory management | High |
| **Membership/Subscription System** | 4 membership tiers (Glow, Radiance, Luxe, Elite), Stripe recurring billing, billing portal, subscription lifecycle webhooks, terms acceptance with version control | Very High |
| **Service Booking System** | Cal.com integration, 10 services with pricing/duration, booking status management, webhook sync, reminders | High |
| **Admin Dashboard** | Full CRUD for products, services, orders, bookings, members, contacts, FAQs, site content; search/filter/status management | Very High |
| **Authentication & Authorization** | Clerk-based auth, role-based access (admin/member/customer), protected routes, Stripe customer syncing | Medium |
| **CMS-Lite** | Dynamic site content editing, terms & conditions versioning, FAQ management | Medium |
| **Email System** | Resend integration, React Email templates, transactional email support | Medium |
| **Lead Capture** | Contact form with validation, newsletter subscription, admin review | Low-Medium |

### Tech Stack

| Layer | Technology | Why It Matters |
|-------|-----------|----------------|
| Framework | Next.js 16 + React 19 | Fastest, most modern web framework — SEO-optimized, server-rendered |
| Language | TypeScript (strict) | Catches bugs before they ship, enterprise-grade code quality |
| Database/Backend | Convex | Real-time reactive database, zero server management, auto-scaling |
| Styling | Tailwind CSS 4 | Utility-first CSS, tiny bundle size, responsive out of the box |
| Animations | Framer Motion + Lenis | Luxury-feel scroll animations, micro-interactions, smooth scrolling |
| Auth | Clerk | Enterprise auth with social login, session management, user profiles |
| Payments | Stripe | Industry standard, PCI compliant, handles subscriptions + one-time |
| Email | Resend + React Email | Modern developer email with beautiful templated transactional emails |
| Booking | Cal.com | Scheduling integration with webhook sync |
| Hosting | Vercel | Global CDN, edge functions, instant deploys, SSL included |

### Design & Brand Implementation

- **Custom luxury design system** (27KB design document) — not a template
- Warm ivory, burgundy, cream, chocolate color palette
- 3 custom font pairings: Playfair Display, Cormorant Garamond, Jost
- Fluid typography with `clamp()` scaling
- 11-level spacing system
- Scroll-triggered reveal animations
- Asymmetric editorial grid layouts
- Full responsive design (mobile-first)
- 218 placeholder images (client will supply final photography)

### Database Architecture

15 database collections with full indexing:
`users`, `membershipTiers`, `members`, `services`, `bookings`, `cartItems`, `orders`, `products`, `contactSubmissions`, `faqs`, `siteContent`, `newsletterSubscribers`, `termsVersions`

### Code Metrics

- ~14,000 lines of TypeScript/React
- 51 TypeScript/TSX files
- 15 Convex backend files (queries, mutations, actions, schema)
- 4 API routes (checkout, membership portal, Stripe webhooks, Cal.com webhooks)
- Fully linted (ESLint), strictly typed, production-ready

---

## 2. Market Rate Comparison

### What agencies and freelancers charge for comparable work

| Provider Type | Comparable Med Spa Site | This Project Equivalent |
|--------------|------------------------|------------------------|
| **Budget freelancer** (template customization) | $2,000–$5,000 | N/A — this is not template work |
| **Mid-tier freelancer** (custom WordPress) | $5,000–$12,000 | Would not include e-commerce, subscriptions, or admin |
| **Small agency** (custom site + basic e-commerce) | $15,000–$30,000 | Missing admin dashboard, membership system, booking integration |
| **Mid-tier agency** (full custom + integrations) | $30,000–$60,000 | Closest comparison — still often missing real-time backend |
| **Top agency** (enterprise custom app) | $50,000–$100,000+ | Full feature parity |

### What this project would cost at market rates

| Work Category | Estimated Hours | Rate ($100/hr avg) | Total |
|--------------|----------------|-------------------|-------|
| Discovery & planning | 15–20 hrs | $100 | $1,500–$2,000 |
| Design system & UI/UX | 40–60 hrs | $100 | $4,000–$6,000 |
| Frontend development (26 pages) | 80–120 hrs | $100 | $8,000–$12,000 |
| Backend/database (Convex) | 30–40 hrs | $100 | $3,000–$4,000 |
| E-commerce system | 25–35 hrs | $100 | $2,500–$3,500 |
| Membership/subscription system | 20–30 hrs | $100 | $2,000–$3,000 |
| Admin dashboard (13 pages) | 40–60 hrs | $100 | $4,000–$6,000 |
| Auth & security | 10–15 hrs | $100 | $1,000–$1,500 |
| Booking integration | 10–15 hrs | $100 | $1,000–$1,500 |
| Email integration | 8–12 hrs | $100 | $800–$1,200 |
| Animations & polish | 15–20 hrs | $100 | $1,500–$2,000 |
| Testing & QA | 15–20 hrs | $100 | $1,500–$2,000 |
| Deployment & DevOps | 5–10 hrs | $100 | $500–$1,000 |
| **TOTAL** | **313–457 hrs** | | **$31,300–$45,700** |

> **Fair market value for this project: $30,000–$45,000**

---

## 3. Fixed Costs (Infrastructure & Services)

These are the monthly/annual costs required to keep the site running regardless of traffic. Someone has to pay them.

### Monthly Infrastructure Costs

| Service | Plan Needed | Monthly Cost | Annual Cost | What It Does |
|---------|------------|-------------|-------------|-------------|
| **Vercel** (Hosting) | Pro | $20/mo | $240/yr | Hosts the website, CDN, SSL, edge functions |
| **Convex** (Database/Backend) | Starter (Free) or Pro | $0–$25/mo | $0–$300/yr | Real-time database, backend functions, auto-scaling |
| **Clerk** (Authentication) | Free | $0/mo | $0/yr | User auth, up to 50K users free |
| **Stripe** (Payments) | No monthly fee | $0/mo | $0/yr | Per-transaction fees only (see Variable Costs) |
| **Resend** (Email) | Free | $0/mo | $0/yr | Up to 3,000 emails/month free |
| **Cal.com** (Booking) | Free/Team | $0–$12/mo | $0–$144/yr | Booking calendar for services |
| **Domain** (.com) | Registration | ~$1.25/mo | $15/yr | mademedicalspa.com (or similar) |

#### Fixed Cost Scenarios

| Scenario | Monthly | Annual |
|----------|---------|--------|
| **Minimum (free tiers)** | ~$21 | ~$255 |
| **Recommended (Vercel Pro + domain)** | ~$21 | ~$255 |
| **Growth (Vercel Pro + Convex Pro)** | ~$46 | ~$555 |
| **Scale (all paid tiers)** | ~$58 | ~$699 |

> **Key insight:** The free tiers are very generous. A med spa with moderate traffic can run for as little as **~$21/month** in infrastructure costs. This is dramatically cheaper than the $200–$500/month many agencies charge for hosting alone.

---

## 4. Variable Costs

These costs scale with usage — more customers, more transactions, more cost.

### Stripe Transaction Fees

| Transaction Type | Fee | Example |
|-----------------|-----|---------|
| Online card payment | 2.9% + $0.30 | $100 product → $3.20 fee |
| Subscription payment | 2.9% + $0.30 | $99/mo membership → $3.17 fee |
| Refund processing | Original fee NOT returned | Refunding $100 still costs $3.20 |
| Chargebacks | $15 per dispute | Rare but possible |

#### Estimated Monthly Stripe Fees by Revenue

| Monthly Revenue | Stripe Fees | Net After Fees |
|----------------|-------------|---------------|
| $1,000 | ~$32 | ~$968 |
| $5,000 | ~$148 | ~$4,852 |
| $10,000 | ~$293 | ~$9,707 |
| $25,000 | ~$728 | ~$24,272 |

### Email Overage (Resend)

| Volume | Cost |
|--------|------|
| Up to 3,000 emails/mo | Free |
| Up to 50,000 emails/mo | $20/mo (Pro plan) |
| Up to 100,000 emails/mo | $90/mo (Scale plan) |

> A med spa will likely stay well within the **free tier** for email (order confirmations, booking confirmations, membership emails).

### Convex Usage Overage

| Metric | Starter (Free) | Pro ($25/mo) |
|--------|----------------|--------------|
| Function calls | Generous free tier | 25M included |
| Database storage | Included | 50GB included |
| Bandwidth | Included | Included |

> For a single-location med spa, the **free Convex tier** should be sufficient for months or even years.

### Vercel Usage Overage

| Metric | Pro Included | Overage Rate |
|--------|-------------|-------------|
| Bandwidth | 1 TB/mo | $0.15/GB |
| Serverless functions | 1M invocations | $0.60/1M |
| Edge requests | 10M/mo | Included |
| Image optimization | 5,000/mo | $5/1,000 |

> A med spa website will likely never exceed Pro limits.

---

## 5. Design & Build Value Breakdown

### What the client is getting (itemized)

| Deliverable | Market Value | Description |
|------------|-------------|-------------|
| **Custom Design System** | $4,000–$6,000 | Luxury brand identity, typography, colors, spacing, animation specs |
| **Responsive Public Website** (13 pages) | $8,000–$12,000 | Home, About, Contact, FAQ, Services, Shop, Booking, Membership |
| **E-commerce Store** | $4,000–$6,000 | Product catalog, cart, Stripe checkout, order tracking |
| **Membership Subscription System** | $3,000–$5,000 | 4 tiers, recurring billing, portal, webhooks, terms |
| **Service Booking Integration** | $2,000–$3,000 | Cal.com integration, 10 services, status management |
| **Admin Dashboard** (13 pages) | $5,000–$8,000 | Full management for products, orders, members, bookings, content |
| **Authentication & Security** | $1,500–$2,500 | Clerk auth, role-based access, protected routes |
| **Email Integration** | $1,000–$1,500 | Transactional emails, templates, newsletter |
| **SEO Foundation** | $500–$1,000 | Meta tags, server rendering, structured metadata |
| **Animations & Polish** | $1,500–$2,500 | Framer Motion reveals, smooth scrolling, micro-interactions |
| **Deployment & DevOps Setup** | $500–$1,000 | Vercel deployment, environment config, webhook routing |
| **Documentation** | $500–$1,000 | Architecture docs, integration guide, env setup guide |
| **TOTAL MARKET VALUE** | **$31,500–$49,500** | |

---

## 6. Ongoing Maintenance & Support

### What maintenance means for this site

| Task | Frequency | Estimated Time | Market Rate |
|------|-----------|---------------|-------------|
| **Security updates** (dependencies) | Monthly | 1–2 hrs | $100–$200/mo |
| **Bug fixes** | As needed | 1–3 hrs/mo avg | $100–$300/mo |
| **Content updates** (admin can self-serve most) | As needed | 0–1 hr/mo | $0–$100/mo |
| **Feature enhancements** | Quarterly | 5–15 hrs/quarter | $500–$1,500/quarter |
| **Monitoring & uptime** | Continuous | Automated | Included in hosting |
| **SSL & domain renewal** | Annual | 15 min | $15/yr (domain only, SSL is free) |
| **Database backups** | Automatic | None needed | Included in Convex |

#### Market Rates for Maintenance Retainers

| Provider | Monthly Retainer | What's Included |
|----------|-----------------|-----------------|
| Budget freelancer | $200–$500/mo | Basic updates, maybe 2–3 hrs |
| Mid-tier freelancer | $500–$1,000/mo | Updates, monitoring, 5–8 hrs |
| Agency | $1,000–$3,000/mo | Full support, priority response |

---

## 7. Total Cost of Ownership Summary

### Year 1

| Cost Category | Low Estimate | High Estimate |
|--------------|-------------|---------------|
| Design & build | See offers below | See offers below |
| Infrastructure (monthly × 12) | $255 | $699 |
| Domain | $15 | $15 |
| Maintenance (optional retainer) | $0 | $6,000 |
| Stripe fees (varies with revenue) | $400 | $3,500 |
| **Year 1 Total (excluding build)** | **$670** | **$10,214** |

### Years 2+

| Cost Category | Low Estimate | High Estimate |
|--------------|-------------|---------------|
| Infrastructure | $255/yr | $699/yr |
| Domain renewal | $15/yr | $20/yr |
| Maintenance retainer | $0/yr | $6,000/yr |
| Stripe fees | $400/yr | $8,750/yr |
| **Annual Total** | **$670/yr** | **$15,469/yr** |

> **Important:** Stripe fees are NOT a cost to the client — they come out of customer payments. The actual out-of-pocket for keeping the site running is as low as **~$21/month ($255/year)**.

---

## 8. Client Offer Options

We want to give you choices. Here are three offers — all significantly below market rate because we're building this for a friend.

---

### Option A: "The Friends & Family Deal" (Best Value)

> *One-time build cost, you handle ongoing infrastructure.*

| Item | Price |
|------|-------|
| **Full design & build** (everything listed above) | **$5,000** |
| Infrastructure setup & deployment | Included |
| 30 days post-launch support | Included |
| Admin training session (1 hour) | Included |
| Documentation & handoff | Included |

**What the client pays ongoing:**
- ~$21/mo infrastructure (Vercel Pro + domain)
- Stripe transaction fees (deducted from customer payments)

**Savings vs. market rate:** $26,000–$44,000 (84–89% discount)

**Best for:** Client who is tech-comfortable and can handle minor updates through the admin dashboard themselves.

---

### Option B: "The Full Package" (Most Popular)

> *Reduced build cost + 6 months of maintenance included.*

| Item | Price |
|------|-------|
| **Full design & build** | **$7,500** |
| Infrastructure setup & deployment | Included |
| **6 months maintenance & support** (up to 5 hrs/mo) | Included |
| Admin training session (1 hour) | Included |
| 2 rounds of design revisions post-launch | Included |
| Priority bug fixes | Included |
| Documentation & handoff | Included |

**What the client pays ongoing:**
- ~$21/mo infrastructure
- After 6 months: optional maintenance retainer ($250–$500/mo) or self-manage
- Stripe transaction fees (deducted from customer payments)

**Savings vs. market rate:** $27,000–$48,000+ (78–86% discount, including maintenance value)

**Best for:** Client who wants peace of mind for the first 6 months and time to learn the system.

---

### Option C: "The Partnership" (Maximum Support)

> *Low upfront cost with ongoing monthly partnership.*

| Item | Price |
|------|-------|
| **Full design & build** | **$3,000** |
| Infrastructure setup & deployment | Included |
| **Ongoing monthly retainer** | **$300/month** |
| — Includes: hosting management, updates, bug fixes, up to 5 hrs/mo support | |
| — Includes: infrastructure costs (we pay Vercel, Convex, etc.) | |
| Admin training session (1 hour) | Included |
| Quarterly feature review & recommendations | Included |
| Priority support | Included |

**What the client pays ongoing:**
- $300/mo (all-inclusive — we handle everything)
- Stripe transaction fees (deducted from customer payments)

**12-month total: $6,600** ($3,000 + $300×12)
**24-month total: $10,200** ($3,000 + $300×24)

**Savings vs. market rate:** $25,000–$45,000+ in year 1 (80–87% discount)

**Best for:** Client who wants a turnkey solution with no tech headaches.

---

### Side-by-Side Comparison

| | Option A | Option B | Option C |
|---|---------|---------|---------|
| **Upfront cost** | $5,000 | $7,500 | $3,000 |
| **Monthly cost** | ~$21 (infra only) | ~$21 (infra only) | $300 (all-inclusive) |
| **Year 1 total** | ~$5,255 | ~$7,755 | ~$6,600 |
| **Year 2 total** | ~$255 | ~$255+ maintenance | ~$3,600 |
| **Maintenance included** | 30 days | 6 months | Ongoing |
| **Who manages infra** | Client | Client (with support) | Us |
| **Design revisions** | Not included | 2 rounds | Included |
| **Best for** | Self-sufficient client | Balanced approach | Hands-off client |
| **Market value** | $31,500–$49,500 | $35,000–$55,000+ | $31,500–$49,500+ |

---

## 9. What Competitors Would Charge

To put our pricing in perspective:

### Template/DIY Solutions

| Platform | Monthly Cost | What You Get | What You DON'T Get |
|----------|-------------|-------------|-------------------|
| Squarespace | $33–$65/mo | Template site, basic e-commerce | Custom design, admin dashboard, membership system, booking integration |
| Wix | $17–$159/mo | Drag-and-drop builder | Real-time backend, custom code, scalability |
| WordPress + plugins | $30–$100/mo + setup | Blog + WooCommerce | Modern performance, real-time updates, TypeScript safety |

> **Problem with templates:** They look generic, are slow, lack custom functionality, and often cost MORE long-term when you factor in plugin licenses ($50–$200/year each), premium themes ($50–$100), and agency maintenance fees.

### Agency Quotes for Comparable Work

| Agency Type | Quote Range | Timeline |
|-------------|-----------|----------|
| Budget agency | $15,000–$25,000 | 8–12 weeks |
| Mid-tier agency | $30,000–$50,000 | 10–16 weeks |
| Premium agency | $50,000–$100,000+ | 12–20 weeks |

### Ongoing Costs at Agencies

| Service | Typical Agency Rate |
|---------|-------------------|
| Monthly hosting | $100–$500/mo (markup on $20 Vercel) |
| Monthly maintenance | $500–$3,000/mo |
| Content updates | $100–$200/hr |
| Feature additions | $150–$250/hr |

> **Our pricing is 80–90% below market rate** because we're doing this for a friend. The technology is the same (or better) than what agencies deliver.

---

## 10. Recommendation

### Our Honest Recommendation: **Option B ("The Full Package")**

Here's why:

1. **Fair upfront investment** — $7,500 is serious enough to value but absurdly below the $30,000–$50,000 market rate
2. **6 months of support** — Gives the client time to learn the admin dashboard, work out any kinks, and get comfortable
3. **Low ongoing cost** — After 6 months, the site essentially runs itself for ~$21/month
4. **Room to grow** — Can transition to a maintenance retainer or self-manage after the support period

### Setup Checklist (What We Handle)

- [ ] Register/transfer domain
- [ ] Deploy to Vercel (production)
- [ ] Set up Convex production database
- [ ] Configure Clerk authentication (production keys)
- [ ] Set up Stripe (production keys, webhook endpoints)
- [ ] Configure Resend (production email, domain verification)
- [ ] Connect Cal.com booking (production calendar)
- [ ] Seed initial data (services, membership tiers, FAQs)
- [ ] SSL certificate (automatic via Vercel)
- [ ] DNS configuration
- [ ] Client admin training session
- [ ] Swap placeholder images for client's photography
- [ ] Final QA & launch

### What the Client Should Know

1. **They own everything** — The code, the domain, the accounts. Nothing is locked to us.
2. **No vendor lock-in** — All services (Vercel, Convex, Stripe, Clerk) are in their name and they can manage them directly.
3. **The admin dashboard is powerful** — They can manage products, services, orders, bookings, members, FAQs, and content without touching code.
4. **Stripe fees are standard** — 2.9% + $0.30 is what everyone pays (Square, PayPal, everyone). This comes out of customer payments, not out of pocket.
5. **The site is fast and SEO-ready** — Next.js server rendering means Google will index it well, and pages load in under a second.

---

## Appendix: Service & Infrastructure Account Summary

| Service | URL | Who Creates Account | Credentials With |
|---------|-----|--------------------|-|
| Vercel | vercel.com | Client (we help) | Client |
| Convex | convex.dev | Client (we help) | Client |
| Clerk | clerk.com | Client (we help) | Client |
| Stripe | stripe.com | Client (we help) | Client |
| Resend | resend.com | Client (we help) | Client |
| Cal.com | cal.com | Client | Client |
| Domain registrar | namecheap.com (suggested) | Client (we help) | Client |

> **All accounts are in the client's name.** We help set them up but the client owns and controls everything. This is the ethical way to do it — no hostage situations, no dependency.

---

*This document is a living reference. Pricing is valid as of March 2026. Infrastructure costs may change as services update their pricing.*

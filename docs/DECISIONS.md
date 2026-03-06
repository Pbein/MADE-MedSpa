# MADE Med Spa - Architecture Decision Records

## Overview

This document records significant architectural decisions made during the MADE Med Spa project, including context, options evaluated, and rationale for the chosen approach.

---

## ADR-001: E-Commerce Architecture — Convex + Stripe vs. Third-Party Platforms

### Date
2026-03-04

### Status
**Accepted**

### Context

MADE Med Spa needs an e-commerce capability to sell skincare products alongside their service bookings and memberships. The e-commerce system must handle product catalog management, shopping carts, checkout with payment processing, order management, and inventory tracking.

The project already uses Convex as the primary database and Stripe for membership subscription billing. We needed to decide whether to build e-commerce natively within the existing stack or integrate a third-party e-commerce platform.

### Options Evaluated

#### Option A: Convex + Stripe Checkout (Custom Build)
- Store products, carts, and orders in Convex tables
- Use Stripe Checkout Sessions for payment processing
- Build product management UI in existing admin dashboard
- Full control over data model and user experience

#### Option B: Shopify (Storefront API + Headless)
- Use Shopify as a headless commerce backend
- Shopify Storefront API for product data and checkout
- Separate data silo from Convex
- Shopify handles inventory, payments, and order management

#### Option C: Snipcart
- Drop-in shopping cart overlay
- Products defined via HTML attributes or API
- Snipcart handles cart, checkout, and payment
- Separate dashboard for order management

#### Option D: Stripe Products + Stripe Payment Links
- Store products as Stripe Products with Prices
- Use Stripe Payment Links or Checkout for purchasing
- Minimal custom code
- Limited customization of shopping experience

### Decision

**Option A: Convex + Stripe Checkout** was chosen.

### Rationale

1. **Unified Data Layer**: All business data (services, members, bookings, products, orders) lives in Convex. This enables powerful cross-entity queries, such as showing a member's complete history (bookings + purchases) on a single dashboard, or calculating lifetime customer value across all revenue streams.

2. **Member Discount Integration**: Membership tiers include product discounts (10-25% off). With products in Convex, we can calculate member-specific pricing in real-time using the same authentication and membership data. Third-party platforms would require complex sync of membership status.

3. **Consistent Admin Experience**: Admins manage everything from one dashboard. Adding Shopify or Snipcart means admins must context-switch between multiple systems for daily operations.

4. **Real-Time Capabilities**: Convex provides real-time subscriptions out of the box. Inventory counts, cart updates, and order status changes reflect instantly without polling. This is particularly valuable for low-stock alerts and admin order monitoring.

5. **Cost Efficiency**: No additional monthly platform fees. Shopify charges $39-399/month plus transaction fees. Snipcart charges 2% on top of payment processor fees. Our approach only incurs Stripe's standard processing fees (2.9% + 30 cents).

6. **Stripe Already Integrated**: Stripe is already configured for membership subscriptions with webhook handlers in place. Adding Checkout Sessions for one-time purchases is incremental work, not a new integration.

7. **Full UX Control**: We have complete control over the shopping experience, cart behavior, and checkout flow. No iframe limitations, no third-party styling constraints, no redirect to external checkout pages (Shopify) unless we choose to use Stripe's hosted checkout.

### Trade-offs Acknowledged

- **More Code to Write**: We must build cart management, inventory tracking, and order management ourselves. Shopify provides these out of the box.
- **No Built-in Shipping Calculator**: We'll need to handle shipping cost calculation manually or via a shipping API if complex shipping rules are needed. For a small skincare catalog, flat-rate or free shipping is likely sufficient.
- **No Built-in Tax Calculation**: Tax calculation must be handled manually or via Stripe Tax. Shopify handles multi-jurisdiction tax automatically.
- **Maintenance Burden**: We own the entire e-commerce stack. Bugs and edge cases (inventory race conditions, payment failure handling) are our responsibility.

### Mitigations

- **Stripe Checkout Session** handles PCI compliance, payment form, and card processing — we don't touch sensitive card data
- **Convex transactions** prevent inventory race conditions (atomic stock decrements)
- **Stripe webhooks** provide reliable payment confirmation (we don't rely on client-side redirect alone)
- The product catalog is expected to be small (20-50 SKUs) — this is skincare products for an individual med spa, not a marketplace
- Flat-rate or free shipping simplifies the shipping calculation requirement

### Consequences

- E-commerce tables (`products`, `cart`, `orders`) added to Convex schema
- Stripe Checkout Session creation added to API routes
- Stripe webhook handler extended to process `checkout.session.completed` events
- Admin dashboard extended with product and order management pages
- Cart state management implemented (Convex for auth users, session storage for guests)

---

## ADR-002: Convex as Backend-as-a-Service

### Date
2026-03-04

### Status
**Accepted**

### Context

Needed a backend solution that provides database, serverless functions, and real-time capabilities with minimal infrastructure management.

### Decision

Convex was chosen over alternatives (Supabase, Firebase, custom API).

### Rationale

- Real-time subscriptions built in (no polling or WebSocket setup)
- Type-safe schema and queries with TypeScript
- Serverless functions (queries, mutations, actions) co-located with schema
- File storage included
- Scheduled functions for delayed tasks (reminders, follow-ups)
- Excellent Next.js integration
- No SQL — document-based model fits the data well

---

## ADR-003: Clerk for Authentication

### Date
2026-03-04

### Status
**Accepted**

### Context

Need authentication with social login, email/password, and role-based access control for admin features.

### Decision

Clerk was chosen over NextAuth.js, Auth0, and Supabase Auth.

### Rationale

- Excellent Convex integration (first-party support)
- Pre-built UI components (SignIn, SignUp, UserButton)
- Middleware-based route protection
- User metadata for role management (admin flag)
- Webhook support for user sync events
- Good developer experience with minimal configuration

---

## ADR-004: Cal.com for Booking

### Date
2026-03-04

### Status
**Accepted**

### Context

Need a booking/scheduling system that can be embedded in the website and provides webhook events for downstream processing.

### Decision

Cal.com was chosen over custom booking system, Calendly, and Acuity.

### Rationale

- Embeddable widget with customizable styling
- Webhook events for booking lifecycle
- Open-source option available (self-hosted)
- Handles scheduling complexity (availability, time zones, buffers)
- No per-booking fees on self-hosted plan
- API access for programmatic management

---

## ADR-005: Resend for Transactional Email

### Date
2026-03-04

### Status
**Accepted**

### Context

Need a transactional email service for booking confirmations, membership emails, and order notifications.

### Decision

Resend was chosen over SendGrid, Mailgun, and AWS SES.

### Rationale

- Native React Email support (JSX email templates)
- Modern developer experience
- Simple API with excellent documentation
- Generous free tier (100 emails/day)
- Built by the creator of React Email
- Easy integration with Next.js and Convex actions

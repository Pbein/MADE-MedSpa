# MADE Med Spa - Architecture Decision Records

## Overview

This document records significant architectural decisions made during the MADE Med Spa project.

---

## ADR-001: E-Commerce Architecture -- Convex + Stripe vs. Third-Party Platforms

### Date
2026-03-04

### Status
**Superseded** by ADR-007

### Context
Evaluated options for e-commerce: custom Convex + Stripe build vs. Shopify, Snipcart, or Stripe Payment Links.

### Decision
Convex + Stripe Checkout was chosen for unified data, member discount integration, and cost efficiency.

### Note
This decision was reversed in ADR-007. E-commerce was removed from the site scope entirely.

---

## ADR-002: Convex as Backend-as-a-Service

### Date
2026-03-04

### Status
**Accepted**

### Context
Needed a backend with database, serverless functions, and real-time capabilities.

### Decision
Convex was chosen over Supabase, Firebase, and custom API.

### Rationale
- Real-time subscriptions built in
- Type-safe schema and queries with TypeScript
- Serverless functions co-located with schema
- File storage included
- Excellent Next.js integration

---

## ADR-003: Clerk for Authentication

### Date
2026-03-04

### Status
**Accepted**

### Context
Need authentication with role-based access control for admin features.

### Decision
Clerk was chosen over NextAuth.js, Auth0, and Supabase Auth.

### Rationale
- First-party Convex integration
- Pre-built UI components
- Middleware-based route protection
- User metadata for role management

---

## ADR-004: Cal.com for Booking

### Date
2026-03-04

### Status
**Superseded** by ADR-007

### Context
Needed an embeddable booking/scheduling system with webhook events.

### Decision
Cal.com was chosen for its embeddable widget and webhook support.

### Note
This decision was reversed in ADR-007. Booking is now handled entirely by Pabau via external link.

---

## ADR-005: Resend for Transactional Email

### Date
2026-03-04

### Status
**Superseded** by ADR-007

### Context
Needed transactional email for booking confirmations, membership emails, and order notifications.

### Decision
Resend was chosen for its React Email support and developer experience.

### Note
This decision was reversed in ADR-007. No transactional email is sent from the site.

---

## ADR-006: Pabau as EMR / CRM (Replacing Hermes)

### Date
2026-03-26

### Status
**Accepted** (scope reduced in ADR-007)

### Context
Client selected Pabau as their practice management / EMR platform, replacing the originally planned Hermes CRM integration.

### Decision
Pabau replaces Hermes as the EMR/CRM system. All business operations (scheduling, patient records, payments, memberships, marketing) run through Pabau.

### Note
ADR-007 further simplified this: instead of building a Pabau API integration, the site simply links to Pabau's online booking page.

---

## ADR-007: Site Simplification -- Marketing Site Only

### Date
2026-04-05

### Status
**Accepted**

### Context

The original project scope included a full-featured platform: e-commerce (product catalog, cart, checkout), membership management (Stripe subscriptions, member portal), embedded booking (Cal.com), transactional email (Resend), and EMR API integration (Pabau GraphQL sync).

Client needs changed as the project progressed. Pabau EMR was selected to handle all business operations: scheduling, patient records, payments, memberships, and marketing communications. Building these features into the website became redundant and added unnecessary complexity for a business that is still 3 months from opening.

### Decision

Strip the site down to a marketing website with admin content management. Remove:

- **E-commerce**: No product catalog, cart, checkout, or order management
- **Memberships**: No Stripe subscriptions, member portal, or tier management
- **Booking engine**: No Cal.com embed or webhook processing
- **Payment processing**: No Stripe integration
- **Transactional email**: No Resend integration
- **EMR API integration**: No Pabau GraphQL API calls

Keep:

- **Public marketing pages**: Home, About, Services, Service detail, Contact, FAQ, Booking (link to Pabau)
- **Admin dashboard**: CRUD for services, FAQs, site content blocks, and contact submission viewer
- **Convex**: Backend for content management (6 tables)
- **Clerk**: Admin authentication
- **Tailwind + Framer Motion**: Styling and animations

### Rationale

1. **Pabau handles business ops**: Scheduling, payments, memberships, patient records, and marketing are all managed in Pabau. Duplicating these in the website adds cost and maintenance burden with no benefit.
2. **Reduced time to launch**: Fewer features means faster delivery. The site can launch with the brand and service information the client needs now.
3. **Lower maintenance surface**: No webhook handlers, no payment edge cases, no inventory management, no subscription lifecycle to manage.
4. **Focus on what matters**: The website's job is to showcase the brand, describe services, and drive visitors to book. Everything else is noise.

### Consequences

- Convex schema reduced from 15 tables to 6
- Route count reduced from 26+ to 12 (7 public + 5 admin)
- Environment variables reduced from 25+ to 6
- Removed dependencies: Stripe, Cal.com, Resend, Pabau API client
- ADRs 001, 004, and 005 are superseded
- Epic tracker simplified accordingly

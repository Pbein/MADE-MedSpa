# MADE Med Spa - Epic Tracker

## Project Overview

This document tracks all 11 epics for the MADE Med Spa web application. Each epic links to its detailed documentation file with user stories, acceptance criteria, and implementation notes.

---

## Epic Status Legend

| Symbol | Meaning       |
| ------ | ------------- |
| [ ]    | Not started   |
| [~]    | In progress   |
| [x]    | Complete      |
| [-]    | Blocked/On hold |

---

## Epic Summary

| #  | Epic                                  | Status | Stories | Doc                                          |
| -- | ------------------------------------- | ------ | ------- | -------------------------------------------- |
| 1  | Project Foundation & Infrastructure   | [x]    | 6/6     | [EPIC-01](./epics/EPIC-01-foundation.md)     |
| 2  | Public Pages - Home, About, Contact   | [~]    | 6/8     | [EPIC-02](./epics/EPIC-02-public-pages.md)   |
| 3  | Services Pages                        | [~]    | 4/5     | [EPIC-03](./epics/EPIC-03-services.md)       |
| 4  | FAQ Page                              | [x]    | 4/4     | [EPIC-04](./epics/EPIC-04-faq.md)            |
| 5  | Booking System (Cal.com)              | [~]    | 2/6     | [EPIC-05](./epics/EPIC-05-booking.md)        |
| 6  | Membership System                     | [~]    | 2/7     | [EPIC-06](./epics/EPIC-06-membership.md)     |
| 7  | Hermes Integration & Communication    | [ ]    | 0/5     | [EPIC-07](./epics/EPIC-07-hermes.md)         |
| 8  | Photo/Video Content                   | [ ]    | 0/5     | [EPIC-08](./epics/EPIC-08-media.md)          |
| 9  | SEO, Performance & Polish             | [ ]    | 0/6     | [EPIC-09](./epics/EPIC-09-seo-polish.md)     |
| 10 | Admin Dashboard                       | [~]    | 0/8     | [EPIC-10](./epics/EPIC-10-admin.md)          |
| 11 | E-Commerce                            | [~]    | 4/8     | [EPIC-11](./epics/EPIC-11-ecommerce.md)      |

---

## Recommended Build Order

### Phase 1: Foundation
- [x] Epic 1: Project Foundation & Infrastructure (6/6 complete)

### Phase 2: Core Public Site
- [~] Epic 2: Public Pages (6/8 done; 2.5 partial — needs email; 2.7 partial — needs skeleton loaders)
- [~] Epic 3: Services Pages (4/5 done; 3.5 partial — needs member savings callout)
- [x] Epic 4: FAQ Page (4/4 complete)
- [ ] Epic 8: Photo/Video Content (0/5 — not started)

### Phase 3: Core Functionality
- [~] Epic 5: Booking System (2/6 done; 5.1 needs Cal.com account & `@calcom/embed-react`; 5.3-5.5 need email service)
- [~] Epic 6: Membership System (2/7 done; 6.2 UI done but Step 4 payment needs Stripe; 6.3 webhooks done but needs Stripe Products; 6.4 UI has placeholder data — not wired to Convex; 6.6-6.7 not started)
- [ ] Epic 7: Hermes Integration (0/5 — not started; schema fields exist but no module/sync code)

### Phase 4: E-Commerce
- [~] Epic 11: E-Commerce (4/8 done; 11.1-11.2 complete; 11.3 cart has no state management; 11.4 API route exists but no UI; 11.5 page exists but no email; 11.7-11.8 admin pages complete)

### Phase 5: Admin & Polish
- [~] Epic 10: Admin Dashboard (0/8 fully complete, all 8 in progress — UI built on all pages; booking ~80%, contacts ~85%, members ~65% wired; services/FAQs need CRUD forms; content editor needs Convex persistence; role-based access not enforced)
- [ ] Epic 9: SEO, Performance & Polish (0/6 — not started)

---

## Progress Tracking

**Total Stories:** 68
**Complete:** 28
**In Progress:** 18
**Not Started:** 22

### Complete Stories (28):
- Epic 1: 1.1-1.6 (6)
- Epic 2: 2.1-2.4, 2.6, 2.8 (6)
- Epic 3: 3.1-3.4 (4)
- Epic 4: 4.1-4.4 (4)
- Epic 5: 5.2, 5.6 (2)
- Epic 6: 6.1, 6.5 (2)
- Epic 11: 11.1, 11.2, 11.7, 11.8 (4)

### In Progress Stories (18):
- 2.5 (contact email notifications — Convex done, email service not implemented)
- 2.7 (loading states — basic spinners only, no skeleton screens or Suspense)
- 3.5 (member savings callout — pricing shown but no member discount badges)
- 5.1 (Cal.com embed — page built with placeholder, needs package + account)
- 6.2 (signup flow — UI built, Step 4 payment needs Stripe keys)
- 6.3 (Stripe subscription — webhooks done, needs Products/Prices in Stripe)
- 6.4 (member dashboard — UI built with PLACEHOLDER hardcoded data, not wired to Convex)
- 10.1 (admin layout — built, but role-based access not enforced)
- 10.2 (admin dashboard home — products count wired, others placeholder)
- 10.3 (services admin — list wired, create/edit forms not built)
- 10.4 (FAQs admin — list wired, create/edit forms not built)
- 10.5 (bookings admin — ~80% done, missing date range filter and notes)
- 10.6 (members admin — ~65% done, wired to Convex, view-only)
- 10.7 (contacts admin — ~85% done, missing status tracking and delete)
- 10.8 (content editor — UI built with local state, Convex persistence not wired)
- 11.3 (cart — "Add to Cart" button exists but no cart logic/state/page)
- 11.4 (checkout — API route exists, no checkout page UI)
- 11.5 (order confirmation — page exists, no email service)

### Not Started Stories (22):
- 5.3 (booking confirmation email)
- 5.4 (booking reminder emails)
- 5.5 (post-visit review request)
- 6.6 (membership tier change)
- 6.7 (membership cancellation)
- 7.1-7.5 (Hermes integration — 5 stories)
- 8.1-8.5 (media/photo/video — 5 stories)
- 9.1-9.6 (SEO, a11y, performance — 6 stories)
- 11.6 (order history in dashboard)

### Blocking Dependencies

| Blocker | Stories Affected | Action Needed |
|---------|-----------------|---------------|
| **No email service** | 2.5, 5.3-5.5, 6.3 (failed payment), 7.3-7.4, 11.5 | Implement Resend email module |
| **No Stripe production keys** | 6.2 (Step 4), 6.3, 11.4 | Client provides Stripe account |
| **No Cal.com account** | 5.1 | Client provides Cal.com account |
| **No cart state management** | 11.3, 11.4 | Build cart context/state |
| **Admin role check missing** | 10.1 | Enforce role in middleware |
| **Client photography** | 8.1-8.5 | Client provides photos |

### Critical Infrastructure Gaps

1. **Email service entirely absent** — `resend` package installed but no email sending module exists anywhere in the codebase. Required by 10+ stories across epics 2, 5, 6, 7, 11.
2. **Cart state management absent** — "Add to Cart" buttons render but no React Context, Zustand, or any state management for cart. Convex `cartItems` table exists but is not connected.
3. **Admin role enforcement absent** — Middleware authenticates but does not check for admin role. Any authenticated user can access `/admin/*`.

_Last updated: 2026-03-12_

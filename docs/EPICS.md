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
| 1  | Project Foundation & Infrastructure   | [x]    | 6       | [EPIC-01](./epics/EPIC-01-foundation.md)     |
| 2  | Public Pages - Home, About, Contact   | [~]    | 8       | [EPIC-02](./epics/EPIC-02-public-pages.md)   |
| 3  | Services Pages                        | [~]    | 5       | [EPIC-03](./epics/EPIC-03-services.md)       |
| 4  | FAQ Page                              | [x]    | 4       | [EPIC-04](./epics/EPIC-04-faq.md)            |
| 5  | Booking System (Cal.com)              | [~]    | 6       | [EPIC-05](./epics/EPIC-05-booking.md)        |
| 6  | Membership System                     | [~]    | 7       | [EPIC-06](./epics/EPIC-06-membership.md)     |
| 7  | Pabau EMR Integration & Communication | [ ]    | 5       | [EPIC-07](./epics/EPIC-07-pabau.md)          |
| 8  | Photo/Video Content                   | [ ]    | 5       | [EPIC-08](./epics/EPIC-08-media.md)          |
| 9  | SEO, Performance & Polish             | [ ]    | 6       | [EPIC-09](./epics/EPIC-09-seo-polish.md)     |
| 10 | Admin Dashboard                       | [~]    | 8       | [EPIC-10](./epics/EPIC-10-admin.md)          |
| 11 | E-Commerce                            | [~]    | 8       | [EPIC-11](./epics/EPIC-11-ecommerce.md)      |

---

## Recommended Build Order

### Phase 1: Foundation
- [x] Epic 1: Project Foundation & Infrastructure (6/6 complete)

### Phase 2: Core Public Site
- [~] Epic 2: Public Pages (7 of 8 done; 2.5 partial — needs email notifications)
- [~] Epic 3: Services Pages (4 of 5 done; 3.5 partial — needs member savings callout)
- [x] Epic 4: FAQ Page (4/4 complete)
- [ ] Epic 8: Photo/Video Content (0/5 — not started)

### Phase 3: Core Functionality
- [~] Epic 5: Booking System (3 of 6 done; 5.1 needs Cal.com account)
- [~] Epic 6: Membership System (4 of 7 done; 6.2-6.3 need Stripe keys)
- [ ] Epic 7: Pabau EMR Integration (0/5 — not started)

### Phase 4: E-Commerce
- [~] Epic 11: E-Commerce (2 of 8 done, 5 in progress)

### Phase 5: Admin & Polish
- [~] Epic 10: Admin Dashboard (0 of 8 done, 8 in progress — all UI built)
- [ ] Epic 9: SEO, Performance & Polish (0/6 — not started)

---

## Progress Tracking

**Total Stories:** 68
**Completed:** 30
**In Progress:** 16
**Not Started:** 22

### Completed Stories (30):
- Epic 1: 1.1-1.6 (6)
- Epic 2: 2.1-2.4, 2.6, 2.8 (6)
- Epic 3: 3.1-3.4 (4)
- Epic 4: 4.1-4.4 (4)
- Epic 5: 5.2, 5.6 (2)
- Epic 6: 6.1, 6.4, 6.5 (3)
- Epic 11: 11.1, 11.2 (2)
- Across epics: Navigation rewrite, Footer rewrite, newsletter Convex backend (3 implicit)

### In Progress Stories (16):
- 2.5 (contact email notifications — Convex done, email/Hermes deferred)
- 2.7 (loading states — partial)
- 3.5 (member savings callout)
- 5.1 (Cal.com embed — page built, needs @calcom/embed-react + account)
- 6.2 (signup flow — UI built, Step 4 payment needs Stripe)
- 6.3 (Stripe subscription — webhooks done, needs Products/Prices setup)
- 10.1-10.8 (all admin pages UI built, some wired to Convex, some use demo data)
- 11.3 (cart — localStorage done, Convex sync not done)
- 11.4 (checkout — API route done, needs Stripe keys for testing)
- 11.5 (order confirmation — page done, email not done)
- 11.7 (admin products — full CRUD UI wired to Convex)
- 11.8 (admin orders — UI done with demo data)

### Not Started Stories (22):
- 5.3 (booking confirmation email)
- 5.4 (booking reminder emails)
- 5.5 (post-visit review request)
- 6.6 (membership tier change)
- 6.7 (membership cancellation)
- 7.1-7.5 (Pabau EMR integration — 5 stories)
- 8.1-8.5 (media/photo/video — 5 stories)
- 9.1-9.6 (SEO, a11y, performance — 6 stories)
- 11.6 (order history in dashboard)

_Last updated: 2026-03-26_

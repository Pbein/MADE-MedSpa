# Epic 3: Services Pages

## Goal

Build the services overview page and individual service detail pages that showcase MADE Med Spa's treatment offerings, drive bookings, and provide comprehensive information to prospective clients.

---

## User Stories

### 3.1: Services Overview Page
- [x] **Complete**

**As a** visitor,
**I want** to browse all available services in an organized grid,
**So that** I can find the treatment I'm interested in.

**Acceptance Criteria:**
- [x] Page at `/services` with hero section
- [x] Service cards displayed in a responsive grid
- [x] Cards show: image, name, short description, price/price range, category badge
- [x] Filter by category (Injectables, Skin Treatments, Body Contouring, Wellness)
- [x] Smooth filter transitions (no jarring layout shift)
- [x] Cards link to individual service detail pages
- [x] Services pulled from Convex `services` table (only active)
- [x] Sorted by `sortOrder` field

**Implementation Notes:**
- Use Convex query with optional category filter
- Consider animated grid transitions on filter change
- Category filter can be tabs, pills, or dropdown on mobile

---

### 3.2: Service Detail Page
- [x] **Complete**

**As a** visitor,
**I want** to see comprehensive details about a specific service,
**So that** I can make an informed decision about booking.

**Acceptance Criteria:**
- [x] Dynamic route at `/services/[slug]`
- [x] Hero section with service image and title
- [x] Full description with rich formatting
- [x] Price or price range prominently displayed
- [x] Duration displayed
- [x] Benefits list
- [x] Image gallery (if multiple images available)
- [x] "Book This Service" CTA button (links to booking page with service pre-selected)
- [x] Related services section at bottom
- [x] Breadcrumb navigation

**Implementation Notes:**
- Use `generateStaticParams` for static generation where possible
- Gallery can use a lightbox component
- Pre-select service in Cal.com embed via URL params

---

### 3.3: Service FAQs Section
- [x] **Complete**

**As a** visitor,
**I want** to see frequently asked questions specific to a service,
**So that** I can get answers without having to call or email.

**Acceptance Criteria:**
- [x] Accordion-style FAQ section on each service detail page
- [x] FAQs pulled from the service's `faqs` field in Convex
- [x] Smooth expand/collapse animations
- [x] Only shown if the service has FAQs
- [x] Link to main FAQ page for more questions

**Implementation Notes:**
- Use shadcn/ui Accordion component
- Service-specific FAQs stored in the service document itself
- General FAQs on the main FAQ page (Epic 4)

---

### 3.4: Service Category Pages
- [x] **Complete**

**As a** visitor,
**I want** to view services grouped by category,
**So that** I can explore a specific type of treatment in depth.

**Acceptance Criteria:**
- [x] Category-specific views accessible via filter or direct URL
- [x] Category description/intro text
- [x] Services within the category displayed in grid
- [x] Breadcrumb navigation (Home > Services > Category)

**Implementation Notes:**
- Can be implemented as filtered view on `/services?category=injectables`
- Or as separate routes `/services/category/[category]`
- Keep approach consistent with SEO strategy

---

### 3.5: Service Comparison / Pricing
- [ ] **Complete** _(Partially done — pricing shown on cards/detail pages; member savings callout not yet implemented)_

**As a** visitor,
**I want** to compare service options and understand pricing,
**So that** I can choose the best treatment for my needs and budget.

**Acceptance Criteria:**
- [x] Pricing displayed clearly on overview cards and detail pages
- [x] "Starting at" for variable pricing
- [ ] Membership savings callout where applicable ("Members save X%")
- [ ] Optional comparison table for related treatments
- [ ] CTA to membership page for savings

**Implementation Notes:**
- Member pricing can be calculated dynamically based on tier discounts
- Comparison table is optional for v1, nice-to-have
- Ensure pricing doesn't promise specific medical outcomes (compliance)

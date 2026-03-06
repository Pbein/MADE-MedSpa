# Epic 4: FAQ Page

## Goal

Build a comprehensive, categorized, and searchable FAQ page that helps visitors find answers quickly and reduces the volume of repetitive inquiries.

---

## User Stories

### 4.1: FAQ Page Layout
- [x] **Complete**

**As a** visitor,
**I want** a well-organized FAQ page,
**So that** I can quickly find answers to my questions.

**Acceptance Criteria:**
- [x] Page at `/faq` with hero section
- [x] FAQs grouped by category with clear headings
- [x] Accordion-style expand/collapse for each question
- [x] Only one accordion open at a time (or configurable)
- [x] Smooth animations on expand/collapse
- [x] Categories: General, Services, Booking, Membership, Products, Aftercare
- [x] Responsive layout

**Implementation Notes:**
- Use shadcn/ui Accordion component
- Pull all active FAQs from Convex, grouped by category
- Sort by `sortOrder` within each category

---

### 4.2: FAQ Search
- [x] **Complete**

**As a** visitor,
**I want** to search FAQs by keyword,
**So that** I can find specific answers without browsing every category.

**Acceptance Criteria:**
- [x] Search input at top of FAQ page
- [x] Real-time filtering as user types (debounced)
- [x] Searches both question and answer text
- [x] Matching results highlighted or filtered to show only matches
- [x] "No results found" message with CTA to contact page
- [x] Search clears category filter (or works within selected category)

**Implementation Notes:**
- Client-side filtering is sufficient for FAQ volume
- Use `useMemo` for filtered results
- Consider fuzzy search library (fuse.js) for better matching

---

### 4.3: FAQ Category Navigation
- [x] **Complete**

**As a** visitor,
**I want** to jump to a specific FAQ category,
**So that** I can browse relevant questions efficiently.

**Acceptance Criteria:**
- [x] Category pills/tabs at top of page
- [x] Clicking a category scrolls to that section or filters to show only that category
- [x] Active category visually indicated
- [x] "All" option to show everything
- [x] Sticky category nav on scroll (optional)
- [x] URL updates with category parameter for shareability

**Implementation Notes:**
- Use scroll-based navigation with `scrollIntoView` or filter-based approach
- Update URL with `?category=membership` for deep linking
- Consider intersection observer for active category tracking during scroll

---

### 4.4: FAQ Data Management
- [x] **Complete**

**As a** content manager,
**I want** FAQs stored in Convex and manageable from admin,
**So that** I can add, edit, and remove FAQs without code changes.

**Acceptance Criteria:**
- [x] FAQs stored in Convex `faqs` table
- [x] Fields: question, answer, category, sortOrder, isActive
- [x] Only active FAQs shown on public page
- [ ] Admin can add/edit/delete FAQs (Epic 10)
- [x] Answer field supports basic formatting (bold, links, lists)
- [x] Seed data includes at least 15 FAQs across all categories

**Implementation Notes:**
- Answer can use markdown, rendered with a markdown component
- Or store as plain text with basic HTML support
- Admin CRUD implemented in Epic 10

# Epic 10: Admin Dashboard

## Goal

Build a comprehensive admin dashboard for managing all aspects of the MADE Med Spa website including services, FAQs, bookings, members, contacts, site content, products, and orders.

---

## User Stories

### 10.1: Admin Layout & Access Control
- [~] **In Progress** (UI built — layout with sidebar, mobile responsive, Clerk user info; role-based access via middleware exists but needs admin role check enforcement)

**As an** admin,
**I want** a secure, dedicated admin area,
**So that** I can manage the website without affecting the public experience.

**Acceptance Criteria:**
- [x] Admin routes at `/admin/*` protected by middleware
- [~] Only users with "admin" role (via Clerk metadata) can access (middleware protects route, role check not enforced)
- [ ] Unauthorized users redirected to home page
- [x] Admin layout with sidebar navigation
- [x] Sidebar links: Dashboard, Services, FAQs, Bookings, Members, Contacts, Content, Products, Orders
- [x] Responsive admin layout (collapsible sidebar on mobile)
- [x] Admin header with user info and sign-out

**Implementation Notes:**
- Use Clerk's `auth()` and check for admin role in middleware
- Admin role set via Clerk Dashboard or API
- Separate layout.tsx for admin routes

---

### 10.2: Admin Dashboard Home
- [~] **In Progress** (UI built with stats cards; products count wired to Convex; orders/members/contacts show placeholder)

**As an** admin,
**I want** an overview dashboard with key metrics,
**So that** I can quickly assess the state of the business.

**Acceptance Criteria:**
- [x] Dashboard at `/admin`
- [~] Key metrics cards (products count live; others placeholder)
- [ ] Recent activity feed
- [x] Quick action buttons (add product, view orders, edit content)
- [ ] Revenue chart (stretch goal)
- [~] Data pulled from Convex queries (partial)

**Implementation Notes:**
- Use Convex aggregation queries for metrics
- StatsCard component for metric display
- Consider real-time updates via Convex subscriptions

---

### 10.3: Service Management (CRUD)
- [~] **In Progress** (list page wired to Convex `api.services.listAll`; search and category filter working; edit/create forms not built)

**As an** admin,
**I want** to create, edit, and manage services,
**So that** I can keep the service catalog up to date.

**Acceptance Criteria:**
- [x] Service list page at `/admin/services` with data table
- [x] Table columns: name, category, price, status (active/inactive)
- [ ] Create new service form with all fields
- [ ] Edit existing service form (pre-populated)
- [ ] Toggle active/inactive status
- [ ] Delete service with confirmation dialog
- [ ] Image upload for service images
- [x] Search by name, filter by category

**Implementation Notes:**
- Convex `services.listAll` query exists
- Need create/update/delete mutations for services
- Image upload via Convex File Storage

---

### 10.4: FAQ Management (CRUD)
- [~] **In Progress** (list page wired to Convex `api.faqs.listAll`; search and category filter working; edit/create forms not built)

**As an** admin,
**I want** to manage FAQs,
**So that** I can keep the FAQ page current and helpful.

**Acceptance Criteria:**
- [x] FAQ list page at `/admin/faqs` with data table
- [x] Filter by category
- [ ] Create new FAQ form
- [ ] Edit existing FAQ
- [ ] Toggle active/inactive
- [ ] Delete with confirmation

**Implementation Notes:**
- Convex `faqs.listAll` query exists
- Need create/update/delete mutations for FAQs

---

### 10.5: Booking Management
- [~] **In Progress ~80%** (list page wired to Convex `api.bookings.list`; status filter and search working; status update calls `api.bookings.updateStatus`; missing date range filter and notes)

**As an** admin,
**I want** to view and manage bookings,
**So that** I can track appointments and handle scheduling issues.

**Acceptance Criteria:**
- [x] Bookings list at `/admin/bookings` with data table
- [x] Columns: client name, service, date/time, status, actions
- [x] Filter by status (confirmed, cancelled, completed, no-show)
- [ ] Filter by date range
- [x] Update booking status (mark as completed, no-show)
- [ ] Add notes to bookings

**Implementation Notes:**
- Convex `bookings.list` and `bookings.updateStatus` wired
- Read-only for Cal.com managed fields

---

### 10.6: Member Management
- [~] **In Progress ~65%** (UI wired to Convex `api.members.listAll`, `api.membershipTiers.listAll`, `api.users.list`; filtering and search working; view-only — no mutations wired)

**As an** admin,
**I want** to view and manage members,
**So that** I can support member inquiries and track the membership program.

**Acceptance Criteria:**
- [x] Members list at `/admin/members` with data table layout
- [x] Filter by tier and status UI
- [x] Wired to Convex member data (listAll, tiers, users queries)
- [x] Link to Stripe subscription view
- [x] Search by name or email UI
- [ ] Mutations for status/tier changes not wired (view-only)

**Implementation Notes:**
- Convex `members.listAll`, `membershipTiers.listAll`, `users.list` queries wired
- `members.updateStatus`, `members.updateTier` mutations exist but not called from UI

---

### 10.7: Contact Submission Management
- [~] **In Progress ~85%** (list page wired to Convex `api.contactSubmissions.list`; expandable messages; mailto reply button; missing status tracking and delete)

**As an** admin,
**I want** to view and respond to contact form submissions,
**So that** I can follow up with inquiries promptly.

**Acceptance Criteria:**
- [x] Contacts list at `/admin/contacts` with data table
- [x] View full message (expandable rows)
- [x] Reply button (mailto link)
- [ ] Mark as read/replied status tracking
- [ ] Delete old submissions
- [ ] New submission count badge in sidebar

**Implementation Notes:**
- Convex `contactSubmissions.list` query wired
- Need status field on contactSubmissions table for read/replied tracking

---

### 10.8: Site Content Editor
- [~] **In Progress** (UI built with local state editing; needs Convex `siteContent` mutations for persistence)

**As an** admin,
**I want** to edit site content (hero text, about page, etc.) without code changes,
**So that** I can update messaging and keep content fresh.

**Acceptance Criteria:**
- [x] Content editor at `/admin/content` with card layout
- [x] Organized by page section
- [x] Editable fields for text content
- [ ] Persistence to Convex `siteContent` table
- [ ] Preview capability
- [ ] Save/publish workflow

**Implementation Notes:**
- Convex `siteContent` table exists in schema
- Need create/update mutations for siteContent

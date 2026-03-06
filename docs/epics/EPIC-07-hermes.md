# Epic 7: Hermes Integration & Communication

## Goal

Build a reusable Hermes CRM sync module that tracks all customer touchpoints, and implement transactional email templates via Resend for every communication event in the system.

---

## User Stories

### 7.1: Hermes Sync Module
- [ ] **Complete**

**As a** developer,
**I want** a reusable module for Hermes API interactions,
**So that** all CRM syncing follows a consistent pattern.

**Acceptance Criteria:**
- [ ] Hermes API client module in `lib/hermes.ts` or `convex/lib/hermes.ts`
- [ ] Functions: `createContact`, `updateContact`, `addEvent`, `addTag`, `removeTag`
- [ ] Error handling with retry logic for transient failures
- [ ] Logging for all Hermes API calls
- [ ] Type-safe request/response types
- [ ] Rate limiting awareness (respect Hermes API limits)
- [ ] Configurable via environment variables

**Implementation Notes:**
- Use Convex actions (httpAction or action) for external API calls
- Consider a queue pattern for high-volume sync events
- Hermes API key stored as environment variable

---

### 7.2: Contact Sync Touchpoints
- [ ] **Complete**

**As a** business owner,
**I want** all customer interactions synced to Hermes,
**So that** I have a complete view of each client's journey.

**Acceptance Criteria:**
- [ ] Contact form submission -> create/update Hermes contact
- [ ] Newsletter signup -> tag contact as "newsletter-subscriber"
- [ ] Booking created -> add "booking-created" event, tag with service
- [ ] Booking completed -> add "visit-completed" event
- [ ] Membership signup -> add "member-{tier}" tag, "membership-started" event
- [ ] Membership cancelled -> remove member tag, add "membership-cancelled" event
- [ ] Product purchase -> add "purchase" event with order details
- [ ] Each sync stores `hermesContactId` in relevant Convex record

**Implementation Notes:**
- Trigger Hermes sync from Convex mutations/actions
- Use Convex scheduled functions for non-blocking sync
- Map internal events to Hermes event names consistently

---

### 7.3: Transactional Email Templates
- [ ] **Complete**

**As a** system,
**I want** professionally branded email templates for all communications,
**So that** every touchpoint reinforces the MADE brand.

**Acceptance Criteria:**
- [ ] Base email layout template (header, footer, brand colors)
- [ ] Booking confirmation template
- [ ] Booking reminder template (24hr)
- [ ] Booking cancellation template
- [ ] Post-visit review request template
- [ ] Membership welcome template
- [ ] Membership cancellation template
- [ ] Payment failed template
- [ ] Contact form auto-reply template
- [ ] Admin notification template (new contact, new booking)
- [ ] Order confirmation template
- [ ] Shipping notification template
- [ ] All templates responsive (mobile email clients)

**Implementation Notes:**
- Use React Email for template components
- Store templates in `emails/` directory
- Preview templates at `/api/email-preview/[template]` in development
- Use Resend's React Email integration for sending

---

### 7.4: Resend Email Service
- [ ] **Complete**

**As a** developer,
**I want** a centralized email sending service,
**So that** all emails are sent consistently with proper error handling.

**Acceptance Criteria:**
- [ ] Email service module in `lib/email.ts` or `convex/lib/email.ts`
- [ ] Functions: `sendBookingConfirmation`, `sendBookingReminder`, `sendWelcomeEmail`, `sendOrderConfirmation`, etc.
- [ ] Resend API integration with proper authentication
- [ ] Error handling with logging
- [ ] From address configured (e.g., `hello@mademedispa.com`)
- [ ] Reply-to address configured
- [ ] Development mode: log emails instead of sending (or use Resend test mode)

**Implementation Notes:**
- Use `resend` npm package
- Convex actions for sending (external API)
- Consider batching for bulk sends

---

### 7.5: Communication Event Logging
- [ ] **Complete**

**As a** business owner,
**I want** a log of all communications sent,
**So that** I can audit what was sent and troubleshoot issues.

**Acceptance Criteria:**
- [ ] Communication log table in Convex (optional, can use Resend dashboard)
- [ ] Log includes: recipient, template, timestamp, status (sent/failed)
- [ ] Failed sends trigger retry (max 3 attempts)
- [ ] Admin can view communication log (Epic 10, optional)
- [ ] Resend dashboard serves as primary audit trail

**Implementation Notes:**
- Resend provides delivery tracking in their dashboard
- Optional: store log in Convex for in-app visibility
- Use Resend webhooks for delivery status tracking (optional)

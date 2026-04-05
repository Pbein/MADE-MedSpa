# Epic 7: Pabau EMR Integration & Communication

## Goal

Build a reusable Pabau EMR sync module that tracks all customer touchpoints (contacts, bookings, memberships, purchases), and implement transactional email templates via Resend for every communication event in the system. Pabau replaces the originally planned Hermes CRM and serves as the practice's EMR, CRM, and potentially online booking system.

---

## Decision: Pabau as EMR

**Date:** 2026-03-26
**Context:** The client selected Pabau as their EMR platform. Pabau provides patient records, appointment management, packages/memberships, marketing tools, and built-in online booking. This replaces the originally planned Hermes CRM integration.

**Key consideration:** Pabau has built-in online booking capabilities. A decision is needed on whether to:
- **Option A:** Use Pabau's online booking widget (replaces Cal.com)
- **Option B:** Keep Cal.com for website booking, sync to Pabau via API
- **Option C:** Build custom booking UI powered by Pabau's API

---

## User Stories

### 7.1: Pabau API Client Module
- [ ] **Complete**

**As a** developer,
**I want** a reusable module for Pabau API interactions,
**So that** all EMR syncing follows a consistent pattern.

**Acceptance Criteria:**
- [ ] Pabau API client module in `lib/pabau.ts` or `convex/lib/pabau.ts`
- [ ] Functions: `createPatient`, `updatePatient`, `getPatient`, `createAppointment`, `updateAppointment`, `addNote`, `addTag`, `removeTag`
- [ ] Error handling with retry logic for transient failures
- [ ] Logging for all Pabau API calls
- [ ] Type-safe request/response types (Pabau uses GraphQL)
- [ ] Rate limiting awareness (respect Pabau API limits)
- [ ] Configurable via environment variables (`PABAU_API_KEY`, `PABAU_API_URL`, `PABAU_COMPANY_ID`)

**Implementation Notes:**
- Pabau uses a GraphQL API — build typed queries/mutations
- Use Convex actions (httpAction or action) for external API calls
- Consider a queue pattern for high-volume sync events
- API key stored as Convex environment variable

---

### 7.2: Patient Sync Touchpoints
- [ ] **Complete**

**As a** business owner,
**I want** all customer interactions synced to Pabau,
**So that** I have a complete patient record for each client.

**Acceptance Criteria:**
- [ ] Contact form submission -> create/update Pabau patient record
- [ ] Newsletter signup -> update marketing consent in Pabau
- [ ] Booking created -> create appointment in Pabau (if not using Pabau booking)
- [ ] Booking completed -> update appointment status in Pabau
- [ ] Membership signup -> add membership/package in Pabau, tag patient
- [ ] Membership cancelled -> update membership status, remove tag
- [ ] Product purchase -> log purchase event / add note to patient record
- [ ] Each sync stores `pabauPatientId` in relevant Convex record

**Implementation Notes:**
- Trigger Pabau sync from Convex mutations/actions
- Use Convex scheduled functions for non-blocking sync
- Map internal events to Pabau API calls consistently
- Pabau patient ID should be stored on the Convex `users` table (replace `hermesContactId` field)

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
- Note: Pabau also has built-in email/SMS marketing — these Resend templates are for transactional emails from the website; Pabau handles clinic-side communications

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
- [ ] Pabau communication log serves as secondary audit trail for clinic-side messages

**Implementation Notes:**
- Resend provides delivery tracking in their dashboard
- Pabau tracks its own communications (SMS, email from within Pabau)
- Optional: store log in Convex for in-app visibility
- Use Resend webhooks for delivery status tracking (optional)

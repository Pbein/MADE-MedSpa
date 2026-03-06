# Epic 5: Booking System (Cal.com)

## Goal

Integrate Cal.com as the booking engine, allowing visitors to schedule consultations and treatments directly on the website. Handle booking lifecycle events (confirmation, reminders, post-visit follow-up) through webhooks and automated emails.

---

## User Stories

### 5.1: Cal.com Embed Integration
- [~] **In Progress** (page built with placeholder; needs `@calcom/embed-react` install + Cal.com account)

**As a** visitor,
**I want** to book an appointment directly on the MADE Med Spa website,
**So that** I don't have to leave the site or call to schedule.

**Acceptance Criteria:**
- [ ] Cal.com embed widget on `/booking` page (placeholder in place)
- [ ] Embed styled to match MADE brand (custom CSS overrides)
- [ ] Event types mapped to MADE services
- [x] Pre-selection of service via URL parameters (from service detail CTAs)
- [x] Responsive embed on all screen sizes
- [x] Loading state while embed initializes
- [ ] Calendar shows real-time availability

**Implementation Notes:**
- Use `@calcom/embed-react` package
- Configure Cal.com event types to match service catalog
- Pass `?service=botox` or similar to pre-select
- Custom theme colors via Cal.com embed config

---

### 5.2: Booking Webhook Handler
- [x] **Complete**

**As a** system,
**I want** to process Cal.com webhook events,
**So that** bookings are recorded in Convex and trigger downstream actions.

**Acceptance Criteria:**
- [x] Webhook endpoint at `/api/webhooks/calcom`
- [x] Handles `BOOKING_CREATED` event
- [x] Handles `BOOKING_CANCELLED` event
- [x] Handles `BOOKING_RESCHEDULED` event
- [x] Webhook signature verification (HMAC)
- [x] Booking data stored in Convex `bookings` table
- [x] Error handling with logging for failed webhook processing
- [x] Idempotent processing (duplicate webhook handling)

**Implementation Notes:**
- Use Next.js API route (Route Handler)
- Verify webhook signature using Cal.com secret
- Map Cal.com event type to Convex service ID
- Store `calEventId` for deduplication

---

### 5.3: Booking Confirmation Email
- [ ] **Complete**

**As a** client,
**I want** to receive a confirmation email after booking,
**So that** I have the appointment details in my inbox.

**Acceptance Criteria:**
- [ ] Email sent immediately after booking is confirmed
- [ ] Includes: service name, date, time, duration, location/address
- [ ] Includes: preparation instructions (if any)
- [ ] Includes: cancellation/reschedule link
- [ ] Professional, branded email template
- [ ] Sent via Resend

**Implementation Notes:**
- Trigger from webhook handler after storing booking
- Use React Email template
- Include Cal.com reschedule/cancel links from webhook payload
- Template stored in `emails/` directory

---

### 5.4: Booking Reminder Emails
- [ ] **Complete**

**As a** client,
**I want** to receive reminder emails before my appointment,
**So that** I don't forget and can prepare accordingly.

**Acceptance Criteria:**
- [ ] 24-hour reminder email before appointment
- [ ] Optional: 1-hour reminder email
- [ ] Reminder includes same details as confirmation
- [ ] Includes preparation instructions
- [ ] Cancelled bookings do not receive reminders
- [ ] Rescheduled bookings update reminder timing

**Implementation Notes:**
- Use Convex scheduled functions (`ctx.scheduler.runAfter`)
- Calculate reminder time from booking date
- Cancel scheduled reminders when booking is cancelled
- Store scheduled function IDs in booking record for cancellation

---

### 5.5: Post-Visit Review Request
- [ ] **Complete**

**As a** business owner,
**I want** clients to receive a review request after their visit,
**So that** we can collect testimonials and feedback.

**Acceptance Criteria:**
- [ ] Email sent 24-48 hours after appointment time
- [ ] Includes link to Google Reviews
- [ ] Includes optional internal feedback form link
- [ ] Only sent for completed bookings (not cancelled/no-show)
- [ ] Friendly, appreciative tone
- [ ] Branded email template

**Implementation Notes:**
- Use Convex scheduled function based on appointment end time
- Booking must be marked as "completed" (or not cancelled)
- Could also link to a simple Convex-backed feedback form

---

### 5.6: Booking Confirmation Page
- [x] **Complete**

**As a** visitor,
**I want** to see a confirmation page after booking,
**So that** I know my appointment was successfully scheduled.

**Acceptance Criteria:**
- [x] Confirmation page at `/booking/confirmation`
- [x] Displays booking summary (service, date, time)
- [x] "Add to Calendar" button (Google Calendar, iCal)
- [x] Next steps / what to expect information
- [x] Link back to home or services
- [x] Works for both authenticated and guest bookings

**Implementation Notes:**
- Redirect to confirmation after Cal.com booking completion
- Cal.com provides callback/redirect URL configuration
- Booking details can come from URL params or Convex lookup

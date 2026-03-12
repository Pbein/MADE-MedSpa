# Epic 6: Membership System

## Goal

Build a 4-tier membership system with a multi-step signup flow, Stripe subscription billing, member dashboard, and self-service subscription management. Memberships provide recurring revenue and client retention.

---

## Membership Tiers

| Tier      | Monthly Price | Key Benefits                                      |
| --------- | ------------- | ------------------------------------------------- |
| Essential | $99/mo        | 1 basic treatment/month, 10% off services & products |
| Premium   | $199/mo       | 1 premium treatment/month, 15% off, priority booking |
| Elite     | $349/mo       | 2 treatments/month, 20% off, VIP scheduling, free shipping |
| VIP       | $599/mo       | Unlimited select treatments, 25% off, concierge service, free shipping |

---

## User Stories

### 6.1: Membership Overview Page
- [x] **Complete**

**As a** visitor,
**I want** to see and compare membership tiers,
**So that** I can choose the right plan for my needs.

**Acceptance Criteria:**
- [x] Page at `/membership` with hero section
- [x] 4-tier comparison cards side by side (stacked on mobile)
- [x] Each card shows: tier name, price, benefits list, CTA button
- [x] Visual distinction for recommended/popular tier
- [x] "Most Popular" badge on Premium tier
- [ ] Benefits comparison table below cards
- [x] FAQ section specific to memberships
- [x] CTA links to multi-step signup flow

**Implementation Notes:**
- Tier data can be hardcoded or stored in Convex
- Use pricing component with clear visual hierarchy
- Highlight savings vs. pay-per-visit pricing

---

### 6.2: Multi-Step Signup Flow
- [~] **In Progress**

**As a** visitor,
**I want** a clear, guided signup process for membership,
**So that** I can join easily without confusion.

**Acceptance Criteria:**
- [x] Multi-step form at `/membership/signup`
- [x] Step indicator (progress bar or numbered steps)
- [ ] **Step 1 - Account**: Create account or sign in (Clerk) (handled by middleware)
- [x] **Step 2 - Tier Confirmation**: Review selected tier, benefits, pricing
- [x] **Step 3 - Terms & Conditions**: Display T&C, checkbox to agree, timestamp agreement
- [~] **Step 4 - Payment**: Stripe payment form for subscription (placeholder; needs Stripe keys)
- [x] **Step 5 - Confirmation**: Welcome message, next steps, dashboard link
- [x] Back navigation between steps (except after payment)
- [x] Form state preserved between steps
- [x] Mobile-friendly step layout

**Implementation Notes:**
- Use React state or URL params to track current step
- Clerk's `<SignUp>` or `<SignIn>` component for Step 1
- Store T&C agreement timestamp in Convex member record
- Stripe Elements or Checkout Session for Step 4

---

### 6.3: Stripe Subscription Integration
- [~] **In Progress**

**As a** member,
**I want** my membership billed automatically each month,
**So that** I don't have to manually renew.

**Acceptance Criteria:**
- [ ] Stripe Products and Prices created for each tier
- [ ] Stripe Customer created for each new member
- [ ] Stripe Subscription created on signup completion
- [x] Webhook handler for `customer.subscription.created`
- [x] Webhook handler for `customer.subscription.updated`
- [x] Webhook handler for `customer.subscription.deleted`
- [x] Webhook handler for `invoice.payment_succeeded`
- [x] Webhook handler for `invoice.payment_failed`
- [x] Member record in Convex updated based on webhook events
- [ ] Failed payment handling (grace period, notification email)

**Implementation Notes:**
- Create Stripe Products/Prices in Stripe Dashboard or via API
- Store `stripeCustomerId` and `stripeSubscriptionId` in Convex
- Use `/api/webhooks/stripe` endpoint for all Stripe webhooks
- Verify webhook signature with `STRIPE_WEBHOOK_SECRET`

---

### 6.4: Member Dashboard
- [~] **In Progress** (UI built with layout and sections; uses PLACEHOLDER hardcoded data — not wired to Convex member/booking/order queries)

**As a** member,
**I want** a dashboard to view my membership details,
**So that** I can manage my account and see my benefits.

**Acceptance Criteria:**
- [x] Protected page at `/membership/dashboard`
- [~] Current tier and status displayed (placeholder data)
- [ ] Next billing date (placeholder)
- [~] Benefits summary for current tier (placeholder)
- [ ] Recent bookings list (placeholder)
- [ ] Order history (placeholder)
- [x] Quick action buttons: Book Appointment, Browse Shop, Manage Subscription
- [x] Link to Stripe Customer Portal for billing management

**Implementation Notes:**
- Gate behind Clerk authentication
- Currently uses PLACEHOLDER_TIER and PLACEHOLDER_BOOKINGS hardcoded data
- Needs wiring to Convex queries for real user membership, bookings, orders

---

### 6.5: Stripe Customer Portal
- [x] **Complete**

**As a** member,
**I want** to manage my subscription, update payment method, and view invoices,
**So that** I have full control over my billing.

**Acceptance Criteria:**
- [ ] "Manage Subscription" button on dashboard (dashboard not yet built)
- [x] Opens Stripe Customer Portal in new tab or redirect
- [x] Portal allows: update payment method, view invoices, cancel subscription
- [ ] Tier upgrade/downgrade through portal (or custom UI)
- [x] Portal return URL configured to redirect back to dashboard

**Implementation Notes:**
- Create Stripe Billing Portal session via API route
- Configure portal in Stripe Dashboard (allowed actions)
- Consider building custom tier change UI for better UX

---

### 6.6: Membership Tier Change
- [ ] **Complete**

**As a** member,
**I want** to upgrade or downgrade my membership tier,
**So that** I can adjust my plan as my needs change.

**Acceptance Criteria:**
- [ ] Upgrade/downgrade option on member dashboard
- [ ] Clear display of what changes (benefits, pricing)
- [ ] Prorated billing for mid-cycle changes
- [ ] Confirmation step before processing change
- [ ] Stripe subscription updated via API
- [ ] Convex member record updated via webhook
- [ ] Confirmation email sent

**Implementation Notes:**
- Use Stripe's subscription update API with proration
- Or handle through Stripe Customer Portal
- Send notification email via Resend after change

---

### 6.7: Membership Cancellation
- [ ] **Complete**

**As a** member,
**I want** to cancel my membership,
**So that** I can stop being billed if I no longer want the service.

**Acceptance Criteria:**
- [ ] Cancel option accessible from dashboard or Stripe Portal
- [ ] Cancellation reason prompt (optional feedback)
- [ ] Confirmation dialog with clear messaging
- [ ] Membership remains active until end of billing period
- [ ] Cancellation confirmation email
- [ ] Member record updated in Convex
- [ ] Win-back email sent after a period (optional, via scheduled function)

**Implementation Notes:**
- Use Stripe's `cancel_at_period_end` for end-of-period cancellation
- Store cancellation reason in Convex for analytics
- Hermes event for cancellation tracking

# Epic 2: Public Pages - Home, About, Contact

## Goal

Build the core brand pages that establish MADE Med Spa's identity, tell their story, and provide visitors with a way to get in touch. These pages form the public face of the website and drive conversions toward bookings and memberships.

---

## User Stories

### 2.1: Home Page Hero Section
- [x] **Complete**

**As a** visitor,
**I want** to see a visually stunning hero section when I land on the site,
**So that** I immediately understand what MADE Med Spa offers and feel compelled to explore.

**Acceptance Criteria:**
- [x] Full-width hero with background image or video
- [x] Brand headline and subheadline
- [x] Primary CTA button ("Book a Consultation" or "Explore Services")
- [x] Secondary CTA ("View Memberships")
- [x] Responsive on mobile (stacked layout, appropriately sized text)
- [x] Content editable from Convex `siteContent` table

**Implementation Notes:**
- Use Next.js Image component for optimized loading
- Consider subtle animation on load (fade-in, parallax)
- Hero content should be manageable from admin

---

### 2.2: Home Page Sections
- [x] **Complete**

**As a** visitor,
**I want** to see key information sections on the home page,
**So that** I can quickly learn about services, results, and how to get started.

**Acceptance Criteria:**
- [x] Featured services section (3-4 cards linking to service pages)
- [x] "Why MADE" value proposition section
- [x] Before/after results teaser (links to gallery)
- [x] Testimonial section (carousel or grid)
- [x] Membership teaser with CTA
- [x] Featured products section (3-4 product cards)
- [x] Final CTA section ("Ready to Get Started?")
- [x] All sections responsive

**Implementation Notes:**
- Pull featured services from Convex (flagged as featured)
- Pull featured products from Convex (isFeatured flag)
- Testimonials can be hardcoded initially, then moved to Convex

---

### 2.3: About Page
- [x] **Complete**

**As a** visitor,
**I want** to learn about MADE Med Spa's story, mission, and team,
**So that** I feel confident and connected to the brand.

**Acceptance Criteria:**
- [x] Hero section with brand imagery
- [x] "Our Story" narrative section
- [x] Mission/values section
- [x] Team member profiles (photo, name, title, bio)
- [x] Credentials/certifications section
- [x] CTA to book a consultation
- [x] Responsive layout

**Implementation Notes:**
- Team data can be stored in Convex or hardcoded initially
- Use consistent card design for team members
- Consider animated reveal on scroll

---

### 2.4: Contact Page
- [x] **Complete**

**As a** visitor,
**I want** to easily contact MADE Med Spa,
**So that** I can ask questions or request information.

**Acceptance Criteria:**
- [x] Contact form with fields: Name, Email, Phone (optional), Message
- [x] Form validation (client-side and server-side)
- [x] Success confirmation after submission
- [x] Business hours displayed
- [x] Location with embedded Google Map
- [x] Phone number and email with click-to-call/email
- [x] Social media links
- [x] Responsive layout

**Implementation Notes:**
- Form submits to Convex mutation
- Consider honeypot field for basic spam prevention
- Rate limiting on submissions

---

### 2.5: Contact Form Backend
- [ ] **Complete** _(Partially done — form submits to Convex mutation; Hermes/Resend integration deferred to Epic 7)_

**As a** business owner,
**I want** contact form submissions stored and forwarded,
**So that** I can respond to inquiries promptly.

**Acceptance Criteria:**
- [x] Convex mutation stores submission in `contacts` table
- [ ] Submission triggers Hermes contact creation/update
- [ ] Admin notification email sent via Resend
- [ ] Auto-reply email sent to the visitor
- [ ] Submission appears in admin dashboard
- [ ] Status tracking (new / read / replied)

**Implementation Notes:**
- Use Convex action for Hermes + Resend calls (external APIs)
- Email templates built with React Email
- Hermes sync can be deferred to Epic 7 if needed

---

### 2.6: Newsletter Signup
- [x] **Complete**

**As a** visitor,
**I want** to subscribe to the MADE Med Spa newsletter,
**So that** I receive updates, promotions, and tips.

**Acceptance Criteria:**
- [x] Email input in footer (global)
- [x] Inline validation for email format
- [x] Duplicate email handling (friendly message)
- [x] Success confirmation (inline toast or message)
- [x] Email stored in Convex `newsletter` table
- [ ] Hermes contact tagged as newsletter subscriber

**Implementation Notes:**
- Simple mutation to Convex
- Check for existing email before inserting
- Can add to Resend audience list for campaigns later

---

### 2.7: Loading States & Transitions
- [ ] **Complete** _(Partially done — components have loading checks)_

**As a** visitor,
**I want** smooth loading states and page transitions,
**So that** the site feels polished and professional.

**Acceptance Criteria:**
- [ ] Skeleton loaders for dynamic content sections
- [x] Form submission loading states (disabled button, spinner)
- [ ] Smooth page transitions between routes
- [ ] No layout shift (CLS) on content load

**Implementation Notes:**
- Use React Suspense with fallback components
- Tailwind animations for transitions
- next/font for font loading optimization

---

### 2.8: Responsive Design Verification
- [x] **Complete**

**As a** mobile user,
**I want** all public pages to work perfectly on my device,
**So that** I have a great experience regardless of screen size.

**Acceptance Criteria:**
- [x] All pages tested at 375px, 768px, 1024px, 1440px breakpoints
- [x] Touch-friendly tap targets (min 44x44px)
- [x] No horizontal scrolling
- [x] Images properly sized for each breakpoint
- [x] Forms usable on mobile keyboards

**Implementation Notes:**
- Mobile-first approach with Tailwind breakpoints
- Test on actual devices when possible
- Use Chrome DevTools device emulation

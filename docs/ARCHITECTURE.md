# MADE Med Spa - System Architecture

## Overview

MADE Med Spa is a full-stack web application built with Next.js (App Router) and Convex as the backend-as-a-service. The platform serves as a medical spa website with booking, memberships, e-commerce, and admin capabilities.

---

## Technology Stack

| Layer            | Technology                        |
| ---------------- | --------------------------------- |
| Framework        | Next.js 14+ (App Router)         |
| Backend/Database | Convex (real-time BaaS)           |
| Authentication   | Clerk                             |
| Payments         | Stripe (subscriptions + one-time) |
| Booking          | Cal.com (embedded)                |
| EMR / CRM        | Pabau                             |
| Email            | Resend + React Email              |
| Styling          | Tailwind CSS                      |
| UI Components    | shadcn/ui                         |
| Media            | Convex File Storage / Cloudinary  |
| Hosting          | Vercel                            |

---

## System Architecture Diagram

```
                    +------------------+
                    |   Vercel (CDN)   |
                    |   Next.js App    |
                    +--------+---------+
                             |
              +--------------+--------------+
              |              |              |
     +--------v---+   +-----v------+  +----v-------+
     |   Convex   |   |   Clerk    |  |  Cal.com   |
     | (Database, |   |  (Auth)    |  | (Booking)  |
     |  Functions,|   +------------+  +-----+------+
     |  Storage)  |                         |
     +-----+------+                   Webhooks
           |                                |
    +------+------+                  +------v------+
    |             |                  |   Convex    |
    |  Stripe     |                  |  Webhook    |
    | (Payments)  |                  |  Handlers   |
    +------+------+                  +-------------+
           |
    +------v------+     +-------------+
    |   Convex    |     |   Pabau     |
    |  Webhook    |     |  (EMR/CRM)  |
    |  Handlers   |     +------+------+
    +-------------+            |
                        +------v------+
                        |   Resend    |
                        |  (Email)    |
                        +-------------+
```

---

## Data Flows

### 1. Booking Flow
```
User selects service -> Cal.com embed loads -> User books appointment
-> Cal.com webhook fires -> Convex webhook handler processes
-> Booking stored in Convex -> Pabau patient record updated
-> Confirmation email via Resend -> Reminder emails scheduled
-> Post-visit review request triggered
```

### 2. Membership Signup Flow
```
User selects tier -> Multi-step form:
  Step 1: Account creation (Clerk)
  Step 2: Tier selection confirmation
  Step 3: Terms & Conditions acceptance
  Step 4: Stripe payment (subscription)
  Step 5: Confirmation page
-> Stripe webhook confirms payment -> Member record created in Convex
-> Welcome email via Resend -> Pabau patient tagged
```

### 3. Contact Form Flow
```
User submits contact form -> Convex mutation stores submission
-> Pabau lead/patient created/updated -> Notification email to admin
-> Auto-reply email to user via Resend
```

### 4. E-Commerce Purchase Flow
```
User browses product catalog -> Adds items to cart
-> Cart persisted (Convex for auth users, session for guests)
-> Proceeds to checkout -> Stripe Checkout Session created
-> Payment processed -> Stripe webhook confirms
-> Order record created in Convex -> Inventory decremented
-> Confirmation email via Resend -> Pabau event logged
-> Order visible in member dashboard
```

---

## Convex Schema Overview

### Core Tables

```typescript
// services
services: defineTable({
  name: v.string(),
  slug: v.string(),
  category: v.string(),
  shortDescription: v.string(),
  fullDescription: v.string(),
  price: v.optional(v.number()),
  priceRange: v.optional(v.string()),
  duration: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
  galleryImages: v.optional(v.array(v.string())),
  benefits: v.optional(v.array(v.string())),
  faqs: v.optional(v.array(v.object({ question: v.string(), answer: v.string() }))),
  isActive: v.boolean(),
  sortOrder: v.number(),
})

// faqs
faqs: defineTable({
  question: v.string(),
  answer: v.string(),
  category: v.string(),
  sortOrder: v.number(),
  isActive: v.boolean(),
})

// contacts
contacts: defineTable({
  name: v.string(),
  email: v.string(),
  phone: v.optional(v.string()),
  message: v.string(),
  source: v.string(),
  pabauPatientId: v.optional(v.string()),
  status: v.union(v.literal("new"), v.literal("read"), v.literal("replied")),
  createdAt: v.number(),
})

// newsletter
newsletter: defineTable({
  email: v.string(),
  subscribedAt: v.number(),
  isActive: v.boolean(),
})

// bookings
bookings: defineTable({
  calEventId: v.string(),
  userId: v.optional(v.string()),
  serviceId: v.optional(v.id("services")),
  name: v.string(),
  email: v.string(),
  phone: v.optional(v.string()),
  date: v.string(),
  time: v.string(),
  duration: v.number(),
  status: v.union(
    v.literal("confirmed"),
    v.literal("cancelled"),
    v.literal("completed"),
    v.literal("no-show")
  ),
  notes: v.optional(v.string()),
  createdAt: v.number(),
})

// members
members: defineTable({
  userId: v.string(),
  clerkId: v.string(),
  email: v.string(),
  name: v.string(),
  phone: v.optional(v.string()),
  tier: v.union(
    v.literal("essential"),
    v.literal("premium"),
    v.literal("elite"),
    v.literal("vip")
  ),
  stripeCustomerId: v.string(),
  stripeSubscriptionId: v.string(),
  subscriptionStatus: v.string(),
  startDate: v.number(),
  nextBillingDate: v.optional(v.number()),
  agreedToTerms: v.boolean(),
  agreedAt: v.number(),
})

// media
media: defineTable({
  type: v.union(v.literal("image"), v.literal("video")),
  url: v.string(),
  thumbnailUrl: v.optional(v.string()),
  title: v.optional(v.string()),
  description: v.optional(v.string()),
  category: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),
  isBeforeAfter: v.optional(v.boolean()),
  beforeImageUrl: v.optional(v.string()),
  afterImageUrl: v.optional(v.string()),
  serviceId: v.optional(v.id("services")),
  sortOrder: v.number(),
  isActive: v.boolean(),
})

// siteContent
siteContent: defineTable({
  page: v.string(),
  section: v.string(),
  content: v.any(),
  updatedAt: v.number(),
  updatedBy: v.optional(v.string()),
})
```

### E-Commerce Tables

```typescript
// products
products: defineTable({
  name: v.string(),
  slug: v.string(),
  category: v.string(),
  shortDescription: v.string(),
  fullDescription: v.string(),
  price: v.number(),
  compareAtPrice: v.optional(v.number()),
  images: v.array(v.string()),
  sku: v.optional(v.string()),
  stockQuantity: v.number(),
  isActive: v.boolean(),
  isFeatured: v.optional(v.boolean()),
  tags: v.optional(v.array(v.string())),
  ingredients: v.optional(v.string()),
  directions: v.optional(v.string()),
  weight: v.optional(v.string()),
  sortOrder: v.number(),
  createdAt: v.number(),
})

// cart
cart: defineTable({
  userId: v.optional(v.string()),
  sessionId: v.optional(v.string()),
  items: v.array(v.object({
    productId: v.id("products"),
    quantity: v.number(),
    priceAtAdd: v.number(),
  })),
  updatedAt: v.number(),
})

// orders
orders: defineTable({
  userId: v.optional(v.string()),
  email: v.string(),
  name: v.string(),
  items: v.array(v.object({
    productId: v.id("products"),
    productName: v.string(),
    quantity: v.number(),
    unitPrice: v.number(),
  })),
  subtotal: v.number(),
  tax: v.optional(v.number()),
  shipping: v.optional(v.number()),
  total: v.number(),
  stripePaymentIntentId: v.string(),
  stripeSessionId: v.optional(v.string()),
  status: v.union(
    v.literal("pending"),
    v.literal("paid"),
    v.literal("processing"),
    v.literal("shipped"),
    v.literal("delivered"),
    v.literal("cancelled"),
    v.literal("refunded")
  ),
  shippingAddress: v.optional(v.object({
    line1: v.string(),
    line2: v.optional(v.string()),
    city: v.string(),
    state: v.string(),
    postalCode: v.string(),
    country: v.string(),
  })),
  trackingNumber: v.optional(v.string()),
  notes: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
})
```

---

## Page Structure

```
/                           Home page
/about                      About the spa & team
/contact                    Contact form
/services                   Services overview grid
/services/[slug]            Individual service detail
/faq                        FAQ page (categorized, searchable)
/booking                    Cal.com booking embed
/booking/confirmation       Booking confirmation
/membership                 Membership tiers overview
/membership/signup          Multi-step signup flow
/membership/dashboard       Member dashboard
/shop                       Product catalog
/shop/[slug]                Product detail page
/shop/cart                  Shopping cart
/shop/checkout              Checkout flow
/shop/checkout/success      Order confirmation
/shop/orders                Order history (authenticated)
/admin                      Admin dashboard
/admin/services             Service management
/admin/faqs                 FAQ management
/admin/bookings             Booking overview
/admin/members              Member management
/admin/contacts             Contact submissions
/admin/content              Site content editor
/admin/products             Product management
/admin/orders               Order management
```

---

## Integrations

### Stripe
- **Subscriptions**: Membership tiers with recurring billing
- **Checkout Sessions**: One-time product purchases
- **Customer Portal**: Self-service subscription management
- **Webhooks**: Payment confirmation, subscription updates, refunds

### Cal.com
- **Embedded Widget**: Booking calendar on `/booking`
- **Event Types**: Mapped to services
- **Webhooks**: Booking created, cancelled, rescheduled

### Pabau (EMR / CRM)
- **Patient Records**: All form submissions, bookings, and purchases synced to Pabau
- **Appointment Management**: Booking scheduling and lifecycle management
- **Event Tracking**: Touchpoint logging for customer journey
- **Segmentation**: Membership tier, purchase history, treatment history
- **Clinical Records**: Treatment notes, consent forms, medical history (managed in Pabau)

### Resend
- **Transactional Emails**: Booking confirmations, order confirmations
- **Templates**: React Email components
- **Triggers**: Webhooks, Convex scheduled functions

---

## Component Architecture

```
components/
  layout/
    Header.tsx              Navigation, auth status
    Footer.tsx              Links, newsletter signup
    MobileNav.tsx           Responsive navigation
  ui/                       shadcn/ui components
  sections/
    Hero.tsx                Home page hero
    ServiceCard.tsx         Service grid cards
    TestimonialSlider.tsx   Client testimonials
    MembershipTierCard.tsx  Membership comparison
    ProductCard.tsx         Product catalog cards
  forms/
    ContactForm.tsx         Contact page form
    NewsletterForm.tsx      Email signup
    MembershipSignupForm.tsx Multi-step membership
    CheckoutForm.tsx        E-commerce checkout
  booking/
    CalEmbed.tsx            Cal.com widget wrapper
    BookingConfirmation.tsx Post-booking display
  membership/
    TierSelector.tsx        Tier comparison & selection
    MemberDashboard.tsx     Member portal
  shop/
    ProductGrid.tsx         Filterable product grid
    ProductGallery.tsx      Product image gallery
    CartDrawer.tsx          Slide-out cart
    CartItem.tsx            Individual cart line item
    OrderSummary.tsx        Checkout order summary
  media/
    BeforeAfterSlider.tsx   Comparison slider
    VideoPlayer.tsx         Embedded video
    Gallery.tsx             Image gallery lightbox
  admin/
    DataTable.tsx           Reusable admin table
    ContentEditor.tsx       Rich text editor
    ImageUploader.tsx       Media upload component
    StatsCard.tsx           Dashboard metrics
```

---

## Environment Variables

See [ENV-SETUP.md](./ENV-SETUP.md) for the complete list with descriptions.

---

## Security Considerations

- All mutations protected by Clerk authentication where required
- Admin routes gated by role-based access control
- Stripe webhooks verified with signing secrets
- Cal.com webhooks verified with HMAC signatures
- Environment variables never exposed to client (except `NEXT_PUBLIC_*`)
- Cart data validated server-side before checkout
- Inventory checked at checkout time to prevent overselling

# MADE Med Spa - System Architecture

## Technology Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Framework | Next.js 16 (App Router) | SSR, routing, React Server Components |
| Backend / Database | Convex | Real-time BaaS, document database, serverless functions |
| Authentication | Clerk | Admin-only auth, route protection |
| Styling | Tailwind CSS v4 | Utility-first CSS |
| Animations | Framer Motion | Page transitions, scroll animations |
| Hosting | Vercel | Edge deployment, CI/CD |

## Route Map

### Public Routes

```
/                    Home (hero, featured services, testimonials, CTAs)
/about               About the spa, team, mission
/services            Service category grid
/services/[slug]     Service detail page
/contact             Contact form + location info
/faq                 Categorized FAQ with search
/booking             Links to Pabau online booking
```

### Admin Routes (Clerk-protected)

```
/admin               Dashboard overview
/admin/services      Service CRUD
/admin/faqs          FAQ CRUD
/admin/content       Site content block editor
/admin/contacts      Contact submission viewer
```

## Convex Schema (6 Tables)

```
users
  - clerkId: string
  - email: string
  - name: string
  - role: "admin" | "editor"

services
  - name, slug, category: string
  - shortDescription, fullDescription: string
  - price: number (optional)
  - priceRange, duration: string (optional)
  - imageUrl: string (optional)
  - galleryImages: string[] (optional)
  - benefits: string[] (optional)
  - faqs: {question, answer}[] (optional)
  - isActive: boolean
  - sortOrder: number

faqs
  - question, answer, category: string
  - sortOrder: number
  - isActive: boolean

siteContent
  - page, section: string
  - content: any
  - updatedAt: number
  - updatedBy: string (optional)

contactSubmissions
  - name, email: string
  - phone: string (optional)
  - message, source: string
  - status: "new" | "read" | "replied"
  - createdAt: number

newsletterSubscribers
  - email: string
  - subscribedAt: number
  - isActive: boolean
```

## Component Structure

```
src/components/
  layout/
    Navigation.tsx       Header with nav links
    Footer.tsx           Footer with links, newsletter signup
  sections/
    HeroSection.tsx      Home page hero
    FeaturedServices.tsx  Service highlight cards
    ServiceCard.tsx       Individual service card
    TestimonialSection.tsx  Client testimonials
    AboutTeaser.tsx      About preview on home page
    CTABanner.tsx        Call-to-action banners
    EditorialBreak.tsx   Decorative section break
    MembershipTeaser.tsx Membership preview (links to Pabau)
    FeaturedProducts.tsx Product preview (links to Pabau)
  forms/
    ContactForm.tsx      Contact page form
  ui/
    Accordion.tsx        Expandable FAQ items
  providers/
    ConvexClientProvider.tsx  Convex + Clerk provider wrapper
```

## Data Flow

- **Public pages**: Convex queries fetch services, FAQs, site content, etc. Data renders via React Server Components or client-side subscriptions.
- **Admin pages**: Convex mutations handle create/update/delete operations. Clerk middleware protects all `/admin/*` routes.
- **Contact form**: Client submits form -> Convex mutation stores submission -> admin views in dashboard.
- **Newsletter**: Client submits email -> Convex mutation stores subscriber.

## External Integration

**Pabau (link-only)**: "Book Now" buttons link to the Pabau online booking page via `NEXT_PUBLIC_PABAU_BOOKING_URL`. No API calls to Pabau from the site.

## Authentication

Clerk protects `/admin/*` routes only. There is no customer authentication -- all public pages are accessible without login. Admin users are managed in the Clerk dashboard.

## Security

- All admin mutations require Clerk authentication
- Admin routes gated by Clerk middleware
- Environment variables with `NEXT_PUBLIC_` prefix are the only values exposed to the client
- No sensitive keys or payment data handled by the site

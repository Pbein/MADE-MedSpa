# MADE Med Spa - Project Plan

## Purpose

Marketing website for MADE Med Spa Aesthetics and Wellness, a luxury medical spa opening in approximately 3 months. The site showcases the brand, services, and team while directing visitors to Pabau for booking. All business operations (scheduling, patient records, payments, memberships) are handled by Pabau EMR -- the website is purely a marketing and content management tool.

## Target Audience

Women of color seeking luxury med spa services.

## Technology Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Backend / Database | Convex |
| Authentication | Clerk (admin only) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Hosting | Vercel |

## Design

Luxury feminine editorial aesthetic with a warm brown palette. Typography: Playfair Display (headings), Cormorant Garamond (subheadings/accents), Inter (body text).

## Routes

### Public (7)

| Route | Purpose |
| --- | --- |
| `/` | Home page -- hero, featured services, testimonials, CTAs |
| `/about` | About the spa, team, and mission |
| `/services` | Service category overview grid |
| `/services/[slug]` | Individual service detail page |
| `/contact` | Contact form + location info |
| `/faq` | Categorized, searchable FAQ |
| `/booking` | Redirects to or frames Pabau online booking |

### Admin (5, Clerk-protected)

| Route | Purpose |
| --- | --- |
| `/admin` | Dashboard with overview stats |
| `/admin/services` | CRUD services |
| `/admin/faqs` | CRUD FAQs |
| `/admin/content` | Edit site content blocks (hero text, about copy, etc.) |
| `/admin/contacts` | View and manage contact form submissions |

## Convex Tables (6)

| Table | Purpose |
| --- | --- |
| `users` | Clerk-synced admin users |
| `services` | Service listings with name, slug, category, description, price, images, benefits |
| `faqs` | FAQ entries with question, answer, category, sort order |
| `siteContent` | Editable content blocks keyed by page + section |
| `contactSubmissions` | Contact form entries with name, email, phone, message, status |
| `newsletterSubscribers` | Email signup list |

## Admin Capabilities

- **Services**: Create, read, update, delete service listings. Control active/inactive status, sort order, and all detail fields.
- **FAQs**: Create, read, update, delete FAQ entries. Organize by category with sort ordering.
- **Site Content**: Edit text content blocks used across public pages (hero headlines, about section copy, etc.) without code changes.
- **Contact Submissions**: View incoming contact form messages, mark as read/replied.

## Booking Strategy

"Book Now" buttons throughout the site link to the Pabau online booking page. The URL is configured via the `NEXT_PUBLIC_PABAU_BOOKING_URL` environment variable. No booking engine is embedded in the site -- Pabau handles scheduling, availability, payments, and confirmations.

## What This Site Does Not Include

- E-commerce / product sales
- Membership signup or billing
- Payment processing (no Stripe)
- Embedded booking calendar (no Cal.com)
- Transactional email (no Resend)
- EMR API integration (no Pabau API calls)
- Customer authentication (no customer accounts)

# Epic 1: Project Foundation & Infrastructure

## Goal

Set up the core project scaffolding with Next.js (App Router), Convex backend, authentication, base layout, schema definitions, and seed data. This epic establishes the technical foundation that all subsequent epics build upon.

---

## User Stories

### 1.1: Next.js Project Scaffolding
- [x] **Complete**

**As a** developer,
**I want** a properly configured Next.js 14+ project with App Router, Tailwind CSS, TypeScript, and shadcn/ui,
**So that** I have a modern, type-safe foundation to build on.

**Acceptance Criteria:**
- [x] Next.js 14+ initialized with App Router
- [x] TypeScript configured with strict mode
- [x] Tailwind CSS installed and configured with MADE brand colors/fonts
- [x] shadcn/ui installed with base components (Button, Card, Input, Dialog, etc.)
- [x] ESLint and Prettier configured
- [x] Path aliases configured (`@/` for root imports)
- [x] Project runs locally without errors

**Implementation Notes:**
- Use `create-next-app` with TypeScript template
- Configure `tailwind.config.ts` with brand palette (golds, creams, dark neutrals)
- Install shadcn/ui components incrementally as needed

---

### 1.2: Convex Backend Setup
- [x] **Complete**

**As a** developer,
**I want** Convex configured as the backend with schema definitions and development environment,
**So that** I have a real-time database and serverless functions ready.

**Acceptance Criteria:**
- [x] Convex installed and initialized
- [x] `convex/schema.ts` defined with all core tables (services, faqs, contacts, newsletter, bookings, members, media, siteContent)
- [x] E-commerce tables defined (products, cart, orders)
- [x] Convex provider wrapping the app
- [x] Development dashboard accessible
- [x] Basic query and mutation functions scaffolded

**Implementation Notes:**
- Run `npx convex dev` for development
- Schema should match the architecture doc exactly
- Use `v.optional()` for nullable fields

---

### 1.3: Authentication Setup (Clerk)
- [x] **Complete**

**As a** user,
**I want** to sign up and log in securely,
**So that** I can access member features and my account.

**Acceptance Criteria:**
- [x] Clerk installed and configured
- [x] ClerkProvider wrapping the app
- [x] Sign-up and sign-in flows working
- [x] Clerk + Convex integration configured (user identity in mutations)
- [x] Protected route middleware set up for `/membership/dashboard`, `/admin/*`
- [x] User metadata synced to Convex on first login

**Implementation Notes:**
- Configure Clerk webhook to sync user data to Convex
- Set up middleware.ts for route protection
- Admin role check via Clerk metadata or Convex role field

---

### 1.4: Base Layout & Navigation
- [x] **Complete**

**As a** visitor,
**I want** a consistent, beautiful layout with navigation,
**So that** I can easily browse the site.

**Acceptance Criteria:**
- [x] Root layout with Header and Footer components
- [x] Responsive navigation with mobile hamburger menu
- [x] Navigation links: Home, About, Services, FAQ, Booking, Membership, Shop, Contact
- [x] Logo in header
- [x] Auth status indicator (Sign In / User avatar)
- [x] Footer with links, contact info, social media icons, newsletter signup
- [x] Smooth scroll behavior
- [x] Active page indicator in nav

**Implementation Notes:**
- Use Next.js `layout.tsx` for root layout
- Header should be sticky/fixed on scroll
- Mobile nav should be a slide-out drawer or overlay

---

### 1.5: Seed Data
- [x] **Complete**

**As a** developer,
**I want** realistic seed data in Convex,
**So that** I can develop and test with representative content.

**Acceptance Criteria:**
- [x] Seed script creates sample services (at least 8 services across categories)
- [x] Seed script creates sample FAQs (at least 15 across 4+ categories)
- [x] Seed script creates sample site content entries
- [x] Seed script creates sample products (at least 10 skincare products)
- [x] Seed data is idempotent (safe to run multiple times)
- [x] Script runnable via `npx convex run seed:run`

**Implementation Notes:**
- Create `convex/seed.ts` with all seed functions
- Categories for services: Injectables, Skin Treatments, Body Contouring, Wellness
- Categories for products: Cleansers, Serums, Moisturizers, SPF, Kits

---

### 1.6: Environment Configuration
- [x] **Complete**

**As a** developer,
**I want** all environment variables documented and validated,
**So that** the app fails fast if configuration is missing.

**Acceptance Criteria:**
- [x] `.env.local.example` file with all required variables
- [x] Environment validation at app startup (Zod schema or similar)
- [x] `docs/ENV-SETUP.md` documents every variable with description
- [x] `.gitignore` includes `.env.local`
- [x] Vercel environment variable groups documented

**Implementation Notes:**
- Use `@t3-oss/env-nextjs` or manual Zod validation
- Separate client-side (`NEXT_PUBLIC_*`) and server-side variables

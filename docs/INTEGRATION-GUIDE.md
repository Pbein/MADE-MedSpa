# MADE Med Spa - Integration Setup Guide

## Overview

This guide covers the setup and configuration of all third-party services used by the MADE Med Spa application: Stripe, Cal.com, Pabau (EMR), and Resend.

---

## 1. Stripe Setup

### Account & API Keys

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Navigate to **Developers > API Keys**
3. Copy the **Publishable key** and **Secret key** (use test keys for development)
4. Add to environment variables:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = publishable key
   - `STRIPE_SECRET_KEY` = secret key

### Membership Products & Prices

Create Stripe Products and Prices for each membership tier:

1. Go to **Products** in Stripe Dashboard
2. Create 4 products:

| Product Name | Price | Billing |
| --- | --- | --- |
| MADE Essential Membership | $99.00/month | Recurring |
| MADE Premium Membership | $199.00/month | Recurring |
| MADE Elite Membership | $349.00/month | Recurring |
| MADE VIP Membership | $599.00/month | Recurring |

3. Copy each Price ID (`price_...`) and set the corresponding environment variables:
   - `STRIPE_ESSENTIAL_PRICE_ID`
   - `STRIPE_PREMIUM_PRICE_ID`
   - `STRIPE_ELITE_PRICE_ID`
   - `STRIPE_VIP_PRICE_ID`

### Webhook Configuration

1. Go to **Developers > Webhooks**
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events to listen for:
   - `checkout.session.completed` (e-commerce orders)
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `charge.refunded`
4. Copy the **Signing secret** (`whsec_...`) and set `STRIPE_WEBHOOK_SECRET`

**Local Development:**
```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copy the webhook signing secret output by the CLI
```

### Customer Portal

1. Go to **Settings > Billing > Customer Portal**
2. Configure allowed actions:
   - Update payment method: **Enabled**
   - View invoice history: **Enabled**
   - Cancel subscription: **Enabled**
   - Switch plans: **Enabled** (add all 4 membership prices)
3. Set return URL: `https://your-domain.com/membership/dashboard`

---

## 2. Cal.com Setup

### Account & Event Types

1. Create a Cal.com account at [cal.com](https://cal.com) (self-hosted or cloud)
2. Create event types matching your service catalog:

| Event Type | Duration | Description |
| --- | --- | --- |
| Botox Consultation | 30 min | Initial consultation for Botox treatment |
| Filler Consultation | 30 min | Initial consultation for dermal fillers |
| Facial Treatment | 60 min | Signature facial treatment |
| Body Contouring | 45 min | Body contouring consultation |
| General Consultation | 30 min | General med spa consultation |

3. Configure availability (business hours, buffers, etc.)
4. Set booking confirmation and reminder settings

### Embed Configuration

1. Get your Cal.com scheduling page URL (e.g., `https://cal.com/made-medspa`)
2. Set `NEXT_PUBLIC_CALCOM_EMBED_URL` environment variable
3. Install embed package:
   ```bash
   npm install @calcom/embed-react
   ```

### Webhook Configuration

1. Go to **Settings > Developer > Webhooks** in Cal.com
2. Add webhook URL: `https://your-domain.com/api/webhooks/calcom`
3. Select event triggers:
   - `BOOKING_CREATED`
   - `BOOKING_CANCELLED`
   - `BOOKING_RESCHEDULED`
4. Copy the webhook secret and set `CALCOM_WEBHOOK_SECRET`
5. Set payload format to **JSON**

### Event Type URL Mapping

Map service slugs to Cal.com event type slugs for pre-selection:

```typescript
// lib/calcom.ts
const serviceToCalEvent: Record<string, string> = {
  'botox': 'botox-consultation',
  'dermal-fillers': 'filler-consultation',
  'signature-facial': 'facial-treatment',
  'body-contouring': 'body-contouring',
};
```

---

## 3. Pabau EMR Setup

### Account & API Access

1. Set up a Pabau account at [pabau.com](https://www.pabau.com)
2. Navigate to **Setup > Integrations > API** in Pabau
3. Generate API credentials:
   - API Key
   - Company ID
4. Set environment variables:
   - `PABAU_API_KEY`
   - `PABAU_API_URL` (e.g., `https://api.pabau.com/graphql`)
   - `PABAU_COMPANY_ID`

### Patient Record Mapping

Map MADE website data to Pabau patient records:

| MADE Field | Pabau Field | Sync Trigger |
| --- | --- | --- |
| Contact form name/email | Patient name/email | On form submission |
| Membership tier | Custom field / Tag | On membership signup/change |
| Booking details | Appointment record | On booking created |
| Purchase history | Patient notes / Custom field | On order completed |
| Newsletter subscription | Marketing consent flag | On newsletter signup |

### Pabau Online Booking

Pabau includes built-in online booking. Evaluate whether to:
- **Option A**: Use Pabau's online booking widget (replaces Cal.com entirely)
- **Option B**: Keep Cal.com for website booking, sync appointments to Pabau via API
- **Option C**: Use Pabau's booking API to build a custom booking UI

### Webhook / Event Sync

Configure sync events from the MADE website to Pabau:

| Website Event | Pabau Action |
| --- | --- |
| Contact form submitted | Create/update patient, add note |
| Newsletter subscribed | Update marketing consent |
| Booking created | Create appointment (if not using Pabau booking) |
| Booking cancelled | Cancel appointment |
| Visit completed | Update appointment status |
| Membership started | Add membership tag, create package |
| Membership tier changed | Update membership tag/package |
| Membership cancelled | Remove membership tag |
| Product purchased | Add purchase note / log event |

### API Integration Pattern

```typescript
// Example Pabau API usage from Convex action
import { action } from "./_generated/server";

export const syncPatient = action({
  args: { name: v.string(), email: v.string(), source: v.string() },
  handler: async (ctx, args) => {
    const response = await fetch(process.env.PABAU_API_URL!, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PABAU_API_KEY}`,
        "Content-Type": "application/json",
        "X-Company-Id": process.env.PABAU_COMPANY_ID!,
      },
      body: JSON.stringify({
        query: `mutation CreatePatient($input: PatientInput!) {
          createPatient(input: $input) { id }
        }`,
        variables: {
          input: {
            email: args.email,
            name: args.name,
            source: args.source,
          },
        },
      }),
    });
    return await response.json();
  },
});
```

### Pabau Features Relevant to MADE

- **Online Booking**: Built-in scheduling widget (potential Cal.com replacement)
- **Patient Records**: Full EMR with treatment history, consent forms, medical history
- **Packages & Memberships**: Native membership/package management
- **Marketing**: Built-in email/SMS marketing tools
- **Payments**: POS integration (in-clinic), invoicing
- **Reporting**: Revenue, retention, and clinical reporting

---

## 4. Resend Setup

### Account & Domain Verification

1. Create a Resend account at [resend.com](https://resend.com)
2. Navigate to **Domains** and add your domain (e.g., `mademedispa.com`)
3. Add the required DNS records (SPF, DKIM, DMARC) to your domain
4. Wait for domain verification (usually minutes, up to 24 hours)
5. Copy the API key and set `RESEND_API_KEY`

### Configuration

```
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=hello@mademedispa.com
RESEND_REPLY_TO_EMAIL=info@mademedispa.com
```

### Install Dependencies

```bash
npm install resend @react-email/components
```

### Email Template Development

1. Create email templates in the `emails/` directory using React Email:

```
emails/
  components/
    EmailLayout.tsx       # Shared layout (header, footer, brand)
  BookingConfirmation.tsx
  BookingReminder.tsx
  MembershipWelcome.tsx
  OrderConfirmation.tsx
  ShippingNotification.tsx
  ContactAutoReply.tsx
  AdminNotification.tsx
  ReviewRequest.tsx
  PaymentFailed.tsx
```

2. Preview emails during development:
```bash
npx email dev
```
This starts a local preview server at `http://localhost:3000` for React Email templates.

### Sending Pattern

```typescript
// lib/email.ts
import { Resend } from 'resend';
import BookingConfirmation from '@/emails/BookingConfirmation';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmation(to: string, data: BookingData) {
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    replyTo: process.env.RESEND_REPLY_TO_EMAIL,
    subject: `Booking Confirmed - ${data.serviceName}`,
    react: BookingConfirmation({ ...data }),
  });

  if (error) {
    console.error('Failed to send booking confirmation:', error);
    throw error;
  }
}
```

---

## 5. Convex Setup

### Installation

```bash
npm install convex
npx convex init
```

### Development

```bash
npx convex dev
```

This starts the Convex development server, watches for schema/function changes, and syncs automatically.

### Set Convex Environment Variables

```bash
npx convex env set STRIPE_SECRET_KEY sk_test_...
npx convex env set STRIPE_WEBHOOK_SECRET whsec_...
npx convex env set PABAU_API_KEY pab_...
npx convex env set PABAU_API_URL https://api.pabau.com/graphql
npx convex env set PABAU_COMPANY_ID comp_...
npx convex env set RESEND_API_KEY re_...
npx convex env set RESEND_FROM_EMAIL hello@mademedispa.com
npx convex env set CALCOM_WEBHOOK_SECRET whsec_...
```

### Deployment

```bash
npx convex deploy
```

---

## 6. Clerk Setup

### Account & Application

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Configure sign-in methods (email, Google, etc.)
4. Copy API keys from **API Keys** section

### Webhook for User Sync

1. Go to **Webhooks** in Clerk Dashboard
2. Add endpoint: `https://your-domain.com/api/webhooks/clerk`
3. Select events: `user.created`, `user.updated`
4. Copy signing secret and set `CLERK_WEBHOOK_SECRET`

### Admin Role Setup

1. Go to **Users** in Clerk Dashboard
2. For admin users, add to public metadata:
   ```json
   { "role": "admin" }
   ```
3. Access in code via `auth().sessionClaims.metadata.role`

---

## Local Development Checklist

- [ ] Convex project initialized and `npx convex dev` running
- [ ] Clerk application created with test keys configured
- [ ] Stripe test keys configured
- [ ] Stripe CLI installed and forwarding webhooks locally
- [ ] Cal.com event types created
- [ ] Resend API key configured (use test key or verified domain)
- [ ] Pabau API credentials configured
- [ ] All environment variables in `.env.local`
- [ ] All Convex environment variables set via `npx convex env set`
- [ ] Seed data loaded via `npx convex run seed:run`

# Epic 11: E-Commerce

## Goal

Build a complete e-commerce system for skincare products, including a product catalog, shopping cart, Stripe checkout for one-time purchases, order management, and inventory tracking. This provides an additional revenue stream and allows members to purchase recommended products.

---

## Architecture Overview

The e-commerce system uses Convex for product data, cart persistence, and order records, with Stripe Checkout Sessions for payment processing. This approach was chosen over third-party platforms (Shopify, Snipcart) to maintain a unified data layer and seamless integration with the existing membership and booking systems.

See [DECISIONS.md](../DECISIONS.md) for the full architectural decision record.

### Key Data Tables
- **products** - Product catalog with images, pricing, inventory
- **cart** - Shopping cart (user-based for authenticated, session-based for guests)
- **orders** - Order records with line items, status tracking, shipping info

---

## User Stories

### 11.1: Product Catalog Page
- [x] **Complete**

**As a** visitor,
**I want** to browse skincare products in an organized catalog,
**So that** I can find products that interest me.

**Acceptance Criteria:**
- [ ] Product catalog page at `/shop`
- [ ] Hero section with shop branding
- [ ] Product grid with responsive layout (4 cols desktop, 2 cols tablet, 1 col mobile)
- [ ] Product cards show: image, name, price, compare-at price (strikethrough), category badge
- [ ] Filter by category (Cleansers, Serums, Moisturizers, SPF, Kits, etc.)
- [ ] Search by product name or description
- [ ] Sort options: Featured, Price Low-High, Price High-Low, Newest
- [ ] "Member Price" badge for logged-in members showing their discounted price
- [ ] Pagination or infinite scroll for large catalogs
- [ ] Only active products displayed
- [ ] Quick "Add to Cart" button on each card
- [ ] Loading skeleton states

**Implementation Notes:**
- Use Convex query with filters (category, search term, sort)
- Client-side filtering acceptable for small catalog; server-side for larger
- Member discount calculated based on tier percentage
- Use `useQuery` with Convex for real-time product data

---

### 11.2: Product Detail Page
- [x] **Complete**

**As a** visitor,
**I want** to see full details about a product,
**So that** I can make an informed purchase decision.

**Acceptance Criteria:**
- [ ] Dynamic route at `/shop/[slug]`
- [ ] Product image gallery (multiple images, thumbnail navigation)
- [ ] Main image with zoom on hover (desktop)
- [ ] Swipeable gallery on mobile
- [ ] Product name, price, compare-at price
- [ ] Member discount callout (if applicable)
- [ ] Full description with rich formatting
- [ ] Ingredients list (expandable/collapsible)
- [ ] Directions for use (expandable/collapsible)
- [ ] Product weight/size
- [ ] Stock status indicator ("In Stock", "Low Stock", "Out of Stock")
- [ ] Quantity selector
- [ ] "Add to Cart" button (disabled if out of stock)
- [ ] "Added!" confirmation feedback
- [ ] Related products section at bottom
- [ ] Breadcrumb navigation (Home > Shop > Product)
- [ ] SEO metadata (title, description, product schema)

**Implementation Notes:**
- Use Next.js Image for optimized gallery images
- Consider a lightbox for full-screen image viewing
- Low stock threshold: show "Only X left" when stockQuantity < 5
- Related products: same category, different product

---

### 11.3: Shopping Cart
- [~] **In Progress**

**As a** shopper,
**I want** a persistent shopping cart,
**So that** I can add items and purchase them when ready.

**Acceptance Criteria:**
- [ ] Cart accessible from header icon (with item count badge)
- [ ] Slide-out cart drawer for quick view
- [ ] Full cart page at `/shop/cart`
- [ ] Cart displays: product image, name, unit price, quantity, line total
- [ ] Quantity adjustment (+/- buttons, direct input)
- [ ] Remove item button
- [ ] Cart subtotal displayed
- [ ] Member discount applied and shown (if authenticated member)
- [ ] "Continue Shopping" and "Proceed to Checkout" buttons
- [ ] Empty cart state with CTA to shop
- [ ] **Authenticated users**: cart persisted in Convex `cart` table (survives logout/login)
- [ ] **Guest users**: cart persisted in session storage (browser)
- [ ] Cart merge on login (guest cart items added to existing user cart)
- [ ] Stock validation on quantity change (can't exceed available stock)
- [ ] Price shown is current price (updates if product price changes)

**Implementation Notes:**
- Use React Context or Zustand for client-side cart state
- Sync to Convex for authenticated users via mutation
- Session storage fallback for guest carts
- Cart merge logic: on Clerk sign-in event, merge session cart into Convex cart
- Use optimistic updates for add/remove/quantity changes

---

### 11.4: Checkout Flow with Stripe
- [~] **In Progress**

**As a** shopper,
**I want** to securely pay for my products,
**So that** I can complete my purchase with confidence.

**Acceptance Criteria:**
- [ ] Checkout page at `/shop/checkout` or redirect to Stripe Checkout
- [ ] Cart summary displayed during checkout
- [ ] Shipping address form (if not using Stripe Checkout hosted page)
- [ ] Member discount applied to line items before payment
- [ ] Stripe Checkout Session created via API route
- [ ] Line items passed to Stripe with correct amounts
- [ ] Success redirect to `/shop/checkout/success?session_id={id}`
- [ ] Cancel redirect back to `/shop/cart`
- [ ] Stock validated before creating checkout session (prevent overselling)
- [ ] Cart cleared after successful payment
- [ ] Stripe webhook (`checkout.session.completed`) processes the order
- [ ] Order created in Convex `orders` table from webhook

**Implementation Notes:**
- **Recommended approach**: Stripe Checkout (hosted page) for simplicity and PCI compliance
- Create Stripe Checkout Session in `/api/checkout` route handler
- Pass `metadata` with cart details and user ID for webhook processing
- Webhook at `/api/webhooks/stripe` (shared with membership webhooks, route by event type)
- Apply member discounts as line item amounts (not Stripe coupons) for simplicity
- Use `client_reference_id` for user identification

---

### 11.5: Order Confirmation & Email
- [~] **In Progress**

**As a** customer,
**I want** to see my order confirmation and receive an email receipt,
**So that** I have a record of my purchase.

**Acceptance Criteria:**
- [ ] Confirmation page at `/shop/checkout/success`
- [ ] Displays: order number, items purchased, quantities, prices, total
- [ ] Shipping address displayed
- [ ] Estimated delivery timeframe
- [ ] "Continue Shopping" and "View Order History" links
- [ ] Confirmation email sent via Resend
- [ ] Email includes: order summary, items, total, shipping address
- [ ] Email branded with MADE template
- [ ] Works for both authenticated and guest purchases (guest gets email only)
- [ ] Hermes event logged for purchase

**Implementation Notes:**
- Confirmation page reads order from Convex using Stripe session ID
- Email triggered from Stripe webhook handler after order creation
- React Email template for order confirmation
- Generate order number (sequential or UUID-based)

---

### 11.6: Order History in Member Dashboard
- [ ] **Not Started**

**As a** member,
**I want** to view my order history,
**So that** I can track purchases and reorder products.

**Acceptance Criteria:**
- [ ] Order history section on member dashboard (`/membership/dashboard`)
- [ ] Also accessible at `/shop/orders` (authenticated only)
- [ ] List of orders with: order number, date, total, status, item count
- [ ] Order detail view showing line items, shipping address, tracking
- [ ] Status tracking: Pending, Paid, Processing, Shipped, Delivered
- [ ] Tracking number link (when available)
- [ ] "Reorder" button to add same items to cart (optional, stretch)
- [ ] Sorted by date (most recent first)

**Implementation Notes:**
- Convex query filtering orders by user ID
- Order detail can be a modal or separate page
- Link tracking numbers to carrier tracking page

---

### 11.7: Admin Product Management
- [~] **In Progress** (admin UI built with full CRUD; needs image upload wiring)

**As an** admin,
**I want** to manage the product catalog,
**So that** I can add new products, update inventory, and control what's available for sale.

**Acceptance Criteria:**
- [ ] Product list at `/admin/products` with data table
- [ ] Columns: image thumbnail, name, category, price, stock, status, actions
- [ ] **Create product** form with fields:
  - Name, slug (auto-generated from name)
  - Category (dropdown)
  - Short description
  - Full description (rich text editor)
  - Price and compare-at price
  - SKU (optional)
  - Stock quantity
  - Images (multi-image upload with drag-to-reorder)
  - Tags
  - Ingredients, directions, weight
  - Active/inactive toggle
  - Featured toggle
- [ ] **Edit product** form (pre-populated, same fields)
- [ ] **Delete product** with confirmation dialog
- [ ] Toggle active/inactive status from list view
- [ ] Stock quantity inline editing
- [ ] Bulk stock update (optional, stretch)
- [ ] Image upload with preview, reorder, and delete
- [ ] Form validation (required fields, price > 0, stock >= 0)
- [ ] Low stock indicator in list view (stock < 10)
- [ ] Filter by category, status, stock level
- [ ] Search by product name

**Implementation Notes:**
- Use Convex File Storage for image uploads
- Slug auto-generation: lowercase, hyphenated, deduplicated
- Multi-image upload component with drag-and-drop
- Optimistic updates for status toggles
- Consider image cropping/resizing on upload

---

### 11.8: Admin Order Management
- [~] **In Progress** (admin UI built with demo data; needs Convex order queries wiring)

**As an** admin,
**I want** to view and manage orders,
**So that** I can fulfill purchases, track delivery, and handle returns.

**Acceptance Criteria:**
- [ ] Order list at `/admin/orders` with data table
- [ ] Columns: order number, customer name, date, items count, total, status, actions
- [ ] Filter by status (pending, paid, processing, shipped, delivered, cancelled, refunded)
- [ ] Filter by date range
- [ ] Search by order number, customer name, or email
- [ ] **Order detail view** showing:
  - Customer info (name, email)
  - Line items with quantities and prices
  - Subtotal, tax, shipping, total
  - Shipping address
  - Payment status (link to Stripe payment)
  - Order timeline / status history
- [ ] **Update order status** (dropdown: processing, shipped, delivered)
- [ ] **Add tracking number** (with carrier selection)
- [ ] **Send shipping notification** email to customer
- [ ] **Process refund** via Stripe Refund API
  - Full or partial refund
  - Refund reason (required)
  - Updates order status to "refunded"
  - Refund confirmation email to customer
  - Inventory restocked on refund (optional, configurable)
- [ ] **Add admin notes** to order
- [ ] Order export (CSV) for accounting

**Implementation Notes:**
- Status transitions: pending -> paid -> processing -> shipped -> delivered
- Refund uses Stripe Refund API via server action
- Tracking number storage in Convex order record
- Shipping notification triggers Resend email
- Status history can be an array of `{ status, timestamp, note }` objects
- Consider Stripe Dashboard link for each order's payment

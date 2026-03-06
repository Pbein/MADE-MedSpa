import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // --- Users & Authentication ---
  users: defineTable({
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    phone: v.optional(v.string()),
    authId: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    hermesContactId: v.optional(v.string()),
    role: v.optional(v.union(v.literal("admin"), v.literal("member"), v.literal("customer"))),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_authId", ["authId"])
    .index("by_stripeCustomerId", ["stripeCustomerId"]),

  // --- Membership System ---
  membershipTiers: defineTable({
    name: v.string(),
    slug: v.string(),
    monthlyPrice: v.number(),
    description: v.string(),
    benefits: v.array(v.string()),
    stripePriceId: v.string(),
    isActive: v.boolean(),
    sortOrder: v.number(),
  }).index("by_slug", ["slug"]),

  members: defineTable({
    userId: v.id("users"),
    tierId: v.id("membershipTiers"),
    status: v.union(
      v.literal("pending"),
      v.literal("active"),
      v.literal("past_due"),
      v.literal("cancelled"),
      v.literal("expired")
    ),
    stripeSubscriptionId: v.optional(v.string()),
    commitmentStartDate: v.number(),
    commitmentEndDate: v.number(),
    termsAcceptedAt: v.number(),
    termsVersion: v.string(),
    termsIpAddress: v.string(),
    nextBillingDate: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_stripeSubscriptionId", ["stripeSubscriptionId"])
    .index("by_status", ["status"]),

  // --- Services ---
  services: defineTable({
    name: v.string(),
    slug: v.string(),
    shortDescription: v.string(),
    fullDescription: v.string(),
    category: v.string(),
    duration: v.optional(v.string()),
    priceRange: v.optional(v.string()),
    calEventTypeSlug: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    galleryImageUrls: v.optional(v.array(v.string())),
    faqs: v.optional(
      v.array(
        v.object({
          question: v.string(),
          answer: v.string(),
        })
      )
    ),
    isActive: v.boolean(),
    sortOrder: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"]),

  // --- Bookings ---
  bookings: defineTable({
    userId: v.optional(v.id("users")),
    calBookingId: v.string(),
    calEventTypeSlug: v.optional(v.string()),
    serviceId: v.optional(v.id("services")),
    guestName: v.string(),
    guestEmail: v.string(),
    guestPhone: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.number(),
    status: v.union(
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("rescheduled"),
      v.literal("completed"),
      v.literal("no_show")
    ),
    reminderSentAt: v.optional(v.number()),
    reviewRequestSentAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_calBookingId", ["calBookingId"])
    .index("by_userId", ["userId"])
    .index("by_startTime", ["startTime"]),

  // --- Contact / Lead Capture ---
  contactSubmissions: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
    source: v.string(),
    hermesSyncedAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  // --- FAQ ---
  faqs: defineTable({
    question: v.string(),
    answer: v.string(),
    category: v.optional(v.string()),
    sortOrder: v.number(),
    isActive: v.boolean(),
  }).index("by_category", ["category"]),

  // --- Site Content (CMS-lite) ---
  siteContent: defineTable({
    key: v.string(),
    title: v.optional(v.string()),
    body: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    metadata: v.optional(v.any()),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),

  // --- Terms & Conditions Versions ---
  termsVersions: defineTable({
    version: v.string(),
    content: v.string(),
    effectiveDate: v.number(),
    createdAt: v.number(),
  }).index("by_version", ["version"]),

  // --- E-Commerce: Products ---
  products: defineTable({
    name: v.string(),
    slug: v.string(),
    shortDescription: v.string(),
    fullDescription: v.string(),
    category: v.string(),
    price: v.number(), // in cents
    compareAtPrice: v.optional(v.number()), // original price for sale display
    sku: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    galleryImageUrls: v.optional(v.array(v.string())),
    inventory: v.number(), // track stock count
    isActive: v.boolean(),
    isFeatured: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    sortOrder: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_isActive", ["isActive"]),

  // --- E-Commerce: Cart ---
  cartItems: defineTable({
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.string()), // for guest carts
    productId: v.id("products"),
    quantity: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_sessionId", ["sessionId"]),

  // --- E-Commerce: Orders ---
  orders: defineTable({
    userId: v.optional(v.id("users")),
    orderNumber: v.string(),
    items: v.array(
      v.object({
        productId: v.id("products"),
        productName: v.string(),
        quantity: v.number(),
        priceAtPurchase: v.number(), // in cents
      })
    ),
    subtotal: v.number(),
    tax: v.number(),
    shipping: v.number(),
    total: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled"),
      v.literal("refunded")
    ),
    stripePaymentIntentId: v.optional(v.string()),
    shippingAddress: v.optional(
      v.object({
        name: v.string(),
        line1: v.string(),
        line2: v.optional(v.string()),
        city: v.string(),
        state: v.string(),
        postalCode: v.string(),
        country: v.string(),
      })
    ),
    customerEmail: v.string(),
    customerName: v.string(),
    customerPhone: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_orderNumber", ["orderNumber"])
    .index("by_status", ["status"])
    .index("by_stripePaymentIntentId", ["stripePaymentIntentId"]),

  // --- Newsletter ---
  newsletterSubscribers: defineTable({
    email: v.string(),
    subscribedAt: v.number(),
    isActive: v.boolean(),
  }).index("by_email", ["email"]),
});

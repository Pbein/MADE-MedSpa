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
    role: v.optional(v.union(v.literal("admin"), v.literal("customer"))),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_authId", ["authId"]),

  // --- Services ---
  services: defineTable({
    name: v.string(),
    slug: v.string(),
    shortDescription: v.string(),
    fullDescription: v.string(),
    category: v.string(),
    duration: v.optional(v.string()),
    priceRange: v.optional(v.string()),
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
    pabauServiceId: v.optional(v.number()),
    pabauBookingUrl: v.optional(v.string()),
    isActive: v.boolean(),
    sortOrder: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"]),

  // --- Contact / Lead Capture ---
  contactSubmissions: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
    source: v.string(),
    status: v.optional(v.union(v.literal("new"), v.literal("read"), v.literal("replied"))),
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

  // --- Team Members ---
  teamMembers: defineTable({
    name: v.string(),
    title: v.string(),
    bio: v.string(),
    imageUrl: v.optional(v.string()),
    sortOrder: v.number(),
    isActive: v.boolean(),
  }),

  // --- Testimonials ---
  testimonials: defineTable({
    name: v.string(),
    quote: v.string(),
    treatment: v.string(),
    sortOrder: v.number(),
    isActive: v.boolean(),
  }),

  // --- Memberships ---
  memberships: defineTable({
    name: v.string(),
    price: v.number(),
    billingPeriod: v.string(),
    tagline: v.string(),
    benefits: v.array(v.string()),
    isFeatured: v.boolean(),
    pabauLink: v.optional(v.string()),
    sortOrder: v.number(),
    isActive: v.boolean(),
    isSeed: v.optional(v.boolean()),
  }),

  // --- Shop Products ---
  shopProducts: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
    imageUrl: v.optional(v.string()),
    pabauLink: v.optional(v.string()),
    sortOrder: v.number(),
    isActive: v.boolean(),
    isSeed: v.optional(v.boolean()),
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

  // --- Newsletter ---
  newsletterSubscribers: defineTable({
    email: v.string(),
    subscribedAt: v.number(),
    isActive: v.boolean(),
  }).index("by_email", ["email"]),
});

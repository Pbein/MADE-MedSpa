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
    // When true, Pabau sync will not overwrite the admin-chosen category.
    categoryLocked: v.optional(v.boolean()),
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
    // Richer content for the public /services/[slug] detail page. All optional
    // so legacy services keep rendering — the page hides each section when
    // its field is empty.
    benefits: v.optional(v.array(v.string())),
    whoItsFor: v.optional(v.string()),
    whatToExpect: v.optional(
      v.array(
        v.object({
          title: v.string(),
          description: v.string(),
        })
      )
    ),
    preCareNotes: v.optional(v.string()),
    postCareNotes: v.optional(v.string()),
    downtime: v.optional(v.string()),
    pabauServiceId: v.optional(v.number()),
    pabauBookingUrl: v.optional(v.string()),
    pabauSyncedAt: v.optional(v.number()),
    isActive: v.boolean(),
    // Mirrors Pabau's `bookable_online` flag (0/1). Treated as `true` when
    // undefined so legacy/manually-created services without a Pabau link still
    // show. Public /services hides anything where this is explicitly false —
    // those are in-office-only items per Karlyne's spreadsheet (e.g. brand-
    // specific filler SKUs). Auto-set by upsertFromPabau on every sync.
    bookableOnline: v.optional(v.boolean()),
    // When true, Pabau sync will not flip isActive back to true. Set by the
    // admin "Hide" toggle. Without this, every 15-min cron undoes manual hides.
    hiddenByAdmin: v.optional(v.boolean()),
    sortOrder: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_pabauServiceId", ["pabauServiceId"]),

  // --- Service Categories (admin-managed) ---
  // Drives the /services filter and the admin services dropdown. Each category
  // owns a list of pabauKeywords used by inferCategory() at sync time, so adding
  // a new category + keyword in admin makes Pabau services auto-bucket on the
  // next sync without a code change.
  serviceCategories: defineTable({
    name: v.string(),                     // Display label, e.g. "Injectables"
    slug: v.string(),                     // Stable id used for service.category match
    sortOrder: v.number(),
    isActive: v.boolean(),
    pabauKeywords: v.array(v.string()),   // lowercase substrings; first match wins by sortOrder
    isDefault: v.optional(v.boolean()),   // fallback bucket when no keyword matches
  })
    .index("by_slug", ["slug"])
    .index("by_active_sortOrder", ["isActive", "sortOrder"]),

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
    pabauProductId: v.optional(v.number()),
    pabauSyncedAt: v.optional(v.number()),
    sortOrder: v.number(),
    isActive: v.boolean(),
    isSeed: v.optional(v.boolean()),
  })
    .index("by_category", ["category"])
    .index("by_pabauProductId", ["pabauProductId"]),

  // --- Site Content (CMS-lite) ---
  siteContent: defineTable({
    key: v.string(),
    title: v.optional(v.string()),
    body: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    metadata: v.optional(v.any()),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),

  // --- Pabau API Usage Tracker ---
  pabauApiUsage: defineTable({
    date: v.string(),
    method: v.union(
      v.literal("GET"),
      v.literal("POST"),
      v.literal("PUT"),
      v.literal("DELETE"),
    ),
    count: v.number(),
    lastCallAt: v.number(),
  }).index("by_date_method", ["date", "method"]),

  // --- Pabau Reviews (mirror) ---
  pabauReviews: defineTable({
    pabauReviewId: v.string(),
    name: v.string(),
    quote: v.string(),
    treatment: v.optional(v.string()),
    rating: v.optional(v.number()),
    pabauCreatedAt: v.number(),
    pabauSyncedAt: v.number(),
    isFeatured: v.boolean(),
    displayOrder: v.number(),
    isHidden: v.boolean(),
  }).index("by_pabauReviewId", ["pabauReviewId"]),

  // --- Pabau Webhook Events ---
  pabauWebhookEvents: defineTable({
    eventId: v.string(),
    entityType: v.string(),
    action: v.union(v.literal("create"), v.literal("update"), v.literal("delete")),
    payload: v.any(),
    receivedAt: v.number(),
    processedAt: v.optional(v.number()),
    status: v.union(
      v.literal("received"),
      v.literal("processed"),
      v.literal("failed"),
      v.literal("ignored"),
    ),
    errorMessage: v.optional(v.string()),
    attempts: v.number(),
  })
    .index("by_eventId", ["eventId"])
    .index("by_status", ["status"])
    .index("by_entity", ["entityType"]),

  // --- Before & After Gallery (admin-managed) ---
  // Each case = one transformation: before + after image, treatment, optional caption.
  // Pabau has no public API for client photos, so this is fully admin-uploaded.
  beforeAfterCases: defineTable({
    title: v.string(),
    treatment: v.string(),
    beforeImageUrl: v.string(),
    afterImageUrl: v.string(),
    beforeAlt: v.optional(v.string()),
    afterAlt: v.optional(v.string()),
    caption: v.optional(v.string()),
    displayOrder: v.number(),
    isFeatured: v.boolean(),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_treatment", ["treatment"])
    .index("by_active_displayOrder", ["isActive", "displayOrder"]),

  // --- Pabau Activity Log ---
  // Lightweight per-event log produced by the webhook handlers. Powers
  // admin-dashboard rolling stats ("X new leads this week", etc.). Distinct
  // from `pabauWebhookEvents` (raw event log) — this is the post-processed,
  // structured view: one row per business-meaningful event with a small
  // payload summary suitable for rendering directly in admin UI.
  pabauActivityLog: defineTable({
    entityType: v.string(),       // "client" | "lead" | "appointment" | "activity" | "invoice"
    action: v.union(v.literal("create"), v.literal("update"), v.literal("delete")),
    pabauEntityId: v.optional(v.string()),   // the Pabau-side entity ID extracted from payload
    pabauEventId: v.string(),                // the dedup key from the event
    occurredAt: v.number(),                  // timestamp from Pabau payload, or receivedAt fallback
    payloadSummary: v.optional(v.any()),     // small subset of payload for admin display (name, email, etc.)
    receivedAt: v.number(),
  })
    .index("by_entity_action", ["entityType", "action"])
    .index("by_occurredAt", ["occurredAt"]),
});

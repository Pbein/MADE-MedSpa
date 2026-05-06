import { query, mutation, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { assertAdmin } from "./lib/auth";
import type { Doc } from "./_generated/dataModel";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const services = await ctx.db
      .query("services")
      .collect();
    return services
      .filter((s) => s.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
});


export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const services = await ctx.db.query("services").collect();
    return services.sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const service = await ctx.db
      .query("services")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    return service;
  },
});

export const listByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const services = await ctx.db
      .query("services")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
    return services
      .filter((s) => s.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    shortDescription: v.string(),
    fullDescription: v.string(),
    category: v.string(),
    duration: v.optional(v.string()),
    priceRange: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    galleryImageUrls: v.optional(v.array(v.string())),
    faqs: v.optional(v.array(v.object({ question: v.string(), answer: v.string() }))),
    pabauServiceId: v.optional(v.number()),
    pabauBookingUrl: v.optional(v.string()),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    const id = await ctx.db.insert("services", {
      ...args,
      isActive: true,
    });
    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("services"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    shortDescription: v.optional(v.string()),
    fullDescription: v.optional(v.string()),
    category: v.optional(v.string()),
    categoryLocked: v.optional(v.boolean()),
    duration: v.optional(v.string()),
    priceRange: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    galleryImageUrls: v.optional(v.array(v.string())),
    faqs: v.optional(v.array(v.object({ question: v.string(), answer: v.string() }))),
    pabauServiceId: v.optional(v.number()),
    pabauBookingUrl: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    const { id, ...fields } = args;
    // Only patch fields that were actually provided
    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }
    // Admin edited the category? Lock it so the next Pabau sync respects it.
    if (fields.category !== undefined && fields.categoryLocked === undefined) {
      updates.categoryLocked = true;
    }
    await ctx.db.patch(id, updates);
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("services") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    await ctx.db.patch(args.id, { isActive: false });
  },
});

export const toggleActive = mutation({
  args: { id: v.id("services") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    const service = await ctx.db.get(args.id);
    if (!service) {
      throw new Error("Service not found");
    }
    await ctx.db.patch(args.id, { isActive: !service.isActive });
  },
});

// --- Pabau sync mutations (internal — invoked by convex/pabauSync.ts only) ---

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Maps a free-text Pabau category string to one of the admin-managed
// categories by keyword match. The admin can edit `pabauKeywords` per
// category in /admin/categories — no code change needed to retag.
// First active category whose keyword list matches wins (sortOrder order).
// Falls back to the category flagged isDefault, or "Body" if none.
function inferCategory(
  pabauCategory: string | undefined,
  categories: Doc<"serviceCategories">[],
): string {
  const c = (pabauCategory ?? "").toLowerCase();
  for (const cat of categories) {
    if (cat.pabauKeywords.some((kw) => kw && c.includes(kw))) {
      return cat.name;
    }
  }
  const fallback = categories.find((cat) => cat.isDefault);
  return fallback?.name ?? "Body";
}

export const listAllInternal = internalQuery({
  args: {},
  handler: async (ctx) => ctx.db.query("services").collect(),
});

export const upsertFromPabau = internalMutation({
  args: {
    pabauServiceId: v.number(),
    name: v.string(),
    description: v.optional(v.string()),
    pabauCategory: v.optional(v.string()),
    duration: v.optional(v.string()),
    priceRange: v.optional(v.string()),
    bookingUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("services")
      .withIndex("by_pabauServiceId", (q) => q.eq("pabauServiceId", args.pabauServiceId))
      .first();

    const allCats = await ctx.db.query("serviceCategories").collect();
    const activeCats = allCats
      .filter((c) => c.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    const now = Date.now();
    if (existing) {
      // Respect admin-locked category overrides; otherwise re-infer from Pabau.
      const nextCategory = existing.categoryLocked
        ? existing.category
        : inferCategory(args.pabauCategory, activeCats);

      await ctx.db.patch(existing._id, {
        name: args.name,
        shortDescription:
          args.description?.slice(0, 200) ?? existing.shortDescription,
        fullDescription: args.description ?? existing.fullDescription,
        category: nextCategory,
        duration: args.duration ?? existing.duration,
        priceRange: args.priceRange ?? existing.priceRange,
        pabauBookingUrl: args.bookingUrl ?? existing.pabauBookingUrl,
        pabauSyncedAt: now,
        isActive: true,
      });
      return { id: existing._id, action: "updated" as const };
    }

    const all = await ctx.db.query("services").collect();
    const maxOrder = all.reduce((m, s) => Math.max(m, s.sortOrder), 0);

    const id = await ctx.db.insert("services", {
      name: args.name,
      slug: slugify(args.name) || `service-${args.pabauServiceId}`,
      shortDescription: args.description?.slice(0, 200) ?? args.name,
      fullDescription: args.description ?? args.name,
      category: inferCategory(args.pabauCategory, activeCats),
      categoryLocked: false,
      duration: args.duration,
      priceRange: args.priceRange,
      pabauServiceId: args.pabauServiceId,
      pabauBookingUrl: args.bookingUrl,
      pabauSyncedAt: now,
      isActive: true,
      sortOrder: maxOrder + 1,
    });
    return { id, action: "created" as const };
  },
});

export const softDeleteByPabauId = internalMutation({
  args: { pabauServiceId: v.number() },
  handler: async (ctx, { pabauServiceId }) => {
    const existing = await ctx.db
      .query("services")
      .withIndex("by_pabauServiceId", (q) => q.eq("pabauServiceId", pabauServiceId))
      .first();
    if (!existing) return { removed: false };
    if (!existing.isActive) return { removed: false };
    await ctx.db.patch(existing._id, { isActive: false, pabauSyncedAt: Date.now() });
    return { removed: true };
  },
});

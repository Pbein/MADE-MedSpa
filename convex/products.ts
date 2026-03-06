import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("products")
      .collect();
    return products
      .filter((p) => p.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
});


export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("products")
      .collect();
    return products.sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    return product;
  },
});

export const listByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
    return products
      .filter((p) => p.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const listFeatured = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("products")
      .collect();
    return products
      .filter((p) => p.isActive && p.isFeatured)
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
    price: v.number(),
    compareAtPrice: v.optional(v.number()),
    sku: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    galleryImageUrls: v.optional(v.array(v.string())),
    inventory: v.number(),
    isFeatured: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("products", {
      ...args,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    shortDescription: v.optional(v.string()),
    fullDescription: v.optional(v.string()),
    category: v.optional(v.string()),
    price: v.optional(v.number()),
    compareAtPrice: v.optional(v.number()),
    sku: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    galleryImageUrls: v.optional(v.array(v.string())),
    inventory: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("Product not found.");
    }
    // Filter out undefined values so we only patch provided fields
    const updates: Record<string, unknown> = { updatedAt: Date.now() };
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }
    await ctx.db.patch(id, updates);
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Product not found.");
    }
    await ctx.db.patch(args.id, {
      isActive: false,
      updatedAt: Date.now(),
    });
    return args.id;
  },
});

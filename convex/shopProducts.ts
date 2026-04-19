import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("shopProducts").collect();
    return products
      .filter((p) => p.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("shopProducts").collect();
    return products.sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const listByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("shopProducts")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
    return products
      .filter((p) => p.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
    imageUrl: v.optional(v.string()),
    pabauLink: v.optional(v.string()),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("shopProducts", {
      ...args,
      isActive: true,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("shopProducts"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    category: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    pabauLink: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const updates: Record<string, unknown> = { isSeed: false };
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
  args: { id: v.id("shopProducts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const countSeed = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("shopProducts").collect();
    return all.filter((p) => p.isSeed).length;
  },
});

export const toggleActive = mutation({
  args: { id: v.id("shopProducts") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product) throw new Error("Product not found");
    await ctx.db.patch(args.id, { isActive: !product.isActive });
  },
});

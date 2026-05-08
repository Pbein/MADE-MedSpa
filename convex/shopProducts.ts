import { query, mutation, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { assertAdmin } from "./lib/auth";

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

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Looks up a product by either its Convex _id or a name-derived slug.
// Lets product detail pages use pretty URLs (/shop/epicutis-lipid-serum)
// without requiring a schema migration to add a slug field. Slugs are
// generated on the fly from product.name.
export const getBySlugOrId = query({
  args: { slugOrId: v.string() },
  handler: async (ctx, args) => {
    // First try treating it as an _id.
    const normalizedId = ctx.db.normalizeId("shopProducts", args.slugOrId);
    if (normalizedId) {
      const byId = await ctx.db.get(normalizedId);
      if (byId?.isActive) return byId;
    }

    // Fallback: scan active products and match against slugified name.
    const all = await ctx.db.query("shopProducts").collect();
    return (
      all.find((p) => p.isActive && slugify(p.name) === args.slugOrId) ?? null
    );
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
    await assertAdmin(ctx);
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
    await assertAdmin(ctx);
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
    await assertAdmin(ctx);
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
    await assertAdmin(ctx);
    const product = await ctx.db.get(args.id);
    if (!product) throw new Error("Product not found");
    await ctx.db.patch(args.id, { isActive: !product.isActive });
  },
});

// --- Pabau sync mutations (internal — invoked by convex/pabauSync.ts only) ---

function inferProductCategory(pabauCategory: string | undefined): string {
  const c = (pabauCategory ?? "").toLowerCase();
  if (c.includes("skin") || c.includes("serum") || c.includes("cream")) return "Skincare";
  if (c.includes("supp") || c.includes("vitamin")) return "Supplements";
  if (c.includes("device") || c.includes("tool")) return "Tools";
  return "Skincare";
}

export const listAllInternal = internalQuery({
  args: {},
  handler: async (ctx) => ctx.db.query("shopProducts").collect(),
});

export const upsertFromPabau = internalMutation({
  args: {
    pabauProductId: v.number(),
    name: v.string(),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    pabauCategory: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("shopProducts")
      .withIndex("by_pabauProductId", (q) => q.eq("pabauProductId", args.pabauProductId))
      .first();

    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        description: args.description ?? existing.description,
        price: args.price ?? existing.price,
        pabauSyncedAt: now,
        isActive: true,
        isSeed: false,
      });
      return { id: existing._id, action: "updated" as const };
    }

    const all = await ctx.db.query("shopProducts").collect();
    const maxOrder = all.reduce((m, p) => Math.max(m, p.sortOrder), 0);

    const id = await ctx.db.insert("shopProducts", {
      name: args.name,
      description: args.description ?? args.name,
      price: args.price ?? 0,
      category: inferProductCategory(args.pabauCategory),
      pabauProductId: args.pabauProductId,
      pabauSyncedAt: now,
      sortOrder: maxOrder + 1,
      isActive: true,
    });
    return { id, action: "created" as const };
  },
});

export const softDeleteByPabauId = internalMutation({
  args: { pabauProductId: v.number() },
  handler: async (ctx, { pabauProductId }) => {
    const existing = await ctx.db
      .query("shopProducts")
      .withIndex("by_pabauProductId", (q) => q.eq("pabauProductId", pabauProductId))
      .first();
    if (!existing) return { removed: false };
    if (!existing.isActive) return { removed: false };
    await ctx.db.patch(existing._id, { isActive: false, pabauSyncedAt: Date.now() });
    return { removed: true };
  },
});

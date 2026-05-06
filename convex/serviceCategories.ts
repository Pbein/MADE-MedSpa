import { query, mutation, internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { assertAdmin } from "./lib/auth";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Public — used by the /services filter bar.
export const listActive = query({
  args: {},
  handler: async (ctx) => {
    const cats = await ctx.db.query("serviceCategories").collect();
    return cats
      .filter((c) => c.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

// Admin — full list including inactive.
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    await assertAdmin(ctx);
    const cats = await ctx.db.query("serviceCategories").collect();
    return cats.sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    pabauKeywords: v.array(v.string()),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    const all = await ctx.db.query("serviceCategories").collect();
    const maxOrder = all.reduce((m, c) => Math.max(m, c.sortOrder), 0);

    const baseSlug = slugify(args.name) || `category-${Date.now()}`;
    let slug = baseSlug;
    let i = 1;
    while (all.some((c) => c.slug === slug)) {
      slug = `${baseSlug}-${i++}`;
    }

    // Only one default at a time — clear others if this one is being marked default.
    if (args.isDefault) {
      for (const c of all) {
        if (c.isDefault) await ctx.db.patch(c._id, { isDefault: false });
      }
    }

    return await ctx.db.insert("serviceCategories", {
      name: args.name.trim(),
      slug,
      sortOrder: maxOrder + 1,
      isActive: true,
      pabauKeywords: args.pabauKeywords.map((k) => k.trim().toLowerCase()).filter(Boolean),
      isDefault: args.isDefault ?? false,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("serviceCategories"),
    name: v.optional(v.string()),
    pabauKeywords: v.optional(v.array(v.string())),
    sortOrder: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    const { id, ...fields } = args;

    if (fields.isDefault) {
      const all = await ctx.db.query("serviceCategories").collect();
      for (const c of all) {
        if (c._id !== id && c.isDefault) {
          await ctx.db.patch(c._id, { isDefault: false });
        }
      }
    }

    const updates: Record<string, unknown> = {};
    if (fields.name !== undefined) updates.name = fields.name.trim();
    if (fields.pabauKeywords !== undefined) {
      updates.pabauKeywords = fields.pabauKeywords
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean);
    }
    if (fields.sortOrder !== undefined) updates.sortOrder = fields.sortOrder;
    if (fields.isActive !== undefined) updates.isActive = fields.isActive;
    if (fields.isDefault !== undefined) updates.isDefault = fields.isDefault;

    await ctx.db.patch(id, updates);
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("serviceCategories") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    // Soft-delete by deactivating, so existing services keep a stable category
    // string. Hard delete only if the admin truly wants it gone — handled below.
    await ctx.db.patch(args.id, { isActive: false });
  },
});

export const hardDelete = mutation({
  args: { id: v.id("serviceCategories") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});

// Bulk reorder — admin sends new sortOrder for each id in one call.
export const reorder = mutation({
  args: {
    items: v.array(v.object({ id: v.id("serviceCategories"), sortOrder: v.number() })),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    for (const item of args.items) {
      await ctx.db.patch(item.id, { sortOrder: item.sortOrder });
    }
  },
});

// Internal — read by services.ts inferCategory() at Pabau sync time.
export const listForInfer = internalQuery({
  args: {},
  handler: async (ctx) => {
    const cats = await ctx.db.query("serviceCategories").collect();
    return cats
      .filter((c) => c.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

// Idempotent — safe to call repeatedly. Seeds the four legacy buckets the
// site shipped with so first-load admins see something to edit instead of an
// empty table. Skips any slug that already exists.
export const seedDefaults = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("serviceCategories").collect();
    const existingSlugs = new Set(existing.map((c) => c.slug));

    const defaults = [
      {
        slug: "injectables",
        name: "Injectables",
        sortOrder: 1,
        pabauKeywords: ["inject", "filler", "botox", "tox"],
        isDefault: false,
      },
      {
        slug: "skin",
        name: "Skin",
        sortOrder: 2,
        pabauKeywords: ["skin", "acne", "rejuvenation", "peel"],
        isDefault: false,
      },
      {
        slug: "body",
        name: "Body",
        sortOrder: 3,
        pabauKeywords: [],
        isDefault: true,
      },
      {
        slug: "wellness",
        name: "Wellness",
        sortOrder: 4,
        pabauKeywords: ["wellness", "iv", "vitamin"],
        isDefault: false,
      },
    ];

    let created = 0;
    for (const d of defaults) {
      if (existingSlugs.has(d.slug)) continue;
      await ctx.db.insert("serviceCategories", {
        ...d,
        isActive: true,
      });
      created++;
    }
    return { created };
  },
});

// Admin-callable wrapper for the seed — lets the admin UI run it on first load.
export const seedDefaultsAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    await assertAdmin(ctx);
    const existing = await ctx.db.query("serviceCategories").collect();
    const existingSlugs = new Set(existing.map((c) => c.slug));

    const defaults = [
      { slug: "injectables", name: "Injectables", sortOrder: 1, pabauKeywords: ["inject", "filler", "botox", "tox"], isDefault: false },
      { slug: "skin", name: "Skin", sortOrder: 2, pabauKeywords: ["skin", "acne", "rejuvenation", "peel"], isDefault: false },
      { slug: "body", name: "Body", sortOrder: 3, pabauKeywords: [], isDefault: true },
      { slug: "wellness", name: "Wellness", sortOrder: 4, pabauKeywords: ["wellness", "iv", "vitamin"], isDefault: false },
    ];

    let created = 0;
    for (const d of defaults) {
      if (existingSlugs.has(d.slug)) continue;
      await ctx.db.insert("serviceCategories", { ...d, isActive: true });
      created++;
    }
    return { created };
  },
});

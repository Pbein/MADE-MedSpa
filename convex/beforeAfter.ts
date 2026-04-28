import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { assertAdmin } from "./lib/auth";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("beforeAfterCases").collect();
    return all
      .filter((c) => c.isActive)
      .sort((a, b) => {
        if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
        if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
        return b.createdAt - a.createdAt;
      });
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("beforeAfterCases").collect();
    return all.sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
      return b.createdAt - a.createdAt;
    });
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    treatment: v.string(),
    beforeImageUrl: v.string(),
    afterImageUrl: v.string(),
    beforeAlt: v.optional(v.string()),
    afterAlt: v.optional(v.string()),
    caption: v.optional(v.string()),
    displayOrder: v.optional(v.number()),
    isFeatured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    const all = await ctx.db.query("beforeAfterCases").collect();
    const maxOrder = all.reduce((m, c) => Math.max(m, c.displayOrder), 0);
    return await ctx.db.insert("beforeAfterCases", {
      title: args.title,
      treatment: args.treatment,
      beforeImageUrl: args.beforeImageUrl,
      afterImageUrl: args.afterImageUrl,
      beforeAlt: args.beforeAlt,
      afterAlt: args.afterAlt,
      caption: args.caption,
      displayOrder: args.displayOrder ?? maxOrder + 1,
      isFeatured: args.isFeatured ?? false,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("beforeAfterCases"),
    title: v.optional(v.string()),
    treatment: v.optional(v.string()),
    beforeImageUrl: v.optional(v.string()),
    afterImageUrl: v.optional(v.string()),
    beforeAlt: v.optional(v.string()),
    afterAlt: v.optional(v.string()),
    caption: v.optional(v.string()),
    displayOrder: v.optional(v.number()),
    isFeatured: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    const { id, ...fields } = args;
    const updates: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(fields)) {
      if (val !== undefined) updates[k] = val;
    }
    await ctx.db.patch(id, updates);
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("beforeAfterCases") },
  handler: async (ctx, { id }) => {
    await assertAdmin(ctx);
    await ctx.db.patch(id, { isActive: false });
  },
});

export const toggleFeatured = mutation({
  args: { id: v.id("beforeAfterCases") },
  handler: async (ctx, { id }) => {
    await assertAdmin(ctx);
    const row = await ctx.db.get(id);
    if (!row) throw new Error("Case not found");
    await ctx.db.patch(id, { isFeatured: !row.isFeatured });
  },
});

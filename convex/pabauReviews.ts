import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { assertAdmin } from "./lib/auth";

export const listVisible = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("pabauReviews").collect();
    return all
      .filter((r) => !r.isHidden)
      .sort((a, b) => {
        if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
        if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
        return b.pabauCreatedAt - a.pabauCreatedAt;
      });
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("pabauReviews").collect();
    return all.sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
      return b.pabauCreatedAt - a.pabauCreatedAt;
    });
  },
});

export const setFeatured = mutation({
  args: { id: v.id("pabauReviews"), isFeatured: v.boolean() },
  handler: async (ctx, { id, isFeatured }) => {
    await assertAdmin(ctx);
    await ctx.db.patch(id, { isFeatured });
  },
});

export const setHidden = mutation({
  args: { id: v.id("pabauReviews"), isHidden: v.boolean() },
  handler: async (ctx, { id, isHidden }) => {
    await assertAdmin(ctx);
    await ctx.db.patch(id, { isHidden });
  },
});

export const setDisplayOrder = mutation({
  args: { id: v.id("pabauReviews"), displayOrder: v.number() },
  handler: async (ctx, { id, displayOrder }) => {
    await assertAdmin(ctx);
    await ctx.db.patch(id, { displayOrder });
  },
});

// Sync-only writes — called from server-side sync logic. Never overwrites curation flags.
export const upsertFromPabau = internalMutation({
  args: {
    pabauReviewId: v.string(),
    name: v.string(),
    quote: v.string(),
    treatment: v.optional(v.string()),
    rating: v.optional(v.number()),
    pabauCreatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("pabauReviews")
      .withIndex("by_pabauReviewId", (q) => q.eq("pabauReviewId", args.pabauReviewId))
      .first();

    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        quote: args.quote,
        treatment: args.treatment,
        rating: args.rating,
        pabauCreatedAt: args.pabauCreatedAt,
        pabauSyncedAt: now,
      });
      return { id: existing._id, action: "updated" as const };
    }

    const all = await ctx.db.query("pabauReviews").collect();
    const maxOrder = all.reduce((m, r) => Math.max(m, r.displayOrder), 0);

    const id = await ctx.db.insert("pabauReviews", {
      ...args,
      pabauSyncedAt: now,
      isFeatured: false,
      displayOrder: maxOrder + 1,
      isHidden: false,
    });
    return { id, action: "created" as const };
  },
});

export const removeByPabauId = internalMutation({
  args: { pabauReviewId: v.string() },
  handler: async (ctx, { pabauReviewId }) => {
    const existing = await ctx.db
      .query("pabauReviews")
      .withIndex("by_pabauReviewId", (q) => q.eq("pabauReviewId", pabauReviewId))
      .first();
    if (!existing) return { removed: false };
    await ctx.db.delete(existing._id);
    return { removed: true };
  },
});

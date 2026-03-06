import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const tiers = await ctx.db
      .query("membershipTiers")
      .collect();
    return tiers
      .filter((t) => t.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const tiers = await ctx.db
      .query("membershipTiers")
      .collect();
    return tiers.sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const tier = await ctx.db
      .query("membershipTiers")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    return tier;
  },
});

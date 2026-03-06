import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByKey = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const content = await ctx.db
      .query("siteContent")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
    return content;
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("siteContent").collect();
  },
});

export const upsert = mutation({
  args: {
    key: v.string(),
    title: v.optional(v.string()),
    body: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { key, ...fields } = args;
    const existing = await ctx.db
      .query("siteContent")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();

    const updates: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(fields)) {
      if (val !== undefined) {
        updates[k] = val;
      }
    }
    updates.updatedAt = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, updates);
      return existing._id;
    } else {
      const id = await ctx.db.insert("siteContent", {
        key,
        ...updates,
        updatedAt: Date.now(),
      });
      return id;
    }
  },
});

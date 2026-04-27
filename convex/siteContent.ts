import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { assertAdmin } from "./lib/auth";

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

export const getByKeys = query({
  args: { keys: v.array(v.string()) },
  handler: async (ctx, args) => {
    const results: Record<string, { key: string; imageUrl?: string; title?: string; body?: string } | null> = {};
    await Promise.all(
      args.keys.map(async (key) => {
        const content = await ctx.db
          .query("siteContent")
          .withIndex("by_key", (q) => q.eq("key", key))
          .first();
        results[key] = content;
      })
    );
    return results;
  },
});

export const getByPrefix = query({
  args: { prefix: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("siteContent").collect();
    return all.filter((r) => r.key.startsWith(args.prefix));
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
    await assertAdmin(ctx);
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

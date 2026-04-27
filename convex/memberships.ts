import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { assertAdmin } from "./lib/auth";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const memberships = await ctx.db.query("memberships").collect();
    return memberships
      .filter((m) => m.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const memberships = await ctx.db.query("memberships").collect();
    return memberships.sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    price: v.number(),
    billingPeriod: v.string(),
    tagline: v.string(),
    benefits: v.array(v.string()),
    isFeatured: v.boolean(),
    pabauLink: v.optional(v.string()),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    return await ctx.db.insert("memberships", {
      ...args,
      isActive: true,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("memberships"),
    name: v.optional(v.string()),
    price: v.optional(v.number()),
    billingPeriod: v.optional(v.string()),
    tagline: v.optional(v.string()),
    benefits: v.optional(v.array(v.string())),
    isFeatured: v.optional(v.boolean()),
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
  args: { id: v.id("memberships") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});

export const countSeed = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("memberships").collect();
    return all.filter((m) => m.isSeed).length;
  },
});

export const toggleActive = mutation({
  args: { id: v.id("memberships") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    const membership = await ctx.db.get(args.id);
    if (!membership) throw new Error("Membership not found");
    await ctx.db.patch(args.id, { isActive: !membership.isActive });
  },
});

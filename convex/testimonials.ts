import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { assertAdmin } from "./lib/auth";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const testimonials = await ctx.db.query("testimonials").collect();
    return testimonials
      .filter((t) => t.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const testimonials = await ctx.db.query("testimonials").collect();
    return testimonials.sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    quote: v.string(),
    treatment: v.string(),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    return await ctx.db.insert("testimonials", {
      ...args,
      isActive: true,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("testimonials"),
    name: v.optional(v.string()),
    quote: v.optional(v.string()),
    treatment: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    const { id, ...fields } = args;
    const updates: Record<string, unknown> = {};
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
  args: { id: v.id("testimonials") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});

export const toggleActive = mutation({
  args: { id: v.id("testimonials") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    const testimonial = await ctx.db.get(args.id);
    if (!testimonial) throw new Error("Testimonial not found");
    await ctx.db.patch(args.id, { isActive: !testimonial.isActive });
  },
});

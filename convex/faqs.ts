import { query, mutation } from "./_generated/server";
import { v } from "convex/values";


export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const faqs = await ctx.db.query("faqs").collect();
    return faqs.sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const faqs = await ctx.db
      .query("faqs")
      .collect();
    return faqs
      .filter((f) => f.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const listByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const faqs = await ctx.db
      .query("faqs")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
    return faqs
      .filter((f) => f.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const create = mutation({
  args: {
    question: v.string(),
    answer: v.string(),
    category: v.optional(v.string()),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("faqs", {
      ...args,
      isActive: true,
    });
    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("faqs"),
    question: v.optional(v.string()),
    answer: v.optional(v.string()),
    category: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
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
  args: { id: v.id("faqs") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const toggleActive = mutation({
  args: { id: v.id("faqs") },
  handler: async (ctx, args) => {
    const faq = await ctx.db.get(args.id);
    if (!faq) {
      throw new Error("FAQ not found");
    }
    await ctx.db.patch(args.id, { isActive: !faq.isActive });
  },
});

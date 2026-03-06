import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const subscribe = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      throw new Error("A valid email is required.");
    }

    // Check for duplicate
    const existing = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("newsletterSubscribers", {
      email,
      subscribedAt: Date.now(),
      isActive: true,
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("newsletterSubscribers")
      .collect()
      .then((subs) => subs.filter((s) => s.isActive));
  },
});

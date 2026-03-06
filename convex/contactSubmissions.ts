import { mutation, query } from "./_generated/server";
import { v } from "convex/values";


export const list = query({
  args: {},
  handler: async (ctx) => {
    const submissions = await ctx.db.query("contactSubmissions").collect();
    return submissions.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const create = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    const trimmedEmail = args.email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      throw new Error("A valid email address is required.");
    }
    if (!args.firstName.trim()) {
      throw new Error("First name is required.");
    }
    if (!args.lastName.trim()) {
      throw new Error("Last name is required.");
    }
    if (!args.message.trim()) {
      throw new Error("Message is required.");
    }

    const id = await ctx.db.insert("contactSubmissions", {
      firstName: args.firstName.trim(),
      lastName: args.lastName.trim(),
      email: trimmedEmail,
      phone: args.phone?.trim() || undefined,
      message: args.message.trim(),
      source: args.source,
      createdAt: Date.now(),
    });
    return id;
  },
});

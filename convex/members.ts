import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const memberStatus = v.union(
  v.literal("pending"),
  v.literal("active"),
  v.literal("past_due"),
  v.literal("cancelled"),
  v.literal("expired")
);

export const getByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("members")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const getByStripeSubscriptionId = query({
  args: { stripeSubscriptionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("members")
      .withIndex("by_stripeSubscriptionId", (q) =>
        q.eq("stripeSubscriptionId", args.stripeSubscriptionId)
      )
      .first();
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("members").collect();
  },
});

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("members")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();
  },
});

export const listByStatus = query({
  args: { status: memberStatus },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("members")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

export const create = mutation({
  args: {
    userId: v.id("users"),
    tierId: v.id("membershipTiers"),
    status: memberStatus,
    stripeSubscriptionId: v.optional(v.string()),
    commitmentStartDate: v.number(),
    commitmentEndDate: v.number(),
    termsAcceptedAt: v.number(),
    termsVersion: v.string(),
    termsIpAddress: v.string(),
    nextBillingDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("members", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("members"),
    status: memberStatus,
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const updateSubscription = mutation({
  args: {
    id: v.id("members"),
    stripeSubscriptionId: v.string(),
    nextBillingDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      stripeSubscriptionId: args.stripeSubscriptionId,
      ...(args.nextBillingDate !== undefined
        ? { nextBillingDate: args.nextBillingDate }
        : {}),
    });
  },
});

export const updateTier = mutation({
  args: {
    id: v.id("members"),
    tierId: v.id("membershipTiers"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { tierId: args.tierId });
  },
});

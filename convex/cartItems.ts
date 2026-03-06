import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("cartItems")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    return items;
  },
});

export const listBySession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("cartItems")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .collect();
    return items;
  },
});

export const add = mutation({
  args: {
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.string()),
    productId: v.id("products"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    if (!args.userId && !args.sessionId) {
      throw new Error("Either userId or sessionId is required.");
    }
    if (args.quantity < 1) {
      throw new Error("Quantity must be at least 1.");
    }

    // Check for existing cart item with same product
    let existing = null;
    if (args.userId) {
      const userItems = await ctx.db
        .query("cartItems")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .collect();
      existing = userItems.find((item) => item.productId === args.productId);
    } else if (args.sessionId) {
      const sessionItems = await ctx.db
        .query("cartItems")
        .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
        .collect();
      existing = sessionItems.find((item) => item.productId === args.productId);
    }

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        quantity: existing.quantity + args.quantity,
        updatedAt: now,
      });
      return existing._id;
    }

    const id = await ctx.db.insert("cartItems", {
      userId: args.userId,
      sessionId: args.sessionId,
      productId: args.productId,
      quantity: args.quantity,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  },
});

export const updateQuantity = mutation({
  args: {
    id: v.id("cartItems"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    if (args.quantity < 1) {
      throw new Error("Quantity must be at least 1.");
    }
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Cart item not found.");
    }
    await ctx.db.patch(args.id, {
      quantity: args.quantity,
      updatedAt: Date.now(),
    });
    return args.id;
  },
});

export const remove = mutation({
  args: { id: v.id("cartItems") },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Cart item not found.");
    }
    await ctx.db.delete(args.id);
  },
});

export const clearCart = mutation({
  args: {
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.userId && !args.sessionId) {
      throw new Error("Either userId or sessionId is required.");
    }

    let items: Array<{ _id: any }> = [];
    if (args.userId) {
      items = await ctx.db
        .query("cartItems")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .collect();
    } else if (args.sessionId) {
      items = await ctx.db
        .query("cartItems")
        .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
        .collect();
    }

    for (const item of items) {
      await ctx.db.delete(item._id);
    }
  },
});

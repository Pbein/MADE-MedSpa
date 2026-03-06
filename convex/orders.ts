import { query, mutation } from "./_generated/server";
import { v } from "convex/values";


export const list = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    return orders.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getByStripePaymentIntentId = query({
  args: { stripePaymentIntentId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_stripePaymentIntentId", (q) =>
        q.eq("stripePaymentIntentId", args.stripePaymentIntentId)
      )
      .first();
  },
});

export const listByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    return orders.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getByOrderNumber = query({
  args: { orderNumber: v.string() },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_orderNumber", (q) => q.eq("orderNumber", args.orderNumber))
      .first();
    return order;
  },
});

export const create = mutation({
  args: {
    userId: v.optional(v.id("users")),
    orderNumber: v.string(),
    items: v.array(
      v.object({
        productId: v.id("products"),
        productName: v.string(),
        quantity: v.number(),
        priceAtPurchase: v.number(),
      })
    ),
    subtotal: v.number(),
    tax: v.number(),
    shipping: v.number(),
    total: v.number(),
    stripePaymentIntentId: v.optional(v.string()),
    shippingAddress: v.optional(
      v.object({
        name: v.string(),
        line1: v.string(),
        line2: v.optional(v.string()),
        city: v.string(),
        state: v.string(),
        postalCode: v.string(),
        country: v.string(),
      })
    ),
    customerEmail: v.string(),
    customerName: v.string(),
    customerPhone: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.customerEmail.trim() || !args.customerEmail.includes("@")) {
      throw new Error("A valid customer email is required.");
    }
    if (!args.customerName.trim()) {
      throw new Error("Customer name is required.");
    }
    if (args.items.length === 0) {
      throw new Error("Order must contain at least one item.");
    }

    const now = Date.now();
    const id = await ctx.db.insert("orders", {
      ...args,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });
    return id;
  },
});

export const updateNotes = mutation({
  args: {
    id: v.id("orders"),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Order not found.");
    }
    await ctx.db.patch(args.id, {
      notes: args.notes,
      updatedAt: Date.now(),
    });
    return args.id;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled"),
      v.literal("refunded")
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Order not found.");
    }
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
    return args.id;
  },
});

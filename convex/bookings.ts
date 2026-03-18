import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const bookings = await ctx.db.query("bookings").collect();
    return bookings.sort((a, b) => b.startTime - a.startTime);
  },
});

export const getByCalBookingId = query({
  args: { calBookingId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bookings")
      .withIndex("by_calBookingId", (q) => q.eq("calBookingId", args.calBookingId))
      .first();
  },
});

export const listByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    return bookings.sort((a, b) => b.startTime - a.startTime);
  },
});

export const listUpcoming = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_startTime")
      .collect();
    return bookings
      .filter((b) => b.startTime > now && b.status === "confirmed")
      .sort((a, b) => a.startTime - b.startTime);
  },
});

export const create = mutation({
  args: {
    calBookingId: v.string(),
    calEventTypeSlug: v.optional(v.string()),
    serviceId: v.optional(v.id("services")),
    userId: v.optional(v.id("users")),
    guestName: v.string(),
    guestEmail: v.string(),
    guestPhone: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.number(),
    status: v.union(
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("rescheduled"),
      v.literal("completed"),
      v.literal("no_show")
    ),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bookings", args);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("bookings"),
    status: v.union(
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("rescheduled"),
      v.literal("completed"),
      v.literal("no_show")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const markReminderSent = mutation({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { reminderSentAt: Date.now() });
  },
});

export const updateNotes = mutation({
  args: {
    id: v.id("bookings"),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { notes: args.notes });
  },
});

export const markReviewRequestSent = mutation({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { reviewRequestSentAt: Date.now() });
  },
});

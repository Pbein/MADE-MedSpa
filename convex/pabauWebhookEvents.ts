import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { assertAdmin } from "./lib/auth";

const ACTION = v.union(v.literal("create"), v.literal("update"), v.literal("delete"));
const STATUS = v.union(
  v.literal("received"),
  v.literal("processed"),
  v.literal("failed"),
  v.literal("ignored"),
);

export const findByEventId = query({
  args: { eventId: v.string() },
  handler: async (ctx, { eventId }) => {
    return await ctx.db
      .query("pabauWebhookEvents")
      .withIndex("by_eventId", (q) => q.eq("eventId", eventId))
      .first();
  },
});

export const insert = mutation({
  args: {
    eventId: v.string(),
    entityType: v.string(),
    action: ACTION,
    payload: v.any(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("pabauWebhookEvents")
      .withIndex("by_eventId", (q) => q.eq("eventId", args.eventId))
      .first();
    if (existing) return { id: existing._id, duplicate: true };

    const id = await ctx.db.insert("pabauWebhookEvents", {
      ...args,
      receivedAt: Date.now(),
      status: "received",
      attempts: 0,
    });
    return { id, duplicate: false };
  },
});

export const markProcessed = mutation({
  args: { id: v.id("pabauWebhookEvents") },
  handler: async (ctx, { id }) => {
    const row = await ctx.db.get(id);
    if (!row) return;
    await ctx.db.patch(id, {
      status: "processed",
      processedAt: Date.now(),
      attempts: row.attempts + 1,
      errorMessage: undefined,
    });
  },
});

export const markFailed = mutation({
  args: { id: v.id("pabauWebhookEvents"), errorMessage: v.string() },
  handler: async (ctx, { id, errorMessage }) => {
    const row = await ctx.db.get(id);
    if (!row) return;
    await ctx.db.patch(id, {
      status: "failed",
      processedAt: Date.now(),
      attempts: row.attempts + 1,
      errorMessage,
    });
  },
});

export const markIgnored = mutation({
  args: { id: v.id("pabauWebhookEvents"), reason: v.string() },
  handler: async (ctx, { id, reason }) => {
    const row = await ctx.db.get(id);
    if (!row) return;
    await ctx.db.patch(id, {
      status: "ignored",
      processedAt: Date.now(),
      attempts: row.attempts + 1,
      errorMessage: reason,
    });
  },
});

export const list = query({
  args: {
    limit: v.optional(v.number()),
    status: v.optional(STATUS),
    entityType: v.optional(v.string()),
  },
  handler: async (ctx, { limit = 100, status, entityType }) => {
    let cursor;
    if (status) {
      cursor = ctx.db.query("pabauWebhookEvents").withIndex("by_status", (q) => q.eq("status", status));
    } else if (entityType) {
      cursor = ctx.db
        .query("pabauWebhookEvents")
        .withIndex("by_entity", (q) => q.eq("entityType", entityType));
    } else {
      cursor = ctx.db.query("pabauWebhookEvents");
    }
    const rows = await cursor.order("desc").take(limit);
    return rows;
  },
});

export const stats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("pabauWebhookEvents").collect();
    const byStatus = { received: 0, processed: 0, failed: 0, ignored: 0 };
    let lastReceivedAt = 0;
    for (const row of all) {
      byStatus[row.status]++;
      if (row.receivedAt > lastReceivedAt) lastReceivedAt = row.receivedAt;
    }
    return { total: all.length, byStatus, lastReceivedAt };
  },
});

export const requeue = mutation({
  args: { id: v.id("pabauWebhookEvents") },
  handler: async (ctx, { id }) => {
    await assertAdmin(ctx);
    const row = await ctx.db.get(id);
    if (!row) throw new Error("Event not found.");
    await ctx.db.patch(id, {
      status: "received",
      processedAt: undefined,
      errorMessage: undefined,
    });
  },
});

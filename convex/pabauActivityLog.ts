import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const ACTION = v.union(
  v.literal("create"),
  v.literal("update"),
  v.literal("delete"),
);

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Mutation invoked from the Pabau webhook handlers (Next.js side) via the
 * ConvexHttpClient using `api.pabauActivityLog.insertEvent`.
 *
 * No auth check on purpose — calls are gated by webhook URL token verification
 * at the route layer (`/api/pabau/webhooks/[token]`). This mirrors the public
 * `pabauWebhookEvents.insert` pattern used by the same route. No `assertAdmin`.
 */
export const insertEvent = mutation({
  args: {
    entityType: v.string(),
    action: ACTION,
    pabauEntityId: v.optional(v.string()),
    pabauEventId: v.string(),
    occurredAt: v.number(),
    payloadSummary: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("pabauActivityLog", {
      ...args,
      receivedAt: Date.now(),
    });
    return { id };
  },
});

/**
 * Recent activity for a single entityType. Default window: last 7 days.
 * Public-readable (aggregated activity, no PII beyond what was supplied
 * in the webhook payload summary). Admin dashboard reads this server-side
 * via Clerk-authenticated routes — no `assertAdmin` needed here.
 */
export const recentByEntity = query({
  args: {
    entityType: v.string(),
    since: v.optional(v.number()),
  },
  handler: async (ctx, { entityType, since }) => {
    const cutoff = since ?? Date.now() - SEVEN_DAYS_MS;
    const rows = await ctx.db
      .query("pabauActivityLog")
      .withIndex("by_occurredAt", (q) => q.gte("occurredAt", cutoff))
      .collect();
    // Filter by entityType in memory; the entity_action index requires
    // also fixing action, which we don't want here.
    return rows
      .filter((r) => r.entityType === entityType)
      .sort((a, b) => b.occurredAt - a.occurredAt);
  },
});

/**
 * Cheap counter for "X new leads this week" style stats.
 * Returns a single number — caller passes the cutoff timestamp.
 */
export const countSinceByAction = query({
  args: {
    entityType: v.string(),
    action: ACTION,
    since: v.number(),
  },
  handler: async (ctx, { entityType, action, since }) => {
    const rows = await ctx.db
      .query("pabauActivityLog")
      .withIndex("by_entity_action", (q) =>
        q.eq("entityType", entityType).eq("action", action),
      )
      .collect();
    let count = 0;
    for (const row of rows) {
      if (row.occurredAt >= since) count++;
    }
    return count;
  },
});

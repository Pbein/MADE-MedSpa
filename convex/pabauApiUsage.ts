import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const METHOD = v.union(
  v.literal("GET"),
  v.literal("POST"),
  v.literal("PUT"),
  v.literal("DELETE"),
);

function todayKey(timestamp: number): string {
  const d = new Date(timestamp);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const increment = mutation({
  args: { method: METHOD },
  handler: async (ctx, { method }) => {
    const now = Date.now();
    const date = todayKey(now);
    const existing = await ctx.db
      .query("pabauApiUsage")
      .withIndex("by_date_method", (q) => q.eq("date", date).eq("method", method))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        count: existing.count + 1,
        lastCallAt: now,
      });
      return existing.count + 1;
    }

    await ctx.db.insert("pabauApiUsage", {
      date,
      method,
      count: 1,
      lastCallAt: now,
    });
    return 1;
  },
});

export const todaysUsage = query({
  args: {},
  handler: async (ctx) => {
    const date = todayKey(Date.now());
    const rows = await ctx.db
      .query("pabauApiUsage")
      .withIndex("by_date_method", (q) => q.eq("date", date))
      .collect();

    const byMethod = { GET: 0, POST: 0, PUT: 0, DELETE: 0 };
    for (const row of rows) byMethod[row.method] = row.count;

    const writes = byMethod.POST + byMethod.PUT;
    return {
      date,
      byMethod,
      writes,
      writeBudgetTotal: 10000,
      writeBudgetUsedPct: Math.round((writes / 10000) * 1000) / 10,
    };
  },
});

export const recentDays = query({
  args: { days: v.number() },
  handler: async (ctx, { days }) => {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const rows = await ctx.db.query("pabauApiUsage").collect();
    return rows.filter((r) => r.lastCallAt >= cutoff);
  },
});

export const syncHealth = query({
  args: {},
  handler: async (ctx) => {
    const services = await ctx.db.query("services").collect();
    const products = await ctx.db.query("shopProducts").collect();
    const reviews = await ctx.db.query("pabauReviews").collect();
    const webhooks = await ctx.db.query("pabauWebhookEvents").collect();
    const usage = await ctx.db.query("pabauApiUsage").collect();

    const lastWebhookReceivedAt = webhooks.reduce(
      (max, w) => (w.receivedAt > max ? w.receivedAt : max),
      0,
    );

    function statsFor(rows: { pabauSyncedAt?: number; isActive: boolean }[], pabauKey: string) {
      const withPabau = rows.filter((r) => (r as Record<string, unknown>)[pabauKey] !== undefined);
      const lastSyncedAt = withPabau.reduce(
        (max, r) => (r.pabauSyncedAt && r.pabauSyncedAt > max ? r.pabauSyncedAt : max),
        0,
      );
      return {
        total: withPabau.length,
        active: withPabau.filter((r) => r.isActive).length,
        lastSyncedAt,
      };
    }

    function reviewStats() {
      const lastSyncedAt = reviews.reduce(
        (max, r) => (r.pabauSyncedAt > max ? r.pabauSyncedAt : max),
        0,
      );
      return {
        total: reviews.length,
        active: reviews.filter((r) => !r.isHidden).length,
        lastSyncedAt,
      };
    }

    const today = new Date().toISOString().slice(0, 10);
    const todayUsage = usage.filter((u) => u.date === today);
    const writes = todayUsage.reduce(
      (sum, u) => (u.method === "POST" || u.method === "PUT" ? sum + u.count : sum),
      0,
    );
    const reads = todayUsage.reduce(
      (sum, u) => (u.method === "GET" ? sum + u.count : sum),
      0,
    );

    return {
      services: statsFor(services, "pabauServiceId"),
      products: statsFor(products, "pabauProductId"),
      reviews: reviewStats(),
      webhooks: {
        total: webhooks.length,
        lastReceivedAt: lastWebhookReceivedAt,
      },
      todayUsage: {
        reads,
        writes,
        writeBudget: 10000,
      },
    };
  },
});

"use node";

import { action, internalAction } from "./_generated/server";
import { internal, api } from "./_generated/api";
import { v } from "convex/values";

interface PabauReviewRaw {
  id?: string | number;
  review_id?: string | number;
  client_name?: string;
  name?: string;
  comment?: string;
  quote?: string;
  rating?: number;
  service?: string;
  treatment?: string;
  created_at?: string;
  date?: string;
}

interface PabauServiceRaw {
  id?: number | string;
  service_name?: string;
  name?: string;
  description?: string;
  category_name?: string;
  category?: string;
  duration?: string;
  price?: string | number;
  booking_url?: string;
  is_active?: number | boolean;
}

interface PabauProductRaw {
  id?: number | string;
  product_name?: string;
  name?: string;
  description?: string;
  category_name?: string;
  category?: string;
  price?: string | number;
}

interface SyncSummary {
  fetched: number;
  created: number;
  updated: number;
  removed: number;
  errors: string[];
}

function toNumber(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function parseTimestamp(input: string | undefined): number {
  if (!input) return Date.now();
  const t = Date.parse(input);
  return Number.isFinite(t) ? t : Date.now();
}

function formatDuration(dur: string | undefined): string | undefined {
  if (!dur) return undefined;
  const parts = dur.split(":").map((p) => Number.parseInt(p, 10));
  if (parts.length < 2 || parts.some((n) => !Number.isFinite(n))) return dur;
  const minutes = parts[0] * 60 + parts[1];
  return `${minutes} minutes`;
}

function formatPrice(price: string | number | undefined): string | undefined {
  if (price === undefined || price === null) return undefined;
  const n = typeof price === "number" ? price : Number.parseFloat(price);
  if (!Number.isFinite(n)) return undefined;
  return `$${n.toFixed(0)}`;
}

async function pabauGet<T>(path: string): Promise<T | { error: string }> {
  const apiKey = process.env.PABAU_API_KEY;
  const baseUrl = process.env.PABAU_API_BASE_URL ?? "https://api.oauth.pabau.com";
  if (!apiKey) return { error: "PABAU_API_KEY not set on Convex deployment." };

  let res: Response;
  try {
    res = await fetch(`${baseUrl}/${apiKey}${path}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
  } catch (err) {
    return { error: `Network error: ${err instanceof Error ? err.message : String(err)}` };
  }

  if (res.status === 429) return { error: "Rate limited by Pabau (429)." };
  if (!res.ok) return { error: `Pabau returned ${res.status} ${res.statusText}.` };

  const data = (await res.json().catch(() => null)) as T | null;
  if (!data) return { error: "Pabau returned non-JSON response." };
  return data;
}

function normalizeReview(raw: PabauReviewRaw): {
  pabauReviewId: string;
  name: string;
  quote: string;
  treatment?: string;
  rating?: number;
  pabauCreatedAt: number;
} | null {
  const id = String(raw.id ?? raw.review_id ?? "").trim();
  const name = (raw.client_name ?? raw.name ?? "").trim();
  const quote = (raw.comment ?? raw.quote ?? "").trim();
  if (!id || !name || !quote) return null;
  return {
    pabauReviewId: id,
    name,
    quote,
    treatment: (raw.treatment ?? raw.service)?.trim() || undefined,
    rating: toNumber(raw.rating),
    pabauCreatedAt: parseTimestamp(raw.created_at ?? raw.date),
  };
}

export const syncReviews = action({
  args: {},
  handler: async (ctx): Promise<SyncSummary> => {
    const summary: SyncSummary = {
      fetched: 0,
      created: 0,
      updated: 0,
      removed: 0,
      errors: [],
    };

    const apiKey = process.env.PABAU_API_KEY;
    const baseUrl = process.env.PABAU_API_BASE_URL ?? "https://api.oauth.pabau.com";
    if (!apiKey) {
      summary.errors.push("PABAU_API_KEY not set on Convex deployment.");
      return summary;
    }

    let res: Response;
    try {
      res = await fetch(`${baseUrl}/${apiKey}/reviews`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
    } catch (err) {
      summary.errors.push(`Network error: ${err instanceof Error ? err.message : String(err)}`);
      return summary;
    }

    if (res.status === 429) {
      summary.errors.push("Rate limited by Pabau (429).");
      return summary;
    }
    if (!res.ok) {
      summary.errors.push(`Pabau returned ${res.status} ${res.statusText}.`);
      return summary;
    }

    const data = (await res.json().catch(() => null)) as
      | { reviews?: PabauReviewRaw[] }
      | null;

    const incoming = Array.isArray(data?.reviews) ? data!.reviews : [];
    summary.fetched = incoming.length;

    const seenIds = new Set<string>();
    for (const raw of incoming) {
      const normalized = normalizeReview(raw);
      if (!normalized) {
        summary.errors.push(`Skipped malformed review: ${JSON.stringify(raw).slice(0, 120)}`);
        continue;
      }
      seenIds.add(normalized.pabauReviewId);
      try {
        const result = await ctx.runMutation(internal.pabauReviews.upsertFromPabau, normalized);
        if (result.action === "created") summary.created++;
        else summary.updated++;
      } catch (err) {
        summary.errors.push(
          `Failed upserting ${normalized.pabauReviewId}: ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
      }
    }

    const existing = await ctx.runQuery(api.pabauReviews.listAll, {});
    for (const row of existing) {
      if (!seenIds.has(row.pabauReviewId)) {
        try {
          const result = await ctx.runMutation(internal.pabauReviews.removeByPabauId, {
            pabauReviewId: row.pabauReviewId,
          });
          if (result.removed) summary.removed++;
        } catch (err) {
          summary.errors.push(
            `Failed removing ${row.pabauReviewId}: ${
              err instanceof Error ? err.message : String(err)
            }`,
          );
        }
      }
    }

    return summary;
  },
});

export const syncReviewsCron = internalAction({
  args: {},
  handler: async (ctx): Promise<void> => {
    await ctx.runAction(api.pabauSync.syncReviews, {});
  },
});

export const syncServices = action({
  args: {},
  handler: async (ctx): Promise<SyncSummary> => {
    const summary: SyncSummary = {
      fetched: 0,
      created: 0,
      updated: 0,
      removed: 0,
      errors: [],
    };

    const data = await pabauGet<{ services?: PabauServiceRaw[] }>("/services");
    if ("error" in data) {
      summary.errors.push(data.error);
      return summary;
    }

    const incoming = Array.isArray(data.services) ? data.services : [];
    summary.fetched = incoming.length;

    const seenIds = new Set<number>();
    for (const raw of incoming) {
      const idNum = typeof raw.id === "number" ? raw.id : Number.parseInt(String(raw.id ?? ""), 10);
      const name = (raw.service_name ?? raw.name ?? "").trim();
      if (!Number.isFinite(idNum) || !name) {
        summary.errors.push(`Skipped malformed service: ${JSON.stringify(raw).slice(0, 120)}`);
        continue;
      }
      seenIds.add(idNum);
      try {
        const result = await ctx.runMutation(internal.services.upsertFromPabau, {
          pabauServiceId: idNum,
          name,
          description: raw.description?.trim() || undefined,
          pabauCategory: raw.category_name ?? raw.category,
          duration: formatDuration(raw.duration),
          priceRange: formatPrice(raw.price),
          bookingUrl: raw.booking_url,
        });
        if (result.action === "created") summary.created++;
        else summary.updated++;
      } catch (err) {
        summary.errors.push(
          `Failed upserting service ${idNum}: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }

    const existing = await ctx.runQuery(internal.services.listAllInternal, {});
    for (const row of existing) {
      if (
        typeof row.pabauServiceId === "number" &&
        row.isActive &&
        !seenIds.has(row.pabauServiceId)
      ) {
        try {
          const result = await ctx.runMutation(internal.services.softDeleteByPabauId, {
            pabauServiceId: row.pabauServiceId,
          });
          if (result.removed) summary.removed++;
        } catch (err) {
          summary.errors.push(
            `Failed soft-deleting service ${row.pabauServiceId}: ${
              err instanceof Error ? err.message : String(err)
            }`,
          );
        }
      }
    }

    return summary;
  },
});

export const syncServicesCron = internalAction({
  args: {},
  handler: async (ctx): Promise<void> => {
    await ctx.runAction(api.pabauSync.syncServices, {});
  },
});

export const syncProducts = action({
  args: {},
  handler: async (ctx): Promise<SyncSummary> => {
    const summary: SyncSummary = {
      fetched: 0,
      created: 0,
      updated: 0,
      removed: 0,
      errors: [],
    };

    const data = await pabauGet<{ products?: PabauProductRaw[] }>("/products");
    if ("error" in data) {
      summary.errors.push(data.error);
      return summary;
    }

    const incoming = Array.isArray(data.products) ? data.products : [];
    summary.fetched = incoming.length;

    const seenIds = new Set<number>();
    for (const raw of incoming) {
      const idNum = typeof raw.id === "number" ? raw.id : Number.parseInt(String(raw.id ?? ""), 10);
      const name = (raw.product_name ?? raw.name ?? "").trim();
      if (!Number.isFinite(idNum) || !name) {
        summary.errors.push(`Skipped malformed product: ${JSON.stringify(raw).slice(0, 120)}`);
        continue;
      }
      seenIds.add(idNum);
      try {
        const priceNum =
          typeof raw.price === "number"
            ? raw.price
            : raw.price !== undefined
              ? Number.parseFloat(raw.price)
              : undefined;

        const result = await ctx.runMutation(internal.shopProducts.upsertFromPabau, {
          pabauProductId: idNum,
          name,
          description: raw.description?.trim() || undefined,
          price: Number.isFinite(priceNum) ? (priceNum as number) : undefined,
          pabauCategory: raw.category_name ?? raw.category,
        });
        if (result.action === "created") summary.created++;
        else summary.updated++;
      } catch (err) {
        summary.errors.push(
          `Failed upserting product ${idNum}: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }

    const existing = await ctx.runQuery(internal.shopProducts.listAllInternal, {});
    for (const row of existing) {
      if (
        typeof row.pabauProductId === "number" &&
        row.isActive &&
        !seenIds.has(row.pabauProductId)
      ) {
        try {
          const result = await ctx.runMutation(internal.shopProducts.softDeleteByPabauId, {
            pabauProductId: row.pabauProductId,
          });
          if (result.removed) summary.removed++;
        } catch (err) {
          summary.errors.push(
            `Failed soft-deleting product ${row.pabauProductId}: ${
              err instanceof Error ? err.message : String(err)
            }`,
          );
        }
      }
    }

    return summary;
  },
});

export const syncProductsCron = internalAction({
  args: {},
  handler: async (ctx): Promise<void> => {
    await ctx.runAction(api.pabauSync.syncProducts, {});
  },
});

export const syncEntity = action({
  args: {
    entityType: v.union(
      v.literal("reviews"),
      v.literal("services"),
      v.literal("products"),
      v.literal("memberships"),
    ),
  },
  handler: async (ctx, { entityType }): Promise<SyncSummary> => {
    if (entityType === "reviews") return await ctx.runAction(api.pabauSync.syncReviews, {});
    if (entityType === "services") return await ctx.runAction(api.pabauSync.syncServices, {});
    if (entityType === "products") return await ctx.runAction(api.pabauSync.syncProducts, {});
    return {
      fetched: 0,
      created: 0,
      updated: 0,
      removed: 0,
      errors: [
        "Memberships are admin-managed (no Pabau equivalent). Edit them in /admin/memberships.",
      ],
    };
  },
});

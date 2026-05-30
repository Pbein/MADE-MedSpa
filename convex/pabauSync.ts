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
  // Pabau returns 1 or 0. Karlyne flags in-office-only services with 0 on the
  // Pabau service config so we hide them from /services.
  bookable_online?: number | boolean;
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

// Pabau's list endpoints paginate at 20 rows/page and report `total: 20` as the
// PAGE size — NOT a grand total. A single GET therefore silently caps a sync at
// the first 20 rows (the original bug: 100 services in Pabau, only 20 synced).
// We walk `?page=N` accumulating rows until a page yields nothing new. The
// dedupe-and-stop guard is load-bearing: Pabau clamps an out-of-range page to
// the LAST page (repeating it) instead of returning empty, so "page not empty"
// is not a safe end signal — "page added no unseen ids" is.
//
// `pick` extracts the row array from the wrapper; `idOf` returns the row's
// stable id for dedupe. A page-1 error propagates; a later-page error stops
// paging but keeps what we already have. MAX_PAGES caps a pathological loop
// (e.g. an endpoint that never repeats) at 2000 rows — far above this clinic's
// real catalog, and ~100 GETs is still well inside the rate limit.
async function pabauGetAllPages<T>(
  path: string,
  pick: (data: unknown) => T[] | undefined,
  idOf: (item: T) => number | string | undefined,
): Promise<{ items: T[] } | { error: string }> {
  const items: T[] = [];
  const seen = new Set<string>();
  const PAGE_SIZE = 20;
  const MAX_PAGES = 100;
  const sep = path.includes("?") ? "&" : "?";

  for (let page = 1; page <= MAX_PAGES; page++) {
    const data = await pabauGet<unknown>(`${path}${sep}page=${page}`);
    if (data && typeof data === "object" && "error" in data) {
      if (page === 1) return { error: (data as { error: string }).error };
      break; // later-page failure: return what we have rather than nothing
    }

    const batch = pick(data) ?? [];
    if (batch.length === 0) break;

    let added = 0;
    for (const item of batch) {
      const id = idOf(item);
      const key = id === undefined ? JSON.stringify(item) : String(id);
      if (seen.has(key)) continue;
      seen.add(key);
      items.push(item);
      added++;
    }

    if (added === 0) break; // page repeated prior rows → past the end
    if (batch.length < PAGE_SIZE) break; // partial final page
  }

  return { items };
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

    const data = await pabauGetAllPages<PabauReviewRaw>(
      "/reviews",
      (d) => (d as { reviews?: PabauReviewRaw[] })?.reviews,
      (r) => r.id ?? r.review_id,
    );
    if ("error" in data) {
      summary.errors.push(data.error);
      return summary;
    }

    const incoming = data.items;
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

    const data = await pabauGetAllPages<PabauServiceRaw>(
      "/services",
      (d) => (d as { services?: PabauServiceRaw[] })?.services,
      (s) => s.id,
    );
    if ("error" in data) {
      summary.errors.push(data.error);
      return summary;
    }

    const incoming = data.items;
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
      // Coerce Pabau's 0/1 (or boolean) into a tri-state: true / false / undefined.
      // Undefined when Pabau didn't include the field — upsert defaults that to
      // bookable so legacy data doesn't disappear.
      const bookable: boolean | undefined =
        raw.bookable_online === undefined
          ? undefined
          : raw.bookable_online === 1 || raw.bookable_online === true;
      try {
        const result = await ctx.runMutation(internal.services.upsertFromPabau, {
          pabauServiceId: idNum,
          name,
          description: raw.description?.trim() || undefined,
          pabauCategory: raw.category_name ?? raw.category,
          duration: formatDuration(raw.duration),
          priceRange: formatPrice(raw.price),
          bookingUrl: raw.booking_url,
          bookableOnline: bookable,
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

    const data = await pabauGetAllPages<PabauProductRaw>(
      "/products",
      (d) => (d as { products?: PabauProductRaw[] })?.products,
      (p) => p.id,
    );
    if ("error" in data) {
      summary.errors.push(data.error);
      return summary;
    }

    const incoming = data.items;
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

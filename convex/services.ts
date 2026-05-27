import { query, mutation, internalMutation, internalQuery } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { assertAdmin } from "./lib/auth";
import type { Doc } from "./_generated/dataModel";
import { NON_BOOKABLE_SERVICE_NAMES } from "./data/nonBookableServices";
import { normalizePabauBookingUrl } from "./lib/pabauBookingUrl";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const services = await ctx.db
      .query("services")
      .collect();
    return services
      // Hide anything inactive OR explicitly marked not-bookable in Pabau.
      // bookableOnline === undefined (legacy/manual entries) is treated as
      // bookable so nothing pre-Pabau-field disappears.
      .filter((s) => s.isActive && s.bookableOnline !== false)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
});


export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const services = await ctx.db.query("services").collect();
    return services.sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const service = await ctx.db
      .query("services")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (!service) return null;
    // Don't expose deactivated or non-bookable services on the public detail
    // page. Returning null lets the page render its 404/not-found state.
    if (!service.isActive || service.bookableOnline === false) return null;
    return service;
  },
});

export const listByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const services = await ctx.db
      .query("services")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
    return services
      .filter((s) => s.isActive && s.bookableOnline !== false)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    shortDescription: v.string(),
    fullDescription: v.string(),
    category: v.string(),
    duration: v.optional(v.string()),
    priceRange: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    galleryImageUrls: v.optional(v.array(v.string())),
    faqs: v.optional(v.array(v.object({ question: v.string(), answer: v.string() }))),
    benefits: v.optional(v.array(v.string())),
    whoItsFor: v.optional(v.string()),
    whatToExpect: v.optional(v.array(v.object({ title: v.string(), description: v.string() }))),
    preCareNotes: v.optional(v.string()),
    postCareNotes: v.optional(v.string()),
    downtime: v.optional(v.string()),
    pabauServiceId: v.optional(v.number()),
    pabauBookingUrl: v.optional(v.string()),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    const id = await ctx.db.insert("services", {
      ...args,
      isActive: true,
    });
    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("services"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    shortDescription: v.optional(v.string()),
    fullDescription: v.optional(v.string()),
    category: v.optional(v.string()),
    categoryLocked: v.optional(v.boolean()),
    duration: v.optional(v.string()),
    priceRange: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    galleryImageUrls: v.optional(v.array(v.string())),
    faqs: v.optional(v.array(v.object({ question: v.string(), answer: v.string() }))),
    benefits: v.optional(v.array(v.string())),
    whoItsFor: v.optional(v.string()),
    whatToExpect: v.optional(v.array(v.object({ title: v.string(), description: v.string() }))),
    preCareNotes: v.optional(v.string()),
    postCareNotes: v.optional(v.string()),
    downtime: v.optional(v.string()),
    pabauServiceId: v.optional(v.number()),
    pabauBookingUrl: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    const { id, ...fields } = args;
    // Only patch fields that were actually provided
    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }
    // Admin edited the category? Lock it so the next Pabau sync respects it.
    if (fields.category !== undefined && fields.categoryLocked === undefined) {
      updates.categoryLocked = true;
    }
    // Admin set isActive directly? Mirror the toggleActive semantics so the
    // hide is sticky against future Pabau syncs.
    if (fields.isActive !== undefined) {
      updates.hiddenByAdmin = fields.isActive ? false : true;
    }
    await ctx.db.patch(id, updates);
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("services") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    // Set hiddenByAdmin so the next Pabau sync doesn't resurrect it.
    await ctx.db.patch(args.id, { isActive: false, hiddenByAdmin: true });
  },
});

// Match-key normalizer: trim, collapse internal whitespace, lowercase.
// Used by bulkHideNonBookable so spreadsheet name like "Dermal Fillers " (with
// trailing space) still matches the synced Pabau record. Em-dash vs en-dash is
// preserved — if Pabau uses a different dash variant we'll see it in unmatched.
function normalizeServiceName(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

// One-shot admin sweep: marks every service whose name appears in
// docs/Client Returned/MADE Med Spa Services.xlsx (Bookable Online: No) as
// inactive + hiddenByAdmin so the next Pabau sync doesn't resurrect it.
// Idempotent — running twice produces the same end state. Returns a summary
// so the operator can verify match coverage before trusting the result.
export const bulkHideNonBookable = mutation({
  args: { dryRun: v.optional(v.boolean()) },
  handler: async (ctx, { dryRun }) => {
    await assertAdmin(ctx);

    const all = await ctx.db.query("services").collect();
    const byNormName = new Map<string, Doc<"services">>();
    for (const s of all) {
      byNormName.set(normalizeServiceName(s.name), s);
    }

    let toHide = 0;
    let alreadyHidden = 0;
    const unmatched: string[] = [];
    const hiddenNames: string[] = [];

    for (const targetName of NON_BOOKABLE_SERVICE_NAMES) {
      const match = byNormName.get(normalizeServiceName(targetName));
      if (!match) {
        unmatched.push(targetName);
        continue;
      }
      if (match.hiddenByAdmin && !match.isActive) {
        alreadyHidden++;
        continue;
      }
      toHide++;
      hiddenNames.push(match.name);
      if (!dryRun) {
        await ctx.db.patch(match._id, {
          isActive: false,
          hiddenByAdmin: true,
        });
      }
    }

    return {
      dryRun: dryRun === true,
      total: NON_BOOKABLE_SERVICE_NAMES.length,
      hidden: toHide,
      alreadyHidden,
      unmatched,
      hiddenNames,
    };
  },
});

export const toggleActive = mutation({
  args: { id: v.id("services") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    const service = await ctx.db.get(args.id);
    if (!service) {
      throw new Error("Service not found");
    }
    const nextActive = !service.isActive;
    // Toggling to inactive sets the sticky flag; toggling back to active
    // clears it so Pabau sync can manage isActive normally again.
    await ctx.db.patch(args.id, {
      isActive: nextActive,
      hiddenByAdmin: nextActive ? false : true,
    });
  },
});

// --- Pabau sync mutations (internal — invoked by convex/pabauSync.ts only) ---

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Maps a free-text Pabau category string to one of the admin-managed
// categories by keyword match. The admin can edit `pabauKeywords` per
// category in /admin/categories — no code change needed to retag.
// First active category whose keyword list matches wins (sortOrder order).
// Falls back to the category flagged isDefault, or "Body" if none.
function inferCategory(
  pabauCategory: string | undefined,
  categories: Doc<"serviceCategories">[],
): string {
  const c = (pabauCategory ?? "").toLowerCase();
  for (const cat of categories) {
    if (cat.pabauKeywords.some((kw) => kw && c.includes(kw))) {
      return cat.name;
    }
  }
  const fallback = categories.find((cat) => cat.isDefault);
  return fallback?.name ?? "Body";
}

export const listAllInternal = internalQuery({
  args: {},
  handler: async (ctx) => ctx.db.query("services").collect(),
});

export const upsertFromPabau = internalMutation({
  args: {
    pabauServiceId: v.number(),
    name: v.string(),
    description: v.optional(v.string()),
    pabauCategory: v.optional(v.string()),
    duration: v.optional(v.string()),
    priceRange: v.optional(v.string()),
    bookingUrl: v.optional(v.string()),
    // undefined when Pabau didn't return the field; treated as bookable.
    bookableOnline: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("services")
      .withIndex("by_pabauServiceId", (q) => q.eq("pabauServiceId", args.pabauServiceId))
      .first();

    const allCats = await ctx.db.query("serviceCategories").collect();
    const activeCats = allCats
      .filter((c) => c.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    // Rewrite Pabau's booking_url onto our canonical slug — Pabau still emits
    // the dead `made-51g64` slug, so storing it verbatim breaks Book Now.
    const normalizedBookingUrl = normalizePabauBookingUrl(args.bookingUrl);

    const now = Date.now();
    if (existing) {
      // Respect admin-locked category overrides; otherwise re-infer from Pabau.
      const nextCategory = existing.categoryLocked
        ? existing.category
        : inferCategory(args.pabauCategory, activeCats);

      await ctx.db.patch(existing._id, {
        name: args.name,
        shortDescription:
          args.description?.slice(0, 200) ?? existing.shortDescription,
        fullDescription: args.description ?? existing.fullDescription,
        category: nextCategory,
        duration: args.duration ?? existing.duration,
        priceRange: args.priceRange ?? existing.priceRange,
        pabauBookingUrl: normalizedBookingUrl ?? existing.pabauBookingUrl,
        pabauSyncedAt: now,
        // Don't resurrect services the admin has explicitly hidden — sync
        // would otherwise flip isActive back to true every 15 min.
        isActive: existing.hiddenByAdmin ? false : true,
        // Reflect Pabau's current bookable_online flag. If Pabau omitted it,
        // preserve whatever we had (don't clobber with undefined).
        bookableOnline:
          args.bookableOnline === undefined
            ? existing.bookableOnline
            : args.bookableOnline,
      });
      return { id: existing._id, action: "updated" as const };
    }

    const all = await ctx.db.query("services").collect();
    const maxOrder = all.reduce((m, s) => Math.max(m, s.sortOrder), 0);

    const id = await ctx.db.insert("services", {
      name: args.name,
      slug: slugify(args.name) || `service-${args.pabauServiceId}`,
      shortDescription: args.description?.slice(0, 200) ?? args.name,
      fullDescription: args.description ?? args.name,
      category: inferCategory(args.pabauCategory, activeCats),
      categoryLocked: false,
      duration: args.duration,
      priceRange: args.priceRange,
      pabauServiceId: args.pabauServiceId,
      pabauBookingUrl: normalizedBookingUrl ?? undefined,
      pabauSyncedAt: now,
      isActive: true,
      bookableOnline: args.bookableOnline,
      sortOrder: maxOrder + 1,
    });
    return { id, action: "created" as const };
  },
});

// Re-runs inferCategory() against every non-categoryLocked service using the
// current serviceCategories table. Equivalent to a Pabau resync but without
// hitting the Pabau API — so the owner can edit categories/keywords in
// /admin/categories and immediately re-tag services for accurate filtering,
// without waiting for the 15-min sync. Shared by the internal (CLI) and admin
// wrappers below.
async function rebucketServices(ctx: MutationCtx) {
  const allCats = await ctx.db.query("serviceCategories").collect();
  const activeCats = allCats
    .filter((c) => c.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const services = await ctx.db.query("services").collect();
  const moves: Record<string, number> = {};
  let moved = 0;
  let unchanged = 0;
  let locked = 0;

  for (const s of services) {
    if (s.categoryLocked) {
      locked++;
      continue;
    }
    // Re-infer from the existing service.category string. Pabau's original
    // category string isn't stored on the service row, so we use the current
    // category as the closest proxy. For services that already match the new
    // set this is a no-op; for orphans this lets keyword matching catch them
    // (e.g., a service whose name contains "facial" maps to Facial Treatment
    // even if its old category was just "Body").
    const probe = `${s.category} ${s.name}`;
    const next = inferCategory(probe, activeCats);
    if (next === s.category) {
      unchanged++;
      continue;
    }
    const key = `${s.category} -> ${next}`;
    moves[key] = (moves[key] ?? 0) + 1;
    moved++;
    await ctx.db.patch(s._id, { category: next });
  }

  return { total: services.length, moved, unchanged, locked, moves };
}

// Internal twin — invokable from the CLI without an admin session.
export const rebucketAllInternal = internalMutation({
  args: {},
  handler: async (ctx) => rebucketServices(ctx),
});

// Admin-callable: powers the "Re-apply category rules to all services" button
// in /admin/categories so the owner can re-tag after editing categories.
export const rebucketAll = mutation({
  args: {},
  handler: async (ctx) => {
    await assertAdmin(ctx);
    return rebucketServices(ctx);
  },
});

// Known slugs of the demo/dummy services shipped in convex/seed.ts. Used by
// deleteSeedServicesInternal to purge leftover seed rows without touching real
// Pabau-synced or admin-created services.
const SEED_SERVICE_SLUGS: ReadonlySet<string> = new Set([
  "botox-dysport", "dermal-fillers", "lip-enhancement", "cheek-augmentation",
  "jawline-contouring", "under-eye-filler", "sculptra", "hyperdilute-radiesse",
  "kybella", "prp-face", "lip-flip", "masseter-tmj", "brow-lift",
  "lip-filler-dissolve", "hydrafacial-md", "hydrafacial-booster", "vi-peel",
  "cosmelan-peel", "signature-facial", "dermaplaning", "led-light-therapy",
  "microneedling", "microneedling-prp", "aerolase-neo-elite", "sylfirm-x",
  "lasemd-ultra", "iv-hydration", "im-iv-boosters", "eboo-ozone-therapy",
  "red-light-therapy-body", "peptide-therapy", "weight-loss-consult",
  "glp1-program", "body-composition",
]);

// One-shot cleanup: deletes the dummy seed services (matched by the known seed
// slugs) so the public site shows only real Pabau-synced services. Skips any
// row carrying a pabauServiceId — a real synced service that happens to share
// a slug is never deleted. Pass { dryRun: true } to preview. Run via
// `npx convex run services:deleteSeedServicesInternal`.
export const deleteSeedServicesInternal = internalMutation({
  args: { dryRun: v.optional(v.boolean()) },
  handler: async (ctx, { dryRun }) => {
    const all = await ctx.db.query("services").collect();
    const deletedNames: string[] = [];
    const skippedPabau: string[] = [];
    for (const s of all) {
      if (!SEED_SERVICE_SLUGS.has(s.slug)) continue;
      if (s.pabauServiceId !== undefined) {
        skippedPabau.push(s.name);
        continue;
      }
      deletedNames.push(s.name);
      if (!dryRun) await ctx.db.delete(s._id);
    }
    return {
      dryRun: dryRun === true,
      deleted: deletedNames.length,
      deletedNames,
      skippedPabau,
    };
  },
});

// One-shot: rewrites any stored pabauBookingUrl onto the canonical booking
// slug. Fixes rows synced before slug normalization landed (e.g. the dead
// `made-51g64` deep links). Idempotent — re-running is a no-op. Run via
// `npx convex run services:normalizeBookingUrlsInternal`.
export const normalizeBookingUrlsInternal = internalMutation({
  args: {},
  handler: async (ctx) => {
    const services = await ctx.db.query("services").collect();
    let changed = 0;
    let unchanged = 0;
    for (const s of services) {
      const next = normalizePabauBookingUrl(s.pabauBookingUrl);
      if (next && next !== s.pabauBookingUrl) {
        await ctx.db.patch(s._id, { pabauBookingUrl: next });
        changed++;
      } else {
        unchanged++;
      }
    }
    return { total: services.length, changed, unchanged };
  },
});

export const softDeleteByPabauId = internalMutation({
  args: { pabauServiceId: v.number() },
  handler: async (ctx, { pabauServiceId }) => {
    const existing = await ctx.db
      .query("services")
      .withIndex("by_pabauServiceId", (q) => q.eq("pabauServiceId", pabauServiceId))
      .first();
    if (!existing) return { removed: false };
    if (!existing.isActive) return { removed: false };
    await ctx.db.patch(existing._id, { isActive: false, pabauSyncedAt: Date.now() });
    return { removed: true };
  },
});

#!/usr/bin/env node
// =============================================================================
// One-shot migration: Convex storage  ->  Vercel Blob
// =============================================================================
//
// WHAT THIS DOES
//   For every admin-uploaded media URL stored in the following Convex tables:
//     - siteContent.imageUrl
//     - services.imageUrl
//     - services.galleryImageUrls (array)
//     - teamMembers.imageUrl
//     - shopProducts.imageUrl
//     - beforeAfterCases.beforeImageUrl
//     - beforeAfterCases.afterImageUrl
//
//   ...if the URL still points at Convex storage
//   (`*.convex.cloud/api/storage/...`), this script will:
//     1. Download the bytes from Convex.
//     2. Re-upload them to Vercel Blob via @vercel/blob `put()`.
//     3. Patch the row to point at the new Blob URL.
//
//   Rows whose URL is already a Vercel Blob URL
//   (`*.public.blob.vercel-storage.com`) are skipped. Re-running the script is
//   safe and idempotent.
//
// USAGE
//   Dry-run (default — prints the plan, makes no writes, no Blob uploads):
//     npm run migrate:dry-run
//
//   Apply for real:
//     npm run migrate:apply
//
//   Help:
//     node scripts/migrate-convex-to-blob.mjs --help
//
// REQUIRED ENV (loaded from .env.local via `node --env-file=.env.local`)
//   CONVEX_URL              The Convex deployment URL. Defaults to
//                           https://energized-akita-520.convex.cloud (matches
//                           scripts/upload-images.mjs) if unset.
//   BLOB_READ_WRITE_TOKEN   Vercel Blob server token. Required for --apply.
//   MIGRATION_SECRET        Shared secret matching the value set on the Convex
//                           deployment via:
//                             npx convex env set MIGRATION_SECRET "<random>"
//                           Required for both dry-run (read) and --apply.
//
// AUTH MODEL — WHY A SHARED SECRET
//   Convex admin mutations are gated by `assertAdmin()` which inspects the
//   Clerk JWT in `ctx.auth.getUserIdentity()`. A standalone Node script has no
//   Clerk session and can't easily forge one. Rather than wire up a Clerk
//   machine token, we use the standard one-shot-migration pattern: a temporary
//   file `convex/migrations.ts` exposes mutations that authenticate via a
//   shared secret. After running this migration successfully:
//
//     1. Delete `convex/migrations.ts`.
//     2. Remove the env var from the deployment:
//          npx convex env remove MIGRATION_SECRET
//          npx convex env remove --prod MIGRATION_SECRET
//     3. Commit & deploy so the mutations no longer exist server-side.
//
// CAVEATS
//   - The script does NOT delete the old files from Convex storage. After you
//     verify the site renders the new URLs correctly, you can clean up Convex
//     storage manually via the dashboard.
//   - Blob pathnames use `addRandomSuffix: true`, so re-running on the same
//     row would produce a *new* Blob URL. The skip-if-already-Blob guard
//     prevents this — but if you somehow want to force re-migration, you'd
//     need to manually reset the field to a Convex URL first.
// =============================================================================

import { ConvexHttpClient } from "convex/browser";
import { put } from "@vercel/blob";
import { api } from "../convex/_generated/api.js";

// ---------------------------------------------------------------------------
// CLI parsing
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const FLAG_APPLY = args.includes("--apply");
const FLAG_HELP = args.includes("--help") || args.includes("-h");

if (FLAG_HELP) {
  console.log(`
migrate-convex-to-blob.mjs — move admin-uploaded media from Convex to Vercel Blob

USAGE
  node scripts/migrate-convex-to-blob.mjs [--apply] [--help]

FLAGS
  --apply   Actually perform downloads, uploads, and DB writes. Without this
            flag the script runs in dry-run mode and only prints the plan.
  --help    Print this message and exit.

REQUIRED ENV
  CONVEX_URL              Convex deployment URL (default:
                          https://energized-akita-520.convex.cloud)
  BLOB_READ_WRITE_TOKEN   Vercel Blob server token (required for --apply)
  MIGRATION_SECRET        Shared secret matching \`npx convex env get MIGRATION_SECRET\`

SETUP CHECKLIST
  1. Generate a random secret (e.g. \`openssl rand -hex 32\`).
  2. Set it on the Convex deployment:
       npx convex env set MIGRATION_SECRET "<the-secret>"
  3. Add it (and BLOB_READ_WRITE_TOKEN) to .env.local.
  4. Run \`npm run migrate:dry-run\` and review the plan.
  5. Run \`npm run migrate:apply\` to execute.
  6. After verifying the site, DELETE \`convex/migrations.ts\` and run
     \`npx convex env remove MIGRATION_SECRET\` (and --prod).
`);
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Env + setup
// ---------------------------------------------------------------------------

const CONVEX_URL =
  process.env.CONVEX_URL ?? "https://energized-akita-520.convex.cloud";
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN ?? "";
const MIGRATION_SECRET = process.env.MIGRATION_SECRET ?? "";

if (!MIGRATION_SECRET) {
  console.error(
    "ERROR: MIGRATION_SECRET is not set. See `node scripts/migrate-convex-to-blob.mjs --help`.",
  );
  process.exit(1);
}

if (FLAG_APPLY && !BLOB_TOKEN) {
  console.error(
    "ERROR: --apply requires BLOB_READ_WRITE_TOKEN to be set in .env.local.",
  );
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

const BLOB_HOST_FRAGMENT = ".public.blob.vercel-storage.com";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** True if `url` is already a Vercel Blob URL — these rows are skipped. */
function isBlobUrl(url) {
  return typeof url === "string" && url.includes(BLOB_HOST_FRAGMENT);
}

/** True if `url` looks like a real, non-empty migrate-able URL. */
function isMigratable(url) {
  return typeof url === "string" && url.length > 0 && !isBlobUrl(url);
}

/** Slugify a free-form name for use as a Blob pathname segment. */
function slugify(input) {
  return String(input ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80) || "untitled";
}

/** Best-effort file-extension inference. URL path first, then Content-Type. */
function inferExtension(url, contentType) {
  // URL path: strip query/hash, take the last `.xxx` if it looks like an ext.
  try {
    const u = new URL(url);
    const pathname = u.pathname;
    const dot = pathname.lastIndexOf(".");
    if (dot !== -1 && dot > pathname.lastIndexOf("/")) {
      const ext = pathname.slice(dot + 1).toLowerCase();
      if (/^[a-z0-9]{2,5}$/.test(ext)) return ext;
    }
  } catch {
    // not a parseable URL — fall through to content-type
  }

  if (contentType) {
    const ct = contentType.split(";")[0].trim().toLowerCase();
    const map = {
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
      "image/avif": "avif",
      "image/svg+xml": "svg",
      "image/heic": "heic",
      "video/mp4": "mp4",
      "video/webm": "webm",
      "video/quicktime": "mov",
    };
    if (map[ct]) return map[ct];
    // image/foo -> foo
    const m = ct.match(/^image\/([a-z0-9]+)$/);
    if (m) return m[1];
  }

  return "bin";
}

/**
 * Download a Convex storage URL into a Buffer, plus return the content type
 * so the caller can set it on the Blob upload.
 */
async function downloadFromConvex(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`download ${res.status} ${res.statusText} from ${url}`);
  }
  const contentType = res.headers.get("content-type") ?? "";
  const arrayBuf = await res.arrayBuffer();
  return { buffer: Buffer.from(arrayBuf), contentType };
}

/**
 * Upload a buffer to Vercel Blob and return the public URL.
 *
 * `addRandomSuffix: true` shields us from collisions — multiple rows with the
 * same slug (e.g. two services named the same) won't clobber each other.
 */
async function uploadToBlob(pathname, buffer, contentType) {
  const result = await put(pathname, buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType: contentType || undefined,
    token: BLOB_TOKEN,
  });
  return result.url;
}

/** Format a byte count for human-readable progress logs. */
function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

// ---------------------------------------------------------------------------
// Plan building
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} PlanItem
 * @property {string} table          One of the 5 tables.
 * @property {string} id             Convex row id (string form).
 * @property {string} label          Human-readable identifier for logs.
 * @property {"single"|"gallery"} kind
 * @property {string} field          For "single": the field name on the row.
 *                                   For "gallery": always "galleryImageUrls".
 * @property {number} [galleryIndex] For "gallery": the index in the array.
 * @property {string} oldUrl         Current URL we'd download from.
 * @property {string} pathname       Target Blob pathname (without random suffix).
 * @property {string[]} [fullGallery] For "gallery": snapshot of the full array
 *                                    at plan time. Used to rebuild the new
 *                                    array after each gallery item is uploaded.
 */

function buildPlan(rows) {
  const ts = Date.now();
  /** @type {PlanItem[]} */
  const plan = [];

  // siteContent
  for (const r of rows.siteContent) {
    if (isMigratable(r.imageUrl)) {
      const ext = inferExtension(r.imageUrl, "");
      plan.push({
        table: "siteContent",
        id: r._id,
        label: `siteContent[key=${r.key}]`,
        kind: "single",
        field: "imageUrl",
        oldUrl: r.imageUrl,
        pathname: `migrated/siteContent/${slugify(r.key)}-${ts}.${ext}`,
      });
    }
  }

  // services (single + gallery)
  for (const r of rows.services) {
    const slug = r.slug || r.name || r._id;
    if (isMigratable(r.imageUrl)) {
      const ext = inferExtension(r.imageUrl, "");
      plan.push({
        table: "services",
        id: r._id,
        label: `services[slug=${slug}]`,
        kind: "single",
        field: "imageUrl",
        oldUrl: r.imageUrl,
        pathname: `migrated/services/${slugify(slug)}-${ts}.${ext}`,
      });
    }
    if (Array.isArray(r.galleryImageUrls) && r.galleryImageUrls.length > 0) {
      const fullGallery = r.galleryImageUrls.slice();
      r.galleryImageUrls.forEach((u, idx) => {
        if (!isMigratable(u)) return;
        const ext = inferExtension(u, "");
        plan.push({
          table: "services",
          id: r._id,
          label: `services[slug=${slug}].galleryImageUrls[${idx}]`,
          kind: "gallery",
          field: "galleryImageUrls",
          galleryIndex: idx,
          oldUrl: u,
          pathname: `migrated/services/${slugify(slug)}-gallery-${idx}-${ts}.${ext}`,
          fullGallery,
        });
      });
    }
  }

  // teamMembers
  for (const r of rows.teamMembers) {
    if (isMigratable(r.imageUrl)) {
      const ext = inferExtension(r.imageUrl, "");
      plan.push({
        table: "teamMembers",
        id: r._id,
        label: `teamMembers[name=${r.name}]`,
        kind: "single",
        field: "imageUrl",
        oldUrl: r.imageUrl,
        pathname: `migrated/team/${slugify(r.name)}-${ts}.${ext}`,
      });
    }
  }

  // shopProducts
  for (const r of rows.shopProducts) {
    if (isMigratable(r.imageUrl)) {
      const ext = inferExtension(r.imageUrl, "");
      const slugSrc = r.name || r._id;
      plan.push({
        table: "shopProducts",
        id: r._id,
        label: `shopProducts[name=${r.name}]`,
        kind: "single",
        field: "imageUrl",
        oldUrl: r.imageUrl,
        pathname: `migrated/shop/${slugify(slugSrc)}-${ts}.${ext}`,
      });
    }
  }

  // beforeAfterCases (before + after as separate plan items)
  for (const r of rows.beforeAfterCases) {
    if (isMigratable(r.beforeImageUrl)) {
      const ext = inferExtension(r.beforeImageUrl, "");
      plan.push({
        table: "beforeAfterCases",
        id: r._id,
        label: `beforeAfterCases[id=${r._id}].before`,
        kind: "single",
        field: "beforeImageUrl",
        oldUrl: r.beforeImageUrl,
        pathname: `migrated/before-after/${r._id}-before-${ts}.${ext}`,
      });
    }
    if (isMigratable(r.afterImageUrl)) {
      const ext = inferExtension(r.afterImageUrl, "");
      plan.push({
        table: "beforeAfterCases",
        id: r._id,
        label: `beforeAfterCases[id=${r._id}].after`,
        kind: "single",
        field: "afterImageUrl",
        oldUrl: r.afterImageUrl,
        pathname: `migrated/before-after/${r._id}-after-${ts}.${ext}`,
      });
    }
  }

  return plan;
}

// ---------------------------------------------------------------------------
// Per-row migration. Returns either {ok: true, newUrl} or {ok: false, error}.
//
// Gallery rows mutate `inFlightGallery` so successive items on the same
// services row write the cumulative array (preserves ordering and any
// already-Blob entries).
// ---------------------------------------------------------------------------

async function migrateOne(item, inFlightGallery) {
  const { buffer, contentType } = await downloadFromConvex(item.oldUrl);

  // Refine extension once we know the response content-type — fixes the
  // common case where the Convex `/api/storage/...` URL has no extension at
  // all but the response is `image/png`.
  const refinedExt = inferExtension(item.oldUrl, contentType);
  const pathname = item.pathname.replace(/\.[a-z0-9]+$/i, `.${refinedExt}`);

  const newUrl = await uploadToBlob(pathname, buffer, contentType);

  if (item.kind === "single") {
    await client.mutation(api.migrations.setMediaUrl, {
      secret: MIGRATION_SECRET,
      table: item.table,
      id: item.id,
      field: item.field,
      url: newUrl,
    });
  } else {
    // gallery: replace the whole array. inFlightGallery starts as a clone of
    // the original array and gets the migrated index swapped in. We send the
    // whole thing each time so a partial run still leaves the DB consistent.
    const arrFromCache = inFlightGallery.get(item.id);
    const arr = arrFromCache ? arrFromCache.slice() : item.fullGallery.slice();
    arr[item.galleryIndex] = newUrl;
    inFlightGallery.set(item.id, arr);
    await client.mutation(api.migrations.setGalleryImageUrls, {
      secret: MIGRATION_SECRET,
      id: item.id,
      urls: arr,
    });
  }

  return { newUrl, bytes: buffer.length };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(
    `\nmigrate-convex-to-blob.mjs — ${FLAG_APPLY ? "APPLY MODE" : "DRY RUN (use --apply to execute)"}`,
  );
  console.log(`Convex URL: ${CONVEX_URL}\n`);

  // 1. Snapshot every row that owns a media field.
  const rows = await client.query(api.migrations.listMediaRows, {
    secret: MIGRATION_SECRET,
  });

  // 2. Build plan.
  const plan = buildPlan(rows);

  // Quick stats: how many rows did we look at total, vs how many need work?
  const totalRowsScanned =
    rows.siteContent.length +
    rows.services.length +
    rows.teamMembers.length +
    rows.shopProducts.length +
    rows.beforeAfterCases.length;

  console.log(
    `Scanned ${totalRowsScanned} rows across 5 tables. ${plan.length} field(s) need migration.\n`,
  );

  if (plan.length === 0) {
    console.log("Nothing to migrate. Everything is already on Vercel Blob.");
    return;
  }

  if (!FLAG_APPLY) {
    console.log("Migration plan (dry-run):\n");
    plan.forEach((item, i) => {
      console.log(
        `  [${String(i + 1).padStart(3, " ")}/${plan.length}] ${item.label}`,
      );
      console.log(`        from: ${item.oldUrl}`);
      console.log(`        to:   blob://${item.pathname}`);
    });
    console.log(
      `\n${plan.length} field(s) would be migrated. Re-run with --apply to execute.`,
    );
    return;
  }

  // 3. Apply for real.
  /** @type {Map<string, string[]>} services._id -> in-flight gallery array */
  const inFlightGallery = new Map();
  /** @type {Array<{label: string, error: string}>} */
  const failures = [];
  let successes = 0;

  for (let i = 0; i < plan.length; i++) {
    const item = plan[i];
    const tag = `[${i + 1}/${plan.length}] ${item.label}`;
    process.stdout.write(`${tag}: convex -> blob ... `);
    try {
      const { bytes } = await migrateOne(item, inFlightGallery);
      console.log(`OK (${formatBytes(bytes)})`);
      successes++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`FAIL: ${msg}`);
      failures.push({ label: item.label, error: msg });
    }
  }

  // 4. Summary.
  console.log("\n----- Summary -----");
  console.log(`Succeeded: ${successes}`);
  console.log(`Failed:    ${failures.length}`);
  if (failures.length > 0) {
    console.log("\nFailed rows:");
    for (const f of failures) {
      console.log(`  - ${f.label}: ${f.error}`);
    }
    console.log(
      "\nRe-run with --apply to retry; successful rows are already on Blob and will be skipped.",
    );
    process.exitCode = 1;
  } else {
    console.log("\nAll done. Verify the site renders new URLs, then:");
    console.log("  1. Delete convex/migrations.ts");
    console.log("  2. npx convex env remove MIGRATION_SECRET");
    console.log("  3. npx convex env remove --prod MIGRATION_SECRET");
    console.log("  4. Commit + deploy.");
  }
}

main().catch((err) => {
  console.error("\nFATAL:", err);
  process.exit(1);
});

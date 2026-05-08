// Generates docs/launch-tracker.md from docs/.asana-export.json plus the
// session-resolution map below. Re-run after a fresh Asana export to refresh
// the doc. Standalone — node scripts/asana-to-markdown.mjs > docs/launch-tracker.md
import fs from "node:fs";

const tasks = JSON.parse(fs.readFileSync("docs/.asana-export.json", "utf8"));

// Substring → resolution. Case-insensitive contains. First match wins.
const sessionResolution = {
  "Switch Vercel from pk_test_ to pk_live_": {
    status: "done",
    note: "2026-05-04 — keys swapped via Vercel CLI; production redeployed.",
  },
  "LAUNCH-BLOCKING] Create 'convex' JWT template": {
    status: "done",
    note: "Auth queries work in admin → template exists. Verify in Clerk dashboard if anything breaks.",
  },
  "Lock Clerk to Restricted signup mode": {
    status: "done",
    note: "2026-05-04 — done manually in Clerk dashboard.",
  },
  "Production cutover — Convex + Clerk + Vercel env": {
    status: "done",
    note: "2026-05-04 — Clerk pk_live_/sk_live_ pushed, ADMIN_EMAILS set on Production, Convex CLERK_FRONTEND_API_URL_DEV + _URL set, dual-issuer auth.config.ts deployed.",
  },
  "Update Karlyne's email reference everywhere": {
    status: "done",
    note: "ADMIN_EMAILS includes karlyne08@gmail.com on Production.",
  },
  "Add admin email allowlist in middleware + Convex mutations": {
    status: "done",
    note: "Already in place; verified working when /admin loaded post-cutover.",
  },
  "Add security headers": {
    status: "partial",
    note: "HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CSP all in next.config.ts. Still in Report-Only — flip to enforced after 1 week soak.",
  },
  "Comprehensive CTA + link audit": {
    status: "done",
    note: "2026-05-05 — Audited all hrefs. Standardized 'Book Consultation' (was mixed Book Appointment/Now/Consult). Standardized 'Explore Services' (was View All/Browse). All /booking CTAs updated to /booking#pabau-iframe so they scroll to the iframe.",
  },
  "Fix /admin/pages/home Primary Button Link": {
    status: "done",
    note: "Section defaults updated to /booking#pabau-iframe in src/lib/sectionDefinitions.ts.",
  },
  "Replace 'MADE' nav text with logo image": {
    status: "done",
    note: "2026-05-05 — Brand SVGs in /public/images/. Espresso variant on light bg, white on dark/hero. Admin upload still wins as override.",
  },
  "Get logo file from Karlyne + upload via /admin/settings": {
    status: "done",
    note: "Karlyne sent espresso + white + charcoal SVGs/PNGs. Integrated as Nav + Footer fallback.",
  },
  "Get logo PNG from Karlyne": {
    status: "done",
    note: "Files in /assets (gitignored) + /public/images/. SVG preferred.",
  },
  "Apply final design spec from client": {
    status: "partial",
    note: "Typography sweep done (Playfair / Glacial Indifference / Montserrat, ALL CAPS H2/H3 0.4em, no italic on headers). Brand colors verified vs spec. Logo integrated. Shop redesigned. Footer compacted. Some sections may still need polish per the 21MB Visual Branding Guide PDF (too big for me to read — extract pages if needed).",
  },
  "Document the 'shared dev Convex powers production' gotcha": {
    status: "open",
    note: "We hit this exact issue on 2026-05-05 — production Vercel pointed at energized-akita-520 (the 'dev' Convex deployment) so all my fixes to grand-mole-440 (the 'prod' deployment) were no-ops until I realized. Auth.config.ts now supports both Clerk issuers via dual-env-var pattern. Documentation still TODO.",
  },
};

function lookup(name) {
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(sessionResolution)) {
    if (lower.includes(key.toLowerCase())) return val;
  }
  return null;
}

function bucketOf(t) {
  if (/\[P0\b/i.test(t.name)) return "P0";
  if (/\[P1\b/i.test(t.name)) return "P1";
  if (/\[P2\b/i.test(t.name)) return "P2";
  if (/\[P3\b/i.test(t.name)) return "P3";
  if (/\[Discuss/i.test(t.name)) return "Discuss";
  return "Other";
}

const buckets = { P0: [], P1: [], P2: [], P3: [], Discuss: [], Other: [] };
for (const t of tasks) buckets[bucketOf(t)].push(t);

function snipNotes(notes, maxLen = 700) {
  if (!notes) return "";
  const cleaned = notes.replace(/\r\n/g, "\n").trim();
  if (cleaned.length <= maxLen) return cleaned;
  return cleaned.slice(0, maxLen).trimEnd() + " *(truncated — see Asana export JSON)*";
}

function renderTask(t) {
  const res = lookup(t.name);
  const checkbox = res?.status === "done" ? "[x]" : res?.status === "partial" ? "[~]" : "[ ]";
  const due = t.due_on ? ` *(was due ${t.due_on})*` : "";
  let out = `- ${checkbox} **${t.name}**${due}\n`;
  if (res) {
    const label = res.status === "done" ? "✅ Done" : res.status === "partial" ? "⚠️ Partial" : "ℹ️";
    out += `  - _${label}_ — ${res.note}\n`;
  }
  if (t.notes) {
    const snippet = snipNotes(t.notes);
    if (snippet) {
      const quoted = snippet.split("\n").map((l) => "> " + l).join("\n");
      out += "  <details><summary>Original Asana notes</summary>\n\n" + quoted + "\n\n  </details>\n";
    }
  }
  return out;
}

const today = new Date().toISOString().slice(0, 10);
const doneCount = tasks.filter((t) => lookup(t.name)?.status === "done").length;
const partialCount = tasks.filter((t) => lookup(t.name)?.status === "partial").length;
const openCount = tasks.length - tasks.filter((t) => lookup(t.name)).length;

let md = "";
md += `# MADE Med Spa — Launch Tracker\n\n`;
md += `> **Source of truth.** Migrated from Asana on ${today} (free tier expiring).\n`;
md += `> Asana export JSON preserved at \`docs/.asana-export.json\` for reference.\n>\n`;
md += `> **Status legend:** \`[ ]\` open · \`[x]\` done · \`[~]\` partial / in progress\n\n`;

md += `## How to use this doc\n\n`;
md += `1. Check the box \`[ ]\` → \`[x]\` when work lands. Add a date note inline.\n`;
md += `2. New tasks: append to the right priority section. Use a \`P0/P1/P2/P3\` prefix in the title.\n`;
md += `3. Move "Discuss" items into the relevant priority section once decided.\n`;
md += `4. Big sweeps of context: each task has the original Asana notes in a \`<details>\` block.\n\n`;

md += `## Quick stats\n\n`;
md += `- **${tasks.length} tasks** imported from Asana\n`;
md += `- **${doneCount} marked done** in 2026-05-04 → 2026-05-07 session\n`;
md += `- **${partialCount} marked partial** (see notes)\n`;
md += `- **${openCount} still open**\n\n`;

md += `By priority:\n`;
for (const p of ["P0", "P1", "P2", "P3", "Discuss", "Other"]) {
  const total = buckets[p].length;
  const done = buckets[p].filter((t) => lookup(t.name)?.status === "done").length;
  md += `- **${p}**: ${total} total, ${done} done\n`;
}
md += `\n---\n\n`;

md += `## 📋 Session Log — 2026-05-04 to 2026-05-07\n\n`;
md += `Captures work shipped to production. Some items here aren't represented in the Asana list (new work that came up mid-session).\n\n`;

md += `### 2026-05-04 — Production cutover\n`;
md += `- Switched Vercel Production from Clerk \`pk_test_\` to \`pk_live_\` keys\n`;
md += `- Set \`ADMIN_EMAILS\` on Production (was missing entirely)\n`;
md += `- Created Clerk Production instance, custom domain \`clerk.mademedspa.com\` via GoDaddy DNS (5 CNAMEs: clerk, accounts, clkmail, clk._domainkey, clk2._domainkey)\n`;
md += `- Locked Clerk to Restricted signup mode + email/password (Google OAuth removed)\n`;
md += `- Diagnosed + fixed: production Vercel was pointed at \`energized-akita-520\` Convex (dev-labeled) so all fixes to \`grand-mole-440\` (prod-labeled) were no-ops. Updated \`convex/auth.config.ts\` to register both Clerk issuers (dev + prod) so the same Convex deployment serves local dev (test Clerk) and production (custom domain) without breaking either.\n\n`;

md += `### 2026-05-04 / 05 — Brand typography overhaul\n`;
md += `- Killed global \`h1-h6 { font-style: italic }\` in \`globals.css\`. Italics now live ONLY on \`.accent-quote\` (testimonials, pull-quotes).\n`;
md += `- H1 → Playfair Display, sentence case, no italic\n`;
md += `- H2/H3 → Jost (later swapped to Glacial Indifference), ALL CAPS, letter-spacing 0.4em, weight 500\n`;
md += `- Body → Montserrat 400, line-height 1.8\n`;
md += `- Buttons + nav links → label style (Jost/GI uppercase)\n`;
md += `- Stripped italic from 30+ headings across sections, page heroes, navigation, footer, accordion, page CTAs\n`;
md += `- New \`/admin/typography-spec\` printable reference for client (annotated samples)\n\n`;

md += `### 2026-05-05 — Service categories backend\n`;
md += `- New Convex \`serviceCategories\` table (name, slug, sortOrder, isActive, pabauKeywords[], isDefault)\n`;
md += `- \`inferCategory()\` now reads from DB at Pabau sync time (was hardcoded keyword map)\n`;
md += `- New \`categoryLocked\` flag on services preserves admin overrides across syncs\n`;
md += `- New \`/admin/categories\` page: add / rename / reorder / activate / delete + edit Pabau keyword list per category\n`;
md += `- \`/services\` filter and \`/admin/services\` dropdown both pull from DB\n`;
md += `- Migration path safe for production: seed via "Seed default categories" button on first load\n\n`;

md += `### 2026-05-05 — Logo + footer + booking flow\n`;
md += `- Brand logo SVGs (espresso/white) in \`/public/images/\`. Nav + Footer use them as default; admin upload still wins as override. Larger nav size (56px desktop, 44px mobile) for visual balance with CTA button.\n`;
md += `- Footer rebuilt to match alcoveaesthetics.com pattern: single-column mobile with collapsible Menu accordion, three columns on desktop. No newsletter, no payment icons, no promo banner. Cut height by ~50%.\n`;
md += `- Booking iframe gets \`id="pabau-iframe"\` + \`scroll-mt-24\`. All 11 CTA hrefs (4 hardcoded + 7 admin-editable defaults) updated to \`/booking#pabau-iframe\`.\n`;
md += `- CTA copy standardized: "Book Consultation" replaces mixed "Book Appointment" / "Book Now" / "Book Your Consult". "Explore Services" replaces "View All Services" / "Browse Services" / "View Services".\n\n`;

md += `### 2026-05-05 — CSP + Clerk custom domain allowlist\n`;
md += `- Added \`https://clerk.mademedspa.com\` and \`https://accounts.mademedspa.com\` to \`script-src\`, \`connect-src\`, \`frame-src\` directives. Console no longer spams CSP report-only warnings on every page load.\n\n`;

md += `### 2026-05-07 — Shop redesign + Glacial Indifference\n`;
md += `- Drop side-by-side "Provider Favorites" (was forcing square photos into rectangle). Single unified grid: 2 cols mobile / 3 tablet / 4 desktop. Square aspect ratio with \`object-contain\` + neutral padding so any product shape renders intact.\n`;
md += `- Cards minimal: image + category + name + price + "View" arrow. Description moved to detail page.\n`;
md += `- New \`/shop/[slug]\` product detail page with \`getBySlugOrId\` query (slug derived from name on the fly, no schema migration). Two-column desktop layout, full description, Pabau CTA.\n`;
md += `- Swapped Jost → Glacial Indifference for headers/labels (loaded from \`fonts.cdnfonts.com\` via @import). Added \`fonts.cdnfonts.com\` to CSP \`style-src\` + \`font-src\`. Tried weight 400 (thinner) but reverted to 500 per client feedback.\n`;
md += `- Mission body text bumped to \`text-lg md:text-xl\`.\n`;
md += `- Adaptive team section: 1 person → editorial spotlight, 2/3/4+ → progressively wider grid.\n\n`;

md += `### 2026-05-07 — Image compression on every admin upload\n`;
md += `- Karlyne uploads any size — \`browser-image-compression\` resizes + compresses in a Web Worker before Vercel Blob upload.\n`;
md += `- Per-purpose specs from launch-readiness handoff: service photo 1600px ~400KB WebP, product 1200px ~300KB WebP, headshot 1200px ~400KB WebP, avatar 400px ~100KB WebP, background 2400px ~500KB WebP, OG 1200px ~300KB JPEG, logo pass-through, general fallback 2000px ~500KB WebP.\n`;
md += `- SVG / GIF / video skip compression. Compression failure falls back to original (uploads never break).\n`;
md += `- Wired \`purpose\` prop through \`<ImageUpload>\` component + every direct \`uploadBlob\` callsite.\n\n`;

md += `### Cleanup not in Asana\n`;
md += `- Pushed everything to \`main\` (was sitting on a feature branch for days; production was running ahead of git history)\n`;
md += `- Added \`/assets/\` to \`.gitignore\` (32MB local-only brand reference PDFs)\n`;
md += `- Fixed CSS @import order — Tailwind v4 inlines its ruleset, so font @imports must come before \`@import "tailwindcss"\`\n`;
md += `- Set \`images.unoptimized\` in dev mode (large blob photos were timing out the dev image proxy — production unchanged)\n\n`;

md += `---\n\n`;

const headings = [
  ["P0", "🔴 P0 — Launch Critical (must-fix before / immediately after launch)"],
  ["P1", "🟡 P1 — Important (within ~2 weeks of launch)"],
  ["P2", "🟢 P2 — Backlog"],
  ["P3", "⚪ P3 — Future / Post-Launch v2"],
  ["Discuss", "💬 Discuss — Decisions needed from client / stakeholders"],
  ["Other", "📌 Other / Operations"],
];

for (const [bucket, label] of headings) {
  md += `## ${label}\n\n`;
  if (buckets[bucket].length === 0) {
    md += "*(none)*\n\n---\n\n";
    continue;
  }
  for (const t of buckets[bucket]) {
    md += renderTask(t);
    md += "\n";
  }
  md += "---\n\n";
}

md += `## Followups discovered in this session (not in original Asana)\n\n`;
md += `These came up during 2026-05-04 → 2026-05-07 work and need ongoing tracking:\n\n`;
md += `- [ ] **Migrate Glacial Indifference to self-hosted** — currently loaded from \`fonts.cdnfonts.com\` via @import (no preload, slight CDN dependency). Once client confirms she likes the font, download .woff2 from fontesk.com → \`/public/fonts/\` → wire via \`next/font/local\`.\n`;
md += `- [ ] **Backfill compression for existing Vercel Blob photos** — new uploads get compressed automatically, but ~30+ already-uploaded full-size JPGs are still in Blob. Either ask Karlyne to re-upload through admin, or write a one-shot migration script (download → compress with sharp → upload → update siteContent URLs).\n`;
md += `- [ ] **Roll Clerk production secret key** — \`sk_live_...\` was pasted in chat during cutover. Best practice: roll via Clerk dashboard → API keys → Roll secret. Re-push to Vercel via \`vercel env rm CLERK_SECRET_KEY production -y\` + \`vercel env add\`.\n`;
md += `- [ ] **\`ADMIN_EMAILS\` on Vercel Preview environment** — CLI silently failed during cutover. Add via dashboard so preview deploys can access /admin without auth wall.\n`;
md += `- [ ] **Seed default service categories on production** — \`/admin/categories\` is live but empty. Click "Seed default categories" once to install Injectables/Skin/Body/Wellness with their Pabau keyword rules.\n`;
md += `- [ ] **Visual Branding Guide PDF** — \`assets/MADE MED SPA - Visual Branding Guide 2026.pdf\` is 21MB, exceeds in-tool read limit. Extract specific pages if there's spec content beyond colors/typography (image treatments, voice/tone, photography style, social templates).\n`;
md += `- [ ] **Privacy policy Pabau processor disclosure** — defer to Karlyne. Don't draft legal copy as a developer.\n`;
md += `- [ ] **Switch CSP from Report-Only to enforced** — \`Content-Security-Policy-Report-Only\` in \`next.config.ts\`. After 1 week soak with no console violations, flip to \`Content-Security-Policy\`.\n\n`;

md += `---\n\n`;
md += `## Migration notes\n\n`;
md += `**Free Asana tier expiring** — this doc is now the canonical task list. The original Asana data lives in \`docs/.asana-export.json\` for reference.\n\n`;
md += `**To regenerate this doc** after a fresh Asana export: \`node scripts/asana-to-markdown.mjs > docs/launch-tracker.md\`. Update the \`sessionResolution\` map in the script with newly-completed items first.\n\n`;
md += `**Adding new tasks**: just edit this file directly. Bullet, checkbox, priority prefix in title. The script is for refreshing from Asana, not authoritative once the doc is the source of truth.\n`;

fs.writeFileSync("docs/launch-tracker.md", md);
console.log("Wrote docs/launch-tracker.md (" + md.length + " chars, " + md.split("\n").length + " lines)");

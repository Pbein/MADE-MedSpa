// One-off export of curated testimonials before swapping data source to Pabau.
// Run: node scripts/export-testimonials.mjs
// Output: docs/testimonials-archive.csv
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import fs from "node:fs";
import path from "node:path";

const url = process.env.NEXT_PUBLIC_CONVEX_URL ?? "https://energized-akita-520.convex.cloud";
const client = new ConvexHttpClient(url);

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

async function main() {
  const rows = await client.query(api.testimonials.listAll, {});
  const header = ["name", "treatment", "quote", "sortOrder", "isActive", "createdAt"];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [
        csvEscape(r.name),
        csvEscape(r.treatment),
        csvEscape(r.quote),
        csvEscape(r.sortOrder),
        csvEscape(r.isActive ? "true" : "false"),
        csvEscape(new Date(r._creationTime).toISOString()),
      ].join(","),
    );
  }
  const outPath = path.resolve("docs/testimonials-archive.csv");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, lines.join("\n"), "utf8");
  console.log(`Exported ${rows.length} testimonials → ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

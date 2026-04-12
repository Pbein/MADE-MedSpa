import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const CONVEX_URL = "https://energized-akita-520.convex.cloud";

const client = new ConvexHttpClient(CONVEX_URL);

const MAPPING = [
  { file: "2.png",  kind: "siteContent", key: "featured_service_image_1", label: "Featured Service 1" },
  { file: "3.png",  kind: "siteContent", key: "featured_service_image_2", label: "Featured Service 2" },
  { file: "4.png",  kind: "siteContent", key: "featured_service_image_3", label: "Featured Service 3" },
  { file: "5.png",  kind: "siteContent", key: "about_philosophy_image",   label: "Philosophy Image" },
  { file: "6.png",  kind: "siteContent", key: "testimonial_portrait",     label: "Testimonial Portrait" },
  { file: "7.png",  kind: "service",     slug: "botox-cosmetic",          label: "Botox Cosmetic" },
  { file: "8.png",  kind: "service",     slug: "dermal-fillers",          label: "Dermal Fillers" },
  { file: "9.png",  kind: "service",     slug: "lip-enhancement",         label: "Lip Enhancement" },
  { file: "10.png", kind: "service",     slug: "hydrafacial-signature",   label: "HydraFacial Signature" },
  { file: "11.png", kind: "service",     slug: "chemical-peel",           label: "Chemical Peel" },
  { file: "12.png", kind: "service",     slug: "microneedling-prp",       label: "Microneedling with PRP" },
  { file: "13.png", kind: "service",     slug: "coolsculpting-elite",     label: "CoolSculpting Elite" },
  { file: "14.png", kind: "service",     slug: "laser-hair-removal",      label: "Laser Hair Removal" },
  { file: "15.png", kind: "service",     slug: "iv-vitamin-therapy",      label: "IV Vitamin Therapy" },
  { file: "16.png", kind: "service",     slug: "hormone-optimization",    label: "Hormone Optimization" },
];

async function uploadFile(filepath) {
  const uploadUrl = await client.mutation(api.storage.generateUploadUrl);
  const data = await readFile(filepath);
  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": "image/png" },
    body: data,
  });
  if (!res.ok) {
    throw new Error(`Upload failed: ${res.status} ${await res.text()}`);
  }
  const { storageId } = await res.json();
  const url = await client.query(api.storage.getUrl, { storageId });
  if (!url) throw new Error(`getUrl returned null for ${storageId}`);
  return url;
}

async function main() {
  console.log(`Uploading ${MAPPING.length} images to ${CONVEX_URL}\n`);

  for (const entry of MAPPING) {
    const filepath = join(__dirname, "..", "media", "Images", entry.file);
    process.stdout.write(`[${entry.file.padEnd(7)}] ${entry.label.padEnd(28)} `);

    try {
      const url = await uploadFile(filepath);

      if (entry.kind === "siteContent") {
        await client.mutation(api.siteContent.upsert, {
          key: entry.key,
          imageUrl: url,
        });
        console.log(`OK  (siteContent.${entry.key})`);
      } else {
        const service = await client.query(api.services.getBySlug, { slug: entry.slug });
        if (!service) {
          console.log(`MISS (no service with slug "${entry.slug}")`);
          continue;
        }
        await client.mutation(api.services.update, {
          id: service._id,
          imageUrl: url,
        });
        console.log(`OK  (service "${entry.slug}")`);
      }
    } catch (err) {
      console.log(`FAIL: ${err.message}`);
    }
  }

  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

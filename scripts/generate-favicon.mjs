// Generate browser-tab favicon set from assets/MADE.jpg
// Outputs:
//   src/app/icon.png        (512x512, Next.js auto-derives sizes)
//   src/app/apple-icon.png  (180x180)
//   src/app/favicon.ico     (multi-size: 16, 32, 48 — PNG-in-ICO)
//
// Run: node scripts/generate-favicon.mjs

import sharp from "sharp";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC = join(ROOT, "assets", "MADE.jpg");
const OUT_ICON = join(ROOT, "src", "app", "icon.png");
const OUT_APPLE = join(ROOT, "src", "app", "apple-icon.png");
const OUT_ICO = join(ROOT, "src", "app", "favicon.ico");

// PNG-in-ICO encoder: writes ICO header + directory + embedded PNG payloads.
// Supported since Windows Vista; modern browsers all read it.
function buildIco(pngEntries) {
  const count = pngEntries.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = headerSize + dirEntrySize * count;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // 1 = .ICO
  header.writeUInt16LE(count, 4);

  const dirEntries = [];
  const payloads = [];
  let offset = dirSize;

  for (const { size, png } of pngEntries) {
    const e = Buffer.alloc(dirEntrySize);
    e.writeUInt8(size === 256 ? 0 : size, 0); // width (0 means 256)
    e.writeUInt8(size === 256 ? 0 : size, 1); // height
    e.writeUInt8(0, 2);  // color palette
    e.writeUInt8(0, 3);  // reserved
    e.writeUInt16LE(1, 4);   // color planes
    e.writeUInt16LE(32, 6);  // bits per pixel
    e.writeUInt32LE(png.length, 8);  // size of PNG bytes
    e.writeUInt32LE(offset, 12);     // offset of PNG bytes
    dirEntries.push(e);
    payloads.push(png);
    offset += png.length;
  }

  return Buffer.concat([header, ...dirEntries, ...payloads]);
}

async function main() {
  // Source: 600x600 cream-bg "MADE / MED SPA" wordmark
  // Strategy: keep aspect, upscale to 512 for high-density screens, sharp resize is high-quality
  const src = sharp(SRC);

  // 512x512 master icon — Next.js will derive smaller sizes for <link rel="icon" sizes="...">
  const icon512 = await src.clone().resize(512, 512, { fit: "contain", background: "#F5F2EA" }).png().toBuffer();
  writeFileSync(OUT_ICON, icon512);
  console.log(`✓ ${OUT_ICON}  (${icon512.length} bytes)`);

  // 180x180 apple touch icon
  const apple180 = await src.clone().resize(180, 180, { fit: "contain", background: "#F5F2EA" }).png().toBuffer();
  writeFileSync(OUT_APPLE, apple180);
  console.log(`✓ ${OUT_APPLE}  (${apple180.length} bytes)`);

  // .ico: 16, 32, 48 (sufficient for all modern browser-tab uses)
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(
    sizes.map(async (size) => ({
      size,
      png: await src.clone().resize(size, size, { fit: "contain", background: "#F5F2EA" }).png().toBuffer(),
    }))
  );
  const ico = buildIco(pngs);
  writeFileSync(OUT_ICO, ico);
  console.log(`✓ ${OUT_ICO}  (${ico.length} bytes, sizes: ${sizes.join(", ")})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

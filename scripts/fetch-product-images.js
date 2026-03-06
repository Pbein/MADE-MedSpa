const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
if (!PEXELS_API_KEY) {
  console.error("Missing PEXELS_API_KEY");
  process.exit(1);
}

const DEMO_DIR = path.join(__dirname, "..", "public", "images", "demo", "products");
const OPT_DIR = path.join(__dirname, "..", "public", "images", "optimized", "products");
fs.mkdirSync(DEMO_DIR, { recursive: true });
fs.mkdirSync(OPT_DIR, { recursive: true });

// Product image requests - square/editorial aspect for product shots
const products = [
  { filename: "vitamin-c-serum", query: "vitamin c serum skincare bottle luxury" },
  { filename: "hyaluronic-acid-serum", query: "hyaluronic acid serum dropper bottle skincare" },
  { filename: "night-cream", query: "luxury night cream jar skincare" },
  { filename: "daily-moisturizer", query: "daily moisturizer cream skincare minimal" },
  { filename: "enzyme-cleanser", query: "gel cleanser skincare bottle minimal" },
  { filename: "salicylic-cleanser", query: "foaming cleanser skincare product" },
  { filename: "sunscreen-spf50", query: "sunscreen spf skincare tube luxury" },
  { filename: "retinol-treatment", query: "retinol serum skincare bottle amber" },
];

const usedIds = new Set();

async function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { Authorization: PEXELS_API_KEY } }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error("Parse error: " + data.slice(0, 200))); }
      });
    }).on("error", reject);
  });
}

async function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    protocol.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error("HTTP " + res.statusCode));
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    }).on("error", reject);
  });
}

async function fetchProduct(item) {
  const url = "https://api.pexels.com/v1/search?query=" +
    encodeURIComponent(item.query) +
    "&orientation=square&per_page=15&size=medium";

  console.log("  Searching: \"" + item.query + "\"...");
  let data = await fetchJSON(url);

  if (!data.photos || data.photos.length === 0) {
    // Fallback to portrait
    const url2 = "https://api.pexels.com/v1/search?query=" +
      encodeURIComponent(item.query.split(" ").slice(0, 3).join(" ")) +
      "&orientation=portrait&per_page=15&size=medium";
    data = await fetchJSON(url2);
  }

  if (!data.photos || data.photos.length === 0) {
    console.log("  SKIPPED: No results");
    return null;
  }

  // Pick unused photo with warmest tones
  const candidates = data.photos.filter((p) => !usedIds.has(p.id));
  const pool = candidates.length > 0 ? candidates : data.photos;

  const scored = pool.map((photo) => {
    let warmScore = 0;
    if (photo.avg_color) {
      const hex = photo.avg_color.replace("#", "");
      const r = parseInt(hex.slice(0, 2), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      warmScore = r - b;
    }
    return { photo, warmScore };
  });
  scored.sort((a, b) => b.warmScore - a.warmScore);
  const photo = scored[0].photo;
  usedIds.add(photo.id);

  const imgUrl = photo.src.large2x || photo.src.large;
  const destPath = path.join(DEMO_DIR, item.filename + ".jpg");
  console.log("  Downloading: " + photo.photographer + " (ID: " + photo.id + ")");
  await downloadFile(imgUrl, destPath);
  const stat = fs.statSync(destPath);
  console.log("  Saved: " + (stat.size / 1024).toFixed(0) + " KB");

  return { filename: item.filename, pexelsId: photo.id, photographer: photo.photographer };
}

async function optimizeProducts() {
  let sharp;
  try {
    sharp = require("sharp");
  } catch (e) {
    const nextSharpPath = path.join(__dirname, "..", "node_modules", "next", "node_modules", "sharp");
    sharp = require(nextSharpPath);
  }

  const files = fs.readdirSync(DEMO_DIR).filter((f) => f.endsWith(".jpg"));
  console.log("\nOptimizing " + files.length + " product images...");

  for (const file of files) {
    const inputPath = path.join(DEMO_DIR, file);
    const baseName = path.parse(file).name;

    // Square product images at multiple sizes
    const sizes = [
      { suffix: "-sm", width: 300 },
      { suffix: "-md", width: 500 },
      { suffix: "-lg", width: 800 },
    ];

    for (const size of sizes) {
      const webpOut = path.join(OPT_DIR, baseName + size.suffix + ".webp");
      await sharp(inputPath)
        .resize(size.width, size.width, { fit: "cover" })
        .webp({ quality: 80, effort: 6 })
        .toFile(webpOut);

      const stat = fs.statSync(webpOut);
      console.log("  " + baseName + size.suffix + ".webp (" + (stat.size / 1024).toFixed(0) + " KB)");
    }

    // JPG fallback at -md
    const jpgOut = path.join(OPT_DIR, baseName + "-md.jpg");
    await sharp(inputPath)
      .resize(500, 500, { fit: "cover" })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(jpgOut);
  }
}

async function main() {
  console.log("=== Fetching Product Images ===\n");

  const results = [];
  for (const product of products) {
    try {
      const result = await fetchProduct(product);
      if (result) results.push(result);
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      console.error("  ERROR: " + err.message);
    }
  }

  console.log("\nFetched " + results.length + " product images");

  await optimizeProducts();

  console.log("\n=== Done ===");
}

main().catch(console.error);

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
if (!PEXELS_API_KEY) {
  console.error("Missing PEXELS_API_KEY environment variable");
  process.exit(1);
}

const BASE_DIR = path.join(__dirname, "..", "public", "images", "demo");

// All media requests organized by directory
const mediaRequests = [
  // === HERO ===
  { dir: "hero", filename: "hero-bg-video", query: "luxury spa treatment slow motion", orientation: "landscape", type: "video" },

  // === HOME ===
  { dir: "home", filename: "about-teaser", query: "luxury spa interior warm golden light", orientation: "landscape", type: "image" },
  { dir: "home", filename: "testimonial-bg", query: "woman glowing skin portrait warm lighting", orientation: "landscape", type: "image" },
  { dir: "home", filename: "membership-teaser", query: "woman spa robe luxury relaxation", orientation: "portrait", type: "image" },

  // === SERVICES (cards - portrait 3:4) ===
  { dir: "services", filename: "botox-card", query: "botox aesthetic treatment clinic", orientation: "portrait", type: "image" },
  { dir: "services", filename: "fillers-card", query: "lip filler injection aesthetic beauty", orientation: "portrait", type: "image" },
  { dir: "services", filename: "chemical-peels-card", query: "chemical peel facial treatment skincare", orientation: "portrait", type: "image" },
  { dir: "services", filename: "microneedling-card", query: "microneedling treatment face beauty", orientation: "portrait", type: "image" },
  { dir: "services", filename: "laser-card", query: "laser skin treatment clinic beauty", orientation: "portrait", type: "image" },
  { dir: "services", filename: "iv-therapy-card", query: "iv therapy drip wellness luxury", orientation: "portrait", type: "image" },
  { dir: "services", filename: "body-contouring-card", query: "body contouring treatment aesthetic spa", orientation: "portrait", type: "image" },
  { dir: "services", filename: "facials-card", query: "luxury facial treatment spa woman", orientation: "portrait", type: "image" },
  { dir: "services", filename: "skin-rejuvenation-card", query: "skin rejuvenation treatment glowing beauty", orientation: "portrait", type: "image" },
  { dir: "services", filename: "wellness-consultation-card", query: "aesthetic consultation doctor patient beauty", orientation: "portrait", type: "image" },

  // === SERVICES (hero - landscape 16:9) ===
  { dir: "services", filename: "botox-hero", query: "botox injection close up aesthetic", orientation: "landscape", type: "image" },
  { dir: "services", filename: "fillers-hero", query: "dermal filler treatment beauty clinic", orientation: "landscape", type: "image" },
  { dir: "services", filename: "chemical-peels-hero", query: "facial peel skincare treatment glow", orientation: "landscape", type: "image" },
  { dir: "services", filename: "microneedling-hero", query: "microneedling facial treatment closeup", orientation: "landscape", type: "image" },
  { dir: "services", filename: "laser-hero", query: "laser treatment face skincare clinic", orientation: "landscape", type: "image" },
  { dir: "services", filename: "iv-therapy-hero", query: "iv drip therapy wellness clinic", orientation: "landscape", type: "image" },
  { dir: "services", filename: "body-contouring-hero", query: "body sculpting treatment spa aesthetic", orientation: "landscape", type: "image" },
  { dir: "services", filename: "facials-hero", query: "luxury facial spa treatment warm", orientation: "landscape", type: "image" },
  { dir: "services", filename: "skin-rejuvenation-hero", query: "skin rejuvenation facial beauty glow", orientation: "landscape", type: "image" },
  { dir: "services", filename: "wellness-consultation-hero", query: "doctor patient consultation aesthetic clinic", orientation: "landscape", type: "image" },

  // === ABOUT ===
  { dir: "about", filename: "clinic-interior", query: "luxury aesthetic clinic interior warm", orientation: "portrait", type: "image" },
  { dir: "about", filename: "team-member-1", query: "professional woman doctor portrait warm", orientation: "portrait", type: "image" },
  { dir: "about", filename: "team-member-2", query: "aesthetician portrait professional woman beauty", orientation: "portrait", type: "image" },
  { dir: "about", filename: "team-member-3", query: "medical professional headshot woman", orientation: "portrait", type: "image" },
  { dir: "about", filename: "team-member-4", query: "spa receptionist professional woman portrait", orientation: "portrait", type: "image" },

  // === CONTACT ===
  { dir: "contact", filename: "reception", query: "spa reception desk luxury warm interior", orientation: "portrait", type: "image" },

  // === FAQ ===
  { dir: "faq", filename: "header", query: "skincare products flat lay warm aesthetic", orientation: "landscape", type: "image" },
];

// Track used Pexels photo IDs to avoid duplicates
const usedPhotoIds = new Set();

async function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { Authorization: PEXELS_API_KEY } }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error("Failed to parse JSON: " + data.slice(0, 200)));
        }
      });
    });
    req.on("error", reject);
  });
}

async function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const req = protocol.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error("HTTP " + res.statusCode + " for " + url));
        return;
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve();
      });
      file.on("error", (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    });
    req.on("error", reject);
  });
}

function selectBestPhoto(photos) {
  const candidates = photos.filter((p) => !usedPhotoIds.has(p.id));
  const pool = candidates.length > 0 ? candidates : photos;

  // Warm-tone heuristic: prefer images where red > blue in avg_color
  const scored = pool.map((photo) => {
    let warmScore = 0;
    if (photo.avg_color) {
      const hex = photo.avg_color.replace("#", "");
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      warmScore = r - b + (g - b) * 0.5;
    }
    return { photo, warmScore };
  });

  scored.sort((a, b) => b.warmScore - a.warmScore);
  return scored[0] ? scored[0].photo : pool[0];
}

async function fetchImage(request) {
  const { dir, filename, query, orientation } = request;
  const destDir = path.join(BASE_DIR, dir);
  fs.mkdirSync(destDir, { recursive: true });

  const url = "https://api.pexels.com/v1/search?query=" +
    encodeURIComponent(query) +
    "&orientation=" + orientation +
    "&per_page=15&size=large";
  console.log("  Searching: \"" + query + "\" (" + orientation + ")...");

  let data = await fetchJSON(url);
  if (!data.photos || data.photos.length === 0) {
    console.log("  WARNING: No results for \"" + query + "\". Trying simpler query...");
    const simpleQuery = query.split(" ").slice(0, 3).join(" ");
    data = await fetchJSON(
      "https://api.pexels.com/v1/search?query=" +
        encodeURIComponent(simpleQuery) +
        "&orientation=" + orientation +
        "&per_page=15&size=large"
    );
    if (!data.photos || data.photos.length === 0) {
      console.log("  SKIPPED: No results for \"" + simpleQuery + "\" either.");
      return null;
    }
  }

  const photo = selectBestPhoto(data.photos);
  usedPhotoIds.add(photo.id);

  const imgUrl = photo.src.large2x || photo.src.large || photo.src.original;
  const destPath = path.join(destDir, filename + ".jpg");

  console.log("  Downloading: " + photo.photographer + " (ID: " + photo.id + ") -> " + filename + ".jpg");
  await downloadFile(imgUrl, destPath);

  const stat = fs.statSync(destPath);
  console.log("  Saved: " + (stat.size / 1024).toFixed(0) + " KB");

  return { filename, pexelsId: photo.id, photographer: photo.photographer, path: destPath };
}

async function fetchVideo(request) {
  const { dir, filename, query } = request;
  const destDir = path.join(BASE_DIR, dir);
  fs.mkdirSync(destDir, { recursive: true });

  const url = "https://api.pexels.com/videos/search?query=" +
    encodeURIComponent(query) +
    "&orientation=landscape&per_page=10&size=medium";
  console.log("  Searching video: \"" + query + "\"...");

  const data = await fetchJSON(url);
  if (!data.videos || data.videos.length === 0) {
    console.log("  WARNING: No video results for \"" + query + "\"");
    return null;
  }

  let bestVideo = null;
  let bestFile = null;

  for (const video of data.videos) {
    if (video.duration > 30) continue;

    const hdFile = video.video_files.find(
      (f) => f.quality === "hd" && f.width >= 1280 && f.file_type === "video/mp4"
    );
    const sdFile = video.video_files.find(
      (f) => f.quality === "sd" && f.width >= 960 && f.file_type === "video/mp4"
    );
    const file = hdFile || sdFile;

    if (file) {
      bestVideo = video;
      bestFile = file;
      break;
    }
  }

  if (!bestFile) {
    bestVideo = data.videos[0];
    bestFile = bestVideo.video_files.find((f) => f.file_type === "video/mp4");
    if (!bestFile) {
      console.log("  SKIPPED: No suitable video file found.");
      return null;
    }
  }

  const destPath = path.join(destDir, filename + ".mp4");
  console.log("  Downloading video (" + bestVideo.duration + "s, " + bestFile.width + "x" + bestFile.height + ") -> " + filename + ".mp4");
  await downloadFile(bestFile.link, destPath);

  const stat = fs.statSync(destPath);
  console.log("  Saved: " + (stat.size / 1024 / 1024).toFixed(1) + " MB");

  return { filename, pexelsId: bestVideo.id, path: destPath, duration: bestVideo.duration };
}

async function main() {
  console.log("=== MADE Med Spa - Demo Media Fetcher ===\n");
  console.log("Output directory: " + BASE_DIR + "\n");

  const results = [];
  let imageCount = 0;
  let videoCount = 0;

  for (const request of mediaRequests) {
    try {
      if (request.type === "video") {
        const result = await fetchVideo(request);
        if (result) {
          results.push(Object.assign({}, request, result));
          videoCount++;
        }
      } else {
        const result = await fetchImage(request);
        if (result) {
          results.push(Object.assign({}, request, result));
          imageCount++;
        }
      }
      // Respect rate limits
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      console.error("  ERROR fetching " + request.filename + ": " + err.message);
    }
  }

  console.log("\n=== Complete ===");
  console.log("Downloaded: " + imageCount + " images, " + videoCount + " videos");

  // Save metadata for manifest generation
  const metadataPath = path.join(BASE_DIR, "fetch-metadata.json");
  fs.writeFileSync(metadataPath, JSON.stringify(results, null, 2));
  console.log("Metadata saved to: " + metadataPath);
}

main().catch(console.error);

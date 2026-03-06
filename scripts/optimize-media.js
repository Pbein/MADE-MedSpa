const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Sharp is available via Next.js dependency
let sharp;
try {
  sharp = require("sharp");
} catch (e) {
  // Try resolving from Next.js node_modules
  const nextSharpPath = path.join(__dirname, "..", "node_modules", "next", "node_modules", "sharp");
  if (fs.existsSync(nextSharpPath)) {
    sharp = require(nextSharpPath);
  } else {
    console.error("sharp not found. Install with: npm install sharp");
    process.exit(1);
  }
}

const DEMO_DIR = path.join(__dirname, "..", "public", "images", "demo");
const OPT_DIR = path.join(__dirname, "..", "public", "images", "optimized");

// Size presets per usage type
const sizePresets = {
  card: [
    { suffix: "-sm", width: 400 },
    { suffix: "-md", width: 600 },
    { suffix: "-lg", width: 800 },
  ],
  hero: [
    { suffix: "-sm", width: 640 },
    { suffix: "-md", width: 960 },
    { suffix: "-lg", width: 1280 },
    { suffix: "-xl", width: 1920 },
  ],
  team: [
    { suffix: "-sm", width: 300 },
    { suffix: "-md", width: 450 },
    { suffix: "-lg", width: 600 },
  ],
  full: [
    { suffix: "-sm", width: 640 },
    { suffix: "-md", width: 960 },
    { suffix: "-lg", width: 1280 },
    { suffix: "-xl", width: 1920 },
  ],
};

// Map filenames to size presets and quality settings
function getPreset(filename) {
  if (filename.includes("-card")) return { sizes: sizePresets.card, quality: 80 };
  if (filename.includes("-hero")) return { sizes: sizePresets.hero, quality: 82 };
  if (filename.includes("team-member")) return { sizes: sizePresets.team, quality: 80 };
  if (filename.includes("testimonial")) return { sizes: sizePresets.full, quality: 75 };
  return { sizes: sizePresets.full, quality: 80 };
}

async function optimizeImage(inputPath, outputDir, baseName) {
  const preset = getPreset(baseName);

  fs.mkdirSync(outputDir, { recursive: true });

  const results = [];

  for (const size of preset.sizes) {
    // WebP (primary)
    const webpOut = path.join(outputDir, baseName + size.suffix + ".webp");
    await sharp(inputPath)
      .resize(size.width, null, { withoutEnlargement: true, fit: "cover" })
      .webp({ quality: preset.quality, effort: 6 })
      .toFile(webpOut);

    const webpStat = fs.statSync(webpOut);
    results.push({ file: baseName + size.suffix + ".webp", size: webpStat.size });

    // JPG fallback (only for -lg and -xl sizes)
    if (size.suffix === "-lg" || size.suffix === "-xl" || size.suffix === "-md") {
      const jpgOut = path.join(outputDir, baseName + size.suffix + ".jpg");
      await sharp(inputPath)
        .resize(size.width, null, { withoutEnlargement: true, fit: "cover" })
        .jpeg({ quality: preset.quality + 3, mozjpeg: true })
        .toFile(jpgOut);

      const jpgStat = fs.statSync(jpgOut);
      results.push({ file: baseName + size.suffix + ".jpg", size: jpgStat.size });
    }
  }

  return results;
}

async function optimizeVideo() {
  const inputPath = path.join(DEMO_DIR, "hero", "hero-bg-video.mp4");
  if (!fs.existsSync(inputPath)) {
    console.log("  No hero video found, skipping video optimization");
    return;
  }

  const heroDir = path.join(OPT_DIR, "hero");
  fs.mkdirSync(heroDir, { recursive: true });

  const mp4Out = path.join(heroDir, "hero-bg-video.mp4");
  const webmOut = path.join(heroDir, "hero-bg-video.webm");
  const posterOut = path.join(heroDir, "hero-poster.jpg");

  console.log("\n  Optimizing hero video...");

  // MP4 (H.264, 720p, no audio, 15s max)
  try {
    console.log("  Creating optimized MP4...");
    execSync(
      'ffmpeg -y -i "' + inputPath + '" ' +
      "-vf scale=1280:720 " +
      "-c:v libx264 -crf 28 -preset slow -an -movflags +faststart -t 15 " +
      '"' + mp4Out + '"',
      { stdio: "pipe" }
    );
    const mp4Stat = fs.statSync(mp4Out);
    console.log("  MP4: " + (mp4Stat.size / 1024 / 1024).toFixed(1) + " MB");
  } catch (err) {
    console.log("  WARNING: FFmpeg MP4 optimization failed: " + err.message.slice(0, 100));
    // Copy raw file as fallback
    fs.copyFileSync(inputPath, mp4Out);
  }

  // WebM (VP9, 720p)
  try {
    console.log("  Creating WebM...");
    execSync(
      'ffmpeg -y -i "' + inputPath + '" ' +
      "-vf scale=1280:720 " +
      "-c:v libvpx-vp9 -crf 35 -b:v 0 -an -t 15 " +
      '"' + webmOut + '"',
      { stdio: "pipe", timeout: 120000 }
    );
    const webmStat = fs.statSync(webmOut);
    console.log("  WebM: " + (webmStat.size / 1024 / 1024).toFixed(1) + " MB");
  } catch (err) {
    console.log("  WARNING: WebM creation failed (VP9 can be slow): " + err.message.slice(0, 100));
  }

  // Poster frame
  try {
    console.log("  Extracting poster frame...");
    execSync(
      'ffmpeg -y -i "' + inputPath + '" ' +
      '-vf "select=eq(n\\,30)" -vframes 1 -q:v 2 ' +
      '"' + posterOut + '"',
      { stdio: "pipe" }
    );
    console.log("  Poster frame saved");
  } catch (err) {
    console.log("  WARNING: Poster extraction failed: " + err.message.slice(0, 100));
    // Create poster from sharp instead
    try {
      // Just use first frame approach won't work without ffmpeg, skip
    } catch (e) {}
  }
}

async function main() {
  console.log("=== MADE Med Spa - Media Optimizer ===\n");

  const subdirs = ["hero", "services", "about", "home", "contact", "faq"];
  let totalFiles = 0;
  let totalSaved = 0;

  for (const subdir of subdirs) {
    const inputDir = path.join(DEMO_DIR, subdir);
    const outputDir = path.join(OPT_DIR, subdir);

    if (!fs.existsSync(inputDir)) continue;

    const files = fs.readdirSync(inputDir).filter((f) => f.endsWith(".jpg") || f.endsWith(".png"));

    if (files.length === 0) continue;

    console.log("\n--- " + subdir.toUpperCase() + " ---");

    for (const file of files) {
      const inputPath = path.join(inputDir, file);
      const baseName = path.parse(file).name;
      const inputStat = fs.statSync(inputPath);

      console.log("  " + file + " (" + (inputStat.size / 1024).toFixed(0) + " KB)");

      try {
        const results = await optimizeImage(inputPath, outputDir, baseName);
        for (const r of results) {
          const savings = (1 - r.size / inputStat.size) * 100;
          console.log("    -> " + r.file + " (" + (r.size / 1024).toFixed(0) + " KB" +
            (savings > 0 ? ", -" + savings.toFixed(0) + "%" : "") + ")");
          totalSaved += Math.max(0, inputStat.size - r.size);
        }
        totalFiles++;
      } catch (err) {
        console.error("    ERROR: " + err.message);
      }
    }
  }

  // Optimize video
  await optimizeVideo();

  console.log("\n=== Optimization Complete ===");
  console.log("Processed: " + totalFiles + " images");
  console.log("Approx savings: " + (totalSaved / 1024 / 1024).toFixed(1) + " MB");
}

main().catch(console.error);

"use client";

import { upload } from "@vercel/blob/client";
import imageCompression from "browser-image-compression";

const BLOB_HOST_HINT = ".public.blob.vercel-storage.com";

export function isBlobUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes(BLOB_HOST_HINT);
}

// Compression specs taken from the launch readiness handoff doc. Karlyne
// uploads at any size and we normalize to these targets so the live site
// loads fast no matter what she gives us. WebP wins on size unless we need
// a lossless logo (PNG with transparency).
export type UploadPurpose =
  | "service"     // 1600×1000  — service photos
  | "product"     // 1200×1200  — shop product photos
  | "headshot"    // 900×1200   — team headshots (vertical)
  | "avatar"      // 400×400    — testimonial avatars
  | "background"  // 2400×1600  — section backgrounds
  | "og"          // 1200×630   — social share image
  | "logo"        // pass through (transparent PNGs / SVGs)
  | "general";    // 2000×2000  — fallback

interface CompressionSpec {
  maxWidthOrHeight: number;
  maxSizeMB: number;
  initialQuality: number;
  fileType?: "image/webp" | "image/jpeg";
}

const SPECS: Record<UploadPurpose, CompressionSpec> = {
  service:    { maxWidthOrHeight: 1600, maxSizeMB: 0.4, initialQuality: 0.85, fileType: "image/webp" },
  product:    { maxWidthOrHeight: 1200, maxSizeMB: 0.3, initialQuality: 0.85, fileType: "image/webp" },
  headshot:   { maxWidthOrHeight: 1200, maxSizeMB: 0.4, initialQuality: 0.88, fileType: "image/webp" },
  avatar:     { maxWidthOrHeight: 400,  maxSizeMB: 0.1, initialQuality: 0.85, fileType: "image/webp" },
  background: { maxWidthOrHeight: 2400, maxSizeMB: 0.5, initialQuality: 0.82, fileType: "image/webp" },
  og:         { maxWidthOrHeight: 1200, maxSizeMB: 0.3, initialQuality: 0.88, fileType: "image/jpeg" },
  // Logos: don't recompress. Brand mark needs to stay sharp + transparent.
  logo:       { maxWidthOrHeight: 1200, maxSizeMB: 1.0, initialQuality: 1.0 },
  general:    { maxWidthOrHeight: 2000, maxSizeMB: 0.5, initialQuality: 0.85, fileType: "image/webp" },
};

function shouldCompress(file: Blob): boolean {
  if (!(file instanceof File)) return false;
  if (!file.type.startsWith("image/")) return false;
  // SVG is vector — compressing rasterizes it. Skip.
  if (file.type === "image/svg+xml") return false;
  // GIF: skip; conversion would lose animation.
  if (file.type === "image/gif") return false;
  return true;
}

async function compressImage(file: File, purpose: UploadPurpose): Promise<File> {
  const spec = SPECS[purpose];
  // PNG with transparency stays PNG; logos stay logos.
  const isPng = file.type === "image/png";
  const fileType = purpose === "logo"
    ? undefined
    : isPng && purpose !== "general"
      ? undefined  // preserve PNG transparency for non-general uploads
      : spec.fileType;

  const compressed = await imageCompression(file, {
    maxWidthOrHeight: spec.maxWidthOrHeight,
    maxSizeMB: spec.maxSizeMB,
    initialQuality: spec.initialQuality,
    useWebWorker: true,
    fileType,
    // Keep EXIF orientation correct (so phone photos aren't rotated).
    preserveExif: false,
  });

  return compressed;
}

function withFormSuffix(filename: string, mime: string): string {
  // After WebP conversion, swap the extension so the URL extension is honest.
  const base = filename.replace(/\.[^./\\]+$/, "");
  if (mime === "image/webp") return `${base}.webp`;
  if (mime === "image/jpeg") return `${base}.jpg`;
  return filename;
}

export async function uploadBlob(
  file: Blob,
  options?: {
    filename?: string;
    prefix?: string;
    purpose?: UploadPurpose;
  }
): Promise<string> {
  const purpose = options?.purpose ?? "general";

  let toUpload: Blob = file;
  let filename = options?.filename
    ?? (file instanceof File ? file.name : `upload-${Date.now()}`);

  // Compress images before upload — Karlyne can drop a 10MB phone JPG and we
  // store ~300KB WebP. Site stays fast, bandwidth bill stays small. SVGs,
  // GIFs, videos pass through untouched.
  if (file instanceof File && shouldCompress(file)) {
    try {
      const compressed = await compressImage(file, purpose);
      toUpload = compressed;
      filename = withFormSuffix(filename, compressed.type);
    } catch (err) {
      // Compression failure shouldn't block the upload — fall back to original.
      // Logged so we can investigate corrupt-file edge cases.
      // eslint-disable-next-line no-console
      console.warn("[uploadBlob] compression failed, using original:", err);
    }
  }

  const pathname = options?.prefix
    ? `${options.prefix.replace(/^\/+|\/+$/g, "")}/${filename}`
    : filename;

  const result = await upload(pathname, toUpload, {
    access: "public",
    handleUploadUrl: "/api/admin/blob/upload",
  });

  return result.url;
}

export async function deleteBlob(url: string): Promise<void> {
  if (!isBlobUrl(url)) return;
  await fetch("/api/admin/blob/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
}

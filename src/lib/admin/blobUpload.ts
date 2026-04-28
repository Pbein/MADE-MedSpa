"use client";

import { upload } from "@vercel/blob/client";

const BLOB_HOST_HINT = ".public.blob.vercel-storage.com";

export function isBlobUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes(BLOB_HOST_HINT);
}

export async function uploadBlob(
  file: Blob,
  options?: { filename?: string; prefix?: string }
): Promise<string> {
  const filename = options?.filename
    ?? (file instanceof File ? file.name : `upload-${Date.now()}`);
  const pathname = options?.prefix
    ? `${options.prefix.replace(/^\/+|\/+$/g, "")}/${filename}`
    : filename;

  const result = await upload(pathname, file, {
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

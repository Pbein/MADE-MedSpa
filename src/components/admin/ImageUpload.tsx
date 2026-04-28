"use client";

import { useState, useRef } from "react";
import { uploadBlob, deleteBlob } from "@/lib/admin/blobUpload";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
  aspect?: string;
  prefix?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = "Image",
  accept = "image/*",
  aspect = "4/3",
  prefix = "uploads",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    const previousUrl = value;
    try {
      const url = await uploadBlob(file, { prefix });
      onChange(url);
      if (previousUrl) {
        deleteBlob(previousUrl).catch(() => {});
      }
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    const previousUrl = value;
    onChange("");
    if (fileRef.current) fileRef.current.value = "";
    if (previousUrl) {
      deleteBlob(previousUrl).catch(() => {});
    }
  }

  return (
    <div>
      <label
        className="mb-1 block text-[13px] font-medium uppercase tracking-wider"
        style={{ color: "#111827" }}
      >
        {label}
      </label>

      {/* Preview */}
      {value && (
        <div
          style={{
            marginBottom: "0.75rem",
            maxWidth: 200,
            borderRadius: "0.375rem",
            overflow: "hidden",
            border: "1px solid #e5e7eb",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            style={{
              width: "100%",
              aspectRatio: aspect,
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      )}

      {/* Upload area */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            border: "1px solid #e5e7eb",
            borderRadius: "0.375rem",
            backgroundColor: "#fff",
            color: "#374151",
            fontSize: "0.875rem",
            cursor: uploading ? "wait" : "pointer",
            opacity: uploading ? 0.6 : 1,
          }}
        >
          {uploading ? "Uploading..." : value ? "Replace Image" : "Upload Image"}
          <input
            ref={fileRef}
            type="file"
            accept={accept}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            style={{ display: "none" }}
            disabled={uploading}
          />
        </label>

        {value && (
          <button
            type="button"
            onClick={handleRemove}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #fca5a5",
              borderRadius: "0.375rem",
              backgroundColor: "transparent",
              color: "#dc2626",
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            Remove
          </button>
        )}
      </div>

      {error && (
        <p style={{ fontSize: "0.8125rem", color: "#dc2626", marginTop: "0.5rem" }}>
          {error}
        </p>
      )}
    </div>
  );
}

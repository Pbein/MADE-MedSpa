"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
  aspect?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = "Image",
  accept = "image/*",
  aspect = "4/3",
}: ImageUploadProps) {
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!result.ok) throw new Error("Upload failed");
      const { storageId } = await result.json();
      const getUrlMutation = api.storage.getUrl;
      const url = await fetch(
        `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/query`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: "storage:getUrl",
            args: { storageId },
          }),
        }
      );
      // Use the Convex storage URL pattern
      void getUrlMutation;
      const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.replace(
        ".cloud",
        ".site"
      );
      const storageUrl = `${convexSiteUrl}/api/storage/${storageId}`;
      void url;
      onChange(storageUrl);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    onChange("");
    if (fileRef.current) fileRef.current.value = "";
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

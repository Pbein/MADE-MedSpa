"use client";

import { useState, useCallback, useRef } from "react";
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import type { SectionDefinition } from "@/lib/sectionDefinitions";
import SectionDesignPanel from "./SectionDesignPanel";

// ── Styles ───────────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  border: "1px solid #e5e7eb",
  borderRadius: "0.375rem",
  fontSize: "0.9375rem",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  fontWeight: 600,
  color: "#6b7280",
  marginBottom: "0.25rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

// ── Media Upload Field ──────────────────────────────────────────────────────

function MediaField({
  mediaKey,
  label,
  type,
  aspect,
  defaultUrl,
  description,
}: {
  mediaKey: string;
  label: string;
  type: "image" | "video";
  aspect?: string;
  defaultUrl: string;
  description?: string;
}) {
  const content = useQuery(api.siteContent.getByKey, { key: mediaKey });
  const upsert = useMutation(api.siteContent.upsert);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const convex = useConvex();
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const currentUrl = content?.imageUrl || defaultUrl;

  async function uploadBlob(blob: Blob): Promise<string> {
    const url = await generateUploadUrl();
    const result = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": blob.type },
      body: blob,
    });
    const { storageId } = await result.json();
    const storageUrl = await convex.query(api.storage.getUrl, { storageId });
    if (!storageUrl) throw new Error("Failed to resolve URL");
    return storageUrl;
  }

  function extractFirstFrame(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";
      const objectUrl = URL.createObjectURL(file);
      video.src = objectUrl;
      video.addEventListener("seeked", () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d")!.drawImage(video, 0, 0);
        URL.revokeObjectURL(objectUrl);
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error("Frame capture failed"))),
          "image/webp",
          0.85
        );
      }, { once: true });
      video.addEventListener("error", () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Could not load video"));
      }, { once: true });
      video.addEventListener("loadeddata", () => {
        video.currentTime = 0.1;
      }, { once: true });
    });
  }

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const storageUrl = await uploadBlob(file);
      await upsert({ key: mediaKey, imageUrl: storageUrl });

      // Auto-generate poster from first frame when uploading hero video
      if (mediaKey === "hero_video" && file.type.startsWith("video/")) {
        try {
          const posterBlob = await extractFirstFrame(file);
          const posterUrl = await uploadBlob(posterBlob);
          await upsert({ key: "hero_poster", imageUrl: posterUrl });
        } catch {
          // Poster generation is best-effort
        }
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <label style={labelStyle}>{label}</label>
      {description && (
        <p style={{ fontSize: "0.75rem", color: "#9ca3af", margin: "0 0 0.5rem 0" }}>{description}</p>
      )}
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
        <div style={{
          width: type === "video" ? 200 : 100,
          borderRadius: "0.375rem",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          backgroundColor: "#f9fafb",
          flexShrink: 0,
        }}>
          {type === "video" ? (
            <video
              key={currentUrl}
              src={currentUrl}
              autoPlay
              loop
              muted
              playsInline
              style={{ width: "100%", aspectRatio: aspect || "16/9", objectFit: "cover", display: "block" }}
            />
          ) : (
            <img
              src={currentUrl}
              alt={label}
              style={{ width: "100%", aspectRatio: aspect || "4/3", objectFit: "cover", display: "block" }}
            />
          )}
        </div>
        <div>
          <label style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.4rem 0.75rem",
            border: "1px dashed #d1d5db",
            borderRadius: "0.375rem",
            backgroundColor: "#f9fafb",
            fontSize: "0.8125rem",
            cursor: uploading ? "wait" : "pointer",
            opacity: uploading ? 0.6 : 1,
          }}>
            {uploading ? "Uploading..." : "Replace"}
            <input
              ref={fileRef}
              type="file"
              accept={type === "video" ? "video/mp4,video/webm" : "image/*"}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
              style={{ display: "none" }}
              disabled={uploading}
            />
          </label>
          {saved && <span style={{ fontSize: "0.75rem", color: "#16a34a", marginLeft: 8 }}>Saved!</span>}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function SectionEditorCard({
  section,
  pageKey,
  pagePath,
}: {
  section: SectionDefinition;
  pageKey: string;
  pagePath: string;
}) {
  const content = useQuery(api.siteContent.getByKey, { key: section.contentKey });
  const upsert = useMutation(api.siteContent.upsert);

  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Build defaults from field definitions
  const defaults: Record<string, unknown> = {};
  for (const field of section.fields) {
    defaults[field.fieldKey] = field.defaultValue;
  }

  // Current values: merge DB metadata with defaults
  const dbMeta = (content?.metadata as Record<string, unknown>) || {};
  const currentValues = { ...defaults, ...dbMeta };

  // Local draft state
  const [draft, setDraft] = useState<Record<string, unknown>>(currentValues);

  // Sync from DB when content loads
  const contentId = content?._id;
  const [lastSyncId, setLastSyncId] = useState<string | null>(null);
  if (contentId && contentId !== lastSyncId) {
    setLastSyncId(contentId);
    setDraft({ ...defaults, ...(content?.metadata as Record<string, unknown> || {}) });
  }

  const updateField = useCallback((key: string, value: unknown) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      // Only save fields that differ from defaults
      const metadata: Record<string, unknown> = {};
      for (const field of section.fields) {
        const val = draft[field.fieldKey];
        if (val !== undefined && JSON.stringify(val) !== JSON.stringify(field.defaultValue)) {
          metadata[field.fieldKey] = val;
        }
      }
      await upsert({ key: section.contentKey, metadata });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }, [draft, section, upsert]);

  const handleReset = useCallback(async () => {
    setDraft({ ...defaults });
    setSaving(true);
    try {
      await upsert({ key: section.contentKey, metadata: {} });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }, [defaults, section.contentKey, upsert]);

  const hasEdits = Object.keys(dbMeta).length > 0;

  return (
    <div style={{
      backgroundColor: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "0.5rem",
      overflow: "hidden",
    }}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "0.875rem 1.25rem",
          border: "none",
          background: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827", display: "flex", alignItems: "center", gap: 6 }}>
            {section.label}
            {hasEdits && (
              <span style={{
                padding: "0.1rem 0.4rem",
                borderRadius: "9999px",
                fontSize: "0.625rem",
                fontWeight: 500,
                backgroundColor: "#EEF2FF",
                color: "#4338CA",
              }}>
                Edited
              </span>
            )}
          </div>
          <div style={{ fontSize: "0.8125rem", color: "#9ca3af", marginTop: 1 }}>
            {section.description}
          </div>
        </div>
        <span style={{
          fontSize: 16,
          color: "#9ca3af",
          transform: expanded ? "rotate(180deg)" : "rotate(0)",
          transition: "transform 0.15s ease",
          flexShrink: 0,
          marginLeft: 12,
        }}>
          &#9662;
        </span>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div style={{ padding: "0 1.25rem 1.25rem", borderTop: "1px solid #f3f4f6" }}>
          {/* Text Fields */}
          {section.fields.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              {section.fields.filter((f) => f.type !== "richlist").map((field) => (
                <div key={field.fieldKey} style={{ marginBottom: "0.75rem" }}>
                  <label style={labelStyle}>{field.label}</label>
                  {field.type === "textarea" ? (
                    <textarea
                      value={(draft[field.fieldKey] as string) || ""}
                      onChange={(e) => updateField(field.fieldKey, e.target.value || undefined)}
                      placeholder={typeof field.defaultValue === "string" ? field.defaultValue : ""}
                      rows={3}
                      style={{ ...inputStyle, resize: "vertical" }}
                    />
                  ) : (
                    <input
                      type={field.type === "url" ? "url" : "text"}
                      value={(draft[field.fieldKey] as string) || ""}
                      onChange={(e) => updateField(field.fieldKey, e.target.value || undefined)}
                      placeholder={typeof field.defaultValue === "string" ? field.defaultValue : ""}
                      style={inputStyle}
                    />
                  )}
                </div>
              ))}

              {/* Rich list fields (values, steps, tips) */}
              {section.fields.filter((f) => f.type === "richlist").map((field) => {
                const items = (draft[field.fieldKey] || field.defaultValue) as unknown[];
                return (
                  <div key={field.fieldKey} style={{ marginBottom: "0.75rem" }}>
                    <label style={labelStyle}>{field.label}</label>
                    <div style={{
                      padding: "0.75rem",
                      backgroundColor: "#f9fafb",
                      borderRadius: "0.375rem",
                      border: "1px solid #e5e7eb",
                      fontSize: "0.8125rem",
                      color: "#6b7280",
                    }}>
                      {Array.isArray(items) && items.map((item, i) => (
                        <div key={i} style={{
                          padding: "0.375rem 0",
                          borderBottom: i < items.length - 1 ? "1px solid #e5e7eb" : "none",
                        }}>
                          {typeof item === "string"
                            ? item
                            : typeof item === "object" && item !== null
                              ? Object.values(item as Record<string, string>).join(" — ")
                              : String(item)}
                        </div>
                      ))}
                      <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.5rem", marginBottom: 0 }}>
                        Rich list editing coming soon. For now, manage this content in the code.
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Media Fields */}
          {section.media.length > 0 && (
            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #f3f4f6" }}>
              {section.media.map((media) => (
                <MediaField
                  key={media.mediaKey}
                  mediaKey={media.mediaKey}
                  label={media.label}
                  type={media.type}
                  aspect={media.aspect}
                  defaultUrl={media.defaultUrl}
                  description={media.description}
                />
              ))}
            </div>
          )}

          {/* CRUD Reference */}
          {section.crud && (
            <div style={{
              marginTop: "1rem",
              padding: "0.75rem 1rem",
              backgroundColor: "#f9fafb",
              borderRadius: "0.375rem",
              border: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontSize: "0.8125rem", color: "#374151", fontWeight: 500 }}>
                  {section.crud.description}
                </div>
              </div>
              <Link
                href={section.crud.manageHref}
                style={{
                  padding: "0.375rem 0.75rem",
                  backgroundColor: "#6366f1",
                  color: "#fff",
                  borderRadius: "0.375rem",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {section.crud.manageLabel}
              </Link>
            </div>
          )}

          {/* Section Design Customizer */}
          {section.hasColorOverride && (
            <SectionDesignPanel
              pageKey={pageKey}
              sectionKey={section.key}
              pagePath={pagePath}
              sectionLabel={section.label}
              fieldValues={draft}
              fieldDefinitions={section.fields}
            />
          )}

          {/* Actions */}
          {section.fields.length > 0 && (
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "1rem",
              paddingTop: "0.75rem",
              borderTop: "1px solid #f3f4f6",
            }}>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {hasEdits && (
                  <button
                    onClick={handleReset}
                    style={{
                      padding: "0.375rem 0.75rem",
                      border: "1px solid #fca5a5",
                      borderRadius: "0.375rem",
                      backgroundColor: "transparent",
                      color: "#dc2626",
                      fontSize: "0.8125rem",
                      cursor: "pointer",
                    }}
                  >
                    Reset to Defaults
                  </button>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {saved && <span style={{ fontSize: "0.8125rem", color: "#16a34a", fontWeight: 500 }}>Saved!</span>}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    padding: "0.375rem 1rem",
                    border: "none",
                    borderRadius: "0.375rem",
                    backgroundColor: "#6366f1",
                    color: "#fff",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    opacity: saving ? 0.6 : 1,
                  }}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

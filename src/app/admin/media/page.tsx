"use client";

import { useState, useRef, useMemo } from "react";
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "../../../../convex/_generated/api";

// ── Media slot definitions ──────────────────────────────────────────────────
// Each slot maps to a siteContent key. The frontend reads these keys and
// falls back to hardcoded defaults when no DB value exists.

interface MediaSlot {
  key: string;
  label: string;
  description: string;
  type: "image" | "video";
  aspect?: string; // CSS aspect-ratio for preview
  defaultUrl: string;
}

const MEDIA_SLOTS: MediaSlot[] = [
  {
    key: "hero_video",
    label: "Hero Background Video",
    description: "Looping background video on the homepage hero. MP4, ideally under 5 MB.",
    type: "video",
    aspect: "16/9",
    defaultUrl: "/videos/hero.mp4",
  },
  {
    key: "hero_poster",
    label: "Hero Poster / Fallback Image",
    description: "Still image shown while the hero video loads or on mobile.",
    type: "image",
    aspect: "16/9",
    defaultUrl: "https://placehold.co/1920x1080/391e1e/c6a87d?text=MADE+Med+Spa",
  },
  {
    key: "about_philosophy_image",
    label: "Homepage — Philosophy Image",
    description: "Large editorial image in the Where Science Meets Artistry section.",
    type: "image",
    aspect: "4/5",
    defaultUrl: "https://placehold.co/800x1000/4a2c17/f5f0e8?text=Our+Philosophy",
  },
  {
    key: "services_hero_bg",
    label: "Services Page — Hero Background",
    description: "Full-bleed background image behind the Services page hero headline.",
    type: "image",
    aspect: "21/9",
    defaultUrl: "https://placehold.co/2100x900/4a2c17/f5f0e8?text=Services+Hero",
  },
  {
    key: "about_hero_bg",
    label: "About Page — Hero Background",
    description: "Full-bleed background image behind the About page hero headline.",
    type: "image",
    aspect: "21/9",
    defaultUrl: "https://placehold.co/2100x900/4a2c17/f5f0e8?text=About+Hero",
  },
  {
    key: "contact_hero_bg",
    label: "Contact Page — Hero Background",
    description: "Full-bleed background image behind the Contact page hero headline.",
    type: "image",
    aspect: "21/9",
    defaultUrl: "https://placehold.co/2100x900/391e1e/c6a87d?text=Contact+Hero",
  },
  {
    key: "about_story_image",
    label: "About Page — Our Story Image",
    description: "Image beside the founding story on the About page.",
    type: "image",
    aspect: "4/5",
    defaultUrl: "https://placehold.co/800x1000/4a2c17/f5f0e8?text=Our+Story",
  },
  {
    key: "testimonial_portrait",
    label: "Testimonials — Portrait Image",
    description: "Portrait displayed alongside client testimonials on the homepage.",
    type: "image",
    aspect: "3/4",
    defaultUrl: "https://placehold.co/600x800/5c3a1e/f5f0e8?text=Client+Portrait",
  },
  {
    key: "featured_service_image_1",
    label: "Featured Service 1 — Image",
    description: "Fallback image for the first featured service card on the homepage.",
    type: "image",
    aspect: "1/1",
    defaultUrl: "https://placehold.co/600x600/3c2415/f5f0e8?text=Service+1",
  },
  {
    key: "featured_service_image_2",
    label: "Featured Service 2 — Image",
    description: "Fallback image for the second featured service card on the homepage.",
    type: "image",
    aspect: "1/1",
    defaultUrl: "https://placehold.co/600x600/5c3a1e/f5f0e8?text=Service+2",
  },
  {
    key: "featured_service_image_3",
    label: "Featured Service 3 — Image",
    description: "Fallback image for the third featured service card on the homepage.",
    type: "image",
    aspect: "1/1",
    defaultUrl: "https://placehold.co/600x600/4a2c17/f5f0e8?text=Service+3",
  },
  {
    key: "testimonial_bg",
    label: "Testimonials — Background Texture",
    description: "Soft texture image behind the client testimonials section on the homepage.",
    type: "image",
    aspect: "21/9",
    defaultUrl: "https://placehold.co/2100x900/f5f0e8/e0d0be?text=Testimonial+BG",
  },
];

// ── Shared styles ───────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  border: "1px solid #e5e7eb",
  borderRadius: "0.375rem",
  fontSize: "0.9375rem",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "#111827",
  marginBottom: "0.25rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const btnPrimary: React.CSSProperties = {
  padding: "0.4rem 0.8rem",
  border: "none",
  borderRadius: "0.375rem",
  backgroundColor: "#6366f1",
  color: "#fff",
  fontSize: "0.875rem",
  fontWeight: 500,
  cursor: "pointer",
};

const btnSecondary: React.CSSProperties = {
  padding: "0.4rem 0.8rem",
  border: "1px solid #e5e7eb",
  borderRadius: "0.375rem",
  backgroundColor: "transparent",
  color: "#111827",
  fontSize: "0.875rem",
  cursor: "pointer",
};

// ── Single media slot card ──────────────────────────────────────────────────

function MediaSlotCard({
  slot,
  currentUrl,
  onSave,
}: {
  slot: MediaSlot;
  currentUrl: string;
  onSave: (key: string, url: string) => Promise<void>;
}) {
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const convex = useConvex();
  const [editing, setEditing] = useState(false);
  const [urlValue, setUrlValue] = useState(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const displayUrl = currentUrl || slot.defaultUrl;

  async function handleFileUpload(file: File) {
    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      const convexUrl = await convex.query(api.storage.getUrl, { storageId });
      if (!convexUrl) throw new Error("Failed to resolve storage URL");
      setUrlValue(convexUrl);
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    await onSave(slot.key, urlValue);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleCancel() {
    setEditing(false);
    setUrlValue(currentUrl);
  }

  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "0.5rem",
        padding: "1.25rem 1.5rem",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1rem",
        }}
      >
        <div>
          <span
            style={{
              display: "inline-flex",
              padding: "0.125rem 0.5rem",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontWeight: 500,
              backgroundColor: slot.type === "video" ? "#7c3aed" : "#6366f1",
              color: "#fff",
              marginBottom: "0.25rem",
            }}
          >
            {slot.type === "video" ? "Video" : "Image"}
          </span>
          <h3
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "#111827",
              margin: "0.25rem 0 0 0",
            }}
          >
            {slot.label}
          </h3>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
              margin: "0.25rem 0 0 0",
            }}
          >
            {slot.description}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {saved && (
            <span
              style={{ fontSize: "0.875rem", color: "#16a34a", fontWeight: 500 }}
            >
              Saved!
            </span>
          )}
          {!editing && (
            <button
              onClick={() => {
                setUrlValue(currentUrl || slot.defaultUrl);
                setEditing(true);
              }}
              style={{
                ...btnSecondary,
                color: "#4f46e5",
                fontWeight: 500,
              }}
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Preview */}
      <div
        style={{
          backgroundColor: "#f9fafb",
          borderRadius: "0.375rem",
          overflow: "hidden",
          marginBottom: editing ? "1rem" : 0,
          maxWidth: slot.type === "video" ? "100%" : 320,
        }}
      >
        {slot.type === "video" ? (
          <video
            key={displayUrl}
            src={displayUrl}
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "100%",
              aspectRatio: slot.aspect || "16/9",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <img
            src={displayUrl}
            alt={slot.label}
            style={{
              width: "100%",
              aspectRatio: slot.aspect || "4/3",
              objectFit: "cover",
              display: "block",
            }}
          />
        )}
      </div>

      {/* Editing form */}
      {editing && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {/* URL input */}
          <div>
            <label style={labelStyle}>URL</label>
            <input
              type="text"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              placeholder="https://... or /videos/hero.mp4"
              style={inputStyle}
            />
            <p
              style={{
                fontSize: "0.75rem",
                color: "#9ca3af",
                margin: "0.25rem 0 0 0",
              }}
            >
              Paste a URL or upload a file below.
            </p>
          </div>

          {/* File upload */}
          <div>
            <label style={labelStyle}>Or Upload File</label>
            <input
              ref={fileRef}
              type="file"
              accept={slot.type === "video" ? "video/mp4,video/webm" : "image/*"}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              style={{
                fontSize: "0.875rem",
                color: "#374151",
              }}
            />
            {uploading && (
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#6366f1",
                  margin: "0.5rem 0 0 0",
                }}
              >
                Uploading...
              </p>
            )}
          </div>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "flex-end",
            }}
          >
            {currentUrl && (
              <button
                onClick={async () => {
                  setUrlValue("");
                  await onSave(slot.key, "");
                  setEditing(false);
                  setSaved(true);
                  setTimeout(() => setSaved(false), 2000);
                }}
                style={{
                  ...btnSecondary,
                  color: "#dc2626",
                  borderColor: "#fca5a5",
                  marginRight: "auto",
                }}
              >
                Reset to Default
              </button>
            )}
            <button onClick={handleCancel} style={btnSecondary}>
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={uploading}
              style={{
                ...btnPrimary,
                opacity: uploading ? 0.5 : 1,
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function AdminMediaPage() {
  const dbContent = useQuery(api.siteContent.list);
  const upsertContent = useMutation(api.siteContent.upsert);

  const mediaMap = useMemo(() => {
    if (!dbContent) return new Map<string, string>();
    const map = new Map<string, string>();
    for (const row of dbContent) {
      if (row.imageUrl) {
        map.set(row.key, row.imageUrl);
      }
    }
    return map;
  }, [dbContent]);

  async function handleSave(key: string, url: string) {
    await upsertContent({ key, imageUrl: url || undefined });
  }

  if (dbContent === undefined) {
    return (
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "2rem 1.5rem",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "#111827",
            margin: "0 0 0.25rem 0",
          }}
        >
          Site Media
        </h1>
        <p style={{ fontSize: "0.9375rem", color: "#374151", margin: 0 }}>
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "2rem 1.5rem",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "#111827",
            margin: "0 0 0.25rem 0",
          }}
        >
          Site Media
        </h1>
        <p style={{ fontSize: "0.9375rem", color: "#374151", margin: 0 }}>
          Manage the images and videos displayed across the website. Each slot
          shows the current media with a preview. Edit to paste a new URL or
          upload a replacement file.
        </p>
      </div>

      {/* Media slots */}
      <div
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        {MEDIA_SLOTS.map((slot) => (
          <MediaSlotCard
            key={slot.key}
            slot={slot}
            currentUrl={mediaMap.get(slot.key) || ""}
            onSave={handleSave}
          />
        ))}
      </div>
    </div>
  );
}

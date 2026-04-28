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
  aspect?: string;
  defaultUrl: string;
  category: "content" | "hero" | "background";
}

const MEDIA_SLOTS: MediaSlot[] = [
  // ── CONTENT IMAGES — Primary visual content shown to visitors ──
  {
    key: "about_philosophy_image",
    label: "Homepage — Philosophy Image",
    description: "Large editorial image in the 'Where Science Meets Artistry' section on the homepage.",
    type: "image",
    aspect: "4/5",
    defaultUrl: "https://placehold.co/800x1000/4a2c17/f5f0e8?text=Our+Philosophy",
    category: "content",
  },
  {
    key: "about_story_image",
    label: "About Page — Our Story Image",
    description: "Image beside the founding story on the About page.",
    type: "image",
    aspect: "4/5",
    defaultUrl: "https://placehold.co/800x1000/4a2c17/f5f0e8?text=Our+Story",
    category: "content",
  },
  {
    key: "featured_service_image_1",
    label: "Featured Service 1 — Fallback Image",
    description: "Shown on the first homepage service card when the service has no image set.",
    type: "image",
    aspect: "4/5",
    defaultUrl: "https://placehold.co/600x750/3c2415/f5f0e8?text=Service+1",
    category: "content",
  },
  {
    key: "featured_service_image_2",
    label: "Featured Service 2 — Fallback Image",
    description: "Shown on the second homepage service card when the service has no image set.",
    type: "image",
    aspect: "4/5",
    defaultUrl: "https://placehold.co/600x750/5c3a1e/f5f0e8?text=Service+2",
    category: "content",
  },
  {
    key: "featured_service_image_3",
    label: "Featured Service 3 — Fallback Image",
    description: "Shown on the third homepage service card when the service has no image set.",
    type: "image",
    aspect: "4/5",
    defaultUrl: "https://placehold.co/600x750/4a2c17/f5f0e8?text=Service+3",
    category: "content",
  },

  // ── HERO SECTIONS — Full-bleed hero backgrounds and video ──
  {
    key: "hero_video",
    label: "Homepage — Hero Video",
    description: "Looping background video on the homepage hero. MP4, ideally under 5 MB.",
    type: "video",
    aspect: "16/9",
    defaultUrl: "/videos/hero.mp4",
    category: "hero",
  },
  {
    key: "hero_poster",
    label: "Homepage — Hero Poster",
    description: "Still image shown while the hero video loads or if video fails.",
    type: "image",
    aspect: "16/9",
    defaultUrl: "https://placehold.co/1920x1080/391e1e/c6a87d?text=MADE+Med+Spa",
    category: "hero",
  },
  {
    key: "services_hero_bg",
    label: "Services Page — Hero Background",
    description: "Background image behind the Services page headline.",
    type: "image",
    aspect: "21/9",
    defaultUrl: "https://placehold.co/2100x900/4a2c17/f5f0e8?text=Services+Hero",
    category: "hero",
  },
  {
    key: "about_hero_bg",
    label: "About Page — Hero Background",
    description: "Background image behind the About page headline.",
    type: "image",
    aspect: "21/9",
    defaultUrl: "https://placehold.co/2100x900/4a2c17/f5f0e8?text=About+Hero",
    category: "hero",
  },
  {
    key: "contact_hero_bg",
    label: "Contact Page — Hero Background",
    description: "Silk texture behind the Contact page hero. Dark espresso/mocha tones.",
    type: "image",
    aspect: "21/9",
    defaultUrl: "/images/contact-hero-bg.png",
    category: "hero",
  },

  // ── BACKGROUND TEXTURES — Subtle decorative textures ──
  {
    key: "testimonial_bg",
    label: "Testimonials — Background Texture",
    description: "Soft texture behind the client testimonials section on the homepage.",
    type: "image",
    aspect: "21/9",
    defaultUrl: "https://placehold.co/2100x900/f5f0e8/e0d0be?text=Testimonial+BG",
    category: "background",
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
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const displayUrl = currentUrl || slot.defaultUrl;

  function validateFile(file: File): string | null {
    if (slot.type === "video") {
      const accepted = ["video/mp4", "video/webm"];
      if (!accepted.includes(file.type)) {
        const ext = file.name.split(".").pop()?.toUpperCase() ?? "this format";
        return `${ext} files aren't supported. Please upload an MP4 or WebM. To convert: HandBrake (free desktop app) or cloudconvert.com.`;
      }
      const MAX = 25 * 1024 * 1024;
      if (file.size > MAX) {
        return `Video is ${(file.size / 1024 / 1024).toFixed(1)} MB — please keep hero videos under 25 MB so the page loads quickly. Compress with HandBrake.`;
      }
    } else {
      if (!file.type.startsWith("image/")) {
        const ext = file.name.split(".").pop()?.toUpperCase() ?? "this format";
        return `${ext} files aren't supported. Please upload a JPG, PNG, or WebP image.`;
      }
    }
    return null;
  }

  async function uploadBlob(blob: Blob): Promise<string> {
    const uploadUrl = await generateUploadUrl();
    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": blob.type },
      body: blob,
    });
    const { storageId } = await result.json();
    const convexUrl = await convex.query(api.storage.getUrl, { storageId });
    if (!convexUrl) throw new Error("Failed to resolve storage URL");
    return convexUrl;
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

  async function handleFileUpload(file: File) {
    setUploadError(null);
    const validationError = validateFile(file);
    if (validationError) {
      setUploadError(validationError);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    setUploading(true);
    try {
      const convexUrl = await uploadBlob(file);
      setUrlValue(convexUrl);

      // Auto-generate poster from first frame when uploading a hero video
      if (slot.key === "hero_video" && file.type.startsWith("video/")) {
        try {
          const posterBlob = await extractFirstFrame(file);
          const posterUrl = await uploadBlob(posterBlob);
          await onSave("hero_poster", posterUrl);
        } catch {
          // Poster generation is best-effort — video upload still succeeds
        }
      }
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
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1.25rem",
                border: "2px dashed #d1d5db",
                borderRadius: "0.5rem",
                backgroundColor: "#f9fafb",
                color: uploading ? "#9ca3af" : "#374151",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: uploading ? "wait" : "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              {uploading
                ? "Uploading..."
                : slot.type === "video"
                  ? "Choose Video File"
                  : "Choose Image File"}
              <input
                ref={fileRef}
                type="file"
                accept={slot.type === "video" ? "video/mp4,video/webm" : "image/*"}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                style={{ display: "none" }}
                disabled={uploading}
              />
            </label>
            <p style={{ fontSize: "0.75rem", color: "#9ca3af", margin: "0.375rem 0 0 0" }}>
              {slot.type === "video"
                ? "MP4 or WebM only · max 25 MB · MOV/AVI not supported — convert with HandBrake or cloudconvert.com"
                : "JPG, PNG, or WebP · max ~5 MB"}
            </p>
            {uploadError && (
              <div
                role="alert"
                style={{
                  fontSize: "0.8125rem",
                  color: "#991b1b",
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "0.375rem",
                  padding: "0.625rem 0.875rem",
                  marginTop: "0.5rem",
                  lineHeight: 1.5,
                }}
              >
                {uploadError}
              </div>
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

// ── Section group with header ────────────────────────────────────────────────

function SectionGroup({
  title,
  description,
  slots,
  mediaMap,
  onSave,
}: {
  title: string;
  description: string;
  slots: MediaSlot[];
  mediaMap: Map<string, string>;
  onSave: (key: string, url: string) => Promise<void>;
}) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <div
        style={{
          marginBottom: "1rem",
          paddingBottom: "0.75rem",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <h2
          style={{
            fontSize: "1.2rem",
            fontWeight: 600,
            color: "#111827",
            margin: "0 0 0.25rem 0",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontSize: "0.875rem",
            color: "#6b7280",
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {slots.map((slot) => (
          <MediaSlotCard
            key={slot.key}
            slot={slot}
            currentUrl={mediaMap.get(slot.key) || ""}
            onSave={onSave}
          />
        ))}
      </div>
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

      {/* Content Images */}
      <SectionGroup
        title="Content Images"
        description="Primary visual content — these are the most visible images on the site."
        slots={MEDIA_SLOTS.filter((s) => s.category === "content")}
        mediaMap={mediaMap}
        onSave={handleSave}
      />

      {/* Hero Sections */}
      <SectionGroup
        title="Hero Sections"
        description="Full-bleed backgrounds and video behind page headlines."
        slots={MEDIA_SLOTS.filter((s) => s.category === "hero")}
        mediaMap={mediaMap}
        onSave={handleSave}
      />

      {/* Background Textures */}
      <SectionGroup
        title="Background Textures"
        description="Subtle decorative textures. These are less prominent and rarely need changing."
        slots={MEDIA_SLOTS.filter((s) => s.category === "background")}
        mediaMap={mediaMap}
        onSave={handleSave}
      />
    </div>
  );
}

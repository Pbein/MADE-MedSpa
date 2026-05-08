"use client";

import { useState, useCallback, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { SETTINGS_KEYS, DEFAULT_OG } from "@/lib/siteSettings";
import { uploadBlob, deleteBlob } from "@/lib/admin/blobUpload";

// ── Page definitions with default SEO ────────────────────────────────────────

interface PageSEO {
  key: string;
  label: string;
  path: string;
  defaultTitle: string;
  defaultDescription: string;
}

const PAGES: PageSEO[] = [
  {
    key: "home",
    label: "Homepage",
    path: "/",
    defaultTitle: "MADE Med Spa | Luxury Regenerative Aesthetics in McLean, VA",
    defaultDescription:
      "MADE Med Spa offers personalized aesthetic treatments including injectables, biostimulators, laser therapy, and regenerative skincare in McLean, Virginia.",
  },
  {
    key: "about",
    label: "About",
    path: "/about",
    defaultTitle: "About MADE Med Spa | Our Story & Mission",
    defaultDescription:
      "Learn about MADE Med Spa, founded by Nurse Karlyne Bassam. A boutique regenerative aesthetics practice in McLean, VA focused on natural results and clinical expertise.",
  },
  {
    key: "services",
    label: "Services",
    path: "/services",
    defaultTitle: "Our Services | MADE Med Spa McLean, VA",
    defaultDescription:
      "Explore our full range of aesthetic services: Botox, fillers, Sculptra, Aerolase laser, Sylfirm X RF microneedling, IV therapy, and medically guided weight loss.",
  },
  {
    key: "membership",
    label: "Membership",
    path: "/membership",
    defaultTitle: "Membership Plans | MADE Med Spa",
    defaultDescription:
      "Join a MADE Med Spa membership tier for priority booking, treatment credits, and exclusive discounts on all aesthetic services.",
  },
  {
    key: "shop",
    label: "Shop",
    path: "/shop",
    defaultTitle: "Shop Medical-Grade Skincare | MADE Med Spa",
    defaultDescription:
      "Shop curated medical-grade skincare products personally selected by Nurse Karlyne for real results at home.",
  },
  {
    key: "contact",
    label: "Contact",
    path: "/contact",
    defaultTitle: "Contact MADE Med Spa | McLean, VA",
    defaultDescription:
      "Get in touch with MADE Med Spa in McLean, Virginia. Book a consultation, ask about treatments, or visit us at 1311-A Dolley Madison Blvd.",
  },
  {
    key: "faq",
    label: "FAQ",
    path: "/faq",
    defaultTitle: "FAQ | MADE Med Spa",
    defaultDescription:
      "Answers to frequently asked questions about treatments, booking, memberships, cancellation policy, and what to expect at MADE Med Spa.",
  },
  {
    key: "booking",
    label: "Booking",
    path: "/booking",
    defaultTitle: "Book an Appointment | MADE Med Spa McLean, VA",
    defaultDescription:
      "Book your consultation or treatment at MADE Med Spa. View preparation tips, cancellation policy, and what to expect at your first visit.",
  },
];

// ── Styles ───────────────────────────────────────────────────────────────────

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
  fontWeight: 500,
  color: "#374151",
  marginBottom: "0.25rem",
};

// ── Single page SEO card ─────────────────────────────────────────────────────

function SEOCard({ page, siteDefaultOgUrl }: { page: PageSEO; siteDefaultOgUrl: string }) {
  const content = useQuery(api.siteContent.getByKey, {
    key: `seo_${page.key}`,
  });
  const upsert = useMutation(api.siteContent.upsert);
  const ogInput = useRef<HTMLInputElement>(null);

  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  const seo = content?.metadata as
    | { title?: string; description?: string; keywords?: string; og_image_url?: string }
    | undefined;

  const [title, setTitle] = useState(seo?.title || "");
  const [description, setDescription] = useState(seo?.description || "");
  const [keywords, setKeywords] = useState(seo?.keywords || "");
  const [ogImageUrl, setOgImageUrl] = useState(seo?.og_image_url || "");

  // Sync from DB
  const contentKey = content?._id;
  const [lastSyncKey, setLastSyncKey] = useState<string | null>(null);
  if (contentKey && contentKey !== lastSyncKey) {
    setLastSyncKey(contentKey);
    setTitle(seo?.title || "");
    setDescription(seo?.description || "");
    setKeywords(seo?.keywords || "");
    setOgImageUrl(seo?.og_image_url || "");
  }

  const hasCustom = title || description || keywords || ogImageUrl;
  const displayTitle = title || page.defaultTitle;
  const displayDesc = description || page.defaultDescription;
  const displayOgUrl = ogImageUrl || siteDefaultOgUrl;

  async function handleOgUpload(file: File) {
    setUploading(true);
    try {
      const ext = (file.name.split(".").pop() || "img").toLowerCase();
      const blobUrl = await uploadBlob(file, {
        prefix: "seo",
        filename: `${page.key}-og-${Date.now()}.${ext}`,
        purpose: "og",
      });
      setOgImageUrl(blobUrl);
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  const handleSave = useCallback(async () => {
    const previousOg = seo?.og_image_url;
    setSaving(true);
    try {
      await upsert({
        key: `seo_${page.key}`,
        metadata: {
          title: title || undefined,
          description: description || undefined,
          keywords: keywords || undefined,
          og_image_url: ogImageUrl || undefined,
        },
      });
      if (previousOg && previousOg !== ogImageUrl) {
        deleteBlob(previousOg).catch(() => {});
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }, [title, description, keywords, ogImageUrl, page.key, upsert, seo?.og_image_url]);

  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "0.5rem",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "1rem 1.25rem",
          border: "none",
          background: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "1rem", fontWeight: 600, color: "#111827" }}>
            {page.label}
            <span style={{ fontSize: "0.8125rem", color: "#9ca3af", fontWeight: 400, marginLeft: 8 }}>
              {page.path}
            </span>
            {hasCustom && (
              <span
                style={{
                  marginLeft: 8,
                  padding: "0.125rem 0.5rem",
                  borderRadius: "9999px",
                  fontSize: "0.6875rem",
                  fontWeight: 500,
                  backgroundColor: "#ECFDF5",
                  color: "#065F46",
                }}
              >
                Custom
              </span>
            )}
          </div>
          {!expanded && (
            <div style={{ fontSize: "0.8125rem", color: "#6b7280", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {displayTitle}
            </div>
          )}
        </div>
        <span style={{ fontSize: 18, color: "#9ca3af", transform: expanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.15s ease", flexShrink: 0, marginLeft: 12 }}>
          &#9662;
        </span>
      </button>

      {/* Expanded */}
      {expanded && (
        <div style={{ padding: "0 1.25rem 1.25rem", borderTop: "1px solid #f3f4f6" }}>
          {/* Google Preview */}
          <div style={{ margin: "1rem 0", padding: "1rem", backgroundColor: "#f9fafb", borderRadius: "0.375rem", border: "1px solid #f3f4f6" }}>
            <div style={{ fontSize: "0.6875rem", fontWeight: 500, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
              Google Preview
            </div>
            <div style={{ fontSize: "1.125rem", color: "#1a0dab", fontWeight: 400, lineHeight: 1.3, marginBottom: 2 }}>
              {displayTitle}
            </div>
            <div style={{ fontSize: "0.8125rem", color: "#006621", marginBottom: 4 }}>
              https://mademedspa.com{page.path}
            </div>
            <div style={{ fontSize: "0.8125rem", color: "#545454", lineHeight: 1.5 }}>
              {displayDesc.length > 160 ? displayDesc.slice(0, 157) + "..." : displayDesc}
            </div>
          </div>

          {/* Social Share Preview */}
          <div style={{ margin: "0.75rem 0 0", padding: "1rem", backgroundColor: "#f9fafb", borderRadius: "0.375rem", border: "1px solid #f3f4f6" }}>
            <div style={{ fontSize: "0.6875rem", fontWeight: 500, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
              Social Share Preview (Facebook / LinkedIn)
            </div>
            <div style={{ border: "1px solid #e5e7eb", borderRadius: "0.375rem", overflow: "hidden", maxWidth: 400 }}>
              <div style={{ backgroundColor: "#e5e7eb", aspectRatio: "1.91 / 1", overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={displayOgUrl}
                  alt="OG preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
              <div style={{ padding: "0.75rem", backgroundColor: "#fff" }}>
                <div style={{ fontSize: "0.6875rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  mademedspa.com
                </div>
                <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827", marginTop: 2, lineHeight: 1.3 }}>
                  {displayTitle.length > 65 ? displayTitle.slice(0, 62) + "..." : displayTitle}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "#6b7280", marginTop: 2, lineHeight: 1.4 }}>
                  {displayDesc.length > 100 ? displayDesc.slice(0, 97) + "..." : displayDesc}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 8, fontSize: "0.75rem", color: "#9ca3af" }}>
              {ogImageUrl ? "Using page override" : "Using site default (change in Site Settings)"}
            </div>
          </div>

          {/* Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
            <div>
              <label style={labelStyle}>
                Page Title
                <span style={{ color: "#9ca3af", fontWeight: 400 }}> ({(title || page.defaultTitle).length}/60)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={page.defaultTitle}
                style={{
                  ...inputStyle,
                  borderColor: (title || page.defaultTitle).length > 60 ? "#f59e0b" : "#e5e7eb",
                }}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Meta Description
                <span style={{ color: "#9ca3af", fontWeight: 400 }}> ({(description || page.defaultDescription).length}/160)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={page.defaultDescription}
                rows={3}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  borderColor: (description || page.defaultDescription).length > 160 ? "#f59e0b" : "#e5e7eb",
                }}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Keywords
                <span style={{ color: "#9ca3af", fontWeight: 400 }}> (comma-separated)</span>
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="med spa McLean VA, Botox near me, aesthetic nurse injector"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                OG Image Override
                <span style={{ color: "#9ca3af", fontWeight: 400 }}> (optional — falls back to site default)</span>
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => ogInput.current?.click()}
                  disabled={uploading}
                  style={{
                    padding: "0.4rem 0.9rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: 6,
                    backgroundColor: "#fff",
                    color: "#111827",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    opacity: uploading ? 0.6 : 1,
                  }}
                >
                  {uploading ? "Uploading…" : ogImageUrl ? "Replace image" : "Upload override"}
                </button>
                {ogImageUrl && (
                  <button
                    type="button"
                    onClick={() => setOgImageUrl("")}
                    style={{
                      padding: "0.4rem 0.9rem",
                      border: "1px solid transparent",
                      borderRadius: 6,
                      backgroundColor: "transparent",
                      color: "#6b7280",
                      fontSize: "0.875rem",
                      cursor: "pointer",
                    }}
                  >
                    Remove override
                  </button>
                )}
                <span style={{ fontSize: "0.75rem", color: "#9ca3af", wordBreak: "break-all", flex: 1, minWidth: 0 }}>
                  {ogImageUrl ? (ogImageUrl.length > 80 ? ogImageUrl.slice(0, 80) + "…" : ogImageUrl) : "No override set"}
                </span>
                <input
                  ref={ogInput}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleOgUpload(f);
                    e.target.value = "";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #f3f4f6" }}>
            {saved && (
              <span style={{ fontSize: "0.875rem", color: "#16a34a", fontWeight: 500 }}>Saved!</span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: "0.5rem 1.25rem",
                border: "none",
                borderRadius: "0.375rem",
                backgroundColor: "#6366f1",
                color: "#fff",
                fontSize: "0.875rem",
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
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function SEOAdmin() {
  const ogDoc = useQuery(api.siteContent.getByKey, { key: SETTINGS_KEYS.og });
  const siteDefaultOgUrl =
    (ogDoc?.metadata as { url?: string } | undefined)?.url || DEFAULT_OG.url;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#111827", margin: "0 0 0.25rem 0" }}>
          SEO Settings
        </h1>
        <p style={{ fontSize: "0.9375rem", color: "#6b7280", margin: 0 }}>
          Edit page titles, meta descriptions, keywords, and optional per-page social share images.
          Leave fields blank to inherit the site defaults (set under Site Settings).
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {PAGES.map((page) => (
          <SEOCard key={page.key} page={page} siteDefaultOgUrl={siteDefaultOgUrl} />
        ))}
      </div>
    </div>
  );
}

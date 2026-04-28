"use client";

import { useState, useRef, useCallback, ReactNode } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  SETTINGS_KEYS,
  DEFAULT_BUSINESS,
  DEFAULT_SOCIAL,
  DEFAULT_OG,
  type BusinessInfo,
  type SocialLinks,
  type OgImage,
} from "@/lib/siteSettings";
import { uploadBlob, deleteBlob } from "@/lib/admin/blobUpload";

const SITE_LOGO_KEY = "site_logo";

// ─── Styles ─────────────────────────────────────────────────────────────────

const input: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  fontSize: 14,
  boxSizing: "border-box",
  backgroundColor: "#fff",
  color: "#0f172a",
};

const label: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 500,
  color: "#475569",
  marginBottom: 4,
};

const btnPrimary: React.CSSProperties = {
  padding: "8px 18px",
  border: "none",
  borderRadius: 6,
  backgroundColor: "#6366f1",
  color: "#fff",
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
};

// ─── Card wrapper ───────────────────────────────────────────────────────────

function SettingsCard({ title, description, saved, onSave, saving, children }: {
  title: string;
  description: string;
  saved: boolean;
  onSave: () => void;
  saving: boolean;
  children: ReactNode;
}) {
  return (
    <section style={{
      backgroundColor: "#fff",
      border: "1px solid #e2e8f0",
      borderRadius: 10,
      padding: "24px 28px",
      marginBottom: 20,
    }}>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "0 0 4px 0" }}>{title}</h2>
        <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.5 }}>{description}</p>
      </div>
      {children}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12, marginTop: 20, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
        {saved && (
          <span style={{ fontSize: 13, color: "#16a34a", fontWeight: 500 }}>Saved</span>
        )}
        <button onClick={onSave} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}>
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </section>
  );
}

// ─── Hook: load + track saved state for a settings key ─────────────────────

function useSettingsForm<T extends object>(key: string, defaults: T) {
  const doc = useQuery(api.siteContent.getByKey, { key });
  const upsert = useMutation(api.siteContent.upsert);

  const loaded = (doc?.metadata as T | undefined) ?? null;
  const [form, setForm] = useState<T>({ ...defaults, ...(loaded ?? {}) });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lastSyncId, setLastSyncId] = useState<string | null>(null);

  // Sync from DB when record arrives / changes
  const docId = doc?._id as string | undefined;
  if (docId && docId !== lastSyncId) {
    setLastSyncId(docId);
    setForm({ ...defaults, ...(loaded ?? {}) });
  }

  const update = useCallback(<K extends keyof T>(k: K, v: T[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      await upsert({ key, metadata: form });
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } finally {
      setSaving(false);
    }
  }, [form, key, upsert]);

  return { form, update, save, saving, saved, isLoading: doc === undefined };
}

// ─── Business Info card ────────────────────────────────────────────────────

function BusinessInfoCard() {
  const { form, update, save, saving, saved } = useSettingsForm<BusinessInfo>(
    SETTINGS_KEYS.business,
    DEFAULT_BUSINESS
  );

  const field = (k: keyof BusinessInfo, lbl: string, placeholder?: string) => (
    <div>
      <label style={label}>{lbl}</label>
      <input
        type="text"
        value={form[k]}
        onChange={(e) => update(k, e.target.value)}
        placeholder={placeholder ?? DEFAULT_BUSINESS[k]}
        style={input}
      />
    </div>
  );

  return (
    <SettingsCard
      title="Business Info"
      description="Used in the site footer, contact page, and structured data for Google. Updated in one place, applied everywhere."
      saved={saved}
      saving={saving}
      onSave={save}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {field("name", "Business name")}
        {field("tagline", "Tagline / category")}
        {field("email", "Contact email")}
        {field("phone", "Phone number")}
      </div>

      <div style={{ fontSize: 12, fontWeight: 600, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 24, marginBottom: 10 }}>
        Address
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 0.5fr 0.7fr", gap: 12 }}>
        {field("streetAddress", "Street address")}
        {field("city", "City")}
        {field("state", "State")}
        {field("postalCode", "Postal code")}
      </div>

      <div style={{ fontSize: 12, fontWeight: 600, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 24, marginBottom: 10 }}>
        Opening hours
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {field("hoursWeekday", "Weekdays")}
        {field("hoursSaturday", "Saturday")}
        {field("hoursSunday", "Sunday")}
      </div>

      <div style={{ marginTop: 16, maxWidth: 240 }}>
        {field("priceRange", "Price range (Google)", "$$-$$$")}
      </div>
    </SettingsCard>
  );
}

// ─── Default OG Image card ─────────────────────────────────────────────────

function OgImageCard() {
  const doc = useQuery(api.siteContent.getByKey, { key: SETTINGS_KEYS.og });
  const upsert = useMutation(api.siteContent.upsert);
  const fileInput = useRef<HTMLInputElement>(null);

  const loaded = (doc?.metadata as OgImage | undefined) ?? null;
  const [url, setUrl] = useState<string>(loaded?.url ?? DEFAULT_OG.url);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lastSyncId, setLastSyncId] = useState<string | null>(null);

  const docId = doc?._id as string | undefined;
  if (docId && docId !== lastSyncId) {
    setLastSyncId(docId);
    setUrl(loaded?.url ?? DEFAULT_OG.url);
  }

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const ext = (file.name.split(".").pop() || "img").toLowerCase();
      const blobUrl = await uploadBlob(file, {
        prefix: "settings",
        filename: `og-image-${Date.now()}.${ext}`,
      });
      setUrl(blobUrl);
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    const previous = loaded?.url;
    setSaving(true);
    try {
      await upsert({ key: SETTINGS_KEYS.og, metadata: { url } });
      if (previous && previous !== url) {
        deleteBlob(previous).catch(() => {});
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } finally {
      setSaving(false);
    }
  }

  const isCustom = url !== DEFAULT_OG.url;

  return (
    <SettingsCard
      title="Default OG Image"
      description="Shown when any page of the site is shared on Facebook, LinkedIn, Slack, or messaging apps. Recommended size: 1200 × 630 pixels. Per-page overrides are set in SEO."
      saved={saved}
      saving={saving}
      onSave={handleSave}
    >
      <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: 24, alignItems: "start" }}>
        {/* Preview */}
        <div style={{
          width: "100%",
          maxWidth: 400,
          aspectRatio: "1200 / 630",
          backgroundColor: "#f1f5f9",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="OG image preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ fontSize: 13, color: "#94a3b8" }}>1200 × 630</div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div style={{
              display: "inline-block",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: isCustom ? "#065f46" : "#64748b",
              backgroundColor: isCustom ? "#d1fae5" : "#f1f5f9",
              padding: "3px 9px",
              borderRadius: 4,
              marginBottom: 10,
            }}>
              {isCustom ? "Custom image" : "Using default"}
            </div>
            <div style={{ fontSize: 13, color: "#475569", wordBreak: "break-all", lineHeight: 1.5 }}>
              {url}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => fileInput.current?.click()} disabled={uploading} style={{
              padding: "8px 16px",
              border: "1px solid #e2e8f0",
              borderRadius: 6,
              backgroundColor: "#fff",
              color: "#0f172a",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              opacity: uploading ? 0.6 : 1,
            }}>
              {uploading ? "Uploading…" : "Upload image"}
            </button>
            {isCustom && (
              <button onClick={() => setUrl(DEFAULT_OG.url)} style={{
                padding: "8px 16px",
                border: "1px solid #e2e8f0",
                borderRadius: 6,
                backgroundColor: "transparent",
                color: "#64748b",
                fontSize: 14,
                cursor: "pointer",
              }}>Reset to default</button>
            )}
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />
          </div>

          <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>
            Tip: use a branded image that reads well at a small size. Text should be large and high-contrast. Facebook shows a 1.91:1 crop.
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}

// ─── Social Links card ─────────────────────────────────────────────────────

function SocialLinksCard() {
  const { form, update, save, saving, saved } = useSettingsForm<SocialLinks>(
    SETTINGS_KEYS.social,
    DEFAULT_SOCIAL
  );

  const field = (k: keyof SocialLinks, lbl: string, placeholder: string) => (
    <div>
      <label style={label}>{lbl}</label>
      <input
        type="url"
        value={form[k]}
        onChange={(e) => update(k, e.target.value)}
        placeholder={placeholder}
        style={input}
      />
    </div>
  );

  return (
    <SettingsCard
      title="Social Links"
      description="Full URLs to your social profiles. Shown in the footer and included in the site's structured data."
      saved={saved}
      saving={saving}
      onSave={save}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {field("instagram", "Instagram", "https://instagram.com/mademedspa")}
        {field("tiktok", "TikTok", "https://tiktok.com/@mademedspa")}
        {field("facebook", "Facebook", "https://facebook.com/mademedspa")}
        {field("youtube", "YouTube", "https://youtube.com/@mademedspa")}
      </div>
    </SettingsCard>
  );
}

// ─── Logo card ─────────────────────────────────────────────────────────────

function LogoCard() {
  const doc = useQuery(api.siteContent.getByKey, { key: SITE_LOGO_KEY });
  const upsert = useMutation(api.siteContent.upsert);
  const fileInput = useRef<HTMLInputElement>(null);

  const [url, setUrl] = useState<string>("");
  const [alt, setAlt] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lastSyncId, setLastSyncId] = useState<string | null>(null);

  const docId = doc?._id as string | undefined;
  if (doc !== undefined && docId !== lastSyncId) {
    setLastSyncId(docId ?? null);
    setUrl(doc?.imageUrl ?? "");
    setAlt(doc?.title ?? "");
  }

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const ext = (file.name.split(".").pop() || "img").toLowerCase();
      const blobUrl = await uploadBlob(file, {
        prefix: "settings",
        filename: `site-logo-${Date.now()}.${ext}`,
      });
      setUrl(blobUrl);
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    const previous = doc?.imageUrl;
    const nextUrl = url || undefined;
    setSaving(true);
    try {
      await upsert({
        key: SITE_LOGO_KEY,
        imageUrl: nextUrl,
        title: alt || undefined,
      });
      if (previous && previous !== nextUrl) {
        deleteBlob(previous).catch(() => {});
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } finally {
      setSaving(false);
    }
  }

  function handleRemove() {
    setUrl("");
  }

  return (
    <SettingsCard
      title="Logo"
      description="Shown in the top-left of every page (and at the top of the footer). Falls back to the “MADE” wordmark when no logo is uploaded. Use a transparent PNG or SVG. Recommended height: 80–120px."
      saved={saved}
      saving={saving}
      onSave={handleSave}
    >
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 24, alignItems: "start" }}>
        {/* Preview */}
        <div style={{
          width: "100%",
          maxWidth: 240,
          aspectRatio: "3 / 1",
          backgroundColor: "#f1f5f9",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}>
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt={alt || "Logo preview"}
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            />
          ) : (
            <div style={{ fontSize: 13, color: "#94a3b8" }}>No logo uploaded</div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div style={{
              display: "inline-block",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: url ? "#065f46" : "#64748b",
              backgroundColor: url ? "#d1fae5" : "#f1f5f9",
              padding: "3px 9px",
              borderRadius: 4,
              marginBottom: 10,
            }}>
              {url ? "Custom logo" : "Using MADE wordmark"}
            </div>
            {url && (
              <div style={{ fontSize: 13, color: "#475569", wordBreak: "break-all", lineHeight: 1.5 }}>
                {url}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => fileInput.current?.click()} disabled={uploading} style={{
              padding: "8px 16px",
              border: "1px solid #e2e8f0",
              borderRadius: 6,
              backgroundColor: "#fff",
              color: "#0f172a",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              opacity: uploading ? 0.6 : 1,
            }}>
              {uploading ? "Uploading…" : url ? "Replace logo" : "Upload logo"}
            </button>
            {url && (
              <button onClick={handleRemove} style={{
                padding: "8px 16px",
                border: "1px solid #fca5a5",
                borderRadius: 6,
                backgroundColor: "transparent",
                color: "#dc2626",
                fontSize: 14,
                cursor: "pointer",
              }}>Remove</button>
            )}
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />
          </div>

          <div>
            <label style={label}>Alt text (for accessibility)</label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="MADE Med Spa"
              style={input}
            />
          </div>

          <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>
            Tip: a transparent PNG works best so the logo blends with both the cream nav and the dark espresso footer. After uploading, click <strong>Save</strong> to publish.
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}

// ─── Main page ──────────────────────────────────────────────────────────────

export default function SiteSettingsAdmin() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1.5rem", color: "#0f172a" }}>
      <header style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8", marginBottom: 6 }}>
          Global
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0" }}>
          Site Settings
        </h1>
        <p style={{ fontSize: 15, color: "#64748b", margin: 0, lineHeight: 1.6, maxWidth: 680 }}>
          The defaults used across the whole site — business info, brand image, and social
          profiles. Per-page overrides for SEO titles and images live on the <strong>SEO</strong> page.
        </p>
      </header>

      <LogoCard />
      <BusinessInfoCard />
      <OgImageCard />
      <SocialLinksCard />
    </div>
  );
}

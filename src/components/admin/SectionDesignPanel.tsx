"use client";

import { useState, useCallback, useRef } from "react";
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { DESIGN_PRESETS, getPreset } from "@/lib/designPresets";

// ── Types ────────────────────────────────────────────────────────────────────

interface SectionDesignConfig {
  visible?: boolean;
  colors?: {
    surface?: string;
    onSurface?: string;
    secondary?: string;
    buttonBg?: string;
    buttonText?: string;
    divider?: string;
  };
  backgroundImage?: string;
  designStyle?: string;
}

interface SectionDesignPanelProps {
  pageKey: string;
  sectionKey: string;
  pagePath: string;
  sectionLabel: string;
  fieldValues: Record<string, unknown>;
  fieldDefinitions: { fieldKey: string; defaultValue: string | string[] | Record<string, string>[]; type: string }[];
}

// ── Preset color mappings ──────────────────────────────────────────────────

function getPresetColors(presetKey: string) {
  // Light surfaces use Espresso text + Blush accent.
  // Dark surfaces (espresso, merlot, blush, matcha, olive) use Silk text.
  const lightSurfaceDefaults = { surface: "#F7F6EB", onSurface: "#391E1E", secondary: "#84262C" };
  if (presetKey === "espresso") return { surface: "#391E1E", onSurface: "#F7F6EB", secondary: "#E8E0D5" };
  if (presetKey === "merlot")   return { surface: "#571A1E", onSurface: "#F7F6EB", secondary: "#E8E0D5" };
  if (presetKey === "blush")    return { surface: "#84262C", onSurface: "#F7F6EB", secondary: "#E8E0D5" };
  if (presetKey === "matcha")   return { surface: "#838D60", onSurface: "#F7F6EB", secondary: "#E8E0D5" };
  if (presetKey === "olive")    return { surface: "#413E2A", onSurface: "#F7F6EB", secondary: "#E8E0D5" };
  if (presetKey === "silk")     return { surface: "#F7F6EB", onSurface: "#391E1E", secondary: "#84262C" };
  if (presetKey === "glaze")    return { surface: "#E8E0D5", onSurface: "#391E1E", secondary: "#84262C" };
  return lightSurfaceDefaults;
}

// ── Brand Swatches (MADE Branding spec palette) ─────────────────────────────

const BRAND_SWATCHES = [
  { color: "#F7F6EB", label: "Silk" },
  { color: "#E8E0D5", label: "Glaze" },
  { color: "#84262C", label: "Blush" },
  { color: "#571A1E", label: "Merlot" },
  { color: "#391E1E", label: "Espresso" },
  { color: "#838D60", label: "Matcha" },
  { color: "#413E2A", label: "Olive" },
  { color: "#FFFFFF", label: "White" },
];

// ── Color Picker ────────────────────────────────────────────────────────────

function ColorPicker({
  label, value, defaultValue, onChange,
}: {
  label: string; value: string | undefined; defaultValue: string;
  onChange: (val: string | undefined) => void;
}) {
  const display = value || defaultValue;
  const [showSwatches, setShowSwatches] = useState(false);

  return (
    <div>
      <div style={{ fontSize: "0.6875rem", fontWeight: 500, color: "#374151", marginBottom: "0.25rem" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
        <input type="color" value={display} onChange={(e) => onChange(e.target.value)}
          style={{ width: 24, height: 24, borderTop: "2px solid #e5e7eb", borderLeft: "2px solid #e5e7eb", borderRight: "2px solid #e5e7eb", borderBottom: "2px solid #e5e7eb", borderRadius: 3, cursor: "pointer", padding: 0, flexShrink: 0 }} />
        <input type="text" value={display}
          onChange={(e) => { const v = e.target.value; if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v.length === 7 ? v : undefined); }}
          onBlur={(e) => { const v = e.target.value; if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(v); }}
          style={{ width: 70, fontSize: "0.625rem", fontFamily: "monospace", padding: "0.2rem 0.3rem", borderTop: "1px solid #e5e7eb", borderLeft: "1px solid #e5e7eb", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", borderRadius: 3, color: "#374151" }} />
        <button onClick={() => setShowSwatches(!showSwatches)} title="Brand colors"
          style={{ background: "none", borderTop: "1px solid #e5e7eb", borderLeft: "1px solid #e5e7eb", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", borderRadius: 3, padding: "0.15rem 0.3rem", cursor: "pointer", fontSize: "0.5rem", color: "#6b7280" }}>
          &#9632;&#9632;
        </button>
        {value && (
          <button onClick={() => onChange(undefined)}
            style={{ background: "none", borderWidth: 0, color: "#6366f1", fontSize: "0.5625rem", cursor: "pointer", padding: 0 }}>
            reset
          </button>
        )}
      </div>
      {showSwatches && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: "0.375rem" }}>
          {BRAND_SWATCHES.map((s) => (
            <button key={s.color} title={s.label} onClick={() => { onChange(s.color); setShowSwatches(false); }}
              style={{ width: 16, height: 16, borderRadius: 2, borderWidth: display === s.color ? 2 : 1, borderStyle: "solid", borderColor: display === s.color ? "#6366f1" : "rgba(0,0,0,0.15)", backgroundColor: s.color, cursor: "pointer", padding: 0 }} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Live Preview (iframe) ───────────────────────────────────────────────────

function LivePreview({
  pagePath,
  sectionKey,
  previewOverrides,
}: {
  pagePath: string;
  sectionKey: string;
  previewOverrides: PreviewOverrides;
}) {
  if (pagePath === "(global)") return null;

  // Encode current in-memory overrides into a URL query so the page can apply
  // them inline without saving. This makes the iframe update LIVE as the
  // operator picks colors / fonts / etc.
  const params = new URLSearchParams();
  params.set("_previewSection", sectionKey);
  if (previewOverrides.designStyle && previewOverrides.designStyle !== "default") {
    params.set("_previewDesignStyle", previewOverrides.designStyle);
  }
  if (previewOverrides.colors && Object.keys(previewOverrides.colors).length > 0) {
    params.set("_previewColors", JSON.stringify(previewOverrides.colors));
  }
  if (previewOverrides.backgroundImage) {
    params.set("_previewBg", previewOverrides.backgroundImage);
  }

  const qs = params.toString();
  const previewUrl = `${pagePath}${qs ? "?" + qs : ""}#section-${sectionKey}`;

  return (
    <div style={{ marginTop: "0.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.375rem" }}>
        <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Live Preview
        </span>
        <a href={pagePath} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.625rem", color: "#6366f1", textDecoration: "none" }}>
          Open full page &#8599;
        </a>
      </div>
      <div style={{
        position: "relative",
        width: "100%",
        height: 360,
        overflow: "hidden",
        borderRadius: "0.375rem",
        borderTop: "1px solid #d1d5db",
        borderLeft: "1px solid #d1d5db",
        borderRight: "1px solid #d1d5db",
        borderBottom: "1px solid #d1d5db",
        backgroundColor: "#1a1a1a",
      }}>
        <iframe
          src={previewUrl}
          title="Live page preview"
          style={{
            width: "333%",
            height: "333%",
            transform: "scale(0.3)",
            transformOrigin: "top left",
            borderWidth: 0,
          }}
        />
      </div>
      <p style={{ fontSize: "0.5625rem", color: "#9ca3af", marginTop: "0.25rem" }}>
        Updates as you pick. Click <strong>Save Design</strong> to keep your selections in the admin, then <strong>Save</strong> to publish to the live site.
      </p>
    </div>
  );
}

interface PreviewOverrides {
  designStyle?: string;
  colors?: Record<string, string>;
  backgroundImage?: string;
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function SectionDesignPanel({
  pageKey, sectionKey, pagePath, sectionLabel, fieldValues, fieldDefinitions,
}: SectionDesignPanelProps) {
  const pageSettings = useQuery(api.siteContent.getByKey, { key: `page_settings_${pageKey}` });
  const upsert = useMutation(api.siteContent.upsert);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const convex = useConvex();

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  // Suppress unused variable warnings
  void sectionLabel;
  void fieldValues;
  void fieldDefinitions;

  // Read current section config
  const settings = (pageSettings?.metadata || {}) as Record<string, unknown>;
  const sections = (settings.sections || {}) as Record<string, unknown>;
  const rawConfig = sections[sectionKey];
  const config: SectionDesignConfig =
    typeof rawConfig === "boolean" ? { visible: rawConfig }
    : typeof rawConfig === "object" && rawConfig !== null ? (rawConfig as SectionDesignConfig)
    : {};

  const [designStyle, setDesignStyle] = useState(config.designStyle || "default");
  const [colors, setColors] = useState(config.colors || {});
  const [bgImage, setBgImage] = useState(config.backgroundImage || "");

  // Sync from DB
  const settingsId = pageSettings?._id;
  const [lastSync, setLastSync] = useState<string | null>(null);
  if (settingsId && settingsId !== lastSync) {
    setLastSync(settingsId);
    const s = (pageSettings?.metadata || {}) as Record<string, unknown>;
    const sec = (s.sections || {}) as Record<string, unknown>;
    const raw = sec[sectionKey];
    const c = typeof raw === "object" && raw !== null ? (raw as SectionDesignConfig) : {};
    setDesignStyle(c.designStyle || "default");
    setColors(c.colors || {});
    setBgImage(c.backgroundImage || "");
  }

  const handlePresetChange = useCallback((presetKey: string) => {
    setDesignStyle(presetKey);
    if (presetKey === "default") {
      setColors({});
    } else {
      const pc = getPresetColors(presetKey);
      setColors({ surface: pc.surface, onSurface: pc.onSurface, secondary: pc.secondary });
    }
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const cur = (pageSettings?.metadata || {}) as Record<string, unknown>;
      const curSec = { ...((cur.sections || {}) as Record<string, unknown>) };
      const existing = typeof curSec[sectionKey] === "object" && curSec[sectionKey] !== null
        ? (curSec[sectionKey] as SectionDesignConfig) : { visible: curSec[sectionKey] !== false };
      curSec[sectionKey] = {
        ...existing,
        designStyle: designStyle !== "default" ? designStyle : undefined,
        colors: Object.keys(colors).length > 0 ? colors : undefined,
        backgroundImage: bgImage || undefined,
      };
      await upsert({ key: `page_settings_${pageKey}`, metadata: { ...cur, sections: curSec } });
      setSaved(true);
      setPreviewKey((k) => k + 1);
      setTimeout(() => setSaved(false), 2000);
    } finally { setSaving(false); }
  }, [pageKey, sectionKey, designStyle, colors, bgImage, pageSettings, upsert]);

  const handleReset = useCallback(async () => {
    setDesignStyle("default");
    setColors({});
    setBgImage("");
    setSaving(true);
    try {
      const cur = (pageSettings?.metadata || {}) as Record<string, unknown>;
      const curSec = { ...((cur.sections || {}) as Record<string, unknown>) };
      const existing = typeof curSec[sectionKey] === "object" && curSec[sectionKey] !== null
        ? (curSec[sectionKey] as SectionDesignConfig) : {};
      curSec[sectionKey] = { visible: existing.visible !== false };
      await upsert({ key: `page_settings_${pageKey}`, metadata: { ...cur, sections: curSec } });
      setSaved(true);
      setPreviewKey((k) => k + 1);
      setTimeout(() => setSaved(false), 2000);
    } finally { setSaving(false); }
  }, [pageKey, sectionKey, pageSettings, upsert]);

  async function handleBgUpload(file: File) {
    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, { method: "POST", headers: { "Content-Type": file.type }, body: file });
      const { storageId } = await result.json();
      const storageUrl = await convex.query(api.storage.getUrl, { storageId });
      if (!storageUrl) throw new Error("Failed");
      setBgImage(storageUrl);
    } catch { alert("Upload failed."); }
    finally { setUploading(false); }
  }

  const hasCustomizations = designStyle !== "default" || Object.keys(colors).length > 0 || bgImage;
  const presetColors = getPresetColors(designStyle);

  const updateColor = (key: string) => (val: string | undefined) => {
    setColors((prev) => {
      const next = { ...prev };
      if (val) (next as Record<string, string>)[key] = val;
      else delete (next as Record<string, string | undefined>)[key];
      return next;
    });
  };

  return (
    <div style={{ marginTop: "1rem", borderTop: "1px solid #e5e7eb", borderLeft: "1px solid #e5e7eb", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", borderRadius: "0.5rem", overflow: "hidden" }}>
      <button onClick={() => setExpanded(!expanded)}
        style={{ width: "100%", padding: "0.625rem 1rem", backgroundColor: "#f9fafb", borderTop: "none", borderLeft: "none", borderRight: "none", borderBottom: expanded ? "1px solid #e5e7eb" : "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em" }}>Customize Design</span>
          {hasCustomizations && <span style={{ padding: "0.1rem 0.35rem", borderRadius: "9999px", fontSize: "0.5625rem", fontWeight: 500, backgroundColor: "#EEF2FF", color: "#4338CA" }}>Custom</span>}
        </div>
        <span style={{ fontSize: 14, color: "#9ca3af", transform: expanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.15s ease" }}>&#9662;</span>
      </button>

      {expanded && (
        <div style={{ padding: "0.875rem 1rem" }}>
          {/* Presets */}
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.375rem" }}>Preset Styles</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
              {DESIGN_PRESETS.map((p) => (
                <button key={p.key} onClick={() => handlePresetChange(p.key)} title={p.description}
                  style={{ display: "flex", alignItems: "center", gap: 4, padding: "0.25rem 0.5rem", borderWidth: designStyle === p.key ? 2 : 1, borderStyle: "solid", borderColor: designStyle === p.key ? "#6366f1" : "#e5e7eb", borderRadius: "0.25rem", backgroundColor: designStyle === p.key ? "#EEF2FF" : "#fff", fontSize: "0.625rem", color: "#374151", cursor: "pointer" }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: p.swatch, borderWidth: 1, borderStyle: "solid", borderColor: "rgba(0,0,0,0.15)", flexShrink: 0 }} />
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.375rem" }}>Section Colors</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.625rem" }}>
              <ColorPicker label="Background" value={colors.surface} defaultValue={presetColors.surface} onChange={updateColor("surface")} />
              <ColorPicker label="Headline Text" value={colors.onSurface} defaultValue={presetColors.onSurface} onChange={updateColor("onSurface")} />
              <ColorPicker label="Body Text" value={colors.secondary} defaultValue={presetColors.secondary} onChange={updateColor("secondary")} />
              <ColorPicker label="Button Color" value={colors.buttonBg} defaultValue="#391e1e" onChange={updateColor("buttonBg")} />
              <ColorPicker label="Button Text" value={colors.buttonText} defaultValue="#f6f1ea" onChange={updateColor("buttonText")} />
              <ColorPicker label="Divider Line" value={colors.divider} defaultValue="#d4c3c2" onChange={updateColor("divider")} />
            </div>
          </div>

          {/* Background Image */}
          <div style={{ marginBottom: "0.75rem" }}>
            <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.375rem" }}>Background Image</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {bgImage ? (
                <>
                  <div style={{ width: 48, height: 32, borderRadius: 4, overflow: "hidden", borderWidth: 1, borderStyle: "solid", borderColor: "#e5e7eb", flexShrink: 0 }}>
                    <img src={bgImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <button onClick={() => setBgImage("")} style={{ fontSize: "0.625rem", color: "#dc2626", background: "none", borderWidth: 0, cursor: "pointer", padding: 0 }}>Remove</button>
                </>
              ) : (
                <label style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "0.3rem 0.6rem", borderWidth: 1, borderStyle: "dashed", borderColor: "#d1d5db", borderRadius: "0.25rem", backgroundColor: "#f9fafb", fontSize: "0.625rem", cursor: uploading ? "wait" : "pointer", opacity: uploading ? 0.6 : 1 }}>
                  {uploading ? "Uploading..." : "Upload Image"}
                  <input ref={fileRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleBgUpload(f); }} style={{ display: "none" }} disabled={uploading} />
                </label>
              )}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.5rem", borderTop: "1px solid #f3f4f6" }}>
            <div>
              {hasCustomizations && (
                <button onClick={handleReset} style={{ fontSize: "0.625rem", color: "#dc2626", background: "none", borderWidth: 1, borderStyle: "solid", borderColor: "#fca5a5", borderRadius: "0.25rem", padding: "0.2rem 0.4rem", cursor: "pointer" }}>Reset</button>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {saved && <span style={{ fontSize: "0.625rem", color: "#16a34a", fontWeight: 500 }}>Saved!</span>}
              <button onClick={handleSave} disabled={saving}
                style={{ padding: "0.25rem 0.6rem", borderWidth: 0, borderRadius: "0.25rem", backgroundColor: "#6366f1", color: "#fff", fontSize: "0.625rem", fontWeight: 500, cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
                {saving ? "Saving..." : "Save Design"}
              </button>
            </div>
          </div>

          {/* Live Preview */}
          <LivePreview
            key={previewKey}
            pagePath={pagePath}
            sectionKey={sectionKey}
            previewOverrides={{ designStyle, colors, backgroundImage: bgImage }}
          />
        </div>
      )}
    </div>
  );
}

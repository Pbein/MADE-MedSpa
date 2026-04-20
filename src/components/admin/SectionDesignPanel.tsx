"use client";

import { useState, useCallback, useRef } from "react";
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { DESIGN_PRESETS } from "@/lib/designPresets";

// ── Types ────────────────────────────────────────────────────────────────────

interface SectionDesignConfig {
  visible?: boolean;
  colors?: {
    surface?: string;
    onSurface?: string;
    secondary?: string;
  };
  backgroundImage?: string;
  designStyle?: string;
}

interface SectionDesignPanelProps {
  pageKey: string;
  sectionKey: string;
  pagePath: string;
}

// ── Color Picker ─────────────────────────────────────────────────────────────

function ColorPicker({
  label,
  value,
  defaultValue,
  onChange,
}: {
  label: string;
  value: string | undefined;
  defaultValue: string;
  onChange: (val: string | undefined) => void;
}) {
  const display = value || defaultValue;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
      <input
        type="color"
        value={display}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: 28, height: 28, border: "2px solid #e5e7eb", borderRadius: 4, cursor: "pointer", padding: 0, flexShrink: 0 }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 500, color: "#374151" }}>{label}</div>
        <div style={{ fontSize: "0.6875rem", color: "#9ca3af", fontFamily: "monospace" }}>
          {display}
          {value && (
            <button
              onClick={() => onChange(undefined)}
              style={{ marginLeft: 6, background: "none", border: "none", color: "#6366f1", fontSize: "0.6875rem", cursor: "pointer", padding: 0 }}
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function SectionDesignPanel({
  pageKey,
  sectionKey,
  pagePath,
}: SectionDesignPanelProps) {
  const pageSettings = useQuery(api.siteContent.getByKey, {
    key: `page_settings_${pageKey}`,
  });
  const upsert = useMutation(api.siteContent.upsert);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const convex = useConvex();

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Read current section config from page settings
  const settings = (pageSettings?.metadata || {}) as Record<string, unknown>;
  const sections = (settings.sections || {}) as Record<string, unknown>;
  const rawConfig = sections[sectionKey];
  const config: SectionDesignConfig =
    typeof rawConfig === "boolean"
      ? { visible: rawConfig }
      : typeof rawConfig === "object" && rawConfig !== null
        ? (rawConfig as SectionDesignConfig)
        : {};

  // Local draft state
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

  // Save section design config
  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const currentSettings = (pageSettings?.metadata || {}) as Record<string, unknown>;
      const currentSections = { ...((currentSettings.sections || {}) as Record<string, unknown>) };

      // Preserve existing config (especially visible flag)
      const existing = typeof currentSections[sectionKey] === "object" && currentSections[sectionKey] !== null
        ? (currentSections[sectionKey] as SectionDesignConfig)
        : { visible: currentSections[sectionKey] !== false };

      currentSections[sectionKey] = {
        ...existing,
        designStyle: designStyle !== "default" ? designStyle : undefined,
        colors: Object.keys(colors).length > 0 ? colors : undefined,
        backgroundImage: bgImage || undefined,
      };

      await upsert({
        key: `page_settings_${pageKey}`,
        metadata: { ...currentSettings, sections: currentSections },
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }, [pageKey, sectionKey, designStyle, colors, bgImage, pageSettings, upsert]);

  // Reset all design customizations
  const handleReset = useCallback(async () => {
    setDesignStyle("default");
    setColors({});
    setBgImage("");

    setSaving(true);
    try {
      const currentSettings = (pageSettings?.metadata || {}) as Record<string, unknown>;
      const currentSections = { ...((currentSettings.sections || {}) as Record<string, unknown>) };
      const existing = typeof currentSections[sectionKey] === "object" && currentSections[sectionKey] !== null
        ? (currentSections[sectionKey] as SectionDesignConfig)
        : {};

      // Keep only the visible flag
      currentSections[sectionKey] = { visible: existing.visible !== false };

      await upsert({
        key: `page_settings_${pageKey}`,
        metadata: { ...currentSettings, sections: currentSections },
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }, [pageKey, sectionKey, pageSettings, upsert]);

  // Upload background image
  async function handleBgUpload(file: File) {
    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      const storageUrl = await convex.query(api.storage.getUrl, { storageId });
      if (!storageUrl) throw new Error("Failed to resolve URL");
      setBgImage(storageUrl);
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  const hasCustomizations = designStyle !== "default" || Object.keys(colors).length > 0 || bgImage;

  return (
    <div style={{
      marginTop: "1rem",
      border: "1px solid #e5e7eb",
      borderRadius: "0.5rem",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "0.75rem 1rem",
        backgroundColor: "#f9fafb",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Customize Design
          {hasCustomizations && (
            <span style={{ marginLeft: 6, padding: "0.1rem 0.4rem", borderRadius: "9999px", fontSize: "0.625rem", fontWeight: 500, backgroundColor: "#EEF2FF", color: "#4338CA" }}>
              Custom
            </span>
          )}
        </div>
        <a
          href={pagePath}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "0.6875rem", color: "#6366f1", textDecoration: "none" }}
        >
          View on site &#8599;
        </a>
      </div>

      <div style={{ padding: "1rem" }}>
        {/* Preset Styles */}
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
            Preset Styles
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
            {DESIGN_PRESETS.map((preset) => (
              <button
                key={preset.key}
                onClick={() => setDesignStyle(preset.key)}
                title={preset.description}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "0.3rem 0.6rem",
                  border: "1px solid",
                  borderColor: designStyle === preset.key ? "#6366f1" : "#e5e7eb",
                  borderRadius: "0.25rem",
                  backgroundColor: designStyle === preset.key ? "#EEF2FF" : "#fff",
                  fontSize: "0.6875rem",
                  color: "#374151",
                  cursor: "pointer",
                }}
              >
                <span style={{
                  width: 12,
                  height: 12,
                  borderRadius: 2,
                  backgroundColor: preset.swatch,
                  border: "1px solid rgba(0,0,0,0.1)",
                  flexShrink: 0,
                }} />
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
            Colors
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
            <ColorPicker
              label="Background"
              value={colors.surface}
              defaultValue="#f6f1ea"
              onChange={(val) => setColors((prev) => {
                const next = { ...prev };
                if (val) next.surface = val; else delete next.surface;
                return next;
              })}
            />
            <ColorPicker
              label="Text"
              value={colors.onSurface}
              defaultValue="#391e1e"
              onChange={(val) => setColors((prev) => {
                const next = { ...prev };
                if (val) next.onSurface = val; else delete next.onSurface;
                return next;
              })}
            />
            <ColorPicker
              label="Accent"
              value={colors.secondary}
              defaultValue="#84262c"
              onChange={(val) => setColors((prev) => {
                const next = { ...prev };
                if (val) next.secondary = val; else delete next.secondary;
                return next;
              })}
            />
          </div>
        </div>

        {/* Background Image */}
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
            Background Image
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {bgImage ? (
              <>
                <div style={{ width: 48, height: 32, borderRadius: 4, overflow: "hidden", border: "1px solid #e5e7eb", flexShrink: 0 }}>
                  <img src={bgImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <button
                  onClick={() => setBgImage("")}
                  style={{ fontSize: "0.6875rem", color: "#dc2626", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  Remove
                </button>
              </>
            ) : (
              <label style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "0.35rem 0.75rem",
                border: "1px dashed #d1d5db",
                borderRadius: "0.375rem",
                backgroundColor: "#f9fafb",
                fontSize: "0.6875rem",
                cursor: uploading ? "wait" : "pointer",
                opacity: uploading ? 0.6 : 1,
              }}>
                {uploading ? "Uploading..." : "Upload Image"}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleBgUpload(file);
                  }}
                  style={{ display: "none" }}
                  disabled={uploading}
                />
              </label>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.75rem", borderTop: "1px solid #f3f4f6" }}>
          <div>
            {hasCustomizations && (
              <button
                onClick={handleReset}
                style={{ fontSize: "0.6875rem", color: "#dc2626", background: "none", border: "1px solid #fca5a5", borderRadius: "0.25rem", padding: "0.25rem 0.5rem", cursor: "pointer" }}
              >
                Reset to Default
              </button>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {saved && <span style={{ fontSize: "0.6875rem", color: "#16a34a", fontWeight: 500 }}>Saved!</span>}
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: "0.3rem 0.75rem",
                border: "none",
                borderRadius: "0.25rem",
                backgroundColor: "#6366f1",
                color: "#fff",
                fontSize: "0.6875rem",
                fontWeight: 500,
                cursor: "pointer",
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? "Saving..." : "Save Design"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

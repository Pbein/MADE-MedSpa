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
  };
  backgroundImage?: string;
  designStyle?: string;
}

interface SectionDesignPanelProps {
  pageKey: string;
  sectionKey: string;
  pagePath: string;
  sectionLabel: string;
  previewText: string;
}

// ── Preset color mappings (what each preset "means" for the color pickers) ──

function getPresetColors(presetKey: string): { surface: string; onSurface: string; secondary: string } {
  const defaults = { surface: "#f6f1ea", onSurface: "#391e1e", secondary: "#84262c" };
  const preset = getPreset(presetKey);
  if (!preset) return defaults;

  // Extract meaningful colors from the preset's CSS
  if (presetKey === "espresso-dark") return { surface: "#391e1e", onSurface: "#f6f1ea", secondary: "#d8c0bb" };
  if (presetKey === "blush-accent") return { surface: "#f2e8e5", onSurface: "#391e1e", secondary: "#84262c" };
  if (presetKey === "glaze-neutral") return { surface: "#e8e0d5", onSurface: "#391e1e", secondary: "#84262c" };
  if (presetKey === "powder-soft") return { surface: "#efe7df", onSurface: "#391e1e", secondary: "#84262c" };
  if (presetKey === "warm-silk") return { surface: "#f6f1ea", onSurface: "#391e1e", secondary: "#84262c" };
  if (presetKey === "editorial-wash") return { surface: "#efe7df", onSurface: "#391e1e", secondary: "#84262c" };
  if (presetKey === "cream-glow") return { surface: "#f3ece4", onSurface: "#391e1e", secondary: "#84262c" };

  return defaults;
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
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <input
        type="color"
        value={display}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: 28, height: 28, border: "2px solid #e5e7eb", borderRadius: 4, cursor: "pointer", padding: 0, flexShrink: 0 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.6875rem", fontWeight: 500, color: "#374151" }}>{label}</div>
        <div style={{ fontSize: "0.625rem", color: "#9ca3af", fontFamily: "monospace" }}>
          {display}
          {value && (
            <button
              onClick={() => onChange(undefined)}
              style={{ marginLeft: 4, background: "none", border: "none", color: "#6366f1", fontSize: "0.625rem", cursor: "pointer", padding: 0 }}
            >
              reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Inline Preview ──────────────────────────────────────────────────────────

function DesignPreview({
  designStyle,
  colors,
  bgImage,
  pagePath,
  sectionLabel,
}: {
  designStyle: string;
  colors: Record<string, string | undefined>;
  bgImage: string;
  pagePath: string;
  sectionLabel: string;
}) {
  const preset = getPreset(designStyle);
  const presetStyles = preset?.styles || {};
  const isCustomized = designStyle !== "default" || Object.keys(colors).some((k) => colors[k]) || bgImage;

  // Build combined preview styles
  const previewStyle: React.CSSProperties = {
    ...presetStyles,
    padding: "2rem 1.5rem",
    borderRadius: "0.375rem",
    minHeight: 140,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.625rem",
    transition: "all 0.3s ease",
    textAlign: "center",
  };

  // Default to something visible if no preset
  if (!previewStyle.background && !previewStyle.backgroundColor) {
    previewStyle.backgroundColor = "#f6f1ea";
  }

  if (colors.surface) previewStyle.backgroundColor = colors.surface;
  if (colors.onSurface) previewStyle.color = colors.onSurface;

  if (bgImage) {
    previewStyle.backgroundImage = `url('${bgImage}')`;
    previewStyle.backgroundSize = "cover";
    previewStyle.backgroundPosition = "center";
  }

  const textColor = colors.onSurface || (preset?.lightText ? "#f6f1ea" : "#391e1e");
  const accentColor = colors.secondary || "#84262c";
  const mutedColor = preset?.lightText ? "rgba(246,241,234,0.5)" : "rgba(57,30,30,0.4)";

  return (
    <div style={{ marginTop: "0.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.375rem" }}>
        <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Style Preview {isCustomized ? "" : "(Default)"}
        </span>
        {pagePath !== "(global)" && (
          <a href={pagePath} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.625rem", color: "#6366f1", textDecoration: "none" }}>
            Open page &#8599;
          </a>
        )}
      </div>
      <div style={previewStyle}>
        {/* Divider line like the real CTA */}
        <div style={{ width: 32, height: 1, backgroundColor: mutedColor, marginBottom: "0.25rem" }} />

        <span style={{
          fontFamily: "Georgia, 'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: "1.125rem",
          color: textColor,
          lineHeight: 1.3,
          maxWidth: "80%",
        }}>
          {sectionLabel}
        </span>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginTop: "0.25rem" }}>
          <span style={{
            display: "inline-block",
            padding: "0.35rem 1rem",
            backgroundColor: preset?.lightText ? "rgba(246,241,234,0.9)" : accentColor,
            color: preset?.lightText ? "#391e1e" : "#fff",
            fontSize: "0.625rem",
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
          }}>
            Primary Action
          </span>
          <span style={{
            fontSize: "0.5rem",
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: textColor,
            opacity: 0.5,
          }}>
            Secondary Link
          </span>
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
  sectionLabel,
  previewText,
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
  const [expanded, setExpanded] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  // Read current section config
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

  // When preset changes, update color pickers to show preset colors
  const handlePresetChange = useCallback((presetKey: string) => {
    setDesignStyle(presetKey);
    if (presetKey === "default") {
      setColors({});
    } else {
      const presetColors = getPresetColors(presetKey);
      setColors({
        surface: presetColors.surface,
        onSurface: presetColors.onSurface,
        secondary: presetColors.secondary,
      });
    }
  }, []);

  // Save
  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const currentSettings = (pageSettings?.metadata || {}) as Record<string, unknown>;
      const currentSections = { ...((currentSettings.sections || {}) as Record<string, unknown>) };

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
      setPreviewKey((k) => k + 1); // refresh preview
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }, [pageKey, sectionKey, designStyle, colors, bgImage, pageSettings, upsert]);

  // Reset
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

      currentSections[sectionKey] = { visible: existing.visible !== false };
      await upsert({
        key: `page_settings_${pageKey}`,
        metadata: { ...currentSettings, sections: currentSections },
      });

      setSaved(true);
      setPreviewKey((k) => k + 1);
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
  const presetColors = getPresetColors(designStyle);

  return (
    <div style={{
      marginTop: "1rem",
      border: "1px solid #e5e7eb",
      borderRadius: "0.5rem",
      overflow: "hidden",
    }}>
      {/* Clickable header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          padding: "0.625rem 1rem",
          backgroundColor: "#f9fafb",
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
          borderBottom: expanded ? "1px solid #e5e7eb" : "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Customize Design
          </span>
          {hasCustomizations && (
            <span style={{ padding: "0.1rem 0.35rem", borderRadius: "9999px", fontSize: "0.5625rem", fontWeight: 500, backgroundColor: "#EEF2FF", color: "#4338CA" }}>
              Custom
            </span>
          )}
        </div>
        <span style={{ fontSize: 14, color: "#9ca3af", transform: expanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.15s ease" }}>
          &#9662;
        </span>
      </button>

      {expanded && (
        <div style={{ padding: "0.875rem 1rem" }}>
          {/* Preset Styles */}
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.375rem" }}>
              Preset Styles
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
              {DESIGN_PRESETS.map((preset) => (
                <button
                  key={preset.key}
                  onClick={() => handlePresetChange(preset.key)}
                  title={preset.description}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "0.25rem 0.5rem",
                    border: designStyle === preset.key ? "2px solid #6366f1" : "1px solid #e5e7eb",
                    borderRadius: "0.25rem",
                    backgroundColor: designStyle === preset.key ? "#EEF2FF" : "#fff",
                    fontSize: "0.625rem",
                    color: "#374151",
                    cursor: "pointer",
                  }}
                >
                  <span style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    backgroundColor: preset.swatch,
                    border: "1px solid rgba(0,0,0,0.15)",
                    flexShrink: 0,
                  }} />
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.375rem" }}>
              Colors
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
              <ColorPicker
                label="Background"
                value={colors.surface}
                defaultValue={presetColors.surface}
                onChange={(val) => setColors((prev) => {
                  const next = { ...prev };
                  if (val) next.surface = val; else delete next.surface;
                  return next;
                })}
              />
              <ColorPicker
                label="Text"
                value={colors.onSurface}
                defaultValue={presetColors.onSurface}
                onChange={(val) => setColors((prev) => {
                  const next = { ...prev };
                  if (val) next.onSurface = val; else delete next.onSurface;
                  return next;
                })}
              />
              <ColorPicker
                label="Accent"
                value={colors.secondary}
                defaultValue={presetColors.secondary}
                onChange={(val) => setColors((prev) => {
                  const next = { ...prev };
                  if (val) next.secondary = val; else delete next.secondary;
                  return next;
                })}
              />
            </div>
          </div>

          {/* Background Image */}
          <div style={{ marginBottom: "0.75rem" }}>
            <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.375rem" }}>
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
                    style={{ fontSize: "0.625rem", color: "#dc2626", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    Remove
                  </button>
                </>
              ) : (
                <label style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "0.3rem 0.6rem",
                  border: "1px dashed #d1d5db",
                  borderRadius: "0.25rem",
                  backgroundColor: "#f9fafb",
                  fontSize: "0.625rem",
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.5rem", borderTop: "1px solid #f3f4f6" }}>
            <div>
              {hasCustomizations && (
                <button
                  onClick={handleReset}
                  style={{ fontSize: "0.625rem", color: "#dc2626", background: "none", border: "1px solid #fca5a5", borderRadius: "0.25rem", padding: "0.2rem 0.4rem", cursor: "pointer" }}
                >
                  Reset
                </button>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {saved && <span style={{ fontSize: "0.625rem", color: "#16a34a", fontWeight: 500 }}>Saved!</span>}
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: "0.25rem 0.6rem",
                  border: "none",
                  borderRadius: "0.25rem",
                  backgroundColor: "#6366f1",
                  color: "#fff",
                  fontSize: "0.625rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? "Saving..." : "Save Design"}
              </button>
            </div>
          </div>

          {/* Style Preview */}
          <DesignPreview
            key={previewKey}
            designStyle={designStyle}
            colors={colors as Record<string, string | undefined>}
            bgImage={bgImage}
            pagePath={pagePath}
            sectionLabel={previewText}
          />
        </div>
      )}
    </div>
  );
}

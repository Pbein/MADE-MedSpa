"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  PAGE_DEFINITIONS,
  PageSettings,
  PageColors,
} from "@/hooks/usePageSettings";

// ── Styles ───────────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "#111827",
  marginBottom: "0.25rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  border: "1px solid #e5e7eb",
  borderRadius: "0.375rem",
  fontSize: "0.9375rem",
  boxSizing: "border-box",
};

const btnPrimary: React.CSSProperties = {
  padding: "0.5rem 1.25rem",
  border: "none",
  borderRadius: "0.375rem",
  backgroundColor: "#6366f1",
  color: "#fff",
  fontSize: "0.875rem",
  fontWeight: 500,
  cursor: "pointer",
};

const btnSecondary: React.CSSProperties = {
  padding: "0.5rem 1.25rem",
  border: "1px solid #e5e7eb",
  borderRadius: "0.375rem",
  backgroundColor: "transparent",
  color: "#374151",
  fontSize: "0.875rem",
  cursor: "pointer",
};

// ── Default palette (from globals.css) ──────────────────────────────────────

const DEFAULT_COLORS: Required<PageColors> = {
  primary: "#391e1e",
  secondary: "#84262c",
  surface: "#fbfaef",
  surfaceLow: "#f5f4e9",
  onSurface: "#1b1c16",
  onSurfaceVariant: "#504443",
  outline: "#827473",
};

const COLOR_LABELS: Record<keyof PageColors, string> = {
  primary: "Primary (Espresso)",
  secondary: "Accent (Blush)",
  surface: "Background",
  surfaceLow: "Background Alt",
  onSurface: "Text",
  onSurfaceVariant: "Text Secondary",
  outline: "Borders",
};

// ── Preset palettes ─────────────────────────────────────────────────────────

const PRESETS: { name: string; colors: PageColors }[] = [
  { name: "Default (Editorial)", colors: {} },
  {
    name: "Warm Espresso",
    colors: { primary: "#3C2415", secondary: "#D4A59A", surface: "#FAF6F1", surfaceLow: "#F3EDE6", onSurface: "#3C2415", onSurfaceVariant: "#7A706A" },
  },
  {
    name: "Cool Sage",
    colors: { primary: "#2d3a2d", secondary: "#8A9A6E", surface: "#f5f7f2", surfaceLow: "#eef0eb", onSurface: "#1a2e1a", onSurfaceVariant: "#556b55" },
  },
  {
    name: "Soft Blush",
    colors: { primary: "#5c2a2a", secondary: "#c48b8b", surface: "#fdf5f5", surfaceLow: "#f9eeed", onSurface: "#2a1515", onSurfaceVariant: "#6b4a4a" },
  },
  {
    name: "Midnight Luxe",
    colors: { primary: "#1a1a2e", secondary: "#c6a87d", surface: "#f5f3ef", surfaceLow: "#ece9e3", onSurface: "#1a1a2e", onSurfaceVariant: "#5a5870" },
  },
];

// ── Color picker field ──────────────────────────────────────────────────────

function ColorField({
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
  const displayValue = value || defaultValue;
  const isCustom = value !== undefined;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <input
        type="color"
        value={displayValue}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: 36,
          height: 36,
          border: "2px solid #e5e7eb",
          borderRadius: "0.375rem",
          cursor: "pointer",
          padding: 0,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.8125rem", fontWeight: 500, color: "#111827" }}>{label}</div>
        <div style={{ fontSize: "0.75rem", color: "#9ca3af", fontFamily: "monospace" }}>
          {displayValue}
          {isCustom && (
            <button
              onClick={() => onChange(undefined)}
              style={{
                marginLeft: 8,
                background: "none",
                border: "none",
                color: "#6366f1",
                fontSize: "0.75rem",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Single page editor card ─────────────────────────────────────────────────

function PageSettingsCard({
  pageKey,
  definition,
}: {
  pageKey: string;
  definition: (typeof PAGE_DEFINITIONS)[string];
}) {
  const content = useQuery(api.siteContent.getByKey, {
    key: `page_settings_${pageKey}`,
  });
  const upsert = useMutation(api.siteContent.upsert);

  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Local draft state
  const settings: PageSettings = (content?.metadata as PageSettings) || {
    colors: {},
    hero: {},
    sections: {},
  };

  const [colors, setColors] = useState<PageColors>(settings.colors || {});
  const [sections, setSections] = useState<PageSections>(settings.sections || {});
  const [hero, setHero] = useState(settings.hero || {});

  // Sync from DB when content loads
  const contentKey = content?._id;
  const [lastSyncKey, setLastSyncKey] = useState<string | null>(null);
  if (contentKey && contentKey !== lastSyncKey) {
    setLastSyncKey(contentKey);
    const s = (content?.metadata as PageSettings) || { colors: {}, hero: {}, sections: {} };
    setColors(s.colors || {});
    setSections(s.sections || {});
    setHero(s.hero || {});
  }

  type PageSections = Record<string, boolean>;

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const metadata: PageSettings = { colors, hero, sections };
      await upsert({ key: `page_settings_${pageKey}`, metadata });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }, [colors, hero, sections, pageKey, upsert]);

  const handleReset = useCallback(async () => {
    setColors({});
    setHero({});
    setSections({});
    setSaving(true);
    try {
      await upsert({
        key: `page_settings_${pageKey}`,
        metadata: { colors: {}, hero: {}, sections: {} },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }, [pageKey, upsert]);

  const hasCustomizations =
    Object.keys(colors).length > 0 ||
    Object.keys(hero).length > 0 ||
    Object.values(sections).some((v) => v === false);

  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "0.5rem",
        overflow: "hidden",
      }}
    >
      {/* Header — always visible */}
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
        <div>
          <div style={{ fontSize: "1rem", fontWeight: 600, color: "#111827" }}>
            {definition.label}
          </div>
          <div style={{ fontSize: "0.8125rem", color: "#6b7280" }}>
            {definition.path}
            {hasCustomizations && (
              <span
                style={{
                  marginLeft: 8,
                  padding: "0.125rem 0.5rem",
                  borderRadius: "9999px",
                  fontSize: "0.6875rem",
                  fontWeight: 500,
                  backgroundColor: "#EEF2FF",
                  color: "#4338CA",
                }}
              >
                Customized
              </span>
            )}
          </div>
        </div>
        <span
          style={{
            fontSize: 18,
            color: "#9ca3af",
            transform: expanded ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.15s ease",
          }}
        >
          &#9662;
        </span>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div style={{ padding: "0 1.25rem 1.25rem", borderTop: "1px solid #f3f4f6" }}>
          {/* Preset palettes */}
          <div style={{ marginTop: "1rem", marginBottom: "1.25rem" }}>
            <label style={labelStyle}>Quick Palette</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setColors({ ...preset.colors })}
                  style={{
                    padding: "0.375rem 0.75rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.375rem",
                    backgroundColor: "#fff",
                    fontSize: "0.8125rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 3,
                      backgroundColor: preset.colors.primary || DEFAULT_COLORS.primary,
                      border: "1px solid rgba(0,0,0,0.1)",
                      flexShrink: 0,
                    }}
                  />
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Color pickers */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={labelStyle}>Colors</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
                marginTop: "0.5rem",
              }}
            >
              {(Object.keys(DEFAULT_COLORS) as Array<keyof PageColors>).map(
                (key) => (
                  <ColorField
                    key={key}
                    label={COLOR_LABELS[key]}
                    value={colors[key]}
                    defaultValue={DEFAULT_COLORS[key]}
                    onChange={(val) => {
                      setColors((prev) => {
                        const next = { ...prev };
                        if (val === undefined) {
                          delete next[key];
                        } else {
                          next[key] = val;
                        }
                        return next;
                      });
                    }}
                  />
                )
              )}
            </div>
          </div>

          {/* Section visibility */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={labelStyle}>Sections</label>
            <p style={{ fontSize: "0.8125rem", color: "#6b7280", margin: "0 0 0.5rem 0" }}>
              Toggle sections on or off for this page.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              {definition.sections.map((sec) => {
                const visible = sections[sec.key] !== false;
                return (
                  <label
                    key={sec.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: "0.875rem",
                      color: "#374151",
                      cursor: "pointer",
                      padding: "0.25rem 0",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={visible}
                      onChange={(e) => {
                        setSections((prev) => ({
                          ...prev,
                          [sec.key]: e.target.checked,
                        }));
                      }}
                      style={{ width: 16, height: 16, cursor: "pointer" }}
                    />
                    {sec.label}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Hero overrides */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={labelStyle}>Hero Content Overrides</label>
            <p style={{ fontSize: "0.8125rem", color: "#6b7280", margin: "0 0 0.5rem 0" }}>
              Leave blank to use the default text.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div>
                <label style={{ fontSize: "0.8125rem", color: "#374151", marginBottom: 2, display: "block" }}>
                  Headline
                </label>
                <input
                  type="text"
                  value={hero.headline || ""}
                  onChange={(e) =>
                    setHero((prev) => ({ ...prev, headline: e.target.value || undefined }))
                  }
                  placeholder="Default headline"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.8125rem", color: "#374151", marginBottom: 2, display: "block" }}>
                  Subtitle
                </label>
                <input
                  type="text"
                  value={hero.subtitle || ""}
                  onChange={(e) =>
                    setHero((prev) => ({ ...prev, subtitle: e.target.value || undefined }))
                  }
                  placeholder="Default subtitle"
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.8125rem", color: "#374151", marginBottom: 2, display: "block" }}>
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={hero.ctaText || ""}
                    onChange={(e) =>
                      setHero((prev) => ({ ...prev, ctaText: e.target.value || undefined }))
                    }
                    placeholder="Default CTA"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.8125rem", color: "#374151", marginBottom: 2, display: "block" }}>
                    CTA Link
                  </label>
                  <input
                    type="text"
                    value={hero.ctaLink || ""}
                    onChange={(e) =>
                      setHero((prev) => ({ ...prev, ctaLink: e.target.value || undefined }))
                    }
                    placeholder="/booking"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "1rem",
              borderTop: "1px solid #f3f4f6",
            }}
          >
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {hasCustomizations && (
                <button onClick={handleReset} style={{ ...btnSecondary, color: "#dc2626", borderColor: "#fca5a5" }}>
                  Reset to Defaults
                </button>
              )}
              <a
                href={definition.path}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...btnSecondary, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
              >
                Preview Page &#8599;
              </a>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {saved && (
                <span style={{ fontSize: "0.875rem", color: "#16a34a", fontWeight: 500 }}>
                  Saved!
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function CustomizePagesAdmin() {
  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: "2rem 1.5rem",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "#111827",
            margin: "0 0 0.25rem 0",
          }}
        >
          Customize Pages
        </h1>
        <p style={{ fontSize: "0.9375rem", color: "#6b7280", margin: 0 }}>
          Adjust colors, toggle sections, and customize hero content for each
          page. Changes take effect immediately after saving.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {Object.entries(PAGE_DEFINITIONS).map(([key, def]) => (
          <PageSettingsCard key={key} pageKey={key} definition={def} />
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";

/* ── Accent Colors ──────────────────────────────────── */

const ACCENTS = [
  {
    name: "Warm Gold",
    base: "#C9A96E",
    light: "#D4B87E",
    dark: "#B8955A",
    text: "#816c46",
    contrast: "#2D1E17",
  },
  {
    name: "Rose Copper",
    base: "#B87D6B",
    light: "#C99182",
    dark: "#A66B59",
    text: "#936456",
    contrast: "#2D1E17",
  },
  {
    name: "Champagne",
    base: "#D4A574",
    light: "#DEB588",
    dark: "#C49562",
    text: "#886a4a",
    contrast: "#2D1E17",
  },
  {
    name: "Lavender",
    base: "#9B8EC4",
    light: "#AEA3D0",
    dark: "#8A7CB5",
    text: "#746a93",
    contrast: "#2D1E17",
  },
] as const;

/* ── Design Moods ───────────────────────────────────── */

const MOODS = [
  {
    name: "Editorial",
    description: "Magazine luxury",
    vars: {
      "--font-headline": 'var(--font-playfair), "Playfair Display", Georgia, serif',
      "--font-accent": 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif',
      "--font-body": 'var(--font-jost), "Jost", "Helvetica Neue", Arial, sans-serif',
      "--border-radius-sm": "4px",
      "--border-radius-md": "8px",
      "--border-radius-lg": "16px",
      "--space-section": "clamp(4rem, 3rem + 5vw, 8rem)",
      "--accent-font-style": "italic",
      "--letter-spacing-body": "0",
      "--line-height-body": "1.7",
    },
  },
  {
    name: "Modern Minimal",
    description: "Clean & contemporary",
    vars: {
      "--font-headline": 'var(--font-inter), "Inter", "Helvetica Neue", Arial, sans-serif',
      "--font-accent": 'var(--font-dm-sans), "DM Sans", "Helvetica Neue", Arial, sans-serif',
      "--font-body": 'var(--font-dm-sans), "DM Sans", "Helvetica Neue", Arial, sans-serif',
      "--border-radius-sm": "12px",
      "--border-radius-md": "16px",
      "--border-radius-lg": "24px",
      "--space-section": "clamp(3rem, 2.5rem + 4vw, 6rem)",
      "--accent-font-style": "normal",
      "--letter-spacing-body": "0.01em",
      "--line-height-body": "1.6",
    },
  },
  {
    name: "Soft Luxe",
    description: "Feminine & approachable",
    vars: {
      "--font-headline": 'var(--font-lora), "Lora", Georgia, serif',
      "--font-accent": 'var(--font-lora), "Lora", Georgia, serif',
      "--font-body": 'var(--font-nunito-sans), "Nunito Sans", "Helvetica Neue", Arial, sans-serif',
      "--border-radius-sm": "20px",
      "--border-radius-md": "24px",
      "--border-radius-lg": "32px",
      "--space-section": "clamp(4.5rem, 3.5rem + 5vw, 9rem)",
      "--accent-font-style": "italic",
      "--letter-spacing-body": "0.015em",
      "--line-height-body": "1.8",
    },
  },
  {
    name: "Bold Statement",
    description: "Fashion-forward",
    vars: {
      "--font-headline": 'var(--font-syne), "Syne", "Helvetica Neue", Arial, sans-serif',
      "--font-accent": 'var(--font-space-grotesk), "Space Grotesk", "Helvetica Neue", Arial, sans-serif',
      "--font-body": 'var(--font-space-grotesk), "Space Grotesk", "Helvetica Neue", Arial, sans-serif',
      "--border-radius-sm": "0px",
      "--border-radius-md": "0px",
      "--border-radius-lg": "0px",
      "--space-section": "clamp(3rem, 2rem + 4vw, 5.5rem)",
      "--accent-font-style": "normal",
      "--letter-spacing-body": "0.02em",
      "--line-height-body": "1.6",
    },
  },
  {
    name: "Dark Luxe",
    description: "Noir high-end beauty",
    vars: {
      "--font-headline": 'var(--font-dm-serif-display), "DM Serif Display", Georgia, serif',
      "--font-accent": 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif',
      "--font-body": 'var(--font-jost), "Jost", "Helvetica Neue", Arial, sans-serif',
      "--color-ivory": "#2D1E17",
      "--color-cream": "#3A2A1F",
      "--color-white": "#4A3828",
      "--color-chocolate": "#F7F3EF",
      "--color-brown-dark": "#E8E0D6",
      "--color-brown": "#C4B8AD",
      "--color-stone": "#523F31",
      "--color-stone-dark": "#796254",
      "--background": "#2D1E17",
      "--foreground": "#E8E0D6",
      "--border-radius-sm": "4px",
      "--border-radius-md": "8px",
      "--border-radius-lg": "16px",
      "--space-section": "clamp(4rem, 3rem + 5vw, 8rem)",
      "--accent-font-style": "italic",
      "--letter-spacing-body": "0.01em",
      "--line-height-body": "1.7",
      "--shadow-sm": "0 1px 3px rgba(0, 0, 0, 0.2)",
      "--shadow-md": "0 4px 12px rgba(0, 0, 0, 0.25)",
      "--shadow-lg": "0 8px 30px rgba(0, 0, 0, 0.3)",
      "--shadow-xl": "0 16px 50px rgba(0, 0, 0, 0.35)",
    },
  },
  {
    name: "Warm Serene",
    description: "Organic wellness luxury",
    vars: {
      "--font-headline": 'var(--font-lora), "Lora", Georgia, serif',
      "--font-accent": 'var(--font-outfit), "Outfit", "Helvetica Neue", Arial, sans-serif',
      "--font-body": 'var(--font-outfit), "Outfit", "Helvetica Neue", Arial, sans-serif',
      "--color-ivory": "#FAF6F1",
      "--color-cream": "#F3ECE4",
      "--color-white": "#EDE6DD",
      "--color-chocolate": "#2D1E17",
      "--color-brown-dark": "#523F31",
      "--color-brown": "#796254",
      "--color-stone": "#D4C8BB",
      "--color-stone-dark": "#9D8A7C",
      "--background": "#FAF6F1",
      "--foreground": "#523F31",
      "--border-radius-sm": "8px",
      "--border-radius-md": "14px",
      "--border-radius-lg": "20px",
      "--space-section": "clamp(5rem, 4rem + 5vw, 10rem)",
      "--accent-font-style": "normal",
      "--letter-spacing-body": "0.01em",
      "--line-height-body": "1.85",
      "--shadow-sm": "0 1px 3px rgba(45, 30, 23, 0.04)",
      "--shadow-md": "0 4px 12px rgba(45, 30, 23, 0.06)",
      "--shadow-lg": "0 8px 30px rgba(45, 30, 23, 0.08)",
      "--shadow-xl": "0 16px 50px rgba(45, 30, 23, 0.1)",
    },
  },
] as const;

/* ── Storage Keys ───────────────────────────────────── */

const ACCENT_KEY = "made-accent";
const MOOD_KEY = "made-mood";

/* ── Component ──────────────────────────────────────── */

export default function AccentSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAccent, setActiveAccent] = useState(0);
  const [activeMood, setActiveMood] = useState(0);
  const [tab, setTab] = useState<"accent" | "mood">("mood");

  useEffect(() => {
    const savedAccent = localStorage.getItem(ACCENT_KEY);
    const savedMood = localStorage.getItem(MOOD_KEY);
    if (savedAccent !== null) {
      const idx = parseInt(savedAccent, 10);
      if (idx >= 0 && idx < ACCENTS.length) {
        setActiveAccent(idx);
        applyAccent(idx);
      }
    }
    if (savedMood !== null) {
      const idx = parseInt(savedMood, 10);
      if (idx >= 0 && idx < MOODS.length) {
        setActiveMood(idx);
        applyMood(idx);
      }
    }
  }, []);

  function applyAccent(index: number) {
    const accent = ACCENTS[index];
    const root = document.documentElement;
    root.style.setProperty("--color-burgundy", accent.base);
    root.style.setProperty("--color-burgundy-light", accent.light);
    root.style.setProperty("--color-burgundy-dark", accent.dark);
    root.style.setProperty("--color-accent-text", accent.text);
    root.style.setProperty("--color-accent-contrast", accent.contrast);
    localStorage.setItem(ACCENT_KEY, String(index));
  }

  function applyMood(index: number) {
    const mood = MOODS[index];
    const root = document.documentElement;
    for (const [key, value] of Object.entries(mood.vars)) {
      root.style.setProperty(key, value as string);
    }
    // Update body styles that reference these vars
    const vars = mood.vars as Record<string, string>;
    document.body.style.letterSpacing = vars["--letter-spacing-body"] || "";
    document.body.style.lineHeight = vars["--line-height-body"] || "";
    // Force background update for dark/light mode switches
    if (vars["--background"]) {
      document.body.style.backgroundColor = vars["--background"];
      document.body.style.color = vars["--foreground"] || "";
    }
    localStorage.setItem(MOOD_KEY, String(index));
  }

  function handleAccent(index: number) {
    setActiveAccent(index);
    applyAccent(index);
  }

  function handleMood(index: number) {
    setActiveMood(index);
    applyMood(index);
  }

  const s = styles;

  return (
    <div style={s.wrapper}>
      {/* Expanded panel */}
      {isOpen && (
        <div style={s.panel}>
          {/* Tabs */}
          <div style={s.tabs}>
            <button
              onClick={() => setTab("mood")}
              style={{
                ...s.tab,
                ...(tab === "mood" ? s.tabActive : {}),
              }}
            >
              Design
            </button>
            <button
              onClick={() => setTab("accent")}
              style={{
                ...s.tab,
                ...(tab === "accent" ? s.tabActive : {}),
              }}
            >
              Accent
            </button>
          </div>

          {/* Mood options */}
          {tab === "mood" && (
            <div style={s.optionList}>
              {MOODS.map((mood, i) => (
                <button
                  key={mood.name}
                  onClick={() => handleMood(i)}
                  style={{
                    ...s.optionBtn,
                    ...(activeMood === i ? s.optionActive : {}),
                    borderColor: activeMood === i ? ACCENTS[activeAccent].base : "transparent",
                  }}
                >
                  {/* Preview block */}
                  <span
                    style={{
                      ...s.moodPreview,
                      background: i === 4 ? "#2D1E17" : "#3D2C22",
                      borderWidth: i === 4 ? 1 : 0,
                      borderStyle: "solid",
                      borderColor: i === 4 ? "#523F31" : "transparent",
                    }}
                  >
                    <span
                      style={{
                        ...s.moodPreviewHeading,
                        fontFamily: i === 0 ? '"Playfair Display", serif' :
                                   i === 1 ? '"Inter", sans-serif' :
                                   i === 2 ? '"Lora", serif' :
                                   i === 3 ? '"Syne", sans-serif' :
                                   i === 4 ? '"DM Serif Display", serif' :
                                   '"Lora", serif',
                        borderRadius: i === 0 ? 2 : i === 1 ? 6 : i === 2 ? 10 : i === 3 ? 0 : i === 5 ? 7 : 2,
                        color: i === 4 ? "#C9A96E" : "#F0EAE3",
                      }}
                    >
                      Aa
                    </span>
                  </span>
                  <span style={s.optionTextWrap}>
                    <span style={s.optionName}>{mood.name}</span>
                    <span style={s.optionDesc}>{mood.description}</span>
                  </span>
                  {activeMood === i && (
                    <span style={{ ...s.check, color: ACCENTS[activeAccent].base }}>
                      &#10003;
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Accent options */}
          {tab === "accent" && (
            <div style={s.optionList}>
              {ACCENTS.map((accent, i) => (
                <button
                  key={accent.name}
                  onClick={() => handleAccent(i)}
                  style={{
                    ...s.optionBtn,
                    ...(activeAccent === i ? s.optionActive : {}),
                    borderColor: activeAccent === i ? accent.base : "transparent",
                  }}
                >
                  <span
                    style={{
                      ...s.swatch,
                      backgroundColor: accent.base,
                    }}
                  />
                  <span style={s.optionTextWrap}>
                    <span style={s.optionName}>{accent.name}</span>
                    <span style={s.optionDesc}>{accent.base}</span>
                  </span>
                  {activeAccent === i && (
                    <span style={{ ...s.check, color: accent.base }}>&#10003;</span>
                  )}
                </button>
              ))}
            </div>
          )}

          <p style={s.footer}>
            Preview only — persists in browser
          </p>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle design picker"
        style={{
          ...s.toggleBtn,
          backgroundColor: ACCENTS[activeAccent].base,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2D1E17"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      </button>
    </div>
  );
}

/* ── Styles ─────────────────────────────────────────── */

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    position: "fixed",
    bottom: 24,
    right: 24,
    zIndex: 9999,
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  panel: {
    position: "absolute",
    bottom: 56,
    right: 0,
    background: "#2D1E17",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#523F31",
    borderRadius: 14,
    padding: "0 0 12px",
    width: 260,
    boxShadow: "0 16px 48px rgba(45, 30, 23, 0.45)",
    overflow: "hidden",
  },
  tabs: {
    display: "flex",
    borderBottomWidth: 1,
    borderBottomStyle: "solid" as const,
    borderBottomColor: "#523F31",
  },
  tab: {
    flex: 1,
    padding: "10px 0",
    background: "none",
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: "transparent",
    borderBottomWidth: 0,
    borderBottomStyle: "solid" as const,
    borderBottomColor: "transparent",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "#9D8A7C",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  tabActive: {
    color: "#F0EAE3",
    borderBottomWidth: 2,
    borderBottomColor: "#F0EAE3",
    marginBottom: -1,
  },
  optionList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 4,
    padding: "10px 12px",
  },
  optionBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 10px",
    background: "transparent",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "transparent",
    borderRadius: 8,
    cursor: "pointer",
    transition: "all 0.15s ease",
    textAlign: "left" as const,
  },
  optionActive: {
    background: "#523F31",
  },
  optionTextWrap: {
    display: "flex",
    flexDirection: "column" as const,
    flex: 1,
  },
  optionName: {
    fontSize: 13,
    fontWeight: 500,
    color: "#F0EAE3",
    lineHeight: 1.2,
  },
  optionDesc: {
    fontSize: 10,
    color: "#9D8A7C",
    fontFamily: "monospace",
    marginTop: 1,
  },
  check: {
    marginLeft: "auto",
    fontSize: 14,
    flexShrink: 0,
  },
  swatch: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "rgba(255,255,255,0.15)",
    flexShrink: 0,
  },
  moodPreview: {
    width: 36,
    height: 36,
    borderRadius: 6,
    background: "#3D2C22",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  moodPreviewHeading: {
    fontSize: 16,
    fontWeight: 600,
    color: "#F0EAE3",
    lineHeight: 1,
    padding: "4px 6px",
  },
  footer: {
    fontSize: 9,
    color: "#796254",
    margin: "4px 12px 0",
    lineHeight: 1.4,
  },
  toggleBtn: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "#523F31",
    cursor: "pointer",
    boxShadow: "0 4px 16px rgba(45, 30, 23, 0.3)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

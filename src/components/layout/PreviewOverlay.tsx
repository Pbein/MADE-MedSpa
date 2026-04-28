"use client";

import { useEffect } from "react";

/**
 * Client-side preview overlay.
 *
 * When the page is loaded with `?_previewSection=hero` and related preview
 * query params (set by the admin SectionDesignPanel iframe), this component
 * applies those overrides as inline styles on the matching `#section-<key>`
 * element. This makes the admin live-preview iframe reflect the operator's
 * in-memory color/font choices BEFORE they hit Save Design.
 *
 * No-op when query params aren't present — zero impact on real visitors.
 */
export default function PreviewOverlay() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const sectionKey = params.get("_previewSection");
    if (!sectionKey) return;

    const target = document.getElementById(`section-${sectionKey}`);
    if (!target) return;

    // Apply colors
    const colorsRaw = params.get("_previewColors");
    if (colorsRaw) {
      try {
        const colors = JSON.parse(colorsRaw) as Record<string, string>;
        if (colors.surface) target.style.setProperty("--color-surface", colors.surface);
        if (colors.onSurface) {
          target.style.setProperty("--color-on-surface", colors.onSurface);
          target.style.setProperty("--color-primary", colors.onSurface);
          target.style.setProperty("color", colors.onSurface);
        }
        if (colors.secondary) target.style.setProperty("--color-secondary", colors.secondary);
        if (colors.buttonBg) target.style.setProperty("--btn-bg", colors.buttonBg);
        if (colors.buttonText) target.style.setProperty("--btn-text", colors.buttonText);
        if (colors.divider) target.style.setProperty("--divider-color", colors.divider);
      } catch {
        // ignore malformed JSON
      }
    }

    // Apply preset designStyle
    const designStyle = params.get("_previewDesignStyle");
    if (designStyle && designStyle !== "default") {
      const presetMap: Record<string, { background?: string; color?: string }> = {
        "warm-silk": { background: "linear-gradient(180deg, #f6f1ea 0%, #efe7df 50%, #f6f1ea 100%)" },
        "editorial-wash": {
          background:
            "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.35) 0%, transparent 50%), linear-gradient(180deg, #efe7df 0%, #e8ddd5 50%, #efe7df 100%)",
        },
        "espresso-dark": {
          background: "linear-gradient(180deg, #391e1e 0%, #2d1515 50%, #391e1e 100%)",
          color: "#f6f1ea",
        },
        "blush-accent": {
          background: "linear-gradient(180deg, #f2e8e5 0%, #ecddd8 50%, #f2e8e5 100%)",
        },
        "glaze-neutral": {
          background: "linear-gradient(180deg, #ede5da 0%, #e8e0d5 50%, #ede5da 100%)",
        },
        "powder-soft": { background: "#efe7df" },
        "cream-glow": {
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 45%), #f3ece4",
        },
      };
      const preset = presetMap[designStyle];
      if (preset) {
        if (preset.background) target.style.setProperty("background", preset.background);
        if (preset.color) target.style.setProperty("color", preset.color);
      }
    }

    // Apply background image
    const bgImage = params.get("_previewBg");
    if (bgImage) {
      target.style.setProperty("background-image", `url('${bgImage}')`);
      target.style.setProperty("background-size", "cover");
      target.style.setProperty("background-position", "center");
      target.style.setProperty("background-repeat", "no-repeat");
    }

    // Apply font pair class
    const fontPair = params.get("_previewFontPair");
    if (fontPair && fontPair !== "default") {
      // Strip any existing font-pair-* classes first
      const existing = Array.from(target.classList).filter((c) => c.startsWith("font-pair-"));
      existing.forEach((c) => target.classList.remove(c));
      target.classList.add(`font-pair-${fontPair}`);
    }
  }, []);

  return null;
}

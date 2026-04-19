"use client";

import { useQuery } from "convex/react";
import { useSearchParams } from "next/navigation";
import { api } from "../../convex/_generated/api";
import { useMemo } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

export interface SectionContentResult<T extends Record<string, unknown>> {
  /** Merged data: DB values override defaults */
  data: T;
  /** Whether the DB query is still loading */
  isLoading: boolean;
  /** Whether this is showing preview data from the admin */
  isPreview: boolean;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Reads section content from the database, merging with defaults.
 * If no DB row exists, returns the defaults unchanged.
 * Also checks sessionStorage for preview mode data from the admin editor.
 *
 * @param contentKey - The siteContent key (e.g., "section_home_hero")
 * @param defaults - Default values (the current hardcoded text)
 */
export function useSectionContent<T extends Record<string, unknown>>(
  contentKey: string,
  defaults: T
): SectionContentResult<T> {
  const content = useQuery(api.siteContent.getByKey, { key: contentKey });
  const searchParams = useSearchParams();

  return useMemo(() => {
    // Check for preview data in sessionStorage
    let previewData: Partial<T> | null = null;
    const isPreviewMode = searchParams.get("_preview") === "true";

    if (isPreviewMode && typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem(`preview_section_${contentKey}`);
        if (stored) {
          previewData = JSON.parse(stored) as Partial<T>;
        }
      } catch {
        // sessionStorage unavailable or invalid JSON
      }
    }

    if (previewData) {
      return {
        data: { ...defaults, ...previewData },
        isLoading: false,
        isPreview: true,
      };
    }

    const isLoading = content === undefined;
    const dbData = content?.metadata as Partial<T> | undefined;

    return {
      data: dbData ? { ...defaults, ...dbData } : defaults,
      isLoading,
      isPreview: false,
    };
  }, [content, contentKey, defaults, searchParams]);
}

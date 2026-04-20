"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useMemo } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

export interface SectionContentResult<T extends Record<string, unknown>> {
  /** Merged data: DB values override defaults */
  data: T;
  /** Whether the DB query is still loading */
  isLoading: boolean;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Reads section content from the database, merging with defaults.
 * If no DB row exists, returns the defaults unchanged.
 */
export function useSectionContent<T extends Record<string, unknown>>(
  contentKey: string,
  defaults: T
): SectionContentResult<T> {
  const content = useQuery(api.siteContent.getByKey, { key: contentKey });

  return useMemo(() => {
    const isLoading = content === undefined;
    const dbData = content?.metadata as Partial<T> | undefined;

    return {
      data: dbData ? { ...defaults, ...dbData } : defaults,
      isLoading,
    };
  }, [content, contentKey, defaults]);
}

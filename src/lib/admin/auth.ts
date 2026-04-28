/**
 * Admin allowlist helpers (server-only).
 *
 * Reads `process.env.ADMIN_EMAILS` — a comma-separated list of email addresses
 * that are permitted to access /admin and to call admin Convex mutations.
 *
 * IMPORTANT: This module is for the Next.js server runtime only. The Convex
 * deployment has its own environment and reads `process.env.ADMIN_EMAILS`
 * independently — see `convex/lib/auth.ts`.
 *
 * Behavior:
 *   - Production (NODE_ENV === "production"): the allowlist MUST be non-empty.
 *     `parseAdminEmails` throws if it's missing/blank.
 *   - Development: an empty allowlist logs a one-time warning and `isAdminEmail`
 *     returns true for any email (dev convenience so local sign-in still works).
 */
import "server-only";

let warnedEmpty = false;

function rawAdminEmails(): string {
  return process.env.ADMIN_EMAILS ?? "";
}

/**
 * Returns the parsed allowlist as a lowercase, trimmed array.
 * Throws in production if the env var is unset or empty.
 */
export function parseAdminEmails(): string[] {
  const raw = rawAdminEmails();
  const list = raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0);

  if (list.length === 0) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "ADMIN_EMAILS is required in production. Set it in your hosting platform env (comma-separated emails)."
      );
    }
    if (!warnedEmpty) {
      warnedEmpty = true;
      console.warn(
        "[admin/auth] ADMIN_EMAILS is empty — allowing all signed-in users (dev only). Set ADMIN_EMAILS in .env.local to lock this down."
      );
    }
  }

  return list;
}

/**
 * Returns true if the given email is in the allowlist.
 * In development with an empty allowlist, returns true for any non-empty email
 * (and false for null/undefined/empty) — see `parseAdminEmails`.
 */
export function isAdminEmail(email: string | undefined | null): boolean {
  const allow = parseAdminEmails();

  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  if (normalized.length === 0) return false;

  // Dev convenience: empty allowlist => allow any signed-in user.
  if (allow.length === 0 && process.env.NODE_ENV !== "production") {
    return true;
  }

  return allow.includes(normalized);
}

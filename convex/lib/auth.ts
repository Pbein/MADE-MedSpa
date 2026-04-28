import type { MutationCtx, QueryCtx } from "../_generated/server";

/**
 * Admin allowlist enforcement for Convex mutations and queries.
 *
 * IMPORTANT: This runs inside the Convex deployment, NOT on Next.js. Convex has
 * its own environment-variable store — set `ADMIN_EMAILS` via:
 *
 *     npx convex env set ADMIN_EMAILS "alice@x.com,bob@x.com"
 *
 * (and again with `--prod` for the production deployment). The Next.js
 * middleware allowlist (`src/lib/admin/auth.ts`) does NOT cover direct Convex
 * client calls — every admin-write mutation must call `await assertAdmin(ctx)`
 * at the top of its handler.
 *
 * Behavior:
 *   - Throws `"Unauthorized: not an admin"` if there is no caller identity, or
 *     if the caller's email is not in the allowlist.
 *   - Dev convenience: if `ADMIN_EMAILS` is unset/empty, any signed-in caller
 *     is permitted and a one-time warning is logged. In production deployments
 *     you MUST set the env var (Convex doesn't expose NODE_ENV reliably, so
 *     this guardrail is enforced operationally — see the production runbook).
 */

let warnedEmpty = false;

function parseAllowlist(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0);
}

export async function assertAdmin(ctx: QueryCtx | MutationCtx): Promise<void> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized: not an admin");
  }

  const allowlist = parseAllowlist();
  const email = identity.email?.toLowerCase().trim() ?? "";
  const subject = identity.subject?.toLowerCase().trim() ?? "";
  const tokenIdentifier = identity.tokenIdentifier?.toLowerCase().trim() ?? "";

  if (allowlist.length === 0) {
    if (!warnedEmpty) {
      warnedEmpty = true;
      console.warn(
        "[convex/lib/auth] ADMIN_EMAILS is empty in this Convex deployment — allowing all signed-in callers (dev only). Run `npx convex env set ADMIN_EMAILS \"...\"` to lock down."
      );
    }
    return;
  }

  // Match against email OR Clerk subject (user_xxx) OR tokenIdentifier — any of
  // these can be added to ADMIN_EMAILS as a fallback when the Clerk JWT template
  // doesn't include the email claim.
  if (
    (email && allowlist.includes(email)) ||
    (subject && allowlist.includes(subject)) ||
    (tokenIdentifier && allowlist.includes(tokenIdentifier))
  ) {
    return;
  }

  // Diagnostic logging — visible in Convex dashboard logs. This makes the
  // "I'm signed in but rejected" case actionable: operators can see what
  // identifiers Clerk is actually sending, then add the right one to the
  // allowlist (or fix their Clerk JWT template to include `email`).
  console.warn(
    "[convex/lib/auth] Rejected admin call. Identity available:",
    JSON.stringify({
      hasEmail: Boolean(identity.email),
      email: identity.email,
      subject: identity.subject,
      tokenIdentifierStart: identity.tokenIdentifier?.slice(0, 60),
      allowlistSize: allowlist.length,
    }),
  );
  throw new Error("Unauthorized: not an admin");
}

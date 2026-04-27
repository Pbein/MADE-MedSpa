import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

export interface VerifyResult {
  ok: boolean;
  reason?: string;
}

/**
 * Pabau's webhook UI does not expose a shared secret or signing scheme. We embed
 * the secret in the URL path: `/api/pabau/webhooks/{PABAU_WEBHOOK_SECRET}`.
 * Only Pabau (and whoever holds the secret) knows the URL.
 *
 * Constant-time compare to defeat timing attacks on token guessing.
 */
export function verifyPabauUrlToken(
  providedToken: string,
  expectedSecret: string,
): VerifyResult {
  if (!expectedSecret) return { ok: false, reason: "Webhook secret not configured." };
  if (!providedToken) return { ok: false, reason: "Missing token." };
  const a = Buffer.from(providedToken);
  const b = Buffer.from(expectedSecret);
  if (a.length !== b.length) return { ok: false, reason: "Token length mismatch." };
  if (!timingSafeEqual(a, b)) return { ok: false, reason: "Token mismatch." };
  return { ok: true };
}

/**
 * HMAC-signature verification — kept for forward compat in case Pabau adds
 * signing later. Currently unused.
 */
export function verifyPabauSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
): VerifyResult {
  if (!signatureHeader) return { ok: false, reason: "Missing signature header." };
  if (!secret) return { ok: false, reason: "Webhook secret not configured." };

  const computed = createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  const provided = signatureHeader.startsWith("sha256=")
    ? signatureHeader.slice("sha256=".length)
    : signatureHeader;

  const a = Buffer.from(computed, "hex");
  const b = Buffer.from(provided, "hex");
  if (a.length !== b.length) return { ok: false, reason: "Signature length mismatch." };
  if (!timingSafeEqual(a, b)) return { ok: false, reason: "Signature mismatch." };
  return { ok: true };
}

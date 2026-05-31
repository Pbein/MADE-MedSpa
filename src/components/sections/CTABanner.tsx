"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { normalizeBookingHref } from "@/lib/bookingHref";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

interface CTABannerProps {
  headline: React.ReactNode;
  subtitle?: string;
  /** Small all-caps kicker above the headline. Presence triggers the elevated treatment. */
  eyebrow?: string;
  ctaText: string;
  ctaHref: string;
  secondaryText?: string;
  secondaryHref?: string;
  /**
   * Optional full-bleed background image (admin-uploaded, e.g. siteContent
   * `cta_bg`). Presence triggers the elevated treatment with an image + silk
   * overlay. When absent, the elevated treatment falls back to a warm gradient.
   */
  bgImageUrl?: string;
  /**
   * @deprecated Kept for backward-compat with existing call sites. Has no
   * functional effect — colors come from CSS variables set by the section
   * wrapper's customize-design overrides (or the defaults below).
   */
  dark?: boolean;
  /** Use 'external' to open ctaHref in a new tab */
  ctaExternal?: boolean;
}

// Default colors (preserve previous look when no customize-design override is set):
//   - background:  #f0ede4 (cream)
//   - headline / body / divider: #391e1e (espresso)
// These match the prior `dark={true}` defaults exactly.
const DEFAULT_SURFACE = "#f0ede4";
const DEFAULT_ON_SURFACE = "#391e1e";

export default function CTABanner({
  headline,
  subtitle,
  eyebrow,
  ctaText,
  ctaHref,
  secondaryText,
  secondaryHref,
  bgImageUrl,
  ctaExternal = false,
}: CTABannerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const primaryHref = normalizeBookingHref(ctaHref);
  const resolvedSecondaryHref = secondaryHref
    ? normalizeBookingHref(secondaryHref)
    : secondaryHref;

  // Elevated treatment (Stitch CTA port) is opt-in: only when a caller supplies
  // an eyebrow or a background image. Other pages keep the legacy centered look.
  const elevated = Boolean(eyebrow || bgImageUrl);

  if (elevated) {
    return (
      <section
        ref={ref}
        className="relative w-full overflow-hidden border-t"
        style={{ borderColor: "rgba(57,30,30,0.1)" }}
      >
        {/* Background — full-bleed image + silk overlay, or a warm gradient */}
        {bgImageUrl ? (
          <>
            <Image
              src={bgImageUrl}
              alt=""
              aria-hidden
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ backgroundColor: "rgba(246,241,234,0.55)", backdropFilter: "blur(2px)" }}
            />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: [
                "radial-gradient(ellipse 70% 80% at 30% 40%, rgba(232,224,213,0.5) 0%, transparent 60%),",
                "linear-gradient(135deg, var(--color-silk, #f6f1ea) 0%, var(--color-glaze, #e8e0d5) 55%, var(--color-petal-beige, #dccfc4) 100%)",
              ].join(" "),
            }}
          />
        )}

        {/* Faint grain */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.025,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "180px 180px",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-8 py-28 md:py-40">
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: luxuryEase }}
            className="flex flex-col items-center text-center"
          >
            {eyebrow && (
              <span
                className="uppercase block mb-6"
                style={{
                  fontFamily: "var(--font-label)",
                  fontSize: "13px",
                  letterSpacing: "0.3em",
                  color: "var(--color-primary, #391e1e)",
                }}
              >
                {eyebrow}
              </span>
            )}

            <h2
              style={{
                fontFamily: "var(--font-headline)",
                fontWeight: 400,
                fontStyle: "normal",
                textTransform: "none",
                letterSpacing: "-0.01em",
                lineHeight: 1.1,
                color: "var(--color-primary, #391e1e)",
                fontSize: "clamp(1.875rem, 3.4vw, 3rem)",
                maxWidth: "20ch",
                textWrap: "balance",
              }}
            >
              {headline}
            </h2>

            {subtitle && (
              <p
                className="font-body mt-8 max-w-xl"
                style={{
                  fontSize: "clamp(1rem, 1.4vw, 1.2rem)",
                  lineHeight: 1.8,
                  color: "rgba(57,30,30,0.9)",
                }}
              >
                {subtitle}
              </p>
            )}

            <div className="mt-12 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
              {ctaExternal ? (
                <a href={primaryHref} target="_blank" rel="noopener noreferrer" className="btn-hero">
                  {ctaText}
                </a>
              ) : (
                <Link href={primaryHref} className="btn-hero">
                  {ctaText}
                </Link>
              )}

              {secondaryText && resolvedSecondaryHref && (
                <Link
                  href={resolvedSecondaryHref}
                  className="link-hero-secondary"
                  style={{ color: "var(--color-primary, #391e1e)" }}
                >
                  {secondaryText}
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // ── Legacy centered treatment (unchanged) — used by other pages ──
  return (
    <section
      ref={ref}
      className="py-40 md:py-52 text-center"
      style={{
        backgroundColor: `var(--color-surface, ${DEFAULT_SURFACE})`,
        color: `var(--color-primary, ${DEFAULT_ON_SURFACE})`,
      }}
    >
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: luxuryEase }}
          className="flex flex-col items-center"
        >
          <div
            className="mx-auto mb-10 h-px w-16 opacity-30"
            style={{
              backgroundColor: `var(--divider-color, ${DEFAULT_ON_SURFACE})`,
            }}
          />

          <h2
            className="headline-section text-3xl md:text-4xl mb-8"
            style={{ color: `var(--color-primary, ${DEFAULT_ON_SURFACE})` }}
          >
            {headline}
          </h2>

          {subtitle && (
            <p
              className="body-editorial mb-12 max-w-xl"
              style={{
                color: `var(--color-on-surface-variant, ${DEFAULT_ON_SURFACE})`,
                opacity: 0.7,
              }}
            >
              {subtitle}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center">
            {ctaExternal ? (
              <a
                href={primaryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                {ctaText}
              </a>
            ) : (
              <Link href={primaryHref} className="btn-primary">
                {ctaText}
              </Link>
            )}

            {secondaryText && resolvedSecondaryHref && (
              <Link
                href={resolvedSecondaryHref}
                className="link-ghost"
                style={{ color: `var(--color-primary, ${DEFAULT_ON_SURFACE})` }}
              >
                {secondaryText}
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

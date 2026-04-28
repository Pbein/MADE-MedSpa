"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

interface CTABannerProps {
  headline: React.ReactNode;
  subtitle?: string;
  ctaText: string;
  ctaHref: string;
  secondaryText?: string;
  secondaryHref?: string;
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
  ctaText,
  ctaHref,
  secondaryText,
  secondaryHref,
  ctaExternal = false,
}: CTABannerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

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
          initial={{ opacity: 0, y: 30 }}
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
            className="headline-section text-4xl md:text-5xl italic mb-8"
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
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                {ctaText}
              </a>
            ) : (
              <Link href={ctaHref} className="btn-primary">
                {ctaText}
              </Link>
            )}

            {secondaryText && secondaryHref && (
              <Link
                href={secondaryHref}
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

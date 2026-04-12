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
  dark?: boolean;
  /** Use 'external' to open ctaHref in a new tab */
  ctaExternal?: boolean;
}

export default function CTABanner({
  headline,
  subtitle,
  ctaText,
  ctaHref,
  secondaryText,
  secondaryHref,
  dark = true,
  ctaExternal = false,
}: CTABannerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className={`py-40 md:py-52 text-center ${
        dark
          ? "bg-[#413e2a] text-[#f7f6eb]"
          : "bg-[var(--color-surface)] text-[var(--color-primary)]"
      }`}
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
              backgroundColor: dark
                ? "#f7f6eb"
                : "var(--color-outline-variant)",
            }}
          />

          <h2
            className="headline-section text-4xl md:text-5xl italic mb-8"
            style={{ color: dark ? "#f7f6eb" : "var(--color-primary)" }}
          >
            {headline}
          </h2>

          {subtitle && (
            <p
              className="body-editorial mb-12 max-w-xl"
              style={{
                color: dark
                  ? "#f7f6eb"
                  : "var(--color-on-surface-variant)",
                opacity: dark ? 0.6 : 0.8,
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
                className={dark ? "btn-light" : "btn-primary"}
              >
                {ctaText}
              </a>
            ) : (
              <Link
                href={ctaHref}
                className={dark ? "btn-light" : "btn-primary"}
              >
                {ctaText}
              </Link>
            )}

            {secondaryText && secondaryHref && (
              <Link
                href={secondaryHref}
                className={`link-ghost ${
                  dark ? "text-[#f7f6eb]" : "text-[var(--color-primary)]"
                }`}
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

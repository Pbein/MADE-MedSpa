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
  dark?: boolean;
}

export default function CTABanner({
  headline,
  subtitle,
  ctaText,
  ctaHref,
  dark = true,
}: CTABannerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      style={{
        backgroundColor: dark ? "var(--color-blush)" : "var(--color-soft-ivory)",
        color: dark ? "var(--color-soft-ivory)" : "var(--color-deep-cocoa)",
        paddingTop: "var(--space-section)",
        paddingBottom: "var(--space-section)",
      }}
    >
      <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: luxuryEase }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2
            className="headline-text mb-6"
            style={{
              fontSize: "var(--text-4xl)",
              color: dark ? "var(--color-soft-ivory)" : "var(--color-deep-cocoa)",
            }}
          >
            {headline}
          </h2>

          {subtitle && (
            <p
              className="mx-auto mb-10 max-w-md leading-relaxed"
              style={{
                fontSize: "var(--text-base)",
                color: dark ? "rgba(247, 246, 235, 0.7)" : "var(--color-warm-taupe)",
                fontWeight: 300,
              }}
            >
              {subtitle}
            </p>
          )}

          <Link
            href={ctaHref}
            className={dark ? "btn btn-light" : "btn btn-primary"}
          >
            {ctaText}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

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
      className={dark ? "section-blush" : "section-light"}
    >
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: luxuryEase }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2
            className="headline-section mb-6"
            style={{
              color: dark ? "var(--color-glaze)" : "var(--color-ink)",
            }}
          >
            {headline}
          </h2>

          {subtitle && (
            <p
              className="body-lg mx-auto mb-10 max-w-md"
              style={{
                color: dark
                  ? "rgba(247, 246, 235, 0.7)"
                  : "var(--color-olive)",
              }}
            >
              {subtitle}
            </p>
          )}

          <Link
            href={ctaHref}
            className={dark ? "btn-light" : "btn-primary"}
          >
            {ctaText}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

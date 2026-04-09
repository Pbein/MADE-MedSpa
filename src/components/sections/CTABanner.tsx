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
      className={`py-60 text-center ${
        dark
          ? "bg-[var(--color-primary)] text-[var(--color-surface)]"
          : "bg-[var(--color-surface)] text-[var(--color-primary)]"
      }`}
    >
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: luxuryEase }}
          className="flex flex-col items-center"
        >
          <h2 className="headline-section text-5xl italic mb-12">
            {headline}
          </h2>

          {subtitle && (
            <p
              className={`body-editorial mb-16 ${
                dark
                  ? "text-[var(--color-surface-variant)]/70"
                  : "text-[var(--color-on-surface-variant)]"
              }`}
            >
              {subtitle}
            </p>
          )}

          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <Link
              href={ctaHref}
              className={dark ? "btn-light" : "btn-primary"}
            >
              {ctaText}
            </Link>

            <Link
              href="/services"
              className={`link-ghost ${
                dark ? "text-[var(--color-surface)]" : "text-[var(--color-primary)]"
              }`}
            >
              Our Full Menu
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

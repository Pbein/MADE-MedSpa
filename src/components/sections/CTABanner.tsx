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
    <section ref={ref}>
      <div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: luxuryEase }}
        >
          <h2>{headline}</h2>

          {subtitle && <p>{subtitle}</p>}

          <Link href={ctaHref}>{ctaText}</Link>
        </motion.div>
      </div>
    </section>
  );
}

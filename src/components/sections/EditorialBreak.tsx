"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

interface EditorialBreakProps {
  text: React.ReactNode;
  variant?: "dark" | "warm" | "silk";
}

export default function EditorialBreak({
  text,
  variant = "warm",
}: EditorialBreakProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const bgClass =
    variant === "dark"
      ? "bg-[var(--color-primary)]"
      : variant === "silk"
        ? "bg-[var(--color-surface-low)]"
        : "bg-[var(--color-surface)]";

  const textClass =
    variant === "dark"
      ? "text-[var(--color-surface)]"
      : "text-[var(--color-primary)]";

  const dividerClass =
    variant === "dark"
      ? "bg-[var(--color-outline-variant)]/30"
      : "bg-[var(--color-outline-variant)]";

  return (
    <section ref={ref} className={`py-40 px-12 md:px-24 ${bgClass}`}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: luxuryEase }}
          className="flex flex-col items-center gap-10"
        >
          {/* Top accent divider */}
          <div className={`w-24 h-px ${dividerClass}`} />

          {/* Quote text */}
          <p
            className={`headline-section text-3xl md:text-5xl leading-tight ${textClass}`}
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {text}
          </p>

          {/* Bottom accent divider */}
          <div className={`w-24 h-px ${dividerClass}`} />
        </motion.div>
      </div>
    </section>
  );
}

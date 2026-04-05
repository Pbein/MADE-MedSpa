"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

interface EditorialBreakProps {
  text: React.ReactNode;
  variant?: "dark" | "warm" | "stone";
}

export default function EditorialBreak({
  text,
  variant = "warm",
}: EditorialBreakProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const sectionClass =
    variant === "dark"
      ? "section-dark"
      : variant === "warm"
        ? "section-warm"
        : "section-stone";

  return (
    <section
      ref={ref}
      className={sectionClass}
      style={{ padding: "clamp(4rem, 3rem + 5vw, 7rem) 0" }}
    >
      <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: luxuryEase }}
          className="mx-auto max-w-4xl text-center"
        >
          <div
            className="accent-line mx-auto mb-8"
            style={{ backgroundColor: "var(--color-accent)" }}
          />
          <p className="accent-display">{text}</p>
          <div
            className="accent-line mx-auto mt-8"
            style={{ backgroundColor: "var(--color-accent)" }}
          />
        </motion.div>
      </div>
    </section>
  );
}

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

  const sectionClass =
    variant === "dark"
      ? "section-dark"
      : variant === "silk"
        ? "section-alt"
        : "section-dark";

  const textColor =
    variant === "silk"
      ? "var(--color-olive)"
      : "var(--color-glaze)";

  return (
    <section
      ref={ref}
      className={sectionClass}
      style={{
        padding: "clamp(4rem, 3rem + 5vw, 7rem) 0",
        ...(variant === "warm"
          ? { backgroundColor: "rgba(57,30,30,0.85)" }
          : {}),
      }}
    >
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: luxuryEase }}
          className="mx-auto max-w-3xl text-center"
        >
          <div
            className="accent-line mx-auto mb-8"
            style={{ backgroundColor: "var(--color-matcha)" }}
          />
          <p className="text-editorial" style={{ color: textColor }}>
            {text}
          </p>
          <div
            className="accent-line mx-auto mt-8"
            style={{ backgroundColor: "var(--color-matcha)" }}
          />
        </motion.div>
      </div>
    </section>
  );
}

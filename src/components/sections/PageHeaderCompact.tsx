"use client";

import { motion } from "framer-motion";
import { hasNavigatedWithinApp } from "@/lib/navigation";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const revealUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: luxuryEase } },
};

interface PageHeaderCompactProps {
  eyebrow: string;
  title: string;
  description?: string;
  transparent?: boolean;
}

export default function PageHeaderCompact({
  eyebrow,
  title,
  description,
  transparent = false,
}: PageHeaderCompactProps) {
  const skipAnimation = hasNavigatedWithinApp();

  return (
    <section
      className="pt-32 md:pt-36 pb-10 md:pb-12 px-6"
      style={{ backgroundColor: transparent ? "transparent" : "var(--color-surface)" }}
    >
      <motion.div
        className="max-w-3xl mx-auto text-center"
        initial={skipAnimation ? "visible" : "hidden"}
        animate="visible"
        variants={staggerContainer}
      >
        <motion.span
          variants={revealUp}
          className="label-micro block mb-4"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          {eyebrow}
        </motion.span>

        <motion.h1
          variants={revealUp}
          className="headline-editorial text-3xl md:text-5xl"
          style={{ color: "var(--color-primary)" }}
        >
          {title}
        </motion.h1>

        {description && (
          <motion.p
            variants={revealUp}
            className="body-editorial mt-4 max-w-xl mx-auto text-sm md:text-base"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            {description}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}

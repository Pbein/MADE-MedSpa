"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { hasNavigatedWithinApp } from "@/lib/navigation";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const revealUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: luxuryEase } },
};

interface PageHeroProps {
  eyebrow: string;
  headline: string | React.ReactNode;
  subtitle?: string;
  dark?: boolean;
  backgroundImage?: string;
  backgroundFallback?: string;
  children?: React.ReactNode;
}

export default function PageHero({
  eyebrow,
  headline,
  subtitle,
  dark = false,
  backgroundImage,
  backgroundFallback = "#e0d0be",
  children,
}: PageHeroProps) {
  const hasBackground = Boolean(backgroundImage);
  const useLightText = dark;
  const skipAnimation = hasNavigatedWithinApp();

  return (
    <section
      className="relative pt-48 pb-24 px-6 overflow-hidden"
      style={{
        backgroundColor: hasBackground
          ? backgroundFallback
          : dark
            ? "var(--color-primary)"
            : "var(--color-surface)",
      }}
    >
      {hasBackground && (
        <>
          <Image
            src={backgroundImage!}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[10%]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(251,250,239,0) 0%, var(--color-surface) 100%)",
            }}
          />
        </>
      )}

      <motion.div
        className="relative max-w-4xl mx-auto text-center"
        initial={skipAnimation ? "visible" : "hidden"}
        animate="visible"
        variants={staggerContainer}
      >
        <motion.span
          variants={revealUp}
          className="label-micro block mb-6"
          style={{
            color: useLightText
              ? "var(--color-surface)"
              : "var(--color-on-surface-variant)",
            opacity: useLightText ? 0.75 : 1,
          }}
        >
          {eyebrow}
        </motion.span>

        <motion.h1
          variants={revealUp}
          className="headline-editorial text-5xl md:text-8xl"
          style={{
            color: useLightText
              ? "var(--color-surface)"
              : "var(--color-primary)",
          }}
        >
          {headline}
        </motion.h1>

        {subtitle && (
          <motion.p
            variants={revealUp}
            className="body-editorial mt-8 max-w-2xl mx-auto"
            style={{
              color: useLightText
                ? "var(--color-surface)"
                : "var(--color-on-surface-variant)",
              opacity: useLightText ? 0.85 : 1,
            }}
          >
            {subtitle}
          </motion.p>
        )}

        {children && (
          <motion.div variants={revealUp} className="mt-10">
            {children}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { demoImages } from "@/lib/demo-images";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.3,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: luxuryEase },
  },
};

const lineVariants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 1.2, ease: luxuryEase, delay: 1.6 },
  },
};

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={demoImages.hero.poster}
          className="h-full w-full object-cover"
        >
          <source src={demoImages.hero.videoWebm} type="video/webm" />
          <source src={demoImages.hero.video} type="video/mp4" />
        </video>
        {/* Warm dark overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(44, 34, 32, 0.55) 0%, rgba(44, 34, 32, 0.35) 30%, rgba(44, 34, 32, 0.45) 60%, rgba(44, 34, 32, 0.65) 100%)",
          }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center"
      >
        {/* Overline */}
        <motion.div
          variants={fadeUpVariants}
          className="editorial-spacing mb-8"
          style={{ color: "var(--color-stone)" }}
        >
          Luxury Aesthetic Studio
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUpVariants}
          className="headline-text mb-6 max-w-4xl"
          style={{
            fontSize: "var(--text-5xl)",
            color: "var(--color-ivory)",
            letterSpacing: "-0.01em",
            lineHeight: 1.1,
          }}
        >
          Elevate Your{" "}
          <span className="accent-text" style={{ color: "var(--color-stone)" }}>
            Natural
          </span>{" "}
          Beauty
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUpVariants}
          className="mx-auto mb-12 max-w-lg leading-relaxed"
          style={{ fontSize: "var(--text-lg)", color: "var(--color-stone)" }}
        >
          Personalized aesthetic treatments crafted with precision,
          artistry, and an unwavering commitment to your unique radiance.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUpVariants}
          className="flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link href="/services" className="btn btn-primary" style={{ backgroundColor: "var(--color-ivory)", color: "var(--color-chocolate)", borderColor: "var(--color-ivory)" }}>
            Explore Services
          </Link>
          <Link href="/contact" className="btn btn-outline" style={{ borderColor: "var(--color-ivory)", color: "var(--color-ivory)" }}>
            Book a Consultation
          </Link>
        </motion.div>
      </motion.div>

      {/* Decorative scroll indicator */}
      <motion.div
        variants={lineVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        style={{ transformOrigin: "top" }}
      >
        <span
          className="editorial-spacing"
          style={{ fontSize: "0.6rem", letterSpacing: "0.25em", color: "var(--color-stone)" }}
        >
          Scroll
        </span>
        <div
          className="h-12 w-[1px]"
          style={{ backgroundColor: "var(--color-stone)" }}
        />
      </motion.div>
    </section>
  );
}

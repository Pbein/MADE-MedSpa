"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { demoImages } from "@/lib/demo-images";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.4,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: luxuryEase },
  },
};

const lineVariants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 1.2, ease: luxuryEase, delay: 2 },
  },
};

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
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
        {/* Warm layered gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(45,30,23,0.6) 0%, rgba(45,30,23,0.3) 40%, rgba(45,30,23,0.4) 70%, rgba(45,30,23,0.7) 100%)",
          }}
        />
      </div>

      {/* Content — left-aligned on desktop, centered on mobile */}
      <div className="relative z-10 mx-auto w-full max-w-[var(--max-width)] px-6 lg:px-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex max-w-2xl flex-col items-start text-left"
        >
          {/* Overline label */}
          <motion.div
            variants={fadeUpVariants}
            className="editorial-spacing mb-6"
            style={{ color: "var(--color-accent-light)" }}
          >
            Luxury Aesthetic Studio
          </motion.div>

          {/* Headline — large, editorial */}
          <motion.h1
            variants={fadeUpVariants}
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "var(--text-hero)",
              color: "var(--color-soft-ivory)",
              letterSpacing: "-0.025em",
              lineHeight: 1.02,
              fontWeight: 400,
            }}
          >
            Elevated Beauty,
            <br />
            <span
              className="accent-text"
              style={{ color: "var(--color-cream)" }}
            >
              Thoughtfully
            </span>{" "}
            Designed
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUpVariants}
            className="mt-8 max-w-md leading-relaxed"
            style={{
              fontSize: "var(--text-lg)",
              color: "rgba(237, 229, 220, 0.75)",
              fontWeight: 300,
            }}
          >
            Personalized aesthetic treatments crafted with precision,
            artistry, and an unwavering commitment to your unique radiance.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={fadeUpVariants}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Link href="/booking" className="btn btn-light">
              Book Consultation
            </Link>
            <Link href="/services" className="btn btn-light-outline">
              Explore Services
            </Link>
          </motion.div>
        </motion.div>
      </div>

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
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.25em",
            color: "rgba(237, 229, 220, 0.5)",
          }}
        >
          Scroll
        </span>
        <div
          className="h-12 w-[1px]"
          style={{ backgroundColor: "rgba(237, 229, 220, 0.3)" }}
        />
      </motion.div>
    </section>
  );
}

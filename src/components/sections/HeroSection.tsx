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
        {/* 4-stop gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(57,30,30,0.55) 0%, rgba(57,30,30,0.25) 40%, rgba(57,30,30,0.35) 70%, rgba(57,30,30,0.7) 100%)",
          }}
        />
      </div>

      {/* Content — left-aligned on desktop, centered on mobile */}
      <div className="container-page relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex max-w-2xl flex-col items-center text-center lg:items-start lg:text-left"
        >
          {/* Eyebrow label */}
          <motion.span
            variants={fadeUpVariants}
            className="eyebrow mb-6"
            style={{ color: "rgba(247,246,235,0.6)" }}
          >
            Luxury Aesthetic Studio
          </motion.span>

          {/* Headline */}
          <motion.h1
            variants={fadeUpVariants}
            className="headline-display"
            style={{ color: "var(--color-glaze)" }}
          >
            Elevated Beauty,
            <br />
            Thoughtfully Designed
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUpVariants}
            className="body-lg mt-8 max-w-md"
            style={{
              color: "rgba(247,246,235,0.65)",
            }}
          >
            Personalized aesthetic treatments crafted with precision,
            artistry, and an unwavering commitment to your unique radiance.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={fadeUpVariants}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Link href="/booking" className="btn-primary">
              Book Consultation
            </Link>
            <Link href="/services" className="btn-light-outline">
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
          className="eyebrow"
          style={{
            fontSize: "0.6rem",
            color: "rgba(247,246,235,0.4)",
          }}
        >
          Scroll
        </span>
        <div
          className="h-12 w-[1px]"
          style={{ backgroundColor: "rgba(247,246,235,0.4)" }}
        />
      </motion.div>
    </section>
  );
}

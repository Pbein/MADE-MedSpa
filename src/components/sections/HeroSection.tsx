"use client";

import Link from "next/link";
import { motion } from "framer-motion";

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

const HERO_FALLBACK_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAbrwP3jn9UcBNqHUDEotjTakAG5GhZo8cxr9kEm5fYGewo_hGwkm8e9RPzIVtKw23irElIKfXUPp1Dz_CrXK-y7kxCTpJqn9wsgzfijEsLUclQFB4tIEyYFRF5LPGLg6iJUInvgArWht9fgoh5ZFQWjmKT4RCdZj3unVb3Z8AhYaBzMpDIJx08fUerkP6t0TnZnz8ZtF7rM5a1sKAwhGtEvq6iabm_ujrMIlk3QSsK5XCbFs8s0qbL8wwY9wE26Y036xXzqa707JGH";

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Video / Fallback Image */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          src=""
          className="w-full h-full object-cover image-editorial"
        />
        {/* Fallback image behind video */}
        <img
          src={HERO_FALLBACK_IMAGE}
          alt="MADE Med Spa editorial hero"
          className="absolute inset-0 w-full h-full object-cover image-editorial -z-10"
        />
        {/* Gradient overlay: transparent -> surface */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-surface)]/10 to-[var(--color-surface)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Eyebrow label */}
          <motion.span
            variants={fadeUpVariants}
            className="label-micro text-[var(--color-primary)]/60 mb-8"
          >
            Luxury Aesthetic Studio
          </motion.span>

          {/* Headline */}
          <motion.h1
            variants={fadeUpVariants}
            className="font-headline italic font-light text-5xl md:text-8xl tracking-tight text-[var(--color-primary)] leading-none max-w-4xl"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Elevated Beauty,
            <br />
            <span className="font-extralight">Thoughtfully Designed</span>
          </motion.h1>

          {/* CTA buttons */}
          <motion.div
            variants={fadeUpVariants}
            className="mt-12 flex flex-col sm:flex-row items-center gap-8"
          >
            <Link href="/booking" className="btn-primary">
              Book Consultation
            </Link>
            <Link href="/services" className="link-ghost text-[var(--color-primary)]">
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
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 origin-top"
      >
        <span className="label-micro text-[var(--color-primary)]/40">Scroll</span>
        <div className="w-px h-16 bg-[var(--color-outline-variant)]" />
      </motion.div>
    </section>
  );
}

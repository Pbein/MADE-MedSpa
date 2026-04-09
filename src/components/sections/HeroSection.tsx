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

export default function HeroSection() {
  return (
    <section>
      {/* Background Video */}
      <div>
        <video
          autoPlay
          muted
          loop
          playsInline
          src=""
        />
      </div>

      {/* Content */}
      <div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow label */}
          <motion.span variants={fadeUpVariants}>
            Luxury Aesthetic Studio
          </motion.span>

          {/* Headline */}
          <motion.h1 variants={fadeUpVariants}>
            Elevated Beauty,
            <br />
            Thoughtfully Designed
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={fadeUpVariants}>
            Personalized aesthetic treatments crafted with precision,
            artistry, and an unwavering commitment to your unique radiance.
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={fadeUpVariants}>
            <Link href="/booking">
              Book Consultation
            </Link>
            <Link href="/services">
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
      >
        <span>Scroll</span>
        <div />
      </motion.div>
    </section>
  );
}

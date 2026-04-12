"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

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

const DEFAULT_VIDEO = "/videos/hero.mp4";
const DEFAULT_POSTER = "/images/hero-poster.png";

export default function HeroSection() {
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const heroVideo = useQuery(api.siteContent.getByKey, { key: "hero_video" });
  const heroPoster = useQuery(api.siteContent.getByKey, { key: "hero_poster" });

  const videoSrc = heroVideo?.imageUrl || DEFAULT_VIDEO;
  const posterSrc = heroPoster?.imageUrl || DEFAULT_POSTER;

  return (
    <section className="relative h-screen w-full flex flex-col overflow-hidden">
      {/* Background: Video with smooth fade-in */}
      <div
        className="absolute inset-0 z-0"
        style={{ backgroundColor: "#391e1e" }}
      >
        {/* Poster image — always present, sits behind the video */}
        <img
          src={posterSrc}
          alt="MADE Med Spa"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {!videoFailed ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            title="MADE Med Spa ambient background"
            width={1920}
            height={1080}
            onCanPlay={() => setVideoReady(true)}
            onError={() => setVideoFailed(true)}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            style={{ opacity: videoReady ? 1 : 0 }}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          null
        )}

        {/* Warm overlay — darkened toward bottom for cream text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              "linear-gradient(to bottom,",
              "rgba(57,30,30,0.35) 0%,",      // Espresso tint at top
              "rgba(57,30,30,0.15) 30%,",      // breathes in the middle
              "rgba(57,30,30,0.30) 60%,",      // darkens again for text zone
              "rgba(57,30,30,0.55) 82%,",      // strong contrast behind headline
              "rgba(57,30,30,0.25) 92%,",      // eases warmth into transition
              "#ede8da 100%",                   // hands off to editorial section
            ].join(" "),
          }}
        />
      </div>

      {/* Content — positioned at bottom of viewport for editorial feel */}
      <div className="relative z-10 w-full flex-1 flex flex-col px-6 md:px-12 pt-48 pb-12 md:pb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto flex flex-col flex-1 w-full items-center md:items-start text-center md:text-left"
        >
          {/* Eyebrow label */}
          <motion.span
            variants={fadeUpVariants}
            className="label-micro block mb-4 md:mb-5"
            style={{
              color: "#f7f6eb",
              opacity: 0.8,
              textShadow: "0 1px 8px rgba(57,30,30,0.5)",
            }}
          >
            Luxury Aesthetic Studio
          </motion.span>

          {/* Headline — 3-line editorial hierarchy with vertical breathing room */}
          <motion.h1
            variants={fadeUpVariants}
            className="max-w-5xl"
            style={{
              fontFamily: "var(--font-cormorant)",
              letterSpacing: "-0.02em",
              textShadow: "0 2px 20px rgba(57,30,30,0.4)",
            }}
          >
            <span
              className="block italic font-light text-3xl sm:text-4xl md:text-7xl lg:text-[6.5rem] leading-none"
              style={{ color: "#f7f6eb", opacity: 0.9 }}
            >
              Beauty,
            </span>
            <span
              className="block italic font-medium text-4xl sm:text-5xl md:text-7xl lg:text-[7rem] leading-none mt-2 md:mt-3"
              style={{ color: "#f7f6eb", letterSpacing: "-0.035em" }}
            >
              Deeply Personal.
            </span>
            <span
              className="block italic font-light text-2xl sm:text-3xl md:text-6xl lg:text-[5.5rem] leading-none mt-3 md:mt-4"
              style={{ color: "rgba(247,246,235,0.6)", letterSpacing: "0.01em" }}
            >
              Thoughtfully Designed.
            </span>
          </motion.h1>

          <div className="flex-grow max-h-24 md:max-h-32" />

          {/* CTA buttons */}
          <motion.div
            variants={fadeUpVariants}
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8"
          >
            <Link href="/booking" className="btn-primary">
              Book Consultation
            </Link>
            <Link
              href="/services"
              className="link-ghost"
              style={{
                color: "#f7f6eb",
                textShadow: "0 1px 6px rgba(57,30,30,0.4)",
              }}
            >
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
        className="absolute bottom-12 right-12 flex flex-col items-center gap-4 origin-top hidden md:flex"
      >
        <span className="label-micro" style={{ color: "#f7f6eb", opacity: 0.5 }}>
          Scroll
        </span>
        <div className="w-px h-16 bg-[#f7f6eb]/30" />
      </motion.div>
    </section>
  );
}

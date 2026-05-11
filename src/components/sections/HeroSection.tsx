"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { normalizeBookingHref } from "@/lib/bookingHref";
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

const HERO_VIDEO = "/videos/hero-v2.mp4";
const HERO_POSTER = "/images/hero-poster-v2.webp";

interface HeroSectionContent {
  eyebrow: string;
  headline_1: string;
  headline_2: string;
  headline_3: string;
  cta_text: string;
  cta_href: string;
  secondary_text: string;
  secondary_href: string;
}

interface HeroSectionProps {
  sectionContent?: HeroSectionContent;
}

export default function HeroSection({ sectionContent }: HeroSectionProps) {
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoSrc = HERO_VIDEO;
  const posterSrc = HERO_POSTER;

  // iOS Safari sometimes refuses to autoplay even when all the right attributes
  // are present (Low Power Mode, battery saver, recent intervention rules).
  // Explicitly call .play() on mount so we either succeed OR get a rejection
  // we can catch — on rejection we set videoFailed=true which unmounts the
  // <video> element entirely, so iOS can't render its native play-button
  // overlay over a paused poster.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const tryPlay = async () => {
      try {
        await video.play();
        setVideoReady(true);
      } catch {
        setVideoFailed(true);
      }
    };
    tryPlay();
  }, []);

  return (
    <section className="relative h-screen w-full flex flex-col overflow-hidden">
      {/* Background: Video with smooth fade-in */}
      <div
        className="absolute inset-0 z-0"
        style={{ backgroundColor: "var(--color-surface, #391e1e)" }}
      >
        {/* Poster image — always present, sits behind the video */}
        <Image
          src={posterSrc}
          alt="MADE Med Spa"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {!videoFailed ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            poster={posterSrc}
            title="MADE Med Spa ambient background"
            width={1920}
            height={1080}
            onCanPlay={() => setVideoReady(true)}
            onError={() => setVideoFailed(true)}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-[cubic-bezier(0.2,0,0,1)]"
            style={{ opacity: videoReady ? 1 : 0 }}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          null
        )}

        {/* Warm overlay — darkened toward bottom for cream text legibility.
           Hand-off matches the next section's Silk surface so there's no
           pink-tinted twilight zone where video color can leak through. */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              "linear-gradient(to bottom,",
              "rgba(57,30,30,0.35) 0%,",      // Espresso tint at top
              "rgba(57,30,30,0.15) 30%,",      // breathes in the middle
              "rgba(57,30,30,0.30) 60%,",      // darkens again for text zone
              "rgba(57,30,30,0.55) 82%,",      // strong contrast behind headline
              "rgba(57,30,30,0.55) 96%,",      // HOLD the wash, mute video color
              "#F7F6EB 100%",                   // hand off matches next section Silk
            ].join(" "),
          }}
        />
      </div>

      {/* Content — vertically centered in the viewport so the block sits between
         the nav and the cream gradient hand-off (per 2026-05-10 client compare).
         Inner block nudged right (ml-[12%]) to mirror the reference indent. */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-center px-6 md:px-12 pt-20 md:pt-24 pb-32 md:pb-40">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto md:mx-0 md:ml-[12%] flex flex-col w-full items-center md:items-start text-center md:text-left"
        >
          {/* Eyebrow — small all-caps, letter-spaced, intentionally subdued */}
          <motion.span
            variants={fadeUpVariants}
            className="label-micro block mb-5 md:mb-6"
            style={{
              color: "var(--color-on-surface, #f7f6eb)",
              opacity: 0.7,
              letterSpacing: "0.22em",
              textShadow: "0 1px 6px rgba(57,30,30,0.4)",
              fontSize: "0.72rem",
            }}
          >
            {sectionContent?.eyebrow || "McLean's Boutique Regenerative Aesthetics Practice"}
          </motion.span>

          {/* Headline — single line, "Made." set in Playfair italic for accent.
             Tightened from initial spec after 2026-05-10 client compare:
             desktop scale dialed back to ~40–48px (was 48–64px) and max-width
             expanded so "Where Confidence Is Made." stays on ONE line at md+.
             Mobile keeps natural wrapping; whitespace-nowrap kicks in at tablet+. */}
          <motion.h1
            variants={fadeUpVariants}
            className="max-w-4xl text-[clamp(1.75rem,7vw,2.25rem)] md:text-[clamp(2.25rem,4vw,2.5rem)] md:whitespace-nowrap lg:text-[clamp(2.5rem,2.6vw,3rem)]"
            style={{
              fontFamily: "var(--font-playfair)",
              fontWeight: 400,
              letterSpacing: "-0.015em",
              lineHeight: 1.1,
              color: "var(--color-on-surface, #f7f6eb)",
              textShadow: "0 1px 14px rgba(57,30,30,0.35)",
            }}
          >
            {/* CMS schema keeps three headline fields (legacy 3-line layout).
               In the new restrained typography we render: {h1} {h2} <em>{h3}</em>
               — so Karlyne's existing values "Where Confidence" / "Is" / "Made."
               compose into "Where Confidence Is Made." with the last word italicised. */}
            {sectionContent?.headline_1 || "Where Confidence"}{" "}
            {sectionContent?.headline_2 || "Is"}{" "}
            <em style={{ fontStyle: "italic", fontWeight: 400 }}>
              {sectionContent?.headline_3 || "Made."}
            </em>
          </motion.h1>

          {/* Subtle divider — matches the small horizontal line in the reference */}
          <motion.div
            variants={fadeUpVariants}
            className="mt-6 md:mt-7 h-px w-10"
            style={{ backgroundColor: "var(--color-on-surface, #f7f6eb)", opacity: 0.4 }}
          />

          {/* CTAs — sit just below the headline block, no longer floating at viewport bottom */}
          <motion.div
            variants={fadeUpVariants}
            className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center gap-4 sm:gap-8"
          >
            <Link
              href={normalizeBookingHref(sectionContent?.cta_href) || "/booking#pabau-iframe"}
              className="btn-primary"
            >
              {sectionContent?.cta_text || "Book Consultation"}
            </Link>
            <Link
              href={normalizeBookingHref(sectionContent?.secondary_href) || "/services"}
              className="link-ghost"
              style={{
                color: "var(--color-on-surface, #f7f6eb)",
                textShadow: "0 1px 6px rgba(57,30,30,0.4)",
              }}
            >
              {sectionContent?.secondary_text || "Explore Services"}
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
        <span
          className="label-micro"
          style={{ color: "var(--color-on-surface, #f7f6eb)", opacity: 0.5 }}
        >
          Scroll
        </span>
        <div
          className="w-px h-16"
          style={{ backgroundColor: "var(--divider-color, #f7f6eb)", opacity: 0.3 }}
        />
      </motion.div>
    </section>
  );
}

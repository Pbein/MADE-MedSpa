"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const luxuryEase = [0.16, 1, 0.3, 1] as const;
const viewportOnce = { once: true, margin: "-80px" } as const;

const DEFAULT_ABOUT_IMAGE = "/images/placeholder-portrait.svg";

interface AboutTeaserContent {
  eyebrow: string;
  headline: string;
  body: string;
  link_text: string;
  link_href: string;
}

interface AboutTeaserProps {
  aboutImageUrl?: string;
  sectionContent?: AboutTeaserContent;
}

// Stitch "Editorial Story Section" port (2026-05-30): balanced two-column
// layout — a silk-matted portrait with a faint MADE wordmark watermark and a
// decorative offset shape on the left, story copy on the right. Headline is
// Playfair (not the old Futura-uppercase .headline-section) to match the
// Stitch samples. Content stays CMS-driven via sectionContent.
export default function AboutTeaser({ aboutImageUrl, sectionContent }: AboutTeaserProps) {
  const imageSrc = aboutImageUrl || DEFAULT_ABOUT_IMAGE;

  return (
    <section className="texture-linen relative overflow-hidden pt-16 md:pt-20 pb-24 md:pb-32 px-6 md:px-12 lg:px-24 bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center relative">
        {/* LEFT — portrait with watermark + matted frame */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.9, ease: luxuryEase }}
          className="lg:col-span-6 relative z-10"
        >
          <div className="relative inline-block w-full">
            {/* Silk mat + soft warm shadow */}
            <div
              className="relative z-10 rounded-lg overflow-hidden p-2"
              style={{
                backgroundColor: "var(--color-silk)",
                boxShadow: "20px 20px 60px rgba(57,30,30,0.08)",
              }}
            >
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-md">
                <Image
                  src={imageSrc}
                  alt="MADE Med Spa — our story"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  style={{ filter: "grayscale(0.2)" }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT — story copy */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.9, delay: 0.18, ease: luxuryEase }}
          className="lg:col-span-6 lg:pl-16 relative z-20"
        >
          <div className="flex flex-col gap-8 max-w-[480px]">
            {/* Eyebrow + hairline */}
            <div>
              <span
                className="uppercase block mb-4"
                style={{
                  fontFamily: "var(--font-label)",
                  fontSize: "13px",
                  letterSpacing: "0.3em",
                  color: "var(--color-on-surface-variant)",
                }}
              >
                {sectionContent?.eyebrow || "Our Story"}
              </span>
              <div className="h-px w-8" style={{ backgroundColor: "rgba(57,30,30,0.2)" }} />
            </div>

            {/* Headline — Playfair (sentence case), italic accent on the default */}
            <h2
              style={{
                fontFamily: "var(--font-headline)",
                fontWeight: 400,
                fontStyle: "normal",
                textTransform: "none",
                letterSpacing: "-0.01em",
                lineHeight: 1.1,
                color: "var(--color-primary)",
                fontSize: "clamp(2.5rem, 4vw, 3.75rem)",
              }}
            >
              {sectionContent?.headline || (
                <>
                  Built different.{" "}
                  <em style={{ fontStyle: "italic" }}>On purpose.</em>
                </>
              )}
            </h2>

            {/* Body */}
            <p
              className="font-body font-light"
              style={{
                fontSize: "17px",
                lineHeight: 1.8,
                color: "rgba(57,30,30,0.75)",
              }}
            >
              {sectionContent?.body ||
                "MADE wasn't built from a template. It was built from years of clinical experience, a deep respect for every skin tone, and a refusal to replicate the kind of care that leaves patients feeling unseen. This is regenerative aesthetics done with intention — and it starts the moment you walk in."}
            </p>

            {/* Link */}
            <div className="pt-2">
              <Link href={sectionContent?.link_href || "/about"} className="link-editorial">
                {sectionContent?.link_text || "Why MADE"}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

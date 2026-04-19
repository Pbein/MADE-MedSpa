"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import CTABanner from "@/components/sections/CTABanner";
import { useSectionContent } from "@/hooks/useSectionContent";
import { motion } from "framer-motion";
import Link from "next/link";

const luxuryEase = [0.16, 1, 0.3, 1] as const;
const viewportOnce = { once: true, margin: "-80px" } as const;

export default function TestimonialsPage() {
  const testimonials = useQuery(api.testimonials.list);

  const { data: ctaText } = useSectionContent("section_testimonials_cta", {
    headline: "Ready to start your journey?",
    subtitle: "Book a consultation and experience the MADE difference for yourself.",
    cta_text: "Book Consultation",
    cta_href: "/booking",
    secondary_text: "View Services",
    secondary_href: "/services",
  });

  // Split testimonials: first one is featured, rest are editorial
  const featured = testimonials?.[0];
  const remaining = useMemo(() => testimonials?.slice(1) || [], [testimonials]);

  return (
    <main>
      {/* ═══════════════════════════════════════════
          HERO — Minimal, text-only, sets the tone
          ═══════════════════════════════════════════ */}
      <section
        className="pt-40 md:pt-52 pb-24 md:pb-32 px-6"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <motion.span
            className="label-micro block mb-8"
            style={{ color: "var(--color-on-surface-variant)" }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: luxuryEase }}
          >
            Client Stories
          </motion.span>

          <motion.h1
            className="headline-section text-4xl md:text-6xl lg:text-7xl mb-8"
            style={{ color: "var(--color-primary)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: luxuryEase, delay: 0.1 }}
          >
            The Results<br />
            <span className="font-extralight">Speak for Themselves.</span>
          </motion.h1>

          <motion.p
            className="body-editorial max-w-2xl mx-auto"
            style={{ color: "var(--color-on-surface-variant)", opacity: 0.7 }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ duration: 0.8, ease: luxuryEase, delay: 0.2 }}
          >
            Every review is from a real client who trusted us with their care. No scripts, no edits — just honest words from people who experienced the MADE difference.
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURED TESTIMONIAL — Full-width, large quote
          ═══════════════════════════════════════════ */}
      {featured && (
        <section
          className="py-24 md:py-32 px-6"
          style={{
            backgroundColor: "var(--color-primary)",
          }}
        >
          <motion.div
            className="mx-auto max-w-4xl text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 1, ease: luxuryEase }}
          >
            {/* Large quote mark */}
            <div
              className="font-headline italic"
              style={{
                fontSize: "8rem",
                lineHeight: 0.5,
                color: "rgba(215,207,197,0.15)",
                marginBottom: "2rem",
              }}
            >
              &ldquo;
            </div>

            <blockquote
              className="font-headline italic text-xl md:text-2xl lg:text-3xl leading-relaxed mb-10"
              style={{ color: "rgba(247,246,235,0.9)" }}
            >
              {featured.quote}
            </blockquote>

            <div className="flex items-center justify-center gap-4">
              <div
                className="w-8 h-px"
                style={{ backgroundColor: "rgba(215,207,197,0.3)" }}
              />
              <span
                className="label-micro"
                style={{ color: "rgba(215,207,197,0.6)" }}
              >
                {featured.name} &middot; {featured.treatment}
              </span>
              <div
                className="w-8 h-px"
                style={{ backgroundColor: "rgba(215,207,197,0.3)" }}
              />
            </div>
          </motion.div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          EDITORIAL GRID — Asymmetric, breathing room
          ═══════════════════════════════════════════ */}
      <section
        className="py-32 md:py-44 px-6"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <div className="mx-auto max-w-6xl">
          {/* Section intro */}
          <motion.div
            className="text-center mb-20 md:mb-28"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.8, ease: luxuryEase }}
          >
            <div className="flex items-center justify-center gap-3">
              <div className="w-16 h-px" style={{ backgroundColor: "var(--color-outline-variant)" }} />
              <span
                className="label-micro"
                style={{ color: "var(--color-on-surface-variant)", opacity: 0.5 }}
              >
                More Stories
              </span>
              <div className="w-16 h-px" style={{ backgroundColor: "var(--color-outline-variant)" }} />
            </div>
          </motion.div>

          {/* Loading */}
          {!testimonials && (
            <div className="flex justify-center py-20">
              <div
                className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
                style={{ borderColor: "var(--color-outline-variant)" }}
              />
            </div>
          )}

          {/* Editorial layout — alternating large and small */}
          {remaining.length > 0 && (
            <div className="space-y-16 md:space-y-24">
              {remaining.map((testimonial, i) => {
                const isLarge = i % 3 === 0;
                const isRight = i % 2 === 1;

                return (
                  <motion.div
                    key={testimonial._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportOnce}
                    transition={{ duration: 0.9, ease: luxuryEase }}
                    className={`${isLarge ? "max-w-4xl" : "max-w-2xl"} ${isRight && !isLarge ? "ml-auto" : ""}`}
                  >
                    {/* Quote */}
                    <div className={`${isLarge ? "mb-8" : "mb-6"}`}>
                      {isLarge && (
                        <div
                          className="font-headline italic mb-4"
                          style={{
                            fontSize: "4rem",
                            lineHeight: 0.5,
                            color: "var(--color-secondary)",
                            opacity: 0.15,
                          }}
                        >
                          &ldquo;
                        </div>
                      )}
                      <blockquote
                        className={`font-headline italic leading-relaxed ${
                          isLarge
                            ? "text-xl md:text-2xl"
                            : "text-lg md:text-xl"
                        }`}
                        style={{ color: "var(--color-primary)", opacity: 0.85 }}
                      >
                        &ldquo;{testimonial.quote}&rdquo;
                      </blockquote>
                    </div>

                    {/* Attribution */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-px"
                        style={{ backgroundColor: "var(--color-outline-variant)" }}
                      />
                      <span
                        className="label-micro"
                        style={{ color: "var(--color-on-surface-variant)", opacity: 0.6 }}
                      >
                        {testimonial.name}
                      </span>
                      <span
                        className="label-micro"
                        style={{ color: "var(--color-secondary)", opacity: 0.5 }}
                      >
                        {testimonial.treatment}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Count + link back */}
          {testimonials && (
            <motion.div
              className="text-center mt-24 md:mt-32"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, ease: luxuryEase }}
            >
              <p
                className="body-editorial text-sm mb-6"
                style={{ color: "var(--color-on-surface-variant)", opacity: 0.5 }}
              >
                {testimonials.length} client reviews
              </p>
              <Link href="/services" className="link-editorial">
                Explore Our Services
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      <CTABanner
        dark
        headline={ctaText.headline}
        subtitle={ctaText.subtitle}
        ctaText={ctaText.cta_text}
        ctaHref={ctaText.cta_href}
        secondaryText={ctaText.secondary_text}
        secondaryHref={ctaText.secondary_href}
      />
    </main>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const luxuryEase = [0.16, 1, 0.3, 1] as const;
const viewportOnce = { once: true, margin: "-80px" } as const;

const FALLBACK_TESTIMONIALS = [
  {
    quote:
      "I've been getting toxins for years at other places and always left looking a little frozen or 'done.' My first appointment at MADE was completely different. The consultation alone was 20 minutes and she actually looked at how my face moves before touching a needle. The results are the most natural I've ever had. I look like myself, just more rested.",
    name: "Verified Client",
    treatment: "Botox",
  },
  {
    quote:
      "I was nervous about filler. I'd seen too many overdone faces and didn't want that. She spent more time explaining what she wasn't going to do than what she was, which somehow made me trust her completely. The end result is so subtle my husband noticed I looked 'refreshed' but couldn't figure out why. That's exactly what I wanted.",
    name: "Verified Client",
    treatment: "Dermal Filler",
  },
  {
    quote:
      "What sets Karlyne apart isn't just her skill, it's how she makes you feel throughout the entire experience. She checked in after my visit to see how I was doing, and during my consultation she was completely transparent about what I needed and what I didn't. No upselling, no pressure. Just honest, thoughtful care. I finally found my injector.",
    name: "Verified Client",
    treatment: "Patient Experience",
  },
];

interface TestimonialData {
  quote: string;
  name: string;
  treatment: string;
}

interface TestimonialSectionProps {
  testimonials?: TestimonialData[];
  testimonialBgUrl?: string;
  sectionContent?: { eyebrow: string };
}

export default function TestimonialSection({ testimonials: propTestimonials, testimonialBgUrl, sectionContent }: TestimonialSectionProps) {
  const testimonials =
    propTestimonials && propTestimonials.length > 0
      ? propTestimonials
      : FALLBACK_TESTIMONIALS;
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = useCallback(() => {
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  }, [testimonials.length]);

  useEffect(() => {
    if (current >= testimonials.length) setCurrent(0);
  }, [current, testimonials.length]);

  useEffect(() => {
    const interval = setInterval(next, 8000);
    return () => clearInterval(interval);
  }, [next]);

  if (propTestimonials && propTestimonials.length === 0) return null;

  return (
    <section className="relative overflow-hidden">
      {/* ── Background texture image ── */}
      {testimonialBgUrl && (
        <Image
          src={testimonialBgUrl}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="object-cover"
        />
      )}

      {/* ── Fallback base color (shown while image loads) ── */}
      {!testimonialBgUrl && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: "var(--color-surface)" }}
        />
      )}

      {/* ── Content ── */}
      <div className="relative py-32 md:py-44 lg:py-52 px-8 md:px-16">
        <div className="max-w-4xl mx-auto">
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.8, ease: luxuryEase }}
            className="text-center mb-16"
          >
            <span
              className="label-micro block mb-4"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              {sectionContent?.eyebrow || "What Our Clients Say"}
            </span>
            <div className="flex items-center justify-center gap-4">
              <div
                className="w-16 h-px"
                style={{ backgroundColor: "rgba(215,207,197,0.4)" }}
              />
              <div
                className="w-1.5 h-1.5 rotate-45 border"
                style={{ borderColor: "rgba(215,207,197,0.5)" }}
              />
              <div
                className="w-16 h-px"
                style={{ backgroundColor: "rgba(215,207,197,0.4)" }}
              />
            </div>
          </motion.div>

          {/* Quote carousel */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 1, ease: luxuryEase }}
          >
            {/* Large decorative quote mark */}
            <div className="text-center mb-8">
              <span
                className="inline-block font-headline text-6xl sm:text-[8rem] md:text-[10rem] leading-none select-none"
                style={{ color: "rgba(215,207,197,0.2)" }}
              >
                &ldquo;
              </span>
            </div>

            {/* Quote text */}
            <div className="relative min-h-[240px] md:min-h-[200px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.6, ease: luxuryEase }}
                  className="text-center"
                >
                  <blockquote
                    className="accent-quote font-light text-2xl sm:text-3xl md:text-4xl leading-relaxed md:leading-relaxed"
                    style={{
                      color: "var(--color-primary)",
                      textWrap: "balance",
                      maxWidth: "52rem",
                      margin: "0 auto",
                    } as React.CSSProperties}
                  >
                    {testimonials[current].quote}
                  </blockquote>

                  {/* Attribution */}
                  <div className="mt-10 flex flex-col items-center gap-3">
                    <div
                      className="w-8 h-px"
                      style={{ backgroundColor: "var(--color-secondary)" }}
                    />
                    <span
                      className="label-micro"
                      style={{ color: "var(--color-secondary)" }}
                    >
                      {testimonials[current].name.toUpperCase()}
                    </span>
                    <span
                      className="font-body text-xs uppercase tracking-wider"
                      style={{
                        color: "var(--color-on-surface-variant)",
                        opacity: 0.6,
                      }}
                    >
                      {testimonials[current].treatment}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-8 mt-14">
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="transition-colors duration-500 hover:text-[var(--color-secondary)]"
                style={{ color: "var(--color-outline)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex gap-2.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className="transition-all duration-500"
                    style={{
                      width: i === current ? 24 : 8,
                      height: 3,
                      backgroundColor:
                        i === current
                          ? "var(--color-secondary)"
                          : "var(--color-outline-variant)",
                    }}
                  />
                ))}
              </div>

              <button
                onClick={next}
                aria-label="Next testimonial"
                className="transition-colors duration-500 hover:text-[var(--color-secondary)]"
                style={{ color: "var(--color-outline)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

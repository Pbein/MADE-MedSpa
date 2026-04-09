"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

const PORTRAIT_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBFJRK1EG6vFffTtqI2GPwrePYkfUmQNgKrD5nMMExcQ2kVA1Xj7NO52d_SdOxghRFJUZ9YA5nLj-h_GfoVakhjPb7E6D8hKLffMiDm8xsfFYvNeZNZXLXnAp7g1DIYN6oVdKTENGYH_wYMn7iK-vaXAaZc2YncITM2u9ZlsPCdh6PJGsi7_3qSLw-eb1YWbjwgL_pGlRDjM1KOumZGIIYDrTx5lOxFa_7HUKaienWwGnW0TXs31mHd_RcuihQ3chT3aqZC0RzT3_rK";

const FALLBACK_TESTIMONIALS = [
  {
    quote:
      "MADE transformed not just my appearance, but my confidence. The team's artistry and attention to detail is unlike anything I've experienced.",
    name: "Victoria R.",
    treatment: "Dermal Fillers & Skin Rejuvenation",
  },
  {
    quote:
      "From the moment I walked in, I felt seen and cared for. The results are beautifully natural — exactly what I wanted.",
    name: "Sophia M.",
    treatment: "Botox & Facial Contouring",
  },
  {
    quote:
      "I've been a member for over a year now and the consistent quality and personalized care keeps me coming back. This is self-care elevated.",
    name: "Alessandra K.",
    treatment: "MADE Membership",
  },
];

export default function TestimonialSection() {
  const dbTestimonials = useQuery(api.testimonials.list);
  const testimonials =
    dbTestimonials && dbTestimonials.length > 0
      ? dbTestimonials
      : FALLBACK_TESTIMONIALS;
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = useCallback(() => {
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  }, [testimonials.length]);

  useEffect(() => {
    if (current >= testimonials.length) {
      setCurrent(0);
    }
  }, [current, testimonials.length]);

  useEffect(() => {
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next]);

  if (dbTestimonials && dbTestimonials.length === 0) return null;

  return (
    <section ref={ref} className="py-60 px-12 bg-[var(--color-surface)] overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-24">
        {/* Left: Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: luxuryEase }}
          className="md:w-1/2"
        >
          {/* Decorative quote mark */}
          <span className="block text-8xl font-extralight text-[var(--color-outline-variant)]/30 leading-none select-none mb-4">
            &ldquo;
          </span>

          <div className="relative min-h-[280px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: luxuryEase }}
              >
                <blockquote
                  className="font-headline text-3xl md:text-5xl italic leading-tight text-[var(--color-primary)]"
                  style={{ textWrap: "balance" } as React.CSSProperties}
                >
                  &ldquo;{testimonials[current].quote}&rdquo;
                </blockquote>

                <cite className="not-italic block mt-12">
                  <span className="label-micro text-[var(--color-secondary)] block">
                    &mdash; {testimonials[current].name.toUpperCase()}
                  </span>
                  <span className="block font-body text-xs text-[var(--color-on-surface-variant)] mt-2 uppercase tracking-wider">
                    {testimonials[current].treatment}
                  </span>
                </cite>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows & dots */}
          <div className="flex items-center gap-6 mt-12">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors duration-500 text-2xl"
            >
              &larr;
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`w-2 h-2 transition-all duration-500 ${
                    i === current
                      ? "bg-[var(--color-secondary)] w-6"
                      : "bg-[var(--color-outline-variant)]"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next testimonial"
              className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors duration-500 text-2xl"
            >
              &rarr;
            </button>
          </div>
        </motion.div>

        {/* Right: Portrait image with decorative offset border */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3, ease: luxuryEase }}
          className="md:w-1/2 relative"
        >
          <img
            src={PORTRAIT_IMAGE}
            alt="Spa experience"
            className="w-full grayscale brightness-110 relative z-10"
          />
          {/* Decorative offset border */}
          <div className="absolute -top-12 -left-12 w-full h-full border border-[var(--color-outline-variant)]/20 -z-0 translate-x-4 translate-y-4" />
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

const testimonials = [
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
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        backgroundColor: "var(--color-linen)",
        paddingTop: "var(--space-section-lg)",
        paddingBottom: "var(--space-section-lg)",
      }}
    >
      <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: luxuryEase }}
          className="mb-16 text-center"
        >
          <span
            className="editorial-spacing mb-4 block"
            style={{ color: "var(--color-cream)" }}
          >
            Testimonials
          </span>
          <h2
            className="headline-text"
            style={{
              fontSize: "var(--text-4xl)",
              color: "var(--color-deep-cocoa)",
            }}
          >
            Words from{" "}
            <span className="accent-text" style={{ color: "var(--color-accent-text)" }}>
              Our Clients
            </span>
          </h2>
        </motion.div>

        {/* Quote carousel — minimal, centered, large quotes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: luxuryEase }}
          className="relative mx-auto max-w-3xl text-center"
        >
          {/* Decorative large quote mark */}
          <div
            className="accent-text pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 select-none"
            style={{
              fontSize: "clamp(6rem, 4rem + 10vw, 12rem)",
              lineHeight: 1,
              color: "var(--color-cream)",
              opacity: 0.15,
            }}
          >
            &ldquo;
          </div>

          <div className="relative min-h-[280px] sm:min-h-[220px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: luxuryEase }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <blockquote
                  className="accent-text mb-8 leading-relaxed"
                  style={{
                    fontSize: "var(--text-2xl)",
                    color: "var(--color-deep-cocoa)",
                  }}
                >
                  &ldquo;{testimonials[current].quote}&rdquo;
                </blockquote>
                <div>
                  <p
                    className="editorial-spacing mb-1"
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-espresso)",
                      letterSpacing: "0.2em",
                    }}
                  >
                    {testimonials[current].name}
                  </p>
                  <p
                    className="accent-text"
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--color-warm-taupe)",
                    }}
                  >
                    {testimonials[current].treatment}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation dots & arrows */}
          <div className="mt-10 flex items-center justify-center gap-6">
            <button
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors"
              style={{
                border: "1px solid var(--color-border-strong)",
                color: "var(--color-espresso)",
              }}
              aria-label="Previous testimonial"
            >
              &larr;
            </button>

            <div className="flex items-center gap-3">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="group relative h-2 w-2 rounded-full transition-all"
                  style={{
                    backgroundColor:
                      i === current
                        ? "var(--color-deep-cocoa)"
                        : "var(--color-cream)",
                    width: i === current ? "2rem" : "0.5rem",
                    borderRadius: "var(--border-radius-full)",
                    transition:
                      "all var(--duration-normal) var(--ease-smooth)",
                  }}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors"
              style={{
                border: "1px solid var(--color-border-strong)",
                color: "var(--color-espresso)",
              }}
              aria-label="Next testimonial"
            >
              &rarr;
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

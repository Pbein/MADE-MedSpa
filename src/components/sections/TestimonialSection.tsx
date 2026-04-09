"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

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
    <section ref={ref}>
      <div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: luxuryEase }}
        >
          <span>Testimonials</span>
          <h2>
            Words from <span>Our Clients</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: luxuryEase }}
        >
          {/* Decorative large quote mark */}
          <div>&ldquo;</div>

          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: luxuryEase }}
              >
                <blockquote>
                  &ldquo;{testimonials[current].quote}&rdquo;
                </blockquote>
                <div>
                  <p>{testimonials[current].name}</p>
                  <p>{testimonials[current].treatment}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation dots & arrows */}
          <div>
            <button
              onClick={prev}
              aria-label="Previous testimonial"
            >
              &larr;
            </button>

            <div>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
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

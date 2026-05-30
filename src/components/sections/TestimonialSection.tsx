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

  const CREAM = "var(--color-on-primary, #f7f6eb)";

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--color-primary, #391e1e)" }}
    >
      {/* ── Optional background image, held dark with a heavy espresso wash ── */}
      {testimonialBgUrl && (
        <>
          <Image
            src={testimonialBgUrl}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundColor: "rgba(57,30,30,0.88)" }}
          />
        </>
      )}

      {/* ── Fabric-plaid texture (client's fabric-plaid.png, self-hosted at
           /public/textures) tinted CREAM via CSS mask so the woven grid reads
           as subtle fabric depth on the dark espresso. ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: "var(--color-on-primary, #f7f6eb)",
          opacity: 0.07,
          WebkitMaskImage: "url(/textures/fabric-plaid.png)",
          maskImage: "url(/textures/fabric-plaid.png)",
          WebkitMaskRepeat: "repeat",
          maskRepeat: "repeat",
          WebkitMaskSize: "200px 200px",
          maskSize: "200px 200px",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 py-28 md:py-40 lg:py-48 px-8 md:px-16">
        <div className="max-w-4xl mx-auto">
          {/* Eyebrow — hairlines + diamonds both sides */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.8, ease: luxuryEase }}
            className="flex items-center justify-center gap-4 mb-16"
          >
            <div className="h-px w-10" style={{ backgroundColor: "rgba(247,246,235,0.3)" }} />
            <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: "rgba(247,246,235,0.5)" }} />
            <span
              className="uppercase whitespace-nowrap"
              style={{
                fontFamily: "var(--font-label)",
                fontSize: "13px",
                letterSpacing: "0.3em",
                color: "rgba(247,246,235,0.7)",
              }}
            >
              {sectionContent?.eyebrow || "Heard From Our Clients"}
            </span>
            <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: "rgba(247,246,235,0.5)" }} />
            <div className="h-px w-10" style={{ backgroundColor: "rgba(247,246,235,0.3)" }} />
          </motion.div>

          {/* Quote + attribution */}
          <div className="relative min-h-[260px] md:min-h-[220px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.7, ease: luxuryEase }}
                className="text-center"
              >
                <blockquote
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontSize: "clamp(1.5rem, 2.8vw, 2.5rem)",
                    lineHeight: 1.4,
                    color: CREAM,
                    textWrap: "balance",
                    maxWidth: "52rem",
                    margin: "0 auto",
                  } as React.CSSProperties}
                >
                  &ldquo;{testimonials[current].quote}&rdquo;
                </blockquote>

                {/* Attribution */}
                <div className="mt-12 flex flex-col items-center gap-3">
                  <div className="w-12 h-px" style={{ backgroundColor: "rgba(247,246,235,0.3)" }} />
                  <span
                    className="uppercase"
                    style={{
                      fontFamily: "var(--font-label)",
                      fontWeight: 600,
                      fontSize: "14px",
                      letterSpacing: "0.2em",
                      color: CREAM,
                    }}
                  >
                    {testimonials[current].name.toUpperCase()}
                  </span>
                  <span
                    className="font-body uppercase"
                    style={{
                      fontSize: "12px",
                      letterSpacing: "0.08em",
                      color: "rgba(247,246,235,0.6)",
                    }}
                  >
                    {testimonials[current].treatment}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls — circular arrows + dots */}
          <div className="flex items-center justify-center gap-8 md:gap-12 mt-20">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 active:scale-90 hover:bg-white/5"
              style={{ border: "1px solid rgba(247,246,235,0.2)", color: "rgba(247,246,235,0.7)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className="flex gap-3">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? 22 : 6,
                    height: 6,
                    backgroundColor: i === current ? CREAM : "rgba(247,246,235,0.25)",
                  }}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next testimonial"
              className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 active:scale-90 hover:bg-white/5"
              style={{ border: "1px solid rgba(247,246,235,0.2)", color: "rgba(247,246,235,0.7)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

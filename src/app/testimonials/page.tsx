"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import PageHero from "@/components/sections/PageHero";
import CTABanner from "@/components/sections/CTABanner";
import { useSectionContent } from "@/hooks/useSectionContent";
import { motion } from "framer-motion";

const luxuryEase = [0.16, 1, 0.3, 1] as const;
const viewportOnce = { once: true, margin: "-50px" } as const;

export default function TestimonialsPage() {
  const testimonials = useQuery(api.testimonials.list);
  const [activeFilter, setActiveFilter] = useState("All");

  const { data: heroText } = useSectionContent("section_testimonials_hero", {
    eyebrow: "Client Stories",
    headline: "What Our Clients Say",
    subtitle: "Real experiences from real clients. Every review reflects the care, expertise, and results that define MADE Med Spa.",
  });

  const { data: ctaText } = useSectionContent("section_testimonials_cta", {
    headline: "Ready to start your journey?",
    subtitle: "Book a consultation and experience the MADE difference for yourself.",
    cta_text: "Book Consultation",
    cta_href: "/booking",
    secondary_text: "View Services",
    secondary_href: "/services",
  });

  const treatments = useMemo(() => {
    if (!testimonials) return ["All"];
    const tags = Array.from(new Set(testimonials.map((t) => t.treatment))).sort();
    return ["All", ...tags];
  }, [testimonials]);

  const filtered = useMemo(() => {
    if (!testimonials) return [];
    if (activeFilter === "All") return testimonials;
    return testimonials.filter((t) => t.treatment === activeFilter);
  }, [testimonials, activeFilter]);

  return (
    <main>
      <PageHero
        eyebrow={heroText.eyebrow}
        headline={
          <>
            {heroText.headline.split(".")[0]}
            {heroText.headline.includes(".") && (
              <span className="font-extralight">.{heroText.headline.split(".").slice(1).join(".")}</span>
            )}
          </>
        }
        subtitle={heroText.subtitle}
      />

      {/* Filter Pills */}
      {treatments.length > 2 && (
        <section className="py-8" style={{ backgroundColor: "var(--color-surface-low)" }}>
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              className="flex flex-wrap gap-2 justify-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: luxuryEase, delay: 0.3 }}
            >
              {treatments.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  className="transition-all duration-500"
                  style={{
                    padding: "0.5rem 1.25rem",
                    borderRadius: "9999px",
                    border: "1px solid",
                    borderColor: activeFilter === tag ? "var(--color-primary)" : "var(--color-outline-variant)",
                    backgroundColor: activeFilter === tag ? "var(--color-primary)" : "transparent",
                    color: activeFilter === tag ? "var(--color-on-primary)" : "var(--color-on-surface-variant)",
                    fontSize: "0.6875rem",
                    fontWeight: 500,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase" as const,
                    cursor: "pointer",
                  }}
                >
                  {tag}
                </button>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Testimonials Grid */}
      <section className="py-32 md:py-40" style={{ backgroundColor: "var(--color-surface)" }}>
        <div className="mx-auto max-w-7xl px-6">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16 md:mb-20"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.8, ease: luxuryEase }}
          >
            <span
              className="label-micro block mb-5"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Real Results
            </span>
            <h2
              className="headline-section text-3xl md:text-5xl mb-6"
              style={{ color: "var(--color-primary)" }}
            >
              In Their Words
            </h2>

            {/* Ornamental divider */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="w-12 h-px" style={{ backgroundColor: "var(--color-outline-variant)" }} />
              <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: "rgba(215,207,197,0.5)" }} />
              <div className="w-12 h-px" style={{ backgroundColor: "var(--color-outline-variant)" }} />
            </div>
          </motion.div>

          {/* Grid */}
          {!testimonials ? (
            <div className="flex justify-center py-20">
              <div
                className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
                style={{ borderColor: "var(--color-outline-variant)" }}
              />
            </div>
          ) : filtered.length === 0 ? (
            <p
              className="font-headline italic text-xl text-center py-16"
              style={{ color: "var(--color-on-surface-variant)", opacity: 0.6 }}
            >
              No testimonials found for this category.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {filtered.map((testimonial, i) => (
                <motion.div
                  key={testimonial._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.8, ease: luxuryEase, delay: (i % 2) * 0.1 }}
                  className="border transition-all duration-700 hover:shadow-[0_8px_40px_rgba(57,30,30,0.06)]"
                  style={{
                    borderColor: "rgba(215,207,197,0.35)",
                    backgroundColor: "var(--color-surface)",
                  }}
                >
                  <div className="p-8 md:p-10 flex flex-col h-full">
                    {/* Large decorative quote */}
                    <div
                      className="font-headline italic leading-none mb-4"
                      style={{
                        fontSize: "4rem",
                        color: "var(--color-secondary)",
                        opacity: 0.2,
                      }}
                    >
                      &ldquo;
                    </div>

                    {/* Quote */}
                    <p
                      className="font-headline italic text-lg md:text-xl leading-relaxed flex-1"
                      style={{ color: "var(--color-primary)", opacity: 0.85 }}
                    >
                      {testimonial.quote}
                    </p>

                    {/* Divider */}
                    <div
                      className="h-px w-full mt-8 mb-5"
                      style={{ backgroundColor: "var(--color-outline-variant)", opacity: 0.3 }}
                    />

                    {/* Attribution */}
                    <div className="flex items-center justify-between">
                      <span
                        className="label-micro"
                        style={{ color: "var(--color-on-surface-variant)" }}
                      >
                        {testimonial.name}
                      </span>
                      <span
                        className="label-micro"
                        style={{ color: "var(--color-secondary)", opacity: 0.7 }}
                      >
                        {testimonial.treatment}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Count */}
          {testimonials && filtered.length > 0 && (
            <motion.p
              className="text-center mt-16 body-editorial text-sm"
              style={{ color: "var(--color-on-surface-variant)", opacity: 0.5 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.5 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, ease: luxuryEase, delay: 0.3 }}
            >
              {filtered.length} {activeFilter === "All" ? "client" : activeFilter} review{filtered.length !== 1 ? "s" : ""}
            </motion.p>
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

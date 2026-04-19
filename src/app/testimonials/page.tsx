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

  // Get unique treatment tags for filtering
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
        headline={heroText.headline}
        subtitle={heroText.subtitle}
      />

      {/* Filter pills */}
      {treatments.length > 2 && (
        <section style={{ backgroundColor: "var(--color-surface)", padding: "2rem 0" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
              {treatments.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  style={{
                    padding: "0.375rem 1rem",
                    borderRadius: "9999px",
                    border: "1px solid",
                    borderColor: activeFilter === tag ? "var(--color-primary)" : "var(--color-outline-variant)",
                    backgroundColor: activeFilter === tag ? "var(--color-primary)" : "transparent",
                    color: activeFilter === tag ? "var(--color-on-primary)" : "var(--color-on-surface-variant)",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials grid */}
      <section style={{ backgroundColor: "var(--color-surface)", paddingBottom: "6rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
          {!testimonials ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "5rem 0" }}>
              <div
                className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
                style={{ borderColor: "var(--color-outline-variant)" }}
              />
            </div>
          ) : filtered.length === 0 ? (
            <p style={{
              textAlign: "center",
              padding: "4rem 0",
              fontSize: "1rem",
              color: "var(--color-on-surface-variant)",
              fontStyle: "italic",
            }}>
              No testimonials found for this category.
            </p>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
              gap: "1.5rem",
              paddingTop: "2rem",
            }}>
              {filtered.map((testimonial, i) => (
                <motion.div
                  key={testimonial._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.6, ease: luxuryEase, delay: i * 0.05 }}
                  style={{
                    backgroundColor: "var(--color-surface-lowest)",
                    borderRadius: "0.75rem",
                    padding: "2rem",
                    border: "1px solid var(--color-outline-variant)",
                    display: "flex",
                    flexDirection: "column",
                    transition: "box-shadow 0.3s ease",
                  }}
                >
                  {/* Quote mark */}
                  <div style={{
                    fontFamily: "var(--font-headline)",
                    fontSize: "3rem",
                    lineHeight: 1,
                    color: "var(--color-secondary)",
                    opacity: 0.3,
                    marginBottom: "0.5rem",
                  }}>
                    &ldquo;
                  </div>

                  {/* Quote text */}
                  <p style={{
                    fontSize: "0.9375rem",
                    lineHeight: 1.7,
                    color: "var(--color-on-surface)",
                    flex: 1,
                    fontStyle: "italic",
                  }}>
                    {testimonial.quote}
                  </p>

                  {/* Attribution */}
                  <div style={{
                    marginTop: "1.5rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid var(--color-outline-variant)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                    <span style={{
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      color: "var(--color-on-surface)",
                    }}>
                      {testimonial.name}
                    </span>
                    <span style={{
                      fontSize: "0.75rem",
                      color: "var(--color-on-surface-variant)",
                      backgroundColor: "var(--color-surface-low)",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "9999px",
                    }}>
                      {testimonial.treatment}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
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

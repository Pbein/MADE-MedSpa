"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import PageHeaderCompact from "@/components/sections/PageHeaderCompact";
import CTABanner from "@/components/sections/CTABanner";
import { useSectionContent } from "@/hooks/useSectionContent";
import { motion } from "framer-motion";

const luxuryEase = [0.16, 1, 0.3, 1] as const;
const viewportOnce = { once: true, margin: "-30px" } as const;

// ── Category helpers ─────────────────────────────────────────────────────────

type Category = "All" | "Natural Results" | "First Visit" | "Injectables" | "Skin Treatments";

const CATEGORIES: Category[] = ["All", "Natural Results", "First Visit", "Injectables", "Skin Treatments"];

function categorize(quote: string, treatment: string): Category {
  const q = quote.toLowerCase();
  const t = treatment.toLowerCase();
  if (t.includes("botox") || t.includes("filler") || t.includes("lip") || t.includes("sculptra") || t.includes("radiesse") || t.includes("kybella")) return "Injectables";
  if (t.includes("prf") || t.includes("prp") || t.includes("facial") || t.includes("hydra") || t.includes("peel") || t.includes("skin")) return "Skin Treatments";
  if (q.includes("nervous") || q.includes("first") || q.includes("comfortable") || q.includes("walked in")) return "First Visit";
  if (q.includes("natural") || q.includes("subtle") || q.includes("rested") || q.includes("refreshed") || q.includes("look like myself")) return "Natural Results";
  return "Natural Results";
}

// ── Component ────────────────────────────────────────────────────────────────

export default function TestimonialsPage() {
  const testimonials = useQuery(api.testimonials.list);
  const [activeFilter, setActiveFilter] = useState<Category>("All");

  const { data: ctaText } = useSectionContent("section_testimonials_cta", {
    headline: "Ready when you are.",
    subtitle: "Book a consultation and experience the MADE difference.",
    cta_text: "Book Your Consultation",
    cta_href: "/booking",
    secondary_text: "View Services",
    secondary_href: "/services",
  });

  // Categorize all testimonials
  const categorized = useMemo(() => {
    if (!testimonials) return [];
    return testimonials.map((t) => ({
      ...t,
      category: categorize(t.quote, t.treatment),
    }));
  }, [testimonials]);

  // Pick featured testimonial (the "I look like myself" one)
  const featured = useMemo(() => {
    return categorized.find((t) =>
      t.quote.includes("look like myself") || t.quote.includes("most natural")
    ) || categorized[0];
  }, [categorized]);

  // Filter
  const filtered = useMemo(() => {
    if (activeFilter === "All") return categorized;
    return categorized.filter((t) => t.category === activeFilter);
  }, [categorized, activeFilter]);

  // Group by category for sectioned view (when "All" is active)
  const grouped = useMemo(() => {
    if (activeFilter !== "All") return null;
    const groups: Record<string, typeof categorized> = {};
    for (const t of categorized) {
      if (t._id === featured?._id) continue; // skip featured
      if (!groups[t.category]) groups[t.category] = [];
      groups[t.category].push(t);
    }
    return groups;
  }, [categorized, activeFilter, featured]);

  return (
    <main className="relative min-h-screen overflow-hidden" style={{ backgroundColor: "var(--color-silk)" }}>
      {/* Editorial atmosphere layers */}
      <div className="pointer-events-none absolute inset-0 bg-editorial-base" />
      <div className="pointer-events-none absolute inset-0 bg-editorial-glow" />
      <div className="pointer-events-none absolute inset-0 bg-editorial-vignette" />
      <div className="pointer-events-none absolute inset-0 made-noise" style={{ opacity: 0.03 }} />

      {/* Content */}
      <div className="relative z-10">
      {/* 1. COMPACT HERO */}
      <div id="section-hero">
      <PageHeaderCompact
        eyebrow="Client Stories"
        title="Real Reviews"
        description="Every word is from a real client. No scripts, no edits — just honest experiences."
        transparent
      />
      </div>

      {/* 2. FILTERS */}
      <section className="pb-8 px-6" style={{ backgroundColor: "transparent" }}>
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className="transition-all duration-300"
                style={{
                  padding: "0.375rem 0.875rem",
                  border: "1px solid",
                  borderColor: activeFilter === cat ? "var(--color-primary)" : "var(--color-outline-variant)",
                  backgroundColor: activeFilter === cat ? "var(--color-primary)" : "transparent",
                  color: activeFilter === cat ? "var(--color-on-primary)" : "var(--color-on-surface-variant)",
                  fontSize: "0.6875rem",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  cursor: "pointer",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED TESTIMONIAL */}
      {featured && activeFilter === "All" && (
        <section
          className="py-16 md:py-20 px-6"
          style={{ backgroundColor: "rgba(255,255,255,0.35)" }}
        >
          <motion.div
            className="mx-auto max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.8, ease: luxuryEase }}
          >
            <blockquote
              className="font-headline italic text-xl md:text-2xl lg:text-3xl leading-snug mb-6"
              style={{ color: "var(--color-primary)" }}
            >
              &ldquo;{featured.quote.length > 200
                ? featured.quote.split(".").slice(0, 3).join(".") + "."
                : featured.quote}&rdquo;
            </blockquote>
            <div className="flex items-center gap-2">
              <div className="w-5 h-px" style={{ backgroundColor: "var(--color-outline-variant)" }} />
              <span className="label-micro" style={{ color: "var(--color-on-surface-variant)", opacity: 0.5 }}>
                {featured.name}
              </span>
              <span className="label-micro" style={{ color: "var(--color-secondary)", opacity: 0.4 }}>
                {featured.treatment}
              </span>
            </div>
          </motion.div>
        </section>
      )}

      {/* 4. TESTIMONIALS — GROUPED BY CATEGORY (when "All") or FLAT LIST (when filtered) */}
      <section id="section-grid" className="py-16 md:py-20 px-6" style={{ backgroundColor: "rgba(255,255,255,0.4)" }}>
        <div className="mx-auto max-w-3xl">
          {!testimonials ? (
            <div className="flex justify-center py-16">
              <div
                className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
                style={{ borderColor: "var(--color-outline-variant)" }}
              />
            </div>
          ) : grouped ? (
            // Sectioned view
            <>
              {Object.entries(grouped).map(([category, items]) => (
                items.length > 0 && (
                  <div key={category} className="mb-14">
                    {/* Category heading */}
                    <h2
                      className="font-headline italic text-lg md:text-xl mb-8"
                      style={{ color: "var(--color-primary)", opacity: 0.7 }}
                    >
                      {category}
                    </h2>

                    {/* Entries */}
                    <div className="space-y-8">
                      {items.map((t, i) => (
                        <TestimonialEntry key={t._id} testimonial={t} index={i} />
                      ))}
                    </div>
                  </div>
                )
              ))}
            </>
          ) : (
            // Flat filtered view
            filtered.length === 0 ? (
              <p
                className="body-editorial text-center py-12"
                style={{ color: "var(--color-on-surface-variant)", opacity: 0.5 }}
              >
                No reviews in this category yet.
              </p>
            ) : (
              <div className="space-y-8">
                {filtered.map((t, i) => (
                  <TestimonialEntry key={t._id} testimonial={t} index={i} />
                ))}
              </div>
            )
          )}

          {/* Count */}
          {testimonials && (
            <div
              className="mt-14 pt-8"
              style={{ borderTop: "1px solid var(--color-outline-variant)" }}
            >
              <p
                className="body-editorial text-sm"
                style={{ color: "var(--color-on-surface-variant)", opacity: 0.4 }}
              >
                {testimonials.length} verified client reviews
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 5. TRUST REINFORCEMENT */}
      <section className="py-12 md:py-16 px-6" style={{ backgroundColor: "rgba(255,255,255,0.35)" }}>
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="font-headline italic text-base md:text-lg"
            style={{ color: "var(--color-on-surface-variant)", opacity: 0.55 }}
          >
            No pressure. No overcorrection. No guessing.<br />
            Every treatment is intentional, informed, and tailored to you.
          </p>
        </div>
      </section>

      {/* 6. CTA — soft */}
      <div id="section-cta">
      <CTABanner
        headline={ctaText.headline}
        subtitle={ctaText.subtitle}
        ctaText={ctaText.cta_text}
        ctaHref={ctaText.cta_href}
        secondaryText={ctaText.secondary_text}
        secondaryHref={ctaText.secondary_href}
      />
      </div>
      </div>
    </main>
  );
}

// ── Testimonial Entry ────────────────────────────────────────────────────────
// A grounded, readable block — not a floating quote

function TestimonialEntry({
  testimonial,
  index,
}: {
  testimonial: { _id: string; quote: string; name: string; treatment: string };
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.5, ease: luxuryEase, delay: (index % 4) * 0.03 }}
      className="pb-8"
      style={{ borderBottom: "1px solid rgba(215,207,197,0.3)" }}
    >
      <blockquote
        className="body-editorial text-base leading-relaxed mb-3"
        style={{ color: "var(--color-on-surface)", opacity: 0.85 }}
      >
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <div className="flex items-center gap-2">
        <span
          className="text-xs font-medium"
          style={{ color: "var(--color-on-surface-variant)", opacity: 0.45 }}
        >
          {testimonial.name}
        </span>
        <span style={{ color: "var(--color-outline-variant)" }}>&middot;</span>
        <span
          className="text-xs"
          style={{ color: "var(--color-secondary)", opacity: 0.4 }}
        >
          {testimonial.treatment}
        </span>
      </div>
    </motion.div>
  );
}

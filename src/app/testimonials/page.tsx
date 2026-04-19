"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import CTABanner from "@/components/sections/CTABanner";
import { useSectionContent } from "@/hooks/useSectionContent";
import { motion } from "framer-motion";
import Link from "next/link";

const luxuryEase = [0.16, 1, 0.3, 1] as const;
const viewportOnce = { once: true, margin: "-50px" } as const;

export default function TestimonialsPage() {
  const testimonials = useQuery(api.testimonials.list);
  const [activeFilter, setActiveFilter] = useState("All");

  const { data: ctaText } = useSectionContent("section_testimonials_cta", {
    headline: "Ready when you are.",
    subtitle: "Book a consultation and experience the MADE difference for yourself.",
    cta_text: "Book Your Consultation",
    cta_href: "/booking",
    secondary_text: "View Services",
    secondary_href: "/services",
  });

  // Categorize testimonials for filters
  const categorized = useMemo(() => {
    if (!testimonials) return [];
    return testimonials.map((t) => {
      let category = "All";
      const q = t.quote.toLowerCase();
      const treat = t.treatment.toLowerCase();
      if (treat.includes("botox") || treat.includes("filler") || treat.includes("lip") || treat.includes("sculptra") || treat.includes("radiesse")) {
        category = "Injectables";
      } else if (treat.includes("prf") || treat.includes("prp") || treat.includes("facial")) {
        category = "Skin Treatments";
      } else if (q.includes("natural") || q.includes("subtle") || q.includes("rested") || q.includes("refreshed")) {
        category = "Natural Results";
      } else if (q.includes("nervous") || q.includes("first") || q.includes("comfortable")) {
        category = "First Visit";
      }
      return { ...t, category };
    });
  }, [testimonials]);

  const categories = ["All", "Natural Results", "First Visit", "Injectables", "Skin Treatments"];

  const filtered = useMemo(() => {
    if (activeFilter === "All") return categorized;
    return categorized.filter((t) => t.category === activeFilter);
  }, [categorized, activeFilter]);

  // Pick featured: a strong, specific quote
  const featuredIndex = useMemo(() => {
    const idx = categorized.findIndex((t) =>
      t.quote.includes("look like myself") || t.quote.includes("most natural")
    );
    return idx >= 0 ? idx : 0;
  }, [categorized]);

  const featured = categorized[featuredIndex];

  // Top 4 for immediate proof (skip featured)
  const topProof = useMemo(() => {
    return categorized.filter((_, i) => i !== featuredIndex).slice(0, 4);
  }, [categorized, featuredIndex]);

  // Remaining for the full list
  const remaining = useMemo(() => {
    const shown = new Set([featured?._id, ...topProof.map((t) => t._id)]);
    return filtered.filter((t) => !shown.has(t._id));
  }, [filtered, featured, topProof]);

  return (
    <main style={{ backgroundColor: "var(--color-surface)" }}>

      {/* ═══════════════════════════════════════════
          1. HERO — Small, fast, gets out of the way
          ═══════════════════════════════════════════ */}
      <section className="pt-36 md:pt-44 pb-16 md:pb-20 px-6">
        <div className="mx-auto max-w-3xl">
          <motion.span
            className="label-micro block mb-5"
            style={{ color: "var(--color-on-surface-variant)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: luxuryEase }}
          >
            Client Stories
          </motion.span>
          <motion.h1
            className="font-headline italic text-3xl md:text-4xl lg:text-5xl mb-5"
            style={{ color: "var(--color-primary)", lineHeight: 1.15 }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: luxuryEase, delay: 0.05 }}
          >
            Real experiences.<br />
            Thoughtful care.<br />
            Results that feel like you.
          </motion.h1>
          <motion.p
            className="body-editorial max-w-xl"
            style={{ color: "var(--color-on-surface-variant)", opacity: 0.65 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            transition={{ duration: 0.6, ease: luxuryEase, delay: 0.15 }}
          >
            Every word below is from a real client. No scripts, no edits.
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. IMMEDIATE PROOF — Best testimonials first
          ═══════════════════════════════════════════ */}
      {topProof.length > 0 && (
        <section className="pb-20 md:pb-28 px-6">
          <div className="mx-auto max-w-3xl space-y-12">
            {topProof.map((t, i) => (
              <motion.div
                key={t._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.7, ease: luxuryEase, delay: i * 0.05 }}
              >
                <blockquote
                  className="font-headline italic text-lg md:text-xl leading-relaxed mb-4"
                  style={{ color: "var(--color-primary)", opacity: 0.9 }}
                >
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-px" style={{ backgroundColor: "var(--color-outline-variant)" }} />
                  <span className="label-micro" style={{ color: "var(--color-on-surface-variant)", opacity: 0.5 }}>
                    {t.name}
                  </span>
                  <span className="label-micro" style={{ color: "var(--color-secondary)", opacity: 0.4 }}>
                    {t.treatment}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          3. FEATURED — One editorial moment
          ═══════════════════════════════════════════ */}
      {featured && (
        <section
          className="py-20 md:py-28 px-6"
          style={{ backgroundColor: "var(--color-surface-low)" }}
        >
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.9, ease: luxuryEase }}
          >
            <blockquote
              className="font-headline italic text-2xl md:text-3xl lg:text-4xl leading-snug mb-8"
              style={{ color: "var(--color-primary)" }}
            >
              &ldquo;{featured.quote.length > 200
                ? featured.quote.split(".").slice(0, 3).join(".") + "."
                : featured.quote}&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-px" style={{ backgroundColor: "var(--color-outline-variant)" }} />
              <span className="label-micro" style={{ color: "var(--color-on-surface-variant)", opacity: 0.5 }}>
                {featured.name} &middot; {featured.treatment}
              </span>
              <div className="w-6 h-px" style={{ backgroundColor: "var(--color-outline-variant)" }} />
            </div>
          </motion.div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          4. TRUST REINFORCEMENT
          ═══════════════════════════════════════════ */}
      <section className="py-16 md:py-20 px-6">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.8, ease: luxuryEase }}
        >
          <p
            className="font-headline italic text-lg md:text-xl leading-relaxed"
            style={{ color: "var(--color-on-surface-variant)", opacity: 0.6 }}
          >
            No pressure. No overcorrection. No guessing.<br />
            Every treatment is intentional, informed, and tailored to you.
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          5. CATEGORY FILTERS + FULL LIST
          ═══════════════════════════════════════════ */}
      <section className="pb-32 md:pb-44 px-6">
        <div className="mx-auto max-w-3xl">
          {/* Filters */}
          <motion.div
            className="flex flex-wrap gap-2 mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, ease: luxuryEase }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className="transition-all duration-300"
                style={{
                  padding: "0.4rem 1rem",
                  border: "1px solid",
                  borderColor: activeFilter === cat ? "var(--color-primary)" : "var(--color-outline-variant)",
                  backgroundColor: activeFilter === cat ? "var(--color-primary)" : "transparent",
                  color: activeFilter === cat ? "var(--color-on-primary)" : "var(--color-on-surface-variant)",
                  fontSize: "0.6875rem",
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  cursor: "pointer",
                }}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Testimonial list */}
          {remaining.length > 0 ? (
            <div className="space-y-14">
              {remaining.map((t, i) => (
                <motion.div
                  key={t._id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.6, ease: luxuryEase, delay: (i % 3) * 0.05 }}
                  style={{ borderLeft: "2px solid var(--color-outline-variant)", paddingLeft: "1.5rem" }}
                >
                  <blockquote
                    className="body-editorial text-base md:text-lg leading-relaxed mb-3"
                    style={{ color: "var(--color-on-surface)", opacity: 0.85 }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-medium"
                      style={{ color: "var(--color-on-surface-variant)", opacity: 0.5 }}
                    >
                      {t.name}
                    </span>
                    <span style={{ color: "var(--color-outline-variant)" }}>&middot;</span>
                    <span
                      className="text-xs"
                      style={{ color: "var(--color-secondary)", opacity: 0.5 }}
                    >
                      {t.treatment}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p
              className="font-headline italic text-lg text-center py-12"
              style={{ color: "var(--color-on-surface-variant)", opacity: 0.5 }}
            >
              No reviews in this category yet.
            </p>
          )}

          {/* Count */}
          {testimonials && (
            <div className="mt-20 pt-12" style={{ borderTop: "1px solid var(--color-outline-variant)" }}>
              <p
                className="body-editorial text-sm mb-1"
                style={{ color: "var(--color-on-surface-variant)", opacity: 0.4 }}
              >
                {testimonials.length} verified client reviews
              </p>
              <Link href="/services" className="link-editorial text-sm">
                Explore our services
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          6. CTA — Soft, not salesy
          ═══════════════════════════════════════════ */}
      <CTABanner
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

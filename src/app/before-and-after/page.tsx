"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import PageHeaderCompact from "@/components/sections/PageHeaderCompact";
import CTABanner from "@/components/sections/CTABanner";
import { useSectionContent } from "@/hooks/useSectionContent";
import { motion } from "framer-motion";

const luxuryEase = [0.16, 1, 0.3, 1] as const;
const viewportOnce = { once: true, margin: "-30px" } as const;

const TREATMENT_FILTERS = [
  "All",
  "Botox",
  "Filler",
  "Skin",
  "Laser",
  "Body",
  "Wellness",
  "Other",
] as const;

type TreatmentFilter = (typeof TREATMENT_FILTERS)[number];

export default function BeforeAfterPage() {
  const cases = useQuery(api.beforeAfter.list);
  const [activeFilter, setActiveFilter] = useState<TreatmentFilter>("All");

  const { data: ctaText } = useSectionContent("section_before_after_cta", {
    headline: "Ready for your transformation?",
    subtitle: "Book a consultation and let us craft a treatment plan tailored to you.",
    cta_text: "Book Your Consultation",
    cta_href: "/booking",
    secondary_text: "View Services",
    secondary_href: "/services",
  });

  const filtered = useMemo(() => {
    if (!cases) return [];
    if (activeFilter === "All") return cases;
    return cases.filter((c) => c.treatment === activeFilter);
  }, [cases, activeFilter]);

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: "var(--color-silk)" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-editorial-base" />
      <div className="pointer-events-none absolute inset-0 bg-editorial-glow" />
      <div className="pointer-events-none absolute inset-0 bg-editorial-vignette" />
      <div className="pointer-events-none absolute inset-0 made-noise" style={{ opacity: 0.03 }} />

      <div className="relative z-10">
        <div id="section-hero">
          <PageHeaderCompact
            eyebrow="Real Results"
            title="Before & After"
            description="See real transformations from real MADE clients. Photos shared with explicit consent."
            transparent
          />
        </div>

        {/* Filters */}
        <section className="pb-8 px-6">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-wrap gap-2">
              {TREATMENT_FILTERS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className="transition-all duration-300"
                  style={{
                    padding: "0.375rem 0.875rem",
                    border: "1px solid",
                    borderColor:
                      activeFilter === cat
                        ? "var(--color-primary)"
                        : "var(--color-outline-variant)",
                    backgroundColor:
                      activeFilter === cat ? "var(--color-primary)" : "transparent",
                    color:
                      activeFilter === cat
                        ? "var(--color-on-primary)"
                        : "var(--color-on-surface-variant)",
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

        {/* Grid */}
        <section
          id="section-grid"
          className="py-12 md:py-16 px-6"
          style={{ backgroundColor: "rgba(255,255,255,0.4)" }}
        >
          <div className="mx-auto max-w-5xl">
            {!cases ? (
              <div className="flex justify-center py-16">
                <div
                  className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
                  style={{ borderColor: "var(--color-outline-variant)" }}
                />
              </div>
            ) : filtered.length === 0 ? (
              <p
                className="body-editorial text-center py-16"
                style={{ color: "var(--color-on-surface-variant)", opacity: 0.6 }}
              >
                {cases.length === 0
                  ? "Gallery coming soon — we're capturing transformations for our clients."
                  : "No results yet in this category."}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
                {filtered.map((c, i) => (
                  <motion.article
                    key={c._id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportOnce}
                    transition={{
                      duration: 0.55,
                      ease: luxuryEase,
                      delay: (i % 6) * 0.04,
                    }}
                  >
                    <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4">
                      <BeforeAfterImage
                        src={c.beforeImageUrl}
                        alt={c.beforeAlt ?? `Before ${c.title}`}
                        label="Before"
                      />
                      <BeforeAfterImage
                        src={c.afterImageUrl}
                        alt={c.afterAlt ?? `After ${c.title}`}
                        label="After"
                      />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="label-micro"
                        style={{ color: "var(--color-secondary)", opacity: 0.7 }}
                      >
                        {c.treatment}
                      </span>
                      {c.isFeatured && (
                        <span
                          className="label-micro"
                          style={{ color: "var(--color-primary)", opacity: 0.5 }}
                        >
                          ★ Featured
                        </span>
                      )}
                    </div>
                    <h3
                      className="headline-section text-base md:text-lg"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {c.title}
                    </h3>
                    {c.caption && (
                      <p
                        className="body-editorial text-sm mt-2"
                        style={{
                          color: "var(--color-on-surface-variant)",
                          opacity: 0.8,
                        }}
                      >
                        {c.caption}
                      </p>
                    )}
                  </motion.article>
                ))}
              </div>
            )}

            {cases && cases.length > 0 && (
              <p
                className="text-xs text-center mt-14 max-w-2xl mx-auto leading-relaxed"
                style={{
                  color: "var(--color-on-surface-variant)",
                  opacity: 0.55,
                }}
              >
                Photos shared with explicit client consent. Some identifying features may
                be obscured to protect privacy. Individual results vary.
              </p>
            )}
          </div>
        </section>

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
    </div>
  );
}

function BeforeAfterImage({
  src,
  alt,
  label,
}: {
  src: string;
  alt: string;
  label: "Before" | "After";
}) {
  return (
    <div
      className="relative aspect-[4/5] overflow-hidden rounded-md"
      style={{ backgroundColor: "var(--color-glaze)" }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        className="object-cover"
      />
      <span
        aria-hidden
        className="absolute top-2 left-2 label-micro"
        style={{
          padding: "3px 8px",
          backgroundColor: "rgba(57, 30, 30, 0.78)",
          color: "var(--color-on-primary)",
          fontSize: "0.625rem",
          letterSpacing: "0.12em",
          borderRadius: "2px",
        }}
      >
        {label}
      </span>
    </div>
  );
}

"use client";

import { useState, useMemo, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Image from "next/image";
import Link from "next/link";
import CTABanner from "@/components/sections/CTABanner";
import { motion, useInView } from "framer-motion";
import { usePageSettings } from "@/hooks/usePageSettings";
import { useSectionContent } from "@/hooks/useSectionContent";
import PreviewBanner from "@/components/PreviewBanner";

const luxuryEase = [0.16, 1, 0.3, 1] as const;
const viewportOnce = { once: true, margin: "-50px" } as const;

const BOOKING_URL =
  process.env.NEXT_PUBLIC_PABAU_BOOKING_URL ||
  "https://partner.pabau.com/online-bookings/made-med-spa";

export default function ShopPage() {
  const products = useQuery(api.shopProducts.list);
  const [activeCategory, setActiveCategory] = useState("All");
  const gridRef = useRef(null);
  const isInView = useInView(gridRef, { once: true, amount: 0.05 });

  const categories = useMemo(() => {
    if (!products) return ["All"];
    const cats = Array.from(new Set(products.map((p) => p.category))).sort();
    return ["All", ...cats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  const { styleOverrides, isSectionVisible, isPreview } = usePageSettings("shop");
  const { data: ctaText } = useSectionContent("section_shop_cta", {
    headline: "Not sure what you need?",
    subtitle: "Book a skincare consultation. Nurse Karlyne will recommend the right products for your skin.",
    cta_text: "Book Consultation",
    cta_href: "/booking#pabau-iframe",
    secondary_text: "Contact Us",
    secondary_href: "/contact",
  });

  const hasProducts = products && products.length > 0;
  const showFilters = isSectionVisible("filters") && hasProducts && categories.length > 2;

  return (
    <div style={styleOverrides} className="min-h-screen text-[var(--color-espresso)]">
      {isPreview && <PreviewBanner />}

      {/* ═══ SHOP WRAPPER — Pale-sage atmospheric background image (matches
           /shop/[slug] detail page for visual continuity). Vignette +
           grain kept as independent finishes layered over the image. ═══ */}
      <div
        className="relative overflow-hidden"
        style={{
          backgroundImage: "url('/images/shop-atmosphere-green-bg.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#DDE3D3",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-editorial-vignette" />
        <div className="pointer-events-none absolute inset-0 made-noise" style={{ opacity: 0.04 }} />

        {/* ═══ HEADER — top padding matches PageHero (services/about) so
             all three inner-page heroes share the same nav-to-eyebrow
             gap. Was pt-36 md:pt-44; aligned to pt-36 md:pt-40. ═══ */}
        <section id="section-hero" className="relative pt-36 md:pt-40 pb-10 px-6 md:px-8">
          <div className="mx-auto max-w-[1280px] text-center">
            <motion.p
              className="mb-6 text-[11px] uppercase text-[var(--color-soft-taupe)]"
              style={{ letterSpacing: "0.12em" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: luxuryEase }}
            >
              Treatments
            </motion.p>

            {/* H1 scaled down from clamp(2.5rem,5vw,5rem) [=40-80px] to
               text-3xl md:text-5xl [=30-48px] to match the rest of the
               inner-page hero system (PageHero, PageHeaderCompact).
               max-width tightened from 4xl -> 2xl since the headline no
               longer needs to span the full content width at the smaller
               size. Karlyne 2026-05-13 — senior UI pass. */}
            <motion.h1
              className="mx-auto max-w-2xl font-headline text-3xl md:text-5xl leading-tight text-[var(--color-espresso)]"
              style={{ letterSpacing: "-0.02em" }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: luxuryEase, delay: 0.05 }}
            >
              Curated skincare we trust
              <br />
              <span className="font-light">in every treatment.</span>
            </motion.h1>

            {/* Subtitle: espresso at 0.65 opacity (was soft-taupe). Soft-taupe
               vanishes on the sage atmosphere bg — needs espresso-derived
               color for proper contrast while staying soft (Karlyne 2026-05-15). */}
            <motion.p
              className="mx-auto mt-5 max-w-xl text-base leading-relaxed"
              style={{ color: "rgba(57, 30, 30, 0.65)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: luxuryEase, delay: 0.15 }}
            >
              Selected by our providers. Used in our treatments. Loved by our clients.
            </motion.p>

            {/* Filters */}
            {showFilters && (
              <motion.div
                className="mt-10 flex flex-wrap gap-3 justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: luxuryEase, delay: 0.25 }}
              >
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className="transition-all duration-300"
                      style={{
                        padding: "0.5rem 1.25rem",
                        borderRadius: "999px",
                        border: "1px solid",
                        borderColor: isActive ? "var(--color-espresso)" : "var(--border-soft)",
                        background: isActive ? "var(--color-espresso)" : "rgba(255,255,255,0.4)",
                        color: isActive ? "#ffffff" : "var(--color-soft-taupe)",
                        fontSize: "12px",
                        fontWeight: 500,
                        textTransform: "uppercase" as const,
                        letterSpacing: "0.12em",
                        cursor: "pointer",
                        boxShadow: isActive ? "var(--shadow-made-button)" : "none",
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </div>
        </section>

        {/* ═══ EDITORIAL LINE ═══ */}
        {hasProducts && (
          <div className="relative px-6 md:px-8 pt-2 pb-6">
            <motion.p
              className="accent-quote mx-auto max-w-[1280px] text-center text-base md:text-lg"
              style={{ color: "rgba(57, 30, 30, 0.55)" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, ease: luxuryEase }}
            >
              Used in our treatments. Recommended for results you can maintain at home.
            </motion.p>
          </div>
        )}

        {/* ═══ PRODUCT GRID — 2 / 3 / 4 columns ═══ */}
        <section id="section-grid" ref={gridRef} className="relative px-6 md:px-8 pb-24 md:pb-32">
          <div className="mx-auto max-w-[1280px]">
            {!products ? (
              <div className="flex justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: "var(--color-outline-variant)" }} />
              </div>
            ) : products.length === 0 ? (
              <motion.div
                className="text-center py-20 max-w-lg mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.8, ease: luxuryEase }}
              >
                <p className="headline-section text-xl mb-5" style={{ color: "var(--color-espresso)" }}>
                  Coming Soon
                </p>
                <p className="text-sm" style={{ color: "var(--color-soft-taupe)" }}>
                  Our curated collection is being carefully selected.
                </p>
              </motion.div>
            ) : filteredProducts.length === 0 ? (
              <p className="body-editorial text-lg text-center py-16" style={{ color: "var(--color-soft-taupe)", opacity: 0.6 }}>
                No products in this category yet.
              </p>
            ) : (
              // Mobile-first stack: 1 card on phones (<640px), 2 on phablet/
              // large mobile (sm), 3 on tablet (md), 4 on desktop (xl).
              // Karlyne 2026-05-13 — 2 cards on small screens read as
              // cluttered; single column lets each product breathe.
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-5 md:gap-6 lg:gap-8">
                {filteredProducts.map((product, i) => {
                  const slug = product.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "") || product._id;
                  return (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, ease: luxuryEase, delay: i * 0.04 }}
                    >
                      <Link
                        href={`/shop/${slug}`}
                        aria-label={`View ${product.name}`}
                        className="group flex flex-col overflow-hidden transition-all duration-500 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-blush)] focus-visible:ring-offset-2"
                        style={{
                          background: "rgba(255,255,255,0.55)",
                          border: "1px solid var(--border-soft)",
                          borderRadius: "0.875rem",
                          boxShadow: "var(--shadow-made-soft)",
                          backdropFilter: "blur(2px)",
                          height: "100%",
                        }}
                      >
                        {/* Square 1:1 image — matches the 1200×1200 spec. */}
                        <div
                          className="relative w-full aspect-square overflow-hidden"
                          style={{
                            background:
                              "linear-gradient(180deg, #f7f1ea 0%, #efe7df 100%)",
                            borderRadius: "0.875rem 0.875rem 0 0",
                          }}
                        >
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                              className="object-contain transition-transform duration-1000 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-[1.04]"
                              style={{ padding: "12%" }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <span
                                className="font-headline text-4xl md:text-5xl"
                                style={{ color: "var(--color-soft-taupe)", opacity: 0.2 }}
                              >
                                {product.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Card meta — minimal: category, name, price + arrow.
                            Description lives on the detail page (cleaner cards,
                            standard ecommerce pattern). */}
                        <div className="flex flex-1 flex-col justify-between gap-3 p-4 md:p-5">
                          <div>
                            <p
                              className="mb-2 text-[10px] md:text-[11px] uppercase text-[var(--color-soft-taupe)]"
                              style={{ letterSpacing: "0.14em", opacity: 0.75 }}
                            >
                              {product.category}
                            </p>
                            <h3
                              className="text-sm md:text-base leading-tight text-[var(--color-espresso)]"
                              style={{
                                fontFamily: "var(--font-body)",
                                letterSpacing: "-0.01em",
                              }}
                            >
                              {product.name}
                            </h3>
                          </div>

                          <div
                            className="flex items-end justify-between gap-3 pt-3 border-t"
                            style={{ borderColor: "var(--border-soft)" }}
                          >
                            <span
                              className="text-base md:text-lg leading-none text-[var(--color-espresso)]"
                              style={{ fontFamily: "var(--font-label)" }}
                            >
                              ${product.price.toFixed(0)}
                            </span>
                            <span
                              className="inline-flex items-center gap-2 text-[10px] md:text-[11px] font-medium uppercase text-[var(--color-espresso)] transition-transform duration-300 group-hover:translate-x-1"
                              style={{ letterSpacing: "0.14em" }}
                            >
                              View
                              <span className="h-px w-4 md:w-5 bg-current" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ═══ CONSULTATION NUDGE ═══ */}
      {hasProducts && (
        <section className="py-14 px-6" style={{ backgroundColor: "var(--color-powder)" }}>
          <div className="mx-auto max-w-2xl text-center">
            <p className="accent-quote text-lg md:text-xl mb-5" style={{ color: "var(--color-soft-taupe)" }}>
              Not sure which products are right for you?
            </p>
            <Link href="/booking#pabau-iframe" className="link-editorial text-sm">
              Book a skincare consultation
            </Link>
          </div>
        </section>
      )}

      {isSectionVisible("cta") && (
        <div id="section-cta">
          <CTABanner
            headline={ctaText.headline}
            subtitle={ctaText.subtitle}
            ctaText={ctaText.cta_text}
            ctaHref={ctaText.cta_href || BOOKING_URL}
            ctaExternal={!ctaText.cta_href}
            secondaryText={ctaText.secondary_text}
            secondaryHref={ctaText.secondary_href}
          />
        </div>
      )}
    </div>
  );
}

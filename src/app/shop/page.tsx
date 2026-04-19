"use client";

import { useState, useMemo, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
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
  "https://partner.pabau.com/online-bookings/made-51g64";

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

  // Featured: top 2 by price
  const featured = useMemo(() => {
    if (!products || products.length < 3) return [];
    return [...products].sort((a, b) => b.price - a.price).slice(0, 2);
  }, [products]);

  // Grid: everything except featured when "All"
  const gridProducts = useMemo(() => {
    if (activeCategory !== "All") return filteredProducts;
    const ids = new Set(featured.map((f) => f._id));
    return filteredProducts.filter((p) => !ids.has(p._id));
  }, [filteredProducts, featured, activeCategory]);

  const { styleOverrides, isSectionVisible, isPreview } = usePageSettings("shop");
  const { data: ctaText } = useSectionContent("section_shop_cta", {
    headline: "Not sure what you need?",
    subtitle: "Book a skincare consultation. Nurse Karlyne will recommend the right products for your skin.",
    cta_text: "Book Consultation",
    cta_href: "/booking",
    secondary_text: "Contact Us",
    secondary_href: "/contact",
  });

  const hasProducts = products && products.length > 0;
  const showFilters = isSectionVisible("filters") && hasProducts && categories.length > 2;

  return (
    <main style={styleOverrides} className="min-h-screen text-[var(--color-espresso)]">
      {isPreview && <PreviewBanner />}

      {/* ═══ ATMOSPHERE WRAPPER — one continuous background ═══ */}
      <div
        className="made-noise relative overflow-hidden"
        style={{
          backgroundColor: "#e6d5ca",
          backgroundImage: "radial-gradient(ellipse 120% 80% at 80% 20%, rgba(255,238,224,0.85) 0%, transparent 60%), radial-gradient(ellipse 80% 60% at 20% 80%, rgba(200,165,145,0.2) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(57,30,30,0.12) 100%)",
        }}
      >

        {/* ═══ HEADER ═══ */}
        <section className="relative pt-36 md:pt-44 pb-10 px-6 md:px-8">
          <div className="mx-auto max-w-[1180px] text-center">
            <motion.p
              className="mb-6 text-[11px] uppercase text-[var(--color-soft-taupe)]"
              style={{ letterSpacing: "0.12em" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: luxuryEase }}
            >
              Treatments
            </motion.p>

            <motion.h1
              className="mx-auto max-w-4xl font-headline text-[clamp(2.5rem,5vw,5rem)] leading-[0.95] text-[var(--color-espresso)]"
              style={{ letterSpacing: "-0.03em" }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: luxuryEase, delay: 0.05 }}
            >
              Curated skincare we trust
              <br />
              <span className="font-light italic">in every treatment.</span>
            </motion.h1>

            <motion.p
              className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--color-soft-taupe)]"
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

        {/* ═══ FEATURED — Provider Favorites ═══ */}
        {featured.length > 0 && activeCategory === "All" && (
          <section className="relative px-6 md:px-8 pt-8 pb-6">
            <div className="mx-auto max-w-[1180px]">
              <motion.p
                className="mb-6 text-[11px] uppercase text-[var(--color-soft-taupe)]"
                style={{ letterSpacing: "0.12em" }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 0.6, ease: luxuryEase }}
              >
                Provider Favorites
              </motion.p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {featured.map((product, i) => (
                  <motion.a
                    key={product._id}
                    href={product.pabauLink || BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group overflow-hidden transition-all duration-300 hover:-translate-y-1"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportOnce}
                    transition={{ duration: 0.7, ease: luxuryEase, delay: i * 0.1 }}
                    style={{
                      background: "var(--gradient-shop-surface)",
                      border: "1px solid var(--border-soft)",
                      borderRadius: "1rem",
                      boxShadow: "var(--shadow-made-soft)",
                      backdropFilter: "blur(2px)",
                      display: "grid",
                      gridTemplateColumns: "0.95fr 1.25fr",
                    }}
                  >
                    {/* Image */}
                    <div
                      className="relative min-h-[280px] md:min-h-[320px]"
                      style={{ background: "linear-gradient(180deg, var(--color-powder) 0%, var(--color-glaze) 100%)" }}
                    >
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="font-headline italic text-5xl" style={{ color: "var(--color-soft-taupe)", opacity: 0.25 }}>{product.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-between p-6 md:p-8">
                      <div>
                        <p className="mb-4 text-[11px] uppercase text-[var(--color-soft-taupe)]" style={{ letterSpacing: "0.12em" }}>
                          {product.category}
                        </p>
                        <h3 className="font-headline text-[1.75rem] md:text-[2rem] leading-[1.05] text-[var(--color-espresso)]" style={{ letterSpacing: "-0.02em" }}>
                          {product.name}
                        </h3>
                        <p className="mt-4 text-[15px] leading-7 text-[var(--color-soft-taupe)]">
                          {product.description}
                        </p>
                      </div>

                      <div className="mt-8 flex items-end justify-between gap-6">
                        <span className="font-headline text-[2rem] leading-none text-[var(--color-espresso)]">
                          ${product.price.toFixed(0)}
                        </span>
                        <span className="inline-flex items-center gap-3 text-[12px] font-medium uppercase text-[var(--color-espresso)] transition-transform duration-300 group-hover:translate-x-1" style={{ letterSpacing: "0.12em" }}>
                          {product.pabauLink ? "Shop Now" : "Inquire"}
                          <span className="h-px w-6 bg-current" />
                        </span>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══ EDITORIAL LINE ═══ */}
        {hasProducts && activeCategory === "All" && (
          <div className="relative px-6 md:px-8 py-8">
            <motion.p
              className="mx-auto max-w-[1180px] text-center text-lg italic text-[var(--color-soft-taupe)]"
              style={{ opacity: 0.7 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.7 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, ease: luxuryEase }}
            >
              Used in our treatments. Recommended for results you can maintain at home.
            </motion.p>
          </div>
        )}

        {/* ═══ PRODUCT GRID ═══ */}
        <section ref={gridRef} className="relative px-6 md:px-8 pb-24 md:pb-32">
          <div className="mx-auto max-w-[1180px]">
            {!products ? (
              <div className="flex justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: "var(--color-outline-variant)" }} />
              </div>
            ) : products.length === 0 ? (
              <motion.div className="text-center py-20 max-w-lg mx-auto" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce} transition={{ duration: 0.8, ease: luxuryEase }}>
                <p className="font-headline italic text-2xl mb-5" style={{ color: "var(--color-espresso)" }}>Coming Soon</p>
                <p className="text-sm" style={{ color: "var(--color-soft-taupe)" }}>Our curated collection is being carefully selected.</p>
              </motion.div>
            ) : gridProducts.length === 0 && activeCategory !== "All" ? (
              <p className="font-headline italic text-lg text-center py-16" style={{ color: "var(--color-soft-taupe)", opacity: 0.6 }}>No products in this category yet.</p>
            ) : gridProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {gridProducts.map((product, i) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease: luxuryEase, delay: i * 0.06 }}
                    className="group overflow-hidden transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: "rgba(255,255,255,0.5)",
                      border: "1px solid var(--border-soft)",
                      borderRadius: "1rem",
                      boxShadow: "var(--shadow-made-soft)",
                    }}
                  >
                    <div
                      className="aspect-[4/5] overflow-hidden"
                      style={{
                        background: product.imageUrl ? "var(--color-glaze)" : "linear-gradient(180deg, var(--color-powder) 0%, var(--color-glaze) 100%)",
                        borderRadius: "1rem 1rem 0 0",
                      }}
                    >
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-[1.04]" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="font-headline italic text-4xl" style={{ color: "var(--color-soft-taupe)", opacity: 0.2 }}>{product.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <p className="mb-3 text-[11px] uppercase text-[var(--color-soft-taupe)]" style={{ letterSpacing: "0.12em", opacity: 0.7 }}>
                        {product.category}
                      </p>
                      <h3 className="font-headline text-[1.5rem] md:text-[1.75rem] leading-[1.05] text-[var(--color-espresso)]" style={{ letterSpacing: "-0.02em" }}>
                        {product.name}
                      </h3>
                      <p className="mt-3 text-[15px] leading-7 text-[var(--color-soft-taupe)] line-clamp-2">
                        {product.description}
                      </p>

                      <div className="mt-6 flex items-end justify-between gap-4 border-t pt-5" style={{ borderColor: "var(--border-soft)" }}>
                        <span className="font-headline text-[1.75rem] leading-none text-[var(--color-espresso)]">
                          ${product.price.toFixed(0)}
                        </span>
                        <a
                          href={product.pabauLink || BOOKING_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 text-[12px] font-medium uppercase text-[var(--color-espresso)] transition-transform duration-300 group-hover:translate-x-1"
                          style={{ letterSpacing: "0.12em" }}
                        >
                          {product.pabauLink ? "Shop" : "Inquire"}
                          <span className="h-px w-6 bg-current" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </div>

      {/* ═══ CONSULTATION NUDGE ═══ */}
      {hasProducts && (
        <section className="py-14 px-6" style={{ backgroundColor: "var(--color-powder)" }}>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-headline italic text-lg md:text-xl mb-5" style={{ color: "var(--color-soft-taupe)" }}>
              Not sure which products are right for you?
            </p>
            <Link href="/booking" className="link-editorial text-sm">
              Book a skincare consultation
            </Link>
          </div>
        </section>
      )}

      {isSectionVisible("cta") && (
        <CTABanner
          headline={ctaText.headline}
          subtitle={ctaText.subtitle}
          ctaText={ctaText.cta_text}
          ctaHref={ctaText.cta_href || BOOKING_URL}
          ctaExternal={!ctaText.cta_href}
          secondaryText={ctaText.secondary_text}
          secondaryHref={ctaText.secondary_href}
        />
      )}
    </main>
  );
}

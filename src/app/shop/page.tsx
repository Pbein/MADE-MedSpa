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

  // Featured: first 2 products (or highest priced)
  const featured = useMemo(() => {
    if (!products || products.length < 3) return [];
    const sorted = [...products].sort((a, b) => b.price - a.price);
    return sorted.slice(0, 2);
  }, [products]);

  // Grid products: everything except featured (when showing "All")
  const gridProducts = useMemo(() => {
    if (activeCategory !== "All") return filteredProducts;
    const featuredIds = new Set(featured.map((f) => f._id));
    return filteredProducts.filter((p) => !featuredIds.has(p._id));
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
    <main style={styleOverrides}>
      {isPreview && <PreviewBanner />}

      {/* ═══════════════════════════════════════════
          CONTINUOUS FLOW — header → filters → featured → grid
          One gradient background, no hard breaks
          ═══════════════════════════════════════════ */}
      <div
        style={{
          background: "radial-gradient(circle at 15% 25%, rgba(216,192,187,0.18), transparent 45%), radial-gradient(circle at 85% 10%, rgba(201,170,150,0.12), transparent 40%), linear-gradient(180deg, var(--color-silk) 0%, var(--color-powder) 40%, var(--color-silk) 100%)",
        }}
      >
        {/* Header */}
        <section className="pt-36 md:pt-44 pb-10 md:pb-12 px-6">
          <div className="mx-auto max-w-6xl">
            <motion.h1
              className="font-headline italic text-3xl md:text-4xl lg:text-5xl mb-4"
              style={{ color: "var(--color-primary)", lineHeight: 1.15 }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: luxuryEase, delay: 0.05 }}
            >
              Curated skincare we trust<br />
              <span className="font-extralight">in every treatment.</span>
            </motion.h1>
            <motion.p
              className="body-editorial text-sm max-w-lg"
              style={{ color: "rgba(57,30,30,0.5)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: luxuryEase, delay: 0.15 }}
            >
              Selected by our providers. Used in our treatments. Loved by our clients.
            </motion.p>
          </div>
        </section>

        {/* Filters */}
        {showFilters && (
          <section className="pb-8 px-6">
            <div className="mx-auto max-w-6xl">
              <motion.div
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: luxuryEase, delay: 0.2 }}
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="transition-all duration-300"
                    style={{
                      padding: "0.4rem 1rem",
                      borderRadius: "9999px",
                      border: "1px solid",
                      borderColor: activeCategory === cat ? "var(--color-rose-dust)" : "rgba(57,30,30,0.08)",
                      background: activeCategory === cat ? "var(--color-rose-dust)" : "rgba(255,255,255,0.4)",
                      color: activeCategory === cat ? "var(--color-espresso)" : "rgba(57,30,30,0.5)",
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
            </div>
          </section>
        )}

        {/* Featured Products — larger cards, editorial feel */}
        {featured.length > 0 && activeCategory === "All" && (
          <section className="pb-6 px-6">
            <div className="mx-auto max-w-6xl">
              <motion.span
                className="label-micro block mb-6"
                style={{ color: "rgba(57,30,30,0.4)" }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 0.6, ease: luxuryEase }}
              >
                Provider Favorites
              </motion.span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {featured.map((product, i) => (
                  <motion.a
                    key={product._id}
                    href={product.pabauLink || BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block transition-all duration-500"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportOnce}
                    transition={{ duration: 0.7, ease: luxuryEase, delay: i * 0.1 }}
                    whileHover={{ y: -4 }}
                    style={{
                      background: "rgba(255,255,255,0.5)",
                      border: "1px solid rgba(57,30,30,0.04)",
                      boxShadow: "0 4px 20px rgba(57,30,30,0.04)",
                      display: "flex",
                      flexDirection: "row",
                      overflow: "hidden",
                    }}
                  >
                    {/* Image */}
                    <div
                      className="w-2/5 shrink-0 overflow-hidden"
                      style={{
                        background: product.imageUrl
                          ? "var(--color-glaze)"
                          : "linear-gradient(180deg, var(--color-powder) 0%, var(--color-glaze) 100%)",
                      }}
                    >
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full min-h-[200px] items-center justify-center">
                          <span className="font-headline italic text-4xl" style={{ color: "var(--color-soft-taupe)", opacity: 0.3 }}>
                            {product.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-center p-6 md:p-8 flex-1">
                      <span style={{ color: "rgba(57,30,30,0.4)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.5rem", display: "block" }}>
                        {product.category}
                      </span>
                      <h3 className="font-headline italic text-xl md:text-2xl mb-2" style={{ color: "var(--color-primary)", lineHeight: 1.25 }}>
                        {product.name}
                      </h3>
                      <p className="text-sm mb-4 line-clamp-2" style={{ color: "rgba(57,30,30,0.55)", lineHeight: 1.6 }}>
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="font-headline text-xl" style={{ color: "var(--color-primary)" }}>
                          ${product.price.toFixed(0)}
                        </span>
                        <span className="group/link flex items-center gap-2 transition-all duration-500 group-hover:gap-3" style={{ color: "var(--color-primary)" }}>
                          <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                            {product.pabauLink ? "Shop Now" : "Inquire"}
                          </span>
                          <span className="inline-block h-px transition-all duration-500 group-hover:w-8" style={{ width: "1.25rem", backgroundColor: "var(--color-primary)" }} />
                        </span>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Editorial micro-copy */}
        {hasProducts && activeCategory === "All" && (
          <section className="py-10 px-6">
            <div className="mx-auto max-w-6xl">
              <motion.p
                className="font-headline italic text-base"
                style={{ color: "rgba(57,30,30,0.35)" }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 0.6, ease: luxuryEase }}
              >
                Used in our treatments. Recommended for results you can maintain at home.
              </motion.p>
            </div>
          </section>
        )}

        {/* Main Grid */}
        <section ref={gridRef} className="pb-24 md:pb-32 px-6">
          <div className="mx-auto max-w-6xl">
            {!products ? (
              <div className="flex justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: "var(--color-outline-variant)" }} />
              </div>
            ) : products.length === 0 ? (
              <motion.div className="text-center py-20 max-w-lg mx-auto" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce} transition={{ duration: 0.8, ease: luxuryEase }}>
                <p className="font-headline italic text-2xl mb-5" style={{ color: "var(--color-primary)" }}>Coming Soon</p>
                <p className="body-editorial text-sm" style={{ color: "rgba(57,30,30,0.55)" }}>Our curated collection is being carefully selected.</p>
              </motion.div>
            ) : gridProducts.length === 0 && activeCategory !== "All" ? (
              <div className="text-center py-16">
                <p className="font-headline italic text-lg" style={{ color: "rgba(57,30,30,0.5)" }}>No products in this category yet.</p>
              </div>
            ) : gridProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {gridProducts.map((product, i) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease: luxuryEase, delay: i * 0.06 }}
                    className="group transition-all duration-500"
                    whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(57,30,30,0.1)" }}
                    style={{
                      background: "rgba(255,255,255,0.45)",
                      border: "1px solid rgba(57,30,30,0.04)",
                      boxShadow: "0 2px 12px rgba(57,30,30,0.03)",
                    }}
                  >
                    <div
                      className="aspect-square overflow-hidden"
                      style={{
                        background: product.imageUrl ? "var(--color-glaze)" : "linear-gradient(180deg, var(--color-powder) 0%, var(--color-glaze) 100%)",
                      }}
                    >
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-[1.04]" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="font-headline italic text-3xl" style={{ color: "var(--color-soft-taupe)", opacity: 0.3 }}>{product.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <span style={{ color: "rgba(57,30,30,0.4)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.375rem", display: "block" }}>
                        {product.category}
                      </span>
                      <h3 className="font-headline italic text-lg mb-1.5" style={{ color: "var(--color-primary)", lineHeight: 1.25 }}>{product.name}</h3>
                      <p className="text-sm mb-4 line-clamp-2" style={{ color: "rgba(57,30,30,0.5)", lineHeight: 1.5 }}>{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-headline text-lg" style={{ color: "var(--color-primary)" }}>${product.price.toFixed(0)}</span>
                        <a
                          href={product.pabauLink || BOOKING_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link flex items-center gap-2 transition-all duration-500 hover:gap-3"
                          style={{ color: "var(--color-primary)" }}
                        >
                          <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>{product.pabauLink ? "Shop" : "Inquire"}</span>
                          <span className="inline-block h-px transition-all duration-500 group-hover/link:w-7" style={{ width: "1rem", backgroundColor: "var(--color-primary)" }} />
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

      {/* Consultation nudge */}
      {hasProducts && (
        <section className="py-14 px-6" style={{ backgroundColor: "var(--color-powder)" }}>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-headline italic text-lg md:text-xl mb-5" style={{ color: "rgba(57,30,30,0.55)" }}>
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

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
          EDITORIAL HEADER — anchors the page
          ═══════════════════════════════════════════ */}
      <section
        className="pt-36 md:pt-44 pb-14 md:pb-16 px-6"
        style={{
          background: "radial-gradient(circle at 20% 30%, rgba(216,192,187,0.2), transparent 45%), radial-gradient(circle at 85% 15%, rgba(201,170,150,0.15), transparent 40%), linear-gradient(180deg, var(--color-silk) 0%, var(--color-powder) 100%)",
        }}
      >
        <div className="mx-auto max-w-3xl">
          <motion.span
            className="label-micro block mb-5"
            style={{ color: "var(--color-on-surface-variant)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: luxuryEase }}
          >
            Shop
          </motion.span>
          <motion.h1
            className="font-headline italic text-3xl md:text-4xl lg:text-5xl mb-5"
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
            style={{ color: "rgba(57,30,30,0.55)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: luxuryEase, delay: 0.15 }}
          >
            Every product is selected by our providers, used in our treatments, and loved by our clients.
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FILTERS
          ═══════════════════════════════════════════ */}
      {showFilters && (
        <section className="py-6 px-6" style={{ backgroundColor: "var(--color-surface)" }}>
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
                    border: "1px solid",
                    borderColor: activeCategory === cat ? "transparent" : "rgba(57,30,30,0.1)",
                    background: activeCategory === cat
                      ? "linear-gradient(135deg, #391e1e 0%, #84262c 100%)"
                      : "var(--color-glaze)",
                    color: activeCategory === cat ? "var(--color-on-primary)" : "rgba(57,30,30,0.6)",
                    fontSize: "0.6875rem",
                    fontWeight: 500,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    cursor: "pointer",
                    borderRadius: "9999px",
                  }}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          PRODUCT GRID
          ═══════════════════════════════════════════ */}
      <section
        ref={gridRef}
        className="pt-10 pb-24 md:pb-32 px-6"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <div className="mx-auto max-w-6xl">
          {/* Subtle section separator */}
          <div className="mb-12" style={{ borderTop: "1px solid rgba(57,30,30,0.06)" }} />

          {!products ? (
            <div className="flex justify-center py-20">
              <div
                className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
                style={{ borderColor: "var(--color-outline-variant)" }}
              />
            </div>
          ) : products.length === 0 ? (
            <motion.div
              className="text-center py-20 max-w-lg mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, ease: luxuryEase }}
            >
              <p className="font-headline italic text-2xl mb-5" style={{ color: "var(--color-primary)" }}>
                Coming Soon
              </p>
              <p className="body-editorial text-sm" style={{ color: "rgba(57,30,30,0.55)" }}>
                Our curated collection is being carefully selected. Each product is chosen for proven results.
              </p>
            </motion.div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-headline italic text-lg" style={{ color: "rgba(57,30,30,0.5)" }}>
                No products in this category yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, ease: luxuryEase, delay: i * 0.07 }}
                  className="group transition-all duration-500"
                  whileHover={{ y: -6 }}
                  style={{
                    background: "rgba(255,255,255,0.45)",
                    border: "1px solid rgba(57,30,30,0.05)",
                    boxShadow: "0 2px 12px rgba(57,30,30,0.03)",
                  }}
                >
                  {/* Product Image */}
                  <div
                    className="aspect-square overflow-hidden"
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
                        className="h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span
                          className="font-headline italic text-4xl"
                          style={{ color: "var(--color-soft-taupe)", opacity: 0.35 }}
                        >
                          {product.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <span
                      className="mb-2.5 block"
                      style={{
                        color: "rgba(57,30,30,0.45)",
                        fontSize: "10px",
                        fontWeight: 500,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      }}
                    >
                      {product.category}
                    </span>

                    <h3
                      className="font-headline italic text-lg md:text-xl mb-2"
                      style={{ color: "var(--color-primary)", lineHeight: 1.25 }}
                    >
                      {product.name}
                    </h3>

                    <p
                      className="text-sm mb-5 line-clamp-2"
                      style={{ color: "rgba(57,30,30,0.55)", lineHeight: 1.6 }}
                    >
                      {product.description}
                    </p>

                    {/* Price + CTA */}
                    <div className="flex items-center justify-between">
                      <span
                        className="font-headline text-xl"
                        style={{ color: "var(--color-primary)" }}
                      >
                        ${product.price.toFixed(0)}
                      </span>

                      <a
                        href={product.pabauLink || BOOKING_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link flex items-center gap-2 transition-all duration-500 hover:gap-3"
                        style={{ color: "var(--color-primary)" }}
                      >
                        <span style={{
                          fontSize: "11px",
                          fontWeight: 500,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}>
                          {product.pabauLink ? "Shop Now" : "Inquire"}
                        </span>
                        <span
                          className="inline-block h-px transition-all duration-500 group-hover/link:w-8"
                          style={{ width: "1.25rem", backgroundColor: "var(--color-primary)" }}
                        />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CONSULTATION NUDGE — editorial, not salesy
          ═══════════════════════════════════════════ */}
      {hasProducts && (
        <section className="py-14 md:py-16 px-6" style={{ backgroundColor: "var(--color-powder)" }}>
          <div className="mx-auto max-w-2xl text-center">
            <motion.p
              className="font-headline italic text-lg md:text-xl mb-5"
              style={{ color: "rgba(57,30,30,0.6)" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, ease: luxuryEase }}
            >
              Not sure which products are right for you?
            </motion.p>
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

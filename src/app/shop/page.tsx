"use client";

import { useState, useMemo, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import PageHero from "@/components/sections/PageHero";
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
  const isInView = useInView(gridRef, { once: true, amount: 0.1 });

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
  const { data: heroText } = useSectionContent("section_shop_hero", {
    eyebrow: "Shop",
    headline: "Curated for You. Intentionally.",
    subtitle: "Medical-grade skincare and wellness products selected by Nurse Karlyne for real results at home.",
  });
  const { data: ctaText } = useSectionContent("section_shop_cta", {
    headline: "Questions about our products?",
    subtitle: "Nurse Karlyne personally selects every product in our collection. Book a consultation to find what's right for your skin.",
    cta_text: "Book Consultation",
    cta_href: "",
    secondary_text: "Contact Us",
    secondary_href: "/contact",
  });

  return (
    <main style={styleOverrides}>
      {isPreview && <PreviewBanner />}
      {isSectionVisible("hero") && (
        <PageHero
          eyebrow={heroText.eyebrow}
          headline={
            <>
              {heroText.headline.split(".")[0]}.{" "}
              <span className="font-extralight">
                {heroText.headline.split(".").slice(1).join(".").trim() || "Intentionally."}
              </span>
            </>
          }
          subtitle={heroText.subtitle}
        />
      )}

      {/* Category Filters */}
      {isSectionVisible("filters") && products && products.length > 0 && categories.length > 2 && (
        <section style={{ backgroundColor: "var(--color-surface-low)" }} className="py-8">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              className="flex flex-wrap gap-2 justify-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: luxuryEase, delay: 0.3 }}
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="transition-all duration-500"
                  style={{
                    padding: "0.5rem 1.25rem",
                    borderRadius: "9999px",
                    border: "1px solid",
                    borderColor: activeCategory === cat ? "var(--color-primary)" : "var(--color-outline-variant)",
                    backgroundColor: activeCategory === cat ? "var(--color-primary)" : "transparent",
                    color: activeCategory === cat ? "var(--color-on-primary)" : "var(--color-on-surface-variant)",
                    fontSize: "0.6875rem",
                    fontWeight: 500,
                    letterSpacing: "0.15em",
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

      {/* Products Grid */}
      <section
        ref={gridRef}
        className="py-32 md:py-40"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
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
              Our Collection
            </span>
            <h2
              className="headline-section text-3xl md:text-5xl mb-6"
              style={{ color: "var(--color-primary)" }}
            >
              Thoughtfully Selected
            </h2>

            {/* Ornamental divider */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="w-12 h-px" style={{ backgroundColor: "var(--color-outline-variant)" }} />
              <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: "rgba(215,207,197,0.5)" }} />
              <div className="w-12 h-px" style={{ backgroundColor: "var(--color-outline-variant)" }} />
            </div>
          </motion.div>

          {/* Grid */}
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
              <p className="font-headline italic text-3xl mb-6" style={{ color: "var(--color-primary)" }}>
                Coming Soon
              </p>
              <p className="body-editorial" style={{ color: "var(--color-on-surface-variant)", opacity: 0.8 }}>
                Our curated collection of medical-grade skincare and wellness products is being carefully selected. Each product is chosen by Nurse Karlyne for proven results.
              </p>
              <div className="flex items-center justify-center gap-3 mt-10">
                <div className="w-12 h-px" style={{ backgroundColor: "var(--color-outline-variant)" }} />
                <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: "rgba(215,207,197,0.5)" }} />
                <div className="w-12 h-px" style={{ backgroundColor: "var(--color-outline-variant)" }} />
              </div>
            </motion.div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-headline italic text-xl" style={{ color: "var(--color-on-surface-variant)", opacity: 0.6 }}>
                No products in this category yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 35 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, ease: luxuryEase, delay: i * 0.08 }}
                  className="group border transition-all duration-700 hover:shadow-[0_8px_40px_rgba(57,30,30,0.06)]"
                  style={{
                    borderColor: "rgba(215,207,197,0.35)",
                    backgroundColor: "var(--color-surface)",
                  }}
                >
                  {/* Product Image */}
                  <div
                    className="aspect-[4/5] overflow-hidden"
                    style={{ backgroundColor: "var(--color-surface-high)" }}
                  >
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="text-center">
                          <span
                            className="font-headline italic text-2xl block mb-2"
                            style={{ color: "var(--color-outline-variant)", opacity: 0.5 }}
                          >
                            {product.name.charAt(0)}
                          </span>
                          <span
                            className="label-micro"
                            style={{ color: "var(--color-outline-variant)", opacity: 0.4 }}
                          >
                            Image coming soon
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6 md:p-8">
                    <span
                      className="label-micro mb-3 block"
                      style={{ color: "var(--color-on-surface-variant)", opacity: 0.5 }}
                    >
                      {product.category}
                    </span>

                    <h3
                      className="font-headline italic text-xl md:text-2xl mb-3"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {product.name}
                    </h3>

                    <p
                      className="body-editorial text-sm mb-6 line-clamp-3"
                      style={{ color: "var(--color-on-surface-variant)", opacity: 0.75 }}
                    >
                      {product.description}
                    </p>

                    {/* Divider */}
                    <div
                      className="h-px w-full mb-5"
                      style={{ backgroundColor: "var(--color-outline-variant)", opacity: 0.3 }}
                    />

                    {/* Price + CTA */}
                    <div className="flex items-center justify-between">
                      <span
                        className="font-headline text-2xl"
                        style={{ color: "var(--color-primary)" }}
                      >
                        ${product.price.toFixed(2)}
                      </span>

                      <a
                        href={product.pabauLink || BOOKING_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link flex items-center gap-2 transition-opacity duration-500 hover:opacity-70"
                        style={{ color: "var(--color-primary)" }}
                      >
                        <span className="label-micro">
                          {product.pabauLink ? "Shop Now" : "Inquire"}
                        </span>
                        <span
                          className="inline-block h-px transition-all duration-700 group-hover/link:w-12"
                          style={{
                            width: "2rem",
                            backgroundColor: "var(--color-primary)",
                          }}
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

      {isSectionVisible("cta") && (
        <CTABanner
          dark
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

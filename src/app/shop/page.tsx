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
      {isSectionVisible("hero") && <PageHero
        eyebrow={heroText.eyebrow}
        headline={heroText.headline}
        subtitle={heroText.subtitle}
      />}

      {isSectionVisible("filters") && products && products.length > 0 && categories.length > 2 && (
        <section className="bg-[var(--color-surface-low)] py-8">
          <div className="mx-auto max-w-7xl px-6 flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`label-micro px-5 py-2.5 transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)] border-b-2 ${
                  activeCategory === cat
                    ? "bg-[var(--color-primary)] text-[var(--color-on-primary)] border-transparent"
                    : "bg-transparent text-[var(--color-on-surface-variant)] border-transparent hover:border-[var(--color-on-surface-variant)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>
      )}

      <section
        ref={gridRef}
        className="bg-[var(--color-surface)] py-24 md:py-36"
      >
        <div className="mx-auto max-w-7xl px-6">
          {!products ? (
            <div className="flex justify-center py-20">
              <div
                className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
                style={{ borderColor: "var(--color-outline-variant)" }}
              />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p
                className="font-headline italic text-2xl mb-4"
                style={{ color: "var(--color-primary)" }}
              >
                Coming Soon
              </p>
              <p
                className="body-editorial max-w-md mx-auto"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                Our curated collection of medical-grade skincare and wellness products is on its way.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.7,
                    ease: luxuryEase,
                    delay: i * 0.08,
                  }}
                  className="group"
                >
                  <div
                    className="aspect-square mb-5 overflow-hidden"
                    style={{ backgroundColor: "var(--color-surface-high)" }}
                  >
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span
                          className="label-micro"
                          style={{ color: "var(--color-outline-variant)" }}
                        >
                          No image
                        </span>
                      </div>
                    )}
                  </div>

                  <span
                    className="label-micro mb-2 block"
                    style={{ color: "var(--color-on-surface-variant)", opacity: 0.6 }}
                  >
                    {product.category}
                  </span>

                  <h3
                    className="font-headline italic text-xl mb-2"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {product.name}
                  </h3>

                  <p
                    className="body-editorial text-sm mb-4 line-clamp-2"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  >
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span
                      className="text-lg font-semibold"
                      style={{ color: "var(--color-primary)" }}
                    >
                      ${product.price.toFixed(2)}
                    </span>
                    {product.pabauLink ? (
                      <a
                        href={product.pabauLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="label-micro transition-opacity duration-500 hover:opacity-70"
                        style={{ color: "var(--color-primary)" }}
                      >
                        Shop Now &rarr;
                      </a>
                    ) : (
                      <a
                        href={BOOKING_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="label-micro transition-opacity duration-500 hover:opacity-70"
                        style={{ color: "var(--color-primary)" }}
                      >
                        Inquire &rarr;
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

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

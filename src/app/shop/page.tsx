"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { getProductImage } from "@/lib/demo-images";

const ease = [0.16, 1, 0.3, 1] as const;

const revealUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const categories = [
  "All",
  "Cleansers",
  "Serums",
  "Moisturizers",
  "SPF",
  "Treatments",
  "Kits",
];

type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

const sortLabels: Record<SortOption, string> = {
  featured: "Featured",
  "price-asc": "Price: Low \u2013 High",
  "price-desc": "Price: High \u2013 Low",
  newest: "Newest",
};

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function ShopPage() {
  const products = useQuery(api.products.list);

  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const heroRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = false;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const displayProducts = useMemo(() => {
    if (!products) return undefined;

    let filtered = products;

    if (activeCategory !== "All") {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    const sorted = [...filtered];
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        sorted.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case "featured":
      default:
        sorted.sort((a, b) => a.sortOrder - b.sortOrder);
        break;
    }

    return sorted;
  }, [products, activeCategory, debouncedSearch, sortBy]);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section
        ref={heroRef}
        className="section-warm flex flex-col items-center justify-center px-6 text-center"
        style={{
          paddingTop: "calc(var(--nav-height) + var(--space-5xl))",
          paddingBottom: "var(--space-4xl)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="editorial-spacing mb-6"
          style={{ color: "var(--color-cream)" }}
        >
          The Shop
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.15 }}
          className="headline-text mb-6"
          style={{ fontSize: "var(--text-5xl)", color: "var(--color-soft-ivory)" }}
        >
          Curated{" "}
          <span className="accent-text" style={{ color: "var(--color-accent)" }}>
            Essentials
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.3 }}
          className="mx-auto max-w-lg"
          style={{ fontSize: "var(--text-lg)", color: "rgba(237, 229, 220, 0.7)", fontWeight: 300 }}
        >
          Professional-grade skincare and wellness products, handpicked by our
          experts to extend your results at home.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease, delay: 0.45 }}
          className="accent-line mx-auto mt-8"
        />
      </section>

      {/* Toolbar: Categories / Search / Sort */}
      <section className="mx-auto max-w-[var(--max-width)] px-6 lg:px-10" style={{ paddingTop: "var(--space-3xl)" }}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.5 }}
          className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:gap-4"
        >
          <LayoutGroup>
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="editorial-spacing relative px-4 py-2 transition-colors"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: isActive ? "var(--color-accent-text)" : "var(--color-warm-taupe)",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  {cat}
                  {isActive && (
                    <motion.div
                      layoutId="shopCategoryUnderline"
                      className="absolute bottom-0 left-0 right-0"
                      style={{ height: "1.5px", backgroundColor: "var(--color-accent)" }}
                      transition={{ duration: 0.3, ease }}
                    />
                  )}
                </button>
              );
            })}
          </LayoutGroup>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.6 }}
          className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row"
        >
          <div className="relative w-full sm:max-w-xs">
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full border px-4 py-2 pl-10 outline-none transition-colors focus:border-[var(--color-accent-text)]"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-linen)",
                borderRadius: "var(--border-radius-full)",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                color: "var(--color-deep-cocoa)",
              }}
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2"
              width="16"
              height="16"
              fill="none"
              stroke="var(--color-cream)"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <span className="editorial-spacing" style={{ fontSize: "var(--text-xs)", color: "var(--color-cream)" }}>
              Sort by
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="border px-3 py-2 outline-none transition-colors focus:border-[var(--color-accent-text)]"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-linen)",
                borderRadius: "var(--border-radius-full)",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                color: "var(--color-deep-cocoa)",
                cursor: "pointer",
              }}
            >
              {(Object.entries(sortLabels) as [SortOption, string][]).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                )
              )}
            </select>
          </div>
        </motion.div>

        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease }}
            className="mb-8 px-4 py-3 text-center"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-deep-cocoa)",
              fontSize: "var(--text-sm)",
              fontFamily: "var(--font-body)",
              borderRadius: "var(--border-radius-full)",
            }}
          >
            Member pricing applied — enjoy exclusive discounts on all products.
          </motion.div>
        )}
      </section>

      {/* Product Grid */}
      <section
        className="mx-auto max-w-[var(--max-width)] px-6 lg:px-10"
        style={{
          paddingTop: "var(--space-xl)",
          paddingBottom: "var(--space-section-lg)",
        }}
      >
        {displayProducts === undefined ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="overflow-hidden" style={{ borderRadius: "var(--border-radius-lg)", backgroundColor: "var(--color-linen)" }}>
                <div className="animate-pulse" style={{ aspectRatio: "1/1", backgroundColor: "var(--color-cream)", opacity: 0.3 }} />
                <div className="space-y-2 p-5">
                  <div className="h-3 w-1/3 animate-pulse rounded" style={{ backgroundColor: "var(--color-cream)", opacity: 0.2 }} />
                  <div className="h-4 w-2/3 animate-pulse rounded" style={{ backgroundColor: "var(--color-cream)", opacity: 0.3 }} />
                  <div className="h-4 w-1/4 animate-pulse rounded" style={{ backgroundColor: "var(--color-cream)", opacity: 0.25 }} />
                  <div className="mt-3 h-9 w-full animate-pulse rounded" style={{ backgroundColor: "var(--color-cream)", opacity: 0.15 }} />
                </div>
              </div>
            ))}
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="py-20 text-center">
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-lg)", color: "var(--color-warm-taupe)", marginBottom: "0.5rem" }}>
              No products match your current filters.
            </p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setSearchInput("");
                setSortBy("featured");
              }}
              className="btn btn-outline"
              style={{ marginTop: "1rem" }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <LayoutGroup>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              layout
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {displayProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    variants={revealUp}
                    layout
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
                  >
                    <div
                      className="group flex h-full flex-col overflow-hidden hover-lift"
                      style={{
                        borderRadius: "var(--border-radius-lg)",
                        backgroundColor: "var(--color-linen)",
                        boxShadow: "var(--shadow-card)",
                      }}
                    >
                      <Link
                        href={`/shop/${product.slug}`}
                        className="hover-zoom relative block overflow-hidden"
                        style={{ aspectRatio: "1/1" }}
                      >
                        <Image
                          src={product.imageUrl || getProductImage(product.slug)}
                          alt={product.name}
                          width={500}
                          height={500}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                        {product.compareAtPrice && (
                          <span
                            className="absolute top-3 right-3 rounded-full px-3 py-1"
                            style={{
                              backgroundColor: "var(--color-accent)",
                              color: "var(--color-deep-cocoa)",
                              fontSize: "0.65rem",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              fontFamily: "var(--font-body)",
                              fontWeight: 500,
                            }}
                          >
                            Sale
                          </span>
                        )}
                      </Link>

                      <div className="flex flex-1 flex-col p-5">
                        <p className="editorial-spacing mb-1" style={{ fontSize: "0.6rem", color: "var(--color-cream)" }}>
                          {product.category}
                        </p>
                        <Link href={`/shop/${product.slug}`}>
                          <h3
                            className="headline-text mb-2 transition-colors group-hover:text-[var(--color-accent-text)]"
                            style={{ fontSize: "var(--text-base)", color: "var(--color-deep-cocoa)" }}
                          >
                            {product.name}
                          </h3>
                        </Link>

                        <div className="mb-4 flex items-center gap-2">
                          <span className="font-medium" style={{ fontSize: "var(--text-base)", color: "var(--color-deep-cocoa)" }}>
                            {formatPrice(product.price)}
                          </span>
                          {product.compareAtPrice && (
                            <span className="line-through" style={{ fontSize: "var(--text-sm)", color: "var(--color-cream)" }}>
                              {formatPrice(product.compareAtPrice)}
                            </span>
                          )}
                        </div>

                        <div className="mt-auto flex items-center gap-2">
                          <button
                            className="btn btn-primary flex-1"
                            style={{ fontSize: "var(--text-sm)", padding: "0.5rem 1rem" }}
                          >
                            Add to Cart
                          </button>
                          <Link
                            href={`/shop/${product.slug}`}
                            className="btn btn-outline"
                            style={{ fontSize: "var(--text-sm)", padding: "0.5rem 1rem" }}
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        )}
      </section>
    </main>
  );
}

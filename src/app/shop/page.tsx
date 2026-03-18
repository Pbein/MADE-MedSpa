"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { getProductImage } from "@/lib/demo-images";

/* ── Design-system tokens ─────────────────────────────────── */

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

/* ── Helpers ──────────────────────────────────────────────── */

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/* ── Component ────────────────────────────────────────────── */

export default function ShopPage() {
  const products = useQuery(api.products.list);

  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const heroRef = useRef<HTMLDivElement>(null);

  // Placeholder auth state — swap for real auth later
  const isAuthenticated = false;

  /* Debounced search (300ms) */
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  /* Derived product list */
  const displayProducts = useMemo(() => {
    if (!products) return undefined;

    let filtered = products;

    // Category filter
    if (activeCategory !== "All") {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }

    // Search filter
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sort
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
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-ivory)" }}
    >
      {/* ── Hero Section ──────────────────────────────────── */}
      <section
        ref={heroRef}
        className="flex flex-col items-center justify-center px-6 text-center"
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
          style={{ color: "var(--color-stone-dark)" }}
        >
          The Shop
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.15 }}
          className="headline-text mb-6"
          style={{
            fontSize: "var(--text-5xl)",
            color: "var(--color-chocolate)",
          }}
        >
          Curated{" "}
          <span
            className="accent-text"
            style={{ color: "var(--color-accent-text)" }}
          >
            Essentials
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.3 }}
          className="mx-auto max-w-lg"
          style={{
            fontSize: "var(--text-lg)",
            color: "var(--color-brown)",
          }}
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

      {/* ── Toolbar: Categories / Search / Sort ───────────── */}
      <section className="mx-auto max-w-[var(--max-width)] px-6 lg:px-10">
        {/* Category filter pills */}
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
                    color: isActive
                      ? "var(--color-accent-text)"
                      : "var(--color-brown)",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  {cat}
                  {isActive && (
                    <motion.div
                      layoutId="shopCategoryUnderline"
                      className="absolute bottom-0 left-0 right-0"
                      style={{
                        height: "1.5px",
                        backgroundColor: "var(--color-burgundy)",
                      }}
                      transition={{ duration: 0.3, ease }}
                    />
                  )}
                </button>
              );
            })}
          </LayoutGroup>
        </motion.div>

        {/* Search + Sort row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.6 }}
          className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row"
        >
          {/* Search input */}
          <div className="relative w-full sm:max-w-xs">
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-[var(--border-radius-sm)] border px-4 py-2 pl-10 outline-none transition-colors focus:border-[var(--color-accent-text)]"
              style={{
                borderColor: "var(--color-stone)",
                backgroundColor: "var(--color-white, #fff)",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                color: "var(--color-chocolate)",
              }}
            />
            {/* Search icon */}
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2"
              width="16"
              height="16"
              fill="none"
              stroke="var(--color-stone-dark)"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <span
              className="editorial-spacing"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-stone-dark)",
              }}
            >
              Sort by
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-[var(--border-radius-sm)] border px-3 py-2 outline-none transition-colors focus:border-[var(--color-accent-text)]"
              style={{
                borderColor: "var(--color-stone)",
                backgroundColor: "var(--color-white, #fff)",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                color: "var(--color-chocolate)",
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

        {/* Member pricing note */}
        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease }}
            className="mb-8 rounded-[var(--border-radius-sm)] px-4 py-3 text-center"
            style={{
              backgroundColor: "var(--color-burgundy)",
              color: "var(--color-ivory)",
              fontSize: "var(--text-sm)",
              fontFamily: "var(--font-body)",
            }}
          >
            Member pricing applied — enjoy exclusive discounts on all products.
          </motion.div>
        )}
      </section>

      {/* ── Product Grid ──────────────────────────────────── */}
      <section
        className="mx-auto max-w-[var(--max-width)] px-6 lg:px-10"
        style={{
          paddingTop: "var(--space-section)",
          paddingBottom: "var(--space-section)",
          backgroundColor: "var(--color-cream)",
          borderRadius: "var(--border-radius-md)",
        }}
      >
        {displayProducts === undefined ? (
          /* ── Loading skeletons ── */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-[var(--border-radius-md)] bg-[var(--color-white,#fff)]"
              >
                <div
                  className="animate-pulse"
                  style={{
                    aspectRatio: "1/1",
                    backgroundColor: "var(--color-stone)",
                    opacity: 0.3,
                  }}
                />
                <div className="space-y-2 p-5">
                  <div
                    className="h-3 w-1/3 animate-pulse rounded"
                    style={{
                      backgroundColor: "var(--color-stone)",
                      opacity: 0.2,
                    }}
                  />
                  <div
                    className="h-4 w-2/3 animate-pulse rounded"
                    style={{
                      backgroundColor: "var(--color-stone)",
                      opacity: 0.3,
                    }}
                  />
                  <div
                    className="h-4 w-1/4 animate-pulse rounded"
                    style={{
                      backgroundColor: "var(--color-stone)",
                      opacity: 0.25,
                    }}
                  />
                  <div
                    className="mt-3 h-9 w-full animate-pulse rounded"
                    style={{
                      backgroundColor: "var(--color-stone)",
                      opacity: 0.15,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : displayProducts.length === 0 ? (
          /* ── Empty state ── */
          <div className="py-20 text-center">
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-lg)",
                color: "var(--color-brown)",
                marginBottom: "0.5rem",
              }}
            >
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
          /* ── Product cards ── */
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
                      className="group flex h-full flex-col overflow-hidden rounded-[var(--border-radius-md)] bg-[var(--color-white,#fff)] hover-lift"
                      style={{
                        transition:
                          "transform var(--duration-fast) var(--ease-luxury), box-shadow var(--duration-fast) var(--ease-luxury)",
                      }}
                    >
                      {/* Image area */}
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
                        {/* Sale badge */}
                        {product.compareAtPrice && (
                          <span
                            className="absolute top-3 right-3 rounded-[var(--border-radius-sm)] px-2 py-1 text-[var(--color-ivory)]"
                            style={{
                              backgroundColor: "var(--color-burgundy)",
                              fontSize: "0.65rem",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              fontFamily: "var(--font-body)",
                            }}
                          >
                            Sale
                          </span>
                        )}
                      </Link>

                      {/* Details */}
                      <div className="flex flex-1 flex-col p-5">
                        <p
                          className="editorial-spacing mb-1 text-[var(--color-stone-dark)]"
                          style={{ fontSize: "0.6rem" }}
                        >
                          {product.category}
                        </p>
                        <Link href={`/shop/${product.slug}`}>
                          <h3
                            className="headline-text mb-2 transition-colors group-hover:text-[var(--color-accent-text)]"
                            style={{
                              fontSize: "var(--text-base)",
                              color: "var(--color-chocolate)",
                            }}
                          >
                            {product.name}
                          </h3>
                        </Link>

                        {/* Price */}
                        <div className="mb-4 flex items-center gap-2">
                          <span
                            className="font-medium text-[var(--color-chocolate)]"
                            style={{ fontSize: "var(--text-base)" }}
                          >
                            {formatPrice(product.price)}
                          </span>
                          {product.compareAtPrice && (
                            <span
                              className="text-[var(--color-stone-dark)] line-through"
                              style={{ fontSize: "var(--text-sm)" }}
                            >
                              {formatPrice(product.compareAtPrice)}
                            </span>
                          )}
                        </div>

                        {/* Actions — pushed to bottom */}
                        <div className="mt-auto flex items-center gap-2">
                          <button
                            className="btn btn-accent flex-1"
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

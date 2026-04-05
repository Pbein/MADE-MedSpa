"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { getProductImage } from "@/lib/demo-images";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: luxuryEase },
  },
};

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function FeaturedProducts() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const products = useQuery(api.products.listFeatured);

  return (
    <section
      ref={ref}
      style={{
        backgroundColor: "var(--color-soft-ivory)",
        paddingTop: "var(--space-section-lg)",
        paddingBottom: "var(--space-section-lg)",
      }}
    >
      <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: luxuryEase }}
          className="mb-16 text-center"
        >
          <span
            className="editorial-spacing mb-4 block"
            style={{ color: "var(--color-cream)" }}
          >
            The Shop
          </span>
          <h2
            className="headline-text mb-4"
            style={{
              fontSize: "var(--text-4xl)",
              color: "var(--color-deep-cocoa)",
            }}
          >
            Curated{" "}
            <span className="accent-text" style={{ color: "var(--color-accent-text)" }}>
              Essentials
            </span>
          </h2>
          <p
            className="mx-auto max-w-md"
            style={{
              fontSize: "var(--text-base)",
              color: "var(--color-warm-taupe)",
              fontWeight: 300,
            }}
          >
            Professional-grade skincare and wellness products, handpicked by
            our experts to extend your results at home.
          </p>
        </motion.div>

        {/* Products grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {products
            ? products.slice(0, 4).map((product) => (
                <motion.div key={product._id} variants={cardVariants}>
                  <Link
                    href={`/shop/${product.slug}`}
                    className="group block overflow-hidden rounded-[var(--border-radius-lg)] hover-lift"
                    style={{
                      backgroundColor: "var(--color-linen)",
                      boxShadow: "var(--shadow-card)",
                    }}
                  >
                    {/* Image */}
                    <div
                      className="hover-zoom relative overflow-hidden"
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
                    </div>

                    {/* Details */}
                    <div className="p-5">
                      <p
                        className="editorial-spacing mb-1"
                        style={{ fontSize: "0.6rem", color: "var(--color-cream)" }}
                      >
                        {product.category}
                      </p>
                      <h3
                        className="headline-text mb-2 transition-colors group-hover:text-[var(--color-accent-text)]"
                        style={{
                          fontSize: "var(--text-base)",
                          color: "var(--color-deep-cocoa)",
                        }}
                      >
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span
                          className="font-medium"
                          style={{
                            fontSize: "var(--text-base)",
                            color: "var(--color-deep-cocoa)",
                          }}
                        >
                          {formatPrice(product.price)}
                        </span>
                        {product.compareAtPrice && (
                          <span
                            className="line-through"
                            style={{
                              fontSize: "var(--text-sm)",
                              color: "var(--color-cream)",
                            }}
                          >
                            {formatPrice(product.compareAtPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            : /* Loading skeleton */
              Array.from({ length: 4 }).map((_, i) => (
                <motion.div key={i} variants={cardVariants}>
                  <div
                    className="overflow-hidden rounded-[var(--border-radius-lg)]"
                    style={{ backgroundColor: "var(--color-linen)" }}
                  >
                    <div
                      className="animate-pulse"
                      style={{
                        aspectRatio: "1/1",
                        backgroundColor: "var(--color-cream)",
                        opacity: 0.3,
                      }}
                    />
                    <div className="space-y-2 p-5">
                      <div className="h-3 w-1/3 animate-pulse rounded" style={{ backgroundColor: "var(--color-cream)", opacity: 0.2 }} />
                      <div className="h-4 w-2/3 animate-pulse rounded" style={{ backgroundColor: "var(--color-cream)", opacity: 0.3 }} />
                      <div className="h-4 w-1/4 animate-pulse rounded" style={{ backgroundColor: "var(--color-cream)", opacity: 0.25 }} />
                    </div>
                  </div>
                </motion.div>
              ))}
        </motion.div>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6, ease: luxuryEase }}
          className="mt-16 text-center"
        >
          <Link href="/shop" className="btn btn-outline">
            Browse All Products
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

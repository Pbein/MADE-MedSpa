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
      className="relative"
      style={{
        backgroundColor: "var(--color-cream)",
        padding: "clamp(4rem, 3rem + 5vw, 8rem) 0",
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
          <span className="editorial-spacing mb-4 block text-[var(--color-stone-dark)]">
            The Shop
          </span>
          <h2
            className="headline-text mb-4"
            style={{
              fontSize: "var(--text-4xl)",
              color: "var(--color-chocolate)",
            }}
          >
            Curated{" "}
            <span className="accent-text text-[var(--color-accent-text)]">
              Essentials
            </span>
          </h2>
          <p
            className="mx-auto max-w-md text-[var(--color-brown)]"
            style={{ fontSize: "var(--text-base)" }}
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
                    className="group block overflow-hidden rounded-[var(--border-radius-md)] bg-[var(--color-white)] hover-lift"
                    style={{
                      transition:
                        "transform var(--duration-fast) var(--ease-luxury), box-shadow var(--duration-fast) var(--ease-luxury)",
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
                    </div>

                    {/* Details */}
                    <div className="p-5">
                      <p
                        className="editorial-spacing mb-1 text-[var(--color-stone-dark)]"
                        style={{ fontSize: "0.6rem" }}
                      >
                        {product.category}
                      </p>
                      <h3
                        className="headline-text mb-2 transition-colors group-hover:text-[var(--color-accent-text)]"
                        style={{
                          fontSize: "var(--text-base)",
                          color: "var(--color-chocolate)",
                        }}
                      >
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2">
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
                    </div>
                  </Link>
                </motion.div>
              ))
            : /* Loading skeleton */
              Array.from({ length: 4 }).map((_, i) => (
                <motion.div key={i} variants={cardVariants}>
                  <div className="overflow-hidden rounded-[var(--border-radius-md)] bg-[var(--color-white)]">
                    <div
                      className="animate-pulse bg-[var(--color-stone)]/30"
                      style={{ aspectRatio: "1/1" }}
                    />
                    <div className="space-y-2 p-5">
                      <div className="h-3 w-1/3 animate-pulse rounded bg-[var(--color-stone)]/20" />
                      <div className="h-4 w-2/3 animate-pulse rounded bg-[var(--color-stone)]/30" />
                      <div className="h-4 w-1/4 animate-pulse rounded bg-[var(--color-stone)]/25" />
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
          className="mt-14 text-center"
        >
          <Link href="/shop" className="btn btn-outline">
            Browse All Products
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

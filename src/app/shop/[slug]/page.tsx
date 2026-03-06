"use client";

import { use, useState } from "react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getProductImage } from "@/lib/demo-images";

/* ── Framer Motion helpers ─────────────────────────── */
const ease = [0.16, 1, 0.3, 1] as const;

const revealUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

const revealLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease } },
};

const revealRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ── Helpers ───────────────────────────────────────── */
function formatPrice(cents: number) {
  return "$" + (cents / 100).toFixed(2);
}

/* ── Accordion Section ─────────────────────────────── */
function AccordionSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        borderBottom: "1px solid var(--color-stone)",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left"
        style={{ color: "var(--color-chocolate)" }}
      >
        <span
          className="headline-text"
          style={{ fontSize: "var(--text-lg)" }}
        >
          {title}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease }}
          style={{
            fontSize: "var(--text-2xl)",
            lineHeight: 1,
            color: "var(--color-burgundy)",
          }}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="pb-6 leading-relaxed text-[var(--color-brown)]"
              style={{ fontSize: "var(--text-base)" }}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Page Component ────────────────────────────────── */
export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const product = useQuery(api.products.getBySlug, { slug });
  const relatedProducts = useQuery(
    api.products.listByCategory,
    product ? { category: product.category } : "skip"
  );

  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  /* Loading state */
  if (product === undefined) {
    return (
      <section
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "var(--color-ivory)" }}
      >
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="editorial-spacing text-[var(--color-stone-dark)]"
        >
          Loading...
        </motion.div>
      </section>
    );
  }

  /* Not found state */
  if (product === null) {
    return (
      <section
        className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
        style={{ backgroundColor: "var(--color-ivory)" }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1
            variants={revealUp}
            className="headline-text mb-4"
            style={{
              fontSize: "var(--text-4xl)",
              color: "var(--color-chocolate)",
            }}
          >
            Product Not Found
          </motion.h1>
          <motion.p
            variants={revealUp}
            className="mb-8 leading-relaxed text-[var(--color-brown)]"
            style={{ fontSize: "var(--text-lg)" }}
          >
            The product you&rsquo;re looking for doesn&rsquo;t exist or has been
            removed.
          </motion.p>
          <motion.div variants={revealUp}>
            <Link href="/shop" className="btn btn-primary">
              Back to Shop
            </Link>
          </motion.div>
        </motion.div>
      </section>
    );
  }

  const isOutOfStock = product.inventory <= 0;
  const isLowStock = product.inventory > 0 && product.inventory < 5;

  const filteredRelated = relatedProducts
    ?.filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  function handleAddToCart() {
    if (isOutOfStock) return;
    // TODO: integrate with cart context/store when available
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  }

  return (
    <>
      {/* ═══════════════ BREADCRUMBS ═══════════════ */}
      <section
        className="px-6 lg:px-10"
        style={{
          backgroundColor: "var(--color-ivory)",
          paddingTop: "calc(var(--nav-height) + var(--space-lg))",
          paddingBottom: "var(--space-md)",
        }}
      >
        <div className="mx-auto max-w-[var(--max-width)]">
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease }}
            className="flex items-center gap-2 text-[var(--color-stone-dark)]"
            style={{ fontSize: "var(--text-sm)" }}
          >
            <Link
              href="/"
              className="transition-colors hover:text-[var(--color-burgundy)]"
            >
              Home
            </Link>
            <span style={{ color: "var(--color-stone)" }}>/</span>
            <Link
              href="/shop"
              className="transition-colors hover:text-[var(--color-burgundy)]"
            >
              Shop
            </Link>
            <span style={{ color: "var(--color-stone)" }}>/</span>
            <span style={{ color: "var(--color-chocolate)" }}>
              {product.name}
            </span>
          </motion.nav>
        </div>
      </section>

      {/* ═══════════════ PRODUCT SECTION ═══════════════ */}
      <section
        className="px-6 lg:px-10"
        style={{
          backgroundColor: "var(--color-ivory)",
          paddingTop: "var(--space-md)",
          paddingBottom: "var(--space-section)",
        }}
      >
        <div className="mx-auto grid max-w-[var(--max-width)] items-start gap-12 lg:grid-cols-2 lg:gap-20">
          {/* ── Left: Product Image ── */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={revealLeft}
            className="image-editorial image-warm overflow-hidden"
            style={{
              borderRadius: "var(--border-radius-sm)",
              aspectRatio: "4/5",
              position: "sticky",
              top: "calc(var(--nav-height) + var(--space-lg))",
            }}
          >
            <Image
              src={product.imageUrl || getProductImage(product.slug)}
              alt={product.name}
              width={800}
              height={1000}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-full w-full object-cover"
              priority
            />
          </motion.div>

          {/* ── Right: Product Details ── */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Category badge */}
            <motion.div
              variants={revealRight}
              className="editorial-spacing mb-4 text-[var(--color-stone-dark)]"
            >
              {product.category}
            </motion.div>

            {/* Product name */}
            <motion.h1
              variants={revealRight}
              className="headline-text mb-6"
              style={{
                fontSize: "var(--text-4xl)",
                color: "var(--color-chocolate)",
              }}
            >
              {product.name}
            </motion.h1>

            {/* Price display */}
            <motion.div
              variants={revealRight}
              className="mb-6 flex items-baseline gap-3"
            >
              <span
                className="headline-text"
                style={{
                  fontSize: "var(--text-2xl)",
                  color: "var(--color-burgundy)",
                }}
              >
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span
                  style={{
                    fontSize: "var(--text-lg)",
                    color: "var(--color-stone-dark)",
                    textDecoration: "line-through",
                  }}
                >
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </motion.div>

            {/* Short description */}
            <motion.p
              variants={revealRight}
              className="mb-6 leading-relaxed text-[var(--color-brown)]"
              style={{ fontSize: "var(--text-base)" }}
            >
              {product.shortDescription}
            </motion.p>

            {/* Stock status */}
            <motion.div variants={revealRight} className="mb-6">
              {isOutOfStock ? (
                <span
                  className="inline-flex items-center gap-2"
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "#b91c1c",
                    fontWeight: 500,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#b91c1c",
                      display: "inline-block",
                    }}
                  />
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span
                  className="inline-flex items-center gap-2"
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "#b45309",
                    fontWeight: 500,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#b45309",
                      display: "inline-block",
                    }}
                  />
                  Low Stock &mdash; Only {product.inventory} left
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-2"
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "#15803d",
                    fontWeight: 500,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#15803d",
                      display: "inline-block",
                    }}
                  />
                  In Stock
                </span>
              )}
            </motion.div>

            {/* Quantity selector */}
            <motion.div
              variants={revealRight}
              className="mb-6 flex items-center gap-4"
            >
              <span
                className="text-[var(--color-brown)]"
                style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}
              >
                Quantity
              </span>
              <div
                className="flex items-center"
                style={{
                  border: "1px solid var(--color-stone)",
                  borderRadius: "var(--border-radius-sm)",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={isOutOfStock}
                  className="flex items-center justify-center transition-colors hover:bg-[var(--color-cream)]"
                  style={{
                    width: 44,
                    height: 44,
                    fontSize: "var(--text-lg)",
                    color: "var(--color-chocolate)",
                    cursor: isOutOfStock ? "not-allowed" : "pointer",
                    opacity: isOutOfStock ? 0.4 : 1,
                  }}
                >
                  &minus;
                </button>
                <span
                  className="flex items-center justify-center"
                  style={{
                    width: 52,
                    height: 44,
                    fontSize: "var(--text-base)",
                    color: "var(--color-chocolate)",
                    fontWeight: 500,
                    borderLeft: "1px solid var(--color-stone)",
                    borderRight: "1px solid var(--color-stone)",
                  }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) =>
                      Math.min(product.inventory, q + 1)
                    )
                  }
                  disabled={isOutOfStock}
                  className="flex items-center justify-center transition-colors hover:bg-[var(--color-cream)]"
                  style={{
                    width: 44,
                    height: 44,
                    fontSize: "var(--text-lg)",
                    color: "var(--color-chocolate)",
                    cursor: isOutOfStock ? "not-allowed" : "pointer",
                    opacity: isOutOfStock ? 0.4 : 1,
                  }}
                >
                  +
                </button>
              </div>
            </motion.div>

            {/* Add to Cart button */}
            <motion.div variants={revealRight} className="mb-10">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="btn btn-primary w-full"
                style={{
                  opacity: isOutOfStock ? 0.5 : 1,
                  cursor: isOutOfStock ? "not-allowed" : "pointer",
                  position: "relative",
                }}
              >
                <AnimatePresence mode="wait">
                  {addedFeedback ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      Added!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>

            {/* ── Product Details Accordion ── */}
            <motion.div
              variants={revealRight}
              style={{
                borderTop: "1px solid var(--color-stone)",
              }}
            >
              <AccordionSection title="Full Description" defaultOpen>
                {product.fullDescription.split("\n\n").map((paragraph, i) => (
                  <p key={i} className={i > 0 ? "mt-4" : ""}>
                    {paragraph}
                  </p>
                ))}
              </AccordionSection>

              <AccordionSection title="Ingredients">
                <p>
                  Detailed ingredient information for this product will be
                  available soon. For specific ingredient inquiries, please{" "}
                  <Link
                    href="/contact"
                    className="underline transition-colors hover:text-[var(--color-burgundy)]"
                  >
                    contact us
                  </Link>
                  .
                </p>
              </AccordionSection>

              <AccordionSection title="How to Use">
                <p>
                  Application instructions and recommended usage guidelines will
                  be provided with your purchase. For personalized skincare
                  advice, we recommend{" "}
                  <Link
                    href="/booking"
                    className="underline transition-colors hover:text-[var(--color-burgundy)]"
                  >
                    booking a consultation
                  </Link>{" "}
                  with our aesthetic experts.
                </p>
              </AccordionSection>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ RELATED PRODUCTS ═══════════════ */}
      {filteredRelated && filteredRelated.length > 0 && (
        <section
          className="px-6 lg:px-10"
          style={{
            backgroundColor: "var(--color-cream)",
            paddingTop: "var(--space-section)",
            paddingBottom: "var(--space-section)",
          }}
        >
          <div className="mx-auto max-w-[var(--max-width)]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="mb-12 text-center"
            >
              <motion.div
                variants={revealUp}
                className="editorial-spacing mb-4 text-[var(--color-stone-dark)]"
              >
                You May Also Like
              </motion.div>
              <motion.h2
                variants={revealUp}
                className="headline-text"
                style={{
                  fontSize: "var(--text-3xl)",
                  color: "var(--color-chocolate)",
                }}
              >
                Related <span className="accent-text">Products</span>
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
            >
              {filteredRelated.map((relProduct) => (
                <motion.div key={relProduct._id} variants={revealUp}>
                  <Link
                    href={`/shop/${relProduct.slug}`}
                    className="hover-lift group block"
                    style={{
                      backgroundColor: "var(--color-ivory)",
                      borderRadius: "var(--border-radius-sm)",
                      overflow: "hidden",
                    }}
                  >
                    {/* Product image */}
                    <div
                      className="overflow-hidden"
                      style={{ aspectRatio: "4/5" }}
                    >
                      <Image
                        src={relProduct.imageUrl || getProductImage(relProduct.slug)}
                        alt={relProduct.name}
                        width={500}
                        height={625}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                        loading="lazy"
                      />
                    </div>

                    {/* Card content */}
                    <div
                      style={{
                        padding: "var(--space-md) var(--space-md) var(--space-lg)",
                      }}
                    >
                      <div
                        className="editorial-spacing mb-2 text-[var(--color-stone-dark)]"
                        style={{ fontSize: "10px" }}
                      >
                        {relProduct.category}
                      </div>
                      <h3
                        className="headline-text mb-2 transition-colors group-hover:text-[var(--color-burgundy)]"
                        style={{
                          fontSize: "var(--text-lg)",
                          color: "var(--color-chocolate)",
                        }}
                      >
                        {relProduct.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span
                          style={{
                            fontSize: "var(--text-base)",
                            color: "var(--color-burgundy)",
                            fontWeight: 500,
                          }}
                        >
                          {formatPrice(relProduct.price)}
                        </span>
                        {relProduct.compareAtPrice &&
                          relProduct.compareAtPrice > relProduct.price && (
                            <span
                              style={{
                                fontSize: "var(--text-sm)",
                                color: "var(--color-stone-dark)",
                                textDecoration: "line-through",
                              }}
                            >
                              {formatPrice(relProduct.compareAtPrice)}
                            </span>
                          )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════ CTA SECTION ═══════════════ */}
      <section
        className="section-dark px-6 text-center lg:px-10"
        style={{
          paddingTop: "var(--space-section)",
          paddingBottom: "var(--space-section)",
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mx-auto max-w-2xl"
        >
          <motion.div
            variants={revealUp}
            className="accent-line mx-auto mb-8"
          />

          <motion.h2
            variants={revealUp}
            className="headline-text mb-6"
            style={{ fontSize: "var(--text-3xl)" }}
          >
            Need help <span className="accent-text">choosing</span>?
          </motion.h2>

          <motion.p
            variants={revealUp}
            className="mx-auto mb-10 max-w-lg leading-relaxed text-[var(--color-stone)]"
            style={{ fontSize: "var(--text-lg)" }}
          >
            Our aesthetic experts are here to help you find the perfect products
            for your skincare routine. Book a consultation or reach out to us
            directly.
          </motion.p>

          <motion.div
            variants={revealUp}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/booking" className="btn btn-primary">
              Book a Consultation
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Contact Us
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

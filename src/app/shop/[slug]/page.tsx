"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import CTABanner from "@/components/sections/CTABanner";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

const BOOKING_URL =
  process.env.NEXT_PUBLIC_PABAU_BOOKING_URL ||
  "https://partner.pabau.com/online-bookings/made-med-spa";

export default function ShopProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const product = useQuery(api.shopProducts.getBySlugOrId, { slugOrId: slug });

  // Loading state — Convex query returns undefined while loading, null when not found.
  if (product === undefined) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
          style={{ borderColor: "var(--color-outline-variant)" }}
        />
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <p
          className="label-micro mb-4"
          style={{ color: "var(--color-soft-taupe)" }}
        >
          Not found
        </p>
        <h1
          className="headline-editorial text-3xl md:text-5xl mb-6"
          style={{ color: "var(--color-espresso)" }}
        >
          We couldn&rsquo;t find that product.
        </h1>
        <Link href="/shop" className="link-editorial text-sm">
          Back to shop
        </Link>
      </div>
    );
  }

  const ctaText = product.pabauLink ? "Shop on Pabau" : "Inquire to Purchase";
  const ctaHref = product.pabauLink || BOOKING_URL;

  return (
    <div className="min-h-screen text-[var(--color-espresso)]">
      <div
        className="relative overflow-hidden"
        style={{
          backgroundImage: "url('/images/shop-atmosphere-bg.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#f0e8e1",
        }}
      >
        {/* Breadcrumb / back */}
        <div className="px-6 md:px-12 pt-32 md:pt-40">
          <div className="mx-auto max-w-[1180px]">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-[11px] uppercase text-[var(--color-soft-taupe)] transition-opacity duration-300 hover:opacity-70"
              style={{ letterSpacing: "0.14em" }}
            >
              <span aria-hidden>←</span>
              <span>Back to shop</span>
            </Link>
          </div>
        </div>

        {/* Product hero */}
        <section className="px-6 md:px-12 pt-8 pb-20 md:pb-28">
          <div className="mx-auto max-w-[1180px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-20 items-start">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: luxuryEase }}
                className="relative w-full aspect-square overflow-hidden"
                style={{
                  background:
                    "linear-gradient(180deg, #f7f1ea 0%, #efe7df 100%)",
                  border: "1px solid var(--border-soft)",
                  borderRadius: "0.875rem",
                  boxShadow: "var(--shadow-made-soft)",
                }}
              >
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 540px"
                    priority
                    className="object-contain"
                    style={{ padding: "10%" }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span
                      className="font-headline text-7xl"
                      style={{ color: "var(--color-soft-taupe)", opacity: 0.2 }}
                    >
                      {product.name.charAt(0)}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: luxuryEase, delay: 0.1 }}
                className="flex flex-col"
              >
                <p
                  className="label-micro mb-5"
                  style={{ color: "var(--color-soft-taupe)" }}
                >
                  {product.category}
                </p>

                <h1
                  className="font-headline text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] text-[var(--color-espresso)]"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {product.name}
                </h1>

                <p
                  className="font-headline text-[2rem] md:text-[2.5rem] leading-none mt-6 text-[var(--color-espresso)]"
                >
                  ${product.price.toFixed(0)}
                </p>

                <div
                  className="mt-8 mb-8 h-px w-full"
                  style={{ backgroundColor: "var(--border-soft)" }}
                />

                {/* Full description — wraps freely, no truncation. Splits on
                    blank lines so admin can write multi-paragraph copy. */}
                <div className="space-y-4">
                  {product.description.split(/\n\s*\n/).map((paragraph, i) => (
                    <p
                      key={i}
                      className="body-editorial text-[15px] md:text-base"
                      style={{ color: "var(--color-soft-taupe)" }}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <a
                    href={ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ padding: "1rem 2.25rem" }}
                  >
                    {ctaText}
                  </a>
                  <Link
                    href="/booking#pabau-iframe"
                    className="link-editorial text-sm self-center sm:self-auto"
                  >
                    Book a skincare consult instead
                  </Link>
                </div>

                {!product.pabauLink && (
                  <p
                    className="mt-6 text-xs"
                    style={{ color: "var(--color-soft-taupe)", opacity: 0.7 }}
                  >
                    Available in-clinic. Reach out and we&rsquo;ll set you up.
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      {/* Soft consult nudge */}
      <section
        className="py-14 px-6"
        style={{ backgroundColor: "var(--color-powder)" }}
      >
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="accent-quote text-lg md:text-xl mb-5"
            style={{ color: "var(--color-soft-taupe)" }}
          >
            Not sure if this is right for you?
          </p>
          <Link href="/booking#pabau-iframe" className="link-editorial text-sm">
            Book a skincare consultation
          </Link>
        </div>
      </section>

      <CTABanner
        headline="Curated, not pushed."
        subtitle="Every product we stock has been used in our treatments first. If you have questions, we have answers."
        ctaText="Contact us"
        ctaHref="/contact"
        secondaryText="Browse all products"
        secondaryHref="/shop"
      />
    </div>
  );
}

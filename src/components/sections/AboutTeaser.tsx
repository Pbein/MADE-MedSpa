"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { demoImages } from "@/lib/demo-images";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

export default function AboutTeaser() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      ref={ref}
      style={{
        backgroundColor: "var(--color-linen)",
        paddingTop: "var(--space-section-lg)",
        paddingBottom: "var(--space-section-lg)",
      }}
    >
      <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-10">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: luxuryEase }}
          >
            <span
              className="editorial-spacing mb-4 block"
              style={{ color: "var(--color-cream)" }}
            >
              Our Philosophy
            </span>
            <h2
              className="headline-text mb-6"
              style={{
                fontSize: "var(--text-4xl)",
                color: "var(--color-deep-cocoa)",
              }}
            >
              Where{" "}
              <span className="accent-text" style={{ color: "var(--color-accent-text)" }}>
                Science
              </span>{" "}
              Meets Artistry
            </h2>
            <div
              className="mb-8"
              style={{
                width: "60px",
                height: "1px",
                backgroundColor: "var(--color-accent)",
              }}
            />
            <p
              className="mb-6 leading-relaxed"
              style={{
                fontSize: "var(--text-base)",
                color: "var(--color-warm-taupe)",
                fontWeight: 300,
              }}
            >
              At MADE, we believe beauty is deeply personal. Our approach
              combines advanced medical aesthetics with an artist&apos;s eye
              for balance, proportion, and harmony — ensuring every treatment
              enhances what makes you uniquely you.
            </p>
            <p
              className="mb-10 leading-relaxed"
              style={{
                fontSize: "var(--text-base)",
                color: "var(--color-warm-taupe)",
                fontWeight: 300,
              }}
            >
              Founded on the principle that confidence is transformative,
              our team of experienced practitioners creates bespoke treatment
              plans that honor your natural features while delivering
              results that inspire.
            </p>
            <Link href="/about" className="btn btn-outline">
              <span>Our Story</span>
              <span className="arrow">&rarr;</span>
            </Link>
          </motion.div>

          {/* Right: Image — overlapping container for depth */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: luxuryEase }}
            className="relative"
          >
            <div
              className="image-warm overflow-hidden rounded-[var(--border-radius-lg)]"
              style={{ aspectRatio: "3/4" }}
            >
              <Image
                src={demoImages.home.aboutTeaser}
                alt="MADE Med Spa luxury interior"
                width={960}
                height={1280}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Decorative offset border for layered depth */}
            <div
              className="absolute -right-4 -bottom-4 -z-10 rounded-[var(--border-radius-lg)]"
              style={{
                width: "100%",
                height: "100%",
                border: "1px solid var(--color-border)",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

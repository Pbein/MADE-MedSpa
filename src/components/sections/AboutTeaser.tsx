"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

const ABOUT_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCu4gezTy1QmXn1cFEJ_TK4kJr1EqC5oL6dcR56gIkqFEHjZsLCf26ZuS-T6xhPCq7Kf4r5GNkFllqrZoao9EAZxk2esZtp3kvQV0BlWVkCJKVHCJLYijB10EXvZH5ODAIbYYwRcCcX2L1z7rRpvxNRCshWbwfjQ-uI4MWDgS6oMwY7gKXTbnBw1vED2aT05XmuKkyEmwAJBz2WUBpW3lkxkeb_1LkeGN_pRxTGGXe1rOJbVAFv_lGZUvo-KedpGtLDdUiWDjXnTwri";

export default function AboutTeaser() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      ref={ref}
      className="py-40 px-12 md:px-24 bg-[var(--color-surface)] grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative"
    >
      {/* Left: Text card on surface-low */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.9, ease: luxuryEase }}
        className="md:col-span-6 relative z-10"
      >
        <div
          className="bg-[var(--color-surface-low)] p-12 md:p-24"
          style={{ boxShadow: "var(--shadow-elevated)" }}
        >
          <span className="label-micro text-[var(--color-secondary)] block mb-6">
            Our Philosophy
          </span>

          <h2 className="headline-section text-4xl mb-8 leading-tight">
            Where Science Meets
            <br />
            Artistry.
          </h2>

          <p className="body-editorial text-[var(--color-on-surface-variant)] max-w-md">
            At MADE, we believe beauty is deeply personal. Our approach combines
            advanced medical aesthetics with an artist&apos;s eye for balance,
            proportion, and harmony — ensuring every treatment enhances what
            makes you uniquely you.
          </p>

          <div className="mt-12">
            <Link href="/about" className="link-editorial">
              Discover Our Method
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Right: Large image with decorative blur */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.2, ease: luxuryEase }}
        className="md:col-span-7 md:col-start-6 relative z-0"
      >
        <img
          src={ABOUT_IMAGE}
          alt="MADE Med Spa philosophy"
          className="w-full aspect-[4/5] object-cover image-editorial-strong"
        />
        {/* Decorative blur element */}
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[var(--color-tertiary-fixed)] opacity-20 blur-3xl rounded-full" />
      </motion.div>
    </section>
  );
}

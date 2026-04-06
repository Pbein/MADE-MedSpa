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
    <section ref={ref} className="section-alt">
      <div className="container-page">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: luxuryEase }}
          >
            <span className="eyebrow-muted mb-4 block" style={{ color: "var(--color-mocha)" }}>
              Our Philosophy
            </span>
            <h2 className="headline-section mb-6" style={{ color: "var(--color-ink)" }}>
              Where Science Meets Artistry
            </h2>
            <div className="accent-line mb-8" style={{ backgroundColor: "var(--color-matcha)" }} />
            <p
              className="body-lg mb-6"
              style={{ color: "var(--color-olive)" }}
            >
              At MADE, we believe beauty is deeply personal. Our approach
              combines advanced medical aesthetics with an artist&apos;s eye
              for balance, proportion, and harmony — ensuring every treatment
              enhances what makes you uniquely you.
            </p>
            <p
              className="body-lg mb-10"
              style={{ color: "var(--color-olive)" }}
            >
              Founded on the principle that confidence is transformative,
              our team of experienced practitioners creates bespoke treatment
              plans that honor your natural features while delivering
              results that inspire.
            </p>
            <Link href="/about" className="btn-secondary">
              Our Story &rarr;
            </Link>
          </motion.div>

          {/* Right: Image with decorative border offset */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: luxuryEase }}
            className="relative"
          >
            <div
              className="overflow-hidden rounded-2xl"
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

            {/* Decorative offset border */}
            <div
              className="absolute -right-4 -bottom-4 -z-10 rounded-2xl"
              style={{
                width: "100%",
                height: "100%",
                border: "1px solid var(--color-line)",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

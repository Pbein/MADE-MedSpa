"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const luxuryEase = [0.16, 1, 0.3, 1] as const;
const viewportOnce = { once: true, margin: "-80px" } as const;

const DEFAULT_ABOUT_IMAGE =
  "https://placehold.co/800x1000/4a2c17/f5f0e8?text=Our+Philosophy";

interface AboutTeaserProps {
  aboutImageUrl?: string;
}

export default function AboutTeaser({ aboutImageUrl }: AboutTeaserProps) {
  const imageSrc = aboutImageUrl || DEFAULT_ABOUT_IMAGE;

  return (
    <section className="py-32 md:py-40 px-8 md:px-16 lg:px-24 bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
        {/* Left: Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.9, ease: luxuryEase }}
          className="md:col-span-6 relative"
        >
          <div className="relative w-full aspect-[4/5]" style={{ boxShadow: "8px 8px 40px rgba(57,30,30,0.08)" }}>
            <Image
              src={imageSrc}
              alt="MADE Med Spa philosophy"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          {/* Decorative warm blur */}
          <div
            className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full pointer-events-none"
            style={{
              background: "rgba(215,207,197,0.15)",
              filter: "blur(60px)",
            }}
          />
        </motion.div>

        {/* Right: Text card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.9, delay: 0.15, ease: luxuryEase }}
          className="md:col-span-6"
        >
          <div
            className="bg-[var(--color-surface-low)] p-6 sm:p-10 md:p-16 lg:p-20"
            style={{ boxShadow: "0 4px 30px rgba(57,30,30,0.05)" }}
          >
            <span className="label-micro text-[var(--color-secondary)] block mb-6">
              Our Philosophy
            </span>

            <h2 className="headline-section text-3xl md:text-4xl mb-8 leading-tight">
              Where Science Meets
              <br />
              Artistry.
            </h2>

            <p className="body-editorial text-[var(--color-on-surface-variant)] max-w-md">
              At MADE, we believe beauty is deeply personal. Our approach combines
              advanced medical aesthetics with an artist&apos;s eye for balance,
              proportion, and harmony. Ensuring every treatment enhances what
              makes you uniquely you.
            </p>

            <div className="mt-12">
              <Link href="/about" className="link-editorial">
                Discover Our Method
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

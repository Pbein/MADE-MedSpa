"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface ServiceData {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  category: string;
  priceRange?: string;
  imageUrl?: string;
}

interface ServiceCardProps {
  service: ServiceData;
}

const luxuryEase = [0.16, 1, 0.3, 1] as const;

// Stitch services-flow card (2026-05-30): rounded 4:5 editorial photo, then
// text below — a Matcha category micro-label, a Playfair treatment name, a
// one-line description, price, and a Matcha hover arrow. The greens are the
// brand accent (label + arrow), matching the home services grid.
export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
      transition={{ duration: 0.7, ease: luxuryEase }}
      className="group"
    >
      <Link href={`/services/${service.slug}`} className="block">
        {/* Image */}
        <div
          className="overflow-hidden relative aspect-[4/5] rounded-[12px]"
          style={{ backgroundColor: "var(--color-surface-high)" }}
        >
          {service.imageUrl ? (
            <Image
              src={service.imageUrl}
              alt={service.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.2,0,0,1)]"
            />
          ) : (
            // No photo yet — show a uniform glaze block with a faint MADE
            // wordmark so the card still reads as an intentional 4:5 tile
            // (the old SVG placeholder blended into the page background).
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                aria-hidden
                style={{
                  fontFamily: "var(--font-headline)",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  letterSpacing: "0.06em",
                  color: "rgba(57,30,30,0.18)",
                }}
              >
                MADE
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="pt-6">
          {/* Category micro-label — Matcha accent */}
          <span
            className="block mb-3 uppercase"
            style={{
              fontFamily: "var(--font-label)",
              fontSize: "11px",
              letterSpacing: "0.25em",
              color: "var(--color-matcha)",
            }}
          >
            {service.category}
          </span>

          {/* Title — Playfair, sentence case */}
          <h3
            className="headline-editorial text-2xl mb-3"
            style={{ color: "var(--color-primary)" }}
          >
            {service.name}
          </h3>

          {/* Description */}
          <p
            className="font-body text-sm leading-relaxed mb-5"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            {service.shortDescription}
          </p>

          {/* Price + Matcha hover arrow */}
          <div className="flex items-center justify-between">
            {service.priceRange ? (
              <span
                className="uppercase"
                style={{
                  fontFamily: "var(--font-label)",
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  color: "var(--color-on-surface-variant)",
                }}
              >
                {service.priceRange}
              </span>
            ) : (
              <span />
            )}
            <span
              className="text-xl group-hover:translate-x-2 transition-transform duration-500"
              style={{ color: "var(--color-matcha)" }}
            >
              &rarr;
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

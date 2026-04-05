"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { getServiceImage } from "@/lib/demo-images";

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

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
      transition={{ duration: 0.6, ease: luxuryEase }}
    >
      <Link
        href={`/services/${service.slug}`}
        className="service-card group block"
      >
        {/* Image */}
        <div className="image-container hover-zoom relative">
          <Image
            src={service.imageUrl || getServiceImage(service.slug, "card")}
            alt={service.name}
            width={600}
            height={800}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="content">
          <span
            className="editorial-spacing mb-3 inline-block"
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-accent-text)",
            }}
          >
            {service.category}
          </span>

          <h3
            className="headline-text mb-2"
            style={{
              fontSize: "var(--text-xl)",
              color: "var(--color-deep-cocoa)",
              lineHeight: 1.3,
            }}
          >
            {service.name}
          </h3>

          <p
            className="mb-4"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              color: "var(--color-warm-taupe)",
              lineHeight: 1.6,
              fontWeight: 300,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {service.shortDescription}
          </p>

          {service.priceRange && (
            <p
              className="mb-4"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                color: "var(--color-cream)",
                fontWeight: 400,
              }}
            >
              {service.priceRange}
            </p>
          )}

          <span
            className="btn-text"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              color: "var(--color-deep-cocoa)",
            }}
          >
            Learn More{" "}
            <span
              className="arrow inline-block transition-transform duration-300"
              style={{ marginLeft: "0.25rem" }}
            >
              &rarr;
            </span>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

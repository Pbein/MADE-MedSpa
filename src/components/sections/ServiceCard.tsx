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
        className="card-luxury group block"
      >
        {/* Image */}
        <div
          className="hover-zoom relative overflow-hidden"
          style={{ aspectRatio: "3 / 4" }}
        >
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
        <div className="p-5">
          <span className="eyebrow mb-3 inline-block" style={{ color: "var(--color-blush)" }}>
            {service.category}
          </span>

          <h3
            className="mb-2"
            style={{
              fontFamily: "var(--font-display, 'Playfair Display', serif)",
              fontSize: "1.25rem",
              color: "var(--color-ink)",
              lineHeight: 1.3,
              fontWeight: 500,
            }}
          >
            {service.name}
          </h3>

          <p
            className="body-md mb-4"
            style={{
              color: "var(--color-olive)",
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
                fontSize: "0.875rem",
                color: "var(--color-mocha)",
                fontWeight: 500,
              }}
            >
              {service.priceRange}
            </p>
          )}

          <span className="link-accent">
            Learn More &rarr;
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

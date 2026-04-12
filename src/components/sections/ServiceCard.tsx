"use client";

import Link from "next/link";
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

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
      transition={{ duration: 0.6, ease: luxuryEase }}
      className="group bg-[var(--color-surface)] hover:bg-[#fcfbf4] transition-colors duration-700"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <Link href={`/services/${service.slug}`} className="block">
        {/* Image */}
        <div className="overflow-hidden">
          <img
            src={service.imageUrl || "https://placehold.co/600x450/4a2c17/f5f0e8?text=Service"}
            alt={service.name}
            className="w-full aspect-[4/3] object-cover image-editorial-light group-hover:scale-105 transition-transform duration-1000"
          />
        </div>

        {/* Content */}
        <div className="p-8 md:p-10">
          {/* Category label */}
          <span className="label-micro text-[var(--color-secondary)] block mb-4">
            {service.category}
          </span>

          {/* Title */}
          <h3 className="font-headline text-2xl italic mb-4 text-[var(--color-primary)]">
            {service.name}
          </h3>

          {/* Description */}
          <p className="font-body text-sm leading-loose text-[var(--color-on-surface-variant)] opacity-80 mb-6">
            {service.shortDescription}
          </p>

          {/* Price range */}
          {service.priceRange && (
            <p className="label-micro text-[var(--color-on-surface-variant)] mb-6">
              {service.priceRange}
            </p>
          )}

          {/* Arrow CTA */}
          <span className="inline-block text-[var(--color-outline)] text-2xl group-hover:translate-x-4 transition-transform duration-700">
            &rarr;
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

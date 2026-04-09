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
    >
      <Link href={`/services/${service.slug}`}>
        {/* Image */}
        <div>
          <img src="/placeholder.svg" alt={service.name} />
        </div>

        {/* Content */}
        <div>
          <span>{service.category}</span>

          <h3>{service.name}</h3>

          <p>{service.shortDescription}</p>

          {service.priceRange && (
            <p>{service.priceRange}</p>
          )}

          <span>Learn More &rarr;</span>
        </div>
      </Link>
    </motion.div>
  );
}

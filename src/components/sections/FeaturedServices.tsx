"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { getServiceImage } from "@/lib/demo-images";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: luxuryEase },
  },
};

export default function FeaturedServices() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const services = useQuery(api.services.list);

  // Show up to 3 services
  const featured = services?.slice(0, 3);

  return (
    <section
      ref={ref}
      className="relative"
      style={{
        backgroundColor: "var(--color-cream)",
        padding: "clamp(4rem, 3rem + 5vw, 8rem) 0",
      }}
    >
      <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: luxuryEase }}
          className="mb-16 text-center"
        >
          <span className="editorial-spacing mb-4 block text-[var(--color-stone-dark)]">
            Our Expertise
          </span>
          <h2
            className="headline-text mb-4"
            style={{
              fontSize: "var(--text-4xl)",
              color: "var(--color-chocolate)",
            }}
          >
            Signature{" "}
            <span className="accent-text text-[var(--color-accent-text)]">
              Treatments
            </span>
          </h2>
          <p
            className="mx-auto max-w-md text-[var(--color-brown)]"
            style={{ fontSize: "var(--text-base)" }}
          >
            Curated services designed to enhance, restore, and reveal your
            most confident self.
          </p>
        </motion.div>

        {/* Services grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {featured
            ? featured.map((service) => (
                <motion.div key={service._id} variants={cardVariants}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="service-card group block rounded-[var(--border-radius-md)] hover-lift"
                  >
                    {/* Image */}
                    <div className="image-container relative">
                      <Image
                        src={service.imageUrl || getServiceImage(service.slug, "card")}
                        alt={service.name}
                        width={600}
                        height={800}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      {/* Category badge */}
                      <span
                        className="editorial-spacing absolute top-4 left-4 rounded-[var(--border-radius-sm)] bg-[var(--color-ivory)]/90 px-3 py-1.5 text-[var(--color-chocolate)] backdrop-blur-sm"
                        style={{ fontSize: "0.6rem" }}
                      >
                        {service.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="content">
                      <h3
                        className="headline-text mb-2"
                        style={{
                          fontSize: "var(--text-xl)",
                          color: "var(--color-chocolate)",
                        }}
                      >
                        {service.name}
                      </h3>
                      <p
                        className="mb-4 text-[var(--color-brown)]"
                        style={{
                          fontSize: "var(--text-sm)",
                          lineHeight: 1.6,
                        }}
                      >
                        {service.shortDescription}
                      </p>
                      <span className="btn-text text-[var(--color-accent-text)]">
                        <span
                          className="editorial-spacing"
                          style={{ fontSize: "0.65rem" }}
                        >
                          Learn More
                        </span>
                        <span className="arrow">&rarr;</span>
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))
            : /* Loading skeleton */
              Array.from({ length: 3 }).map((_, i) => (
                <motion.div key={i} variants={cardVariants}>
                  <div className="service-card rounded-[var(--border-radius-md)]">
                    <div className="image-container animate-pulse bg-[var(--color-stone)]/50" />
                    <div className="content space-y-3">
                      <div className="h-5 w-2/3 animate-pulse rounded bg-[var(--color-stone)]/30" />
                      <div className="h-3 w-full animate-pulse rounded bg-[var(--color-stone)]/20" />
                      <div className="h-3 w-4/5 animate-pulse rounded bg-[var(--color-stone)]/20" />
                    </div>
                  </div>
                </motion.div>
              ))}
        </motion.div>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8, ease: luxuryEase }}
          className="mt-14 text-center"
        >
          <Link href="/services" className="btn btn-outline">
            View All Services
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { getServiceImage } from "@/lib/demo-images";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

export default function FeaturedServices() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const services = useQuery(api.services.list);

  const featured = services?.slice(0, 3);

  return (
    <section
      ref={ref}
      style={{
        backgroundColor: "var(--color-soft-ivory)",
        paddingTop: "var(--space-section-lg)",
        paddingBottom: "var(--space-section-lg)",
      }}
    >
      <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: luxuryEase }}
          className="mb-20 max-w-xl"
        >
          <span
            className="editorial-spacing mb-4 block"
            style={{ color: "var(--color-cream)" }}
          >
            Signature Treatments
          </span>
          <h2
            className="headline-text mb-5"
            style={{
              fontSize: "var(--text-4xl)",
              color: "var(--color-deep-cocoa)",
            }}
          >
            Curated{" "}
            <span className="accent-text" style={{ color: "var(--color-accent-text)" }}>
              Services
            </span>
          </h2>
          <p
            style={{
              fontSize: "var(--text-base)",
              color: "var(--color-warm-taupe)",
              maxWidth: "420px",
            }}
          >
            Every treatment is a collaboration between science, artistry, and you.
          </p>
        </motion.div>

        {/* Editorial Layout: 1 large + 2 small stacked */}
        {featured ? (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-10">
            {/* Large featured card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: luxuryEase }}
            >
              <Link
                href={`/services/${featured[0]?.slug}`}
                className="group block overflow-hidden rounded-[var(--border-radius-lg)]"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                  <Image
                    src={featured[0]?.imageUrl || getServiceImage(featured[0]?.slug, "card")}
                    alt={featured[0]?.name || ""}
                    width={800}
                    height={1066}
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="h-full w-full object-cover transition-transform duration-700"
                    style={{ transitionTimingFunction: "var(--ease-luxury)" }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(45,30,23,0.6)] via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <span
                      className="editorial-spacing mb-3 block"
                      style={{ color: "var(--color-accent-light)", fontSize: "0.6rem" }}
                    >
                      {featured[0]?.category}
                    </span>
                    <h3
                      className="headline-text mb-2"
                      style={{
                        fontSize: "var(--text-3xl)",
                        color: "var(--color-soft-ivory)",
                      }}
                    >
                      {featured[0]?.name}
                    </h3>
                    <p
                      className="max-w-sm leading-relaxed"
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "rgba(237, 229, 220, 0.7)",
                      }}
                    >
                      {featured[0]?.shortDescription}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Two smaller cards stacked */}
            <div className="flex flex-col gap-8">
              {featured.slice(1, 3).map((service, i) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.9,
                    delay: 0.15 + i * 0.15,
                    ease: luxuryEase,
                  }}
                >
                  <Link
                    href={`/services/${service.slug}`}
                    className="service-card group flex flex-col overflow-hidden sm:flex-row"
                    style={{ borderRadius: "var(--border-radius-lg)" }}
                  >
                    <div
                      className="hover-zoom relative shrink-0 overflow-hidden sm:w-2/5"
                      style={{ aspectRatio: "1/1" }}
                    >
                      <Image
                        src={service.imageUrl || getServiceImage(service.slug, "card")}
                        alt={service.name}
                        width={400}
                        height={400}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 40vw, 20vw"
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-center p-6 lg:p-8">
                      <span
                        className="editorial-spacing mb-2 block"
                        style={{ color: "var(--color-accent-text)", fontSize: "0.6rem" }}
                      >
                        {service.category}
                      </span>
                      <h3
                        className="headline-text mb-2"
                        style={{
                          fontSize: "var(--text-xl)",
                          color: "var(--color-deep-cocoa)",
                        }}
                      >
                        {service.name}
                      </h3>
                      <p
                        className="mb-4 leading-relaxed"
                        style={{
                          fontSize: "var(--text-sm)",
                          color: "var(--color-warm-taupe)",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {service.shortDescription}
                      </p>
                      <span className="btn-text" style={{ color: "var(--color-accent-text)" }}>
                        <span className="editorial-spacing" style={{ fontSize: "0.65rem" }}>
                          Learn More
                        </span>
                        <span className="arrow">&rarr;</span>
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* Loading skeleton */
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div
              className="animate-pulse rounded-[var(--border-radius-lg)]"
              style={{ aspectRatio: "3/4", backgroundColor: "var(--color-linen)" }}
            />
            <div className="flex flex-col gap-8">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-[var(--border-radius-lg)]"
                  style={{ height: "200px", backgroundColor: "var(--color-linen)" }}
                />
              ))}
            </div>
          </div>
        )}

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8, ease: luxuryEase }}
          className="mt-16 text-center"
        >
          <Link href="/services" className="btn btn-outline">
            View All Services
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

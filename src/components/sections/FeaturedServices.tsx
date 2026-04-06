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
    <section ref={ref} className="section-light">
      <div className="container-page">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: luxuryEase }}
          className="mb-20 max-w-xl"
        >
          <span className="eyebrow mb-4 block" style={{ color: "var(--color-blush)" }}>
            Signature Treatments
          </span>
          <h2 className="headline-section mb-5" style={{ color: "var(--color-ink)" }}>
            Curated Services
          </h2>
          <p className="body-md" style={{ color: "var(--color-olive)", maxWidth: "420px" }}>
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
                className="hover-zoom group block overflow-hidden rounded-2xl"
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                  <Image
                    src={featured[0]?.imageUrl || getServiceImage(featured[0]?.slug, "card")}
                    alt={featured[0]?.name || ""}
                    width={800}
                    height={1066}
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="h-full w-full object-cover transition-transform duration-700"
                    loading="lazy"
                  />
                  {/* Dark overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(57,30,30,0.5) 0%, transparent 60%)",
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <span
                      className="eyebrow mb-3 block"
                      style={{ color: "rgba(247,246,235,0.7)", fontSize: "0.6rem" }}
                    >
                      {featured[0]?.category}
                    </span>
                    <h3
                      className="headline-section mb-2"
                      style={{
                        fontSize: "clamp(1.5rem, 1.2rem + 1.5vw, 2rem)",
                        color: "var(--color-glaze)",
                      }}
                    >
                      {featured[0]?.name}
                    </h3>
                    <p
                      className="body-md max-w-sm"
                      style={{ color: "rgba(247,246,235,0.7)" }}
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
                    className="card-luxury hover-lift group flex flex-col overflow-hidden sm:flex-row"
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
                        className="eyebrow mb-2 block"
                        style={{ color: "var(--color-blush)", fontSize: "0.6rem" }}
                      >
                        {service.category}
                      </span>
                      <h3
                        className="mb-2"
                        style={{
                          fontFamily: "var(--font-headline)",
                          fontSize: "clamp(1.1rem, 1rem + 0.5vw, 1.35rem)",
                          color: "var(--color-ink)",
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
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {service.shortDescription}
                      </p>
                      <span className="link-accent">
                        Learn More &rarr;
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
              className="animate-pulse rounded-2xl"
              style={{ aspectRatio: "3/4", backgroundColor: "var(--color-silk)" }}
            />
            <div className="flex flex-col gap-8">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl"
                  style={{ height: "200px", backgroundColor: "var(--color-silk)" }}
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
          <Link href="/services" className="link-accent">
            View All Services &rarr;
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

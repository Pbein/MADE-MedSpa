"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { motion } from "framer-motion";
import Accordion from "@/components/ui/Accordion";
import ServiceCard from "@/components/sections/ServiceCard";
import { getServiceImage } from "@/lib/demo-images";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: luxuryEase, delay },
  }),
};

export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const service = useQuery(api.services.getBySlug, { slug });
  const allServices = useQuery(api.services.list);

  const bookingUrl = process.env.NEXT_PUBLIC_PABAU_BOOKING_URL || "/booking";

  // Related services: same category, different slug
  const relatedServices =
    allServices
      ?.filter((s) => s.category === service?.category && s.slug !== slug)
      .slice(0, 3) ?? [];

  // Loading state
  if (service === undefined) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: "var(--color-glaze)" }}>
        <div
          className="flex min-h-screen items-center justify-center"
          style={{ paddingTop: "var(--nav-height)" }}
        >
          <span
            className="eyebrow"
            style={{ color: "var(--color-mocha)" }}
          >
            Loading...
          </span>
        </div>
      </main>
    );
  }

  // Not found state
  if (service === null) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: "var(--color-glaze)" }}>
        <div
          className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center"
          style={{ paddingTop: "var(--nav-height)" }}
        >
          <h1 className="headline-display">
            Service Not Found
          </h1>
          <p
            className="body-lg"
            style={{ color: "var(--color-mocha)" }}
          >
            The service you are looking for does not exist or has been removed.
          </p>
          <Link href="/services" className="btn-primary">
            View All Services
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--color-glaze)" }}>
      {/* Breadcrumb — Glaze */}
      <section
        className="section-light"
        style={{
          paddingTop: "calc(var(--nav-height) + clamp(1rem, 0.5rem + 2vw, 2rem))",
          paddingBottom: "0",
        }}
      >
        <div className="container-page">
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: luxuryEase }}
            className="mb-8 flex flex-wrap items-center gap-2"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--color-mocha)",
            }}
          >
            <Link
              href="/"
              className="transition-colors"
              style={{ color: "var(--color-mocha)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-blush)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-mocha)")}
            >
              Home
            </Link>
            <span style={{ color: "var(--color-line)" }}>/</span>
            <Link
              href="/services"
              className="transition-colors"
              style={{ color: "var(--color-mocha)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-blush)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-mocha)")}
            >
              Services
            </Link>
            <span style={{ color: "var(--color-line)" }}>/</span>
            <span style={{ color: "var(--color-ink)" }}>
              {service.name}
            </span>
          </motion.nav>
        </div>
      </section>

      {/* Hero + Content — Glaze */}
      <section className="section-light" style={{ paddingTop: "0" }}>
        <div className="container-page">
          {/* Category eyebrow */}
          <motion.span
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="eyebrow mb-4 block"
          >
            {service.category}
          </motion.span>

          {/* Service name */}
          <motion.h1
            custom={0.1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="headline-display mb-6"
            style={{ maxWidth: "800px" }}
          >
            {service.name}
          </motion.h1>

          {/* Accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: luxuryEase, delay: 0.3 }}
            style={{ transformOrigin: "left" }}
            className="accent-line mb-12"
          />

          {/* Two-column: description + image */}
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
            <motion.div
              custom={0.2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <p
                className="body-lg"
                style={{
                  color: "var(--color-mocha)",
                  lineHeight: 1.8,
                  whiteSpace: "pre-line",
                }}
              >
                {service.fullDescription}
              </p>
            </motion.div>

            <motion.div
              custom={0.35}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="image-warm overflow-hidden"
              style={{
                borderRadius: "var(--radius-lg, 1rem)",
                aspectRatio: "3/4",
              }}
            >
              <Image
                src={service.imageUrl || getServiceImage(slug, "hero")}
                alt={service.name}
                width={960}
                height={1280}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-full w-full object-cover"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Info Bar — Silk */}
      {(service.duration || service.priceRange) && (
        <section className="section-alt">
          <div className="container-page flex flex-wrap items-center justify-center gap-12">
            {service.duration && (
              <motion.div
                custom={0.3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center text-center"
              >
                <span
                  className="eyebrow-muted mb-2 block"
                  style={{ fontSize: "0.7rem" }}
                >
                  Duration
                </span>
                <span
                  className="headline-section"
                  style={{ color: "var(--color-ink)" }}
                >
                  {service.duration}
                </span>
              </motion.div>
            )}

            {service.duration && service.priceRange && (
              <div
                className="hidden h-12 sm:block"
                style={{
                  width: "1px",
                  backgroundColor: "var(--color-line)",
                }}
              />
            )}

            {service.priceRange && (
              <motion.div
                custom={0.4}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center text-center"
              >
                <span
                  className="eyebrow-muted mb-2 block"
                  style={{ fontSize: "0.7rem" }}
                >
                  Price Range
                </span>
                <span
                  className="headline-section"
                  style={{ color: "var(--color-ink)" }}
                >
                  {service.priceRange}
                </span>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* FAQs — Glaze */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="section-light">
          <div className="container-page mx-auto max-w-3xl">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="mb-10 text-center"
            >
              <span className="eyebrow mb-4 block">
                Common Questions
              </span>
              <h2 className="headline-section">
                Frequently Asked
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: luxuryEase, delay: 0.15 }}
            >
              <Accordion items={service.faqs} />
            </motion.div>
          </div>
        </section>
      )}

      {/* Book CTA — Espresso */}
      <section className="section-dark text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: luxuryEase }}
          className="container-page"
        >
          <span
            className="eyebrow mb-4 block"
            style={{ color: "var(--color-mocha)" }}
          >
            Ready to Begin?
          </span>
          <h2
            className="headline-section mx-auto mb-8 max-w-lg"
            style={{ color: "var(--color-glaze)" }}
          >
            Book This Service
          </h2>
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Book Now
          </a>
        </motion.div>
      </section>

      {/* Related Services — Silk */}
      {relatedServices.length > 0 && (
        <section className="section-alt">
          <div className="container-page">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: luxuryEase }}
              className="mb-12 text-center"
            >
              <span className="eyebrow mb-4 block">
                Explore More
              </span>
              <h2 className="headline-section">
                Related Services
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedServices.map((s) => (
                <ServiceCard key={s._id} service={s} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

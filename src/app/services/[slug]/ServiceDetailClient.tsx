"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { motion } from "framer-motion";
import Accordion from "@/components/ui/Accordion";
import ServiceCard from "@/components/sections/ServiceCard";
import { hasNavigatedWithinApp } from "@/lib/navigation";

const editorialEase = [0.2, 0, 0, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: editorialEase, delay },
  }),
};

export default function ServiceDetailClient({ slug }: { slug: string }) {
  const service = useQuery(api.services.getBySlug, { slug });
  const allServices = useQuery(api.services.list);

  const bookingUrl = process.env.NEXT_PUBLIC_PABAU_BOOKING_URL || "/booking";
  const skipAnimation = hasNavigatedWithinApp();

  // Related services: same category, different slug
  const relatedServices =
    allServices
      ?.filter((s) => s.category === service?.category && s.slug !== slug)
      .slice(0, 3) ?? [];

  // Loading state
  if (service === undefined) {
    return (
      <main className="bg-[var(--color-surface)] min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <span className="label-micro text-[var(--color-on-surface-variant)]">Loading...</span>
        </div>
      </main>
    );
  }

  // Not found state
  if (service === null) {
    return (
      <main className="bg-[var(--color-surface)] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="headline-editorial">Service Not Found</h1>
          <p className="body-editorial mt-4 text-[var(--color-on-surface-variant)]">
            The service you are looking for does not exist or has been removed.
          </p>
          <Link href="/services" className="btn-primary inline-block mt-10">
            View All Services
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      {/* Breadcrumb */}
      <section className="bg-[var(--color-surface)] pt-32 pb-4">
        <div className="mx-auto max-w-7xl px-6">
          <motion.nav
            className="flex items-center gap-2 label-micro"
            initial={skipAnimation ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: editorialEase }}
          >
            <Link href="/" className="link-ghost">Home</Link>
            <span className="text-[var(--color-on-surface-variant)]">/</span>
            <Link href="/services" className="link-ghost">Services</Link>
            <span className="text-[var(--color-on-surface-variant)]">/</span>
            <span className="text-[var(--color-on-surface)]">{service.name}</span>
          </motion.nav>
        </div>
      </section>

      {/* Hero + Content: 12-col grid */}
      <section className="bg-[var(--color-surface)] py-20">
        <div className="mx-auto max-w-7xl px-6">
          {/* Category eyebrow */}
          <motion.span
            className="label-micro block mb-4"
            custom={0}
            variants={fadeUp}
            initial={skipAnimation ? "visible" : "hidden"}
            animate="visible"
          >
            {service.category}
          </motion.span>

          {/* Service name */}
          <motion.h1
            className="headline-section"
            custom={0.1}
            variants={fadeUp}
            initial={skipAnimation ? "visible" : "hidden"}
            animate="visible"
          >
            {service.name}
          </motion.h1>

          {/* Accent line */}
          <motion.div
            className="mt-8 mb-16 h-px w-20 bg-[var(--color-on-surface)] origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, ease: editorialEase, delay: 0.3 }}
          />

          {/* Two-column: description + image */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <motion.div
              className="lg:col-span-7"
              custom={0.2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <p className="body-editorial text-[var(--color-on-surface-variant)] leading-relaxed">
                {service.fullDescription}
              </p>
            </motion.div>

            <motion.div
              className="lg:col-span-5"
              custom={0.35}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={service.imageUrl || "https://placehold.co/640x800/4a2c17/f5f0e8?text=Service+Image"}
                  alt={service.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover image-editorial"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Info Bar */}
      {(service.duration || service.priceRange) && (
        <section className="bg-[var(--color-surface-low)] py-16">
          <div className="mx-auto max-w-7xl px-6 flex items-center justify-center gap-16 text-center">
            {service.duration && (
              <motion.div
                custom={0.3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                <span className="label-micro block mb-2">Duration</span>
                <span className="headline-section">{service.duration}</span>
              </motion.div>
            )}

            {service.duration && service.priceRange && (
              <div className="w-px h-12 bg-[var(--color-outline-variant)]" />
            )}

            {service.priceRange && (
              <motion.div
                custom={0.4}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                <span className="label-micro block mb-2">Price Range</span>
                <span className="headline-section">{service.priceRange}</span>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* FAQs */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="bg-[var(--color-surface)] py-40">
          <div className="mx-auto max-w-3xl px-6">
            <motion.div
              className="text-center mb-16"
              custom={0}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <span className="label-micro block mb-4">Common Questions</span>
              <h2 className="headline-section">Frequently Asked</h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: editorialEase, delay: 0.15 }}
            >
              <Accordion items={service.faqs} />
            </motion.div>
          </div>
        </section>
      )}

      {/* Book CTA */}
      <section className="bg-[var(--color-primary)] py-40">
        <motion.div
          className="mx-auto max-w-7xl px-6 text-center"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: editorialEase }}
        >
          <span className="label-micro block mb-6 text-[var(--color-on-primary)] opacity-60">
            Ready to Begin?
          </span>
          <h2 className="headline-section text-[var(--color-on-primary)]">
            Book This Service
          </h2>
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-light inline-block mt-10"
          >
            Book Now
          </a>
        </motion.div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="bg-[var(--color-surface-low)] py-40">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: editorialEase }}
            >
              <span className="label-micro block mb-4">Explore More</span>
              <h2 className="headline-section">Related Services</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

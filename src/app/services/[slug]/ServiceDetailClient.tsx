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
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: editorialEase, delay },
  }),
};

export default function ServiceDetailClient({ slug }: { slug: string }) {
  const service = useQuery(api.services.getBySlug, { slug });
  const allServices = useQuery(api.services.list);

  const bookingUrl =
    service?.pabauBookingUrl ||
    process.env.NEXT_PUBLIC_PABAU_BOOKING_URL ||
    "/booking";
  const skipAnimation = hasNavigatedWithinApp();

  const relatedServices =
    allServices
      ?.filter((s) => s.category === service?.category && s.slug !== slug)
      .slice(0, 3) ?? [];

  if (service === undefined) {
    return (
      <div className="bg-[var(--color-surface)] min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <span className="label-micro text-[var(--color-on-surface-variant)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (service === null) {
    return (
      <div className="bg-[var(--color-surface)] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="headline-editorial">Service Not Found</h1>
          <p className="body-editorial mt-4 text-[var(--color-on-surface-variant)]">
            The service you are looking for does not exist or has been removed.
          </p>
          <Link href="/services" className="btn-primary inline-block mt-10">
            View All Services
          </Link>
        </div>
      </div>
    );
  }

  const hasBenefits = service.benefits && service.benefits.length > 0;
  const hasWhoItsFor = !!service.whoItsFor?.trim();
  const hasWhatToExpect =
    service.whatToExpect && service.whatToExpect.length > 0;
  const hasFaqs = service.faqs && service.faqs.length > 0;
  const hasPreCare = !!service.preCareNotes?.trim();
  const hasPostCare = !!service.postCareNotes?.trim();

  const procedureSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: service.name,
    description: service.shortDescription,
    category: service.category,
    image: service.imageUrl || undefined,
    procedureType: "Cosmetic",
    bodyLocation: service.category,
    performer: {
      "@type": "MedicalBusiness",
      name: "MADE Med Spa",
      url: "https://mademedspa.com",
    },
    ...(service.priceRange
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "USD",
            priceSpecification: { "@type": "PriceSpecification", price: service.priceRange },
            url: `https://mademedspa.com/services/${slug}`,
          },
        }
      : {}),
  };

  return (
    <div className="pb-24 lg:pb-0">
      {/* JSON-LD: MedicalProcedure */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(procedureSchema) }}
      />

      {/* ===== HERO =====
          pt-32 md:pt-40 clears the fixed nav (project standard — matches
          /shop/[slug] and /contact). Bottom padding is tight so the next
          section feels like a natural continuation, not a void. */}
      <section className="bg-[var(--color-surface)] pt-32 md:pt-40 pb-14 lg:pb-20">
        <div className="mx-auto max-w-7xl px-6">
          {/* Breadcrumb */}
          <motion.nav
            className="flex items-center gap-2 label-micro mb-8 lg:mb-10"
            initial={skipAnimation ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: editorialEase }}
          >
            <Link href="/" className="link-ghost">
              Home
            </Link>
            <span className="text-[var(--color-on-surface-variant)]">/</span>
            <Link href="/services" className="link-ghost">
              Services
            </Link>
            <span className="text-[var(--color-on-surface-variant)]">/</span>
            <span className="text-[var(--color-on-surface)]">
              {service.name}
            </span>
          </motion.nav>

          {/* items-start (not center) so the headline sits at the top of the
              grid rather than drifting down to vertically center on a tall
              image — keeps the hero compact on laptop viewports. */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Left: text + facts + CTA */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <motion.span
                className="label-micro block mb-3"
                custom={0}
                variants={fadeUp}
                initial={skipAnimation ? "visible" : "hidden"}
                animate="visible"
              >
                {service.category}
              </motion.span>

              <motion.h1
                className="headline-section"
                custom={0.05}
                variants={fadeUp}
                initial={skipAnimation ? "visible" : "hidden"}
                animate="visible"
              >
                {service.name}
              </motion.h1>

              <motion.div
                className="mt-5 mb-6 h-px w-16 bg-[var(--color-on-surface)] origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, ease: editorialEase, delay: 0.15 }}
              />

              <motion.p
                className="body-editorial text-[var(--color-on-surface-variant)] leading-relaxed max-w-xl mb-8"
                custom={0.2}
                variants={fadeUp}
                initial={skipAnimation ? "visible" : "hidden"}
                animate="visible"
              >
                {service.shortDescription}
              </motion.p>

              {/* Facts row */}
              {(service.duration || service.priceRange || service.downtime) && (
                <motion.dl
                  className="grid grid-cols-3 max-w-md gap-4 sm:gap-8 mb-8 border-y border-[var(--color-outline-variant)] py-5"
                  custom={0.3}
                  variants={fadeUp}
                  initial={skipAnimation ? "visible" : "hidden"}
                  animate="visible"
                >
                  {service.duration && (
                    <div>
                      <dt className="label-micro mb-1 text-[var(--color-on-surface-variant)]">
                        Duration
                      </dt>
                      <dd className="font-headline text-base sm:text-lg text-[var(--color-on-surface)]">
                        {service.duration}
                      </dd>
                    </div>
                  )}
                  {service.priceRange && (
                    <div>
                      <dt className="label-micro mb-1 text-[var(--color-on-surface-variant)]">
                        Investment
                      </dt>
                      <dd className="font-headline text-base sm:text-lg text-[var(--color-on-surface)]">
                        {service.priceRange}
                      </dd>
                    </div>
                  )}
                  {service.downtime && (
                    <div>
                      <dt className="label-micro mb-1 text-[var(--color-on-surface-variant)]">
                        Downtime
                      </dt>
                      <dd className="font-headline text-base sm:text-lg text-[var(--color-on-surface)]">
                        {service.downtime}
                      </dd>
                    </div>
                  )}
                </motion.dl>
              )}

              {/* CTA */}
              <motion.div
                className="flex flex-wrap items-center gap-6"
                custom={0.4}
                variants={fadeUp}
                initial={skipAnimation ? "visible" : "hidden"}
                animate="visible"
              >
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Book Now
                </a>
                <Link
                  href="/contact"
                  className="link-editorial text-[var(--color-on-surface)]"
                >
                  Ask a Question
                </Link>
              </motion.div>
            </div>

            {/* Right: image — capped so the hero comfortably fits on a 900px
                laptop viewport (nav 120 + breadcrumb 40 + content ≈ 480). */}
            <motion.div
              className="lg:col-span-5 order-1 lg:order-2 w-full"
              initial={skipAnimation ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: editorialEase, delay: 0.1 }}
            >
              <div className="relative w-full max-w-[460px] mx-auto lg:max-w-none aspect-[4/5] lg:aspect-auto lg:h-[clamp(380px,58vh,520px)]">
                <Image
                  src={service.imageUrl || "/images/placeholder-service.svg"}
                  alt={service.name}
                  fill
                  sizes="(max-width: 1024px) 80vw, 40vw"
                  className="object-cover image-editorial"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== OVERVIEW (full description) ===== */}
      {service.fullDescription && service.fullDescription !== service.shortDescription && (
        <section className="bg-[var(--color-surface-low)] pt-12 pb-20 lg:pt-20 lg:pb-28">
          <div className="mx-auto max-w-3xl px-6">
            <motion.span
              className="label-micro block mb-4 text-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: editorialEase }}
            >
              Overview
            </motion.span>
            <motion.h2
              className="headline-section text-center mb-10"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: editorialEase, delay: 0.05 }}
            >
              About this treatment
            </motion.h2>
            <motion.p
              className="body-editorial text-[var(--color-on-surface-variant)] leading-relaxed whitespace-pre-line"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: editorialEase, delay: 0.15 }}
            >
              {service.fullDescription}
            </motion.p>
          </div>
        </section>
      )}

      {/* ===== BENEFITS + WHO IT'S FOR ===== */}
      {(hasBenefits || hasWhoItsFor) && (
        <section className="bg-[var(--color-surface)] py-20 lg:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {hasBenefits && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, ease: editorialEase }}
                >
                  <span className="label-micro block mb-4">Benefits</span>
                  <h2 className="headline-section mb-8">What you'll love</h2>
                  <ul className="space-y-4">
                    {service.benefits!.map((benefit, i) => (
                      <li
                        key={i}
                        className="flex gap-4 body-editorial text-[var(--color-on-surface-variant)]"
                      >
                        <span
                          aria-hidden
                          className="mt-2 inline-block h-[6px] w-[6px] rounded-full bg-[var(--color-secondary)] flex-shrink-0"
                        />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {hasWhoItsFor && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, ease: editorialEase, delay: 0.1 }}
                >
                  <span className="label-micro block mb-4">Ideal for</span>
                  <h2 className="headline-section mb-8">Is this for me?</h2>
                  <p className="body-editorial text-[var(--color-on-surface-variant)] leading-relaxed whitespace-pre-line">
                    {service.whoItsFor}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ===== WHAT TO EXPECT ===== */}
      {hasWhatToExpect && (
        <section className="bg-[var(--color-surface-low)] py-20 lg:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: editorialEase }}
            >
              <span className="label-micro block mb-4">Your Experience</span>
              <h2 className="headline-section">What to expect</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {service.whatToExpect!.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.5,
                    ease: editorialEase,
                    delay: 0.05 * i,
                  }}
                >
                  <div className="label-micro text-[var(--color-secondary)] mb-3">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-headline text-xl mb-3 text-[var(--color-on-surface)]">
                    {step.title}
                  </h3>
                  <p className="body-editorial text-[var(--color-on-surface-variant)] leading-relaxed text-sm">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== PRE / POST CARE ===== */}
      {(hasPreCare || hasPostCare) && (
        <section className="bg-[var(--color-surface)] py-20 lg:py-28">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {hasPreCare && (
                <motion.div
                  className="p-8 lg:p-10 bg-[var(--color-surface-lowest)] border border-[var(--color-outline-variant)] rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, ease: editorialEase }}
                >
                  <span className="label-micro block mb-3 text-[var(--color-secondary)]">
                    Before your visit
                  </span>
                  <h3 className="font-headline text-2xl mb-5 text-[var(--color-on-surface)]">
                    Pre-care
                  </h3>
                  <p className="body-editorial text-[var(--color-on-surface-variant)] leading-relaxed whitespace-pre-line text-sm">
                    {service.preCareNotes}
                  </p>
                </motion.div>
              )}
              {hasPostCare && (
                <motion.div
                  className="p-8 lg:p-10 bg-[var(--color-surface-lowest)] border border-[var(--color-outline-variant)] rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, ease: editorialEase, delay: 0.1 }}
                >
                  <span className="label-micro block mb-3 text-[var(--color-secondary)]">
                    After your visit
                  </span>
                  <h3 className="font-headline text-2xl mb-5 text-[var(--color-on-surface)]">
                    Post-care
                  </h3>
                  <p className="body-editorial text-[var(--color-on-surface-variant)] leading-relaxed whitespace-pre-line text-sm">
                    {service.postCareNotes}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ===== FAQs ===== */}
      {hasFaqs && (
        <section className="bg-[var(--color-surface-low)] py-20 lg:py-28">
          <div className="mx-auto max-w-3xl px-6">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: editorialEase }}
            >
              <span className="label-micro block mb-4">Common Questions</span>
              <h2 className="headline-section">Frequently asked</h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: editorialEase, delay: 0.1 }}
            >
              <Accordion items={service.faqs!} />
            </motion.div>
          </div>
        </section>
      )}

      {/* ===== FINAL CTA ===== */}
      <section className="bg-[var(--color-primary)] py-24 lg:py-32">
        <motion.div
          className="mx-auto max-w-3xl px-6 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: editorialEase }}
        >
          <span className="label-micro block mb-6 text-[var(--color-on-primary)] opacity-60">
            Ready to begin?
          </span>
          <h2 className="headline-section text-[var(--color-on-primary)] mb-6">
            Book your {service.name.toLowerCase()}
          </h2>
          <p className="body-editorial text-[var(--color-on-primary)] opacity-75 mb-10 max-w-xl mx-auto">
            Every visit begins with a personal consultation with Karlyne, RN, so
            your plan is tailored to your goals.
          </p>
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-light inline-block"
          >
            Book Now
          </a>
        </motion.div>
      </section>

      {/* ===== RELATED SERVICES ===== */}
      {relatedServices.length > 0 && (
        <section className="bg-[var(--color-surface-low)] py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: editorialEase }}
            >
              <span className="label-micro block mb-4">Explore More</span>
              <h2 className="headline-section">Related services</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedServices.map((s) => (
                <ServiceCard key={s._id} service={s} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== MOBILE STICKY BOOKING BAR ===== */}
      <div
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[var(--color-outline-variant)] bg-[var(--color-surface-lowest)]/95 backdrop-blur-md"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex items-center justify-between gap-4 px-5 py-3">
          <div className="min-w-0">
            {service.priceRange ? (
              <>
                <div className="label-micro text-[var(--color-on-surface-variant)] leading-tight">
                  From
                </div>
                <div className="font-headline text-base text-[var(--color-on-surface)] truncate">
                  {service.priceRange}
                </div>
              </>
            ) : (
              <div className="font-headline text-base text-[var(--color-on-surface)] truncate">
                {service.name}
              </div>
            )}
          </div>
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ padding: "0.75rem 1.75rem" }}
          >
            Book Now
          </a>
        </div>
      </div>
    </div>
  );
}

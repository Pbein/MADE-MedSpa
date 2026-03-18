"use client";

import { use, useMemo } from "react";
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
  const tiers = useQuery(api.membershipTiers.list);

  const maxDiscount = useMemo(() => {
    if (!tiers) return null;
    let max = 0;
    for (const tier of tiers) {
      for (const benefit of tier.benefits) {
        const match = benefit.match(/(\d+)%\s*off/i);
        if (match) {
          max = Math.max(max, parseInt(match[1]));
        }
      }
    }
    return max > 0 ? max : null;
  }, [tiers]);

  // Related services: same category, different slug
  const relatedServices =
    allServices
      ?.filter((s) => s.category === service?.category && s.slug !== slug)
      .slice(0, 3) ?? [];

  // Loading state
  if (service === undefined) {
    return (
      <main
        className="min-h-screen"
        style={{ backgroundColor: "var(--color-ivory)" }}
      >
        <div
          className="flex min-h-screen items-center justify-center"
          style={{ paddingTop: "var(--nav-height)" }}
        >
          <div
            className="editorial-spacing"
            style={{ color: "var(--color-stone-dark)" }}
          >
            Loading...
          </div>
        </div>
      </main>
    );
  }

  // Not found state
  if (service === null) {
    return (
      <main
        className="min-h-screen"
        style={{ backgroundColor: "var(--color-ivory)" }}
      >
        <div
          className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center"
          style={{ paddingTop: "var(--nav-height)" }}
        >
          <h1
            className="headline-text"
            style={{
              fontSize: "var(--text-4xl)",
              color: "var(--color-chocolate)",
            }}
          >
            Service Not Found
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-lg)",
              color: "var(--color-brown)",
            }}
          >
            The service you are looking for does not exist or has been removed.
          </p>
          <Link href="/services" className="btn btn-primary">
            View All Services
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-ivory)" }}
    >
      {/* Breadcrumb */}
      <section
        className="mx-auto max-w-[var(--max-width)] px-6 lg:px-10"
        style={{ paddingTop: "calc(var(--nav-height) + var(--space-xl))" }}
      >
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: luxuryEase }}
          className="mb-8 flex flex-wrap items-center gap-2"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            color: "var(--color-stone-dark)",
          }}
        >
          <Link
            href="/"
            className="transition-colors hover:text-[var(--color-accent-text)]"
          >
            Home
          </Link>
          <span style={{ color: "var(--color-stone)" }}>/</span>
          <Link
            href="/services"
            className="transition-colors hover:text-[var(--color-accent-text)]"
          >
            Services
          </Link>
          <span style={{ color: "var(--color-stone)" }}>/</span>
          <span style={{ color: "var(--color-chocolate)" }}>
            {service.name}
          </span>
        </motion.nav>
      </section>

      {/* Hero */}
      <section className="mx-auto max-w-[var(--max-width)] px-6 lg:px-10">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="editorial-spacing mb-4"
          style={{ color: "var(--color-accent-text)" }}
        >
          {service.category}
        </motion.div>

        <motion.h1
          custom={0.1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="headline-text mb-6"
          style={{
            fontSize: "var(--text-5xl)",
            color: "var(--color-chocolate)",
            maxWidth: "800px",
          }}
        >
          {service.name}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: luxuryEase, delay: 0.3 }}
          style={{ transformOrigin: "left" }}
          className="accent-line mb-12"
        />
      </section>

      {/* Editorial Split: Description + Image */}
      <section
        className="mx-auto max-w-[var(--max-width)] px-6 lg:px-10"
        style={{ paddingBottom: "var(--space-4xl)" }}
      >
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          {/* Description */}
          <motion.div
            custom={0.2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-lg)",
                color: "var(--color-brown)",
                lineHeight: 1.8,
                whiteSpace: "pre-line",
              }}
            >
              {service.fullDescription}
            </p>
          </motion.div>

          {/* Service Image */}
          <motion.div
            custom={0.35}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="image-portrait image-warm overflow-hidden"
            style={{
              borderRadius: "var(--border-radius-sm)",
            }}
          >
            <Image
              src={service.imageUrl || getServiceImage(slug, "hero")}
              alt={service.name}
              width={1280}
              height={1707}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-full w-full object-cover"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* Info Bar: Duration & Price */}
      {(service.duration || service.priceRange) && (
        <section
          style={{
            backgroundColor: "var(--color-cream)",
            padding: "var(--space-2xl) 0",
          }}
        >
          <div className="mx-auto flex max-w-[var(--max-width)] flex-wrap items-center justify-center gap-12 px-6 lg:px-10">
            {service.duration && (
              <motion.div
                custom={0.3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center text-center"
              >
                <span
                  className="editorial-spacing mb-2"
                  style={{
                    color: "var(--color-stone-dark)",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  Duration
                </span>
                <span
                  className="headline-text"
                  style={{
                    fontSize: "var(--text-2xl)",
                    color: "var(--color-chocolate)",
                  }}
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
                  backgroundColor: "var(--color-stone)",
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
                  className="editorial-spacing mb-2"
                  style={{
                    color: "var(--color-stone-dark)",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  Price Range
                </span>
                <span
                  className="headline-text"
                  style={{
                    fontSize: "var(--text-2xl)",
                    color: "var(--color-chocolate)",
                  }}
                >
                  {service.priceRange}
                </span>
              </motion.div>
            )}

            {/* Member Savings Callout */}
            {tiers && tiers.length > 0 && (
              <>
                <div
                  className="hidden h-12 sm:block"
                  style={{
                    width: "1px",
                    backgroundColor: "var(--color-stone)",
                  }}
                />
                <motion.div
                  custom={0.5}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col items-center text-center"
                >
                  <span
                    className="editorial-spacing mb-2"
                    style={{
                      color: "var(--color-stone-dark)",
                      fontSize: "var(--text-xs)",
                    }}
                  >
                    Member Savings
                  </span>
                  <span
                    className="headline-text"
                    style={{
                      fontSize: "var(--text-2xl)",
                      color: "var(--color-accent-text)",
                    }}
                  >
                    {maxDiscount ? `Up to ${maxDiscount}% Off` : "Exclusive Pricing"}
                  </span>
                  <Link
                    href="/membership"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-sm)",
                      color: "var(--color-accent-text)",
                      marginTop: "var(--space-xs)",
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                    }}
                    className="transition-opacity hover:opacity-70"
                  >
                    Become a Member
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </section>
      )}

      {/* Service-Specific FAQs */}
      {service.faqs && service.faqs.length > 0 && (
        <section
          className="mx-auto max-w-[var(--max-width)] px-6 lg:px-10"
          style={{ padding: "var(--space-section) 0" }}
        >
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="mb-10 text-center"
            >
              <span
                className="editorial-spacing mb-4 block"
                style={{ color: "var(--color-stone-dark)" }}
              >
                Common Questions
              </span>
              <h2
                className="headline-text"
                style={{
                  fontSize: "var(--text-3xl)",
                  color: "var(--color-chocolate)",
                }}
              >
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

      {/* Book CTA */}
      <section
        className="text-center"
        style={{
          backgroundColor: "var(--color-chocolate)",
          padding: "var(--space-4xl) var(--space-xl)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: luxuryEase }}
        >
          <span
            className="editorial-spacing mb-4 block"
            style={{ color: "var(--color-stone)" }}
          >
            Ready to Begin?
          </span>
          <h2
            className="headline-text mx-auto mb-8 max-w-lg"
            style={{
              fontSize: "var(--text-3xl)",
              color: "var(--color-white)",
            }}
          >
            Book This Service
          </h2>
          <Link
            href={`/booking?service=${slug}`}
            className="btn btn-primary"
            style={{
              backgroundColor: "var(--color-burgundy)",
              color: "var(--color-ivory)",
            }}
          >
            Book Now
          </Link>
        </motion.div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section
          className="mx-auto max-w-[var(--max-width)] px-6 lg:px-10"
          style={{ padding: "var(--space-section) 0" }}
        >
          <div className="mx-auto px-6 lg:px-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: luxuryEase }}
              className="mb-12 text-center"
            >
              <span
                className="editorial-spacing mb-4 block"
                style={{ color: "var(--color-stone-dark)" }}
              >
                Explore More
              </span>
              <h2
                className="headline-text"
                style={{
                  fontSize: "var(--text-3xl)",
                  color: "var(--color-chocolate)",
                }}
              >
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

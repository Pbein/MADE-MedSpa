"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { motion } from "framer-motion";
import Accordion from "@/components/ui/Accordion";
import ServiceCard from "@/components/sections/ServiceCard";

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
      <main>
        <div>
          <span>Loading...</span>
        </div>
      </main>
    );
  }

  // Not found state
  if (service === null) {
    return (
      <main>
        <div>
          <h1>Service Not Found</h1>
          <p>
            The service you are looking for does not exist or has been removed.
          </p>
          <Link href="/services">
            View All Services
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      {/* Breadcrumb */}
      <section>
        <div>
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: luxuryEase }}
          >
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/services">Services</Link>
            <span>/</span>
            <span>{service.name}</span>
          </motion.nav>
        </div>
      </section>

      {/* Hero + Content */}
      <section>
        <div>
          {/* Category eyebrow */}
          <motion.span
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            {service.category}
          </motion.span>

          {/* Service name */}
          <motion.h1
            custom={0.1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            {service.name}
          </motion.h1>

          {/* Accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: luxuryEase, delay: 0.3 }}
          />

          {/* Two-column: description + image */}
          <div>
            <motion.div
              custom={0.2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <p>{service.fullDescription}</p>
            </motion.div>

            <motion.div
              custom={0.35}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <img src="/placeholder.svg" alt={service.name} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Info Bar */}
      {(service.duration || service.priceRange) && (
        <section>
          <div>
            {service.duration && (
              <motion.div
                custom={0.3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                <span>Duration</span>
                <span>{service.duration}</span>
              </motion.div>
            )}

            {service.duration && service.priceRange && (
              <div />
            )}

            {service.priceRange && (
              <motion.div
                custom={0.4}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                <span>Price Range</span>
                <span>{service.priceRange}</span>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* FAQs */}
      {service.faqs && service.faqs.length > 0 && (
        <section>
          <div>
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <span>Common Questions</span>
              <h2>Frequently Asked</h2>
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
      <section>
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: luxuryEase }}
        >
          <span>Ready to Begin?</span>
          <h2>Book This Service</h2>
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book Now
          </a>
        </motion.div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section>
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: luxuryEase }}
            >
              <span>Explore More</span>
              <h2>Related Services</h2>
            </motion.div>

            <div>
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

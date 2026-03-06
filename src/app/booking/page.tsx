"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

/* ── Framer Motion helpers ─────────────────────────── */
const ease = [0.16, 1, 0.3, 1] as const;

const revealUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

const revealLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease } },
};

const revealRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ── Info data ─────────────────────────────────────── */
const whatToExpect = [
  {
    number: "01",
    title: "Consultation",
    description:
      "Every visit begins with a personalized consultation to understand your goals, assess your needs, and craft a tailored treatment plan.",
  },
  {
    number: "02",
    title: "Treatment",
    description:
      "Our expert team performs your chosen service with meticulous care, using only premium products and the latest techniques.",
  },
  {
    number: "03",
    title: "Aftercare",
    description:
      "You will receive detailed aftercare instructions and ongoing support to ensure beautiful, lasting results.",
  },
];

const preparationTips = [
  "Arrive 10-15 minutes early to complete any necessary paperwork and settle in.",
  "Avoid blood-thinning medications and supplements (aspirin, fish oil, vitamin E) for 48 hours prior to injectable treatments.",
  "Come with a clean face, free of makeup, for facial treatments.",
  "Stay hydrated and avoid excessive sun exposure before your appointment.",
  "Inform us of any allergies, medications, or medical conditions during booking.",
];

const cancellationPolicy = {
  title: "Cancellation Policy",
  items: [
    "We kindly ask for at least 24 hours notice for any cancellations or rescheduling.",
    "Late cancellations (under 24 hours) may incur a fee of up to 50% of the service cost.",
    "No-shows will be charged the full service amount.",
    "We understand life happens. Please contact us as soon as possible if your plans change.",
  ],
};

/* ── Booking Content (reads search params) ─────────── */
function BookingContent() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service");
  const services = useQuery(api.services.list);

  const selectedService = services?.find(
    (s) =>
      s.name.toLowerCase().replace(/\s+/g, "-") === serviceParam ||
      s._id === serviceParam
  );

  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section
        className="relative flex min-h-[50vh] flex-col items-center justify-center px-6 text-center"
        style={{ backgroundColor: "var(--color-ivory)" }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="pt-[var(--nav-height)]"
        >
          <motion.div
            variants={revealUp}
            className="editorial-spacing mb-6 text-[var(--color-stone-dark)]"
          >
            Book Online
          </motion.div>

          <motion.h1
            variants={revealUp}
            className="headline-text mb-6"
            style={{
              fontSize: "var(--text-5xl)",
              color: "var(--color-chocolate)",
            }}
          >
            Schedule Your <span className="accent-text">Visit</span>
          </motion.h1>

          <motion.p
            variants={revealUp}
            className="mx-auto max-w-xl leading-relaxed text-[var(--color-brown)]"
            style={{ fontSize: "var(--text-lg)" }}
          >
            {selectedService
              ? `You are booking: ${selectedService.name}. Select your preferred date and time below.`
              : "Choose a service and select your preferred date and time. Your journey to elevated beauty is just a few clicks away."}
          </motion.p>
        </motion.div>

        {/* Bottom decorative line */}
        <div
          className="absolute bottom-8 left-1/2 h-12 w-[1px] -translate-x-1/2"
          style={{ backgroundColor: "var(--color-stone)" }}
        />
      </section>

      {/* ═══════════════ SERVICE QUICK-SELECT ═══════════════ */}
      {!selectedService && (
        <section
          className="px-6 lg:px-10"
          style={{
            backgroundColor: "var(--color-cream)",
            paddingTop: "var(--space-section)",
            paddingBottom: "var(--space-section)",
          }}
        >
          <div className="mx-auto max-w-[var(--max-width)]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="mb-16 text-center"
            >
              <motion.div
                variants={revealUp}
                className="editorial-spacing mb-4 text-[var(--color-stone-dark)]"
              >
                Select a Service
              </motion.div>
              <motion.h2
                variants={revealUp}
                className="headline-text mb-4"
                style={{
                  fontSize: "var(--text-4xl)",
                  color: "var(--color-chocolate)",
                }}
              >
                What brings you <span className="accent-text">in today</span>?
              </motion.h2>
              <motion.p
                variants={revealUp}
                className="mx-auto max-w-lg leading-relaxed text-[var(--color-brown)]"
                style={{ fontSize: "var(--text-base)" }}
              >
                Choose from our curated menu of treatments to get started with
                your booking.
              </motion.p>
            </motion.div>

            {services === undefined ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "var(--color-ivory)",
                      borderRadius: "var(--border-radius-sm)",
                      padding: "var(--space-xl)",
                      animation: "pulse 2s ease-in-out infinite",
                      minHeight: "180px",
                    }}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {services.map((service) => (
                  <motion.div key={service._id} variants={revealUp}>
                    <Link
                      href={`/booking?service=${service.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className="hover-lift group block"
                      style={{
                        backgroundColor: "var(--color-ivory)",
                        borderRadius: "var(--border-radius-sm)",
                        padding: "var(--space-xl)",
                        textDecoration: "none",
                        display: "block",
                        transition:
                          "transform var(--duration-normal) var(--ease-smooth)",
                      }}
                    >
                      <div
                        className="editorial-spacing mb-3 text-[var(--color-burgundy)]"
                        style={{ fontSize: "var(--text-xs)" }}
                      >
                        {service.category}
                      </div>
                      <h3
                        className="headline-text mb-3"
                        style={{
                          fontSize: "var(--text-xl)",
                          color: "var(--color-chocolate)",
                        }}
                      >
                        {service.name}
                      </h3>
                      <p
                        className="mb-4 leading-relaxed text-[var(--color-brown)]"
                        style={{
                          fontSize: "var(--text-sm)",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {service.shortDescription}
                      </p>
                      <div className="flex items-center justify-between">
                        <span
                          className="accent-text text-[var(--color-burgundy)]"
                          style={{ fontSize: "var(--text-lg)" }}
                        >
                          ${service.priceRange || "Varies"}
                        </span>
                        <span
                          className="editorial-spacing text-[var(--color-stone-dark)]"
                          style={{ fontSize: "var(--text-xs)" }}
                        >
                          {service.duration} min
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════ CAL.COM EMBED ═══════════════ */}
      <section
        className="px-6 lg:px-10"
        style={{
          backgroundColor: selectedService
            ? "var(--color-cream)"
            : "var(--color-ivory)",
          paddingTop: "var(--space-section)",
          paddingBottom: "var(--space-section)",
        }}
      >
        <div className="mx-auto max-w-[var(--max-width)]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div
              variants={revealUp}
              className="editorial-spacing mb-4 text-[var(--color-stone-dark)]"
            >
              {selectedService ? selectedService.name : "Choose a Time"}
            </motion.div>
            <motion.h2
              variants={revealUp}
              className="headline-text mb-4"
              style={{
                fontSize: "var(--text-3xl)",
                color: "var(--color-chocolate)",
              }}
            >
              Book Your <span className="accent-text">Appointment</span>
            </motion.h2>
            {selectedService && (
              <motion.p
                variants={revealUp}
                className="mx-auto mb-2 max-w-md leading-relaxed text-[var(--color-brown)]"
                style={{ fontSize: "var(--text-base)" }}
              >
                {selectedService.shortDescription}
              </motion.p>
            )}
            {selectedService && (
              <motion.div
                variants={revealUp}
                className="mb-8 flex items-center justify-center gap-6"
              >
                <span
                  className="accent-text text-[var(--color-burgundy)]"
                  style={{ fontSize: "var(--text-xl)" }}
                >
                  ${selectedService.priceRange || "Varies"}
                </span>
                <span
                  className="h-4 w-[1px]"
                  style={{ backgroundColor: "var(--color-stone)" }}
                />
                <span
                  className="text-[var(--color-brown)]"
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  {selectedService.duration} minutes
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Cal.com Embed Placeholder */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={revealUp}
            className="mx-auto max-w-3xl"
          >
            <div
              className="flex flex-col items-center justify-center text-center"
              style={{
                backgroundColor: "var(--color-ivory)",
                border: "1px solid var(--color-stone)",
                borderRadius: "var(--border-radius-sm)",
                padding: "var(--space-4xl) var(--space-xl)",
                minHeight: "400px",
              }}
            >
              <div
                className="mb-6 flex h-16 w-16 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "var(--color-cream)",
                  border: "1px solid var(--color-stone)",
                }}
              >
                <span
                  className="headline-text text-[var(--color-burgundy)]"
                  style={{ fontSize: "var(--text-2xl)" }}
                >
                  C
                </span>
              </div>

              <h3
                className="headline-text mb-3"
                style={{
                  fontSize: "var(--text-2xl)",
                  color: "var(--color-chocolate)",
                }}
              >
                Cal.com Scheduling Widget
              </h3>

              <p
                className="mx-auto mb-6 max-w-md leading-relaxed text-[var(--color-brown)]"
                style={{ fontSize: "var(--text-base)" }}
              >
                The Cal.com booking calendar will be embedded here. Install{" "}
                <code
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "var(--color-cream)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  @calcom/embed-react
                </code>{" "}
                and configure your Cal.com event link to activate the inline
                scheduling experience.
              </p>

              <div
                className="mx-auto mb-6 max-w-sm"
                style={{
                  backgroundColor: "var(--color-cream)",
                  borderRadius: "var(--border-radius-sm)",
                  padding: "var(--space-md) var(--space-lg)",
                  fontSize: "var(--text-sm)",
                  fontFamily: "monospace",
                  color: "var(--color-brown)",
                  textAlign: "left",
                  lineHeight: 1.6,
                }}
              >
                npm install @calcom/embed-react
              </div>

              <p
                className="text-[var(--color-stone-dark)]"
                style={{ fontSize: "var(--text-sm)" }}
              >
                {selectedService
                  ? `Pre-selected service: ${selectedService.name}`
                  : "No service pre-selected. Guests will choose during booking."}
              </p>
            </div>

            {selectedService && (
              <div className="mt-6 text-center">
                <Link
                  href="/booking"
                  className="text-[var(--color-burgundy)] transition-colors hover:text-[var(--color-chocolate)]"
                  style={{
                    fontSize: "var(--text-sm)",
                    textDecoration: "underline",
                    textUnderlineOffset: "4px",
                    transitionDuration: "var(--duration-fast)",
                  }}
                >
                  Choose a different service
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ WHAT TO EXPECT ═══════════════ */}
      <section
        className="section-dark px-6 lg:px-10"
        style={{
          paddingTop: "var(--space-section)",
          paddingBottom: "var(--space-section)",
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mx-auto max-w-[var(--max-width)]"
        >
          <motion.div variants={revealUp} className="mb-16 text-center">
            <div className="editorial-spacing mb-4 text-[var(--color-stone)]">
              Your Visit
            </div>
            <h2
              className="headline-text"
              style={{ fontSize: "var(--text-4xl)" }}
            >
              What to <span className="accent-text">Expect</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
            {whatToExpect.map((step) => (
              <motion.div
                key={step.number}
                variants={revealUp}
                className="text-center"
              >
                <div
                  className="mx-auto mb-6"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-4xl)",
                    fontWeight: 300,
                    color: "var(--color-burgundy-light)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {step.number}
                </div>
                <h3
                  className="headline-text mb-4"
                  style={{ fontSize: "var(--text-2xl)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="mx-auto max-w-xs leading-relaxed text-[var(--color-stone)]"
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ PREPARATION + CANCELLATION ═══════════════ */}
      <section
        className="px-6 lg:px-10"
        style={{
          backgroundColor: "var(--color-cream)",
          paddingTop: "var(--space-section)",
          paddingBottom: "var(--space-section)",
        }}
      >
        <div className="mx-auto grid max-w-[var(--max-width)] items-start gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Preparation Tips */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div
              variants={revealLeft}
              className="editorial-spacing mb-4 text-[var(--color-stone-dark)]"
            >
              Before Your Visit
            </motion.div>
            <motion.h2
              variants={revealLeft}
              className="headline-text mb-8"
              style={{
                fontSize: "var(--text-3xl)",
                color: "var(--color-chocolate)",
              }}
            >
              Preparation <span className="accent-text">Tips</span>
            </motion.h2>

            <ul className="flex flex-col gap-4">
              {preparationTips.map((tip, i) => (
                <motion.li
                  key={i}
                  variants={revealLeft}
                  className="flex items-start gap-4 text-[var(--color-brown)]"
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  <span
                    className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: "var(--color-burgundy)",
                      color: "var(--color-ivory)",
                      fontSize: "10px",
                      fontWeight: 600,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{tip}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Cancellation Policy */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div
              variants={revealRight}
              className="editorial-spacing mb-4 text-[var(--color-stone-dark)]"
            >
              Good to Know
            </motion.div>
            <motion.h2
              variants={revealRight}
              className="headline-text mb-8"
              style={{
                fontSize: "var(--text-3xl)",
                color: "var(--color-chocolate)",
              }}
            >
              Cancellation <span className="accent-text">Policy</span>
            </motion.h2>

            <div
              style={{
                backgroundColor: "var(--color-ivory)",
                borderRadius: "var(--border-radius-sm)",
                padding: "var(--space-xl)",
              }}
            >
              <ul className="flex flex-col gap-4">
                {cancellationPolicy.items.map((item, i) => (
                  <motion.li
                    key={i}
                    variants={revealRight}
                    className="flex items-start gap-3 text-[var(--color-brown)]"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    <span
                      className="mt-[2px] h-[6px] w-[6px] flex-shrink-0 rounded-full"
                      style={{ backgroundColor: "var(--color-stone-dark)" }}
                    />
                    <span className="leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section
        className="px-6 text-center lg:px-10"
        style={{
          backgroundColor: "var(--color-ivory)",
          paddingTop: "var(--space-section)",
          paddingBottom: "var(--space-section)",
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mx-auto max-w-2xl"
        >
          <motion.div
            variants={revealUp}
            className="accent-line mx-auto mb-8"
          />

          <motion.h2
            variants={revealUp}
            className="headline-text mb-6"
            style={{
              fontSize: "var(--text-4xl)",
              color: "var(--color-chocolate)",
            }}
          >
            Have <span className="accent-text">questions</span> before booking?
          </motion.h2>

          <motion.p
            variants={revealUp}
            className="mx-auto mb-10 max-w-lg leading-relaxed text-[var(--color-brown)]"
            style={{ fontSize: "var(--text-lg)" }}
          >
            Our team is here to help you choose the perfect treatment and answer
            any questions you may have.
          </motion.p>

          <motion.div
            variants={revealUp}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link href="/contact" className="btn btn-primary">
              Contact Us
            </Link>
            <Link href="/services" className="btn btn-outline">
              Browse Services
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

/* ── Page Component ────────────────────────────────── */
export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-screen items-center justify-center"
          style={{ backgroundColor: "var(--color-ivory)" }}
        >
          <div className="text-center">
            <div
              className="editorial-spacing text-[var(--color-stone-dark)]"
              style={{ fontSize: "var(--text-sm)" }}
            >
              Loading
            </div>
          </div>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}

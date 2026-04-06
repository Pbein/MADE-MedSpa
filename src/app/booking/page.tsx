"use client";

import { motion } from "framer-motion";
import Link from "next/link";

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

const bookingUrl = process.env.NEXT_PUBLIC_PABAU_BOOKING_URL || "#";

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

export default function BookingPage() {
  return (
    <>
      {/* HERO */}
      <section className="section-warm relative flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="pt-[var(--nav-height)]"
        >
          <motion.div
            variants={revealUp}
            className="editorial-spacing mb-6"
            style={{ color: "var(--color-cream)" }}
          >
            Book Online
          </motion.div>

          <motion.h1
            variants={revealUp}
            className="headline-text mb-6"
            style={{
              fontSize: "var(--text-5xl)",
              color: "var(--color-soft-ivory)",
            }}
          >
            Schedule Your{" "}
            <span className="accent-text" style={{ color: "var(--color-accent)" }}>
              Visit
            </span>
          </motion.h1>

          <motion.p
            variants={revealUp}
            className="mx-auto mb-10 max-w-xl leading-relaxed"
            style={{
              fontSize: "var(--text-lg)",
              color: "rgba(247, 246, 235, 0.7)",
              fontWeight: 300,
            }}
          >
            Your journey to elevated beauty is just a click away. Book your
            appointment through our scheduling system and we will take care of
            the rest.
          </motion.p>

          <motion.div variants={revealUp}>
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-light"
              style={{ padding: "1rem 3rem", fontSize: "var(--text-lg)" }}
            >
              Book Your Appointment
            </a>
          </motion.div>
        </motion.div>

        <div
          className="absolute bottom-8 left-1/2 h-12 w-[1px] -translate-x-1/2"
          style={{ backgroundColor: "rgba(90, 61, 55, 0.3)" }}
        />
      </section>

      {/* WHAT TO EXPECT */}
      <section
        className="section-dark px-6 lg:px-10"
        style={{
          paddingTop: "var(--space-section-lg)",
          paddingBottom: "var(--space-section-lg)",
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mx-auto max-w-[var(--max-width)]"
        >
          <motion.div variants={revealUp} className="mb-20 text-center">
            <div
              className="editorial-spacing mb-4"
              style={{ color: "var(--color-cream)" }}
            >
              Your Visit
            </div>
            <h2
              className="headline-text"
              style={{ fontSize: "var(--text-4xl)" }}
            >
              What to{" "}
              <span
                className="accent-text"
                style={{ color: "var(--color-accent)" }}
              >
                Expect
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-16">
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
                    fontWeight: 200,
                    color: "var(--color-accent-light)",
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
                  className="mx-auto max-w-xs leading-relaxed"
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "rgba(247, 246, 235, 0.6)",
                    fontWeight: 300,
                  }}
                >
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* PREPARATION + CANCELLATION */}
      <section
        className="px-6 lg:px-10"
        style={{
          backgroundColor: "var(--color-soft-ivory)",
          paddingTop: "var(--space-section)",
          paddingBottom: "var(--space-section)",
        }}
      >
        <div className="mx-auto grid max-w-[var(--max-width)] items-start gap-16 lg:grid-cols-2 lg:gap-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div
              variants={revealLeft}
              className="editorial-spacing mb-4"
              style={{ color: "var(--color-cream)" }}
            >
              Before Your Visit
            </motion.div>
            <motion.h2
              variants={revealLeft}
              className="headline-text mb-8"
              style={{
                fontSize: "var(--text-3xl)",
                color: "var(--color-deep-cocoa)",
              }}
            >
              Preparation{" "}
              <span
                className="accent-text"
                style={{ color: "var(--color-accent-text)" }}
              >
                Tips
              </span>
            </motion.h2>

            <ul className="flex flex-col gap-4">
              {preparationTips.map((tip, i) => (
                <motion.li
                  key={i}
                  variants={revealLeft}
                  className="flex items-start gap-4"
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-warm-taupe)",
                    fontWeight: 300,
                  }}
                >
                  <span
                    className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: "var(--color-accent)",
                      color: "var(--color-deep-cocoa)",
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

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div
              variants={revealRight}
              className="editorial-spacing mb-4"
              style={{ color: "var(--color-cream)" }}
            >
              Good to Know
            </motion.div>
            <motion.h2
              variants={revealRight}
              className="headline-text mb-8"
              style={{
                fontSize: "var(--text-3xl)",
                color: "var(--color-deep-cocoa)",
              }}
            >
              Cancellation{" "}
              <span
                className="accent-text"
                style={{ color: "var(--color-accent-text)" }}
              >
                Policy
              </span>
            </motion.h2>

            <div
              style={{
                backgroundColor: "var(--color-linen)",
                borderRadius: "var(--border-radius-lg)",
                padding: "var(--space-xl)",
              }}
            >
              <ul className="flex flex-col gap-4">
                {cancellationPolicy.items.map((item, i) => (
                  <motion.li
                    key={i}
                    variants={revealRight}
                    className="flex items-start gap-3"
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--color-warm-taupe)",
                      fontWeight: 300,
                    }}
                  >
                    <span
                      className="mt-[2px] h-[6px] w-[6px] flex-shrink-0 rounded-full"
                      style={{ backgroundColor: "var(--color-cream)" }}
                    />
                    <span className="leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="px-6 text-center lg:px-10"
        style={{
          backgroundColor: "var(--color-linen)",
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
          <motion.div variants={revealUp} className="accent-line mx-auto mb-8" />

          <motion.h2
            variants={revealUp}
            className="headline-text mb-6"
            style={{
              fontSize: "var(--text-4xl)",
              color: "var(--color-deep-cocoa)",
            }}
          >
            Have{" "}
            <span
              className="accent-text"
              style={{ color: "var(--color-accent-text)" }}
            >
              questions
            </span>{" "}
            before booking?
          </motion.h2>

          <motion.p
            variants={revealUp}
            className="mx-auto mb-10 max-w-lg leading-relaxed"
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--color-warm-taupe)",
              fontWeight: 300,
            }}
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

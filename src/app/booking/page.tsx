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
      {/* HERO — Espresso */}
      <section
        className="section-dark relative flex min-h-[50vh] flex-col items-center justify-center px-6 text-center"
        style={{ backgroundColor: "var(--color-espresso)" }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="pt-[var(--nav-height)]"
        >
          <motion.p
            variants={revealUp}
            className="eyebrow mb-6"
            style={{ color: "rgba(247,246,235,0.5)" }}
          >
            Book Online
          </motion.p>

          <motion.h1
            variants={revealUp}
            className="headline-display mb-6"
            style={{ color: "var(--color-glaze)" }}
          >
            Schedule Your{" "}
            <span style={{ color: "var(--color-blush)" }}>Visit</span>
          </motion.h1>

          <motion.p
            variants={revealUp}
            className="body-lg mx-auto mb-10 max-w-xl"
            style={{ color: "rgba(247,246,235,0.65)" }}
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
              className="btn-primary"
              style={{ padding: "1rem 3rem", fontSize: "1.125rem" }}
            >
              Book Your Appointment
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* WHAT TO EXPECT — Glaze */}
      <section className="section-light px-6 lg:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="container-page"
        >
          <motion.div variants={revealUp} className="mb-20 text-center">
            <p className="eyebrow-muted mb-4">Your Visit</p>
            <h2 className="headline-section" style={{ color: "var(--color-ink)" }}>
              What to{" "}
              <span style={{ color: "var(--color-matcha)" }}>Expect</span>
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
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    fontWeight: 200,
                    color: "var(--color-matcha)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {step.number}
                </div>
                <h3
                  className="headline-section mb-4"
                  style={{ color: "var(--color-ink)" }}
                >
                  {step.title}
                </h3>
                <p className="body-md mx-auto max-w-xs" style={{ color: "var(--color-olive)" }}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* PREPARATION TIPS — Silk */}
      <section
        className="section-alt px-6 lg:px-10"
        style={{ backgroundColor: "var(--color-silk)" }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="container-page max-w-3xl"
        >
          <motion.p variants={revealLeft} className="eyebrow-muted mb-4">
            Before Your Visit
          </motion.p>
          <motion.h2
            variants={revealLeft}
            className="headline-section mb-10"
            style={{ color: "var(--color-ink)" }}
          >
            Preparation{" "}
            <span style={{ color: "var(--color-matcha)" }}>Tips</span>
          </motion.h2>

          <ul className="flex flex-col gap-5">
            {preparationTips.map((tip, i) => (
              <motion.li
                key={i}
                variants={revealLeft}
                className="flex items-start gap-4"
              >
                <span
                  className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: "var(--color-blush)",
                    color: "#fff",
                  }}
                >
                  {i + 1}
                </span>
                <span className="body-md" style={{ color: "var(--color-olive)" }}>
                  {tip}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* CANCELLATION POLICY — Glaze */}
      <section className="section-light px-6 lg:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="container-page max-w-3xl"
        >
          <motion.p variants={revealUp} className="eyebrow-muted mb-4">
            Good to Know
          </motion.p>
          <motion.h2
            variants={revealUp}
            className="headline-section mb-8"
            style={{ color: "var(--color-ink)" }}
          >
            Cancellation{" "}
            <span style={{ color: "var(--color-matcha)" }}>Policy</span>
          </motion.h2>

          <motion.div
            variants={revealUp}
            className="rounded-xl p-8"
            style={{
              backgroundColor: "var(--color-white-soft)",
              border: "1px solid var(--color-line)",
            }}
          >
            <ul className="flex flex-col gap-4">
              {cancellationPolicy.items.map((item, i) => (
                <motion.li
                  key={i}
                  variants={revealUp}
                  className="flex items-start gap-3"
                >
                  <span
                    className="mt-2 h-[6px] w-[6px] flex-shrink-0 rounded-full"
                    style={{ backgroundColor: "var(--color-mocha)" }}
                  />
                  <span className="body-md" style={{ color: "var(--color-olive)" }}>
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA — Blush */}
      <section
        className="section-blush px-6 text-center lg:px-10"
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
            className="headline-section mb-6"
            style={{ color: "var(--color-glaze)" }}
          >
            Have questions before booking?
          </motion.h2>

          <motion.p
            variants={revealUp}
            className="body-lg mx-auto mb-10 max-w-lg"
            style={{ color: "rgba(247,246,235,0.75)" }}
          >
            Our team is here to help you choose the perfect treatment and answer
            any questions you may have.
          </motion.p>

          <motion.div
            variants={revealUp}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link href="/contact" className="btn-light">
              Contact Us
            </Link>
            <Link href="/services" className="btn-light" style={{ backgroundColor: "transparent", border: "1px solid var(--color-glaze)", color: "var(--color-glaze)" }}>
              Browse Services
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

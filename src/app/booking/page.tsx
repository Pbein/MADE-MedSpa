"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const editorialEase = [0.2, 0, 0, 1] as const;

const revealUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: editorialEase } },
};

const revealLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: editorialEase } },
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
      <section className="bg-[var(--color-primary)] py-48">
        <motion.div
          className="mx-auto max-w-7xl px-6 text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p
            className="label-micro text-[var(--color-surface)] opacity-60 mb-6"
            variants={revealUp}
          >
            Book Online
          </motion.p>

          <motion.h1
            className="headline-editorial text-[var(--color-surface)]"
            variants={revealUp}
          >
            Schedule Your Visit
          </motion.h1>

          <motion.p
            className="body-editorial mt-6 max-w-2xl mx-auto text-[var(--color-surface)] opacity-60"
            variants={revealUp}
          >
            Your journey to elevated beauty is just a click away. Book your
            appointment through our scheduling system and we will take care of
            the rest.
          </motion.p>

          <motion.div className="mt-10" variants={revealUp}>
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-light inline-block"
            >
              Book Your Appointment
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* WHAT TO EXPECT — Timeline */}
      <section className="bg-[var(--color-surface)] py-40">
        <motion.div
          className="mx-auto max-w-7xl px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-20" variants={revealUp}>
            <p className="label-micro mb-4">Your Visit</p>
            <h2 className="headline-section">
              What to Expect
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {whatToExpect.map((step) => (
              <motion.div key={step.number} variants={revealUp}>
                <div className="label-micro text-[var(--color-secondary)] mb-4">
                  {step.number}
                </div>
                <h3 className="font-headline italic text-2xl text-[var(--color-on-surface)] mb-4">
                  {step.title}
                </h3>
                <p className="body-editorial text-[var(--color-on-surface-variant)]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* PREPARATION TIPS */}
      <section className="bg-[var(--color-surface-low)] py-40">
        <motion.div
          className="mx-auto max-w-3xl px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.p className="label-micro mb-4" variants={revealLeft}>
            Before Your Visit
          </motion.p>
          <motion.h2 className="headline-section mb-12" variants={revealLeft}>
            Preparation Tips
          </motion.h2>

          <ul className="space-y-8">
            {preparationTips.map((tip, i) => (
              <motion.li
                key={i}
                className="flex gap-6 items-start"
                variants={revealLeft}
              >
                <span className="label-micro text-[var(--color-secondary)] mt-1 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="body-editorial text-[var(--color-on-surface-variant)]">
                  {tip}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* CANCELLATION POLICY */}
      <section className="bg-[var(--color-surface)] py-40">
        <motion.div
          className="mx-auto max-w-3xl px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.p className="label-micro mb-4" variants={revealUp}>
            Good to Know
          </motion.p>
          <motion.h2 className="headline-section mb-12" variants={revealUp}>
            Cancellation Policy
          </motion.h2>

          <motion.div
            className="bg-[var(--color-surface-low)] p-10"
            variants={revealUp}
          >
            <ul className="space-y-6">
              {cancellationPolicy.items.map((item, i) => (
                <motion.li
                  key={i}
                  className="flex gap-4 items-start"
                  variants={revealUp}
                >
                  <span className="w-1.5 h-1.5 mt-2 shrink-0 bg-[var(--color-secondary)]" />
                  <span className="body-editorial text-[var(--color-on-surface-variant)]">
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--color-secondary)] py-40">
        <motion.div
          className="mx-auto max-w-7xl px-6 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div
            className="mx-auto mb-8 h-px w-16 bg-[var(--color-on-primary)] opacity-30"
            variants={revealUp}
          />

          <motion.h2
            className="headline-editorial text-[var(--color-on-primary)]"
            variants={revealUp}
          >
            Have questions before booking?
          </motion.h2>

          <motion.p
            className="body-editorial mt-6 max-w-xl mx-auto text-[var(--color-on-primary)] opacity-70"
            variants={revealUp}
          >
            Our team is here to help you choose the perfect treatment and answer
            any questions you may have.
          </motion.p>

          <motion.div
            className="mt-10 flex items-center justify-center gap-6"
            variants={revealUp}
          >
            <Link href="/contact" className="btn-primary">
              Contact Us
            </Link>
            <Link
              href="/services"
              className="link-ghost text-[var(--color-on-primary)] opacity-70"
            >
              Browse Services
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import CTABanner from "@/components/sections/CTABanner";

const editorialEase = [0.2, 0, 0, 1] as const;
const luxuryEase = [0.16, 1, 0.3, 1] as const;

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
  const [videoReady, setVideoReady] = useState(false);

  return (
    <>
      {/* HERO — video background with mocha overlay */}
      <section className="relative pt-32 md:pt-48 pb-24 px-6 overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{ backgroundColor: "#391e1e" }}
        >
          {/* Poster — shows immediately while video loads */}
          <img
            src="/images/booking-hero-poster.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Video — fades in once ready */}
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            onCanPlay={() => setVideoReady(true)}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            style={{ opacity: videoReady ? 1 : 0 }}
          >
            <source src="/videos/faq-hero.mp4" type="video/mp4" />
          </video>

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: [
                "linear-gradient(to bottom,",
                "rgba(57,30,30,0.75) 0%,",
                "rgba(57,30,30,0.65) 40%,",
                "rgba(57,30,30,0.75) 70%,",
                "rgba(57,30,30,0.85) 100%)",
              ].join(" "),
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(215,207,197,0.08) 0%, transparent 60%)",
            }}
          />
        </div>

        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } } }}
        >
          <motion.span
            variants={revealUp}
            className="label-micro block mb-6"
            style={{ color: "var(--color-surface)", opacity: 0.75 }}
          >
            Book Online
          </motion.span>

          <motion.h1
            variants={revealUp}
            className="headline-editorial text-5xl md:text-8xl"
            style={{ color: "var(--color-surface)" }}
          >
            Schedule Your Visit
          </motion.h1>

          <motion.p
            variants={revealUp}
            className="body-editorial mt-8 max-w-2xl mx-auto"
            style={{ color: "var(--color-surface)", opacity: 0.85 }}
          >
            Your journey to elevated beauty is just a click away. Book your
            appointment and we will take care of the rest.
          </motion.p>

          <motion.div variants={revealUp} className="mt-10">
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

      {/* WHAT TO EXPECT */}
      <section
        className="relative py-32 md:py-40 overflow-hidden"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        {/* Silk fabric texture — warm fold shadows on cream */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {/* Primary diagonal folds — warm tan shadows */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(140deg, transparent 0%, rgba(215,207,197,0.12) 12%, transparent 22%, rgba(212,195,194,0.18) 32%, transparent 42%, rgba(215,207,197,0.1) 52%, transparent 62%, rgba(212,195,194,0.15) 72%, transparent 82%, rgba(215,207,197,0.08) 92%, transparent 100%)",
            }}
          />
          {/* Cross-folds — opposing angle */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(30deg, rgba(215,207,197,0.08) 0%, transparent 15%, rgba(212,195,194,0.12) 30%, transparent 45%, rgba(215,207,197,0.1) 60%, transparent 75%, rgba(212,195,194,0.08) 90%, transparent 100%)",
            }}
          />
          {/* Soft depth pools where folds gather */}
          <div
            className="absolute inset-0"
            style={{
              background: [
                "radial-gradient(ellipse 70% 40% at 20% 30%, rgba(215,207,197,0.1) 0%, transparent 60%)",
                "radial-gradient(ellipse 60% 35% at 80% 60%, rgba(212,195,194,0.12) 0%, transparent 55%)",
                "radial-gradient(ellipse 50% 30% at 45% 80%, rgba(215,207,197,0.08) 0%, transparent 50%)",
              ].join(", "),
            }}
          />
          {/* Fine satin weave texture */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='8' height='8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 4h8M4 0v8' stroke='%23d7cfc5' stroke-width='0.4' fill='none'/%3E%3C/svg%3E")`,
              backgroundSize: "8px 8px",
            }}
          />
        </div>
        {/* Gradient: espresso top → cream bottom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              "linear-gradient(180deg,",
              "rgba(57,30,30,0.07) 0%,",
              "rgba(57,30,30,0.03) 20%,",
              "rgba(215,207,197,0.04) 50%,",
              "transparent 100%)",
            ].join(" "),
          }}
        />
        {/* Soft mocha radial wash */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(215,207,197,0.06) 0%, transparent 70%)",
          }}
        />
        <motion.div
          className="relative mx-auto max-w-7xl px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-20" variants={revealUp}>
            <p className="label-micro mb-4">Your Visit</p>
            <h2 className="headline-section text-3xl md:text-5xl">
              What to Expect
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
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
      <section className="bg-[var(--color-surface-low)] py-32 md:py-40 relative overflow-hidden">
        {/* Background image — desaturated, slightly more visible than about/values */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <img
            src="/images/values-bg.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              filter: "grayscale(70%) brightness(1.1) contrast(0.9)",
              opacity: 0.12,
              mixBlendMode: "multiply",
            }}
          />
        </div>
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
          <motion.h2 className="headline-section text-3xl md:text-5xl mb-12" variants={revealLeft}>
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
      <section className="bg-[var(--color-surface)] py-32 md:py-40">
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
          <motion.h2 className="headline-section text-3xl md:text-5xl mb-12" variants={revealUp}>
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
      <CTABanner
        dark
        headline="Have questions before booking?"
        subtitle="Our team is here to help you choose the perfect treatment and answer any questions you may have."
        ctaText="Contact Us"
        ctaHref="/contact"
        secondaryText="Browse Services"
        secondaryHref="/services"
      />
    </>
  );
}

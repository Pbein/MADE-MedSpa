"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import CTABanner from "@/components/sections/CTABanner";
import { useSectionContent } from "@/hooks/useSectionContent";

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
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Belt-and-suspenders scroll-to-hash. Next.js App Router occasionally fails
  // to scroll to the target anchor when navigating between client-rendered
  // pages (it sometimes runs the scroll before the destination element is
  // mounted). If the URL points at a known anchor on this page, explicitly
  // scroll to it on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    // rAF + small timeout to let layout settle (poster, hero video, etc.)
    const id = window.setTimeout(() => {
      const el = document.getElementById(hash);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(id);
  }, []);
  const { data: expectText } = useSectionContent("section_booking_expect", {
    eyebrow: "Your Visit",
    headline: "What to Expect",
  });
  const { data: prepText } = useSectionContent("section_booking_prep", {
    eyebrow: "Before Your Visit",
    headline: "Preparation Tips",
  });
  const { data: policyText } = useSectionContent("section_booking_policy", {
    eyebrow: "Good to Know",
    headline: "Cancellation Policy",
  });
  const { data: ctaText } = useSectionContent("section_booking_cta", {
    headline: "Have questions before booking?",
    subtitle: "Our team is here to help you choose the perfect treatment and answer any questions you may have.",
    cta_text: "Contact Us",
    cta_href: "/contact",
    secondary_text: "Browse Services",
    secondary_href: "/services",
  });

  return (
    <>
      {/* INLINE BOOKING — Pabau iframe fills the viewport below the nav.
         Pabau already shows its own header ("Your skin. Your results.") inside
         the iframe, so we skip duplicate parent chrome and give the widget
         every pixel between the fixed nav and the bottom of the screen. */}
      {/* Top padding pushes the iframe below the fixed desktop nav (which
         floats over content with no background-of-its-own on /booking now
         that the dark hero is gone). Matches the existing scroll-mt offset. */}
      <section
        id="section-book-now"
        className="relative pt-[76px] lg:pt-[120px] scroll-mt-[76px] lg:scroll-mt-[120px]"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        {/* Preconnect + DNS-prefetch to Pabau host so the iframe handshake
           starts before the iframe element is parsed. React 19 hoists these
           <link> tags into <head> automatically. */}
        <link rel="preconnect" href="https://partner.pabau.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://partner.pabau.com" />

        <div
          className="relative overflow-hidden"
          style={{
            backgroundColor: "#fff",
          }}
        >
          {/* Skeleton overlay — fades out once the iframe fires onLoad so
             the user sees something happening instead of a blank white box
             while Pabau's app boots. */}
          {!iframeLoaded && (
            <div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 transition-opacity duration-500"
              style={{ backgroundColor: "var(--color-surface)" }}
            >
              <div
                className="h-10 w-10 animate-spin rounded-full border-2 border-t-transparent"
                style={{ borderColor: "var(--color-outline-variant)" }}
              />
              <p
                className="label-micro"
                style={{ color: "var(--color-on-surface-variant)", opacity: 0.6 }}
              >
                Loading Booking
              </p>
            </div>
          )}
          <iframe
            id="pabau-iframe"
            src={bookingUrl}
            title="Book your appointment with MADE Med Spa"
            loading="eager"
            onLoad={() => setIframeLoaded(true)}
            className="block w-full h-[calc(100dvh-76px)] lg:h-[calc(100dvh-120px)] scroll-mt-[76px] lg:scroll-mt-[120px]"
            style={{ border: 0 }}
            allow="payment; clipboard-write"
          />
        </div>
        <p
          className="text-xs text-center py-3 px-4"
          style={{ color: "var(--color-on-surface-variant)", opacity: 0.55 }}
        >
          Trouble seeing the booking widget?{" "}
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-editorial"
            style={{ color: "var(--color-secondary)" }}
          >
            Open booking in a new tab →
          </a>
        </p>
      </section>

      {/* WHAT TO EXPECT */}
      <section
        id="section-expect"
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
            <p className="label-micro mb-4">{expectText.eyebrow}</p>
            <h2 className="headline-narrative text-3xl md:text-5xl">
              {expectText.headline}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
            {whatToExpect.map((step) => (
              <motion.div key={step.number} variants={revealUp}>
                <div className="label-micro text-[var(--color-secondary)] mb-4">
                  {step.number}
                </div>
                <h3 className="headline-section text-xl text-[var(--color-on-surface)] mb-4">
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
      <section id="section-prep" className="bg-[var(--color-surface-low)] py-32 md:py-40 relative overflow-hidden">
        {/* Background image — desaturated, slightly more visible than about/values */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <Image
            src="/images/values-bg.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
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
            {prepText.eyebrow}
          </motion.p>
          <motion.h2 className="headline-narrative text-3xl md:text-5xl mb-12" variants={revealLeft}>
            {prepText.headline}
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
      <section id="section-policy" className="bg-[var(--color-surface)] py-32 md:py-40">
        <motion.div
          className="mx-auto max-w-3xl px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.p className="label-micro mb-4" variants={revealUp}>
            {policyText.eyebrow}
          </motion.p>
          <motion.h2 className="headline-narrative text-3xl md:text-5xl mb-12" variants={revealUp}>
            {policyText.headline}
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
      <div id="section-cta">
      <CTABanner
        dark
        headline={ctaText.headline}
        subtitle={ctaText.subtitle}
        ctaText={ctaText.cta_text}
        ctaHref={ctaText.cta_href}
        secondaryText={ctaText.secondary_text}
        secondaryHref={ctaText.secondary_href}
      />
      </div>
    </>
  );
}

"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Image from "next/image";
import { motion } from "framer-motion";
import ContactForm from "@/components/forms/ContactForm";
import { hasNavigatedWithinApp } from "@/lib/navigation";
import { useSectionContent } from "@/hooks/useSectionContent";

const ESPRESSO = "#391e1e";
const SILK = "#f6f1ea";
const GLAZE = "#e8e0d5";

const editorialEase = [0.2, 0, 0, 1] as const;

const revealUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: editorialEase },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

interface BusinessInfoSocial {
  label: string;
  href: string;
}

interface BusinessInfo {
  addressLine1: string;
  addressLine2: string;
  phone: string;
  phoneHref: string;
  email: string;
  emailHref: string;
  hours: { days: string; hours: string }[];
  socials: BusinessInfoSocial[];
}

const DEFAULT_BUSINESS_INFO: BusinessInfo = {
  addressLine1: "123 Beauty Lane, Suite 100",
  addressLine2: "City, State 12345",
  phone: "(555) 123-4567",
  phoneHref: "tel:+15551234567",
  email: "hello@mademedspa.com",
  emailHref: "mailto:hello@mademedspa.com",
  hours: [
    { days: "Monday to Friday", hours: "9:00 AM – 7:00 PM" },
    { days: "Saturday", hours: "10:00 AM – 5:00 PM" },
    { days: "Sunday", hours: "Closed" },
  ],
  socials: [
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "TikTok", href: "#" },
  ],
};

export default function ContactPageClient() {
  const skipAnimation = hasNavigatedWithinApp();
  const { data: heroText } = useSectionContent("section_contact_hero", {
    eyebrow: "Contact",
    headline: "Let's talk.",
  });
  const { data: bodyText } = useSectionContent("section_contact_body", {
    info_eyebrow: "Reach Out",
    info_headline: "Direct to the studio",
    form_eyebrow: "Send a Message",
    form_headline: "Tell us a little about you",
    form_subtitle: "We respond within 24 hours, always.",
  });
  const heroContent = useQuery(api.siteContent.getByKey, {
    key: "contact_hero",
  });
  const businessInfoEntry = useQuery(api.siteContent.getByKey, {
    key: "business_info",
  });
  const info =
    (businessInfoEntry?.metadata as unknown as BusinessInfo) ||
    DEFAULT_BUSINESS_INFO;

  return (
    <>
      {/* ──────────────────────────────────────────────
          HERO — Espresso background, Silk text
          ────────────────────────────────────────────── */}
      <section
        id="section-hero"
        className="relative pt-44 pb-28 md:pt-52 md:pb-32 px-6 overflow-hidden"
        style={{ backgroundColor: ESPRESSO }}
      >
        {/* Mocha texture background */}
        <Image
          src="/images/contact-hero-bg.png"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Light overlay for text legibility — keeps texture visible */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(57,30,30,0.15) 0%, rgba(57,30,30,0.05) 50%, rgba(57,30,30,0.2) 100%)",
          }}
        />
        <motion.div
          className="relative z-10 max-w-3xl mx-auto text-center"
          initial={skipAnimation ? "visible" : "hidden"}
          animate="visible"
          variants={staggerContainer}
        >
          <motion.span
            variants={revealUp}
            className="label-micro block mb-8"
            style={{ color: GLAZE }}
          >
            {heroText.eyebrow}
          </motion.span>

          <motion.h1
            variants={revealUp}
            className="headline-editorial text-6xl md:text-7xl lg:text-8xl mb-10"
            style={{ color: SILK }}
          >
            {heroText.headline}
          </motion.h1>

          {/* Glaze hairline */}
          <motion.div
            variants={revealUp}
            className="mx-auto h-px w-16 mb-10"
            style={{ backgroundColor: GLAZE, opacity: 0.6 }}
          />

          <motion.p
            variants={revealUp}
            className="body-editorial max-w-xl mx-auto"
            style={{ color: SILK, opacity: 0.7 }}
          >
            {heroContent?.body ||
              "A real conversation about what you want \u2014 and what you don\u2019t. Send a note below, or call the studio direct."}
          </motion.p>
        </motion.div>
      </section>

      {/* ──────────────────────────────────────────────
          BODY — Silk background, 2-column (info + form)
          ────────────────────────────────────────────── */}
      <section
        id="section-form"
        className="py-24 md:py-36 px-6"
        style={{ backgroundColor: SILK }}
      >
        <motion.div
          className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {/* ── LEFT: Contact details (2/5) ── */}
          <motion.div variants={revealUp} className="lg:col-span-2">
            <span
              className="label-micro block mb-5"
              style={{ color: GLAZE }}
            >
              {bodyText.info_eyebrow}
            </span>
            <h2
              className="headline-section text-3xl md:text-4xl mb-14"
              style={{ color: ESPRESSO }}
            >
              {bodyText.info_headline}
            </h2>

            <div className="space-y-10">
              {/* Phone — most prominent */}
              <div>
                <span
                  className="label-micro block mb-3"
                  style={{ color: ESPRESSO, opacity: 0.5 }}
                >
                  Phone
                </span>
                <a
                  href={info.phoneHref}
                  className="font-headline italic text-2xl md:text-3xl block transition-opacity duration-500 hover:opacity-60"
                  style={{ color: ESPRESSO }}
                >
                  {info.phone}
                </a>
              </div>

              {/* Email */}
              <div>
                <span
                  className="label-micro block mb-3"
                  style={{ color: ESPRESSO, opacity: 0.5 }}
                >
                  Email
                </span>
                <a
                  href={info.emailHref}
                  className="font-headline italic text-xl md:text-2xl block transition-opacity duration-500 hover:opacity-60 break-all"
                  style={{ color: ESPRESSO }}
                >
                  {info.email}
                </a>
              </div>

              {/* Studio address */}
              <div>
                <span
                  className="label-micro block mb-3"
                  style={{ color: ESPRESSO, opacity: 0.5 }}
                >
                  Studio
                </span>
                <p
                  className="body-editorial"
                  style={{ color: ESPRESSO }}
                >
                  {info.addressLine1}
                  <br />
                  {info.addressLine2}
                </p>
              </div>

              {/* Hours */}
              <div>
                <span
                  className="label-micro block mb-4"
                  style={{ color: ESPRESSO, opacity: 0.5 }}
                >
                  Hours
                </span>
                <ul className="space-y-2">
                  {info.hours.map((schedule) => (
                    <li
                      key={schedule.days}
                      className="flex justify-between gap-4 body-editorial text-sm"
                      style={{ color: ESPRESSO }}
                    >
                      <span style={{ opacity: 0.7 }}>{schedule.days}</span>
                      <span>{schedule.hours}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Socials */}
              <div className="pt-4">
                <span
                  className="label-micro block mb-4"
                  style={{ color: ESPRESSO, opacity: 0.5 }}
                >
                  Follow
                </span>
                <div className="flex gap-8">
                  {info.socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="label-micro transition-opacity duration-500 hover:opacity-100"
                      style={{ color: ESPRESSO, opacity: 0.6 }}
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: Form (3/5), glaze divider on lg+ ── */}
          <motion.div
            variants={revealUp}
            className="lg:col-span-3 lg:pl-16 lg:border-l"
            style={{ borderColor: `${GLAZE}33` }}
          >
            <span
              className="label-micro block mb-5"
              style={{ color: GLAZE }}
            >
              {bodyText.form_eyebrow}
            </span>
            <h2
              className="headline-section text-3xl md:text-4xl mb-4"
              style={{ color: ESPRESSO }}
            >
              {bodyText.form_headline}
            </h2>
            <p
              className="body-editorial mb-12"
              style={{ color: ESPRESSO, opacity: 0.65 }}
            >
              {bodyText.form_subtitle}
            </p>

            <ContactForm />
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

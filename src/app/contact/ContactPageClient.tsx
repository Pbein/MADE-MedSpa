"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import ContactForm from "@/components/forms/ContactForm";
import { hasNavigatedWithinApp } from "@/lib/navigation";

const ESPRESSO = "#391e1e";
const SILK = "#f7f6eb";
const GLAZE = "#c6a87d";

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
  email: "hello@mademedpsa.com",
  emailHref: "mailto:hello@mademedpsa.com",
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
        className="relative pt-44 pb-28 md:pt-52 md:pb-32 px-6 overflow-hidden"
        style={{ backgroundColor: "#391e1e" }}
      >
        {/* Silk texture background */}
        <img
          src="/images/contact-hero-bg.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Film grain */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            opacity: 0.05,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
          }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 75% 70% at 50% 50%, transparent 0%, rgba(30,12,12,0.35) 100%)",
          }}
        />
        <motion.div
          className="relative max-w-3xl mx-auto text-center"
          initial={skipAnimation ? "visible" : "hidden"}
          animate="visible"
          variants={staggerContainer}
        >
          <motion.span
            variants={revealUp}
            className="label-micro block mb-8"
            style={{ color: GLAZE }}
          >
            Contact
          </motion.span>

          <motion.h1
            variants={revealUp}
            className="headline-editorial text-6xl md:text-7xl lg:text-8xl mb-10"
            style={{ color: SILK }}
          >
            Let&rsquo;s <em className="font-extralight">talk</em>.
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
        className="py-24 md:py-36 px-6"
        style={{ backgroundColor: SILK }}
      >
        <motion.div
          className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-24"
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
              Reach Out
            </span>
            <h2
              className="headline-section text-3xl md:text-4xl mb-14"
              style={{ color: ESPRESSO }}
            >
              Direct to the studio
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
              Send a Message
            </span>
            <h2
              className="headline-section text-3xl md:text-4xl mb-4"
              style={{ color: ESPRESSO }}
            >
              Tell us a little about you
            </h2>
            <p
              className="body-editorial mb-12"
              style={{ color: ESPRESSO, opacity: 0.65 }}
            >
              We respond within 24 hours, always.
            </p>

            <ContactForm />
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

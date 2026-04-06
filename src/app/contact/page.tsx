"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import Link from "next/link";
import ContactForm from "@/components/forms/ContactForm";

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
    { days: "Monday - Friday", hours: "9:00 AM - 7:00 PM" },
    { days: "Saturday", hours: "10:00 AM - 5:00 PM" },
    { days: "Sunday", hours: "Closed" },
  ],
  socials: [
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "TikTok", href: "#" },
  ],
};

export default function ContactPage() {
  const heroContent = useQuery(api.siteContent.getByKey, {
    key: "contact_hero",
  });
  const businessInfoEntry = useQuery(api.siteContent.getByKey, { key: "business_info" });
  const info = (businessInfoEntry?.metadata as unknown as BusinessInfo) || DEFAULT_BUSINESS_INFO;

  return (
    <>
      {/* HERO */}
      <section
        className="section-dark relative flex min-h-[50vh] flex-col items-center justify-center px-6 text-center"
      >
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
            Contact
          </motion.div>

          <motion.h1
            variants={revealUp}
            className="headline-text mb-6"
            style={{
              fontSize: "var(--text-5xl)",
              color: "var(--color-soft-ivory)",
            }}
          >
            Get <span className="accent-text" style={{ color: "var(--color-accent)" }}>In Touch</span>
          </motion.h1>

          <motion.p
            variants={revealUp}
            className="mx-auto max-w-xl leading-relaxed"
            style={{ fontSize: "var(--text-lg)", color: "rgba(247, 246, 235, 0.7)", fontWeight: 300 }}
          >
            {heroContent?.body ||
              "We would love to hear from you. Whether you have a question about our services, want to book an appointment, or simply want to say hello."}
          </motion.p>
        </motion.div>
      </section>

      {/* FORM + INFO */}
      <section
        className="px-6 lg:px-10"
        style={{
          backgroundColor: "var(--color-soft-ivory)",
          paddingTop: "var(--space-section-lg)",
          paddingBottom: "var(--space-section-lg)",
        }}
      >
        <div className="mx-auto grid max-w-[var(--max-width)] gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={revealLeft}
          >
            <div className="editorial-spacing mb-4" style={{ color: "var(--color-cream)" }}>
              Send a Message
            </div>
            <h2
              className="headline-text mb-10"
              style={{
                fontSize: "var(--text-3xl)",
                color: "var(--color-deep-cocoa)",
              }}
            >
              We are here to <span className="accent-text" style={{ color: "var(--color-accent-text)" }}>help</span>
            </h2>

            <ContactForm />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={revealRight} className="mb-10">
              <h3 className="editorial-spacing mb-4" style={{ color: "var(--color-cream)" }}>
                Visit Us
              </h3>
              <p className="leading-relaxed" style={{ fontSize: "var(--text-base)", color: "var(--color-warm-taupe)", fontWeight: 300 }}>
                {info.addressLine1}
                <br />
                {info.addressLine2}
              </p>
            </motion.div>

            <motion.div variants={revealRight} className="mb-10 h-[1px] w-full" style={{ backgroundColor: "var(--color-border)" }} />

            <motion.div variants={revealRight} className="mb-10">
              <h3 className="editorial-spacing mb-4" style={{ color: "var(--color-cream)" }}>
                Reach Out
              </h3>
              <div className="flex flex-col gap-3">
                <a
                  href={info.phoneHref}
                  className="inline-flex items-center gap-3 transition-colors hover:text-[var(--color-accent-text)]"
                  style={{ fontSize: "var(--text-base)", color: "var(--color-warm-taupe)", transitionDuration: "var(--duration-fast)" }}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border text-xs" style={{ borderColor: "var(--color-border)" }}>
                    P
                  </span>
                  {info.phone}
                </a>
                <a
                  href={info.emailHref}
                  className="inline-flex items-center gap-3 transition-colors hover:text-[var(--color-accent-text)]"
                  style={{ fontSize: "var(--text-base)", color: "var(--color-warm-taupe)", transitionDuration: "var(--duration-fast)" }}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border text-xs" style={{ borderColor: "var(--color-border)" }}>
                    E
                  </span>
                  {info.email}
                </a>
              </div>
            </motion.div>

            <motion.div variants={revealRight} className="mb-10 h-[1px] w-full" style={{ backgroundColor: "var(--color-border)" }} />

            <motion.div variants={revealRight} className="mb-10">
              <h3 className="editorial-spacing mb-4" style={{ color: "var(--color-cream)" }}>
                Hours
              </h3>
              <ul className="flex flex-col gap-2">
                {info.hours.map((schedule) => (
                  <li
                    key={schedule.days}
                    className="flex items-center justify-between"
                    style={{ fontSize: "var(--text-sm)", color: "var(--color-warm-taupe)" }}
                  >
                    <span>{schedule.days}</span>
                    <span
                      className="accent-text"
                      style={{
                        fontStyle: schedule.hours === "Closed" ? "italic" : "normal",
                        color: schedule.hours === "Closed" ? "var(--color-cream)" : "var(--color-warm-taupe)",
                      }}
                    >
                      {schedule.hours}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={revealRight} className="mb-10 h-[1px] w-full" style={{ backgroundColor: "var(--color-border)" }} />

            <motion.div variants={revealRight}>
              <h3 className="editorial-spacing mb-4" style={{ color: "var(--color-cream)" }}>
                Follow Us
              </h3>
              <div className="flex gap-4">
                {info.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border text-xs transition-all hover:border-[var(--color-accent-text)] hover:text-[var(--color-accent-text)]"
                    style={{
                      borderColor: "var(--color-border)",
                      color: "var(--color-warm-taupe)",
                      transitionDuration: "var(--duration-normal)",
                      transitionTimingFunction: "var(--ease-smooth)",
                    }}
                  >
                    {social.label[0]}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="section-dark px-6 text-center lg:px-10"
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
          className="mx-auto max-w-2xl"
        >
          <motion.div
            variants={revealUp}
            className="accent-line mx-auto mb-8"
            style={{ backgroundColor: "var(--color-accent-light)" }}
          />

          <motion.h2
            variants={revealUp}
            className="headline-text mb-6"
            style={{ fontSize: "var(--text-4xl)" }}
          >
            Ready to begin your{" "}
            <span className="accent-text" style={{ color: "var(--color-accent)" }}>journey</span>?
          </motion.h2>

          <motion.p
            variants={revealUp}
            className="mx-auto mb-10 max-w-lg leading-relaxed"
            style={{ fontSize: "var(--text-lg)", color: "rgba(247, 246, 235, 0.6)", fontWeight: 300 }}
          >
            Skip the form and book directly. Our team is ready to welcome you.
          </motion.p>

          <motion.div
            variants={revealUp}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link href="/booking" className="btn btn-light">
              Book an Appointment
            </Link>
            <Link href="/services" className="btn btn-light-outline">
              Explore Services
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import Link from "next/link";
import ContactForm from "@/components/forms/ContactForm";

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

/* ── Contact info ──────────────────────────────────── */
const contactInfo = {
  address: {
    line1: "123 Beauty Lane, Suite 100",
    line2: "City, State 12345",
  },
  phone: "(555) 123-4567",
  phoneHref: "tel:+15551234567",
  email: "hello@mademedpsa.com",
  emailHref: "mailto:hello@mademedpsa.com",
};

const businessHours = [
  { days: "Monday - Friday", hours: "9:00 AM - 7:00 PM" },
  { days: "Saturday", hours: "10:00 AM - 5:00 PM" },
  { days: "Sunday", hours: "Closed" },
];

const socials = [
  { label: "Instagram", initial: "I", href: "#" },
  { label: "Facebook", initial: "F", href: "#" },
  { label: "TikTok", initial: "T", href: "#" },
];

/* ── Page Component ────────────────────────────────── */
export default function ContactPage() {
  const heroContent = useQuery(api.siteContent.getByKey, {
    key: "contact_hero",
  });

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
            Contact
          </motion.div>

          <motion.h1
            variants={revealUp}
            className="headline-text mb-6"
            style={{
              fontSize: "var(--text-5xl)",
              color: "var(--color-chocolate)",
            }}
          >
            Get <span className="accent-text">In Touch</span>
          </motion.h1>

          <motion.p
            variants={revealUp}
            className="mx-auto max-w-xl leading-relaxed text-[var(--color-brown)]"
            style={{ fontSize: "var(--text-lg)" }}
          >
            {heroContent?.body ||
              "We would love to hear from you. Whether you have a question about our services, want to book an appointment, or simply want to say hello."}
          </motion.p>
        </motion.div>
      </section>

      {/* ═══════════════ FORM + INFO ═══════════════ */}
      <section
        className="px-6 lg:px-10"
        style={{
          backgroundColor: "var(--color-cream)",
          paddingTop: "var(--space-section)",
          paddingBottom: "var(--space-section)",
        }}
      >
        <div className="mx-auto grid max-w-[var(--max-width)] gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          {/* ── Left: Contact Form ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={revealLeft}
          >
            <div className="editorial-spacing mb-4 text-[var(--color-stone-dark)]">
              Send a Message
            </div>
            <h2
              className="headline-text mb-10"
              style={{
                fontSize: "var(--text-3xl)",
                color: "var(--color-chocolate)",
              }}
            >
              We are here to <span className="accent-text">help</span>
            </h2>

            <ContactForm />
          </motion.div>

          {/* ── Right: Contact Info ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {/* Address */}
            <motion.div variants={revealRight} className="mb-10">
              <h3
                className="editorial-spacing mb-4 text-[var(--color-stone-dark)]"
              >
                Visit Us
              </h3>
              <p
                className="leading-relaxed text-[var(--color-brown)]"
                style={{ fontSize: "var(--text-base)" }}
              >
                {contactInfo.address.line1}
                <br />
                {contactInfo.address.line2}
              </p>
            </motion.div>

            {/* Divider */}
            <motion.div
              variants={revealRight}
              className="mb-10 h-[1px] w-full"
              style={{ backgroundColor: "var(--color-stone)" }}
            />

            {/* Phone & Email */}
            <motion.div variants={revealRight} className="mb-10">
              <h3
                className="editorial-spacing mb-4 text-[var(--color-stone-dark)]"
              >
                Reach Out
              </h3>
              <div className="flex flex-col gap-3">
                <a
                  href={contactInfo.phoneHref}
                  className="inline-flex items-center gap-3 text-[var(--color-brown)] transition-colors hover:text-[var(--color-accent-text)]"
                  style={{
                    fontSize: "var(--text-base)",
                    transitionDuration: "var(--duration-fast)",
                  }}
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full border text-xs"
                    style={{ borderColor: "var(--color-stone)" }}
                  >
                    P
                  </span>
                  {contactInfo.phone}
                </a>
                <a
                  href={contactInfo.emailHref}
                  className="inline-flex items-center gap-3 text-[var(--color-brown)] transition-colors hover:text-[var(--color-accent-text)]"
                  style={{
                    fontSize: "var(--text-base)",
                    transitionDuration: "var(--duration-fast)",
                  }}
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full border text-xs"
                    style={{ borderColor: "var(--color-stone)" }}
                  >
                    E
                  </span>
                  {contactInfo.email}
                </a>
              </div>
            </motion.div>

            {/* Divider */}
            <motion.div
              variants={revealRight}
              className="mb-10 h-[1px] w-full"
              style={{ backgroundColor: "var(--color-stone)" }}
            />

            {/* Business Hours */}
            <motion.div variants={revealRight} className="mb-10">
              <h3
                className="editorial-spacing mb-4 text-[var(--color-stone-dark)]"
              >
                Hours
              </h3>
              <ul className="flex flex-col gap-2">
                {businessHours.map((schedule) => (
                  <li
                    key={schedule.days}
                    className="flex items-center justify-between text-[var(--color-brown)]"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    <span>{schedule.days}</span>
                    <span
                      className="accent-text"
                      style={{
                        fontStyle: schedule.hours === "Closed" ? "italic" : "normal",
                        color:
                          schedule.hours === "Closed"
                            ? "var(--color-stone-dark)"
                            : "var(--color-brown)",
                      }}
                    >
                      {schedule.hours}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Divider */}
            <motion.div
              variants={revealRight}
              className="mb-10 h-[1px] w-full"
              style={{ backgroundColor: "var(--color-stone)" }}
            />

            {/* Social Media */}
            <motion.div variants={revealRight}>
              <h3
                className="editorial-spacing mb-4 text-[var(--color-stone-dark)]"
              >
                Follow Us
              </h3>
              <div className="flex gap-4">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border text-xs text-[var(--color-brown)] transition-all hover:border-[var(--color-accent-text)] hover:text-[var(--color-accent-text)]"
                    style={{
                      borderColor: "var(--color-stone)",
                      transitionDuration: "var(--duration-normal)",
                      transitionTimingFunction: "var(--ease-smooth)",
                    }}
                  >
                    {social.initial}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
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
            style={{ backgroundColor: "var(--color-burgundy-light)" }}
          />

          <motion.h2
            variants={revealUp}
            className="headline-text mb-6"
            style={{ fontSize: "var(--text-4xl)" }}
          >
            Ready to begin your{" "}
            <span className="accent-text">journey</span>?
          </motion.h2>

          <motion.p
            variants={revealUp}
            className="mx-auto mb-10 max-w-lg leading-relaxed text-[var(--color-stone)]"
            style={{ fontSize: "var(--text-lg)" }}
          >
            Skip the form and book directly. Our team is ready to welcome you.
          </motion.p>

          <motion.div
            variants={revealUp}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link href="/booking" className="btn btn-accent">
              Book an Appointment
            </Link>
            <Link href="/services" className="btn btn-outline" style={{ borderColor: "var(--color-stone-dark)", color: "var(--color-stone)" }}>
              Explore Services
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

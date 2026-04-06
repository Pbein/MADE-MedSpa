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
            Contact
          </motion.p>

          <motion.h1
            variants={revealUp}
            className="headline-display mb-6"
            style={{ color: "var(--color-glaze)" }}
          >
            Get{" "}
            <span style={{ color: "var(--color-matcha)" }}>In Touch</span>
          </motion.h1>

          <motion.p
            variants={revealUp}
            className="body-lg mx-auto max-w-xl"
            style={{ color: "rgba(247,246,235,0.65)" }}
          >
            {heroContent?.body ||
              "We would love to hear from you. Whether you have a question about our services, want to book an appointment, or simply want to say hello."}
          </motion.p>
        </motion.div>
      </section>

      {/* FORM + SIDEBAR — Glaze */}
      <section className="section-light px-6 lg:px-10">
        <div className="container-page grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-24">
          {/* Form column */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={revealLeft}
          >
            <p className="eyebrow-muted mb-4">Send a Message</p>
            <h2 className="headline-section mb-10" style={{ color: "var(--color-ink)" }}>
              We are here to{" "}
              <span style={{ color: "var(--color-matcha)" }}>help</span>
            </h2>

            <ContactForm />
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="rounded-2xl p-8 lg:p-10"
            style={{
              backgroundColor: "var(--color-silk)",
              border: "1px solid var(--color-line)",
            }}
          >
            {/* Visit Us */}
            <motion.div variants={revealRight} className="mb-8">
              <h3
                className="eyebrow mb-4"
                style={{ color: "var(--color-ink)" }}
              >
                Visit Us
              </h3>
              <p className="body-md" style={{ color: "var(--color-olive)" }}>
                {info.addressLine1}
                <br />
                {info.addressLine2}
              </p>
            </motion.div>

            <motion.div
              variants={revealRight}
              className="mb-8 h-[1px] w-full"
              style={{ backgroundColor: "var(--color-line)" }}
            />

            {/* Reach Out */}
            <motion.div variants={revealRight} className="mb-8">
              <h3
                className="eyebrow mb-4"
                style={{ color: "var(--color-ink)" }}
              >
                Reach Out
              </h3>
              <div className="flex flex-col gap-3">
                <a
                  href={info.phoneHref}
                  className="link-accent inline-flex items-center gap-3"
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full border text-xs"
                    style={{ borderColor: "var(--color-line)" }}
                  >
                    P
                  </span>
                  {info.phone}
                </a>
                <a
                  href={info.emailHref}
                  className="link-accent inline-flex items-center gap-3"
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full border text-xs"
                    style={{ borderColor: "var(--color-line)" }}
                  >
                    E
                  </span>
                  {info.email}
                </a>
              </div>
            </motion.div>

            <motion.div
              variants={revealRight}
              className="mb-8 h-[1px] w-full"
              style={{ backgroundColor: "var(--color-line)" }}
            />

            {/* Hours */}
            <motion.div variants={revealRight} className="mb-8">
              <h3
                className="eyebrow mb-4"
                style={{ color: "var(--color-ink)" }}
              >
                Hours
              </h3>
              <ul className="flex flex-col gap-2">
                {info.hours.map((schedule) => (
                  <li
                    key={schedule.days}
                    className="body-md flex items-center justify-between"
                    style={{ color: "var(--color-olive)" }}
                  >
                    <span>{schedule.days}</span>
                    <span
                      style={{
                        fontStyle:
                          schedule.hours === "Closed" ? "italic" : "normal",
                        color:
                          schedule.hours === "Closed"
                            ? "var(--color-mocha)"
                            : "var(--color-olive)",
                      }}
                    >
                      {schedule.hours}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={revealRight}
              className="mb-8 h-[1px] w-full"
              style={{ backgroundColor: "var(--color-line)" }}
            />

            {/* Follow Us */}
            <motion.div variants={revealRight}>
              <h3
                className="eyebrow mb-4"
                style={{ color: "var(--color-ink)" }}
              >
                Follow Us
              </h3>
              <div className="flex gap-4">
                {info.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border text-xs transition-all hover:border-[var(--color-blush)] hover:text-[var(--color-blush)]"
                    style={{
                      borderColor: "var(--color-line)",
                      color: "var(--color-olive)",
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

      {/* CTA — Espresso */}
      <section
        className="section-dark px-6 text-center lg:px-10"
        style={{ backgroundColor: "var(--color-espresso)" }}
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
            className="headline-section mb-6"
            style={{ color: "var(--color-glaze)" }}
          >
            Ready to begin your{" "}
            <span style={{ color: "var(--color-matcha)" }}>journey</span>?
          </motion.h2>

          <motion.p
            variants={revealUp}
            className="body-lg mx-auto mb-10 max-w-lg"
            style={{ color: "rgba(247,246,235,0.65)" }}
          >
            Skip the form and book directly. Our team is ready to welcome you.
          </motion.p>

          <motion.div
            variants={revealUp}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link href="/booking" className="btn-primary">
              Book an Appointment
            </Link>
            <Link href="/services" className="btn-secondary">
              Explore Services
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

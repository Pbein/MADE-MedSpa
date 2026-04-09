"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import Link from "next/link";
import ContactForm from "@/components/forms/ContactForm";

const editorialEase = [0.2, 0, 0, 1] as const;

const revealUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: editorialEase } },
};

const revealLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: editorialEase } },
};

const revealRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: editorialEase } },
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
            Contact
          </motion.p>

          <motion.h1
            className="headline-editorial text-[var(--color-surface)]"
            variants={revealUp}
          >
            Get In Touch
          </motion.h1>

          <motion.p
            className="body-editorial mt-6 max-w-2xl mx-auto text-[var(--color-surface)] opacity-60"
            variants={revealUp}
          >
            {heroContent?.body ||
              "We would love to hear from you. Whether you have a question about our services, want to book an appointment, or simply want to say hello."}
          </motion.p>
        </motion.div>
      </section>

      {/* FORM + SIDEBAR */}
      <section className="bg-[var(--color-surface)] py-40">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Form column */}
          <motion.div
            className="lg:col-span-7"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={revealLeft}
          >
            <p className="label-micro mb-4">Send a Message</p>
            <h2 className="headline-section mb-12">
              We are here to help
            </h2>

            <ContactForm />
          </motion.div>

          {/* Sidebar */}
          <motion.div
            className="lg:col-span-5 bg-[var(--color-surface-low)] p-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {/* Visit Us */}
            <motion.div className="mb-10" variants={revealRight}>
              <h3 className="label-micro mb-3">Visit Us</h3>
              <p className="body-editorial text-[var(--color-on-surface-variant)]">
                {info.addressLine1}
                <br />
                {info.addressLine2}
              </p>
            </motion.div>

            {/* Reach Out */}
            <motion.div className="mb-10" variants={revealRight}>
              <h3 className="label-micro mb-3">Reach Out</h3>
              <div className="space-y-2">
                <a
                  href={info.phoneHref}
                  className="link-editorial block text-[var(--color-on-surface-variant)]"
                >
                  <span className="label-micro mr-3 inline-block w-4">P</span>
                  {info.phone}
                </a>
                <a
                  href={info.emailHref}
                  className="link-editorial block text-[var(--color-on-surface-variant)]"
                >
                  <span className="label-micro mr-3 inline-block w-4">E</span>
                  {info.email}
                </a>
              </div>
            </motion.div>

            {/* Hours */}
            <motion.div className="mb-10" variants={revealRight}>
              <h3 className="label-micro mb-3">Hours</h3>
              <ul className="space-y-2">
                {info.hours.map((schedule) => (
                  <li
                    key={schedule.days}
                    className="flex justify-between body-editorial text-[var(--color-on-surface-variant)]"
                  >
                    <span>{schedule.days}</span>
                    <span>{schedule.hours}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Follow Us */}
            <motion.div variants={revealRight}>
              <h3 className="label-micro mb-3">Follow Us</h3>
              <div className="flex gap-4">
                {info.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="link-ghost text-[var(--color-on-surface-variant)] transition-colors duration-500 ease-[cubic-bezier(0.2,0,0,1)] hover:text-[var(--color-on-surface)]"
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
      <section className="bg-[var(--color-primary)] py-40">
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
            Ready to begin your journey?
          </motion.h2>

          <motion.p
            className="body-editorial mt-6 max-w-xl mx-auto text-[var(--color-on-primary)] opacity-60"
            variants={revealUp}
          >
            Skip the form and book directly. Our team is ready to welcome you.
          </motion.p>

          <motion.div className="mt-10 flex items-center justify-center gap-6" variants={revealUp}>
            <Link href="/booking" className="btn-light">
              Book an Appointment
            </Link>
            <Link href="/services" className="link-ghost text-[var(--color-on-primary)] opacity-70">
              Explore Services
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

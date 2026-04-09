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
      <section>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p variants={revealUp}>
            Contact
          </motion.p>

          <motion.h1 variants={revealUp}>
            Get In Touch
          </motion.h1>

          <motion.p variants={revealUp}>
            {heroContent?.body ||
              "We would love to hear from you. Whether you have a question about our services, want to book an appointment, or simply want to say hello."}
          </motion.p>
        </motion.div>
      </section>

      {/* FORM + SIDEBAR */}
      <section>
        <div>
          {/* Form column */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={revealLeft}
          >
            <p>Send a Message</p>
            <h2>
              We are here to help
            </h2>

            <ContactForm />
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {/* Visit Us */}
            <motion.div variants={revealRight}>
              <h3>Visit Us</h3>
              <p>
                {info.addressLine1}
                <br />
                {info.addressLine2}
              </p>
            </motion.div>

            <motion.div variants={revealRight} />

            {/* Reach Out */}
            <motion.div variants={revealRight}>
              <h3>Reach Out</h3>
              <div>
                <a href={info.phoneHref}>
                  <span>P</span>
                  {info.phone}
                </a>
                <a href={info.emailHref}>
                  <span>E</span>
                  {info.email}
                </a>
              </div>
            </motion.div>

            <motion.div variants={revealRight} />

            {/* Hours */}
            <motion.div variants={revealRight}>
              <h3>Hours</h3>
              <ul>
                {info.hours.map((schedule) => (
                  <li key={schedule.days}>
                    <span>{schedule.days}</span>
                    <span>{schedule.hours}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={revealRight} />

            {/* Follow Us */}
            <motion.div variants={revealRight}>
              <h3>Follow Us</h3>
              <div>
                {info.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
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
      <section>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={revealUp} />

          <motion.h2 variants={revealUp}>
            Ready to begin your journey?
          </motion.h2>

          <motion.p variants={revealUp}>
            Skip the form and book directly. Our team is ready to welcome you.
          </motion.p>

          <motion.div variants={revealUp}>
            <Link href="/booking">
              Book an Appointment
            </Link>
            <Link href="/services">
              Explore Services
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

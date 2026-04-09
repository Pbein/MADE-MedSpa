"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import Link from "next/link";

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

const FALLBACK_TEAM = [
  {
    name: "Dr. Karlyne",
    title: "Founder & Medical Director",
    bio: "Board-certified physician with over 15 years of experience in aesthetic medicine, dedicated to enhancing natural beauty through precision and artistry.",
  },
  {
    name: "Sophia Laurent",
    title: "Lead Aesthetic Nurse Practitioner",
    bio: "Specializing in advanced injectables and facial rejuvenation, Sophia brings an artist's eye and a scientist's precision to every treatment.",
  },
  {
    name: "Mia Chen",
    title: "Licensed Esthetician",
    bio: "With certifications in clinical skincare and holistic wellness, Mia curates personalized treatment plans that nourish skin from within.",
  },
  {
    name: "Olivia Hart",
    title: "Patient Experience Coordinator",
    bio: "Olivia ensures every visit feels effortless and luxurious, guiding guests through their aesthetic journey with warmth and expertise.",
  },
];

const values = [
  {
    number: "01",
    title: "Artistry",
    description:
      "We approach every treatment as a work of art, celebrating the unique canvas of each individual.",
  },
  {
    number: "02",
    title: "Integrity",
    description:
      "Honest consultations, transparent pricing, and treatments recommended solely for your benefit.",
  },
  {
    number: "03",
    title: "Excellence",
    description:
      "Relentless pursuit of the highest standards in technique, technology, and patient care.",
  },
];

export default function AboutPage() {
  const dbTeam = useQuery(api.teamMembers.list);
  const teamMembers = dbTeam && dbTeam.length > 0 ? dbTeam : FALLBACK_TEAM;
  const story = useQuery(api.siteContent.getByKey, { key: "about_story" });
  const mission = useQuery(api.siteContent.getByKey, { key: "about_mission" });
  const valuesContent = useQuery(api.siteContent.getByKey, {
    key: "about_values",
  });

  return (
    <>
      {/* HERO */}
      <section
        className="pt-48 pb-40 px-6"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.span
            variants={revealUp}
            className="label-micro block mb-6"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            About MADE
          </motion.span>

          <motion.h1
            variants={revealUp}
            className="headline-editorial text-5xl md:text-8xl mb-8"
            style={{ color: "var(--color-primary)" }}
          >
            The Art of Intentional Beauty
          </motion.h1>

          <motion.p
            variants={revealUp}
            className="body-editorial max-w-2xl mx-auto"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            A luxury aesthetic studio built on the belief that beauty is
            personal, science is essential, and every detail matters.
          </motion.p>
        </motion.div>
      </section>

      {/* STORY */}
      <section
        className="py-32 px-6"
        style={{ backgroundColor: "var(--color-surface-low)" }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={revealLeft}
            className="md:col-span-5"
          >
            <div
              className="image-editorial aspect-[4/5] w-full"
              style={{
                backgroundColor: "var(--color-surface-highest)",
                boxShadow: "12px 12px 40px rgba(32,10,10,0.06)",
              }}
            >
              <img
                src="/placeholder.svg"
                alt="MADE Med Spa studio interior"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="md:col-span-7"
          >
            <motion.span
              variants={revealRight}
              className="label-micro block mb-4"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Our Beginning
            </motion.span>

            <motion.h2
              variants={revealRight}
              className="headline-section text-3xl md:text-5xl mb-8"
              style={{ color: "var(--color-primary)" }}
            >
              {story?.title || "Founded on Passion"}
            </motion.h2>

            <motion.div
              variants={revealRight}
              className="space-y-6"
            >
              {story?.body ? (
                story.body.split("\n\n").map((paragraph, i) => (
                  <p
                    key={i}
                    className="body-editorial"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  >
                    {paragraph}
                  </p>
                ))
              ) : (
                <>
                  <p
                    className="body-editorial"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  >
                    MADE was born from a vision to create a space where aesthetic
                    medicine meets genuine artistry. Our founder believed that
                    true beauty enhancement requires more than technical
                    skill&mdash;it demands an understanding of each
                    individual&rsquo;s unique features, aspirations, and story.
                  </p>
                  <p
                    className="body-editorial"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  >
                    Every treatment at MADE is thoughtfully designed, never
                    rushed. We take the time to listen, to understand, and to
                    craft results that feel authentically you. Because at MADE,
                    beauty is never one-size-fits-all.
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* MISSION */}
      <section
        className="py-32 px-6"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.span
            variants={revealUp}
            className="label-micro block mb-4"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Our Mission
          </motion.span>

          <motion.h2
            variants={revealUp}
            className="headline-section text-3xl md:text-5xl mb-8"
            style={{ color: "var(--color-primary)" }}
          >
            {mission?.title || "Elevating Natural Beauty"}
          </motion.h2>

          <motion.p
            variants={revealUp}
            className="body-editorial"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            {mission?.body ||
              "To empower every guest with confidence through personalized, science-backed aesthetic treatments delivered in an atmosphere of warmth, luxury, and unwavering care."}
          </motion.p>
        </motion.div>
      </section>

      {/* VALUES */}
      <section
        className="py-32 px-6"
        style={{ backgroundColor: "var(--color-surface-highest)" }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={revealUp} className="text-center mb-20">
            <span
              className="label-micro block mb-4"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              {valuesContent?.title || "What Guides Us"}
            </span>
            <h2
              className="headline-section text-3xl md:text-5xl"
              style={{ color: "var(--color-primary)" }}
            >
              Our Values
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {values.map((value) => (
              <motion.div key={value.number} variants={revealUp}>
                <div
                  className="label-micro text-2xl mb-4"
                  style={{ color: "var(--color-secondary)" }}
                >
                  {value.number}
                </div>
                <h3
                  className="font-headline italic text-2xl mb-4"
                  style={{ color: "var(--color-primary)" }}
                >
                  {value.title}
                </h3>
                <p
                  className="body-editorial"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>

          {valuesContent?.body && (
            <motion.p
              variants={revealUp}
              className="body-editorial text-center mt-16 max-w-2xl mx-auto"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              {valuesContent.body}
            </motion.p>
          )}
        </motion.div>
      </section>

      {/* TEAM */}
      <section
        className="py-32 px-6"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.span
              variants={revealUp}
              className="label-micro block mb-4"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              The Team
            </motion.span>
            <motion.h2
              variants={revealUp}
              className="headline-section text-3xl md:text-5xl"
              style={{ color: "var(--color-primary)" }}
            >
              Meet the Experts
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12"
          >
            {teamMembers.map((member) => (
              <motion.div key={member.name} variants={revealUp}>
                {/* Portrait placeholder */}
                <div
                  className="image-editorial aspect-[3/4] w-full mb-6 flex items-center justify-center"
                  style={{
                    backgroundColor: "var(--color-surface-low)",
                    boxShadow: "8px 8px 30px rgba(32,10,10,0.06)",
                  }}
                >
                  <span
                    className="font-headline italic text-4xl"
                    style={{ color: "var(--color-outline-variant)" }}
                  >
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>

                <div>
                  <h3
                    className="label-micro text-sm mb-1"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {member.name}
                  </h3>
                  <p
                    className="text-sm mb-3"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  >
                    {member.title}
                  </p>
                  <p
                    className="body-editorial text-sm"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  >
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-32 px-6"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h2
            variants={revealUp}
            className="headline-section text-3xl md:text-5xl mb-8"
            style={{ color: "var(--color-surface)" }}
          >
            Ready to experience the MADE difference?
          </motion.h2>

          <motion.p
            variants={revealUp}
            className="body-editorial mb-12"
            style={{ color: "var(--color-outline-variant)" }}
          >
            Your journey to elevated beauty begins with a single conversation.
            Let us craft a personalized plan just for you.
          </motion.p>

          <motion.div variants={revealUp}>
            <Link
              href="/booking"
              className="btn-light inline-block"
            >
              Book Consultation
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

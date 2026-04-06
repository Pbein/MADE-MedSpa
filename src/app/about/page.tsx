"use client";

import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { demoImages } from "@/lib/demo-images";

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
      {/* HERO — Glaze */}
      <section
        className="section-light relative flex min-h-[70vh] flex-col items-center justify-center text-center"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="container-page pt-[var(--nav-height)]"
        >
          <motion.span
            variants={revealUp}
            className="eyebrow mb-6 block"
          >
            About MADE
          </motion.span>

          <motion.h1
            variants={revealUp}
            className="headline-display mb-6"
          >
            Our{" "}
            <span style={{ color: "var(--color-blush)" }}>Story</span>
          </motion.h1>

          <motion.p
            variants={revealUp}
            className="body-lg mx-auto max-w-xl"
            style={{ color: "var(--color-mocha)" }}
          >
            A luxury aesthetic studio built on the belief that beauty is
            personal, science is essential, and every detail matters.
          </motion.p>
        </motion.div>

        <div
          className="absolute bottom-8 left-1/2 h-12 w-[1px] -translate-x-1/2"
          style={{ backgroundColor: "var(--color-line)" }}
        />
      </section>

      {/* STORY — Silk */}
      <section className="section-alt">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={revealLeft}
            className="image-warm overflow-hidden"
            style={{
              borderRadius: "var(--radius-lg, 1rem)",
              aspectRatio: "4/5",
            }}
          >
            <Image
              src={demoImages.about.clinicInterior}
              alt="MADE Med Spa studio interior"
              width={960}
              height={1200}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.span
              variants={revealRight}
              className="eyebrow-muted mb-4 block"
            >
              Our Beginning
            </motion.span>

            <motion.h2
              variants={revealRight}
              className="headline-section mb-6"
            >
              {story?.title || "Founded on Passion"}
            </motion.h2>

            <motion.div
              variants={revealRight}
              className="body-lg space-y-4"
              style={{ color: "var(--color-mocha)" }}
            >
              {story?.body ? (
                story.body.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))
              ) : (
                <>
                  <p>
                    MADE was born from a vision to create a space where aesthetic
                    medicine meets genuine artistry. Our founder believed that
                    true beauty enhancement requires more than technical
                    skill&mdash;it demands an understanding of each
                    individual&rsquo;s unique features, aspirations, and story.
                  </p>
                  <p>
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

      {/* MISSION — Glaze */}
      <section className="section-light">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="container-page mx-auto max-w-2xl text-center"
        >
          <motion.div
            variants={revealUp}
            className="accent-line mx-auto mb-8"
          />

          <motion.span
            variants={revealUp}
            className="eyebrow mb-4 block"
          >
            Our Mission
          </motion.span>

          <motion.h2
            variants={revealUp}
            className="headline-section mb-8"
          >
            {mission?.title || "Elevating Natural Beauty"}
          </motion.h2>

          <motion.p
            variants={revealUp}
            className="body-lg"
            style={{ color: "var(--color-mocha)" }}
          >
            {mission?.body ||
              "To empower every guest with confidence through personalized, science-backed aesthetic treatments delivered in an atmosphere of warmth, luxury, and unwavering care."}
          </motion.p>
        </motion.div>
      </section>

      {/* VALUES — Silk */}
      <section className="section-alt">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="container-page"
        >
          <motion.div
            variants={revealUp}
            className="mb-20 text-center"
          >
            <span className="eyebrow mb-4 block">
              {valuesContent?.title || "What Guides Us"}
            </span>
            <h2 className="headline-section">
              Our Values
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-16">
            {values.map((value) => (
              <motion.div
                key={value.number}
                variants={revealUp}
                className="text-center"
              >
                <div
                  className="mx-auto mb-6"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "clamp(2rem, 1.5rem + 2vw, 3rem)",
                    fontWeight: 200,
                    color: "var(--color-matcha)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {value.number}
                </div>
                <h3
                  className="headline-section mb-4"
                  style={{ fontSize: "clamp(1.25rem, 1rem + 0.5vw, 1.5rem)" }}
                >
                  {value.title}
                </h3>
                <p
                  className="body-md mx-auto max-w-xs"
                  style={{ color: "var(--color-mocha)" }}
                >
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>

          {valuesContent?.body && (
            <motion.p
              variants={revealUp}
              className="body-md mx-auto mt-12 max-w-xl text-center"
              style={{ color: "var(--color-mocha)" }}
            >
              {valuesContent.body}
            </motion.p>
          )}
        </motion.div>
      </section>

      {/* TEAM — Glaze */}
      <section className="section-light">
        <div className="container-page">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-20 text-center"
          >
            <motion.span
              variants={revealUp}
              className="eyebrow mb-4 block"
            >
              The Team
            </motion.span>
            <motion.h2
              variants={revealUp}
              className="headline-section"
            >
              Meet the{" "}
              <span style={{ color: "var(--color-blush)" }}>Experts</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                variants={revealUp}
                className="card-luxury hover-lift group text-center"
              >
                {/* Initials circle */}
                <div
                  className="mx-auto mb-6 flex items-center justify-center rounded-full"
                  style={{
                    width: "5rem",
                    height: "5rem",
                    backgroundColor: "var(--color-blush)",
                    color: "var(--color-white-soft)",
                    fontFamily: "var(--font-display)",
                    fontSize: "1.5rem",
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                    marginTop: "2rem",
                  }}
                >
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                <div style={{ padding: "0 1.5rem 2rem" }}>
                  <h3
                    className="headline-section mb-1"
                    style={{ fontSize: "1.25rem" }}
                  >
                    {member.name}
                  </h3>
                  <p
                    className="eyebrow-muted mb-3"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {member.title}
                  </p>
                  <p
                    className="body-md"
                    style={{ color: "var(--color-mocha)" }}
                  >
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA — Espresso */}
      <section className="section-dark text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="container-page mx-auto max-w-2xl"
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
            Ready to{" "}
            <span style={{ color: "var(--color-blush)" }}>experience</span>{" "}
            the MADE difference?
          </motion.h2>

          <motion.p
            variants={revealUp}
            className="body-lg mx-auto mb-10 max-w-lg"
            style={{ color: "var(--color-mocha)" }}
          >
            Your journey to elevated beauty begins with a single conversation.
            Let us craft a personalized plan just for you.
          </motion.p>

          <motion.div variants={revealUp}>
            <Link href="/booking" className="btn-primary">
              Book Consultation
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

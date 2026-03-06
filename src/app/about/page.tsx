"use client";

import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { demoImages } from "@/lib/demo-images";

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

/* ── Team data (hardcoded for now) ─────────────────── */
const teamMembers = [
  {
    name: "Dr. Karlyne",
    title: "Founder & Medical Director",
    bio: "Board-certified physician with over 15 years of experience in aesthetic medicine, dedicated to enhancing natural beauty through precision and artistry.",
    initials: "DK",
  },
  {
    name: "Sophia Laurent",
    title: "Lead Aesthetic Nurse Practitioner",
    bio: "Specializing in advanced injectables and facial rejuvenation, Sophia brings an artist's eye and a scientist's precision to every treatment.",
    initials: "SL",
  },
  {
    name: "Mia Chen",
    title: "Licensed Esthetician",
    bio: "With certifications in clinical skincare and holistic wellness, Mia curates personalized treatment plans that nourish skin from within.",
    initials: "MC",
  },
  {
    name: "Olivia Hart",
    title: "Patient Experience Coordinator",
    bio: "Olivia ensures every visit feels effortless and luxurious, guiding guests through their aesthetic journey with warmth and expertise.",
    initials: "OH",
  },
];

/* ── Values data ───────────────────────────────────── */
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

/* ── Page Component ────────────────────────────────── */
export default function AboutPage() {
  const story = useQuery(api.siteContent.getByKey, { key: "about_story" });
  const mission = useQuery(api.siteContent.getByKey, { key: "about_mission" });
  const valuesContent = useQuery(api.siteContent.getByKey, {
    key: "about_values",
  });

  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section
        className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 text-center"
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
            About MADE
          </motion.div>

          <motion.h1
            variants={revealUp}
            className="headline-text mb-6"
            style={{
              fontSize: "var(--text-5xl)",
              color: "var(--color-chocolate)",
            }}
          >
            Our <span className="accent-text">Story</span>
          </motion.h1>

          <motion.p
            variants={revealUp}
            className="mx-auto max-w-xl leading-relaxed text-[var(--color-brown)]"
            style={{ fontSize: "var(--text-lg)" }}
          >
            A luxury aesthetic studio built on the belief that beauty is
            personal, science is essential, and every detail matters.
          </motion.p>
        </motion.div>

        {/* Bottom decorative line */}
        <div
          className="absolute bottom-8 left-1/2 h-12 w-[1px] -translate-x-1/2"
          style={{ backgroundColor: "var(--color-stone)" }}
        />
      </section>

      {/* ═══════════════ STORY ═══════════════ */}
      <section
        className="px-6 lg:px-10"
        style={{
          backgroundColor: "var(--color-cream)",
          paddingTop: "var(--space-section)",
          paddingBottom: "var(--space-section)",
        }}
      >
        <div className="mx-auto grid max-w-[var(--max-width)] items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Studio Image */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={revealLeft}
            className="image-editorial image-warm overflow-hidden"
            style={{
              borderRadius: "var(--border-radius-sm)",
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

          {/* Text content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div
              variants={revealRight}
              className="editorial-spacing mb-4 text-[var(--color-stone-dark)]"
            >
              Our Beginning
            </motion.div>

            <motion.h2
              variants={revealRight}
              className="headline-text mb-6"
              style={{
                fontSize: "var(--text-4xl)",
                color: "var(--color-chocolate)",
              }}
            >
              {story?.title || "Founded on Passion"}
            </motion.h2>

            <motion.div
              variants={revealRight}
              className="space-y-4 leading-relaxed text-[var(--color-brown)]"
              style={{ fontSize: "var(--text-base)" }}
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

      {/* ═══════════════ MISSION ═══════════════ */}
      <section
        className="px-6 lg:px-10"
        style={{
          backgroundColor: "var(--color-ivory)",
          paddingTop: "var(--space-section)",
          paddingBottom: "var(--space-section)",
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mx-auto max-w-2xl text-center"
        >
          {/* Accent line */}
          <motion.div
            variants={revealUp}
            className="accent-line mx-auto mb-8"
          />

          <motion.div
            variants={revealUp}
            className="editorial-spacing mb-4 text-[var(--color-stone-dark)]"
          >
            Our Mission
          </motion.div>

          <motion.h2
            variants={revealUp}
            className="headline-text mb-8"
            style={{
              fontSize: "var(--text-4xl)",
              color: "var(--color-chocolate)",
            }}
          >
            {mission?.title || "Elevating Natural Beauty"}
          </motion.h2>

          <motion.p
            variants={revealUp}
            className="accent-text leading-relaxed text-[var(--color-brown)]"
            style={{ fontSize: "var(--text-2xl)" }}
          >
            {mission?.body ||
              "To empower every guest with confidence through personalized, science-backed aesthetic treatments delivered in an atmosphere of warmth, luxury, and unwavering care."}
          </motion.p>
        </motion.div>
      </section>

      {/* ═══════════════ VALUES ═══════════════ */}
      <section
        className="section-dark px-6 lg:px-10"
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
          className="mx-auto max-w-[var(--max-width)]"
        >
          <motion.div
            variants={revealUp}
            className="mb-16 text-center"
          >
            <div
              className="editorial-spacing mb-4 text-[var(--color-stone)]"
            >
              {valuesContent?.title || "What Guides Us"}
            </div>
            <h2
              className="headline-text"
              style={{ fontSize: "var(--text-4xl)" }}
            >
              Our <span className="accent-text">Values</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
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
                    fontSize: "var(--text-4xl)",
                    fontWeight: 300,
                    color: "var(--color-burgundy-light)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {value.number}
                </div>
                <h3
                  className="headline-text mb-4"
                  style={{ fontSize: "var(--text-2xl)" }}
                >
                  {value.title}
                </h3>
                <p
                  className="mx-auto max-w-xs leading-relaxed text-[var(--color-stone)]"
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>

          {valuesContent?.body && (
            <motion.p
              variants={revealUp}
              className="mx-auto mt-12 max-w-xl text-center leading-relaxed text-[var(--color-stone)]"
              style={{ fontSize: "var(--text-base)" }}
            >
              {valuesContent.body}
            </motion.p>
          )}
        </motion.div>
      </section>

      {/* ═══════════════ TEAM ═══════════════ */}
      <section
        className="px-6 lg:px-10"
        style={{
          backgroundColor: "var(--color-cream)",
          paddingTop: "var(--space-section)",
          paddingBottom: "var(--space-section)",
        }}
      >
        <div className="mx-auto max-w-[var(--max-width)]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-16 text-center"
          >
            <motion.div
              variants={revealUp}
              className="editorial-spacing mb-4 text-[var(--color-stone-dark)]"
            >
              The Team
            </motion.div>
            <motion.h2
              variants={revealUp}
              className="headline-text"
              style={{
                fontSize: "var(--text-4xl)",
                color: "var(--color-chocolate)",
              }}
            >
              Meet the <span className="accent-text">Experts</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {teamMembers.map((member) => (
              <motion.div
                key={member.name}
                variants={revealUp}
                className="hover-lift group text-center"
                style={{
                  backgroundColor: "var(--color-ivory)",
                  borderRadius: "var(--border-radius-sm)",
                  overflow: "hidden",
                }}
              >
                {/* Team Photo */}
                <div className="image-portrait overflow-hidden">
                  <Image
                    src={demoImages.about.team[teamMembers.indexOf(member)]}
                    alt={member.name}
                    width={450}
                    height={600}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Card content */}
                <div
                  style={{
                    padding:
                      "var(--space-lg) var(--space-lg) var(--space-xl)",
                  }}
                >
                  <h3
                    className="headline-text mb-1"
                    style={{
                      fontSize: "var(--text-xl)",
                      color: "var(--color-chocolate)",
                    }}
                  >
                    {member.name}
                  </h3>
                  <p
                    className="accent-text mb-3 text-[var(--color-burgundy)]"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    {member.title}
                  </p>
                  <p
                    className="leading-relaxed text-[var(--color-brown)]"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section
        className="px-6 text-center lg:px-10"
        style={{
          backgroundColor: "var(--color-ivory)",
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
          />

          <motion.h2
            variants={revealUp}
            className="headline-text mb-6"
            style={{
              fontSize: "var(--text-4xl)",
              color: "var(--color-chocolate)",
            }}
          >
            Ready to <span className="accent-text">experience</span> the MADE
            difference?
          </motion.h2>

          <motion.p
            variants={revealUp}
            className="mx-auto mb-10 max-w-lg leading-relaxed text-[var(--color-brown)]"
            style={{ fontSize: "var(--text-lg)" }}
          >
            Your journey to elevated beauty begins with a single conversation.
            Let us craft a personalized plan just for you.
          </motion.p>

          <motion.div variants={revealUp}>
            <Link href="/contact" className="btn btn-primary">
              Book Now
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

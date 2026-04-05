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
  const story = useQuery(api.siteContent.getByKey, { key: "about_story" });
  const mission = useQuery(api.siteContent.getByKey, { key: "about_mission" });
  const valuesContent = useQuery(api.siteContent.getByKey, {
    key: "about_values",
  });

  return (
    <>
      {/* HERO */}
      <section
        className="section-dark relative flex min-h-[70vh] flex-col items-center justify-center px-6 text-center"
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
            About MADE
          </motion.div>

          <motion.h1
            variants={revealUp}
            className="headline-text mb-6"
            style={{
              fontSize: "var(--text-5xl)",
              color: "var(--color-soft-ivory)",
            }}
          >
            Our <span className="accent-text" style={{ color: "var(--color-accent)" }}>Story</span>
          </motion.h1>

          <motion.p
            variants={revealUp}
            className="mx-auto max-w-xl leading-relaxed"
            style={{ fontSize: "var(--text-lg)", color: "rgba(237, 229, 220, 0.7)", fontWeight: 300 }}
          >
            A luxury aesthetic studio built on the belief that beauty is
            personal, science is essential, and every detail matters.
          </motion.p>
        </motion.div>

        <div
          className="absolute bottom-8 left-1/2 h-12 w-[1px] -translate-x-1/2"
          style={{ backgroundColor: "rgba(157, 138, 124, 0.3)" }}
        />
      </section>

      {/* STORY */}
      <section
        className="px-6 lg:px-10"
        style={{
          backgroundColor: "var(--color-soft-ivory)",
          paddingTop: "var(--space-section-lg)",
          paddingBottom: "var(--space-section-lg)",
        }}
      >
        <div className="mx-auto grid max-w-[var(--max-width)] items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={revealLeft}
            className="image-editorial image-warm overflow-hidden"
            style={{
              borderRadius: "var(--border-radius-lg)",
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
            <motion.div
              variants={revealRight}
              className="editorial-spacing mb-4"
              style={{ color: "var(--color-cream)" }}
            >
              Our Beginning
            </motion.div>

            <motion.h2
              variants={revealRight}
              className="headline-text mb-6"
              style={{
                fontSize: "var(--text-4xl)",
                color: "var(--color-deep-cocoa)",
              }}
            >
              {story?.title || "Founded on Passion"}
            </motion.h2>

            <motion.div
              variants={revealRight}
              className="space-y-4 leading-relaxed"
              style={{ fontSize: "var(--text-base)", color: "var(--color-warm-taupe)", fontWeight: 300 }}
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

      {/* MISSION */}
      <section
        className="px-6 lg:px-10"
        style={{
          backgroundColor: "var(--color-linen)",
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
          <motion.div
            variants={revealUp}
            className="accent-line mx-auto mb-8"
          />

          <motion.div
            variants={revealUp}
            className="editorial-spacing mb-4"
            style={{ color: "var(--color-cream)" }}
          >
            Our Mission
          </motion.div>

          <motion.h2
            variants={revealUp}
            className="headline-text mb-8"
            style={{
              fontSize: "var(--text-4xl)",
              color: "var(--color-deep-cocoa)",
            }}
          >
            {mission?.title || "Elevating Natural Beauty"}
          </motion.h2>

          <motion.p
            variants={revealUp}
            className="accent-text leading-relaxed"
            style={{ fontSize: "var(--text-2xl)", color: "var(--color-warm-taupe)" }}
          >
            {mission?.body ||
              "To empower every guest with confidence through personalized, science-backed aesthetic treatments delivered in an atmosphere of warmth, luxury, and unwavering care."}
          </motion.p>
        </motion.div>
      </section>

      {/* VALUES */}
      <section
        className="section-dark px-6 lg:px-10"
        style={{
          paddingTop: "var(--space-section-lg)",
          paddingBottom: "var(--space-section-lg)",
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
            className="mb-20 text-center"
          >
            <div
              className="editorial-spacing mb-4"
              style={{ color: "var(--color-cream)" }}
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
                    fontSize: "var(--text-4xl)",
                    fontWeight: 200,
                    color: "var(--color-accent-light)",
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
                  className="mx-auto max-w-xs leading-relaxed"
                  style={{ fontSize: "var(--text-sm)", color: "rgba(237, 229, 220, 0.6)", fontWeight: 300 }}
                >
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>

          {valuesContent?.body && (
            <motion.p
              variants={revealUp}
              className="mx-auto mt-12 max-w-xl text-center leading-relaxed"
              style={{ fontSize: "var(--text-base)", color: "rgba(237, 229, 220, 0.6)", fontWeight: 300 }}
            >
              {valuesContent.body}
            </motion.p>
          )}
        </motion.div>
      </section>

      {/* TEAM */}
      <section
        className="px-6 lg:px-10"
        style={{
          backgroundColor: "var(--color-soft-ivory)",
          paddingTop: "var(--space-section-lg)",
          paddingBottom: "var(--space-section-lg)",
        }}
      >
        <div className="mx-auto max-w-[var(--max-width)]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-20 text-center"
          >
            <motion.div
              variants={revealUp}
              className="editorial-spacing mb-4"
              style={{ color: "var(--color-cream)" }}
            >
              The Team
            </motion.div>
            <motion.h2
              variants={revealUp}
              className="headline-text"
              style={{
                fontSize: "var(--text-4xl)",
                color: "var(--color-deep-cocoa)",
              }}
            >
              Meet the <span className="accent-text" style={{ color: "var(--color-accent-text)" }}>Experts</span>
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
                  backgroundColor: "var(--color-linen)",
                  borderRadius: "var(--border-radius-lg)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-card)",
                }}
              >
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
                      color: "var(--color-deep-cocoa)",
                    }}
                  >
                    {member.name}
                  </h3>
                  <p
                    className="accent-text mb-3"
                    style={{ fontSize: "var(--text-sm)", color: "var(--color-accent-text)" }}
                  >
                    {member.title}
                  </p>
                  <p
                    className="leading-relaxed"
                    style={{ fontSize: "var(--text-sm)", color: "var(--color-warm-taupe)", fontWeight: 300 }}
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
        className="px-6 text-center lg:px-10"
        style={{
          backgroundColor: "var(--color-linen)",
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
              color: "var(--color-deep-cocoa)",
            }}
          >
            Ready to <span className="accent-text" style={{ color: "var(--color-accent-text)" }}>experience</span> the MADE
            difference?
          </motion.h2>

          <motion.p
            variants={revealUp}
            className="mx-auto mb-10 max-w-lg leading-relaxed"
            style={{ fontSize: "var(--text-lg)", color: "var(--color-warm-taupe)", fontWeight: 300 }}
          >
            Your journey to elevated beauty begins with a single conversation.
            Let us craft a personalized plan just for you.
          </motion.p>

          <motion.div variants={revealUp}>
            <Link href="/booking" className="btn btn-primary">
              Book Consultation
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

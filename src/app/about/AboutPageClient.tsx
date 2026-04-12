"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Image from "next/image";
import { motion } from "framer-motion";
import PageHero from "@/components/sections/PageHero";
import CTABanner from "@/components/sections/CTABanner";

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

const DEFAULT_STORY_IMAGE = "/images/placeholder-portrait.svg";

const TEAM_IMAGES = [
  "/images/placeholder-team.svg",
  "/images/placeholder-team.svg",
  "/images/placeholder-team.svg",
  "/images/placeholder-team.svg",
];

const FALLBACK_TEAM: { name: string; title: string; bio: string; imageUrl?: string }[] = [
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

export default function AboutPageClient({
  heroBgUrl,
}: {
  heroBgUrl?: string;
}) {
  const dbTeam = useQuery(api.teamMembers.list);
  const teamMembers = dbTeam && dbTeam.length > 0 ? dbTeam : FALLBACK_TEAM;
  const story = useQuery(api.siteContent.getByKey, { key: "about_story" });
  const storyImageContent = useQuery(api.siteContent.getByKey, { key: "about_story_image" });
  const storyImageLoading = storyImageContent === undefined;
  const storyImage = storyImageContent?.imageUrl || DEFAULT_STORY_IMAGE;
  const mission = useQuery(api.siteContent.getByKey, { key: "about_mission" });
  const valuesContent = useQuery(api.siteContent.getByKey, {
    key: "about_values",
  });

  return (
    <>
      {/* HERO */}
      <PageHero
        eyebrow="About MADE"
        headline={
          <>
            The Story
            <br />
            <span className="font-extralight">of MADE</span>
          </>
        }
        subtitle="A luxury aesthetic studio built on the belief that beauty is personal, science is essential, and every detail matters."
        backgroundImage={heroBgUrl}
      />

      {/* STORY — Asymmetric editorial layout */}
      <section
        className="py-32 md:py-40 px-6"
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
            <div className="overflow-hidden aspect-[4/5] relative" style={{ backgroundColor: "var(--color-surface-high)" }}>
              {!storyImageLoading && (
                <Image
                  src={storyImage}
                  alt="MADE Med Spa studio"
                  fill
                  sizes="(max-width: 768px) 100vw, 42vw"
                  className="object-cover image-editorial"
                  style={{ boxShadow: "12px 12px 40px rgba(32,10,10,0.06)" }}
                />
              )}
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

            <motion.div variants={revealRight} className="space-y-6">
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
                    skill. It demands an understanding of each
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

      {/* EDITORIAL BREAK — Philosophy quote */}
      <section
        className="py-32 md:py-40 px-6 overflow-hidden relative"
        style={{
          background: [
            "radial-gradient(ellipse 80% 70% at 10% 90%, rgba(215,207,197,0.12) 0%, transparent 55%)",
            "radial-gradient(ellipse 60% 50% at 90% 10%, rgba(162,60,64,0.08) 0%, transparent 50%)",
            "linear-gradient(155deg, #3d2222 0%, #391e1e 30%, #2d1515 65%, #200a0a 100%)",
          ].join(", "),
        }}
      >
        {/* Decorative thin lines — architectural/editorial feel */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {/* Diamond ornament — centered above text */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <div
              className="w-12 h-px"
              style={{ backgroundColor: "rgba(215,207,197,0.25)" }}
            />
            <div
              className="w-2 h-2 rotate-45 border"
              style={{ borderColor: "rgba(215,207,197,0.3)" }}
            />
            <div
              className="w-12 h-px"
              style={{ backgroundColor: "rgba(215,207,197,0.25)" }}
            />
          </div>

          {/* Diamond ornament — centered below text */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <div
              className="w-12 h-px"
              style={{ backgroundColor: "rgba(215,207,197,0.25)" }}
            />
            <div
              className="w-2 h-2 rotate-45 border"
              style={{ borderColor: "rgba(215,207,197,0.3)" }}
            />
            <div
              className="w-12 h-px"
              style={{ backgroundColor: "rgba(215,207,197,0.25)" }}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease }}
          className="relative max-w-4xl mx-auto text-center"
        >
          <p
            className="headline-section text-3xl md:text-5xl leading-tight"
            style={{
              color: "var(--color-surface)",
              textWrap: "balance",
            } as React.CSSProperties}
          >
            Refinement <em className="font-extralight">over</em>
            <br />
            Transformation.
          </p>
        </motion.div>
      </section>

      {/* MISSION */}
      <section
        className="py-32 md:py-40 px-6"
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
        className="py-32 md:py-40 px-6 relative overflow-hidden"
        style={{
          backgroundColor: "var(--color-surface-highest)",
        }}
      >
        {/* Background image — warm glaze-tinted editorial treatment */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <Image
            src="/images/values-bg.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            style={{
              filter: "grayscale(100%) brightness(1.2) contrast(0.8)",
              opacity: 0.12,
            }}
          />
          {/* Glaze warm tint overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: "rgba(215,207,197,0.15)",
              mixBlendMode: "color",
            }}
          />
          {/* Silk fade at edges for soft vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, var(--color-surface-highest) 100%)",
            }}
          />
        </div>
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
              style={{ color: "var(--color-primary)", opacity: 0.6 }}
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
                  style={{ color: "var(--color-primary)" }}
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
              style={{ color: "var(--color-primary)" }}
            >
              {valuesContent.body}
            </motion.p>
          )}
        </motion.div>
      </section>

      {/* TEAM */}
      <section
        className="py-32 md:py-40 px-6"
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12"
          >
            {teamMembers.map((member, i) => (
              <motion.div key={member.name} variants={revealUp}>
                <div className="overflow-hidden mb-6 relative aspect-[3/4]">
                  <Image
                    src={member.imageUrl || TEAM_IMAGES[i] || "/images/placeholder-team.svg"}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover image-editorial"
                    style={{
                      boxShadow: "8px 8px 30px rgba(32,10,10,0.06)",
                    }}
                  />
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
      <CTABanner
        dark
        headline="Ready to experience the MADE difference?"
        subtitle="Your journey to elevated beauty begins with a single conversation. Let us craft a personalized plan just for you."
        ctaText="Book Consultation"
        ctaHref="/booking"
        secondaryText="Explore Services"
        secondaryHref="/services"
      />
    </>
  );
}

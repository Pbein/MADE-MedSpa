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
      <section>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.span variants={revealUp}>
            About MADE
          </motion.span>

          <motion.h1 variants={revealUp}>
            Our Story
          </motion.h1>

          <motion.p variants={revealUp}>
            A luxury aesthetic studio built on the belief that beauty is
            personal, science is essential, and every detail matters.
          </motion.p>
        </motion.div>
      </section>

      {/* STORY */}
      <section>
        <div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={revealLeft}
          >
            <img src="/placeholder.svg" alt="MADE Med Spa studio interior" />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.span variants={revealRight}>
              Our Beginning
            </motion.span>

            <motion.h2 variants={revealRight}>
              {story?.title || "Founded on Passion"}
            </motion.h2>

            <motion.div variants={revealRight}>
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
      <section>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={revealUp} />

          <motion.span variants={revealUp}>
            Our Mission
          </motion.span>

          <motion.h2 variants={revealUp}>
            {mission?.title || "Elevating Natural Beauty"}
          </motion.h2>

          <motion.p variants={revealUp}>
            {mission?.body ||
              "To empower every guest with confidence through personalized, science-backed aesthetic treatments delivered in an atmosphere of warmth, luxury, and unwavering care."}
          </motion.p>
        </motion.div>
      </section>

      {/* VALUES */}
      <section>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={revealUp}>
            <span>{valuesContent?.title || "What Guides Us"}</span>
            <h2>Our Values</h2>
          </motion.div>

          <div>
            {values.map((value) => (
              <motion.div key={value.number} variants={revealUp}>
                <div>{value.number}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>

          {valuesContent?.body && (
            <motion.p variants={revealUp}>
              {valuesContent.body}
            </motion.p>
          )}
        </motion.div>
      </section>

      {/* TEAM */}
      <section>
        <div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.span variants={revealUp}>
              The Team
            </motion.span>
            <motion.h2 variants={revealUp}>
              Meet the Experts
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {teamMembers.map((member, index) => (
              <motion.div key={member.name} variants={revealUp}>
                {/* Initials circle */}
                <div>
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                <div>
                  <h3>{member.name}</h3>
                  <p>{member.title}</p>
                  <p>{member.bio}</p>
                </div>
              </motion.div>
            ))}
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
            Ready to experience the MADE difference?
          </motion.h2>

          <motion.p variants={revealUp}>
            Your journey to elevated beauty begins with a single conversation.
            Let us craft a personalized plan just for you.
          </motion.p>

          <motion.div variants={revealUp}>
            <Link href="/booking">
              Book Consultation
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

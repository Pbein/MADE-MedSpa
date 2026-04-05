"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { demoImages } from "@/lib/demo-images";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

const benefits = [
  {
    number: "01",
    title: "Monthly Treatments",
    description: "Curated services included with your tier each month",
  },
  {
    number: "02",
    title: "Exclusive Pricing",
    description: "Member-only rates on all additional treatments and products",
  },
  {
    number: "03",
    title: "Priority Booking",
    description: "Early access to new services and preferred scheduling",
  },
  {
    number: "04",
    title: "Personalized Plans",
    description: "Custom aesthetic roadmaps tailored to your goals",
  },
];

export default function MembershipTeaser() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      ref={ref}
      className="section-dark relative"
      style={{
        paddingTop: "var(--space-section-lg)",
        paddingBottom: "var(--space-section-lg)",
      }}
    >
      <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-10">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: luxuryEase }}
          >
            <span
              className="editorial-spacing mb-4 block"
              style={{ color: "var(--color-cream)" }}
            >
              Membership
            </span>
            <h2
              className="headline-text mb-6"
              style={{
                fontSize: "var(--text-4xl)",
                color: "var(--color-soft-ivory)",
              }}
            >
              Become a{" "}
              <span className="accent-text" style={{ color: "var(--color-accent)" }}>
                MADE
              </span>{" "}
              Member
            </h2>
            <p
              className="mb-10 max-w-md leading-relaxed"
              style={{
                fontSize: "var(--text-base)",
                color: "rgba(237, 229, 220, 0.7)",
                fontWeight: 300,
              }}
            >
              Join an exclusive community dedicated to elevated self-care.
              Our membership tiers are designed to make luxury aesthetics
              effortlessly accessible, with benefits that grow alongside
              your journey.
            </p>

            {/* Benefits list */}
            <div className="mb-10 space-y-0">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: 0.3 + i * 0.12,
                    ease: luxuryEase,
                  }}
                  className="flex items-baseline gap-6 border-b py-5"
                  style={{ borderColor: "rgba(157, 138, 124, 0.2)" }}
                >
                  <span
                    className="min-w-[3rem]"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-3xl)",
                      fontWeight: 200,
                      color: "var(--color-warm-taupe)",
                    }}
                  >
                    {benefit.number}
                  </span>
                  <div>
                    <h4
                      className="headline-text mb-1"
                      style={{
                        fontSize: "var(--text-lg)",
                        color: "var(--color-soft-ivory)",
                      }}
                    >
                      {benefit.title}
                    </h4>
                    <p style={{
                      fontSize: "var(--text-sm)",
                      color: "rgba(237, 229, 220, 0.6)",
                      fontWeight: 300,
                    }}>
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link href="/membership" className="btn btn-light">
              Explore Membership
            </Link>
          </motion.div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: luxuryEase }}
            className="relative"
          >
            <div
              className="image-warm overflow-hidden rounded-[var(--border-radius-lg)]"
              style={{ aspectRatio: "4/5" }}
            >
              <Image
                src={demoImages.home.membershipTeaser}
                alt="MADE Med Spa membership luxury experience"
                width={600}
                height={750}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            <div
              className="absolute -bottom-4 -left-4 -z-10 rounded-[var(--border-radius-lg)]"
              style={{
                width: "100%",
                height: "100%",
                border: "1px solid rgba(157, 138, 124, 0.2)",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

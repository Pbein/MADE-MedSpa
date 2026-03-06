"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

/* -- Framer Motion helpers -- */
const ease = [0.16, 1, 0.3, 1] as const;

const revealUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* -- FAQ data -- */
const membershipFaqs = [
  {
    question: "How does billing work?",
    answer:
      "Your membership is billed monthly via the payment method on file. You can update your payment method or view invoices through your member dashboard at any time.",
  },
  {
    question: "Can I upgrade or downgrade my tier?",
    answer:
      "Absolutely. You can change your tier at any time from your member dashboard. Upgrades take effect immediately with prorated billing, and downgrades take effect at the start of your next billing cycle.",
  },
  {
    question: "What is the cancellation policy?",
    answer:
      "You may cancel your membership at any time. Your benefits will remain active through the end of your current billing period. There are no cancellation fees.",
  },
  {
    question: "Can I share my membership with family?",
    answer:
      "Memberships are individual and non-transferable. However, we do offer family plans at a discounted rate. Contact us for details.",
  },
  {
    question: "Do member discounts apply to everything?",
    answer:
      "Member discounts apply to all services and retail products. Some promotional offers or packages may have separate pricing. Your discount is automatically applied at checkout.",
  },
];

/* -- How it Works steps -- */
const steps = [
  {
    number: "01",
    title: "Choose Your Tier",
    description:
      "Select the membership level that best fits your lifestyle and aesthetic goals.",
  },
  {
    number: "02",
    title: "Sign Up Online",
    description:
      "Complete a quick enrollment with secure payment. Your membership activates instantly.",
  },
  {
    number: "03",
    title: "Enjoy Your Benefits",
    description:
      "Book treatments, shop with discounts, and experience the MADE difference every visit.",
  },
];

/* -- Helper: format price -- */
function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

/* -- FAQ Accordion Item -- */
function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="border-b"
      style={{ borderColor: "var(--color-stone)" }}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span
          className="headline-text"
          style={{
            fontSize: "var(--text-lg)",
            color: "var(--color-chocolate)",
          }}
        >
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease }}
          className="flex h-8 w-8 shrink-0 items-center justify-center text-xl text-[var(--color-burgundy)]"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            <p
              className="pb-5 leading-relaxed text-[var(--color-brown)]"
              style={{ fontSize: "var(--text-base)" }}
            >
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -- Page Component -- */
export default function MembershipPage() {
  const tiers = useQuery(api.membershipTiers.list);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* HERO */}
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
            Membership
          </motion.div>

          <motion.h1
            variants={revealUp}
            className="headline-text mb-6"
            style={{
              fontSize: "var(--text-5xl)",
              color: "var(--color-chocolate)",
            }}
          >
            Elevate Your <span className="accent-text">Beauty</span>
          </motion.h1>

          <motion.p
            variants={revealUp}
            className="mx-auto max-w-xl leading-relaxed text-[var(--color-brown)]"
            style={{ fontSize: "var(--text-lg)" }}
          >
            Exclusive tiers designed for every lifestyle. Enjoy monthly
            treatments, member-only pricing, priority booking, and more.
          </motion.p>
        </motion.div>

        <div
          className="absolute bottom-8 left-1/2 h-12 w-[1px] -translate-x-1/2"
          style={{ backgroundColor: "var(--color-stone)" }}
        />
      </section>

      {/* TIER CARDS */}
      <section
        className="px-6 lg:px-10"
        style={{
          backgroundColor: "var(--color-cream)",
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
          <motion.div variants={revealUp} className="mb-16 text-center">
            <div className="editorial-spacing mb-4 text-[var(--color-stone-dark)]">
              Choose Your Tier
            </div>
            <h2
              className="headline-text"
              style={{
                fontSize: "var(--text-4xl)",
                color: "var(--color-chocolate)",
              }}
            >
              Find Your <span className="accent-text">Perfect</span> Plan
            </h2>
          </motion.div>

          {/* Loading skeletons */}
          {!tiers && (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-[var(--border-radius-sm)]"
                  style={{
                    backgroundColor: "var(--color-ivory)",
                    height: "420px",
                  }}
                />
              ))}
            </div>
          )}

          {/* Tier cards */}
          {tiers && (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {tiers.map((tier, index) => {
                const isPopular = index === 1;
                return (
                  <motion.div
                    key={tier._id}
                    variants={revealUp}
                    className="hover-lift relative flex flex-col overflow-hidden"
                    style={{
                      backgroundColor: "var(--color-ivory)",
                      borderRadius: "var(--border-radius-sm)",
                      border: isPopular
                        ? "2px solid var(--color-burgundy)"
                        : "1px solid var(--color-stone)",
                    }}
                  >
                    {isPopular && (
                      <div
                        className="py-2 text-center text-xs font-medium tracking-widest uppercase text-white"
                        style={{ backgroundColor: "var(--color-burgundy)" }}
                      >
                        Most Popular
                      </div>
                    )}

                    <div
                      className="flex flex-1 flex-col"
                      style={{
                        padding:
                          "var(--space-xl) var(--space-lg) var(--space-lg)",
                      }}
                    >
                      <h3
                        className="headline-text mb-2"
                        style={{
                          fontSize: "var(--text-2xl)",
                          color: "var(--color-chocolate)",
                        }}
                      >
                        {tier.name}
                      </h3>

                      <div className="mb-4">
                        <span
                          className="headline-text"
                          style={{
                            fontSize: "var(--text-4xl)",
                            color: "var(--color-burgundy)",
                          }}
                        >
                          {formatPrice(tier.monthlyPrice)}
                        </span>
                        <span
                          className="text-[var(--color-stone-dark)]"
                          style={{ fontSize: "var(--text-sm)" }}
                        >
                          /month
                        </span>
                      </div>

                      <p
                        className="mb-6 leading-relaxed text-[var(--color-brown)]"
                        style={{ fontSize: "var(--text-sm)" }}
                      >
                        {tier.description}
                      </p>

                      <ul className="mb-8 flex flex-1 flex-col gap-3">
                        {tier.benefits.map((benefit, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-[var(--color-brown)]"
                            style={{ fontSize: "var(--text-sm)" }}
                          >
                            <span
                              className="mt-0.5 shrink-0 text-[var(--color-burgundy)]"
                              style={{ fontSize: "var(--text-sm)" }}
                            >
                              &#10003;
                            </span>
                            {benefit}
                          </li>
                        ))}
                      </ul>

                      <Link
                        href={`/membership/signup?tier=${tier.slug}`}
                        className={
                          isPopular
                            ? "btn btn-primary w-full text-center"
                            : "btn btn-outline w-full text-center"
                        }
                      >
                        Join Now
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
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
          <motion.div variants={revealUp} className="mb-16 text-center">
            <div className="editorial-spacing mb-4 text-[var(--color-stone)]">
              Getting Started
            </div>
            <h2
              className="headline-text"
              style={{ fontSize: "var(--text-4xl)" }}
            >
              How It <span className="accent-text">Works</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
            {steps.map((step) => (
              <motion.div
                key={step.number}
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
                  {step.number}
                </div>
                <h3
                  className="headline-text mb-4"
                  style={{ fontSize: "var(--text-2xl)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="mx-auto max-w-xs leading-relaxed text-[var(--color-stone)]"
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section
        className="px-6 lg:px-10"
        style={{
          backgroundColor: "var(--color-cream)",
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
          <motion.div variants={revealUp} className="mb-12 text-center">
            <div className="editorial-spacing mb-4 text-[var(--color-stone-dark)]">
              Questions
            </div>
            <h2
              className="headline-text"
              style={{
                fontSize: "var(--text-3xl)",
                color: "var(--color-chocolate)",
              }}
            >
              Membership <span className="accent-text">FAQ</span>
            </h2>
          </motion.div>

          <motion.div variants={revealUp}>
            {membershipFaqs.map((faq, i) => (
              <FaqItem
                key={i}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* CTA */}
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
            Ready to become a{" "}
            <span className="accent-text">member</span>?
          </motion.h2>

          <motion.p
            variants={revealUp}
            className="mx-auto mb-10 max-w-lg leading-relaxed text-[var(--color-brown)]"
            style={{ fontSize: "var(--text-lg)" }}
          >
            Join the MADE family and unlock exclusive treatments, priority
            booking, and member-only pricing on every visit.
          </motion.p>

          <motion.div
            variants={revealUp}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link href="/membership/signup" className="btn btn-primary">
              Become a Member
            </Link>
            <Link href="/booking" className="btn btn-outline">
              Book a Consultation
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

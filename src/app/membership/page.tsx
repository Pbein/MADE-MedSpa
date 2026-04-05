"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

const revealUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

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

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

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
    <div className="border-b" style={{ borderColor: "var(--color-border)" }}>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="headline-text" style={{ fontSize: "var(--text-lg)", color: "var(--color-deep-cocoa)" }}>
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease }}
          className="flex h-8 w-8 shrink-0 items-center justify-center text-xl"
          style={{ color: "var(--color-accent-text)" }}
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
            <p className="pb-5 leading-relaxed" style={{ fontSize: "var(--text-base)", color: "var(--color-warm-taupe)", fontWeight: 300 }}>
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ComparisonTable({
  tiers,
}: {
  tiers: {
    _id: string;
    name: string;
    monthlyPrice: number;
    benefits: string[];
  }[];
}) {
  const allBenefits = useMemo(() => {
    const seen = new Set<string>();
    const ordered: string[] = [];
    for (const tier of tiers) {
      for (const b of tier.benefits) {
        if (!seen.has(b)) {
          seen.add(b);
          ordered.push(b);
        }
      }
    }
    return ordered;
  }, [tiers]);

  return (
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
        className="mx-auto max-w-[var(--max-width)]"
      >
        <motion.div variants={revealUp} className="mb-16 text-center">
          <div className="editorial-spacing mb-4" style={{ color: "var(--color-cream)" }}>
            Compare
          </div>
          <h2 className="headline-text" style={{ fontSize: "var(--text-4xl)", color: "var(--color-deep-cocoa)" }}>
            Side by <span className="accent-text" style={{ color: "var(--color-accent-text)" }}>Side</span>
          </h2>
        </motion.div>

        <motion.div variants={revealUp} className="overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
          <table className="w-full border-collapse" style={{ minWidth: "600px" }}>
            <thead>
              <tr>
                <th
                  className="text-left"
                  style={{
                    padding: "var(--space-md) var(--space-lg)",
                    borderBottom: "2px solid var(--color-border-strong)",
                    color: "var(--color-warm-taupe)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 400,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Benefits
                </th>
                {tiers.map((tier) => (
                  <th
                    key={tier._id}
                    className="text-center"
                    style={{
                      padding: "var(--space-md) var(--space-lg)",
                      borderBottom: "2px solid var(--color-border-strong)",
                    }}
                  >
                    <div className="headline-text" style={{ fontSize: "var(--text-xl)", color: "var(--color-deep-cocoa)", marginBottom: "4px" }}>
                      {tier.name}
                    </div>
                    <div style={{ fontSize: "var(--text-sm)", color: "var(--color-accent-text)", fontWeight: 500 }}>
                      {formatPrice(tier.monthlyPrice)}
                      <span style={{ color: "var(--color-cream)", fontWeight: 400 }}>/mo</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allBenefits.map((benefit, i) => (
                <tr key={benefit} style={{ backgroundColor: i % 2 === 0 ? "transparent" : "var(--color-soft-ivory)" }}>
                  <td style={{ padding: "var(--space-sm) var(--space-lg)", color: "var(--color-warm-taupe)", fontSize: "var(--text-sm)", lineHeight: 1.6, borderBottom: "1px solid var(--color-border)", fontWeight: 300 }}>
                    {benefit}
                  </td>
                  {tiers.map((tier) => {
                    const included = tier.benefits.includes(benefit);
                    return (
                      <td
                        key={tier._id}
                        className="text-center"
                        style={{
                          padding: "var(--space-sm) var(--space-lg)",
                          borderBottom: "1px solid var(--color-border)",
                          fontSize: "var(--text-lg)",
                          color: included ? "var(--color-accent-text)" : "var(--color-cream)",
                        }}
                      >
                        {included ? "\u2713" : "\u2014"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default function MembershipPage() {
  const tiers = useQuery(api.membershipTiers.list);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* HERO */}
      <section className="section-warm relative flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="pt-[var(--nav-height)]">
          <motion.div variants={revealUp} className="editorial-spacing mb-6" style={{ color: "var(--color-cream)" }}>
            Membership
          </motion.div>

          <motion.h1 variants={revealUp} className="headline-text mb-6" style={{ fontSize: "var(--text-5xl)", color: "var(--color-soft-ivory)" }}>
            Elevate Your <span className="accent-text" style={{ color: "var(--color-accent)" }}>Beauty</span>
          </motion.h1>

          <motion.p variants={revealUp} className="mx-auto max-w-xl leading-relaxed" style={{ fontSize: "var(--text-lg)", color: "rgba(237, 229, 220, 0.7)", fontWeight: 300 }}>
            Exclusive tiers designed for every lifestyle. Enjoy monthly
            treatments, member-only pricing, priority booking, and more.
          </motion.p>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 h-12 w-[1px] -translate-x-1/2" style={{ backgroundColor: "rgba(157, 138, 124, 0.3)" }} />
      </section>

      {/* TIER CARDS */}
      <section className="px-6 lg:px-10" style={{ backgroundColor: "var(--color-soft-ivory)", paddingTop: "var(--space-section-lg)", paddingBottom: "var(--space-section-lg)" }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="mx-auto max-w-[var(--max-width)]">
          <motion.div variants={revealUp} className="mb-16 text-center">
            <div className="editorial-spacing mb-4" style={{ color: "var(--color-cream)" }}>Choose Your Tier</div>
            <h2 className="headline-text" style={{ fontSize: "var(--text-4xl)", color: "var(--color-deep-cocoa)" }}>
              Find Your <span className="accent-text" style={{ color: "var(--color-accent-text)" }}>Perfect</span> Plan
            </h2>
          </motion.div>

          {!tiers && (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse" style={{ backgroundColor: "var(--color-linen)", height: "420px", borderRadius: "var(--border-radius-lg)" }} />
              ))}
            </div>
          )}

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
                      backgroundColor: "var(--color-linen)",
                      borderRadius: "var(--border-radius-lg)",
                      border: isPopular ? "2px solid var(--color-accent-text)" : "1px solid var(--color-border)",
                      boxShadow: "var(--shadow-card)",
                    }}
                  >
                    {isPopular && (
                      <div className="py-2 text-center text-xs font-medium tracking-widest uppercase" style={{ backgroundColor: "var(--color-accent)", color: "var(--color-deep-cocoa)" }}>
                        Most Popular
                      </div>
                    )}

                    <div className="flex flex-1 flex-col" style={{ padding: "var(--space-xl) var(--space-lg) var(--space-lg)" }}>
                      <h3 className="headline-text mb-2" style={{ fontSize: "var(--text-2xl)", color: "var(--color-deep-cocoa)" }}>
                        {tier.name}
                      </h3>

                      <div className="mb-4">
                        <span className="headline-text" style={{ fontSize: "var(--text-4xl)", color: "var(--color-accent-text)" }}>
                          {formatPrice(tier.monthlyPrice)}
                        </span>
                        <span style={{ fontSize: "var(--text-sm)", color: "var(--color-cream)" }}>/month</span>
                      </div>

                      <p className="mb-6 leading-relaxed" style={{ fontSize: "var(--text-sm)", color: "var(--color-warm-taupe)", fontWeight: 300 }}>
                        {tier.description}
                      </p>

                      <ul className="mb-8 flex flex-1 flex-col gap-3">
                        {tier.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2" style={{ fontSize: "var(--text-sm)", color: "var(--color-warm-taupe)", fontWeight: 300 }}>
                            <span className="mt-0.5 shrink-0" style={{ fontSize: "var(--text-sm)", color: "var(--color-accent-text)" }}>
                              &#10003;
                            </span>
                            {benefit}
                          </li>
                        ))}
                      </ul>

                      <Link
                        href={`/membership/signup?tier=${tier.slug}`}
                        className={isPopular ? "btn btn-primary w-full text-center" : "btn btn-outline w-full text-center"}
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

      {tiers && tiers.length > 0 && <ComparisonTable tiers={tiers} />}

      {/* HOW IT WORKS */}
      <section className="section-dark px-6 lg:px-10" style={{ paddingTop: "var(--space-section-lg)", paddingBottom: "var(--space-section-lg)" }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="mx-auto max-w-[var(--max-width)]">
          <motion.div variants={revealUp} className="mb-20 text-center">
            <div className="editorial-spacing mb-4" style={{ color: "var(--color-cream)" }}>Getting Started</div>
            <h2 className="headline-text" style={{ fontSize: "var(--text-4xl)" }}>
              How It <span className="accent-text" style={{ color: "var(--color-accent)" }}>Works</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-16">
            {steps.map((step) => (
              <motion.div key={step.number} variants={revealUp} className="text-center">
                <div className="mx-auto mb-6" style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-4xl)", fontWeight: 200, color: "var(--color-accent-light)", letterSpacing: "0.05em" }}>
                  {step.number}
                </div>
                <h3 className="headline-text mb-4" style={{ fontSize: "var(--text-2xl)" }}>
                  {step.title}
                </h3>
                <p className="mx-auto max-w-xs leading-relaxed" style={{ fontSize: "var(--text-sm)", color: "rgba(237, 229, 220, 0.6)", fontWeight: 300 }}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="px-6 lg:px-10" style={{ backgroundColor: "var(--color-soft-ivory)", paddingTop: "var(--space-section)", paddingBottom: "var(--space-section)" }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="mx-auto max-w-2xl">
          <motion.div variants={revealUp} className="mb-12 text-center">
            <div className="editorial-spacing mb-4" style={{ color: "var(--color-cream)" }}>Questions</div>
            <h2 className="headline-text" style={{ fontSize: "var(--text-3xl)", color: "var(--color-deep-cocoa)" }}>
              Membership <span className="accent-text" style={{ color: "var(--color-accent-text)" }}>FAQ</span>
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
      <section className="px-6 text-center lg:px-10" style={{ backgroundColor: "var(--color-linen)", paddingTop: "var(--space-section)", paddingBottom: "var(--space-section)" }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="mx-auto max-w-2xl">
          <motion.div variants={revealUp} className="accent-line mx-auto mb-8" />

          <motion.h2 variants={revealUp} className="headline-text mb-6" style={{ fontSize: "var(--text-4xl)", color: "var(--color-deep-cocoa)" }}>
            Ready to become a <span className="accent-text" style={{ color: "var(--color-accent-text)" }}>member</span>?
          </motion.h2>

          <motion.p variants={revealUp} className="mx-auto mb-10 max-w-lg leading-relaxed" style={{ fontSize: "var(--text-lg)", color: "var(--color-warm-taupe)", fontWeight: 300 }}>
            Join the MADE family and unlock exclusive treatments, priority
            booking, and member-only pricing on every visit.
          </motion.p>

          <motion.div variants={revealUp} className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
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

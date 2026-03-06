"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ── Framer Motion helpers ─────────────────────────── */
const ease = [0.16, 1, 0.3, 1] as const;

const revealUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    transition: { duration: 0.4, ease },
  }),
};

/* ── Step labels ───────────────────────────────────── */
const STEPS = [
  "Tier Confirmation",
  "Terms & Conditions",
  "Payment",
  "Confirmation",
];

/* ── Terms & Conditions content ────────────────────── */
const TERMS_TEXT = `MADE Med Spa Membership Agreement

By enrolling in a MADE Med Spa membership, you agree to the following terms and conditions. Please read them carefully before proceeding.

1. Membership Overview
Your membership grants you access to exclusive benefits, preferred pricing on treatments, and members-only perks as outlined in your selected tier. Membership benefits are non-transferable and intended for the enrolled member's personal use only.

2. Billing & Payment
Membership fees are billed on a recurring monthly basis to the payment method on file. Your first payment will be processed upon enrollment, and subsequent charges will occur on the same date each month. If your payment method is declined, we will attempt to process the charge up to three (3) times within a 10-day period before your membership is placed on hold.

3. Cancellation Policy
You may cancel your membership at any time by contacting our front desk or submitting a cancellation request through your member dashboard. Cancellations take effect at the end of the current billing cycle. No refunds will be issued for partial months. Any unused treatment credits or rollover benefits will expire 30 days after cancellation.

4. Treatment Credits & Rollovers
Monthly treatment credits included with your membership must be used within the calendar month unless your tier includes rollover benefits. Rollover credits are valid for up to 60 days beyond their original expiration. Accumulated credits have no cash value and cannot be redeemed for products or gift cards.

5. Pricing & Tier Changes
MADE Med Spa reserves the right to adjust membership pricing with 30 days' written notice. You may upgrade or downgrade your tier at any time; changes take effect at the start of the next billing cycle. Promotional rates, if applicable, are honored for the duration specified at enrollment.

6. Code of Conduct
Members are expected to arrive on time for scheduled appointments and to provide at least 24 hours' notice for cancellations. Repeated no-shows may result in the forfeiture of that month's treatment credit. We reserve the right to terminate a membership if conduct is deemed disruptive or in violation of our spa policies.

7. Liability & Consent
All treatments are performed by licensed professionals. A separate treatment consent form will be required before any procedure. MADE Med Spa is not liable for adverse reactions resulting from undisclosed medical conditions or failure to follow pre- and post-treatment care instructions.

8. Privacy
Your personal and payment information is handled in accordance with our Privacy Policy. We do not share your information with third parties except as necessary to process payments and deliver membership services.

9. Modifications
MADE Med Spa may update these terms from time to time. Members will be notified of material changes via email or through the member dashboard. Continued membership after notification constitutes acceptance of the revised terms.

By proceeding, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.`;

/* ── Progress Indicator ────────────────────────────── */
function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((label, i) => {
        const isCompleted = i < currentStep;
        const isActive = i === currentStep;

        return (
          <div key={label} className="flex items-center">
            {/* Connector line (before each step except the first) */}
            {i > 0 && (
              <div
                className="h-[2px] w-8 sm:w-12 md:w-16"
                style={{
                  backgroundColor:
                    i <= currentStep
                      ? "var(--color-burgundy)"
                      : "var(--color-stone)",
                }}
              />
            )}

            {/* Step circle + label */}
            <div className="flex flex-col items-center">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-all"
                style={{
                  backgroundColor:
                    isActive || isCompleted
                      ? "var(--color-burgundy)"
                      : "transparent",
                  borderColor:
                    isActive || isCompleted
                      ? "var(--color-burgundy)"
                      : "var(--color-stone)",
                  color:
                    isActive || isCompleted
                      ? "#fff"
                      : "var(--color-stone-dark)",
                  transitionDuration: "300ms",
                }}
              >
                {isCompleted ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 8 6.5 11.5 13 5" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className="mt-2 hidden text-center sm:block"
                style={{
                  fontSize: "var(--text-xs, 0.75rem)",
                  color:
                    isActive
                      ? "var(--color-burgundy)"
                      : "var(--color-stone-dark)",
                  fontWeight: isActive ? 600 : 400,
                  maxWidth: "5rem",
                  lineHeight: 1.3,
                }}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Step 1: Tier Confirmation ─────────────────────── */
function TierConfirmation({
  tier,
  tierSlug,
  onNext,
}: {
  tier: any;
  tierSlug: string | null;
  onNext: () => void;
}) {
  if (!tierSlug) {
    return (
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        <motion.p
          variants={revealUp}
          className="mb-8 text-[var(--color-brown)]"
          style={{ fontSize: "var(--text-lg)" }}
        >
          No membership tier selected. Please choose a tier from our membership
          page.
        </motion.p>
        <motion.div variants={revealUp}>
          <Link href="/membership" className="btn btn-primary">
            View Membership Tiers
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  if (tier === undefined) {
    return (
      <div className="flex items-center justify-center py-16">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
          style={{ borderColor: "var(--color-burgundy)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (tier === null) {
    return (
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        <motion.p
          variants={revealUp}
          className="mb-8 text-[var(--color-brown)]"
          style={{ fontSize: "var(--text-lg)" }}
        >
          We could not find the selected membership tier. It may no longer be
          available.
        </motion.p>
        <motion.div variants={revealUp}>
          <Link href="/membership" className="btn btn-primary">
            View Available Tiers
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={revealUp} className="mb-2">
        <span
          className="editorial-spacing text-[var(--color-stone-dark)]"
        >
          Selected Membership
        </span>
      </motion.div>

      <motion.h2
        variants={revealUp}
        className="headline-text mb-8"
        style={{
          fontSize: "var(--text-3xl)",
          color: "var(--color-chocolate)",
        }}
      >
        {tier.name} <span className="accent-text">Tier</span>
      </motion.h2>

      {/* Pricing card */}
      <motion.div
        variants={revealUp}
        className="mb-8 rounded-2xl border p-8"
        style={{
          borderColor: "var(--color-stone)",
          backgroundColor: "var(--color-cream)",
        }}
      >
        <div className="mb-6 flex items-baseline gap-2">
          <span
            className="headline-text"
            style={{
              fontSize: "var(--text-4xl)",
              color: "var(--color-burgundy)",
            }}
          >
            ${tier.monthlyPrice}
          </span>
          <span
            className="text-[var(--color-stone-dark)]"
            style={{ fontSize: "var(--text-base)" }}
          >
            / month
          </span>
        </div>

        {tier.description && (
          <p
            className="mb-6 leading-relaxed text-[var(--color-brown)]"
            style={{ fontSize: "var(--text-base)" }}
          >
            {tier.description}
          </p>
        )}

        {tier.benefits && tier.benefits.length > 0 && (
          <div>
            <h3
              className="editorial-spacing mb-4 text-[var(--color-stone-dark)]"
            >
              Included Benefits
            </h3>
            <ul className="flex flex-col gap-3">
              {tier.benefits.map((benefit: string, i: number) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-[var(--color-brown)]"
                  style={{ fontSize: "var(--text-base)" }}
                >
                  <span
                    className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: "var(--color-burgundy)" }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 8 6.5 11.5 13 5" />
                    </svg>
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>

      <motion.div variants={revealUp} className="flex justify-end">
        <button onClick={onNext} className="btn btn-primary">
          Continue to Terms
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ── Step 2: Terms & Conditions ────────────────────── */
function TermsAndConditions({
  agreed,
  setAgreed,
  onNext,
  onBack,
}: {
  agreed: boolean;
  setAgreed: (v: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={revealUp} className="mb-2">
        <span className="editorial-spacing text-[var(--color-stone-dark)]">
          Step 2 of 4
        </span>
      </motion.div>

      <motion.h2
        variants={revealUp}
        className="headline-text mb-8"
        style={{
          fontSize: "var(--text-3xl)",
          color: "var(--color-chocolate)",
        }}
      >
        Terms & <span className="accent-text">Conditions</span>
      </motion.h2>

      <motion.div
        variants={revealUp}
        className="mb-8 overflow-y-auto rounded-2xl border p-6 sm:p-8"
        style={{
          maxHeight: "24rem",
          borderColor: "var(--color-stone)",
          backgroundColor: "var(--color-cream)",
        }}
      >
        <pre
          className="whitespace-pre-wrap font-sans leading-relaxed text-[var(--color-brown)]"
          style={{ fontSize: "var(--text-sm, 0.875rem)" }}
        >
          {TERMS_TEXT}
        </pre>
      </motion.div>

      <motion.label
        variants={revealUp}
        className="mb-10 flex cursor-pointer items-start gap-3"
      >
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 h-5 w-5 flex-shrink-0 cursor-pointer rounded accent-[var(--color-burgundy)]"
        />
        <span
          className="leading-relaxed text-[var(--color-brown)]"
          style={{ fontSize: "var(--text-base)" }}
        >
          I have read and agree to the MADE Med Spa Membership Terms and
          Conditions outlined above.
        </span>
      </motion.label>

      <motion.div
        variants={revealUp}
        className="flex items-center justify-between"
      >
        <button onClick={onBack} className="btn btn-outline">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!agreed}
          className="btn btn-primary"
          style={{
            opacity: agreed ? 1 : 0.5,
            cursor: agreed ? "pointer" : "not-allowed",
          }}
        >
          Continue to Payment
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ── Step 3: Payment (Placeholder) ─────────────────── */
function PaymentStep({
  tier,
  onNext,
}: {
  tier: any;
  onNext: () => void;
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={revealUp} className="mb-2">
        <span className="editorial-spacing text-[var(--color-stone-dark)]">
          Step 3 of 4
        </span>
      </motion.div>

      <motion.h2
        variants={revealUp}
        className="headline-text mb-8"
        style={{
          fontSize: "var(--text-3xl)",
          color: "var(--color-chocolate)",
        }}
      >
        Complete <span className="accent-text">Payment</span>
      </motion.h2>

      {/* Order summary */}
      {tier && (
        <motion.div
          variants={revealUp}
          className="mb-8 rounded-2xl border p-6"
          style={{
            borderColor: "var(--color-stone)",
            backgroundColor: "var(--color-cream)",
          }}
        >
          <h3
            className="editorial-spacing mb-4 text-[var(--color-stone-dark)]"
          >
            Order Summary
          </h3>
          <div className="flex items-center justify-between">
            <span
              className="text-[var(--color-brown)]"
              style={{ fontSize: "var(--text-base)" }}
            >
              {tier.name} Membership (Monthly)
            </span>
            <span
              className="headline-text"
              style={{
                fontSize: "var(--text-xl)",
                color: "var(--color-burgundy)",
              }}
            >
              ${tier.monthlyPrice}/mo
            </span>
          </div>
        </motion.div>
      )}

      {/* Stripe placeholder */}
      <motion.div
        variants={revealUp}
        className="mb-8 rounded-2xl border-2 border-dashed p-10 text-center"
        style={{
          borderColor: "var(--color-stone)",
          backgroundColor: "var(--color-cream)",
        }}
      >
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--color-ivory)" }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-burgundy)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        </div>
        <h3
          className="mb-2 font-medium text-[var(--color-chocolate)]"
          style={{ fontSize: "var(--text-lg)" }}
        >
          Stripe Checkout Integration
        </h3>
        <p
          className="mx-auto max-w-md leading-relaxed text-[var(--color-stone-dark)]"
          style={{ fontSize: "var(--text-sm, 0.875rem)" }}
        >
          Secure payment processing via Stripe is coming soon. Once integrated,
          clicking the button below will redirect you to a Stripe-hosted
          checkout page to complete your subscription securely.
        </p>
      </motion.div>

      <motion.div variants={revealUp} className="flex justify-end">
        <button onClick={onNext} className="btn btn-primary">
          Complete Payment
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ── Step 4: Confirmation ──────────────────────────── */
function ConfirmationStep({ tier }: { tier: any }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="text-center"
    >
      {/* Checkmark circle */}
      <motion.div
        variants={revealUp}
        className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full"
        style={{ backgroundColor: "var(--color-burgundy)" }}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="4 12 9 17 20 6" />
        </svg>
      </motion.div>

      <motion.h2
        variants={revealUp}
        className="headline-text mb-4"
        style={{
          fontSize: "var(--text-3xl)",
          color: "var(--color-chocolate)",
        }}
      >
        Welcome to <span className="accent-text">MADE</span>
      </motion.h2>

      <motion.p
        variants={revealUp}
        className="mx-auto mb-4 max-w-lg leading-relaxed text-[var(--color-brown)]"
        style={{ fontSize: "var(--text-lg)" }}
      >
        Your {tier?.name || "membership"} enrollment is complete. We are
        thrilled to have you as part of the MADE family.
      </motion.p>

      <motion.div
        variants={revealUp}
        className="mx-auto mb-10 max-w-md rounded-2xl border p-6"
        style={{
          borderColor: "var(--color-stone)",
          backgroundColor: "var(--color-cream)",
        }}
      >
        <h3
          className="editorial-spacing mb-4 text-[var(--color-stone-dark)]"
        >
          What Happens Next
        </h3>
        <ul className="flex flex-col gap-3 text-left">
          {[
            "You will receive a confirmation email with your membership details.",
            "Your member benefits are active immediately.",
            "Visit your dashboard to book your first treatment at member-exclusive pricing.",
            "Our concierge team is available to help you make the most of your membership.",
          ].map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-[var(--color-brown)]"
              style={{ fontSize: "var(--text-sm, 0.875rem)" }}
            >
              <span
                className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium"
                style={{
                  backgroundColor: "var(--color-burgundy)",
                  color: "#fff",
                }}
              >
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        variants={revealUp}
        className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
      >
        <Link href="/dashboard" className="btn btn-primary">
          Go to Dashboard
        </Link>
        <Link href="/services" className="btn btn-outline">
          Browse Services
        </Link>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Signup Flow ──────────────────────────────── */
function SignupFlow() {
  const searchParams = useSearchParams();
  const tierSlug = searchParams.get("tier");

  const tier = useQuery(
    api.membershipTiers.getBySlug,
    tierSlug ? { slug: tierSlug } : "skip"
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const goNext = () => {
    if (currentStep < STEPS.length - 1) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  };

  return (
    <>
      {/* ═══════════════ HERO / HEADER ═══════════════ */}
      <section
        className="relative flex flex-col items-center justify-center px-6 text-center"
        style={{
          backgroundColor: "var(--color-ivory)",
          paddingTop: "calc(var(--nav-height, 5rem) + 3rem)",
          paddingBottom: "var(--space-lg, 2rem)",
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            variants={revealUp}
            className="editorial-spacing mb-4 text-[var(--color-stone-dark)]"
          >
            Membership Enrollment
          </motion.div>

          <motion.h1
            variants={revealUp}
            className="headline-text mb-10"
            style={{
              fontSize: "var(--text-4xl)",
              color: "var(--color-chocolate)",
            }}
          >
            Join <span className="accent-text">MADE</span>
          </motion.h1>

          {/* Step progress indicator */}
          <motion.div variants={revealUp}>
            <StepIndicator currentStep={currentStep} />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════ STEP CONTENT ═══════════════ */}
      <section
        className="px-6"
        style={{
          backgroundColor: "var(--color-ivory)",
          paddingTop: "var(--space-section)",
          paddingBottom: "var(--space-section)",
        }}
      >
        <div className="mx-auto max-w-2xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {currentStep === 0 && (
                <TierConfirmation
                  tier={tier}
                  tierSlug={tierSlug}
                  onNext={goNext}
                />
              )}
              {currentStep === 1 && (
                <TermsAndConditions
                  agreed={agreedToTerms}
                  setAgreed={setAgreedToTerms}
                  onNext={goNext}
                  onBack={goBack}
                />
              )}
              {currentStep === 2 && (
                <PaymentStep tier={tier} onNext={goNext} />
              )}
              {currentStep === 3 && <ConfirmationStep tier={tier} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}

/* ── Page Export (wrapped in Suspense for useSearchParams) ── */
export default function MembershipSignupPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-screen items-center justify-center"
          style={{ backgroundColor: "var(--color-ivory)" }}
        >
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
            style={{
              borderColor: "var(--color-burgundy)",
              borderTopColor: "transparent",
            }}
          />
        </div>
      }
    >
      <SignupFlow />
    </Suspense>
  );
}

"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

/* ── Framer Motion helpers ────────────────────────── */
const ease = [0.16, 1, 0.3, 1] as const;

const revealUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ── Next steps data ──────────────────────────────── */
const nextSteps = [
  {
    number: "01",
    title: "Order Processing",
    description:
      "Your order is being carefully prepared. You will receive a confirmation email with your order details and receipt shortly.",
  },
  {
    number: "02",
    title: "Shipping Notification",
    description:
      "Once your order ships, we will send you a tracking number so you can follow your package every step of the way.",
  },
  {
    number: "03",
    title: "Delivery",
    description:
      "Your products will arrive beautifully packaged and ready to elevate your skincare routine. Most orders arrive within 3-5 business days.",
  },
];

/* ── Helpers ──────────────────────────────────────── */
const CART_KEY = "made-cart";

/* ── Success Content ──────────────────────────────── */
function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  /* Clear cart on mount */
  useEffect(() => {
    localStorage.removeItem(CART_KEY);
  }, []);

  return (
    <>
      {/* ═══════════════ HERO / SUCCESS ═══════════════ */}
      <section
        className="relative flex min-h-[60vh] flex-col items-center justify-center px-6 text-center"
        style={{ backgroundColor: "var(--color-ivory)" }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="pt-[var(--nav-height)]"
        >
          {/* Success checkmark */}
          <motion.div
            variants={revealUp}
            className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full"
            style={{
              backgroundColor: "var(--color-cream)",
              border: "2px solid var(--color-burgundy)",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-burgundy)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>

          <motion.div
            variants={revealUp}
            className="editorial-spacing mb-6 text-[var(--color-stone-dark)]"
          >
            Purchase Complete
          </motion.div>

          <motion.h1
            variants={revealUp}
            className="headline-text mb-6"
            style={{
              fontSize: "var(--text-5xl)",
              color: "var(--color-chocolate)",
            }}
          >
            Order <span className="accent-text">Confirmed!</span>
          </motion.h1>

          <motion.p
            variants={revealUp}
            className="mx-auto max-w-xl leading-relaxed text-[var(--color-brown)]"
            style={{ fontSize: "var(--text-lg)" }}
          >
            Thank you for your purchase. Your order has been placed successfully
            and we are getting everything ready for you.
          </motion.p>
        </motion.div>

        {/* Bottom decorative line */}
        <div
          className="absolute bottom-8 left-1/2 h-12 w-[1px] -translate-x-1/2"
          style={{ backgroundColor: "var(--color-stone)" }}
        />
      </section>

      {/* ═══════════════ ORDER SUMMARY ═══════════════ */}
      <section
        className="px-6 lg:px-10"
        style={{
          backgroundColor: "var(--color-cream)",
          paddingTop: "var(--space-section)",
          paddingBottom: "var(--space-section)",
        }}
      >
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div
              variants={revealUp}
              className="accent-line mx-auto mb-8"
            />

            <motion.div
              variants={revealUp}
              className="editorial-spacing mb-4 text-center text-[var(--color-stone-dark)]"
            >
              Order Details
            </motion.div>

            <motion.h2
              variants={revealUp}
              className="headline-text mb-10 text-center"
              style={{
                fontSize: "var(--text-3xl)",
                color: "var(--color-chocolate)",
              }}
            >
              Your <span className="accent-text">Order</span> Summary
            </motion.h2>

            {/* Summary card */}
            <motion.div
              variants={revealUp}
              style={{
                backgroundColor: "var(--color-ivory)",
                borderRadius: "var(--border-radius-sm)",
                padding: "var(--space-2xl)",
                border: "1px solid var(--color-stone)",
              }}
            >
              <div className="flex flex-col gap-6">
                {sessionId && (
                  <div className="flex items-start justify-between">
                    <span
                      className="editorial-spacing text-[var(--color-stone-dark)]"
                      style={{ fontSize: "var(--text-xs)" }}
                    >
                      Order Reference
                    </span>
                    <span
                      className="max-w-[200px] truncate text-right text-[var(--color-brown)]"
                      style={{ fontSize: "var(--text-sm)" }}
                    >
                      {sessionId.slice(-12).toUpperCase()}
                    </span>
                  </div>
                )}

                {sessionId && (
                  <div
                    className="h-[1px] w-full"
                    style={{ backgroundColor: "var(--color-stone)" }}
                  />
                )}

                <div className="text-center">
                  <p
                    className="mb-2 leading-relaxed text-[var(--color-brown)]"
                    style={{ fontSize: "var(--text-base)" }}
                  >
                    A confirmation email with your full order details and receipt
                    has been sent to your email address.
                  </p>
                  <p
                    className="accent-text text-[var(--color-stone-dark)]"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    Please allow a few minutes for the email to arrive. Check
                    your spam folder if you do not see it.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ WHAT HAPPENS NEXT ═══════════════ */}
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
              Your Journey
            </div>
            <h2
              className="headline-text"
              style={{ fontSize: "var(--text-4xl)" }}
            >
              What Happens <span className="accent-text">Next</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
            {nextSteps.map((step) => (
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

      {/* ═══════════════ CTA / NAVIGATION ═══════════════ */}
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
            Thank you for choosing{" "}
            <span className="accent-text">MADE</span>
          </motion.h2>

          <motion.p
            variants={revealUp}
            className="mx-auto mb-10 max-w-lg leading-relaxed text-[var(--color-brown)]"
            style={{ fontSize: "var(--text-lg)" }}
          >
            Explore more of what we offer, from premium skincare to our
            signature treatments designed to help you look and feel your best.
          </motion.p>

          <motion.div
            variants={revealUp}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link href="/shop" className="btn btn-primary">
              Continue Shopping
            </Link>
            <Link href="/services" className="btn btn-accent">
              Browse Services
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Contact Us
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

/* ── Page Component ────────────────────────────────── */
export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-screen items-center justify-center"
          style={{ backgroundColor: "var(--color-ivory)" }}
        >
          <div className="text-center">
            <div
              className="editorial-spacing text-[var(--color-stone-dark)]"
              style={{ fontSize: "var(--text-sm)" }}
            >
              Loading
            </div>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

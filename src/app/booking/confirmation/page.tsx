"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

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

/* ── Next steps data ───────────────────────────────── */
const nextSteps = [
  {
    number: "01",
    title: "Check Your Email",
    description:
      "You will receive a confirmation email with all the details of your appointment, including date, time, and location.",
  },
  {
    number: "02",
    title: "Prepare for Your Visit",
    description:
      "Review any pre-treatment instructions included in your confirmation email. Arrive 10-15 minutes early for your first visit.",
  },
  {
    number: "03",
    title: "Enjoy Your Experience",
    description:
      "Relax and let our expert team take care of the rest. We are dedicated to making your visit exceptional from start to finish.",
  },
];

/* ── Confirmation Content ──────────────────────────── */
function ConfirmationContent() {
  const searchParams = useSearchParams();
  const serviceName = searchParams.get("service");
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  const hasDetails = serviceName || date || time;

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
            Booking Confirmed
          </motion.div>

          <motion.h1
            variants={revealUp}
            className="headline-text mb-6"
            style={{
              fontSize: "var(--text-5xl)",
              color: "var(--color-chocolate)",
            }}
          >
            Thank <span className="accent-text">You</span>
          </motion.h1>

          <motion.p
            variants={revealUp}
            className="mx-auto max-w-xl leading-relaxed text-[var(--color-brown)]"
            style={{ fontSize: "var(--text-lg)" }}
          >
            Your appointment has been successfully booked. We are looking forward
            to welcoming you to MADE Med Spa.
          </motion.p>
        </motion.div>

        {/* Bottom decorative line */}
        <div
          className="absolute bottom-8 left-1/2 h-12 w-[1px] -translate-x-1/2"
          style={{ backgroundColor: "var(--color-stone)" }}
        />
      </section>

      {/* ═══════════════ BOOKING SUMMARY ═══════════════ */}
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
              Appointment Details
            </motion.div>

            <motion.h2
              variants={revealUp}
              className="headline-text mb-10 text-center"
              style={{
                fontSize: "var(--text-3xl)",
                color: "var(--color-chocolate)",
              }}
            >
              Your <span className="accent-text">Booking</span> Summary
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
              {hasDetails ? (
                <div className="flex flex-col gap-6">
                  {serviceName && (
                    <div className="flex items-start justify-between">
                      <span
                        className="editorial-spacing text-[var(--color-stone-dark)]"
                        style={{ fontSize: "var(--text-xs)" }}
                      >
                        Service
                      </span>
                      <span
                        className="headline-text text-right text-[var(--color-chocolate)]"
                        style={{ fontSize: "var(--text-lg)" }}
                      >
                        {serviceName}
                      </span>
                    </div>
                  )}

                  {serviceName && (date || time) && (
                    <div
                      className="h-[1px] w-full"
                      style={{ backgroundColor: "var(--color-stone)" }}
                    />
                  )}

                  {date && (
                    <div className="flex items-start justify-between">
                      <span
                        className="editorial-spacing text-[var(--color-stone-dark)]"
                        style={{ fontSize: "var(--text-xs)" }}
                      >
                        Date
                      </span>
                      <span
                        className="text-[var(--color-brown)]"
                        style={{ fontSize: "var(--text-base)" }}
                      >
                        {date}
                      </span>
                    </div>
                  )}

                  {date && time && (
                    <div
                      className="h-[1px] w-full"
                      style={{ backgroundColor: "var(--color-stone)" }}
                    />
                  )}

                  {time && (
                    <div className="flex items-start justify-between">
                      <span
                        className="editorial-spacing text-[var(--color-stone-dark)]"
                        style={{ fontSize: "var(--text-xs)" }}
                      >
                        Time
                      </span>
                      <span
                        className="text-[var(--color-brown)]"
                        style={{ fontSize: "var(--text-base)" }}
                      >
                        {time}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p
                    className="mb-2 leading-relaxed text-[var(--color-brown)]"
                    style={{ fontSize: "var(--text-base)" }}
                  >
                    Your booking details have been sent to your email address.
                  </p>
                  <p
                    className="accent-text text-[var(--color-stone-dark)]"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    Please check your inbox for the full confirmation with date,
                    time, and service information.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ ADD TO CALENDAR ═══════════════ */}
      <section
        className="px-6 lg:px-10"
        style={{
          backgroundColor: "var(--color-ivory)",
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
            className="text-center"
          >
            <motion.div
              variants={revealUp}
              className="editorial-spacing mb-4 text-[var(--color-stone-dark)]"
            >
              Stay Organized
            </motion.div>

            <motion.h2
              variants={revealUp}
              className="headline-text mb-4"
              style={{
                fontSize: "var(--text-3xl)",
                color: "var(--color-chocolate)",
              }}
            >
              Add to <span className="accent-text">Calendar</span>
            </motion.h2>

            <motion.p
              variants={revealUp}
              className="mx-auto mb-10 max-w-md leading-relaxed text-[var(--color-brown)]"
              style={{ fontSize: "var(--text-base)" }}
            >
              Never miss your appointment. Add it directly to your preferred
              calendar app.
            </motion.p>

            <motion.div
              variants={revealUp}
              className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <button
                className="btn btn-primary"
                onClick={() => {
                  const baseUrl =
                    "https://calendar.google.com/calendar/render?action=TEMPLATE";
                  const title = encodeURIComponent(
                    `MADE Med Spa${serviceName ? ` - ${serviceName}` : ""}`
                  );
                  const details = encodeURIComponent(
                    "Your appointment at MADE Med Spa. Please arrive 10-15 minutes early."
                  );
                  const location = encodeURIComponent(
                    "MADE Med Spa, 123 Beauty Lane, Suite 100"
                  );
                  window.open(
                    `${baseUrl}&text=${title}&details=${details}&location=${location}`,
                    "_blank"
                  );
                }}
              >
                Google Calendar
              </button>

              <button
                className="btn btn-outline"
                onClick={() => {
                  const event = [
                    "BEGIN:VCALENDAR",
                    "VERSION:2.0",
                    "BEGIN:VEVENT",
                    `SUMMARY:MADE Med Spa${serviceName ? ` - ${serviceName}` : ""}`,
                    "DESCRIPTION:Your appointment at MADE Med Spa. Please arrive 10-15 minutes early.",
                    "LOCATION:MADE Med Spa\\, 123 Beauty Lane\\, Suite 100",
                    "END:VEVENT",
                    "END:VCALENDAR",
                  ].join("\r\n");
                  const blob = new Blob([event], {
                    type: "text/calendar;charset=utf-8",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "made-medspa-appointment.ics";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Download .ics File
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ NEXT STEPS ═══════════════ */}
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
              Before Your Visit
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
            We cannot wait to <span className="accent-text">see you</span>
          </motion.h2>

          <motion.p
            variants={revealUp}
            className="mx-auto mb-10 max-w-lg leading-relaxed text-[var(--color-brown)]"
            style={{ fontSize: "var(--text-lg)" }}
          >
            In the meantime, explore our other services or get in touch if you
            have any questions about your upcoming appointment.
          </motion.p>

          <motion.div
            variants={revealUp}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link href="/" className="btn btn-primary">
              Back to Home
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
export default function BookingConfirmationPage() {
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
      <ConfirmationContent />
    </Suspense>
  );
}

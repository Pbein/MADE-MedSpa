"use client";

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

const bookingUrl = process.env.NEXT_PUBLIC_PABAU_BOOKING_URL || "#";

const whatToExpect = [
  {
    number: "01",
    title: "Consultation",
    description:
      "Every visit begins with a personalized consultation to understand your goals, assess your needs, and craft a tailored treatment plan.",
  },
  {
    number: "02",
    title: "Treatment",
    description:
      "Our expert team performs your chosen service with meticulous care, using only premium products and the latest techniques.",
  },
  {
    number: "03",
    title: "Aftercare",
    description:
      "You will receive detailed aftercare instructions and ongoing support to ensure beautiful, lasting results.",
  },
];

const preparationTips = [
  "Arrive 10-15 minutes early to complete any necessary paperwork and settle in.",
  "Avoid blood-thinning medications and supplements (aspirin, fish oil, vitamin E) for 48 hours prior to injectable treatments.",
  "Come with a clean face, free of makeup, for facial treatments.",
  "Stay hydrated and avoid excessive sun exposure before your appointment.",
  "Inform us of any allergies, medications, or medical conditions during booking.",
];

const cancellationPolicy = {
  title: "Cancellation Policy",
  items: [
    "We kindly ask for at least 24 hours notice for any cancellations or rescheduling.",
    "Late cancellations (under 24 hours) may incur a fee of up to 50% of the service cost.",
    "No-shows will be charged the full service amount.",
    "We understand life happens. Please contact us as soon as possible if your plans change.",
  ],
};

export default function BookingPage() {
  return (
    <>
      {/* HERO */}
      <section>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p variants={revealUp}>
            Book Online
          </motion.p>

          <motion.h1 variants={revealUp}>
            Schedule Your Visit
          </motion.h1>

          <motion.p variants={revealUp}>
            Your journey to elevated beauty is just a click away. Book your
            appointment through our scheduling system and we will take care of
            the rest.
          </motion.p>

          <motion.div variants={revealUp}>
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book Your Appointment
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* WHAT TO EXPECT */}
      <section>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={revealUp}>
            <p>Your Visit</p>
            <h2>
              What to Expect
            </h2>
          </motion.div>

          <div>
            {whatToExpect.map((step) => (
              <motion.div key={step.number} variants={revealUp}>
                <div>{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* PREPARATION TIPS */}
      <section>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.p variants={revealLeft}>
            Before Your Visit
          </motion.p>
          <motion.h2 variants={revealLeft}>
            Preparation Tips
          </motion.h2>

          <ul>
            {preparationTips.map((tip, i) => (
              <motion.li key={i} variants={revealLeft}>
                <span>{i + 1}</span>
                <span>{tip}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* CANCELLATION POLICY */}
      <section>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.p variants={revealUp}>
            Good to Know
          </motion.p>
          <motion.h2 variants={revealUp}>
            Cancellation Policy
          </motion.h2>

          <motion.div variants={revealUp}>
            <ul>
              {cancellationPolicy.items.map((item, i) => (
                <motion.li key={i} variants={revealUp}>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
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
            Have questions before booking?
          </motion.h2>

          <motion.p variants={revealUp}>
            Our team is here to help you choose the perfect treatment and answer
            any questions you may have.
          </motion.p>

          <motion.div variants={revealUp}>
            <Link href="/contact">
              Contact Us
            </Link>
            <Link href="/services">
              Browse Services
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

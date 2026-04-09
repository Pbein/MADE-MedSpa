"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

export default function AboutTeaser() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section ref={ref}>
      <div>
        <div>
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: luxuryEase }}
          >
            <span>Our Philosophy</span>
            <h2>Where Science Meets Artistry</h2>
            <div />
            <p>
              At MADE, we believe beauty is deeply personal. Our approach
              combines advanced medical aesthetics with an artist&apos;s eye
              for balance, proportion, and harmony — ensuring every treatment
              enhances what makes you uniquely you.
            </p>
            <p>
              Founded on the principle that confidence is transformative,
              our team of experienced practitioners creates bespoke treatment
              plans that honor your natural features while delivering
              results that inspire.
            </p>
            <Link href="/about">
              Our Story &rarr;
            </Link>
          </motion.div>

          {/* Right: Image with decorative border offset */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: luxuryEase }}
          >
            <div>
              <img
                src="/placeholder.svg"
                alt="MADE Med Spa luxury interior"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

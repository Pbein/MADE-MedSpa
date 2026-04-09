"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

interface EditorialBreakProps {
  text: React.ReactNode;
  variant?: "dark" | "warm" | "silk";
}

export default function EditorialBreak({
  text,
  variant = "warm",
}: EditorialBreakProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref}>
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: luxuryEase }}
        >
          <div />
          <p>{text}</p>
          <div />
        </motion.div>
      </div>
    </section>
  );
}

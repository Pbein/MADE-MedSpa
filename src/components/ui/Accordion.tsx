"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

const luxuryEase = [0.16, 1, 0.3, 1] as const;

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            style={{ borderBottom: "1px solid var(--color-border)" }}
          >
            <button
              onClick={() => toggle(index)}
              className="flex w-full items-center justify-between py-6 text-left"
              style={{ cursor: "pointer", background: "none", border: "none" }}
              aria-expanded={isOpen}
            >
              <h6
                className="headline-text pr-4"
                style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--color-deep-cocoa)",
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                {item.question}
              </h6>

              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.3, ease: luxuryEase }}
                className="flex-shrink-0"
                style={{
                  fontSize: "var(--text-2xl)",
                  color: "var(--color-accent-text)",
                  lineHeight: 1,
                  fontWeight: 300,
                }}
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
                  transition={{ duration: 0.4, ease: luxuryEase }}
                  style={{ overflow: "hidden" }}
                >
                  <p
                    className="pb-6"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-base)",
                      color: "var(--color-warm-taupe)",
                      lineHeight: 1.7,
                      margin: 0,
                      fontWeight: 300,
                    }}
                  >
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

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
            style={{ borderBottom: "1px solid var(--color-line)" }}
          >
            <button
              onClick={() => toggle(index)}
              className="flex w-full items-center justify-between text-left"
              style={{
                cursor: "pointer",
                background: "none",
                border: "none",
                padding: "1.5rem 0",
              }}
              aria-expanded={isOpen}
            >
              <span
                className="pr-4"
                style={{
                  fontFamily: "var(--font-display, 'Playfair Display', serif)",
                  fontSize: "1.125rem",
                  color: "var(--color-ink)",
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                {item.question}
              </span>

              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.3, ease: luxuryEase }}
                className="flex-shrink-0"
                style={{
                  fontSize: "1.5rem",
                  color: "var(--color-blush)",
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
                    className="body-md"
                    style={{
                      color: "var(--color-olive)",
                      margin: 0,
                      paddingBottom: "1.5rem",
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

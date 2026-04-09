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
    <div className="w-full">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className="border-b"
            style={{ borderColor: "rgba(212, 195, 194, 0.2)" }}
          >
            <button
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between py-6 text-left cursor-pointer group"
              style={{ transition: "color 400ms ease" }}
            >
              <span
                className="font-headline italic text-xl"
                style={{ color: "var(--color-primary)" }}
              >
                {item.question}
              </span>

              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.4, ease: luxuryEase }}
                className="flex-shrink-0 ml-6 text-2xl font-light select-none"
                style={{ color: "var(--color-secondary)" }}
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
                  className="overflow-hidden"
                >
                  <p
                    className="body-editorial pb-6"
                    style={{ color: "var(--color-on-surface-variant)" }}
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

"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import Accordion from "@/components/ui/Accordion";

const faqCategories = [
  "All",
  "General",
  "Services",
  "Membership",
  "Booking",
  "Aftercare",
];

const luxuryEase = [0.16, 1, 0.3, 1] as const;

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function FAQPage() {
  const faqs = useQuery(api.faqs.list);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 250);
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const revealElements = document.querySelectorAll(
      ".reveal-up, .reveal-fade"
    );
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [faqs, activeCategory, debouncedSearch]);

  const filteredFaqs = useMemo(() => {
    if (!faqs) return [];
    const search = debouncedSearch.toLowerCase();

    return faqs.filter((faq) => {
      const matchesCategory =
        activeCategory === "All" || faq.category === activeCategory;
      const matchesSearch =
        !search ||
        faq.question.toLowerCase().includes(search) ||
        faq.answer.toLowerCase().includes(search);
      return matchesCategory && matchesSearch;
    });
  }, [faqs, activeCategory, debouncedSearch]);

  const groupedFaqs = useMemo(() => {
    const groups: Record<string, typeof filteredFaqs> = {};
    for (const faq of filteredFaqs) {
      const cat = faq.category || "General";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(faq);
    }
    return groups;
  }, [filteredFaqs]);

  const categoryKeys = Object.keys(groupedFaqs);

  return (
    <main>
      {/* Hero */}
      <section>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: luxuryEase }}
        >
          Support
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: luxuryEase, delay: 0.15 }}
        >
          Frequently Asked Questions
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: luxuryEase, delay: 0.3 }}
        >
          Find answers to common questions about our treatments, membership
          programs, and booking process.
        </motion.p>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: luxuryEase, delay: 0.45 }}
        >
          <div>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search questions..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </motion.div>
      </section>

      {/* Category Pills */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: luxuryEase, delay: 0.55 }}
        >
          {faqCategories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            );
          })}
        </motion.div>
      </section>

      {/* FAQ Accordion */}
      <section>
        {faqs === undefined ? (
          <div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div />
                <div />
              </div>
            ))}
          </div>
        ) : filteredFaqs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: luxuryEase }}
          >
            <h3>No matching questions found</h3>
            <p>
              Try adjusting your search or browse a different category.
            </p>
            <Link href="/contact">
              Contact Us
            </Link>
          </motion.div>
        ) : activeCategory !== "All" ? (
          <Accordion
            items={filteredFaqs.map((faq) => ({
              question: faq.question,
              answer: faq.answer,
            }))}
          />
        ) : (
          categoryKeys.map((cat) => (
            <div
              key={cat}
              ref={(el) => {
                if (el) sectionRefs.current.set(cat, el);
              }}
            >
              <motion.h3
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, ease: luxuryEase }}
              >
                {cat}
              </motion.h3>
              <Accordion
                items={groupedFaqs[cat].map((faq) => ({
                  question: faq.question,
                  answer: faq.answer,
                }))}
              />
            </div>
          ))
        )}
      </section>

      {/* CTA */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: luxuryEase }}
        >
          <p>Need More Help?</p>
          <h2>Still Have Questions?</h2>
          <p>
            Our team is here to help. Reach out and we will get back to you
            promptly.
          </p>
          <Link href="/contact">
            Contact Us
          </Link>
        </motion.div>
      </section>
    </main>
  );
}

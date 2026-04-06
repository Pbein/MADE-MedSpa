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
    <main className="min-h-screen">
      {/* Hero — Espresso */}
      <section
        className="section-dark flex flex-col items-center justify-center px-6 text-center"
        style={{
          backgroundColor: "var(--color-espresso)",
          paddingTop: "calc(var(--nav-height) + var(--space-5xl))",
          paddingBottom: "var(--space-3xl)",
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: luxuryEase }}
          className="eyebrow mb-6"
          style={{ color: "rgba(247,246,235,0.5)" }}
        >
          Support
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: luxuryEase, delay: 0.15 }}
          className="headline-display mb-4"
          style={{ color: "var(--color-glaze)" }}
        >
          Frequently{" "}
          <span style={{ color: "var(--color-matcha)" }}>Asked</span>{" "}
          Questions
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: luxuryEase, delay: 0.3 }}
          className="body-lg mx-auto mb-10 max-w-lg"
          style={{ color: "rgba(247,246,235,0.65)" }}
        >
          Find answers to common questions about our treatments, membership
          programs, and booking process.
        </motion.p>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: luxuryEase, delay: 0.45 }}
          className="mx-auto w-full max-w-xl"
        >
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(247,246,235,0.5)"
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
              className="input-luxury w-full py-4 pl-14 pr-6"
              style={{
                backgroundColor: "transparent",
                color: "var(--color-glaze)",
                borderColor: "rgba(247,246,235,0.2)",
              }}
            />
          </div>
        </motion.div>
      </section>

      {/* Category Pills — Glaze */}
      <section
        className="section-light px-6 lg:px-10"
        style={{ paddingTop: "var(--space-3xl)", paddingBottom: 0 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: luxuryEase, delay: 0.55 }}
          className="mx-auto mb-12 flex max-w-[var(--max-width)] flex-wrap items-center justify-center gap-2 sm:gap-3"
        >
          {faqCategories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="rounded-full px-5 py-2 text-sm font-medium tracking-wide transition-colors"
                style={{
                  backgroundColor: isActive
                    ? "var(--color-blush)"
                    : "var(--color-white-soft)",
                  color: isActive ? "#fff" : "var(--color-olive)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {cat}
              </button>
            );
          })}
        </motion.div>
      </section>

      {/* FAQ Accordion — Glaze */}
      <section
        className="section-light mx-auto max-w-3xl px-6 lg:px-10"
        style={{ paddingBottom: "var(--space-4xl)" }}
      >
        {faqs === undefined ? (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="py-6"
                style={{ borderBottom: "1px solid var(--color-line)" }}
              >
                <div
                  className="mb-3 h-5 w-3/4 animate-pulse rounded"
                  style={{ backgroundColor: "var(--color-silk)" }}
                />
                <div
                  className="h-3 w-1/2 animate-pulse rounded"
                  style={{ backgroundColor: "var(--color-silk)" }}
                />
              </div>
            ))}
          </div>
        ) : filteredFaqs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: luxuryEase }}
            className="py-20 text-center"
          >
            <h3
              className="headline-section mb-4"
              style={{ color: "var(--color-ink)" }}
            >
              No matching questions found
            </h3>
            <p
              className="body-md mb-8"
              style={{ color: "var(--color-olive)" }}
            >
              Try adjusting your search or browse a different category.
            </p>
            <Link href="/contact" className="btn-primary">
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
              className="mb-12"
            >
              <motion.h3
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, ease: luxuryEase }}
                className="headline-section mb-6"
                style={{
                  color: "var(--color-ink)",
                  paddingBottom: "var(--space-sm)",
                  borderBottom: "1px solid var(--color-line)",
                }}
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

      {/* CTA — Espresso */}
      <section
        className="section-dark text-center"
        style={{
          backgroundColor: "var(--color-espresso)",
          padding: "var(--space-section) var(--space-xl)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: luxuryEase }}
        >
          <p
            className="eyebrow mb-4"
            style={{ color: "rgba(247,246,235,0.5)" }}
          >
            Need More Help?
          </p>
          <h2
            className="headline-section mx-auto mb-4 max-w-md"
            style={{ color: "var(--color-glaze)" }}
          >
            Still Have Questions?
          </h2>
          <p
            className="body-lg mx-auto mb-8 max-w-md"
            style={{ color: "rgba(247,246,235,0.65)" }}
          >
            Our team is here to help. Reach out and we will get back to you
            promptly.
          </p>
          <Link href="/contact" className="btn-primary">
            Contact Us
          </Link>
        </motion.div>
      </section>
    </main>
  );
}

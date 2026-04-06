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
      {/* Hero */}
      <section
        className="section-dark flex flex-col items-center justify-center px-6 text-center"
        style={{
          paddingTop: "calc(var(--nav-height) + var(--space-5xl))",
          paddingBottom: "var(--space-3xl)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: luxuryEase }}
          className="editorial-spacing mb-6"
          style={{ color: "var(--color-cream)" }}
        >
          Support
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: luxuryEase, delay: 0.15 }}
          className="headline-text mb-4"
          style={{
            fontSize: "var(--text-5xl)",
            color: "var(--color-soft-ivory)",
          }}
        >
          Frequently{" "}
          <span className="accent-text" style={{ color: "var(--color-accent)" }}>
            Asked
          </span>{" "}
          Questions
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: luxuryEase, delay: 0.3 }}
          className="mx-auto mb-10 max-w-lg"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-lg)",
            color: "rgba(247, 246, 235, 0.7)",
            lineHeight: 1.7,
            fontWeight: 300,
          }}
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
          <div
            className="relative"
            style={{
              border: "1px solid var(--color-border)",
              borderRadius: "var(--border-radius-full)",
              backgroundColor: "var(--color-linen)",
              transition: "border-color var(--duration-fast) var(--ease-smooth)",
            }}
          >
            <svg
              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-cream)"
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
              className="w-full border-none bg-transparent py-4 pl-14 pr-6 outline-none"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                color: "var(--color-deep-cocoa)",
              }}
            />
          </div>
        </motion.div>
      </section>

      {/* Category Pills */}
      <section className="mx-auto max-w-[var(--max-width)] px-6 lg:px-10" style={{ paddingTop: "var(--space-3xl)" }}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: luxuryEase, delay: 0.55 }}
          className="mb-12 flex flex-wrap items-center justify-center gap-2 sm:gap-4"
        >
          {faqCategories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="editorial-spacing relative px-4 py-2 transition-colors"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: isActive ? "var(--color-accent-text)" : "var(--color-warm-taupe)",
                  fontSize: "var(--text-xs)",
                }}
              >
                {cat}
                {isActive && (
                  <motion.div
                    layoutId="faqCategoryUnderline"
                    className="absolute bottom-0 left-0 right-0"
                    style={{
                      height: "1.5px",
                      backgroundColor: "var(--color-accent)",
                    }}
                    transition={{ duration: 0.3, ease: luxuryEase }}
                  />
                )}
              </button>
            );
          })}
        </motion.div>
      </section>

      {/* FAQ Content */}
      <section
        className="mx-auto max-w-3xl px-6 lg:px-10"
        style={{ paddingBottom: "var(--space-4xl)" }}
      >
        {faqs === undefined ? (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="py-6" style={{ borderBottom: "1px solid var(--color-border)" }}>
                <div className="mb-3 h-5 w-3/4" style={{ backgroundColor: "var(--color-linen)", borderRadius: "var(--border-radius-sm)", animation: "pulse 2s ease-in-out infinite" }} />
                <div className="h-3 w-1/2" style={{ backgroundColor: "var(--color-linen)", borderRadius: "var(--border-radius-sm)", animation: "pulse 2s ease-in-out infinite" }} />
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
            <h3 className="headline-text mb-4" style={{ fontSize: "var(--text-2xl)", color: "var(--color-deep-cocoa)" }}>
              No matching questions found
            </h3>
            <p className="mb-8" style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-base)", color: "var(--color-warm-taupe)" }}>
              Try adjusting your search or browse a different category.
            </p>
            <Link href="/contact" className="btn btn-primary">
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
                className="headline-text mb-6"
                style={{
                  fontSize: "var(--text-2xl)",
                  color: "var(--color-deep-cocoa)",
                  paddingBottom: "var(--space-sm)",
                  borderBottom: "1px solid var(--color-border)",
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

      {/* Still Have Questions CTA */}
      <section
        className="section-dark text-center"
        style={{
          padding: "var(--space-section) var(--space-xl)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: luxuryEase }}
        >
          <span className="editorial-spacing mb-4 block" style={{ color: "var(--color-cream)" }}>
            Need More Help?
          </span>
          <h2
            className="headline-text mx-auto mb-4 max-w-md"
            style={{ fontSize: "var(--text-3xl)", color: "var(--color-soft-ivory)" }}
          >
            Still Have Questions?
          </h2>
          <p
            className="mx-auto mb-8 max-w-md"
            style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-base)", color: "rgba(247, 246, 235, 0.6)", lineHeight: 1.7, fontWeight: 300 }}
          >
            Our team is here to help. Reach out and we will get back to you
            promptly.
          </p>
          <Link href="/contact" className="btn btn-light">
            Contact Us
          </Link>
        </motion.div>
      </section>
    </main>
  );
}

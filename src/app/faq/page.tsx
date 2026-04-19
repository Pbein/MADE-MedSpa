"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import Accordion from "@/components/ui/Accordion";
import PageHero from "@/components/sections/PageHero";
import CTABanner from "@/components/sections/CTABanner";
import { usePageSettings } from "@/hooks/usePageSettings";

const faqCategories = [
  "General",
  "Services",
  "Booking",
  "Aftercare",
  "Membership",
  "All",
];

const editorialEase = [0.2, 0, 0, 1] as const;
const luxuryEase = [0.16, 1, 0.3, 1] as const;

const staggerHero = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const revealUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: luxuryEase } },
};

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
  const [activeCategory, setActiveCategory] = useState("General");
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 250);
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

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
  const { styleOverrides, isSectionVisible } = usePageSettings("faq");

  // FAQPage structured data for Google rich results
  const faqJsonLd = useMemo(() => {
    if (!faqs || faqs.length === 0) return null;
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };
  }, [faqs]);

  return (
    <main style={styleOverrides}>
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      {/* Hero */}
      {isSectionVisible("hero") && <PageHero
        dark
        eyebrow="Support"
        headline="Frequently Asked Questions"
        subtitle="Find answers to common questions about our treatments, membership programs, and booking process."
      >
        {/* Search Input */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-surface)] opacity-40"
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
              className="w-full bg-transparent border border-[var(--color-surface)] border-opacity-20 text-[var(--color-surface)] placeholder:text-[var(--color-surface)] placeholder:opacity-40 pl-12 pr-4 py-3 label-micro tracking-wider focus:outline-none focus:border-opacity-60 transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)]"
            />
          </div>
        </div>
      </PageHero>}

      {/* Category Pills */}
      <section className="bg-[var(--color-surface)] py-8">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            className="flex flex-wrap justify-center gap-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: editorialEase, delay: 0.55 }}
          >
            {faqCategories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`label-micro px-5 py-2.5 transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)] border-b-2 ${
                    isActive
                      ? "bg-[var(--color-primary)] text-[var(--color-on-primary)] border-transparent"
                      : "bg-transparent text-[var(--color-on-surface-variant)] border-transparent hover:border-[var(--color-on-surface-variant)]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="bg-[var(--color-surface)] py-32 md:py-40">
        <div className="mx-auto max-w-3xl px-6">
          {faqs === undefined ? (
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse space-y-3">
                  <div className="h-4 w-3/4 bg-[var(--color-surface-high)]" />
                  <div className="h-3 w-1/2 bg-[var(--color-surface-high)]" />
                </div>
              ))}
            </div>
          ) : filteredFaqs.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: editorialEase }}
            >
              <h3 className="headline-section mb-4">No matching questions found</h3>
              <p className="body-editorial text-[var(--color-on-surface-variant)] mb-10">
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
                className="mb-16"
              >
                <motion.h3
                  className="headline-section mb-8"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.5, ease: editorialEase }}
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
        </div>
      </section>

      {/* CTA */}
      {isSectionVisible("cta") && (
        <CTABanner
          dark
          headline="Still Have Questions?"
          subtitle="Our team is here to help. Reach out and we will get back to you promptly."
          ctaText="Contact Us"
          ctaHref="/contact"
          secondaryText="Browse Services"
          secondaryHref="/services"
        />
      )}
    </main>
  );
}

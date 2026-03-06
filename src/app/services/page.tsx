"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import ServiceCard from "@/components/sections/ServiceCard";

const categories = ["All", "Injectables", "Skin", "Body", "Wellness"];
const luxuryEase = [0.16, 1, 0.3, 1] as const;

export default function ServicesPage() {
  const services = useQuery(api.services.list);
  const [activeCategory, setActiveCategory] = useState("All");
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Scroll reveal for hero
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

    const revealElements = document.querySelectorAll(".reveal-up, .reveal-fade");
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [services]);

  const filteredServices =
    services?.filter(
      (s) => activeCategory === "All" || s.category === activeCategory
    ) ?? [];

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-ivory)" }}
    >
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="flex flex-col items-center justify-center px-6 text-center"
        style={{
          paddingTop: "calc(var(--nav-height) + var(--space-5xl))",
          paddingBottom: "var(--space-4xl)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: luxuryEase }}
          className="editorial-spacing mb-6"
          style={{ color: "var(--color-stone-dark)" }}
        >
          Treatments
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: luxuryEase, delay: 0.15 }}
          className="headline-text mb-6"
          style={{
            fontSize: "var(--text-5xl)",
            color: "var(--color-chocolate)",
          }}
        >
          <span className="accent-text" style={{ color: "var(--color-burgundy)" }}>
            Discover
          </span>{" "}
          Our Services
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: luxuryEase, delay: 0.4 }}
          className="accent-line mx-auto"
        />
      </section>

      {/* Category Filter Pills */}
      <section className="mx-auto max-w-[var(--max-width)] px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: luxuryEase, delay: 0.5 }}
          className="mb-12 flex flex-wrap items-center justify-center gap-2 sm:gap-4"
        >
          {categories.map((cat) => {
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
                  color: isActive
                    ? "var(--color-burgundy)"
                    : "var(--color-brown)",
                  fontSize: "var(--text-xs)",
                }}
              >
                {cat}
                {isActive && (
                  <motion.div
                    layoutId="categoryUnderline"
                    className="absolute bottom-0 left-0 right-0"
                    style={{
                      height: "1.5px",
                      backgroundColor: "var(--color-burgundy)",
                    }}
                    transition={{ duration: 0.3, ease: luxuryEase }}
                  />
                )}
              </button>
            );
          })}
        </motion.div>
      </section>

      {/* Services Grid */}
      <section
        ref={gridRef}
        className="mx-auto max-w-[var(--max-width)] px-6 pb-[var(--space-section)] lg:px-10"
      >
        {services === undefined ? (
          /* Loading state */
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="service-card" style={{ borderRadius: "var(--border-radius-sm)" }}>
                <div
                  className="image-container"
                  style={{
                    backgroundColor: "var(--color-cream)",
                    animation: "pulse 2s ease-in-out infinite",
                  }}
                />
                <div className="content">
                  <div
                    className="mb-3 h-3 w-20"
                    style={{
                      backgroundColor: "var(--color-cream)",
                      borderRadius: "var(--border-radius-sm)",
                    }}
                  />
                  <div
                    className="mb-2 h-5 w-3/4"
                    style={{
                      backgroundColor: "var(--color-cream)",
                      borderRadius: "var(--border-radius-sm)",
                    }}
                  />
                  <div
                    className="h-12 w-full"
                    style={{
                      backgroundColor: "var(--color-cream)",
                      borderRadius: "var(--border-radius-sm)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="py-20 text-center">
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-lg)",
                color: "var(--color-brown)",
              }}
            >
              No services found in this category.
            </p>
          </div>
        ) : (
          <LayoutGroup>
            <motion.div
              layout
              className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {filteredServices.map((service) => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        )}
      </section>
    </main>
  );
}

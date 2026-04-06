"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import ServiceCard from "@/components/sections/ServiceCard";
import Link from "next/link";

const categories = ["All", "Injectables", "Skin", "Body", "Wellness"];
const luxuryEase = [0.16, 1, 0.3, 1] as const;

export default function ServicesPage() {
  const services = useQuery(api.services.list);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredServices =
    services?.filter((s) => {
      const matchesCategory =
        activeCategory === "All" || s.category === activeCategory;
      const matchesSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.shortDescription?.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    }) ?? [];

  return (
    <main className="min-h-screen">
      {/* Hero — Glaze */}
      <section
        ref={heroRef}
        className="section-light flex flex-col items-center justify-center text-center"
        style={{
          paddingTop: "calc(var(--nav-height) + clamp(3rem, 2rem + 4vw, 5rem))",
          paddingBottom: "clamp(2rem, 1.5rem + 3vw, 4rem)",
        }}
      >
        <div className="container-page">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: luxuryEase }}
            className="eyebrow mb-6 block"
          >
            Treatments
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: luxuryEase, delay: 0.15 }}
            className="headline-display mb-6"
          >
            <span style={{ color: "var(--color-blush)" }}>Discover</span>{" "}
            Our Services
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: luxuryEase, delay: 0.3 }}
            className="body-lg mx-auto max-w-xl"
            style={{ color: "var(--color-mocha)" }}
          >
            Personalized treatments designed to enhance your natural beauty
            with precision, science, and artistry.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: luxuryEase, delay: 0.4 }}
            className="accent-line mx-auto mt-8"
          />
        </div>
      </section>

      {/* Filter Bar — Silk */}
      <section className="section-alt" style={{ paddingTop: "clamp(2rem, 1.5rem + 2vw, 3rem)", paddingBottom: "clamp(2rem, 1.5rem + 2vw, 3rem)" }}>
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: luxuryEase, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="eyebrow transition-all"
                  style={{
                    padding: "0.5rem 1.25rem",
                    borderRadius: "9999px",
                    border: `1px solid ${isActive ? "var(--color-blush)" : "var(--color-line)"}`,
                    backgroundColor: isActive
                      ? "var(--color-blush)"
                      : "var(--color-white-soft)",
                    color: isActive
                      ? "#fff"
                      : "var(--color-olive)",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: luxuryEase, delay: 0.6 }}
            className="mx-auto mt-6 max-w-sm"
          >
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-luxury w-full text-center"
            />
          </motion.div>
        </div>
      </section>

      {/* Services Grid — Glaze */}
      <section ref={gridRef} className="section-light">
        <div className="container-page">
          {services === undefined ? (
            /* Skeleton Loaders */
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="overflow-hidden"
                  style={{
                    borderRadius: "var(--radius-lg, 1rem)",
                    backgroundColor: "var(--color-white-soft)",
                  }}
                >
                  <div
                    className="animate-pulse"
                    style={{
                      height: "16rem",
                      backgroundColor: "var(--color-silk)",
                    }}
                  />
                  <div style={{ padding: "1.5rem" }}>
                    <div
                      className="animate-pulse mb-3"
                      style={{
                        height: "0.75rem",
                        width: "5rem",
                        backgroundColor: "var(--color-silk)",
                        borderRadius: "0.25rem",
                      }}
                    />
                    <div
                      className="animate-pulse mb-2"
                      style={{
                        height: "1.25rem",
                        width: "75%",
                        backgroundColor: "var(--color-silk)",
                        borderRadius: "0.25rem",
                      }}
                    />
                    <div
                      className="animate-pulse"
                      style={{
                        height: "3rem",
                        width: "100%",
                        backgroundColor: "var(--color-silk)",
                        borderRadius: "0.25rem",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            /* Empty State */
            <div className="py-20 text-center">
              <p
                className="body-lg"
                style={{ color: "var(--color-mocha)" }}
              >
                No services found
                {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
                {search ? ` matching "${search}"` : ""}.
              </p>
            </div>
          ) : (
            /* Service Cards */
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
        </div>
      </section>

      {/* CTA — Espresso */}
      <section className="section-dark text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: luxuryEase }}
          className="container-page mx-auto max-w-2xl"
        >
          <span className="eyebrow mb-4 block" style={{ color: "var(--color-mocha)" }}>
            Your Journey Awaits
          </span>
          <h2
            className="headline-section mb-6"
            style={{ color: "var(--color-glaze)" }}
          >
            Ready to{" "}
            <span style={{ color: "var(--color-blush)" }}>Begin</span>?
          </h2>
          <p
            className="body-lg mx-auto mb-10 max-w-lg"
            style={{ color: "var(--color-mocha)" }}
          >
            Book a consultation and let us craft a personalized treatment plan
            just for you.
          </p>
          <Link href="/booking" className="btn-primary">
            Book Consultation
          </Link>
        </motion.div>
      </section>
    </main>
  );
}

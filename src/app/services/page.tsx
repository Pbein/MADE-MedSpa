"use client";

import { useState, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import ServiceCard from "@/components/sections/ServiceCard";
import Link from "next/link";

const categories = ["All", "Injectables", "Skin", "Body", "Wellness"];
const editorialEase = [0.2, 0, 0, 1] as const;

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
    <main>
      {/* Hero */}
      <section
        ref={heroRef}
        className="bg-[var(--color-surface)] pt-48 pb-20"
      >
        <div className="mx-auto max-w-7xl px-6 text-center">
          <motion.span
            className="label-micro block mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: editorialEase }}
          >
            Treatments
          </motion.span>

          <motion.h1
            className="headline-editorial"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: editorialEase, delay: 0.15 }}
          >
            Discover Our Services
          </motion.h1>

          <motion.p
            className="body-editorial mt-6 max-w-2xl mx-auto text-[var(--color-on-surface-variant)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: editorialEase, delay: 0.3 }}
          >
            Personalized treatments designed to enhance your natural beauty
            with precision, science, and artistry.
          </motion.p>

          <motion.div
            className="mx-auto mt-10 h-px w-24 bg-[var(--color-on-surface)] origin-center"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, ease: editorialEase, delay: 0.4 }}
          />
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-[var(--color-surface-low)] py-8">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: editorialEase, delay: 0.5 }}
          >
            {categories.map((cat) => {
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

          {/* Search */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: editorialEase, delay: 0.6 }}
          >
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-editorial w-64"
            />
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section ref={gridRef} className="bg-[var(--color-surface)] py-40">
        <div className="mx-auto max-w-7xl px-6">
          {services === undefined ? (
            /* Skeleton Loaders */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-[var(--color-surface-high)]" />
                  <div className="mt-6 space-y-3">
                    <div className="h-3 w-16 bg-[var(--color-surface-high)]" />
                    <div className="h-5 w-48 bg-[var(--color-surface-high)]" />
                    <div className="h-3 w-full bg-[var(--color-surface-high)]" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20">
              <p className="body-editorial text-[var(--color-on-surface-variant)]">
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
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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

      {/* CTA */}
      <section className="bg-[var(--color-primary)] py-40">
        <motion.div
          className="mx-auto max-w-7xl px-6 text-center"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: editorialEase }}
        >
          <span className="label-micro block mb-6 text-[var(--color-on-primary)] opacity-60">
            Your Journey Awaits
          </span>
          <h2 className="headline-editorial text-[var(--color-on-primary)]">
            Ready to Begin?
          </h2>
          <p className="body-editorial mt-6 max-w-xl mx-auto text-[var(--color-on-primary)] opacity-70">
            Book a consultation and let us craft a personalized treatment plan
            just for you.
          </p>
          <Link
            href="/booking"
            className="btn-light inline-block mt-10"
          >
            Book Consultation
          </Link>
        </motion.div>
      </section>
    </main>
  );
}

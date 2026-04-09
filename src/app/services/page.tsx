"use client";

import { useState, useRef } from "react";
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
    <main>
      {/* Hero */}
      <section ref={heroRef}>
        <div>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: luxuryEase }}
          >
            Treatments
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: luxuryEase, delay: 0.15 }}
          >
            Discover Our Services
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: luxuryEase, delay: 0.3 }}
          >
            Personalized treatments designed to enhance your natural beauty
            with precision, science, and artistry.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: luxuryEase, delay: 0.4 }}
          />
        </div>
      </section>

      {/* Filter Bar */}
      <section>
        <div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: luxuryEase, delay: 0.5 }}
          >
            {categories.map((cat) => {
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

          {/* Search */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: luxuryEase, delay: 0.6 }}
          >
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section ref={gridRef}>
        <div>
          {services === undefined ? (
            /* Skeleton Loaders */
            <div>
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div />
                  <div>
                    <div />
                    <div />
                    <div />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            /* Empty State */
            <div>
              <p>
                No services found
                {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
                {search ? ` matching "${search}"` : ""}.
              </p>
            </div>
          ) : (
            /* Service Cards */
            <LayoutGroup>
              <motion.div layout>
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
      <section>
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: luxuryEase }}
        >
          <span>Your Journey Awaits</span>
          <h2>
            Ready to Begin?
          </h2>
          <p>
            Book a consultation and let us craft a personalized treatment plan
            just for you.
          </p>
          <Link href="/booking">
            Book Consultation
          </Link>
        </motion.div>
      </section>
    </main>
  );
}

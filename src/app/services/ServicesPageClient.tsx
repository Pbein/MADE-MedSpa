"use client";

import { useState, useRef } from "react";
import { useQuery } from "convex/react";
import type { Doc } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import ServiceCard from "@/components/sections/ServiceCard";
import PageHero from "@/components/sections/PageHero";
import CTABanner from "@/components/sections/CTABanner";
import { useSectionContent } from "@/hooks/useSectionContent";

const editorialEase = [0.2, 0, 0, 1] as const;

// Default landing shows N "top" services per category (sorted by sortOrder ASC).
// Karlyne controls the order via /admin/services. If a category has more than
// this, a "View all" link reveals the rest in the existing flat-grid view.
const TOP_PER_CATEGORY = 3;

type ServiceDoc = Doc<"services">;
type CategoryDoc = Doc<"serviceCategories">;

function CategoryGroups({
  services,
  categories,
  topN,
  onViewAll,
}: {
  services: ServiceDoc[];
  categories: CategoryDoc[];
  topN: number;
  onViewAll: (categoryName: string) => void;
}) {
  // Bucket services by their category string. Anything whose category doesn't
  // map to an active serviceCategory falls into a synthetic "Other" group at
  // the end so nothing disappears.
  const activeCategoryNames = new Set(categories.map((c) => c.name));
  const buckets = new Map<string, ServiceDoc[]>();
  for (const cat of categories) buckets.set(cat.name, []);
  const orphans: ServiceDoc[] = [];
  for (const s of services) {
    if (activeCategoryNames.has(s.category)) {
      buckets.get(s.category)!.push(s);
    } else {
      orphans.push(s);
    }
  }
  if (orphans.length > 0) buckets.set("Other", orphans);

  // Render in admin sortOrder, then orphans last.
  const orderedNames = [
    ...categories.map((c) => c.name),
    ...(orphans.length > 0 ? ["Other"] : []),
  ];

  return (
    <div className="space-y-24 md:space-y-32">
      {orderedNames.map((catName) => {
        const all = buckets.get(catName) ?? [];
        if (all.length === 0) return null;
        const top = all.slice(0, topN);
        const remaining = all.length - top.length;

        return (
          <div key={catName}>
            {/* Category header — eyebrow + section headline + divider */}
            <div className="text-center mb-12 md:mb-16">
              <span
                className="label-micro block mb-3"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                Treatment Category
              </span>
              <h2 className="headline-section text-base md:text-lg">{catName}</h2>
              <div className="mt-6 flex items-center justify-center gap-4">
                <div
                  className="w-12 h-px"
                  style={{ backgroundColor: "var(--color-outline-variant)" }}
                />
                <div
                  className="w-1.5 h-1.5 rotate-45 border"
                  style={{ borderColor: "var(--color-outline-variant)" }}
                />
                <div
                  className="w-12 h-px"
                  style={{ backgroundColor: "var(--color-outline-variant)" }}
                />
              </div>
            </div>

            {/* Top-N services in a 3-up grid (mobile stacks). */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {top.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>

            {/* "View all in [Category]" footer link, only if there's more to show. */}
            {remaining > 0 && (
              <div className="text-center mt-12">
                <button
                  type="button"
                  onClick={() => onViewAll(catName)}
                  className="link-editorial"
                >
                  View all {all.length} in {catName} &rarr;
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ServicesPageClient({
  heroBgUrl,
  pageSettings,
}: {
  heroBgUrl?: string;
  pageSettings?: Record<string, unknown>;
}) {
  const sections = (pageSettings as { sections?: Record<string, boolean> } | undefined)?.sections;
  const show = (key: string) => !sections || sections[key] !== false;
  const { data: heroText } = useSectionContent("section_services_hero", {
    eyebrow: "Treatments",
    headline: "Our Services. The Art of Self-Care.",
    subtitle: "Personalized treatments designed to enhance your natural beauty with precision, science, and artistry.",
  });
  const { data: ctaText } = useSectionContent("section_services_cta", {
    headline: "The path to effortless maintenance begins with a conversation.",
    subtitle: "Book a consultation and let us craft a personalized treatment plan just for you.",
    cta_text: "Book Consultation",
    cta_href: "/booking",
  });
  const services = useQuery(api.services.list);
  const dbCategories = useQuery(api.serviceCategories.listActive);
  const categories = ["All", ...(dbCategories?.map((c) => c.name) ?? [])];
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
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
    <div>
      {/* Hero */}
      {show("hero") && <div id="section-hero"><PageHero
        eyebrow={heroText.eyebrow}
        headline={heroText.headline}
        subtitle={heroText.subtitle}
        backgroundImage={heroBgUrl}
      /></div>}

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
              className="input-editorial w-full sm:w-64"
            />
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="section-grid" ref={gridRef} className="bg-[var(--color-surface)] py-32 md:py-40">
        <div className="mx-auto max-w-7xl px-6">
          {services === undefined || dbCategories === undefined ? (
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
            <div className="text-center py-20">
              <p className="body-editorial text-[var(--color-on-surface-variant)]">
                No services found
                {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
                {search ? ` matching "${search}"` : ""}.
              </p>
            </div>
          ) : activeCategory === "All" && !search ? (
            // Default landing: category-grouped view. Each active category becomes a
            // section showing its top-N services by sortOrder. "View all" jumps to
            // the filter-pill view of just that category.
            <CategoryGroups
              services={filteredServices}
              categories={dbCategories ?? []}
              topN={TOP_PER_CATEGORY}
              onViewAll={(catName) => {
                setActiveCategory(catName);
                gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            />
          ) : (
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
      {show("cta") && (
        <div id="section-cta">
        <CTABanner
          dark
          headline={ctaText.headline}
          subtitle={ctaText.subtitle}
          ctaText={ctaText.cta_text}
          ctaHref={ctaText.cta_href}
        />
        </div>
      )}
    </div>
  );
}

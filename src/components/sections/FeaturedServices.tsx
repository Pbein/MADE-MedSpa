"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

const PLACEHOLDER_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAFuOV46y5f-tZuSg4NqTlkUKk9a_bgM3uP-YsGi8hKLSWgyZM1-6TivwwdivePBl5_QK4nzLsr7VxMrzbGGCOX68zvSxalFPrpa_TfrEmAI1PjmQFg8BCiexVw4Aszv-Rnrt70QnmXjFPnqfqAcZkHc0KkIuqRzKotaerxKOv3jyDgQK-K7lRlhOIk--81c7urtUSt6wNq4nXBBXdMjOXQ6NJ7ZfbAyjLWub7HDMKFhAZOmWH5A0lWp96rTTc0HVQQJuuxORysBSjp",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDYyJoHapVw6DSqnZKPai--fiQ-V2NLMzJZb6subrgyKo9_K6qNzYQtEcb1M0kxpl7oVxYs9lvmINyKg0rE0_Fu6LS4yI6yFptwqI9lAr2ptRiPRm_ByHXHi53ASDrULjH_aSNe4dy45RjpPEpGNYBFpgd-8JTAjH1ndKb9S6iB_03ZsT4rY9iuk2wol7Y4KHjJRWidU8dmzgcxJhShVNy-KxOhdx9IwPkT_7yqHsy0-Z5TO8V_FZ--YBCFvDe6L8ud_MMSltaUEIkP",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCmaHoAc1xfiS6HzyW9uF3GOvIBIS2p0Ffrgz5u9wEI3ti0JDZB5oTXrJfhX5HvgnkBItH0-vv3h9lEJ8BK_Sc3BR30aj2c48Z4RZpG5XGU_VcX6l_g-pY2HKa9ulZuVg5nEJwz4eI115YDBx7iSNVGstEhCABtP-_rpOt1HD6sN9a-VrSnOBX0vewb-xLOABkeY6HmU2dO_ZEqJlMWY_LFUuTUMuDFwSecWvN3X-3TCcE-ALShTcDpgQZvEDNLuUe2EpU4jjpmXfcC",
];

const FALLBACK_LABELS = ["REGENERATION", "TEXTURE", "GLOW"];

export default function FeaturedServices() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const services = useQuery(api.services.list);

  const featured = services?.slice(0, 3);

  return (
    <section ref={ref} className="bg-[var(--color-surface-low)] py-40">
      {/* Section header */}
      <div className="px-12 md:px-24 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: luxuryEase }}
          className="text-center"
        >
          <h2 className="headline-section text-5xl md:text-6xl mb-4">
            Curated Services
          </h2>
          <div className="w-24 h-px bg-[var(--color-outline-variant)] mx-auto" />
        </motion.div>
      </div>

      {/* Service cards grid */}
      {featured ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-b border-[var(--color-outline-variant)]/15">
          {featured.map((service, i) => {
            const isDark = i === 1;
            const label = `0${i + 1} / ${service.category?.toUpperCase() || FALLBACK_LABELS[i]}`;
            const imageUrl = service.imageUrl || PLACEHOLDER_IMAGES[i];

            return (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.9,
                  delay: i * 0.15,
                  ease: luxuryEase,
                }}
                className={`group relative overflow-hidden p-12 transition-colors duration-700 ${
                  isDark
                    ? "bg-[var(--color-primary)] text-[var(--color-surface)]"
                    : "bg-[var(--color-surface)] hover:bg-[#fcfbf4]"
                } ${i < 2 ? "md:border-r border-[var(--color-outline-variant)]/15" : ""}`}
              >
                <Link href={`/services/${service.slug}`} className="block">
                  <p
                    className={`text-[10px] tracking-[0.3em] uppercase mb-12 ${
                      isDark
                        ? "text-[var(--color-surface-variant)]/60"
                        : "text-[var(--color-on-surface-variant)]"
                    }`}
                  >
                    {label}
                  </p>

                  <div className="overflow-hidden mb-12">
                    <img
                      src={imageUrl}
                      alt={service.name}
                      className={`w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-1000 ${
                        isDark
                          ? "opacity-80"
                          : "opacity-90 image-editorial-light"
                      }`}
                    />
                  </div>

                  <h3
                    className={`font-headline text-3xl italic mb-6 ${
                      isDark ? "text-[var(--color-surface)]" : ""
                    }`}
                  >
                    {service.name}
                  </h3>

                  <p
                    className={`font-body text-sm leading-loose mb-12 ${
                      isDark
                        ? "text-[var(--color-surface-variant)]/80"
                        : "text-[var(--color-on-surface-variant)] opacity-80"
                    }`}
                  >
                    {service.shortDescription}
                  </p>

                  <span
                    className={`inline-block text-4xl font-extralight group-hover:translate-x-4 transition-transform duration-700 ${
                      isDark
                        ? "text-[var(--color-surface-variant)]"
                        : "text-[var(--color-outline)]"
                    }`}
                  >
                    &rarr;
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Loading skeleton */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-b border-[var(--color-outline-variant)]/15">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`p-12 ${i === 1 ? "bg-[var(--color-primary)]" : "bg-[var(--color-surface)]"} ${
                i < 2 ? "md:border-r border-[var(--color-outline-variant)]/15" : ""
              }`}
            >
              <div className="h-4 w-32 bg-[var(--color-outline-variant)]/20 mb-12 animate-pulse" />
              <div className="w-full aspect-square bg-[var(--color-outline-variant)]/10 mb-12 animate-pulse" />
              <div className="h-8 w-48 bg-[var(--color-outline-variant)]/20 mb-6 animate-pulse" />
              <div className="h-4 w-full bg-[var(--color-outline-variant)]/10 mb-2 animate-pulse" />
              <div className="h-4 w-3/4 bg-[var(--color-outline-variant)]/10 animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {/* View all link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.8, ease: luxuryEase }}
        className="text-center mt-24 px-12"
      >
        <Link
          href="/services"
          className="link-editorial"
        >
          View All Services
        </Link>
      </motion.div>
    </section>
  );
}

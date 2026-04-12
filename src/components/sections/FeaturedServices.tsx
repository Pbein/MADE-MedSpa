"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

const DEFAULT_IMAGES = [
  "https://placehold.co/600x600/3c2415/f5f0e8?text=Regeneration",
  "https://placehold.co/600x600/5c3a1e/f5f0e8?text=Texture",
  "https://placehold.co/600x600/4a2c17/f5f0e8?text=Glow",
];

const FEATURED_KEYS = [
  "featured_service_image_1",
  "featured_service_image_2",
  "featured_service_image_3",
];

const FALLBACK_LABELS = ["REGENERATION", "TEXTURE", "GLOW"];

const viewportOnce = { once: true, margin: "-50px" } as const;

export default function FeaturedServices() {
  const services = useQuery(api.services.list);
  const img1 = useQuery(api.siteContent.getByKey, { key: FEATURED_KEYS[0] });
  const img2 = useQuery(api.siteContent.getByKey, { key: FEATURED_KEYS[1] });
  const img3 = useQuery(api.siteContent.getByKey, { key: FEATURED_KEYS[2] });
  const featuredImages = [
    img1?.imageUrl || DEFAULT_IMAGES[0],
    img2?.imageUrl || DEFAULT_IMAGES[1],
    img3?.imageUrl || DEFAULT_IMAGES[2],
  ];

  const featured = services?.slice(0, 3);

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      {/* ── Warm atmospheric transition from hero ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "linear-gradient(180deg,",
            "#ede8da 0%,",
            "#f0ebe0 6%,",
            "#f3efe6 15%,",
            "var(--color-surface-low) 35%,",
            "var(--color-surface) 100%)",
          ].join(" "),
        }}
      />

      {/* ── Mocha radial washes for tonal depth ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 50% 60% at 15% 20%, rgba(198,168,125,0.08) 0%, transparent 70%),",
            "radial-gradient(ellipse 50% 60% at 85% 50%, rgba(132,38,44,0.03) 0%, transparent 70%),",
            "radial-gradient(ellipse 80% 50% at 50% 90%, rgba(198,168,125,0.06) 0%, transparent 60%)",
          ].join(" "),
        }}
      />

      {/* ── Grain texture ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.025,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "180px 180px",
        }}
      />

      {/* ── Section header ── */}
      <div className="relative pt-32 md:pt-40 pb-20 md:pb-28 px-8 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 1, ease: luxuryEase }}
          className="max-w-3xl mx-auto text-center"
        >
          <span
            className="label-micro block mb-6"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Our Expertise
          </span>

          <h2
            className="headline-section text-4xl md:text-5xl lg:text-6xl mb-6"
            style={{ color: "var(--color-primary)" }}
          >
            Curated Services
          </h2>

          <p
            className="body-editorial max-w-xl mx-auto"
            style={{ color: "var(--color-on-surface-variant)", opacity: 0.8 }}
          >
            Each treatment is thoughtfully designed to enhance your natural beauty
            with precision, artistry, and care.
          </p>

          {/* Ornamental divider */}
          <div className="flex items-center justify-center gap-3 mt-10">
            <div
              className="w-12 h-px"
              style={{ backgroundColor: "var(--color-outline-variant)" }}
            />
            <div
              className="w-1.5 h-1.5 rotate-45"
              style={{ backgroundColor: "rgba(198,168,125,0.5)" }}
            />
            <div
              className="w-12 h-px"
              style={{ backgroundColor: "var(--color-outline-variant)" }}
            />
          </div>
        </motion.div>
      </div>

      {/* ── Service cards ── */}
      <div className="relative px-8 md:px-16 pb-32 md:pb-40">
        {featured ? (
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {featured.map((service, i) => {
              const label = `0${i + 1} / ${service.category?.toUpperCase() || FALLBACK_LABELS[i]}`;
              const imageUrl = service.imageUrl || featuredImages[i];

              return (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{
                    duration: 0.9,
                    delay: 0.1 + i * 0.15,
                    ease: luxuryEase,
                  }}
                >
                  <Link
                    href={`/services/${service.slug}`}
                    className="group block relative"
                  >
                    <div
                      className="relative overflow-hidden transition-all duration-700"
                      style={{
                        backgroundColor: "var(--color-surface-low)",
                        boxShadow: "0 2px 20px rgba(57,30,30,0.04)",
                      }}
                    >
                      <div className="overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={service.name}
                          className="w-full aspect-[4/5] object-cover group-hover:scale-[1.03] transition-transform duration-1000"
                          style={{ filter: "brightness(0.97) contrast(1.02)" }}
                        />
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              "linear-gradient(to bottom, transparent 50%, rgba(57,30,30,0.08) 100%)",
                          }}
                        />
                      </div>

                      <div className="p-8 md:p-10">
                        <p
                          className="text-[10px] tracking-[0.3em] uppercase mb-4"
                          style={{ color: "var(--color-on-surface-variant)", opacity: 0.6 }}
                        >
                          {label}
                        </p>

                        <h3
                          className="font-headline text-2xl md:text-3xl italic mb-4"
                          style={{ color: "var(--color-primary)" }}
                        >
                          {service.name}
                        </h3>

                        <p
                          className="font-body text-sm leading-relaxed mb-8"
                          style={{ color: "var(--color-on-surface-variant)", opacity: 0.75 }}
                        >
                          {service.shortDescription}
                        </p>

                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-px group-hover:w-12 transition-all duration-700"
                            style={{ backgroundColor: "var(--color-secondary)" }}
                          />
                          <span
                            className="text-xs tracking-[0.2em] uppercase"
                            style={{ color: "var(--color-secondary)" }}
                          >
                            Explore
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "var(--color-surface-low)",
                  boxShadow: "0 2px 20px rgba(57,30,30,0.04)",
                }}
              >
                <div
                  className="w-full aspect-[4/5] animate-pulse"
                  style={{ backgroundColor: "var(--color-surface-high)" }}
                />
                <div className="p-8 md:p-10">
                  <div className="h-3 w-24 bg-[var(--color-outline-variant)]/20 mb-4 animate-pulse" />
                  <div className="h-7 w-40 bg-[var(--color-outline-variant)]/20 mb-4 animate-pulse" />
                  <div className="h-4 w-full bg-[var(--color-outline-variant)]/10 mb-2 animate-pulse" />
                  <div className="h-4 w-3/4 bg-[var(--color-outline-variant)]/10 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.8, delay: 0.6, ease: luxuryEase }}
          className="text-center mt-20"
        >
          <Link href="/services" className="link-editorial">
            View All Services
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

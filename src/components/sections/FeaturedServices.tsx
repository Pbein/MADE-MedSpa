"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

const PLACEHOLDER_IMAGE = "/images/placeholder-service.svg";

const viewportOnce = { once: true, margin: "-50px" } as const;

interface ServiceData {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  category: string;
  imageUrl?: string;
}

interface FeaturedServicesContent {
  eyebrow: string;
  headline: string;
  body: string;
  link_text: string;
}

interface FeaturedServicesProps {
  services?: ServiceData[];
  featuredImageUrls?: (string | undefined)[];
  sectionContent?: FeaturedServicesContent;
}

export default function FeaturedServices({ services, featuredImageUrls, sectionContent }: FeaturedServicesProps) {
  // Stitch redesign: a 6-tile image grid (was 3 panel cards). Each tile is a
  // full-bleed service photo with an espresso gradient and the name set in
  // Playfair over the image, with an underline that grows in on hover.
  const featured = services?.slice(0, 6);

  // Per-tile image: prefer the service's own photo, then fall back to the
  // three admin "featured_service_image_*" slots (cycled), then a placeholder.
  const imageFor = (service: ServiceData, i: number) =>
    service.imageUrl || featuredImageUrls?.[i % 3] || PLACEHOLDER_IMAGE;

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
            "radial-gradient(ellipse 50% 60% at 15% 20%, rgba(215,207,197,0.08) 0%, transparent 70%),",
            "radial-gradient(ellipse 50% 60% at 85% 50%, rgba(132,38,44,0.03) 0%, transparent 70%),",
            "radial-gradient(ellipse 80% 50% at 50% 90%, rgba(215,207,197,0.06) 0%, transparent 60%)",
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

      {/* ── Botanical leaf texture (client's xv.png laurel pattern, self-hosted
           at /public/textures) tinted to brand MATCHA green via CSS mask, so it
           brings the green in as a subtle leaf accent. Low opacity = depth, not
           a loud pattern. ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: "var(--color-matcha)",
          opacity: 0.68,
          WebkitMaskImage: "url(/textures/xv.png)",
          maskImage: "url(/textures/xv.png)",
          WebkitMaskRepeat: "repeat",
          maskRepeat: "repeat",
          WebkitMaskSize: "294px 235px",
          maskSize: "294px 235px",
        }}
      />

      {/* ── Section header ── */}
      <div className="relative pt-32 md:pt-40 pb-16 md:pb-20 px-8 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 44 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 1, ease: luxuryEase }}
          className="max-w-3xl mx-auto flex flex-col items-center text-center"
        >
          {/* Eyebrow — 14px so it reads clearly (was a too-small 10px label) */}
          <span
            className="uppercase block mb-8"
            style={{
              fontFamily: "var(--font-label)",
              fontSize: "14px",
              letterSpacing: "0.3em",
              lineHeight: 1,
              color: "var(--color-primary)",
            }}
          >
            {sectionContent?.eyebrow || "Our Expertise"}
          </span>

          <h2
            className="headline-editorial text-5xl md:text-6xl lg:text-7xl mb-8 leading-[1.1] tracking-tight"
            style={{ color: "var(--color-primary)" }}
          >
            {sectionContent?.headline || "Curated Services"}
          </h2>

          <p
            className="font-body font-light max-w-[520px] mb-10"
            style={{
              fontSize: "18px",
              lineHeight: 1.6,
              color: "rgba(57,30,30,0.75)",
            }}
          >
            {sectionContent?.body || "Each treatment is thoughtfully designed to enhance your natural beauty with precision, artistry, and care."}
          </p>

          {/* Ornamental divider — hairline rules + center diamond (Stitch sample) */}
          <div className="flex items-center justify-center gap-4 w-full max-w-[240px]">
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(57,30,30,0.2)" }} />
            <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: "var(--color-primary)" }} />
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(57,30,30,0.2)" }} />
          </div>
        </motion.div>
      </div>

      {/* ── Service image tiles ── */}
      <div className="relative px-8 md:px-16 pb-16 md:pb-20">
        {featured ? (
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featured.map((service, i) => {
              const imageUrl = imageFor(service, i);
              return (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 48 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{
                    duration: 0.9,
                    delay: 0.1 + (i % 3) * 0.14,
                    ease: luxuryEase,
                  }}
                >
                  <Link
                    href={`/services/${service.slug}`}
                    className="group block relative overflow-hidden rounded-[12px] aspect-[4/5]"
                    style={{
                      backgroundColor: "var(--color-primary)",
                      boxShadow: "0 2px 24px rgba(57,30,30,0.06)",
                    }}
                  >
                    <Image
                      src={imageUrl}
                      alt={service.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-[1000ms] ease-[cubic-bezier(0.2,0,0,1)]"
                    />

                    {/* Espresso gradient so the title stays legible over any photo */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(57,30,30,0.85) 0%, rgba(57,30,30,0.20) 48%, rgba(57,30,30,0.04) 75%, transparent 100%)",
                      }}
                    />

                    <div className="absolute bottom-0 left-0 w-full p-7 md:p-8">
                      <p
                        className="text-[11px] tracking-[0.3em] uppercase mb-3"
                        style={{
                          color: "var(--color-on-primary, #f7f6eb)",
                          opacity: 0.7,
                          fontFamily: "var(--font-label)",
                        }}
                      >
                        {service.category || "Treatment"}
                      </p>

                      <h3
                        className="font-headline text-2xl md:text-[1.75rem] leading-tight"
                        style={{ color: "var(--color-on-primary, #f7f6eb)" }}
                      >
                        {service.name}
                      </h3>

                      {/* Underline grows in on hover */}
                      <div
                        className="mt-4 h-px w-0 group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.2,0,0,1)]"
                        style={{ backgroundColor: "var(--color-on-primary, #f7f6eb)" }}
                      />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="rounded-[12px] aspect-[4/5] animate-pulse"
                style={{ backgroundColor: "var(--color-surface-high)" }}
              />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.8, delay: 0.6, ease: luxuryEase }}
          className="text-center mt-16 md:mt-20"
        >
          <Link href="/services" className="btn-primary">
            {sectionContent?.link_text || "View All Services"}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

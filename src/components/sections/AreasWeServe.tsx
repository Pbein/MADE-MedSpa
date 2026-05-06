"use client";

import { motion } from "framer-motion";

const luxuryEase = [0.16, 1, 0.3, 1] as const;
const viewportOnce = { once: true, margin: "-80px" } as const;

export interface AreaItem {
  name: string;
  blurb?: string;
}

export interface AreasWeServeProps {
  eyebrow?: string;
  headline?: string;
  intro?: string;
  areas?: AreaItem[];
}

const DEFAULT_AREAS: AreaItem[] = [
  {
    name: "McLean",
    blurb: "Our home studio — convenient for clients across Northern Virginia.",
  },
  {
    name: "Tysons Corner",
    blurb: "Just minutes from Tysons — easy access for lunch-break consults.",
  },
  {
    name: "Arlington",
    blurb: "Serving Arlington and surrounding communities with personalized care.",
  },
  {
    name: "Vienna",
    blurb: "A short drive from Vienna for trusted aesthetic care.",
  },
  {
    name: "Great Falls",
    blurb: "Welcoming clients from Great Falls and the broader Fairfax area.",
  },
  {
    name: "Washington DC",
    blurb: "Drawing clients from across the DC metro area.",
  },
];

export default function AreasWeServe({
  eyebrow = "Areas We Serve",
  headline = "Serving the DC metro and Northern Virginia.",
  intro = "Based in McLean, MADE Med Spa welcomes clients from across the region — from Arlington and Tysons to Vienna, Great Falls, and Washington DC.",
  areas = DEFAULT_AREAS,
}: AreasWeServeProps) {
  return (
    <section
      id="section-areas-we-serve"
      className="py-20 md:py-28 px-6"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7, ease: luxuryEase }}
          className="mb-12 max-w-2xl"
        >
          <p
            className="label-micro mb-3"
            style={{ color: "var(--color-on-surface-variant)", opacity: 0.6 }}
          >
            {eyebrow}
          </p>
          <h2
            className="headline-section text-2xl md:text-3xl lg:text-4xl mb-5"
            style={{ color: "var(--color-primary)" }}
          >
            {headline}
          </h2>
          <p
            className="body-editorial text-base md:text-lg leading-relaxed"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            {intro}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-8">
          {areas.map((area, i) => (
            <motion.div
              key={area.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.5, ease: luxuryEase, delay: (i % 6) * 0.05 }}
            >
              <h3
                className="font-headline text-lg md:text-xl mb-1"
                style={{ color: "var(--color-primary)" }}
              >
                {area.name}
              </h3>
              {area.blurb && (
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-on-surface-variant)", opacity: 0.75 }}
                >
                  {area.blurb}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

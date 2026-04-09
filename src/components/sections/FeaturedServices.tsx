"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

export default function FeaturedServices() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const services = useQuery(api.services.list);

  const featured = services?.slice(0, 3);

  return (
    <section ref={ref}>
      <div>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: luxuryEase }}
        >
          <span>Signature Treatments</span>
          <h2>Curated Services</h2>
          <p>Every treatment is a collaboration between science, artistry, and you.</p>
        </motion.div>

        {/* Editorial Layout: 1 large + 2 small stacked */}
        {featured ? (
          <div>
            {/* Large featured card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: luxuryEase }}
            >
              <Link href={`/services/${featured[0]?.slug}`}>
                <div>
                  <img
                    src="/placeholder.svg"
                    alt={featured[0]?.name || ""}
                  />
                  <div>
                    <span>{featured[0]?.category}</span>
                    <h3>{featured[0]?.name}</h3>
                    <p>{featured[0]?.shortDescription}</p>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Two smaller cards stacked */}
            <div>
              {featured.slice(1, 3).map((service, i) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.9,
                    delay: 0.15 + i * 0.15,
                    ease: luxuryEase,
                  }}
                >
                  <Link href={`/services/${service.slug}`}>
                    <div>
                      <img
                        src="/placeholder.svg"
                        alt={service.name}
                      />
                    </div>
                    <div>
                      <span>{service.category}</span>
                      <h3>{service.name}</h3>
                      <p>{service.shortDescription}</p>
                      <span>Learn More &rarr;</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* Loading skeleton */
          <div>
            <div />
            <div>
              {[0, 1].map((i) => (
                <div key={i} />
              ))}
            </div>
          </div>
        )}

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8, ease: luxuryEase }}
        >
          <Link href="/services">
            View All Services &rarr;
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

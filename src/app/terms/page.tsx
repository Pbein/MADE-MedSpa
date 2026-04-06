"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export default function TermsPage() {
  const content = useQuery(api.siteContent.getByKey, { key: "terms_of_service" });

  return (
    <>
      {/* Hero */}
      <section
        className="section-dark relative flex min-h-[40vh] flex-col items-center justify-center px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="pt-[var(--nav-height)]"
        >
          <div
            className="editorial-spacing mb-6"
            style={{ color: "var(--color-cream)" }}
          >
            Legal
          </div>
          <h1
            className="headline-text mb-6"
            style={{
              fontSize: "var(--text-5xl)",
              color: "var(--color-soft-ivory)",
            }}
          >
            {content?.title || "Terms of Service"}
          </h1>
        </motion.div>
      </section>

      {/* Body */}
      <section
        className="px-6 lg:px-10"
        style={{
          backgroundColor: "var(--color-soft-ivory)",
          paddingTop: "var(--space-section)",
          paddingBottom: "var(--space-section)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="mx-auto max-w-3xl space-y-6"
          style={{
            fontSize: "var(--text-base)",
            color: "var(--color-warm-taupe)",
            fontWeight: 300,
            lineHeight: 1.8,
          }}
        >
          {content?.body ? (
            content.body.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))
          ) : (
            <p style={{ color: "var(--color-cream)", fontStyle: "italic" }}>
              Terms of service content is being prepared. Please check back soon.
            </p>
          )}
        </motion.div>
      </section>
    </>
  );
}

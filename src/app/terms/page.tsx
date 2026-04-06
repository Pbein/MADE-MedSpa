"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export default function TermsPage() {
  const content = useQuery(api.siteContent.getByKey, { key: "terms_of_service" });

  return (
    <>
      {/* Hero — Espresso */}
      <section
        className="section-dark relative flex min-h-[40vh] flex-col items-center justify-center px-6 text-center"
        style={{ backgroundColor: "var(--color-espresso)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="pt-[var(--nav-height)]"
        >
          <p
            className="eyebrow mb-6"
            style={{ color: "rgba(247,246,235,0.5)" }}
          >
            Legal
          </p>
          <h1
            className="headline-display mb-6"
            style={{ color: "var(--color-glaze)" }}
          >
            {content?.title || "Terms of Service"}
          </h1>
        </motion.div>
      </section>

      {/* Body — Glaze */}
      <section className="section-light px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="container-page mx-auto max-w-3xl space-y-6"
        >
          {content?.body ? (
            content.body.split("\n\n").map((paragraph, i) => (
              <p
                key={i}
                className="body-lg"
                style={{ color: "var(--color-olive)" }}
              >
                {paragraph}
              </p>
            ))
          ) : (
            <p style={{ color: "var(--color-mocha)", fontStyle: "italic" }}>
              Terms of service content is being prepared. Please check back soon.
            </p>
          )}
        </motion.div>
      </section>
    </>
  );
}

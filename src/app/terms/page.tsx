"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";

const editorialEase = [0.2, 0, 0, 1] as const;

export default function TermsPage() {
  const content = useQuery(api.siteContent.getByKey, { key: "terms_of_service" });

  return (
    <>
      {/* Hero */}
      <section className="bg-[var(--color-primary)] py-48">
        <motion.div
          className="mx-auto max-w-7xl px-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: editorialEase }}
        >
          <p className="label-micro text-[var(--color-surface)] opacity-60 mb-6">
            Legal
          </p>
          <h1 className="headline-editorial text-[var(--color-surface)]">
            {content?.title || "Terms of Service"}
          </h1>
        </motion.div>
      </section>

      {/* Body */}
      <section className="bg-[var(--color-surface)] py-40">
        <motion.div
          className="mx-auto max-w-3xl px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: editorialEase }}
        >
          {content?.body ? (
            content.body.split("\n\n").map((paragraph, i) => (
              <p
                key={i}
                className="body-editorial text-[var(--color-on-surface-variant)] mb-8 leading-relaxed"
              >
                {paragraph}
              </p>
            ))
          ) : (
            <p className="body-editorial text-[var(--color-on-surface-variant)]">
              Terms of service content is being prepared. Please check back soon.
            </p>
          )}
        </motion.div>
      </section>
    </>
  );
}

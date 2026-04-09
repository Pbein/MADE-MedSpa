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
      <section>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
        >
          <p>Legal</p>
          <h1>{content?.title || "Terms of Service"}</h1>
        </motion.div>
      </section>

      {/* Body */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
        >
          {content?.body ? (
            content.body.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))
          ) : (
            <p>
              Terms of service content is being prepared. Please check back soon.
            </p>
          )}
        </motion.div>
      </section>
    </>
  );
}

"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

interface EditorialBreakProps {
  text: React.ReactNode;
  variant?: "dark" | "warm" | "silk";
}

export default function EditorialBreak({
  text,
  variant = "warm",
}: EditorialBreakProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const isDark = variant === "dark";
  const isSilk = variant === "silk";

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        backgroundColor: isDark
          ? "var(--color-primary)"
          : "var(--color-surface-low)",
      }}
    >
      {/* Background texture for silk variant */}
      {isSilk && (
        <Image
          src="/images/editorial-break-bg.webp"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="object-cover"
        />
      )}

      {/* Subtle warmth for non-silk, non-dark */}
      {!isDark && !isSilk && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              "radial-gradient(ellipse 60% 80% at 30% 50%, rgba(215,207,197,0.07) 0%, transparent 70%),",
              "radial-gradient(ellipse 60% 80% at 70% 50%, rgba(132,38,44,0.03) 0%, transparent 70%)",
            ].join(" "),
          }}
        />
      )}

      <div className="relative py-36 md:py-48 px-8 md:px-16">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 44 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: luxuryEase }}
            className="flex flex-col items-center"
          >
            {/* Top ornament */}
            <div className="flex items-center gap-5 mb-14">
              <div
                className="w-16 h-px"
                style={{
                  backgroundColor: isDark
                    ? "rgba(247,246,235,0.15)"
                    : "rgba(215,207,197,0.35)",
                }}
              />
              <div
                className="w-1.5 h-1.5 rotate-45 border"
                style={{
                  borderColor: isDark
                    ? "rgba(247,246,235,0.2)"
                    : "rgba(215,207,197,0.4)",
                }}
              />
              <div
                className="w-16 h-px"
                style={{
                  backgroundColor: isDark
                    ? "rgba(247,246,235,0.15)"
                    : "rgba(215,207,197,0.35)",
                }}
              />
            </div>

            {/* Quote */}
            <p
              className="accent-quote font-light text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-snug md:leading-[1.3]"
              style={{
                color: isDark
                  ? "var(--color-on-surface, #f7f6eb)"
                  : "var(--color-primary, #391e1e)",
                textWrap: "balance",
                maxWidth: "44rem",
              } as React.CSSProperties}
            >
              {text}
            </p>

            {/* Bottom ornament */}
            <div className="flex items-center gap-5 mt-14">
              <div
                className="w-16 h-px"
                style={{
                  backgroundColor: isDark
                    ? "rgba(247,246,235,0.15)"
                    : "rgba(215,207,197,0.35)",
                }}
              />
              <div
                className="w-1.5 h-1.5 rotate-45 border"
                style={{
                  borderColor: isDark
                    ? "rgba(247,246,235,0.2)"
                    : "rgba(215,207,197,0.4)",
                }}
              />
              <div
                className="w-16 h-px"
                style={{
                  backgroundColor: isDark
                    ? "rgba(247,246,235,0.15)"
                    : "rgba(215,207,197,0.35)",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

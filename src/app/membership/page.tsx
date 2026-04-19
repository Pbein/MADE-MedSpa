"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import PageHero from "@/components/sections/PageHero";
import CTABanner from "@/components/sections/CTABanner";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { usePageSettings } from "@/hooks/usePageSettings";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

const BOOKING_URL =
  process.env.NEXT_PUBLIC_PABAU_BOOKING_URL ||
  "https://partner.pabau.com/online-bookings/made-51g64";

export default function MembershipPage() {
  const memberships = useQuery(api.memberships.list);
  const gridRef = useRef(null);
  const isInView = useInView(gridRef, { once: true, amount: 0.1 });
  const { styleOverrides, isSectionVisible, hero } = usePageSettings("membership");

  return (
    <main style={styleOverrides}>
      {isSectionVisible("hero") && <PageHero
        eyebrow="Membership"
        headline={
          <>
            Invest in You.{" "}
            <span className="font-extralight">Consistently.</span>
          </>
        }
        subtitle={hero.subtitle || "Exclusive tiers designed for every stage of your aesthetic journey. Real savings, real care, real results."}
      />}

      <section
        ref={gridRef}
        className="bg-[var(--color-surface)] py-24 md:py-36"
      >
        <div className="mx-auto max-w-7xl px-6">
          {!memberships ? (
            <div className="flex justify-center py-20">
              <div
                className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
                style={{ borderColor: "var(--color-outline-variant)" }}
              />
            </div>
          ) : memberships.length === 0 ? (
            <div className="text-center py-20">
              <p
                className="font-headline italic text-2xl mb-4"
                style={{ color: "var(--color-primary)" }}
              >
                Coming Soon
              </p>
              <p
                className="body-editorial"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                Membership tiers are being finalized. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
              {memberships.map((tier, i) => (
                <MembershipCard
                  key={tier._id}
                  tier={tier}
                  index={i}
                  isInView={isInView}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {isSectionVisible("cta") && (
        <CTABanner
          headline="Ready to become a member?"
          subtitle="Choose the tier that fits your goals and start saving on the treatments you love."
          ctaText={hero.ctaText || "Book Consultation"}
          ctaHref={hero.ctaLink || BOOKING_URL}
          ctaExternal={!hero.ctaLink}
          secondaryText="Contact Us"
          secondaryHref="/contact"
        />
      )}
    </main>
  );
}

function MembershipCard({
  tier,
  index,
  isInView,
}: {
  tier: {
    _id: string;
    name: string;
    price: number;
    billingPeriod: string;
    tagline: string;
    benefits: string[];
    isFeatured: boolean;
    pabauLink?: string;
  };
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        ease: luxuryEase,
        delay: index * 0.1,
      }}
      className="relative flex flex-col rounded-sm border p-8 lg:p-7 xl:p-8 transition-shadow duration-500 hover:shadow-[0_8px_40px_rgba(57,30,30,0.08)]"
      style={{
        borderColor: tier.isFeatured
          ? "var(--color-outline-variant)"
          : "rgba(215,207,197,0.4)",
        backgroundColor: "var(--color-surface)",
      }}
    >
      {tier.isFeatured && (
        <span
          className="label-micro absolute -top-0 left-6 -translate-y-1/2 px-3 py-1"
          style={{
            backgroundColor: "var(--color-surface-high)",
            color: "var(--color-on-surface-variant)",
          }}
        >
          Most popular
        </span>
      )}

      <h3
        className="label-micro mb-4"
        style={{ color: "var(--color-on-surface-variant)" }}
      >
        {tier.name}
      </h3>

      <div className="mb-4">
        <span
          className="text-3xl font-semibold tracking-tight"
          style={{ color: "var(--color-primary)" }}
        >
          ${tier.price}
        </span>
        <span
          className="text-sm ml-1"
          style={{ color: "var(--color-on-surface-variant)", opacity: 0.7 }}
        >
          /{tier.billingPeriod}
        </span>
      </div>

      <div
        className="h-px w-full mb-5"
        style={{ backgroundColor: "var(--color-outline-variant)", opacity: 0.3 }}
      />

      <p
        className="font-headline italic text-sm mb-6"
        style={{ color: "var(--color-on-surface-variant)", opacity: 0.8 }}
      >
        {tier.tagline}
      </p>

      <ul className="space-y-3 mb-8 flex-1">
        {tier.benefits.map((benefit, j) => (
          <li key={j} className="flex items-start gap-3">
            <span
              className="mt-1.5 h-px w-4 shrink-0"
              style={{ backgroundColor: "var(--color-outline-variant)" }}
            />
            <span
              className="body-editorial text-sm"
              style={{ color: "var(--color-on-surface)" }}
            >
              {benefit}
            </span>
          </li>
        ))}
      </ul>

      <a
        href={tier.pabauLink || BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={
          tier.isFeatured
            ? "btn-primary w-full text-center"
            : "btn-outline w-full text-center"
        }
      >
        Get Started
      </a>
    </motion.div>
  );
}

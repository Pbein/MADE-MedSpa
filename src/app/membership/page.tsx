"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import PageHero from "@/components/sections/PageHero";
import CTABanner from "@/components/sections/CTABanner";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { usePageSettings } from "@/hooks/usePageSettings";
import { useSectionContent } from "@/hooks/useSectionContent";
import PreviewBanner from "@/components/PreviewBanner";

const luxuryEase = [0.16, 1, 0.3, 1] as const;
const viewportOnce = { once: true, margin: "-50px" } as const;

const BOOKING_URL =
  process.env.NEXT_PUBLIC_PABAU_BOOKING_URL ||
  "https://partner.pabau.com/online-bookings/made-51g64";

export default function MembershipPage() {
  const memberships = useQuery(api.memberships.list);
  const gridRef = useRef(null);
  const isInView = useInView(gridRef, { once: true, amount: 0.1 });
  const { styleOverrides, isSectionVisible, isPreview } = usePageSettings("membership");
  const { data: heroText } = useSectionContent("section_membership_hero", {
    eyebrow: "Membership",
    headline: "Invest in You. Consistently.",
    subtitle: "Exclusive tiers designed for every stage of your aesthetic journey. Real savings, real care, real results.",
  });
  const { data: ctaText } = useSectionContent("section_membership_cta", {
    headline: "Ready to become a member?",
    subtitle: "Choose the tier that fits your goals and start saving on the treatments you love.",
    cta_text: "Book Consultation",
    cta_href: "",
    secondary_text: "Contact Us",
    secondary_href: "/contact",
  });

  return (
    <main style={styleOverrides}>
      {isPreview && <PreviewBanner />}
      {isSectionVisible("hero") && (
        <PageHero
          eyebrow={heroText.eyebrow}
          headline={
            <>
              {heroText.headline.split(".")[0]}.{" "}
              <span className="font-extralight">
                {heroText.headline.split(".").slice(1).join(".").trim() || "Consistently."}
              </span>
            </>
          }
          subtitle={heroText.subtitle}
        />
      )}

      {/* Membership Tiers */}
      <section
        ref={gridRef}
        className="py-32 md:py-40"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <div className="mx-auto max-w-7xl px-6">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16 md:mb-20"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.8, ease: luxuryEase }}
          >
            <span
              className="label-micro block mb-5"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Choose Your Tier
            </span>
            <h2
              className="headline-section text-3xl md:text-5xl mb-6"
              style={{ color: "var(--color-primary)" }}
            >
              Membership Plans
            </h2>

            {/* Ornamental divider */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="w-12 h-px" style={{ backgroundColor: "var(--color-outline-variant)" }} />
              <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: "rgba(215,207,197,0.5)" }} />
              <div className="w-12 h-px" style={{ backgroundColor: "var(--color-outline-variant)" }} />
            </div>
          </motion.div>

          {/* Cards */}
          {!memberships ? (
            <div className="flex justify-center py-20">
              <div
                className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
                style={{ borderColor: "var(--color-outline-variant)" }}
              />
            </div>
          ) : memberships.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-headline italic text-2xl mb-4" style={{ color: "var(--color-primary)" }}>
                Coming Soon
              </p>
              <p className="body-editorial" style={{ color: "var(--color-on-surface-variant)" }}>
                Membership tiers are being finalized. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
              {memberships.map((tier, i) => (
                <MembershipCard key={tier._id} tier={tier} index={i} isInView={isInView} />
              ))}
            </div>
          )}

          {/* Bottom note */}
          {memberships && memberships.length > 0 && (
            <motion.p
              className="text-center mt-16 body-editorial text-sm"
              style={{ color: "var(--color-on-surface-variant)", opacity: 0.6 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.6 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, ease: luxuryEase, delay: 0.4 }}
            >
              All memberships require a minimum 6-month commitment. Contact us for details.
            </motion.p>
          )}
        </div>
      </section>

      {isSectionVisible("cta") && (
        <CTABanner
          headline={ctaText.headline}
          subtitle={ctaText.subtitle}
          ctaText={ctaText.cta_text}
          ctaHref={ctaText.cta_href || BOOKING_URL}
          ctaExternal={!ctaText.cta_href}
          secondaryText={ctaText.secondary_text}
          secondaryHref={ctaText.secondary_href}
        />
      )}
    </main>
  );
}

// ── Membership Card ──────────────────────────────────────────────────────────

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
      initial={{ opacity: 0, y: 35 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: luxuryEase, delay: index * 0.1 }}
      className="relative flex flex-col border transition-all duration-700"
      style={{
        borderColor: tier.isFeatured
          ? "var(--color-outline-variant)"
          : "rgba(215,207,197,0.35)",
        backgroundColor: tier.isFeatured
          ? "var(--color-surface-lowest)"
          : "var(--color-surface)",
        boxShadow: tier.isFeatured
          ? "0 8px 40px rgba(57,30,30,0.06)"
          : "none",
      }}
    >
      {/* Featured badge */}
      {tier.isFeatured && (
        <div
          className="text-center py-2"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "var(--color-on-primary)",
          }}
        >
          <span className="label-micro" style={{ letterSpacing: "0.15em" }}>
            Most Popular
          </span>
        </div>
      )}

      <div className="flex flex-col flex-1 p-8 lg:p-7 xl:p-8">
        {/* Tier name */}
        <h3
          className="font-headline italic text-lg mb-6"
          style={{ color: "var(--color-primary)" }}
        >
          {tier.name}
        </h3>

        {/* Price */}
        <div className="mb-2">
          <span
            className="font-headline text-4xl xl:text-5xl tracking-tight"
            style={{ color: "var(--color-primary)" }}
          >
            ${tier.price}
          </span>
          <span
            className="text-sm ml-1.5"
            style={{ color: "var(--color-on-surface-variant)", opacity: 0.6 }}
          >
            /{tier.billingPeriod}
          </span>
        </div>

        {/* Tagline */}
        <p
          className="body-editorial text-sm mb-8"
          style={{ color: "var(--color-on-surface-variant)", opacity: 0.75 }}
        >
          {tier.tagline}
        </p>

        {/* Divider */}
        <div
          className="h-px w-full mb-6"
          style={{ backgroundColor: "var(--color-outline-variant)", opacity: 0.4 }}
        />

        {/* Benefits */}
        <ul className="space-y-3.5 mb-10 flex-1">
          {tier.benefits.map((benefit, j) => (
            <li key={j} className="flex items-start gap-3">
              <span
                className="mt-2 h-px w-4 shrink-0"
                style={{ backgroundColor: "var(--color-secondary)", opacity: 0.5 }}
              />
              <span
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-on-surface)", opacity: 0.85 }}
              >
                {benefit}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href={tier.pabauLink || BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`${tier.isFeatured ? "btn-primary" : "btn-outline"} w-full text-center`}
        >
          Get Started
        </a>
      </div>
    </motion.div>
  );
}

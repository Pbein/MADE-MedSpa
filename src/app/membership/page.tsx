"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import PageHeaderCompact from "@/components/sections/PageHeaderCompact";
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
    headline: "Membership Plans",
    subtitle: "Choose a plan that fits your routine. Save on treatments, stay consistent, see real results.",
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
        <PageHeaderCompact
          eyebrow={heroText.eyebrow}
          title={heroText.headline}
          description={heroText.subtitle}
        />
      )}

      {/* Membership Tiers */}
      <section
        ref={gridRef}
        className="pt-8 pb-32 md:pb-40"
        style={{
          background: "radial-gradient(circle at 20% 20%, rgba(216,192,187,0.2), transparent 40%), radial-gradient(circle at 80% 10%, rgba(201,170,150,0.15), transparent 35%), linear-gradient(180deg, var(--color-silk) 0%, var(--color-powder) 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl px-6">
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
      className="relative flex flex-col transition-all duration-700 group"
      style={{
        border: tier.isFeatured ? "none" : "1px solid rgba(57,30,30,0.06)",
        background: tier.isFeatured
          ? "linear-gradient(180deg, #ffffff 0%, var(--color-powder) 100%)"
          : "rgba(255,255,255,0.4)",
        boxShadow: tier.isFeatured
          ? "0 20px 50px rgba(57,30,30,0.12)"
          : "0 4px 20px rgba(57,30,30,0.03)",
        transform: tier.isFeatured ? "translateY(-12px)" : "none",
      }}
      whileHover={{
        y: tier.isFeatured ? -16 : -4,
        boxShadow: tier.isFeatured
          ? "0 24px 60px rgba(57,30,30,0.15)"
          : "0 12px 35px rgba(57,30,30,0.08)",
      }}
    >
      {/* Featured badge */}
      {tier.isFeatured && (
        <div
          className="text-center py-2.5"
          style={{
            background: "linear-gradient(135deg, #391e1e 0%, #84262c 100%)",
            color: "var(--color-on-primary)",
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "var(--font-label)" }}>
            Most Popular
          </span>
        </div>
      )}

      <div className="flex flex-col flex-1 p-8 lg:p-7 xl:p-9">
        {/* Tier name */}
        <h3
          className="font-headline italic text-base mb-6"
          style={{ color: "var(--color-primary)", opacity: 0.7, fontWeight: 300 }}
        >
          {tier.name}
        </h3>

        {/* Price */}
        <div className="mb-2">
          <span
            className="font-headline text-5xl xl:text-6xl"
            style={{ color: "var(--color-primary)", lineHeight: 1, letterSpacing: "-0.02em" }}
          >
            ${tier.price}
          </span>
          <span
            className="text-xs ml-1.5"
            style={{ color: "var(--color-on-surface-variant)", opacity: 0.45 }}
          >
            /{tier.billingPeriod}
          </span>
        </div>

        {/* Tagline */}
        <p
          className="body-editorial text-sm mb-8"
          style={{ color: "rgba(57,30,30,0.55)" }}
        >
          {tier.tagline}
        </p>

        {/* Divider */}
        <div
          className="h-px w-full mb-6"
          style={{ backgroundColor: "rgba(57,30,30,0.08)" }}
        />

        {/* Benefits */}
        <ul className="space-y-3.5 mb-10 flex-1">
          {tier.benefits.map((benefit, j) => (
            <li key={j} className="flex items-start gap-3">
              <span
                className="mt-2.5 h-1 w-1 rounded-full shrink-0"
                style={{ backgroundColor: "var(--color-blush)", opacity: 0.4 }}
              />
              <span
                className="text-sm leading-relaxed"
                style={{ color: "rgba(57,30,30,0.7)" }}
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
          className="w-full text-center"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem 2.5rem",
            fontFamily: "var(--font-headline)",
            fontStyle: "italic",
            fontSize: "1.125rem",
            letterSpacing: "0.02em",
            cursor: "pointer",
            transition: "all 0.5s cubic-bezier(0.2, 0, 0, 1)",
            ...(tier.isFeatured
              ? {
                  background: "linear-gradient(135deg, #391e1e 0%, #84262c 100%)",
                  color: "var(--color-on-primary)",
                  border: "none",
                }
              : {
                  background: "transparent",
                  color: "var(--color-primary)",
                  border: "1px solid rgba(57,30,30,0.15)",
                }),
          }}
        >
          Get Started
        </a>
      </div>
    </motion.div>
  );
}

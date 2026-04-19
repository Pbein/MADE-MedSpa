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
    <main
      style={{
        ...styleOverrides,
        backgroundColor: "#f0e8e1",
        backgroundImage: "url('/images/membership-atmosphere-bg.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}
    >
      {isPreview && <PreviewBanner />}
      {isSectionVisible("hero") && (
        <PageHeaderCompact
          eyebrow={heroText.eyebrow}
          title={heroText.headline}
          description={heroText.subtitle}
          transparent
        />
      )}

      {/* Membership Tiers */}
      <section
        ref={gridRef}
        className="pt-8 pb-32 md:pb-40"
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
      className="relative flex flex-col transition-all duration-500 group"
      style={{
        border: tier.isFeatured ? "none" : "1px solid rgba(57,30,30,0.06)",
        background: tier.isFeatured
          ? "linear-gradient(180deg, #ffffff 0%, var(--color-powder) 60%, var(--color-glaze) 100%)"
          : "rgba(255,255,255,0.35)",
        boxShadow: tier.isFeatured
          ? "0 24px 48px rgba(57,30,30,0.14)"
          : "0 2px 12px rgba(57,30,30,0.02)",
        transform: tier.isFeatured ? "translateY(-16px)" : "none",
        opacity: tier.isFeatured ? 1 : 0.88,
      }}
      whileHover={{
        y: tier.isFeatured ? -20 : -6,
        opacity: 1,
        boxShadow: tier.isFeatured
          ? "0 28px 60px rgba(57,30,30,0.16)"
          : "0 16px 40px rgba(57,30,30,0.1)",
      }}
    >
      {/* Featured badge */}
      {tier.isFeatured && (
        <div
          className="text-center py-2"
          style={{
            background: "linear-gradient(135deg, #391e1e 0%, #84262c 70%)",
            color: "var(--color-on-primary)",
          }}
        >
          <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--font-label)" }}>
            Most Popular
          </span>
        </div>
      )}

      <div className={`flex flex-col flex-1 ${tier.isFeatured ? "p-7 lg:p-8" : "p-7"}`}>
        {/* Tier name */}
        <h3
          className="font-headline italic text-base mb-5"
          style={{ color: "rgba(57,30,30,0.65)", fontWeight: 300 }}
        >
          {tier.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-2">
          <span
            className="font-headline text-4xl"
            style={{ color: "var(--color-primary)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
          >
            ${tier.price}
          </span>
          <span
            className="text-sm"
            style={{ color: "rgba(57,30,30,0.4)" }}
          >
            /{tier.billingPeriod}
          </span>
        </div>

        {/* Tagline */}
        <p
          className="text-sm mb-6"
          style={{ color: "rgba(57,30,30,0.5)", lineHeight: 1.5 }}
        >
          {tier.tagline}
        </p>

        {/* Divider */}
        <div
          className="h-px w-full mb-5"
          style={{ backgroundColor: "rgba(57,30,30,0.07)" }}
        />

        {/* Benefits */}
        <ul className="space-y-2.5 mb-8 flex-1">
          {tier.benefits.map((benefit, j) => (
            <li key={j} className="flex items-start gap-2.5">
              <span
                className="mt-2 h-1 w-1 rounded-full shrink-0"
                style={{ backgroundColor: "var(--color-blush)", opacity: 0.35 }}
              />
              <span
                className="text-sm leading-relaxed"
                style={{ color: "rgba(57,30,30,0.6)" }}
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
          className="w-full text-center transition-all duration-300"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.875rem 1.5rem",
            fontFamily: "var(--font-headline)",
            fontStyle: "italic",
            fontSize: "1rem",
            letterSpacing: "0.02em",
            cursor: "pointer",
            ...(tier.isFeatured
              ? {
                  background: "linear-gradient(135deg, #391e1e 0%, #84262c 100%)",
                  color: "var(--color-on-primary)",
                  border: "none",
                  boxShadow: "0 8px 20px rgba(57,30,30,0.2)",
                }
              : {
                  background: "transparent",
                  color: "var(--color-primary)",
                  border: "1px solid rgba(57,30,30,0.12)",
                }),
          }}
        >
          Get Started
        </a>
      </div>
    </motion.div>
  );
}

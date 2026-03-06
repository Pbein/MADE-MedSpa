"use client";

import HeroSection from "@/components/sections/HeroSection";
import FeaturedServices from "@/components/sections/FeaturedServices";
import AboutTeaser from "@/components/sections/AboutTeaser";
import TestimonialSection from "@/components/sections/TestimonialSection";
import MembershipTeaser from "@/components/sections/MembershipTeaser";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import CTABanner from "@/components/sections/CTABanner";

export default function Home() {
  return (
    <>
      {/* Hero — full viewport, ivory background */}
      <HeroSection />

      {/* Featured Services — cream background */}
      <FeaturedServices />

      {/* Why MADE / About teaser — ivory background */}
      <AboutTeaser />

      {/* Testimonials — dark chocolate background */}
      <TestimonialSection />

      {/* Membership teaser — ivory background */}
      <MembershipTeaser />

      {/* Featured Products — cream background */}
      <FeaturedProducts />

      {/* Newsletter CTA — dark background */}
      <CTABanner
        headline={
          <>
            Stay{" "}
            <span className="accent-text" style={{ color: "var(--color-stone)" }}>
              in the Loop
            </span>
          </>
        }
        subtitle="Be the first to know about new treatments, exclusive offers, and seasonal specials crafted for the MADE community."
        ctaText="Get in Touch"
        ctaHref="/contact"
        dark
      />
    </>
  );
}

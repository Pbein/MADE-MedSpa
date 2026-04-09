"use client";

import HeroSection from "@/components/sections/HeroSection";
import FeaturedServices from "@/components/sections/FeaturedServices";
import AboutTeaser from "@/components/sections/AboutTeaser";
import EditorialBreak from "@/components/sections/EditorialBreak";
import TestimonialSection from "@/components/sections/TestimonialSection";
import CTABanner from "@/components/sections/CTABanner";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <HeroSection />

      {/* Philosophy — editorial quote break */}
      <EditorialBreak
        variant="silk"
        text={
          <>
            We believe beauty is deeply personal —{" "}
            <span style={{ color: "var(--color-secondary)" }}>
              every treatment
            </span>{" "}
            is a collaboration between science, artistry, and you.
          </>
        }
      />

      {/* Featured Services */}
      <FeaturedServices />

      {/* Why MADE / About teaser */}
      <AboutTeaser />

      {/* Testimonials */}
      <TestimonialSection />

      {/* Final CTA */}
      <CTABanner
        dark
        headline="Begin Your Journey to Refined Radiance."
        ctaText="Book Your Consult"
        ctaHref="/booking"
      />
    </>
  );
}

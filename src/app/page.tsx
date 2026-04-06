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
      {/* Hero — full viewport, video background, left-aligned */}
      <HeroSection />

      {/* Philosophy — editorial quote break */}
      <EditorialBreak
        variant="silk"
        text={
          <>
            We believe beauty is deeply personal —{" "}
            <span style={{ color: "var(--color-blush)" }}>
              every treatment
            </span>{" "}
            is a collaboration between science, artistry, and you.
          </>
        }
      />

      {/* Featured Services — editorial layout (1 large + 2 small) */}
      <FeaturedServices />

      {/* Why MADE / About teaser */}
      <AboutTeaser />

      {/* Testimonials — minimal, centered, large quotes */}
      <TestimonialSection />

      {/* Final CTA */}
      <CTABanner
        headline={
          <>
            Ready to{" "}
            <span style={{ color: "var(--color-blush)" }}>
              Begin
            </span>{" "}
            Your Journey?
          </>
        }
        subtitle="Book a consultation and discover the MADE difference. Your journey to elevated beauty starts here."
        ctaText="Book Consultation"
        ctaHref="/booking"
        dark
      />
    </>
  );
}

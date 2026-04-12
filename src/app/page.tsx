"use client";

import HeroSection from "@/components/sections/HeroSection";
import FeaturedServices from "@/components/sections/FeaturedServices";
import AboutTeaser from "@/components/sections/AboutTeaser";
import TestimonialSection from "@/components/sections/TestimonialSection";
import CTABanner from "@/components/sections/CTABanner";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <HeroSection />

      {/* Featured Services — first thing after the hook */}
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
        secondaryText="Explore Services"
        secondaryHref="/services"
      />
    </>
  );
}

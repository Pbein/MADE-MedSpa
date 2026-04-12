import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedServices from "@/components/sections/FeaturedServices";
import AboutTeaser from "@/components/sections/AboutTeaser";
import TestimonialSection from "@/components/sections/TestimonialSection";
import CTABanner from "@/components/sections/CTABanner";

export default async function Home() {
  const [content, services, testimonials] = await Promise.all([
    fetchQuery(api.siteContent.getByKeys, {
      keys: [
        "hero_video",
        "hero_poster",
        "featured_service_image_1",
        "featured_service_image_2",
        "featured_service_image_3",
        "about_philosophy_image",
        "testimonial_bg",
      ],
    }),
    fetchQuery(api.services.list),
    fetchQuery(api.testimonials.list),
  ]);

  return (
    <>
      <HeroSection
        heroVideoUrl={content.hero_video?.imageUrl}
        heroPosterUrl={content.hero_poster?.imageUrl}
      />

      <FeaturedServices
        services={services}
        featuredImageUrls={[
          content.featured_service_image_1?.imageUrl,
          content.featured_service_image_2?.imageUrl,
          content.featured_service_image_3?.imageUrl,
        ]}
      />

      <AboutTeaser
        aboutImageUrl={content.about_philosophy_image?.imageUrl}
      />

      <TestimonialSection
        testimonials={testimonials}
        testimonialBgUrl={content.testimonial_bg?.imageUrl}
      />

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

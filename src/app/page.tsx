import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedServices from "@/components/sections/FeaturedServices";
import AboutTeaser from "@/components/sections/AboutTeaser";
import TestimonialSection from "@/components/sections/TestimonialSection";
import CTABanner from "@/components/sections/CTABanner";
import {
  buildStyleOverrides,
  isSectionVisible,
  getHeroOverrides,
} from "@/lib/pageSettings";

export default async function Home() {
  const [content, services, testimonials, pageSettings] = await Promise.all([
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
    fetchQuery(api.siteContent.getByKey, { key: "page_settings_home" }),
  ]);

  const meta = pageSettings?.metadata as Record<string, unknown> | undefined;
  const styles = buildStyleOverrides(meta);
  const hero = getHeroOverrides(meta);
  const show = (key: string) => isSectionVisible(meta, key);

  return (
    <div style={styles}>
      {show("hero") && (
        <HeroSection
          heroVideoUrl={content.hero_video?.imageUrl}
          heroPosterUrl={content.hero_poster?.imageUrl}
          headlineOverride={hero.headline}
          subtitleOverride={hero.subtitle}
        />
      )}

      {show("featured") && (
        <FeaturedServices
          services={services}
          featuredImageUrls={[
            content.featured_service_image_1?.imageUrl,
            content.featured_service_image_2?.imageUrl,
            content.featured_service_image_3?.imageUrl,
          ]}
        />
      )}

      {show("about") && (
        <AboutTeaser
          aboutImageUrl={content.about_philosophy_image?.imageUrl}
        />
      )}

      {show("testimonials") && (
        <TestimonialSection
          testimonials={testimonials}
          testimonialBgUrl={content.testimonial_bg?.imageUrl}
        />
      )}

      {show("cta") && (
        <CTABanner
          dark
          headline={hero.ctaText ? undefined : "Begin Your Journey to Refined Radiance."}
          ctaText={hero.ctaText || "Book Your Consult"}
          ctaHref={hero.ctaLink || "/booking"}
          secondaryText="Explore Services"
          secondaryHref="/services"
        />
      )}
    </div>
  );
}

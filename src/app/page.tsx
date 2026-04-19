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
  getSectionContent,
} from "@/lib/pageSettings";

export default async function Home() {
  const [content, services, testimonials, pageSettings, sectionData] =
    await Promise.all([
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
      fetchQuery(api.siteContent.getByKeys, {
        keys: [
          "section_home_hero",
          "section_home_featured",
          "section_home_about",
          "section_home_testimonials",
          "section_home_cta",
        ],
      }),
    ]);

  const meta = pageSettings?.metadata as Record<string, unknown> | undefined;
  const styles = buildStyleOverrides(meta);
  const show = (key: string) => isSectionVisible(meta, key);

  // Section content with defaults
  const heroContent = getSectionContent(sectionData.section_home_hero, {
    eyebrow: "Luxury Aesthetic Studio",
    headline_1: "Beauty,",
    headline_2: "Deeply Personal.",
    headline_3: "Thoughtfully Designed.",
    cta_text: "Book Consultation",
    cta_href: "/booking",
    secondary_text: "Explore Services",
    secondary_href: "/services",
  });

  const featuredContent = getSectionContent(sectionData.section_home_featured, {
    eyebrow: "Our Expertise",
    headline: "Curated Services",
    body: "Each treatment is thoughtfully designed to enhance your natural beauty with precision, artistry, and care.",
    link_text: "View All Services",
  });

  const aboutContent = getSectionContent(sectionData.section_home_about, {
    eyebrow: "Our Philosophy",
    headline: "Where Science Meets Artistry.",
    body: "At MADE, we believe beauty is deeply personal. Our approach combines clinical precision with artistic vision, creating results that enhance your natural features rather than masking them.",
    link_text: "Discover Our Method",
    link_href: "/about",
  });

  const testimonialsContent = getSectionContent(
    sectionData.section_home_testimonials,
    { eyebrow: "What Our Clients Say" }
  );

  const ctaContent = getSectionContent(sectionData.section_home_cta, {
    headline: "Begin Your Journey to Refined Radiance.",
    cta_text: "Book Your Consult",
    cta_href: "/booking",
    secondary_text: "Explore Services",
    secondary_href: "/services",
  });

  return (
    <div style={styles}>
      {show("hero") && (
        <HeroSection
          heroVideoUrl={content.hero_video?.imageUrl}
          heroPosterUrl={content.hero_poster?.imageUrl}
          sectionContent={heroContent}
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
          sectionContent={featuredContent}
        />
      )}

      {show("about") && (
        <AboutTeaser
          aboutImageUrl={content.about_philosophy_image?.imageUrl}
          sectionContent={aboutContent}
        />
      )}

      {show("testimonials") && (
        <TestimonialSection
          testimonials={testimonials}
          testimonialBgUrl={content.testimonial_bg?.imageUrl}
          sectionContent={testimonialsContent}
        />
      )}

      {show("cta") && (
        <CTABanner
          dark
          headline={ctaContent.headline}
          ctaText={ctaContent.cta_text}
          ctaHref={ctaContent.cta_href}
          secondaryText={ctaContent.secondary_text}
          secondaryHref={ctaContent.secondary_href}
        />
      )}
    </div>
  );
}

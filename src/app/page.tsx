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
  getSectionDesignServer,
} from "@/lib/pageSettings";
import { getPageMetadata } from "@/lib/siteSettings";

export async function generateMetadata() {
  return getPageMetadata({
    pageKey: "home",
    path: "/",
    defaultTitle: "MADE Med Spa McLean, VA | Luxury Aesthetic Treatments",
    defaultDescription:
      "Luxury aesthetic med spa in McLean, Virginia. MADE Med Spa offers Botox, dermal fillers, Sculptra, PRF, and advanced skin treatments with unhurried consultations and natural results.",
  });
}

export default async function Home() {
  const [content, services, testimonials, pageSettings, sectionData] =
    await Promise.all([
      fetchQuery(api.siteContent.getByKeys, {
        keys: [
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
  // Pass pageKey ("home") so the registry can supply per-section defaults
  // (e.g. hero defaults to espresso bg + cream text on the home page).
  const design = (key: string) => getSectionDesignServer(meta, key, "home");

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
        // design("hero") already merges section defaults from the registry
        // with any admin overrides — single source of truth.
        <div id="section-hero" style={design("hero")}>
          <HeroSection sectionContent={heroContent} />
        </div>
      )}

      {show("featured") && (
        <div id="section-featured" style={design("featured")}>
          <FeaturedServices
            services={services}
            featuredImageUrls={[
              content.featured_service_image_1?.imageUrl,
              content.featured_service_image_2?.imageUrl,
              content.featured_service_image_3?.imageUrl,
            ]}
            sectionContent={featuredContent}
          />
        </div>
      )}

      {show("about") && (
        <div id="section-about" style={design("about")}>
          <AboutTeaser
            aboutImageUrl={content.about_philosophy_image?.imageUrl}
            sectionContent={aboutContent}
          />
        </div>
      )}

      {show("testimonials") && (
        <div id="section-testimonials" style={design("testimonials")}>
          <TestimonialSection
            testimonials={testimonials}
            testimonialBgUrl={content.testimonial_bg?.imageUrl}
            sectionContent={testimonialsContent}
          />
        </div>
      )}

      {show("cta") && (
        <div id="section-cta" style={design("cta")}>
          <CTABanner
            dark
            headline={ctaContent.headline}
            ctaText={ctaContent.cta_text}
            ctaHref={ctaContent.cta_href}
            secondaryText={ctaContent.secondary_text}
            secondaryHref={ctaContent.secondary_href}
          />
        </div>
      )}
    </div>
  );
}

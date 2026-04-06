// Demo image paths — maps service slugs and page placements to optimized images.
// These will be replaced with client photos after their photoshoot.

const serviceImageMap: Record<string, { card: string; hero: string }> = {
  "botox-cosmetic": {
    card: "/images/optimized/services/botox-card-md.webp",
    hero: "/images/optimized/services/botox-hero-lg.webp",
  },
  "dermal-fillers": {
    card: "/images/optimized/services/fillers-card-md.webp",
    hero: "/images/optimized/services/fillers-hero-lg.webp",
  },
  "lip-enhancement": {
    card: "/images/optimized/services/fillers-card-md.webp",
    hero: "/images/optimized/services/fillers-hero-lg.webp",
  },
  "hydrafacial-signature": {
    card: "/images/optimized/services/facials-card-md.webp",
    hero: "/images/optimized/services/facials-hero-lg.webp",
  },
  "chemical-peel": {
    card: "/images/optimized/services/chemical-peels-card-md.webp",
    hero: "/images/optimized/services/chemical-peels-hero-lg.webp",
  },
  "microneedling-prp": {
    card: "/images/optimized/services/microneedling-card-md.webp",
    hero: "/images/optimized/services/microneedling-hero-lg.webp",
  },
  "coolsculpting-elite": {
    card: "/images/optimized/services/body-contouring-card-md.webp",
    hero: "/images/optimized/services/body-contouring-hero-lg.webp",
  },
  "laser-hair-removal": {
    card: "/images/optimized/services/laser-card-md.webp",
    hero: "/images/optimized/services/laser-hero-lg.webp",
  },
  "iv-vitamin-therapy": {
    card: "/images/optimized/services/iv-therapy-card-md.webp",
    hero: "/images/optimized/services/iv-therapy-hero-lg.webp",
  },
  "hormone-optimization": {
    card: "/images/optimized/services/wellness-consultation-card-md.webp",
    hero: "/images/optimized/services/wellness-consultation-hero-lg.webp",
  },
};

// Fallback: try to match by keyword in slug
const keywordMap: Record<string, string> = {
  botox: "botox",
  filler: "fillers",
  lip: "fillers",
  facial: "facials",
  hydra: "facials",
  peel: "chemical-peels",
  needle: "microneedling",
  prp: "microneedling",
  laser: "laser",
  sculpt: "body-contouring",
  contour: "body-contouring",
  cool: "body-contouring",
  iv: "iv-therapy",
  vitamin: "iv-therapy",
  drip: "iv-therapy",
  hormone: "wellness-consultation",
  wellness: "wellness-consultation",
  consult: "wellness-consultation",
  skin: "skin-rejuvenation",
  rejuv: "skin-rejuvenation",
  glow: "skin-rejuvenation",
};

export function getServiceImage(slug: string, type: "card" | "hero" = "card"): string {
  // Direct match
  const direct = serviceImageMap[slug];
  if (direct) return direct[type];

  // Keyword fallback
  for (const [keyword, imageKey] of Object.entries(keywordMap)) {
    if (slug.includes(keyword)) {
      const baseName = imageKey;
      return type === "card"
        ? `/images/optimized/services/${baseName}-card-md.webp`
        : `/images/optimized/services/${baseName}-hero-lg.webp`;
    }
  }

  // Ultimate fallback
  return type === "card"
    ? "/images/optimized/services/facials-card-md.webp"
    : "/images/optimized/services/facials-hero-lg.webp";
}

export const demoImages = {
  hero: {
    video: "/images/optimized/hero/hero-bg-video.mp4",
    videoWebm: "/images/optimized/hero/hero-bg-video.webm",
    poster: "/images/optimized/hero/hero-poster.jpg",
  },
  home: {
    aboutTeaser: "/images/optimized/home/about-teaser-lg.webp",
    testimonialBg: "/images/optimized/home/testimonial-bg-lg.webp",
  },
  about: {
    clinicInterior: "/images/optimized/about/clinic-interior-lg.webp",
    team: [
      "/images/optimized/about/team-member-1-md.webp",
      "/images/optimized/about/team-member-2-md.webp",
      "/images/optimized/about/team-member-3-md.webp",
      "/images/optimized/about/team-member-4-md.webp",
    ],
  },
  contact: {
    reception: "/images/optimized/contact/reception-md.webp",
  },
  faq: {
    header: "/images/optimized/faq/header-lg.webp",
  },
};

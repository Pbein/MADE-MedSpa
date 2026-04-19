// ── Section Definitions Registry ─────────────────────────────────────────────
// Central registry mapping every public page to its sections, and each section
// to its editable text, media, colors, and CRUD data sources.
//
// This file is the single source of truth for:
//   - The admin page editor UI (what fields to show)
//   - The public page components (what content keys to read)
//   - The preview system (what can be overridden)
//
// To add a new page: add a PageDefinition here, create the admin route,
// create the public page, and add to the sidebar nav. See the admin guide.

// ── Types ────────────────────────────────────────────────────────────────────

export type FieldType = "text" | "textarea" | "url" | "richlist";

export interface FieldDefinition {
  /** Key within the section's metadata JSON */
  fieldKey: string;
  /** Display label in admin */
  label: string;
  /** Input type */
  type: FieldType;
  /** Hardcoded default shown when DB value is empty */
  defaultValue: string | string[] | Record<string, string>[];
  /** Optional placeholder */
  placeholder?: string;
}

export interface MediaFieldDefinition {
  /** Existing siteContent key for this media slot */
  mediaKey: string;
  /** Display label */
  label: string;
  /** "image" or "video" */
  type: "image" | "video";
  /** Aspect ratio hint */
  aspect?: string;
  /** Default URL */
  defaultUrl: string;
  /** Help text */
  description?: string;
}

export interface CrudReference {
  /** Which admin page manages this data */
  manageHref: string;
  /** Button label */
  manageLabel: string;
  /** Description of what this section shows */
  description: string;
}

export interface SectionDefinition {
  /** Unique key — matches visibility key in page_settings */
  key: string;
  /** Display name in admin */
  label: string;
  /** Description of what this section does / where it appears */
  description: string;
  /** siteContent key for this section's editable content */
  contentKey: string;
  /** Editable text/content fields */
  fields: FieldDefinition[];
  /** Media slots owned by this section */
  media: MediaFieldDefinition[];
  /** Whether this section supports per-section color overrides */
  hasColorOverride: boolean;
  /** CRUD table reference if this section shows dynamic data */
  crud?: CrudReference;
  /** Legacy siteContent keys this section also reads from */
  legacyKeys?: string[];
  /** Whether visible by default */
  defaultVisible: boolean;
}

export interface PageDefinition {
  /** Page key */
  key: string;
  /** Display name */
  label: string;
  /** Public URL path */
  path: string;
  /** Brief description for the admin */
  description: string;
  /** Ordered list of sections top to bottom */
  sections: SectionDefinition[];
}

// ── Page Definitions ─────────────────────────────────────────────────────────

export const PAGE_DEFINITIONS: PageDefinition[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // HOMEPAGE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    key: "home",
    label: "Homepage",
    path: "/",
    description: "The main landing page visitors see first. Features a hero video, featured services, about teaser, testimonials, and a call-to-action.",
    sections: [
      {
        key: "hero",
        label: "Hero Section",
        description: "Full-screen video/image background with headline and call-to-action buttons. The first thing visitors see.",
        contentKey: "section_home_hero",
        fields: [
          { fieldKey: "eyebrow", label: "Eyebrow Text", type: "text", defaultValue: "Luxury Aesthetic Studio" },
          { fieldKey: "headline_1", label: "Headline Line 1", type: "text", defaultValue: "Beauty," },
          { fieldKey: "headline_2", label: "Headline Line 2", type: "text", defaultValue: "Deeply Personal." },
          { fieldKey: "headline_3", label: "Headline Line 3", type: "text", defaultValue: "Thoughtfully Designed." },
          { fieldKey: "cta_text", label: "Primary Button Text", type: "text", defaultValue: "Book Consultation" },
          { fieldKey: "cta_href", label: "Primary Button Link", type: "url", defaultValue: "/booking" },
          { fieldKey: "secondary_text", label: "Secondary Link Text", type: "text", defaultValue: "Explore Services" },
          { fieldKey: "secondary_href", label: "Secondary Link URL", type: "url", defaultValue: "/services" },
        ],
        media: [
          { mediaKey: "hero_video", label: "Background Video", type: "video", aspect: "16/9", defaultUrl: "/videos/hero.mp4", description: "Looping background video. MP4, ideally under 5 MB." },
          { mediaKey: "hero_poster", label: "Poster Image", type: "image", aspect: "16/9", defaultUrl: "/images/hero-poster.webp", description: "Still image shown while video loads." },
        ],
        hasColorOverride: true,
        defaultVisible: true,
      },
      {
        key: "featured",
        label: "Featured Services",
        description: "Showcases the first 3 services with editorial images. Draws visitors deeper into the site.",
        contentKey: "section_home_featured",
        fields: [
          { fieldKey: "eyebrow", label: "Section Label", type: "text", defaultValue: "Our Expertise" },
          { fieldKey: "headline", label: "Headline", type: "text", defaultValue: "Curated Services" },
          { fieldKey: "body", label: "Description", type: "textarea", defaultValue: "Each treatment is thoughtfully designed to enhance your natural beauty with precision, artistry, and care." },
          { fieldKey: "link_text", label: "View All Link Text", type: "text", defaultValue: "View All Services" },
        ],
        media: [
          { mediaKey: "featured_service_image_1", label: "Service Image 1", type: "image", aspect: "4/5", defaultUrl: "https://placehold.co/600x750/3c2415/f5f0e8?text=Service+1" },
          { mediaKey: "featured_service_image_2", label: "Service Image 2", type: "image", aspect: "4/5", defaultUrl: "https://placehold.co/600x750/5c3a1e/f5f0e8?text=Service+2" },
          { mediaKey: "featured_service_image_3", label: "Service Image 3", type: "image", aspect: "4/5", defaultUrl: "https://placehold.co/600x750/4a2c17/f5f0e8?text=Service+3" },
        ],
        hasColorOverride: true,
        crud: { manageHref: "/admin/services", manageLabel: "Manage Services", description: "Shows the first 3 active services." },
        defaultVisible: true,
      },
      {
        key: "about",
        label: "About Teaser",
        description: "Split layout with a portrait image and philosophy text. Links to the full About page.",
        contentKey: "section_home_about",
        fields: [
          { fieldKey: "eyebrow", label: "Section Label", type: "text", defaultValue: "Our Philosophy" },
          { fieldKey: "headline", label: "Headline", type: "text", defaultValue: "Where Science Meets Artistry." },
          { fieldKey: "body", label: "Body Text", type: "textarea", defaultValue: "At MADE, we believe beauty is deeply personal. Our approach combines clinical precision with artistic vision, creating results that enhance your natural features rather than masking them." },
          { fieldKey: "link_text", label: "Link Text", type: "text", defaultValue: "Discover Our Method" },
          { fieldKey: "link_href", label: "Link URL", type: "url", defaultValue: "/about" },
        ],
        media: [
          { mediaKey: "about_philosophy_image", label: "Philosophy Image", type: "image", aspect: "4/5", defaultUrl: "https://placehold.co/800x1000/4a2c17/f5f0e8?text=Our+Philosophy" },
        ],
        hasColorOverride: false,
        defaultVisible: true,
      },
      {
        key: "testimonials",
        label: "Testimonials",
        description: "Auto-rotating carousel of client testimonials with a background texture.",
        contentKey: "section_home_testimonials",
        fields: [
          { fieldKey: "eyebrow", label: "Section Label", type: "text", defaultValue: "What Our Clients Say" },
        ],
        media: [
          { mediaKey: "testimonial_bg", label: "Background Texture", type: "image", aspect: "21/9", defaultUrl: "https://placehold.co/2100x900/f5f0e8/e0d0be?text=Testimonial+BG" },
        ],
        hasColorOverride: true,
        crud: { manageHref: "/admin/testimonials", manageLabel: "Manage Testimonials", description: "Shows all active testimonials in a carousel." },
        defaultVisible: true,
      },
      {
        key: "cta",
        label: "CTA Banner",
        description: "Dark call-to-action banner at the bottom of the page. Drives visitors to book.",
        contentKey: "section_home_cta",
        fields: [
          { fieldKey: "headline", label: "Headline", type: "text", defaultValue: "Begin Your Journey to Refined Radiance." },
          { fieldKey: "cta_text", label: "Button Text", type: "text", defaultValue: "Book Your Consult" },
          { fieldKey: "cta_href", label: "Button Link", type: "url", defaultValue: "/booking" },
          { fieldKey: "secondary_text", label: "Secondary Link Text", type: "text", defaultValue: "Explore Services" },
          { fieldKey: "secondary_href", label: "Secondary Link URL", type: "url", defaultValue: "/services" },
        ],
        media: [],
        hasColorOverride: true,
        defaultVisible: true,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ABOUT PAGE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    key: "about",
    label: "About",
    path: "/about",
    description: "The story of MADE Med Spa — mission, values, team. Builds trust and shows expertise.",
    sections: [
      {
        key: "hero",
        label: "Hero",
        description: "Page hero with background image and headline.",
        contentKey: "section_about_hero",
        fields: [
          { fieldKey: "eyebrow", label: "Eyebrow", type: "text", defaultValue: "About MADE" },
          { fieldKey: "headline", label: "Headline", type: "text", defaultValue: "The Story of MADE" },
          { fieldKey: "subtitle", label: "Subtitle", type: "textarea", defaultValue: "A luxury aesthetic studio built on the belief that beauty is personal, science is essential, and every detail matters." },
        ],
        media: [
          { mediaKey: "about_hero_bg", label: "Hero Background", type: "image", aspect: "21/9", defaultUrl: "https://placehold.co/2100x900/4a2c17/f5f0e8?text=About+Hero" },
        ],
        hasColorOverride: false,
        defaultVisible: true,
      },
      {
        key: "story",
        label: "Our Story",
        description: "Asymmetric editorial layout with the founding story and a portrait image.",
        contentKey: "section_about_story",
        fields: [
          { fieldKey: "eyebrow", label: "Section Label", type: "text", defaultValue: "Our Beginning" },
        ],
        media: [
          { mediaKey: "about_story_image", label: "Story Image", type: "image", aspect: "4/5", defaultUrl: "https://placehold.co/800x1000/4a2c17/f5f0e8?text=Our+Story" },
        ],
        hasColorOverride: true,
        legacyKeys: ["about_story"],
        defaultVisible: true,
      },
      {
        key: "editorial",
        label: "Editorial Break",
        description: "Dark decorative section with the 'Refinement over Transformation' headline.",
        contentKey: "section_about_editorial",
        fields: [
          { fieldKey: "text", label: "Headline Text", type: "text", defaultValue: "Refinement over Transformation." },
        ],
        media: [],
        hasColorOverride: true,
        defaultVisible: true,
      },
      {
        key: "mission",
        label: "Mission",
        description: "The MADE mission statement.",
        contentKey: "section_about_mission",
        fields: [
          { fieldKey: "eyebrow", label: "Section Label", type: "text", defaultValue: "Our Mission" },
        ],
        media: [],
        hasColorOverride: true,
        legacyKeys: ["about_mission"],
        defaultVisible: true,
      },
      {
        key: "values",
        label: "Values",
        description: "Three core values (Artistry, Integrity, Excellence) with numbered cards and a background image.",
        contentKey: "section_about_values",
        fields: [
          { fieldKey: "eyebrow", label: "Section Label", type: "text", defaultValue: "What Guides Us" },
          { fieldKey: "headline", label: "Headline", type: "text", defaultValue: "Our Values" },
          {
            fieldKey: "values",
            label: "Values List",
            type: "richlist",
            defaultValue: [
              { number: "01", title: "Artistry", description: "We approach every treatment as a work of art, celebrating the unique canvas of each individual." },
              { number: "02", title: "Integrity", description: "Honest consultations, transparent pricing, and treatments recommended solely for your benefit." },
              { number: "03", title: "Excellence", description: "Relentless pursuit of the highest standards in technique, technology, and patient care." },
            ],
          },
        ],
        media: [],
        hasColorOverride: true,
        legacyKeys: ["about_values"],
        defaultVisible: true,
      },
      {
        key: "team",
        label: "Team Members",
        description: "Shows team member cards. Managed via Team in the sidebar.",
        contentKey: "section_about_team",
        fields: [
          { fieldKey: "eyebrow", label: "Section Label", type: "text", defaultValue: "The Team" },
          { fieldKey: "headline", label: "Headline", type: "text", defaultValue: "Meet the Experts" },
        ],
        media: [],
        hasColorOverride: true,
        crud: { manageHref: "/admin/team", manageLabel: "Manage Team", description: "Shows all active team members." },
        defaultVisible: true,
      },
      {
        key: "cta",
        label: "CTA Banner",
        description: "Call-to-action at the bottom of the About page.",
        contentKey: "section_about_cta",
        fields: [
          { fieldKey: "headline", label: "Headline", type: "text", defaultValue: "Ready to experience the MADE difference?" },
          { fieldKey: "subtitle", label: "Subtitle", type: "textarea", defaultValue: "Your journey to elevated beauty begins with a single conversation. Let us craft a personalized plan just for you." },
          { fieldKey: "cta_text", label: "Button Text", type: "text", defaultValue: "Book Consultation" },
          { fieldKey: "cta_href", label: "Button Link", type: "url", defaultValue: "/booking" },
          { fieldKey: "secondary_text", label: "Secondary Link", type: "text", defaultValue: "Explore Services" },
          { fieldKey: "secondary_href", label: "Secondary URL", type: "url", defaultValue: "/services" },
        ],
        media: [],
        hasColorOverride: true,
        defaultVisible: true,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SERVICES PAGE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    key: "services",
    label: "Services",
    path: "/services",
    description: "Displays all services with category filtering and search. Services are managed via the Services CRUD page.",
    sections: [
      {
        key: "hero",
        label: "Hero",
        description: "Page hero with headline and background image.",
        contentKey: "section_services_hero",
        fields: [
          { fieldKey: "eyebrow", label: "Eyebrow", type: "text", defaultValue: "Treatments" },
          { fieldKey: "headline", label: "Headline", type: "text", defaultValue: "Our Services. The Art of Self-Care." },
          { fieldKey: "subtitle", label: "Subtitle", type: "textarea", defaultValue: "Personalized treatments designed to enhance your natural beauty with precision, science, and artistry." },
        ],
        media: [
          { mediaKey: "services_hero_bg", label: "Hero Background", type: "image", aspect: "21/9", defaultUrl: "https://placehold.co/2100x900/4a2c17/f5f0e8?text=Services+Hero" },
        ],
        hasColorOverride: false,
        defaultVisible: true,
      },
      {
        key: "grid",
        label: "Services Grid",
        description: "Filterable grid of service cards. Services managed separately. You can also import services from Pabau via the Pabau Sync page.",
        contentKey: "section_services_grid",
        fields: [],
        media: [],
        hasColorOverride: true,
        crud: { manageHref: "/admin/services", manageLabel: "Manage Services", description: "Shows all active services. Import from Pabau via Leads > Pabau Sync." },
        defaultVisible: true,
      },
      {
        key: "cta",
        label: "CTA Banner",
        description: "Call-to-action at the bottom of the Services page.",
        contentKey: "section_services_cta",
        fields: [
          { fieldKey: "headline", label: "Headline", type: "text", defaultValue: "The path to effortless maintenance begins with a conversation." },
          { fieldKey: "subtitle", label: "Subtitle", type: "textarea", defaultValue: "Book a consultation and let us craft a personalized treatment plan just for you." },
          { fieldKey: "cta_text", label: "Button Text", type: "text", defaultValue: "Book Consultation" },
          { fieldKey: "cta_href", label: "Button Link", type: "url", defaultValue: "/booking" },
        ],
        media: [],
        hasColorOverride: true,
        defaultVisible: true,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MEMBERSHIP PAGE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    key: "membership",
    label: "Membership",
    path: "/membership",
    description: "Displays membership tiers with pricing, benefits, and sign-up links. Tiers managed via Memberships CRUD.",
    sections: [
      {
        key: "hero",
        label: "Hero",
        description: "Page hero with membership tagline.",
        contentKey: "section_membership_hero",
        fields: [
          { fieldKey: "eyebrow", label: "Eyebrow", type: "text", defaultValue: "Membership" },
          { fieldKey: "headline", label: "Headline", type: "text", defaultValue: "Invest in You. Consistently." },
          { fieldKey: "subtitle", label: "Subtitle", type: "textarea", defaultValue: "Exclusive tiers designed for every stage of your aesthetic journey. Real savings, real care, real results." },
        ],
        media: [],
        hasColorOverride: false,
        defaultVisible: true,
      },
      {
        key: "tiers",
        label: "Membership Tiers",
        description: "Grid of membership tier cards. Tiers managed separately.",
        contentKey: "section_membership_tiers",
        fields: [],
        media: [],
        hasColorOverride: true,
        crud: { manageHref: "/admin/memberships", manageLabel: "Manage Memberships", description: "Shows all active membership tiers." },
        defaultVisible: true,
      },
      {
        key: "cta",
        label: "CTA Banner",
        description: "Call-to-action at the bottom.",
        contentKey: "section_membership_cta",
        fields: [
          { fieldKey: "headline", label: "Headline", type: "text", defaultValue: "Ready to become a member?" },
          { fieldKey: "subtitle", label: "Subtitle", type: "textarea", defaultValue: "Choose the tier that fits your goals and start saving on the treatments you love." },
          { fieldKey: "cta_text", label: "Button Text", type: "text", defaultValue: "Book Consultation" },
          { fieldKey: "cta_href", label: "Button Link", type: "url", defaultValue: "/booking" },
          { fieldKey: "secondary_text", label: "Secondary Link", type: "text", defaultValue: "Contact Us" },
          { fieldKey: "secondary_href", label: "Secondary URL", type: "url", defaultValue: "/contact" },
        ],
        media: [],
        hasColorOverride: true,
        defaultVisible: true,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SHOP PAGE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    key: "shop",
    label: "Shop",
    path: "/shop",
    description: "Medical-grade skincare products curated by Nurse Karlyne. Products managed via Shop CRUD.",
    sections: [
      {
        key: "hero",
        label: "Hero",
        description: "Page hero with shop tagline.",
        contentKey: "section_shop_hero",
        fields: [
          { fieldKey: "eyebrow", label: "Eyebrow", type: "text", defaultValue: "Shop" },
          { fieldKey: "headline", label: "Headline", type: "text", defaultValue: "Curated for You. Intentionally." },
          { fieldKey: "subtitle", label: "Subtitle", type: "textarea", defaultValue: "Medical-grade skincare and wellness products selected by Nurse Karlyne for real results at home." },
        ],
        media: [],
        hasColorOverride: false,
        defaultVisible: true,
      },
      {
        key: "grid",
        label: "Products Grid",
        description: "Filterable grid of products. Products managed separately.",
        contentKey: "section_shop_grid",
        fields: [],
        media: [],
        hasColorOverride: true,
        crud: { manageHref: "/admin/shop", manageLabel: "Manage Products", description: "Shows all active products with category filters." },
        defaultVisible: true,
      },
      {
        key: "cta",
        label: "CTA Banner",
        description: "Call-to-action at the bottom.",
        contentKey: "section_shop_cta",
        fields: [
          { fieldKey: "headline", label: "Headline", type: "text", defaultValue: "Questions about our products?" },
          { fieldKey: "subtitle", label: "Subtitle", type: "textarea", defaultValue: "Nurse Karlyne personally selects every product in our collection. Book a consultation to find what's right for your skin." },
          { fieldKey: "cta_text", label: "Button Text", type: "text", defaultValue: "Book Consultation" },
          { fieldKey: "cta_href", label: "Button Link", type: "url", defaultValue: "/booking" },
          { fieldKey: "secondary_text", label: "Secondary Link", type: "text", defaultValue: "Contact Us" },
          { fieldKey: "secondary_href", label: "Secondary URL", type: "url", defaultValue: "/contact" },
        ],
        media: [],
        hasColorOverride: true,
        defaultVisible: true,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTACT PAGE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    key: "contact",
    label: "Contact",
    path: "/contact",
    description: "Contact form and business info. Business details managed via Site Settings.",
    sections: [
      {
        key: "hero",
        label: "Hero",
        description: "Dark hero section with headline and intro text.",
        contentKey: "section_contact_hero",
        fields: [
          { fieldKey: "eyebrow", label: "Eyebrow", type: "text", defaultValue: "Contact" },
          { fieldKey: "headline", label: "Headline", type: "text", defaultValue: "Let's talk." },
        ],
        media: [
          { mediaKey: "contact_hero_bg", label: "Hero Background", type: "image", aspect: "21/9", defaultUrl: "/images/contact-hero-bg.webp", description: "Dark textured background behind the contact hero." },
        ],
        hasColorOverride: true,
        legacyKeys: ["contact_hero"],
        defaultVisible: true,
      },
      {
        key: "form",
        label: "Contact Form",
        description: "The contact form and business info side by side.",
        contentKey: "section_contact_body",
        fields: [
          { fieldKey: "info_eyebrow", label: "Info Section Label", type: "text", defaultValue: "Reach Out" },
          { fieldKey: "info_headline", label: "Info Headline", type: "text", defaultValue: "Direct to the studio" },
          { fieldKey: "form_eyebrow", label: "Form Section Label", type: "text", defaultValue: "Send a Message" },
          { fieldKey: "form_headline", label: "Form Headline", type: "text", defaultValue: "Tell us a little about you" },
          { fieldKey: "form_subtitle", label: "Form Subtitle", type: "text", defaultValue: "We respond within 24 hours, always." },
        ],
        media: [],
        hasColorOverride: true,
        defaultVisible: true,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FAQ PAGE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    key: "faq",
    label: "FAQ",
    path: "/faq",
    description: "Frequently asked questions with category filtering and search. FAQs managed via FAQs CRUD.",
    sections: [
      {
        key: "hero",
        label: "Hero",
        description: "Dark hero with search input.",
        contentKey: "section_faq_hero",
        fields: [
          { fieldKey: "eyebrow", label: "Eyebrow", type: "text", defaultValue: "Support" },
          { fieldKey: "headline", label: "Headline", type: "text", defaultValue: "Frequently Asked Questions" },
          { fieldKey: "subtitle", label: "Subtitle", type: "textarea", defaultValue: "Find answers to common questions about our treatments, membership programs, and booking process." },
        ],
        media: [],
        hasColorOverride: false,
        defaultVisible: true,
      },
      {
        key: "accordion",
        label: "FAQ Accordion",
        description: "Expandable Q&A grouped by category. FAQs managed separately.",
        contentKey: "section_faq_accordion",
        fields: [],
        media: [],
        hasColorOverride: true,
        crud: { manageHref: "/admin/faqs", manageLabel: "Manage FAQs", description: "Shows all active FAQs grouped by category." },
        defaultVisible: true,
      },
      {
        key: "cta",
        label: "CTA Banner",
        description: "Call-to-action at the bottom.",
        contentKey: "section_faq_cta",
        fields: [
          { fieldKey: "headline", label: "Headline", type: "text", defaultValue: "Still Have Questions?" },
          { fieldKey: "subtitle", label: "Subtitle", type: "textarea", defaultValue: "Our team is here to help. Reach out and we will get back to you promptly." },
          { fieldKey: "cta_text", label: "Button Text", type: "text", defaultValue: "Contact Us" },
          { fieldKey: "cta_href", label: "Button Link", type: "url", defaultValue: "/contact" },
          { fieldKey: "secondary_text", label: "Secondary Link", type: "text", defaultValue: "Browse Services" },
          { fieldKey: "secondary_href", label: "Secondary URL", type: "url", defaultValue: "/services" },
        ],
        media: [],
        hasColorOverride: true,
        defaultVisible: true,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BOOKING PAGE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    key: "booking",
    label: "Booking",
    path: "/booking",
    description: "Booking page with preparation tips, what to expect, and cancellation policy.",
    sections: [
      {
        key: "hero",
        label: "Hero",
        description: "Video background hero with booking CTA.",
        contentKey: "section_booking_hero",
        fields: [
          { fieldKey: "eyebrow", label: "Eyebrow", type: "text", defaultValue: "Book Online" },
          { fieldKey: "headline", label: "Headline", type: "text", defaultValue: "Schedule Your Visit" },
          { fieldKey: "body", label: "Body Text", type: "textarea", defaultValue: "Your journey to elevated beauty is just a click away. Book your appointment and we will take care of the rest." },
          { fieldKey: "cta_text", label: "Button Text", type: "text", defaultValue: "Book Your Appointment" },
        ],
        media: [],
        hasColorOverride: true,
        defaultVisible: true,
      },
      {
        key: "expect",
        label: "What to Expect",
        description: "Three numbered steps explaining the visit process.",
        contentKey: "section_booking_expect",
        fields: [
          { fieldKey: "eyebrow", label: "Section Label", type: "text", defaultValue: "Your Visit" },
          { fieldKey: "headline", label: "Headline", type: "text", defaultValue: "What to Expect" },
          {
            fieldKey: "steps",
            label: "Steps",
            type: "richlist",
            defaultValue: [
              { number: "01", title: "Consultation", description: "Every visit begins with a personalized consultation to understand your goals, assess your needs, and craft a tailored treatment plan." },
              { number: "02", title: "Treatment", description: "Our expert team performs your chosen service with meticulous care, using only premium products and the latest techniques." },
              { number: "03", title: "Aftercare", description: "You will receive detailed aftercare instructions and ongoing support to ensure beautiful, lasting results." },
            ],
          },
        ],
        media: [],
        hasColorOverride: true,
        defaultVisible: true,
      },
      {
        key: "prep",
        label: "Preparation Tips",
        description: "Numbered list of preparation tips before a visit.",
        contentKey: "section_booking_prep",
        fields: [
          { fieldKey: "eyebrow", label: "Section Label", type: "text", defaultValue: "Before Your Visit" },
          { fieldKey: "headline", label: "Headline", type: "text", defaultValue: "Preparation Tips" },
          {
            fieldKey: "tips",
            label: "Tips",
            type: "richlist",
            defaultValue: [
              "Arrive 10-15 minutes early to complete any necessary paperwork and settle in.",
              "Avoid blood-thinning medications and supplements (aspirin, fish oil, vitamin E) for 48 hours prior to injectable treatments.",
              "Come with a clean face, free of makeup, for facial treatments.",
              "Stay hydrated and avoid excessive sun exposure before your appointment.",
              "Inform us of any allergies, medications, or medical conditions during booking.",
            ],
          },
        ],
        media: [],
        hasColorOverride: true,
        defaultVisible: true,
      },
      {
        key: "policy",
        label: "Cancellation Policy",
        description: "Cancellation rules and deposit information.",
        contentKey: "section_booking_policy",
        fields: [
          { fieldKey: "eyebrow", label: "Section Label", type: "text", defaultValue: "Good to Know" },
          { fieldKey: "headline", label: "Headline", type: "text", defaultValue: "Cancellation Policy" },
          {
            fieldKey: "items",
            label: "Policy Items",
            type: "richlist",
            defaultValue: [
              "We kindly ask for at least 48 hours notice for any cancellations or rescheduling.",
              "Late cancellations (under 48 hours) will forfeit the deposit.",
              "No-shows will be charged a no-show fee of $100.",
              "We understand life happens. Please contact us as soon as possible if your plans change.",
            ],
          },
        ],
        media: [],
        hasColorOverride: true,
        defaultVisible: true,
      },
      {
        key: "cta",
        label: "CTA Banner",
        description: "Call-to-action at the bottom.",
        contentKey: "section_booking_cta",
        fields: [
          { fieldKey: "headline", label: "Headline", type: "text", defaultValue: "Have questions before booking?" },
          { fieldKey: "subtitle", label: "Subtitle", type: "textarea", defaultValue: "Our team is here to help you choose the perfect treatment and answer any questions you may have." },
          { fieldKey: "cta_text", label: "Button Text", type: "text", defaultValue: "Contact Us" },
          { fieldKey: "cta_href", label: "Button Link", type: "url", defaultValue: "/contact" },
          { fieldKey: "secondary_text", label: "Secondary Link", type: "text", defaultValue: "Browse Services" },
          { fieldKey: "secondary_href", label: "Secondary URL", type: "url", defaultValue: "/services" },
        ],
        media: [],
        hasColorOverride: true,
        defaultVisible: true,
      },
    ],
  },
];

// ── Footer (Global Section) ──────────────────────────────────────────────────

export const FOOTER_DEFINITION: PageDefinition = {
  key: "footer",
  label: "Footer",
  path: "(global)",
  description: "The site footer appears on every page. Includes business info, navigation links, hours, social links, and newsletter signup.",
  sections: [
    {
      key: "footer",
      label: "Footer Content",
      description: "Brand tagline, navigation labels, and newsletter text. Business info (address, hours, socials) is managed in Site Settings.",
      contentKey: "section_global_footer",
      fields: [
        { fieldKey: "tagline", label: "Tagline", type: "text", defaultValue: "Thoughtful aesthetic care. Natural results, on purpose." },
        { fieldKey: "nav_label", label: "Navigation Label", type: "text", defaultValue: "Navigate" },
        { fieldKey: "contact_label", label: "Contact Label", type: "text", defaultValue: "Contact" },
        { fieldKey: "hours_label", label: "Hours Label", type: "text", defaultValue: "Hours" },
        { fieldKey: "newsletter_label", label: "Newsletter Label", type: "text", defaultValue: "Stay in the Know" },
        { fieldKey: "subscribe_text", label: "Subscribe Button", type: "text", defaultValue: "Subscribe" },
      ],
      media: [],
      hasColorOverride: true,
      defaultVisible: true,
    },
  ],
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Get a page definition by key */
export function getPageDefinition(key: string): PageDefinition | undefined {
  if (key === "footer") return FOOTER_DEFINITION;
  return PAGE_DEFINITIONS.find((p) => p.key === key);
}

/** Get all page definitions including footer */
export function getAllPageDefinitions(): PageDefinition[] {
  return [...PAGE_DEFINITIONS, FOOTER_DEFINITION];
}

/** Get all content keys for a page (for batch fetching) */
export function getPageContentKeys(pageKey: string): string[] {
  const page = getPageDefinition(pageKey);
  if (!page) return [];
  const keys: string[] = [];
  for (const section of page.sections) {
    keys.push(section.contentKey);
    if (section.legacyKeys) keys.push(...section.legacyKeys);
    for (const media of section.media) keys.push(media.mediaKey);
  }
  return keys;
}

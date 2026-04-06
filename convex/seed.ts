import { action, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

// ── Internal mutation that writes all seed data ─────────────────────────────

export const insertSeedData = internalMutation({
  args: {},
  handler: async (ctx) => {
    // ────────────────────────────────────────────────────────────────────────
    // SERVICES (10 across 4 categories)
    // ────────────────────────────────────────────────────────────────────────
    const services = [
      {
        name: "Botox Cosmetic",
        slug: "botox-cosmetic",
        shortDescription:
          "Smooth fine lines and wrinkles with precision-placed neuromodulator injections.",
        fullDescription:
          "Our signature Botox Cosmetic treatment targets dynamic wrinkles caused by repetitive facial movements. Using advanced micro-dosing techniques, our board-certified injectors deliver natural-looking results that soften crow's feet, forehead lines, and frown lines while preserving your expressive beauty. Results typically appear within 3-5 days and last 3-4 months.",
        category: "Injectables",
        duration: "30 minutes",
        priceRange: "$250 - $600",
        isActive: true,
        sortOrder: 1,
      },
      {
        name: "Dermal Fillers",
        slug: "dermal-fillers",
        shortDescription:
          "Restore youthful volume and contour with premium hyaluronic acid fillers.",
        fullDescription:
          "Our dermal filler treatments use top-tier hyaluronic acid formulations to restore lost volume, sculpt facial contours, and enhance natural beauty. Whether you desire plumper lips, defined cheekbones, or a smoother jawline, our expert injectors create bespoke treatment plans tailored to your unique facial anatomy. Results are immediate and can last 6-18 months depending on the treatment area.",
        category: "Injectables",
        duration: "45 minutes",
        priceRange: "$550 - $1,200",
        isActive: true,
        sortOrder: 2,
      },
      {
        name: "Lip Enhancement",
        slug: "lip-enhancement",
        shortDescription:
          "Achieve beautifully balanced, naturally fuller lips with expert artistry.",
        fullDescription:
          "Our lip enhancement service goes beyond simple volume. Using a combination of premium fillers and advanced injection techniques, we sculpt lips that complement your facial proportions perfectly. From subtle definition to a more dramatic pout, every treatment is customized. We prioritize symmetry, natural movement, and a soft, touchable result that looks effortlessly beautiful.",
        category: "Injectables",
        duration: "30 minutes",
        priceRange: "$450 - $850",
        isActive: true,
        sortOrder: 3,
      },
      {
        name: "HydraFacial Signature",
        slug: "hydrafacial-signature",
        shortDescription:
          "Deep cleanse, exfoliate, and hydrate with our most popular facial treatment.",
        fullDescription:
          "The HydraFacial Signature experience combines cleansing, exfoliation, extraction, hydration, and antioxidant protection in one luxurious session. Using patented vortex technology, this treatment removes impurities while delivering nourishing serums deep into the skin. Perfect for all skin types, it leaves your complexion radiant, plump, and glowing with zero downtime. Ideal as a monthly maintenance treatment or pre-event glow-up.",
        category: "Skin",
        duration: "60 minutes",
        priceRange: "$225 - $350",
        isActive: true,
        sortOrder: 4,
      },
      {
        name: "Chemical Peel",
        slug: "chemical-peel",
        shortDescription:
          "Reveal brighter, smoother skin with medical-grade resurfacing peels.",
        fullDescription:
          "Our chemical peels range from gentle lunchtime refreshers to deeper transformative treatments. Using medical-grade formulations of glycolic, salicylic, and TCA acids, we customize each peel to address your specific concerns -- whether that's hyperpigmentation, acne scarring, fine lines, or dull texture. A thorough skin analysis ensures the ideal peel strength and formulation for your skin type and goals.",
        category: "Skin",
        duration: "45 minutes",
        priceRange: "$150 - $400",
        isActive: true,
        sortOrder: 5,
      },
      {
        name: "Microneedling with PRP",
        slug: "microneedling-prp",
        shortDescription:
          "Stimulate collagen production and skin renewal with advanced microneedling.",
        fullDescription:
          "This powerful combination treatment pairs precision microneedling with platelet-rich plasma (PRP) derived from your own blood. The microneedling creates controlled micro-channels in the skin, while PRP delivers concentrated growth factors that accelerate healing and collagen synthesis. The result is firmer, smoother, more even-toned skin with reduced scarring, pore size, and fine lines. A series of 3-4 treatments spaced 4-6 weeks apart delivers optimal results.",
        category: "Skin",
        duration: "75 minutes",
        priceRange: "$400 - $700",
        isActive: true,
        sortOrder: 6,
      },
      {
        name: "CoolSculpting Elite",
        slug: "coolsculpting-elite",
        shortDescription:
          "Freeze away stubborn fat with FDA-cleared non-invasive body contouring.",
        fullDescription:
          "CoolSculpting Elite uses dual applicators and advanced cryolipolysis technology to target and eliminate stubborn fat cells that resist diet and exercise. Treatment areas include the abdomen, flanks, thighs, double chin, and upper arms. The upgraded Elite system treats two areas simultaneously, cutting session time in half. Fat cells are permanently destroyed and naturally eliminated by your body over 2-3 months, revealing a slimmer, more contoured silhouette.",
        category: "Body",
        duration: "60 minutes",
        priceRange: "$750 - $1,500",
        isActive: true,
        sortOrder: 7,
      },
      {
        name: "Laser Hair Removal",
        slug: "laser-hair-removal",
        shortDescription:
          "Achieve silky-smooth skin with advanced diode laser technology.",
        fullDescription:
          "Our state-of-the-art diode laser system delivers fast, comfortable, and effective permanent hair reduction for all skin tones. The advanced cooling technology ensures a virtually pain-free experience while the laser targets hair follicles at their root. Most clients achieve 80-90% reduction after a series of 6-8 treatments. Popular areas include underarms, bikini, legs, face, and back.",
        category: "Body",
        duration: "30 - 90 minutes",
        priceRange: "$150 - $500",
        isActive: true,
        sortOrder: 8,
      },
      {
        name: "IV Vitamin Therapy",
        slug: "iv-vitamin-therapy",
        shortDescription:
          "Replenish, rehydrate, and revitalize with custom IV nutrient infusions.",
        fullDescription:
          "Our IV Vitamin Therapy delivers a potent blend of vitamins, minerals, amino acids, and antioxidants directly into your bloodstream for maximum absorption and immediate effect. Choose from our curated drip menus -- including the Glow Drip for radiant skin, the Recovery Drip for post-workout or post-travel rejuvenation, and the Immunity Drip for a powerful wellness boost. Each session is administered by a licensed nurse in our serene infusion lounge.",
        category: "Wellness",
        duration: "45 - 60 minutes",
        priceRange: "$175 - $350",
        isActive: true,
        sortOrder: 9,
      },
      {
        name: "Hormone Optimization",
        slug: "hormone-optimization",
        shortDescription:
          "Restore hormonal balance and vitality with personalized bioidentical therapy.",
        fullDescription:
          "Our comprehensive Hormone Optimization program begins with advanced lab panels and a thorough health assessment conducted by our clinical team. Using bioidentical hormone replacement therapy (BHRT), we create a precision protocol to address fatigue, weight gain, mood changes, low libido, and other symptoms of hormonal imbalance. Ongoing monitoring and dosage adjustments ensure optimal results and safety throughout your wellness journey.",
        category: "Wellness",
        duration: "Initial consult: 60 minutes",
        priceRange: "$300 - $600/month",
        isActive: true,
        sortOrder: 10,
      },
    ];

    for (const service of services) {
      await ctx.db.insert("services", service);
    }

    // ────────────────────────────────────────────────────────────────────────
    // FAQS (15+)
    // ────────────────────────────────────────────────────────────────────────
    const faqs = [
      {
        question: "What should I expect during my first visit?",
        answer:
          "Your first visit begins with a complimentary consultation where we discuss your aesthetic goals, review your medical history, and perform a thorough skin analysis. Our providers will create a personalized treatment plan and walk you through every step before any procedure begins. Most first appointments last 60-90 minutes to ensure we have ample time for your questions.",
        category: "General",
        sortOrder: 1,
        isActive: true,
      },
      {
        question: "Is there parking available at MADE Med Spa?",
        answer:
          "Yes, we offer complimentary on-site parking for all guests. Our facility features a private parking area directly adjacent to the building for your convenience and privacy.",
        category: "General",
        sortOrder: 2,
        isActive: true,
      },
      {
        question: "Do you offer financing or payment plans?",
        answer:
          "We partner with leading healthcare financing providers to offer flexible payment plans with 0% APR options for qualifying patients. Our team can walk you through available options during your consultation. We also accept all major credit cards, HSA, and FSA cards.",
        category: "General",
        sortOrder: 3,
        isActive: true,
      },
      {
        question: "How long does Botox last?",
        answer:
          "Botox results typically last 3-4 months, though some patients experience results lasting up to 6 months with consistent treatments over time. We recommend scheduling maintenance appointments every 3-4 months to maintain your results. Our providers will work with you to find the ideal treatment cadence.",
        category: "Services",
        sortOrder: 4,
        isActive: true,
      },
      {
        question: "Are dermal fillers safe?",
        answer:
          "Yes, the FDA-approved hyaluronic acid fillers we use have an excellent safety profile and decades of clinical research behind them. Because hyaluronic acid is a substance naturally found in your body, allergic reactions are extremely rare. All treatments are performed by experienced, board-certified providers. Additionally, hyaluronic acid fillers are reversible with an enzyme called hyaluronidase, adding an extra layer of safety.",
        category: "Services",
        sortOrder: 5,
        isActive: true,
      },
      {
        question: "What is the downtime for a chemical peel?",
        answer:
          "Downtime varies by peel depth. Light peels may cause mild flaking for 1-3 days, while medium-depth peels can involve 5-7 days of visible peeling. We will provide detailed aftercare instructions and medical-grade recovery products. Most clients schedule peels around their social calendar, and our team can help you plan accordingly.",
        category: "Services",
        sortOrder: 6,
        isActive: true,
      },
      {
        question: "How many laser hair removal sessions will I need?",
        answer:
          "Most clients achieve optimal results with 6-8 sessions spaced 4-6 weeks apart. Hair grows in cycles, and the laser is most effective during the active growth phase. The exact number of sessions depends on the treatment area, hair color, and skin type. During your consultation, we will provide a personalized treatment plan and timeline.",
        category: "Services",
        sortOrder: 7,
        isActive: true,
      },
      {
        question: "What are the membership commitment terms?",
        answer:
          "All MADE Med Spa memberships require a minimum 6-month commitment to ensure you experience the full benefits of consistent treatment. After your initial commitment period, your membership renews month-to-month and can be cancelled with 30 days written notice. Unused monthly credits may be rolled over according to your tier's terms.",
        category: "Membership",
        sortOrder: 8,
        isActive: true,
      },
      {
        question: "Can I upgrade or downgrade my membership tier?",
        answer:
          "Absolutely. You may upgrade your membership at any time, and the prorated difference will be applied to your current billing cycle. Downgrades can be processed after your initial commitment period and take effect at the start of your next billing cycle. Contact our membership concierge to make any changes.",
        category: "Membership",
        sortOrder: 9,
        isActive: true,
      },
      {
        question: "Can I share my membership benefits with family members?",
        answer:
          "Membership benefits are personal and non-transferable. However, members at the Luxe and Elite tiers can gift one complimentary introductory facial per year to a friend or family member. We also offer family membership packages -- ask our concierge team for details.",
        category: "Membership",
        sortOrder: 10,
        isActive: true,
      },
      {
        question: "How far in advance should I book my appointment?",
        answer:
          "We recommend booking 1-2 weeks in advance for facials and skin treatments, and 2-4 weeks in advance for injectable appointments. Members enjoy priority booking and can often secure same-week availability. For special events or weddings, we suggest starting your treatment plan 3-6 months in advance.",
        category: "Booking",
        sortOrder: 11,
        isActive: true,
      },
      {
        question: "What is your cancellation policy?",
        answer:
          "We kindly request at least 24 hours notice for cancellations or rescheduling. Late cancellations (under 24 hours) are subject to a fee of 50% of the treatment cost. No-shows will be charged the full treatment amount. We understand that life happens -- if you have an emergency, please contact us and we will do our best to accommodate you.",
        category: "Booking",
        sortOrder: 12,
        isActive: true,
      },
      {
        question: "What should I avoid before my injectable appointment?",
        answer:
          "For 7 days before your injectable treatment, we recommend avoiding blood-thinning medications and supplements such as aspirin, ibuprofen, fish oil, and vitamin E (unless prescribed by your physician). Avoid alcohol for 24 hours before your appointment. Arrive with a clean face, free of makeup. These precautions help minimize bruising and ensure the best results.",
        category: "Aftercare",
        sortOrder: 13,
        isActive: true,
      },
      {
        question: "How should I care for my skin after a HydraFacial?",
        answer:
          "After your HydraFacial, avoid direct sun exposure for 24 hours and apply a broad-spectrum SPF 30+ sunscreen. Your skin will be exceptionally receptive to products, so continue with a gentle, hydrating skincare routine. Avoid exfoliants, retinols, and active acids for 48 hours. You can wear makeup the next day if desired. Most clients notice an immediate glow that continues to improve over the following days.",
        category: "Aftercare",
        sortOrder: 14,
        isActive: true,
      },
      {
        question: "What aftercare is required following microneedling?",
        answer:
          "After microneedling, your skin will appear red and feel warm, similar to a mild sunburn, for 24-72 hours. Use only the post-procedure products provided by our team for the first 48 hours. Avoid makeup, direct sun exposure, strenuous exercise, and swimming for at least 48 hours. Do not use retinoids, AHAs, or BHAs for one week. Keep your skin hydrated and apply SPF 30+ daily. Full healing typically occurs within 5-7 days.",
        category: "Aftercare",
        sortOrder: 15,
        isActive: true,
      },
      {
        question: "When will I see results from CoolSculpting?",
        answer:
          "Initial changes may be noticed as early as 3 weeks after treatment, with the most dramatic results appearing after 2-3 months as your body naturally processes and eliminates the treated fat cells. Some patients continue to see improvements for up to 6 months. Results are permanent as long as you maintain a stable weight and healthy lifestyle.",
        category: "Aftercare",
        sortOrder: 16,
        isActive: true,
      },
    ];

    for (const faq of faqs) {
      await ctx.db.insert("faqs", faq);
    }

    // ────────────────────────────────────────────────────────────────────────
    // SITE CONTENT
    // ────────────────────────────────────────────────────────────────────────
    const now = Date.now();
    const siteContent = [
      {
        key: "home_hero",
        title: "Elevate Your Natural Beauty",
        body: "At MADE Med Spa, we blend clinical expertise with luxurious self-care to help you look and feel your absolute best. Discover treatments tailored to your unique beauty.",
        updatedAt: now,
      },
      {
        key: "about_story",
        title: "Our Story",
        body: "MADE Med Spa was founded on the belief that everyone deserves access to exceptional aesthetic care in a warm, welcoming environment. Our team of board-certified providers combines advanced medical training with an artist's eye for beauty, delivering results that enhance your natural features rather than masking them. Every treatment at MADE is thoughtfully customized because we know that true beauty is never one-size-fits-all.",
        updatedAt: now,
      },
      {
        key: "about_mission",
        title: "Our Mission",
        body: "To empower our clients with confidence through personalized, results-driven aesthetic treatments delivered with the highest standards of safety, artistry, and care.",
        updatedAt: now,
      },
      {
        key: "about_values",
        title: "Our Values",
        body: "Integrity in every recommendation. Artistry in every treatment. Warmth in every interaction. We are committed to honest consultations, evidence-based treatments, and building lasting relationships with every guest who walks through our doors.",
        updatedAt: now,
      },
      {
        key: "home_tagline",
        title: "Luxury Meets Results",
        body: "Where science meets artistry. Experience the MADE difference with treatments designed to reveal the most radiant version of you.",
        updatedAt: now,
      },
      {
        key: "contact_intro",
        title: "Get In Touch",
        body: "We would love to hear from you. Whether you have questions about a treatment, want to learn more about membership, or are ready to book your first appointment, our team is here to help.",
        updatedAt: now,
      },
    ];

    for (const content of siteContent) {
      await ctx.db.insert("siteContent", content);
    }

    // ────────────────────────────────────────────────────────────────────────
    // BUSINESS INFO (siteContent with metadata)
    // ────────────────────────────────────────────────────────────────────────
    await ctx.db.insert("siteContent", {
      key: "business_info",
      updatedAt: now,
      metadata: {
        addressLine1: "123 Beauty Lane, Suite 100",
        addressLine2: "City, State 12345",
        phone: "(555) 123-4567",
        phoneHref: "tel:+15551234567",
        email: "hello@mademedpsa.com",
        emailHref: "mailto:hello@mademedpsa.com",
        hours: [
          { days: "Monday - Friday", hours: "9:00 AM - 7:00 PM" },
          { days: "Saturday", hours: "10:00 AM - 5:00 PM" },
          { days: "Sunday", hours: "Closed" },
        ],
        socials: [
          { label: "Instagram", href: "#" },
          { label: "Facebook", href: "#" },
          { label: "TikTok", href: "#" },
        ],
      },
    });

    // ────────────────────────────────────────────────────────────────────────
    // PRIVACY POLICY & TERMS (siteContent)
    // ────────────────────────────────────────────────────────────────────────
    await ctx.db.insert("siteContent", {
      key: "privacy_policy",
      title: "Privacy Policy",
      body: "This privacy policy explains how MADE Med Spa Aesthetics and Wellness collects, uses, and protects your personal information. Please check back for our full privacy policy before our grand opening.",
      updatedAt: now,
    });

    await ctx.db.insert("siteContent", {
      key: "terms_of_service",
      title: "Terms of Service",
      body: "These terms of service govern your use of the MADE Med Spa website. Please check back for our full terms of service before our grand opening.",
      updatedAt: now,
    });

    // ────────────────────────────────────────────────────────────────────────
    // TEAM MEMBERS (4)
    // ────────────────────────────────────────────────────────────────────────
    const teamMembers = [
      {
        name: "Dr. Karlyne",
        title: "Founder & Medical Director",
        bio: "Board-certified physician with over 15 years of experience in aesthetic medicine, dedicated to enhancing natural beauty through precision and artistry.",
        sortOrder: 1,
        isActive: true,
      },
      {
        name: "Sophia Laurent",
        title: "Lead Aesthetic Nurse Practitioner",
        bio: "Specializing in advanced injectables and facial rejuvenation, Sophia brings an artist's eye and a scientist's precision to every treatment.",
        sortOrder: 2,
        isActive: true,
      },
      {
        name: "Mia Chen",
        title: "Licensed Esthetician",
        bio: "With certifications in clinical skincare and holistic wellness, Mia curates personalized treatment plans that nourish skin from within.",
        sortOrder: 3,
        isActive: true,
      },
      {
        name: "Olivia Hart",
        title: "Patient Experience Coordinator",
        bio: "Olivia ensures every visit feels effortless and luxurious, guiding guests through their aesthetic journey with warmth and expertise.",
        sortOrder: 4,
        isActive: true,
      },
    ];

    for (const member of teamMembers) {
      await ctx.db.insert("teamMembers", member);
    }

    // ────────────────────────────────────────────────────────────────────────
    // TESTIMONIALS (3)
    // ────────────────────────────────────────────────────────────────────────
    const testimonials = [
      {
        name: "Victoria R.",
        quote: "MADE transformed not just my appearance, but my confidence. The team's artistry and attention to detail is unlike anything I've experienced.",
        treatment: "Dermal Fillers & Skin Rejuvenation",
        sortOrder: 1,
        isActive: true,
      },
      {
        name: "Sophia M.",
        quote: "From the moment I walked in, I felt seen and cared for. The results are beautifully natural — exactly what I wanted.",
        treatment: "Botox & Facial Contouring",
        sortOrder: 2,
        isActive: true,
      },
      {
        name: "Alessandra K.",
        quote: "I've been a member for over a year now and the consistent quality and personalized care keeps me coming back. This is self-care elevated.",
        treatment: "MADE Membership",
        sortOrder: 3,
        isActive: true,
      },
    ];

    for (const testimonial of testimonials) {
      await ctx.db.insert("testimonials", testimonial);
    }

  },
});

// ── Public action to trigger seeding ────────────────────────────────────────

export const run = action({
  args: {},
  handler: async (ctx) => {
    await ctx.runMutation(internal.seed.insertSeedData);
    return { success: true, message: "Seed data inserted successfully." };
  },
});

// ── Remove duplicate rows (keeps the first by _creationTime) ───────────────

export const deduplicate = internalMutation({
  args: {},
  handler: async (ctx) => {
    const tables = [
      "services",
      "faqs",
    ] as const;
    let totalRemoved = 0;

    for (const table of tables) {
      const rows = await ctx.db.query(table).collect();
      const seen = new Map<string, boolean>();
      for (const row of rows) {
        const key = (row as Record<string, unknown>).slug as string;
        if (seen.has(key)) {
          await ctx.db.delete(row._id);
          totalRemoved++;
        } else {
          seen.set(key, true);
        }
      }
    }
    return { totalRemoved };
  },
});

export const runDedup = action({
  args: {},
  handler: async (ctx): Promise<{ success: boolean; totalRemoved: number }> => {
    const result = await ctx.runMutation(internal.seed.deduplicate);
    return { success: true, ...result };
  },
});

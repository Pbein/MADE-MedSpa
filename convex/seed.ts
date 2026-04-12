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
          "Natural-looking neuromodulator treatment that softens lines while keeping your face moving the way it should.",
        fullDescription:
          "Botox here isn't about freezing your face — it is about softening the lines you don't want while preserving the movement that makes you look like you. Before any needle touches your skin, we spend time looking at how your face actually moves, talking through what you want to address, and — just as importantly — what you don't. Most clients come to us after seeing overdone results elsewhere, and our approach is deliberately restrained: micro-dosed, precisely placed, and planned around the way your expressions already work. Results appear within 3-5 days and typically last 3-4 months.",
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
          "Subtle, thoughtful volume restoration using premium hyaluronic acid — without the overfilled look.",
        fullDescription:
          "Dermal filler done well shouldn't look like filler at all. Using premium hyaluronic acid products and a deliberately conservative approach, we restore volume in the places age has quietly taken it — cheeks, temples, under-eyes, jawline — while respecting the proportions of your face. We'd rather undertreat and bring you back than overcorrect, and we will tell you honestly when filler isn't the right answer. Expect a detailed consultation that covers what we are going to do, what we are not, and why. Results are immediate and typically last 6-18 months depending on the product and area.",
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
          "Naturally balanced lip filler that looks like better lips — not obviously filled ones.",
        fullDescription:
          "The goal of lip enhancement here isn't bigger lips — it is balanced, natural-looking lips that complement your face. Whether you want subtle hydration and definition or a fuller shape, we build every treatment around your proportions, your resting lip shape, and how your lips move when you smile and talk. Soft, natural movement is non-negotiable, and we will always talk through what's realistic for your anatomy and what isn't. Results are immediate and typically last 6-12 months.",
        category: "Injectables",
        duration: "30 minutes",
        priceRange: "$450 - $850",
        isActive: true,
        sortOrder: 3,
      },
      {
        name: "Sculptra",
        slug: "sculptra",
        shortDescription:
          "Collagen-stimulating biostimulator for gradual, long-lasting volume restoration that looks like it was always yours.",
        fullDescription:
          "Sculptra is a poly-L-lactic acid biostimulator, which is a technical way of saying it signals your skin to rebuild its own collagen rather than just sitting in the tissue like traditional filler. Results develop gradually over 3-6 months — people notice you look better without being able to pinpoint what changed. It is the right answer for clients who want structural improvement in the cheeks, temples, and mid-face without the 'done' look that can come from aggressive filling. Because the treatment requires a real understanding of timelines and anatomy, every plan begins with a thorough consultation covering the science, what to realistically expect, and real before-and-after examples. A full course is typically 2-3 sessions spaced 4-6 weeks apart, with final results visible at 4-6 months and lasting up to two years.",
        category: "Injectables",
        duration: "60 minutes",
        priceRange: "$850 - $1,400 per vial",
        isActive: true,
        sortOrder: 3.1,
      },
      {
        name: "Hyperdilute Radiesse",
        slug: "hyperdilute-radiesse",
        shortDescription:
          "Collagen-stimulating treatment for skin laxity and luminosity — especially the neck, jawline, and décolletage.",
        fullDescription:
          "Hyperdilute Radiesse takes calcium hydroxylapatite — a powerful collagen and elastin stimulator — and dilutes it so it spreads evenly through the skin to rebuild firmness where standard filler can't help. It is the answer for the areas most practices either wave off or overcorrect with filler: the neck, jawline, décolletage, and backs of the hands. Results build gradually over 6-12 weeks as your body produces new collagen, leaving treated areas tighter, smoother, and more luminous. A typical plan involves 2-3 sessions. This is a nuanced treatment that only works in experienced hands, and every consultation includes a clear explanation of the science, expected timelines, and what results are realistic for your skin.",
        category: "Injectables",
        duration: "60 minutes",
        priceRange: "$650 - $1,200",
        isActive: true,
        sortOrder: 3.2,
      },
      {
        name: "PRF Facial Rejuvenation",
        slug: "prf-facial-rejuvenation",
        shortDescription:
          "Next-generation platelet-rich fibrin using your own growth factors to improve tone, texture, and overall skin quality.",
        fullDescription:
          "PRF — platelet-rich fibrin — is the next generation of PRP. Using a small sample of your own blood, we isolate a concentrate rich in platelets, fibrin, and growth factors, then return it to your skin through targeted injections or microneedling. Because it is derived entirely from your own body, there is no risk of rejection or allergic reaction. Over 6-12 weeks, PRF stimulates collagen, evens out tone, and improves texture in a way that topical products simply can't match. The process feels approachable because it is — we walk you through every step, check in during the treatment, and follow up the next day to make sure you are recovering comfortably. A typical plan involves 2-3 sessions.",
        category: "Injectables",
        duration: "75 minutes",
        priceRange: "$600 - $1,100",
        isActive: true,
        sortOrder: 3.3,
      },
      {
        name: "PRP Under-Eye Treatment",
        slug: "prp-under-eye",
        shortDescription:
          "Targeted platelet-rich plasma injections to brighten the under-eye area without the puffiness filler can cause.",
        fullDescription:
          "The under-eye area is notoriously hard to treat well. Filler can look puffy or bluish, creams only go so far, and the skin here is thinner and more delicate than anywhere else on the face. PRP (platelet-rich plasma) offers a natural alternative: using growth factors drawn from your own blood, we gently rejuvenate the under-eye skin to improve tone, reduce the appearance of darkness, and restore a more rested look. Results develop over 8-12 weeks and a typical plan involves 2-3 sessions. This is the right treatment for clients who want real improvement without the 'done' appearance that can come from aggressive filler correction.",
        category: "Injectables",
        duration: "60 minutes",
        priceRange: "$500 - $900",
        isActive: true,
        sortOrder: 3.4,
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
        title: "Natural Results, On Purpose",
        body: "Thoughtful aesthetic care from a nurse injector who takes the time to look at how your face actually moves before touching a needle. Unhurried consultations, honest recommendations, and results so natural that people notice something is different — without being able to tell what.",
        updatedAt: now,
      },
      {
        key: "about_story",
        title: "Our Story",
        body: "MADE Med Spa was founded on a simple idea: the best aesthetic work is the work no one can point to. Too many clients arrive having seen overdone results elsewhere — the frozen forehead, the puffed lips, the face that no longer moves the way it used to. We do things differently. Every treatment starts with an honest consultation, a careful look at how your face actually moves, and a plan built around restraint. The goal is never transformation. It is you, looking like yourself on a good day.",
        updatedAt: now,
      },
      {
        key: "about_mission",
        title: "Our Mission",
        body: "To deliver aesthetic results that look like the best version of you — never frozen, never overdone. We believe the best treatment starts with a real conversation: what you want, what you don't, and what actually fits your face. No pressure, no upselling, and follow-up care that lasts beyond the appointment.",
        updatedAt: now,
      },
      {
        key: "about_values",
        title: "Our Values",
        body: "Restraint over excess. Education over pressure. Honest recommendations — including the ones that don't involve a needle. Every client leaves knowing exactly what was done, why, and what to expect next. And we follow up to make sure you are happy with the results.",
        updatedAt: now,
      },
      {
        key: "home_tagline",
        title: "The Difference Is In What We Don't Do",
        body: "No rushed appointments. No one-size-fits-all recommendations. No 'while you're here' add-ons. Just careful, educated aesthetic care from a nurse injector who takes the time to get it right — and follows up afterward to make sure you are happy.",
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
        name: "Nurse Karlyne",
        title: "Founder & Lead Aesthetic Nurse Injector",
        bio: "Aesthetic nurse injector and founder of MADE Med Spa, known for unhurried consultations, restrained results, and a refusal to upsell. Her approach starts with a real conversation — what you want, what you don't, and what actually fits your face — before any needle is touched. Clients consistently cite her patience, transparency, and post-appointment follow-up.",
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
        name: "Verified Client",
        quote: "I've been getting toxins for years at other places and always left looking a little frozen or 'done.' My first appointment at MADE was completely different. The consultation alone was 20 minutes and she actually looked at how my face moves before touching a needle. The results are the most natural I've ever had. I look like myself, just more rested.",
        treatment: "Botox",
        sortOrder: 1,
        isActive: true,
      },
      {
        name: "Verified Client",
        quote: "I was nervous about filler. I'd seen too many overdone faces and didn't want that. She spent more time explaining what she wasn't going to do than what she was, which somehow made me trust her completely. The end result is so subtle my husband noticed I looked 'refreshed' but couldn't figure out why. That's exactly what I wanted.",
        treatment: "Dermal Filler",
        sortOrder: 2,
        isActive: true,
      },
      {
        name: "Verified Client",
        quote: "I'd been curious about Sculptra for two years but couldn't find a provider I trusted enough to actually do it. The education I received before committing — anatomy, realistic timelines, real before-and-afters — was unlike anything I've experienced. Four months in and my cheekbones look like they did in my early thirties.",
        treatment: "Sculptra",
        sortOrder: 3,
        isActive: true,
      },
      {
        name: "Verified Client",
        quote: "I came in asking about skin laxity on my neck and jawline, something most places either wave off or just throw filler at. She recommended hyperdilute Radiesse and explained the collagen science in a way that actually made sense to me. Six weeks later my skin looks tighter and more luminous. I didn't expect results like this.",
        treatment: "Hyperdilute Radiesse",
        sortOrder: 4,
        isActive: true,
      },
      {
        name: "Verified Client",
        quote: "PRF was something I kept reading about but felt intimidated by. The warmth in this practice made it feel so approachable — she talked me through every step, checked in throughout, and followed up the next day. My skin tone has evened out beautifully over the past two months. I feel like I look like the best version of myself.",
        treatment: "PRF",
        sortOrder: 5,
        isActive: true,
      },
      {
        name: "Verified Client",
        quote: "From the moment I sat down, I felt completely at ease. Karlyne's knowledge is on another level — she walked me through everything in detail, answered every question I had, and made sure I fully understood what she was doing and why. I've never felt so comfortable and safe trusting someone with my face. Her professionalism is the real thing.",
        treatment: "Consultation & Care",
        sortOrder: 6,
        isActive: true,
      },
      {
        name: "Verified Client",
        quote: "What sets Karlyne apart isn't just her skill — it's how she makes you feel throughout the entire experience. She checked in after my visit to see how I was doing, and during my consultation she was completely transparent about what I needed and what I didn't. No upselling, no pressure. Just honest, thoughtful care. I finally found my injector.",
        treatment: "Patient Experience",
        sortOrder: 7,
        isActive: true,
      },
      {
        name: "Verified Client",
        quote: "Karlyne followed up with me after my appointment just to check in, I wasn't expecting that at all. It's such a small thing but it meant everything. And throughout the whole process she never once pushed me toward anything I wasn't ready for. She genuinely listens, meets you where you are, and lets the results speak for themselves.",
        treatment: "Patient Experience",
        sortOrder: 8,
        isActive: true,
      },
      {
        name: "Verified Client",
        quote: "I came in nervous and left feeling like I was in the best hands. Karlyne is incredibly knowledgeable — she explained everything clearly and never made me feel rushed or pressured into anything. She followed up after my appointment to make sure I was happy with my results. That kind of care is rare, and it's exactly why I won't go anywhere else.",
        treatment: "First Visit",
        sortOrder: 9,
        isActive: true,
      },
      {
        name: "Verified Client",
        quote: "Karlyne was my nurse for my Botox and fillers and I could not be happier with her services. She is so knowledgeable, honest, and makes you feel so comfortable. She takes her time and is patient with her work. I highly recommend seeing her!!!",
        treatment: "Botox & Fillers",
        sortOrder: 10,
        isActive: true,
      },
      {
        name: "Verified Client",
        quote: "Nurse Karlyne did an amazing job with my Botox. As a male I was very nervous to get Botox done because I wanted my results to be very natural. She explained everything in detail to me and gave me all of the best recommendations. I will be returning to see her at the end of the month for PRP injections under my eyes.",
        treatment: "Botox",
        sortOrder: 11,
        isActive: true,
      },
      {
        name: "Verified Client",
        quote: "I got lip filler for the first time with Nurse Karlyne and it was a great experience! She made my visit very comfortable and relaxed and took the time to explain everything. I am so happy with the results and would recommend Nurse Karlyne for your services!",
        treatment: "Lip Filler",
        sortOrder: 12,
        isActive: true,
      },
      {
        name: "Verified Client",
        quote: "I've been getting my Botox injections done by Karlyne for the past 6 months now, she is so nice to work with. Very professional, personable, and communicated with me throughout the appointment. My results always turn out amazing.",
        treatment: "Botox",
        sortOrder: 13,
        isActive: true,
      },
      {
        name: "Verified Client",
        quote: "I had the pleasure of getting my Botox done with Karlyne. She addressed all of my questions and concerns and did a great job. Results have been amazing.",
        treatment: "Botox",
        sortOrder: 14,
        isActive: true,
      },
      {
        name: "Verified Client",
        quote: "I received a warm greeting when I walked in. My service was provided by Nurse Karlyne. She was so pleasant! She explained everything, answered all my questions, and made me feel comfortable. Thank you!",
        treatment: "First Visit",
        sortOrder: 15,
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

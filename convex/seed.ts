import { action, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

// ── Internal mutation that writes all seed data ─────────────────────────────

export const insertSeedData = internalMutation({
  args: {},
  handler: async (ctx) => {
    // ────────────────────────────────────────────────────────────────────────
    // SERVICES
    // ────────────────────────────────────────────────────────────────────────
    const services = [
      {
        name: "Botox / Dysport",
        slug: "botox-dysport",
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
          "Dermal filler done well shouldn't look like filler at all. Using premium hyaluronic acid products (Juvederm, Restylane) and a deliberately conservative approach, we restore volume in the places age has quietly taken it — cheeks, temples, under-eyes, jawline — while respecting the proportions of your face. We'd rather undertreat and bring you back than overcorrect, and we will tell you honestly when filler isn't the right answer.",
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
          "The goal of lip enhancement here isn't bigger lips — it is balanced, natural-looking lips that complement your face. Whether you want subtle hydration and definition or a fuller shape, we build every treatment around your proportions, your resting lip shape, and how your lips move when you smile and talk. Soft, natural movement is non-negotiable. Results are immediate and typically last 6-12 months.",
        category: "Injectables",
        duration: "30 minutes",
        priceRange: "$450 - $850",
        isActive: true,
        sortOrder: 3,
      },
      {
        name: "Cheek Augmentation",
        slug: "cheek-augmentation",
        shortDescription:
          "Restore youthful cheek volume and contour with precisely placed dermal filler.",
        fullDescription:
          "Cheek augmentation addresses volume loss in the mid-face — one of the earliest and most impactful signs of aging. Using premium hyaluronic acid fillers, we restore structure and lift to the cheeks while maintaining natural proportions. Every treatment starts with a thorough facial assessment to determine the ideal placement for your bone structure and goals.",
        category: "Injectables",
        duration: "45 minutes",
        priceRange: "$650 - $1,200",
        isActive: true,
        sortOrder: 4,
      },
      {
        name: "Jawline Contouring",
        slug: "jawline-contouring",
        shortDescription:
          "Define and sculpt the jawline with strategic filler placement for a more structured profile.",
        fullDescription:
          "Jawline contouring uses precisely placed dermal filler to create definition, correct asymmetry, and restore a more youthful, structured jawline. This treatment is particularly effective for clients experiencing early jowling or who want a more defined lower face without surgery.",
        category: "Injectables",
        duration: "45 minutes",
        priceRange: "$650 - $1,400",
        isActive: true,
        sortOrder: 5,
      },
      {
        name: "Under-Eye Filler",
        slug: "under-eye-filler",
        shortDescription:
          "Reduce the appearance of hollows and dark circles under the eyes with expert filler placement.",
        fullDescription:
          "The under-eye area is one of the most delicate and technically demanding areas to treat. Using conservative amounts of hyaluronic acid filler, we address hollowing and shadowing that makes you look tired — even when you're not. This is an area where restraint matters enormously, and we'd rather undertreat than risk puffiness.",
        category: "Injectables",
        duration: "30 minutes",
        priceRange: "$500 - $900",
        isActive: true,
        sortOrder: 6,
      },
      {
        name: "Sculptra",
        slug: "sculptra",
        shortDescription:
          "Collagen-stimulating biostimulator for gradual, long-lasting volume restoration that looks like it was always yours.",
        fullDescription:
          "Sculptra is a poly-L-lactic acid biostimulator that signals your skin to rebuild its own collagen rather than just sitting in the tissue like traditional filler. Results develop gradually over 3-6 months — people notice you look better without being able to pinpoint what changed. A full course is typically 2-3 sessions spaced 4-6 weeks apart, with final results lasting up to two years.",
        category: "Injectables",
        duration: "60 minutes",
        priceRange: "$850 - $1,400 per vial",
        isActive: true,
        sortOrder: 7,
      },
      {
        name: "Hyperdilute Radiesse",
        slug: "hyperdilute-radiesse",
        shortDescription:
          "Collagen-stimulating treatment for skin laxity and luminosity — especially the neck, jawline, and decolletage.",
        fullDescription:
          "Hyperdilute Radiesse takes calcium hydroxylapatite — a powerful collagen and elastin stimulator — and dilutes it so it spreads evenly through the skin to rebuild firmness where standard filler can't help. It is the answer for the areas most practices either wave off or overcorrect with filler: the neck, jawline, decolletage, and backs of the hands. Results build gradually over 6-12 weeks. A typical plan involves 2-3 sessions.",
        category: "Injectables",
        duration: "60 minutes",
        priceRange: "$650 - $1,200",
        isActive: true,
        sortOrder: 8,
      },
      {
        name: "Kybella",
        slug: "kybella",
        shortDescription:
          "FDA-approved injectable treatment that permanently dissolves submental fat (double chin).",
        fullDescription:
          "Kybella is a synthetic form of deoxycholic acid that permanently destroys fat cells under the chin. Results develop over several weeks as your body naturally processes the treated fat. Most clients require 2-4 treatment sessions spaced 4-6 weeks apart for optimal results.",
        category: "Injectables",
        duration: "30 minutes",
        priceRange: "$600 - $1,200",
        isActive: true,
        sortOrder: 9,
      },
      {
        name: "PRP Injections (Face)",
        slug: "prp-face",
        shortDescription:
          "Platelet-rich plasma injections using your own growth factors to improve tone, texture, and skin quality.",
        fullDescription:
          "Using a small sample of your own blood, we isolate a concentrate rich in platelets and growth factors, then return it to your skin through targeted injections. Because it is derived entirely from your own body, there is no risk of rejection or allergic reaction. Over 6-12 weeks, PRP stimulates collagen, evens out tone, and improves texture. A typical plan involves 2-3 sessions.",
        category: "Injectables",
        duration: "60 minutes",
        priceRange: "$500 - $900",
        isActive: true,
        sortOrder: 10,
      },
      {
        name: "Lip Flip",
        slug: "lip-flip",
        shortDescription:
          "A subtle neurotoxin technique that relaxes the upper lip for a gentle, natural flip without filler.",
        fullDescription:
          "The lip flip uses a small amount of neurotoxin along the upper lip border to relax the orbicularis oris muscle, allowing the lip to gently roll outward for a fuller appearance without adding volume. It's ideal for clients who want a subtle enhancement or who aren't ready for filler.",
        category: "Injectables",
        duration: "15 minutes",
        priceRange: "$150 - $250",
        isActive: true,
        sortOrder: 11,
      },
      {
        name: "Masseter / TMJ Treatment",
        slug: "masseter-tmj",
        shortDescription:
          "Neurotoxin injections to slim the jawline and relieve TMJ tension and teeth grinding.",
        fullDescription:
          "Masseter treatment uses neurotoxin to relax the masseter muscle, reducing jaw clenching and teeth grinding while creating a slimmer, more contoured lower face. This dual-benefit treatment addresses both cosmetic concerns and functional discomfort from TMJ.",
        category: "Injectables",
        duration: "15 minutes",
        priceRange: "$400 - $700",
        isActive: true,
        sortOrder: 12,
      },
      {
        name: "Brow Lift (Neurotoxin)",
        slug: "brow-lift",
        shortDescription:
          "Strategic neurotoxin placement to subtly lift and open the brow area.",
        fullDescription:
          "A non-surgical brow lift uses precisely placed neurotoxin to relax the muscles that pull the brow downward, creating a subtle lift and a more open, refreshed appearance around the eyes. Results are natural and last 3-4 months.",
        category: "Injectables",
        duration: "15 minutes",
        priceRange: "$200 - $400",
        isActive: true,
        sortOrder: 13,
      },
      {
        name: "Lip Filler Dissolve",
        slug: "lip-filler-dissolve",
        shortDescription:
          "Hyaluronidase treatment to safely dissolve unwanted or migrated hyaluronic acid filler.",
        fullDescription:
          "Using hyaluronidase, we can safely and effectively dissolve hyaluronic acid filler that has migrated, been overfilled, or no longer looks the way you want. This is a corrective treatment that allows us to start fresh or adjust previous work.",
        category: "Injectables",
        duration: "30 minutes",
        priceRange: "$300 - $500",
        isActive: true,
        sortOrder: 14,
      },
      // ── Skin & Facial Treatments ──
      {
        name: "HydraFacial MD",
        slug: "hydrafacial-md",
        shortDescription:
          "Deep cleanse, exfoliate, and hydrate with our signature HydraFacial treatment.",
        fullDescription:
          "The HydraFacial combines cleansing, exfoliation, extraction, hydration, and antioxidant protection in one luxurious session. Using patented vortex technology, this treatment removes impurities while delivering nourishing serums deep into the skin. Perfect for all skin types, it leaves your complexion radiant, plump, and glowing with zero downtime.",
        category: "Skin",
        duration: "60 minutes",
        priceRange: "$225 - $350",
        isActive: true,
        sortOrder: 20,
      },
      {
        name: "HydraFacial MD + Booster",
        slug: "hydrafacial-booster",
        shortDescription:
          "Enhanced HydraFacial with targeted booster serums for specific skin concerns.",
        fullDescription:
          "Our enhanced HydraFacial adds a targeted booster serum — such as Britenol for dark spots, Dermabuilder for fine lines, or Growth Factor for overall rejuvenation — to your standard treatment for amplified results.",
        category: "Skin",
        duration: "75 minutes",
        priceRange: "$300 - $450",
        isActive: true,
        sortOrder: 21,
      },
      {
        name: "VI Peel",
        slug: "vi-peel",
        shortDescription:
          "Medical-grade chemical peel that addresses pigmentation, acne, and aging with minimal downtime.",
        fullDescription:
          "The VI Peel is a medium-depth chemical peel that combines trichloroacetic acid, salicylic acid, phenol, vitamin C, and tretinoin to address a range of skin concerns including hyperpigmentation, melasma, acne scarring, and fine lines. Safe for all skin types, including darker tones. Expect 5-7 days of visible peeling with dramatic improvement in skin clarity and tone.",
        category: "Skin",
        duration: "30 minutes",
        priceRange: "$300 - $450",
        isActive: true,
        sortOrder: 22,
      },
      {
        name: "Cosmelan Depigmentation Peel",
        slug: "cosmelan-peel",
        shortDescription:
          "Advanced depigmentation treatment for stubborn melasma and hyperpigmentation.",
        fullDescription:
          "Cosmelan is a professional depigmentation treatment that targets melanin overproduction at its source. It's one of the most effective treatments available for stubborn melasma and post-inflammatory hyperpigmentation, with results visible within weeks and continued improvement over months.",
        category: "Skin",
        duration: "45 minutes",
        priceRange: "$600 - $900",
        isActive: true,
        sortOrder: 23,
      },
      {
        name: "MADE Signature Facial",
        slug: "signature-facial",
        shortDescription:
          "A customized medical-grade facial tailored to your specific skin needs and goals.",
        fullDescription:
          "Our signature facial is fully customized to your skin's current needs — combining cleansing, exfoliation, extractions, targeted treatments, and medical-grade products selected specifically for your skin type and concerns. This is not a one-size-fits-all facial; it's a personalized skin treatment.",
        category: "Skin",
        duration: "60 minutes",
        priceRange: "$175 - $275",
        isActive: true,
        sortOrder: 24,
      },
      {
        name: "Dermaplaning Facial",
        slug: "dermaplaning",
        shortDescription:
          "Gentle exfoliation that removes dead skin and peach fuzz for an instantly smoother, brighter complexion.",
        fullDescription:
          "Dermaplaning uses a sterile surgical blade to gently remove the outermost layer of dead skin cells and fine vellus hair (peach fuzz), revealing smoother, brighter skin underneath. This treatment enhances product absorption and creates a flawless canvas for makeup.",
        category: "Skin",
        duration: "45 minutes",
        priceRange: "$150 - $225",
        isActive: true,
        sortOrder: 25,
      },
      {
        name: "LED Light Therapy",
        slug: "led-light-therapy",
        shortDescription:
          "Non-invasive light therapy to reduce inflammation, stimulate collagen, and accelerate healing.",
        fullDescription:
          "LED light therapy uses specific wavelengths of light to trigger natural cellular processes. Red light stimulates collagen production and reduces inflammation, while blue light targets acne-causing bacteria. Often added to other treatments for enhanced results.",
        category: "Skin",
        duration: "20 minutes",
        priceRange: "$50 - $100",
        isActive: true,
        sortOrder: 26,
      },
      {
        name: "Microneedling",
        slug: "microneedling",
        shortDescription:
          "Stimulate collagen production and skin renewal with precision microneedling.",
        fullDescription:
          "Microneedling creates controlled micro-channels in the skin to trigger your body's natural wound-healing response, stimulating collagen and elastin production. This results in firmer, smoother, more even-toned skin with reduced scarring, pore size, and fine lines. A series of 3-4 treatments spaced 4-6 weeks apart delivers optimal results.",
        category: "Skin",
        duration: "60 minutes",
        priceRange: "$300 - $500",
        isActive: true,
        sortOrder: 27,
      },
      {
        name: "Microneedling with PRP (Vampire Facial)",
        slug: "microneedling-prp",
        shortDescription:
          "Advanced microneedling combined with your own platelet-rich plasma for accelerated skin renewal.",
        fullDescription:
          "This powerful combination pairs precision microneedling with platelet-rich plasma (PRP) derived from your own blood. The microneedling creates controlled micro-channels while PRP delivers concentrated growth factors that accelerate healing and collagen synthesis. The result is firmer, smoother, more even-toned skin.",
        category: "Skin",
        duration: "75 minutes",
        priceRange: "$500 - $800",
        isActive: true,
        sortOrder: 28,
      },
      // ── Laser & Energy Devices ──
      {
        name: "Aerolase Neo Elite",
        slug: "aerolase-neo-elite",
        shortDescription:
          "Advanced 650-microsecond Nd:YAG laser — safe and effective for all skin tones, including deeper tones.",
        fullDescription:
          "The Aerolase Neo Elite was specifically selected because it delivers exceptional results across all Fitzpatrick skin types, including deeper tones that most med spas can't safely treat. Treatment modes include skin rejuvenation, acne treatment, pigmentation and melasma correction, rosacea and vascular treatment, and body treatments. This is one of the primary reasons we chose it as our featured laser.",
        category: "Laser",
        duration: "30 - 60 minutes",
        priceRange: "$300 - $800",
        isActive: true,
        sortOrder: 30,
      },
      {
        name: "Sylfirm X RF Microneedling",
        slug: "sylfirm-x",
        shortDescription:
          "Next-generation RF microneedling for skin tightening, texture improvement, and collagen stimulation.",
        fullDescription:
          "Sylfirm X combines microneedling with radiofrequency energy to deliver heat precisely into the deeper layers of skin, stimulating collagen and elastin production while tightening existing fibers. Available for full face, neck, or face + neck combo treatments. Safe for all skin tones.",
        category: "Laser",
        duration: "45 - 75 minutes",
        priceRange: "$600 - $1,200",
        isActive: true,
        sortOrder: 31,
      },
      {
        name: "LaseMD Ultra",
        slug: "lasemd-ultra",
        shortDescription:
          "Gentle thulium laser for skin resurfacing, pigmentation correction, and enhanced product absorption.",
        fullDescription:
          "LaseMD Ultra is a non-ablative fractional thulium laser that creates micro-channels in the skin to improve tone, texture, and pigmentation while enhancing the absorption of topical treatments. It's gentle enough for minimal downtime while delivering visible improvement in skin quality.",
        category: "Laser",
        duration: "30 - 45 minutes",
        priceRange: "$350 - $700",
        isActive: true,
        sortOrder: 32,
      },
      // ── Wellness & Regenerative ──
      {
        name: "IV Hydration",
        slug: "iv-hydration",
        shortDescription:
          "Replenish and revitalize with custom IV nutrient infusions including Myers' Cocktail.",
        fullDescription:
          "Our IV Hydration delivers a potent blend of vitamins, minerals, amino acids, and antioxidants directly into your bloodstream for maximum absorption and immediate effect. Options include the classic Myers' Cocktail and custom formulations tailored to your wellness goals. Each session is administered by a licensed nurse.",
        category: "Wellness",
        duration: "45 - 60 minutes",
        priceRange: "$175 - $350",
        isActive: true,
        sortOrder: 40,
      },
      {
        name: "IM/IV Push Boosters",
        slug: "im-iv-boosters",
        shortDescription:
          "Quick vitamin and nutrient booster injections for targeted wellness support.",
        fullDescription:
          "Our IM and IV push boosters deliver targeted nutrients — B12, glutathione, biotin, vitamin D, and more — in a quick 5-15 minute session. Perfect as a standalone pick-me-up or as an add-on to any treatment.",
        category: "Wellness",
        duration: "5 - 15 minutes",
        priceRange: "$25 - $100",
        isActive: true,
        sortOrder: 41,
      },
      {
        name: "EBOO Ozone Therapy",
        slug: "eboo-ozone-therapy",
        shortDescription:
          "Advanced extracorporeal blood oxygenation and ozonation therapy for systemic detoxification and regeneration.",
        fullDescription:
          "EBOO (Extracorporeal Blood Oxygenation and Ozonation) is an advanced form of ozone therapy that filters and oxygenates your blood outside the body before returning it. This modality supports immune function, reduces inflammation, and promotes cellular regeneration at a systemic level.",
        category: "Wellness",
        duration: "45 - 60 minutes",
        priceRange: "$500 - $900",
        isActive: true,
        sortOrder: 42,
      },
      {
        name: "Red Light Therapy (Full Body)",
        slug: "red-light-therapy-body",
        shortDescription:
          "Full-body red and near-infrared light therapy for recovery, inflammation reduction, and skin health.",
        fullDescription:
          "Full-body red light therapy uses specific wavelengths of red and near-infrared light to penetrate deep into tissues, stimulating mitochondrial function, reducing inflammation, and promoting cellular repair throughout the body. Benefits include improved skin health, faster recovery, and reduced joint pain.",
        category: "Wellness",
        duration: "20 - 30 minutes",
        priceRange: "$50 - $100",
        isActive: true,
        sortOrder: 43,
      },
      {
        name: "Peptide Therapy Consultation",
        slug: "peptide-therapy",
        shortDescription:
          "Personalized peptide protocols for anti-aging, recovery, and overall wellness optimization.",
        fullDescription:
          "Peptide therapy uses targeted amino acid sequences to signal specific biological processes — from collagen production and fat metabolism to immune regulation and tissue repair. Every protocol begins with a thorough consultation to identify the right peptides for your goals.",
        category: "Wellness",
        duration: "30 minutes (consultation)",
        priceRange: "$150 - $400/month",
        isActive: true,
        sortOrder: 44,
      },
      // ── Weight Management ──
      {
        name: "Medically Guided Weight Loss",
        slug: "weight-loss-consult",
        shortDescription:
          "Comprehensive initial consultation for medically supervised weight management.",
        fullDescription:
          "Our weight loss program begins with a thorough initial consultation including health history review, body composition analysis, and metabolic assessment. Your personalized plan may include GLP-1 medications, nutritional guidance, and ongoing medical monitoring. Programs are overseen by our licensed medical provider.",
        category: "Weight Management",
        duration: "60 minutes (initial)",
        priceRange: "$200 - $400",
        isActive: true,
        sortOrder: 50,
      },
      {
        name: "GLP-1 Program (Monthly)",
        slug: "glp1-program",
        shortDescription:
          "Monthly GLP-1 medication program (Semaglutide/Tirzepatide) with medical oversight and coaching.",
        fullDescription:
          "Our monthly GLP-1 program includes medication (Semaglutide or Tirzepatide), regular check-ins, dosage adjustments, and ongoing medical oversight. Each visit includes body composition tracking and personalized coaching to support your weight management journey.",
        category: "Weight Management",
        duration: "15 - 30 minutes (monthly visit)",
        priceRange: "$300 - $600/month",
        isActive: true,
        sortOrder: 51,
      },
      {
        name: "Body Composition Analysis + Coaching",
        slug: "body-composition",
        shortDescription:
          "Detailed body composition analysis with personalized coaching and goal setting.",
        fullDescription:
          "Our body composition analysis goes beyond the scale to measure lean mass, body fat percentage, visceral fat, and metabolic rate. Combined with personalized coaching, this service helps you understand your body and set realistic, measurable goals.",
        category: "Weight Management",
        duration: "30 minutes",
        priceRange: "$75 - $150",
        isActive: true,
        sortOrder: 52,
      },
    ];

    for (const service of services) {
      await ctx.db.insert("services", service);
    }

    // ────────────────────────────────────────────────────────────────────────
    // FAQS (from client's returned launch info doc)
    // ────────────────────────────────────────────────────────────────────────
    const faqs = [
      // About MADE
      {
        question: "What makes MADE different from other med spas?",
        answer:
          "MADE is a luxury regenerative aesthetics practice founded by a registered nurse and Family Nurse Practitioner. We don't just treat the surface \u2014 we assess your skin, anatomy, and long-term goals to build a personalized plan rooted in clinical expertise. Every recommendation is made with your overall facial balance and tissue health in mind, not just a single concern.",
        category: "About",
        sortOrder: 1,
        isActive: true,
      },
      {
        question: 'What does "regenerative aesthetics" mean?',
        answer:
          "Regenerative aesthetics focuses on restoring and stimulating your body's own collagen, elastin, and tissue health \u2014 not just adding volume or masking concerns. Our treatments include biostimulators like Sculptra and Radiesse, advanced laser therapy, RF microneedling, and IV and ozone therapies that support your skin from the inside out.",
        category: "About",
        sortOrder: 2,
        isActive: true,
      },
      {
        question: "Where are you located?",
        answer:
          "MADE Med Spa is located at 1311-A Dolley Madison Blvd, Suite 1B, McLean, Virginia \u2014 in the heart of the DMV's most discerning corridor.",
        category: "About",
        sortOrder: 3,
        isActive: true,
      },
      // Services & Treatments
      {
        question: "What services do you offer?",
        answer:
          "Our core services include neurotoxin and filler injectables, biostimulators (Sculptra, Radiesse), Aerolase Neo Elite laser treatments, Sylfirm X RF microneedling, red light therapy, EBOO ozone therapy, IV hydration, medical-grade facials, peptide protocols, and medically guided weight loss. Each service is selected and sequenced to complement your overall treatment plan.",
        category: "Services",
        sortOrder: 4,
        isActive: true,
      },
      {
        question: "Is the Aerolase Neo Elite safe for all skin tones?",
        answer:
          "Yes. The Aerolase Neo Elite is safe and effective for all Fitzpatrick skin types, including deeper skin tones that are often underserved by traditional laser platforms. It was one of the primary reasons we selected it as our featured laser \u2014 we believe everyone deserves access to advanced skin technology without compromise.",
        category: "Services",
        sortOrder: 5,
        isActive: true,
      },
      {
        question: "Do you offer weight loss treatment?",
        answer:
          "Yes. We offer medically guided weight loss as part of our comprehensive wellness and aesthetics approach. Programs are personalized and overseen by our licensed medical provider.",
        category: "Services",
        sortOrder: 6,
        isActive: true,
      },
      // Your Visit
      {
        question: "What should I expect at my first appointment?",
        answer:
          "Your first visit begins with a thorough facial assessment \u2014 we evaluate your anatomy, skin quality, and goals before making any recommendations. We believe the root cause of many unsatisfying med spa experiences is skipping this step. You'll leave with a clear, prioritized treatment plan tailored to you, not a menu of add-ons.",
        category: "Your Visit",
        sortOrder: 7,
        isActive: true,
      },
      {
        question: "How do I book a consultation?",
        answer:
          "You can book directly through our online scheduling system. We recommend starting with a consultation so we can build the right plan before any treatment begins. Spots are limited \u2014 we keep our practice intentionally boutique to ensure personalized attention at every visit.",
        category: "Your Visit",
        sortOrder: 8,
        isActive: true,
      },
      {
        question: "Do you offer memberships?",
        answer:
          "Yes. MADE offers tiered membership programs designed for clients who want consistent, results-driven care. Members receive priority booking, treatment credits, and exclusive perks. Details on our current tiers are available on our membership page.",
        category: "Your Visit",
        sortOrder: 9,
        isActive: true,
      },
      // Safety & Credentials
      {
        question: "Who will be performing my treatment?",
        answer:
          "All injectable and medical treatments are performed by licensed, highly trained medical professionals with advanced expertise in facial anatomy and aesthetic medicine.",
        category: "Safety",
        sortOrder: 10,
        isActive: true,
      },
      {
        question: "Is MADE a medical practice?",
        answer:
          "Yes. MADE Med Spa operates as a licensed medical aesthetics practice. All injectable and medical treatments are conducted under proper medical oversight and in compliance with Virginia regulatory requirements.",
        category: "Safety",
        sortOrder: 11,
        isActive: true,
      },
      {
        question: "Do you offer financing?",
        answer:
          "At this time, we do not offer financing options. However, we are actively working on bringing CareCredit\u00AE and Cherry\u00AE on board and expect to offer financing in the near future. Updates will be shared as soon as these options become available.",
        category: "Safety",
        sortOrder: 12,
        isActive: true,
      },
      {
        question: "Do you offer refunds?",
        answer:
          "All sales are final. We do not offer refunds for services, deposits, or products.",
        category: "Safety",
        sortOrder: 13,
        isActive: true,
      },
      {
        question: "How can I prepare for my appointment?",
        answer:
          "After booking, you'll receive instructions to complete your intake forms and opt in to appointment reminders. We recommend completing all forms prior to arrival to ensure a seamless experience.",
        category: "Safety",
        sortOrder: 14,
        isActive: true,
      },
      {
        question: "What is your cancellation and reschedule policy?",
        answer:
          "We require at least 48 hours' notice to cancel or reschedule an appointment. Appointments canceled or rescheduled within 48 hours will forfeit the deposit. Deposits are non-transferable and all sales are final.",
        category: "Booking",
        sortOrder: 15,
        isActive: true,
      },
      {
        question: "Is a deposit required to book?",
        answer:
          "Yes. A deposit is required to reserve your appointment time. This deposit is applied toward your treatment total at your visit and is non-refundable.",
        category: "Booking",
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
        title: "Where Confidence Is Made.",
        body: "MADE was built on a simple belief: confidence isn't something you buy, it's something you rediscover. As a nurse, I've always understood that how you feel about yourself affects everything. My mission is to create a space where you're not just treated, but truly seen \u2014 where your anatomy, your goals, and your long-term skin health are all considered before a single syringe is uncapped. This is medicine meets artistry. And it was made for you.",
        updatedAt: now,
      },
      {
        key: "about_story",
        title: "Our Story",
        body: "MADE Med Spa is McLean's destination for regenerative aesthetics \u2014 a boutique practice where every detail, from your initial assessment to your long-term treatment plan, is handled with the care and precision of a medical practice. We exist for clients who expect more than a quick fix and want results that actually last.",
        updatedAt: now,
      },
      {
        key: "about_mission",
        title: "Our Mission",
        body: "MADE was built on a simple belief: confidence isn't something you buy, it's something you rediscover. As a nurse, I've always understood that how you feel about yourself affects everything. My mission is to create a space where you're not just treated, but truly seen \u2014 where your anatomy, your goals, and your long-term skin health are all considered before a single syringe is uncapped.",
        updatedAt: now,
      },
      {
        key: "about_values",
        title: "What We Do",
        body: "At MADE, every service is selected with intention. We offer what works, nothing more, nothing less. Injectables & neurotoxin: Precision placement of neurotoxin and dermal fillers, guided by a thorough facial assessment and a deep understanding of anatomy. The goal is always balance, never overdone. Biostimulators: Sculptra and Radiesse treatments designed to rebuild your skin's collagen foundation from within. The results are gradual, natural, and made to last. Regenerative & skincare treatments: From advanced laser and RF microneedling to ozone therapy, IV hydration, peptides and medical-grade skin treatments, every modality we offer is chosen to restore your skin at a deeper level, not just the surface.",
        updatedAt: now,
      },
      {
        key: "home_tagline",
        title: "The Difference Is In What We Don't Do",
        body: "No rushed appointments. No one-size-fits-all recommendations. No 'while you're here' add-ons. Just careful, educated aesthetic care from a nurse injector who takes the time to get it right \u2014 and follows up afterward to make sure you are happy.",
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
        addressLine1: "1311-A Dolley Madison Blvd, Suite 1B",
        addressLine2: "McLean, VA 22101",
        phone: "",
        phoneHref: "",
        email: "info@mademedspa.com",
        emailHref: "mailto:info@mademedspa.com",
        hours: [
          { days: "Monday \u2013 Friday", hours: "10:00 AM \u2013 6:00 PM" },
          { days: "Saturday", hours: "10:00 AM \u2013 3:00 PM" },
          { days: "Sunday", hours: "Closed" },
        ],
        socials: [
          { label: "Instagram", href: "https://www.instagram.com/mademedspa" },
          { label: "TikTok", href: "https://www.tiktok.com/@mademedspa" },
        ],
      },
    });

    // ────────────────────────────────────────────────────────────────────────
    // PRIVACY POLICY (from client's returned doc)
    // ────────────────────────────────────────────────────────────────────────
    await ctx.db.insert("siteContent", {
      key: "privacy_policy",
      title: "Privacy Policy",
      body: `Information we collect
MADE Med Spa, LLC collects personal and health information necessary to provide safe, effective medical aesthetic care. This may include your name, contact details, date of birth, medical history, medications, allergies, treatment records, photographs, and payment information.

How we use your information
Your information is used to provide and coordinate your care, communicate appointment details, process payments, maintain accurate medical records, and comply with applicable Virginia and federal regulations. We do not sell, rent, or share your personal information with third parties for marketing purposes.

Medical records & HIPAA
As a medical aesthetics practice, MADE is committed to maintaining the confidentiality of your protected health information (PHI) in accordance with HIPAA. All records are stored securely within our HIPAA-compliant practice management system. You have the right to access, amend, and request copies of your medical records at any time.

Photography & before/after images
We photograph clients before and after treatments for documentation purposes as part of your medical record. Before/after images are never shared publicly without your explicit written consent.

Third-party services
We use trusted third-party platforms to operate our practice, including our EMR system (Pabau), payment processors, and scheduling tools. These partners are contractually required to protect your data and may not use it for purposes beyond supporting our services.

Medical oversight
Supervised by Linda A. Myers MD, LLC. All medical services at MADE Med Spa are provided within a physician-supervised framework in compliance with Virginia state regulations.

Contact for privacy requests
1311-A Dolley Madison Blvd, Suite 1B, McLean, VA 22101 \u00B7 info@mademedspa.com`,
      updatedAt: now,
    });

    // ────────────────────────────────────────────────────────────────────────
    // TERMS OF SERVICE (from client's returned doc)
    // ────────────────────────────────────────────────────────────────────────
    await ctx.db.insert("siteContent", {
      key: "terms_of_service",
      title: "Terms & Conditions",
      body: `Agreement to terms
By booking an appointment or receiving services at MADE Med Spa, LLC, you agree to the following terms and conditions.

Medical nature of services
The services provided at MADE are medical aesthetic treatments performed by or under the supervision of licensed medical professionals, including Karlyne Bassam, RN, and overseen by Linda A. Myers MD, LLC. All treatments carry inherent medical risks, which will be disclosed during your consultation and informed consent process.

Informed consent
Prior to any treatment, you will be required to complete a thorough intake form and sign an informed consent document. No service will be rendered without signed consent.

Results & expectations
Aesthetic outcomes vary by individual. MADE does not guarantee specific results. Factors including skin type, lifestyle, adherence to aftercare, and individual biology influence treatment outcomes.

Payment & refunds
Payment is due at the time of service. Completed treatments are non-refundable. Membership fees, packages, and prepaid services are non-transferable and non-refundable unless otherwise specified in writing at the time of purchase.

Health disclosures
You are responsible for providing complete and accurate health history, including all medications, supplements, allergies, and medical conditions, prior to receiving treatment.

Minors
Clients under the age of 18 must have written parental or guardian consent prior to receiving any service. Certain treatments are not available to minors regardless of consent.

Governing law
These terms are governed by the laws of the Commonwealth of Virginia. Any disputes arising from your use of MADE's services shall be resolved in the courts of Fairfax County, Virginia.`,
      updatedAt: now,
    });

    // ────────────────────────────────────────────────────────────────────────
    // CANCELLATION POLICY (from client's returned doc)
    // ────────────────────────────────────────────────────────────────────────
    await ctx.db.insert("siteContent", {
      key: "cancellation_policy",
      title: "Booking & Cancellation Policy",
      body: `Effective date: April 1, 2025

At MADE Med Spa, your appointment time is reserved exclusively for you. We ask that you respect this commitment by providing adequate notice when plans change \u2014 this allows us to offer that time to another client in need of care.

48 hours notice is required for all cancellations and rescheduling requests. Cancellations made within 48 hours of the appointment time, as well as no-shows, will result in forfeit of the deposit. Deposits are non-refundable and non-transferable and may not be applied to future treatments under any circumstances.

No-shows
Clients who do not arrive for their scheduled appointment without prior notice will be charged a no-show fee of $100. Repeated no-shows may result in requiring a deposit to book future appointments or, at our discretion, a restriction from future scheduling.

Late arrivals
If you arrive more than 15 minutes late, we may need to modify or shorten your treatment to respect the time of subsequent clients. In some cases, the appointment may need to be rescheduled and the cancellation policy will apply.

Deposits
Certain treatments and new client appointments may require a deposit at the time of booking. Deposits are fully applied toward your service total and are non-refundable in the event of a late cancellation or no-show.

Exceptions
We understand that life happens. Fees may be waived at our discretion for documented emergencies or sudden illness. Please contact us as soon as possible so we can do our best to accommodate you.

To cancel or reschedule
Contact us by phone or through your client portal. Cancellation requests via social media or DM cannot be guaranteed to be received in time and are not considered valid notice.`,
      updatedAt: now,
    });

    // ────────────────────────────────────────────────────────────────────────
    // TEAM MEMBERS (solo at launch — just Karlyne)
    // ────────────────────────────────────────────────────────────────────────
    await ctx.db.insert("teamMembers", {
      name: "Karlyne Bassam BSN, RN",
      title: "Founder & Nurse Injector",
      bio: "MADE was built on a simple belief: confidence isn't something you buy, it's something you rediscover. As a nurse, I've always understood that how you feel about yourself affects everything. My mission is to create a space where you're not just treated, but truly seen \u2014 where your anatomy, your goals, and your long-term skin health are all considered before a single syringe is uncapped. This is medicine meets artistry. And it was made for you.",
      sortOrder: 1,
      isActive: true,
    });

    // ────────────────────────────────────────────────────────────────────────
    // TESTIMONIALS (14 from client — all as Verified Client)
    // ────────────────────────────────────────────────────────────────────────
    const testimonials = [
      {
        name: "Verified Client",
        quote: "I've been getting my Botox injections done by Karlyne for the past 6 months now, she is so nice to work with. Very professional, personable, and communicated with me throughout the appointment. My results always turn out amazing.",
        treatment: "Botox",
        sortOrder: 1,
        isActive: true,
      },
      {
        name: "Verified Client",
        quote: "I had the pleasure of getting my Botox done with Karlyne. She addressed all of my questions and concerns and did a great job. Results have been amazing.",
        treatment: "Botox",
        sortOrder: 2,
        isActive: true,
      },
      {
        name: "Verified Client",
        quote: "I received a warm greeting when I walked in. My service was provided by Nurse Karlyne. She was so pleasant! She explained everything, answered all my questions, and made me feel comfortable. Thank you!",
        treatment: "First Visit",
        sortOrder: 3,
        isActive: true,
      },
      {
        name: "Verified Client",
        quote: "Karlyne was my nurse for my Botox and fillers and I could not be happier with her services. She is so knowledgeable, honest, and makes you feel so comfortable. She takes her time and is patient with her work. I highly recommend seeing her!!!",
        treatment: "Botox & Fillers",
        sortOrder: 4,
        isActive: true,
      },
      {
        name: "Verified Client",
        quote: "Nurse Karlyne did an amazing job with my Botox. As a male I was very nervous to get Botox done because I wanted my results to be very natural. She explained everything in detail to me and gave me all of the best recommendations. I will be returning to see her at the end of the month for PRP injections under my eyes.",
        treatment: "Botox",
        sortOrder: 5,
        isActive: true,
      },
      {
        name: "Verified Client",
        quote: "I came in nervous and left feeling like I was in the best hands. Karlyne is incredibly knowledgeable \u2014 she explained everything clearly and never made me feel rushed or pressured into anything. She followed up after my appointment to make sure I was happy with my results. That kind of care is rare, and it's exactly why I won't go anywhere else.",
        treatment: "First Visit",
        sortOrder: 6,
        isActive: true,
      },
      {
        name: "Verified Client",
        quote: "I got lip filler for the first time with Nurse Karlyne and it was a great experience! She made my visit very comfortable and relaxed and took the time to explain everything. I am so happy with the results and would recommend Nurse Karlyne for your services!",
        treatment: "Lip Filler",
        sortOrder: 7,
        isActive: true,
      },
      {
        name: "Verified Client",
        quote: "I was nervous about filler. I'd seen too many overdone faces and didn't want that. She spent more time explaining what she wasn't going to do than what she was, which somehow made me trust her completely. The end result is so subtle my husband noticed I looked 'refreshed' but couldn't figure out why. That's exactly what I wanted.",
        treatment: "Dermal Filler",
        sortOrder: 8,
        isActive: true,
      },
      {
        name: "Verified Client",
        quote: "I've been getting toxins for years at other places and always left looking a little frozen or 'done.' My first appointment at MADE was completely different. The consultation alone was 20 minutes and she actually looked at how my face moves before touching a needle. The results are the most natural I've ever had. I look like myself, just more rested.",
        treatment: "Botox",
        sortOrder: 9,
        isActive: true,
      },
      {
        name: "Verified Client",
        quote: "I'd been curious about Sculptra for two years but couldn't find a provider I trusted enough to actually do it. The education I received before committing \u2014 anatomy, realistic timelines, real before-and-afters \u2014 was unlike anything I've experienced. Four months in and my cheekbones look like they did in my early thirties.",
        treatment: "Sculptra",
        sortOrder: 10,
        isActive: true,
      },
      {
        name: "Verified Client",
        quote: "I came in asking about skin laxity on my neck and jawline, something most places either wave off or just throw filler at. She recommended hyperdilute Radiesse and explained the collagen science in a way that actually made sense to me. Six weeks later my skin looks tighter and more luminous. I didn't expect results like this.",
        treatment: "Hyperdilute Radiesse",
        sortOrder: 11,
        isActive: true,
      },
      {
        name: "Verified Client",
        quote: "PRF was something I kept reading about but felt intimidated by. The warmth in this practice made it feel so approachable \u2014 she talked me through every step, checked in throughout, and followed up the next day. My skin tone has evened out beautifully over the past two months. I feel like I look like the best version of myself.",
        treatment: "PRF",
        sortOrder: 12,
        isActive: true,
      },
      {
        name: "Verified Client",
        quote: "From the moment I sat down, I felt completely at ease. Karlyne's knowledge is on another level \u2014 she walked me through everything in detail, answered every question I had, and made sure I fully understood what she was doing and why. I've never felt so comfortable and safe trusting someone with my face. Her professionalism is the real thing.",
        treatment: "Consultation & Care",
        sortOrder: 13,
        isActive: true,
      },
      {
        name: "Verified Client",
        quote: "What sets Karlyne apart isn't just her skill \u2014 it's how she makes you feel throughout the entire experience. She checked in after my visit to see how I was doing, and during my consultation she was completely transparent about what I needed and what I didn't. No upselling, no pressure. Just honest, thoughtful care. I finally found my injector.",
        treatment: "Patient Experience",
        sortOrder: 14,
        isActive: true,
      },
    ];

    for (const testimonial of testimonials) {
      await ctx.db.insert("testimonials", testimonial);
    }

    // ────────────────────────────────────────────────────────────────────────
    // MEMBERSHIPS (4 tiers from client — benefits are placeholders, isSeed=true)
    // ────────────────────────────────────────────────────────────────────────
    const memberships = [
      {
        name: "In The Making",
        price: 25,
        billingPeriod: "mo",
        tagline: "Your starting point for consistent care.",
        benefits: [
          "Priority booking access",
          "10% off all treatments",
          "Birthday month bonus",
        ],
        isFeatured: false,
        sortOrder: 1,
        isActive: true,
        isSeed: true,
      },
      {
        name: "Well Made",
        price: 50,
        billingPeriod: "mo",
        tagline: "For clients ready to invest in their routine.",
        benefits: [
          "Everything in In The Making",
          "15% off all treatments",
          "$50 monthly treatment credit",
          "Complimentary LED add-on",
        ],
        isFeatured: false,
        sortOrder: 2,
        isActive: true,
        isSeed: true,
      },
      {
        name: "Beautifully Made",
        price: 100,
        billingPeriod: "mo",
        tagline: "Our most popular tier for dedicated clients.",
        benefits: [
          "Everything in Well Made",
          "20% off all treatments",
          "$100 monthly treatment credit",
          "Complimentary HydraFacial quarterly",
          "Guest pass (1 per quarter)",
        ],
        isFeatured: true,
        sortOrder: 3,
        isActive: true,
        isSeed: true,
      },
      {
        name: "The Reserve",
        price: 200,
        billingPeriod: "mo",
        tagline: "The ultimate in personalized aesthetic care.",
        benefits: [
          "Everything in Beautifully Made",
          "25% off all treatments",
          "$200 monthly treatment credit",
          "Complimentary monthly facial",
          "Priority access to new services",
          "Exclusive member events",
        ],
        isFeatured: false,
        sortOrder: 4,
        isActive: true,
        isSeed: true,
      },
    ];

    for (const membership of memberships) {
      await ctx.db.insert("memberships", membership);
    }

    // ────────────────────────────────────────────────────────────────────────
    // SHOP PRODUCTS (sample products — isSeed=true, replace with real inventory)
    // ────────────────────────────────────────────────────────────────────────
    const shopProducts = [
      {
        name: "SkinCeuticals C E Ferulic",
        description: "The gold standard vitamin C serum. Provides advanced environmental protection and improves the appearance of fine lines, wrinkles, and loss of firmness while brightening skin's complexion.",
        price: 182,
        category: "Skincare",
        sortOrder: 1,
        isActive: true,
        isSeed: true,
      },
      {
        name: "EltaMD UV Clear SPF 46",
        description: "Lightweight, oil-free broad-spectrum sunscreen formulated for sensitive and acne-prone skin. Contains niacinamide to calm and protect. A daily essential for post-treatment care.",
        price: 41,
        category: "Skincare",
        sortOrder: 2,
        isActive: true,
        isSeed: true,
      },
      {
        name: "SkinMedica TNS Advanced+ Serum",
        description: "Clinically proven to address fine lines, wrinkles, and skin tone in as little as 2 weeks. Features a blend of growth factors, peptides, and antioxidants for visible rejuvenation.",
        price: 295,
        category: "Skincare",
        sortOrder: 3,
        isActive: true,
        isSeed: true,
      },
      {
        name: "Alastin Restorative Skin Complex",
        description: "Supports the skin's natural ability to produce new collagen and elastin. Ideal for post-procedure recovery and ongoing anti-aging maintenance. Fragrance-free and gentle.",
        price: 195,
        category: "Skincare",
        sortOrder: 4,
        isActive: true,
        isSeed: true,
      },
      {
        name: "MADE Gift Card",
        description: "Give the gift of confidence. Redeemable for any treatment or product at MADE Med Spa. Available in any amount. Never expires.",
        price: 100,
        category: "Gift Cards",
        sortOrder: 10,
        isActive: true,
        isSeed: true,
      },
      {
        name: "Post-Treatment Recovery Kit",
        description: "Everything you need for optimal healing after injectable treatments. Includes Arnica gel, gentle cleanser, hydrating mist, and SPF. Curated by Nurse Karlyne.",
        price: 85,
        category: "Bundles",
        sortOrder: 11,
        isActive: true,
        isSeed: true,
      },
    ];

    for (const product of shopProducts) {
      await ctx.db.insert("shopProducts", product);
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

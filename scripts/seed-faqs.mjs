import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const client = new ConvexHttpClient("https://energized-akita-520.convex.cloud");

const faqs = [
  {
    question: "How do consultations work at MADE?",
    answer: "Every treatment begins with a thorough consultation, typically 20 to 30 minutes. Nurse Karlyne will assess your facial anatomy, discuss your goals, and explain what she recommends as well as what she does not recommend. We believe in full transparency and education so you can make an informed decision with zero pressure.",
    category: "General",
    sortOrder: 2,
  },
  {
    question: "Is MADE welcoming to male clients?",
    answer: "Absolutely. We treat clients of all genders. Many of our male clients come in for preventative Botox, skin rejuvenation, and body contouring. Our approach focuses on natural, subtle results that enhance without changing who you are.",
    category: "General",
    sortOrder: 3,
  },
  {
    question: "What qualifications does your team have?",
    answer: "Nurse Karlyne is a board-certified Nurse Practitioner with extensive training in aesthetic medicine. She continuously advances her education in facial anatomy, injection techniques, and the latest treatment modalities to ensure you receive the highest standard of care.",
    category: "General",
    sortOrder: 4,
  },
  {
    question: "Do you follow up after treatments?",
    answer: "Yes. We follow up with every client after their appointment to check on your comfort, answer questions, and ensure you are happy with your results. This level of aftercare is part of what makes MADE different.",
    category: "General",
    sortOrder: 5,
  },
  {
    question: "Will my results look natural?",
    answer: "Natural results are at the core of our philosophy. We take the time to study how your face moves before recommending any treatment. Our goal is for you to look like the best, most refreshed version of yourself. Many of our clients say their friends and family notice they look great but cannot pinpoint what changed.",
    category: "Services",
    sortOrder: 6,
  },
  {
    question: "What areas can Botox treat?",
    answer: "Botox can address forehead lines, frown lines between the brows, crow's feet, bunny lines on the nose, and more. During your consultation, we will assess your facial movement and recommend precise placement for smooth, natural-looking results. Appointments typically take about 30 minutes.",
    category: "Services",
    sortOrder: 7,
  },
  {
    question: "What is the difference between Botox and dermal fillers?",
    answer: "Botox relaxes the muscles that cause dynamic wrinkles like frown lines and crow's feet. Dermal fillers restore lost volume and enhance contours in areas like the cheeks, lips, and jawline using hyaluronic acid. Many clients benefit from a combination of both, and we will help you determine the right approach during your consultation.",
    category: "Services",
    sortOrder: 8,
  },
  {
    question: "I am nervous about lip filler. Will it look overdone?",
    answer: "We understand the concern and take a conservative, artistry-first approach. Nurse Karlyne spends time explaining what she will and will not do before any product is placed. The goal is beautifully balanced, naturally fuller lips that complement your features. We always recommend starting subtle and building gradually.",
    category: "Services",
    sortOrder: 9,
  },
  {
    question: "What is Sculptra and how does it work?",
    answer: "Sculptra is a biostimulatory injectable that works by stimulating your body's own collagen production over time. Unlike traditional fillers that add volume immediately, Sculptra gradually restores facial volume and improves skin quality over several months. Results can last up to two years. We provide thorough education on anatomy, realistic timelines, and expected outcomes before beginning treatment.",
    category: "Services",
    sortOrder: 10,
  },
  {
    question: "What is PRF and what can it help with?",
    answer: "PRF (Platelet-Rich Fibrin) is a regenerative treatment that uses your own blood to promote collagen production and skin renewal. It can improve skin tone, texture, fine lines, and overall radiance. The treatment is minimally invasive and we walk you through every step to ensure your comfort throughout the process.",
    category: "Services",
    sortOrder: 11,
  },
  {
    question: "How do I book an appointment?",
    answer: "You can book online through our website, call the studio directly, or send us a message through our contact page. We recommend booking a consultation first if you are new to MADE or considering a treatment for the first time.",
    category: "Booking",
    sortOrder: 12,
  },
  {
    question: "What is your cancellation policy?",
    answer: "We kindly ask for at least 24 hours notice for cancellations or rescheduling. Late cancellations may incur a fee of up to 50% of the service cost, and no-shows will be charged the full service amount. We understand life happens, so please contact us as soon as possible if your plans change.",
    category: "Booking",
    sortOrder: 13,
  },
  {
    question: "How should I prepare for my appointment?",
    answer: "Arrive 10 to 15 minutes early to settle in. For injectable treatments, avoid blood-thinning medications and supplements like aspirin, fish oil, and vitamin E for 48 hours prior. Come with a clean face for facial treatments. Stay hydrated and avoid excessive sun exposure beforehand. Let us know about any allergies or medications when you book.",
    category: "Booking",
    sortOrder: 14,
  },
  {
    question: "What should I do after Botox or filler?",
    answer: "After injectables, avoid touching the treated area for at least 4 hours. Stay upright for the remainder of the day and avoid strenuous exercise for 24 hours. Mild swelling or bruising is normal and typically resolves within a few days. We provide detailed aftercare instructions at your appointment and follow up to check on your recovery.",
    category: "Aftercare",
    sortOrder: 15,
  },
  {
    question: "How long do results last?",
    answer: "Botox results typically last 3 to 4 months. Dermal fillers can last 6 to 18 months depending on the product and treatment area. Sculptra results can last up to two years. Skin treatments like chemical peels and microneedling benefit from a series of sessions for optimal, lasting results. We will discuss a personalized maintenance plan during your visit.",
    category: "Aftercare",
    sortOrder: 16,
  },
  {
    question: "What if I am not happy with my results?",
    answer: "Your satisfaction matters deeply to us. We schedule follow-up appointments to assess your results and make any adjustments if needed. For hyaluronic acid fillers, the product can be dissolved if necessary. Our transparent, education-first approach is designed to ensure your expectations are aligned with achievable outcomes before any treatment begins.",
    category: "Aftercare",
    sortOrder: 17,
  },
  {
    question: "Do you offer membership or loyalty programs?",
    answer: "We are currently developing membership options that will offer exclusive pricing, priority booking, and special perks for our returning clients. Contact us or follow us on social media to be the first to know when memberships launch.",
    category: "Membership",
    sortOrder: 18,
  },
  {
    question: "Do you offer financing or payment plans?",
    answer: "We accept all major credit cards and can discuss payment options for larger treatment plans. We believe quality aesthetic care should be accessible and are happy to work with you to find a plan that fits your budget.",
    category: "Membership",
    sortOrder: 19,
  },
];

async function main() {
  console.log(`Seeding ${faqs.length} FAQs...\n`);
  for (const faq of faqs) {
    await client.mutation(api.faqs.create, faq);
    console.log(`  [${faq.category.padEnd(10)}] ${faq.question.substring(0, 55)}`);
  }
  console.log(`\nDone. Created ${faqs.length} FAQs.`);
}

main().catch((e) => { console.error(e); process.exit(1); });

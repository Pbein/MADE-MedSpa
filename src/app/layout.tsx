import type { Metadata } from "next";
import { Playfair_Display, Jost, Montserrat } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";
import PublicShell from "@/components/layout/PublicShell";
import { getSiteSettings } from "@/lib/siteSettings";
import "./globals.css";

// Brand spec fonts (per MADE Branding spec sheet):
// - H1 / page titles & accents: Playfair Display (regular + italic)
// - H2 / H3 / labels / eyebrows: Jost (free Futura substitute)
// - Body: Montserrat
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { business, ogDefault } = await getSiteSettings();
  return {
  metadataBase: new URL("https://mademedspa.com"),
  title: {
    default: `${business.name} McLean, VA | Luxury Aesthetic Treatments`,
    template: `%s | ${business.name} McLean, VA`,
  },
  description:
    "Luxury aesthetic med spa in McLean, Virginia. MADE Med Spa offers Botox, dermal fillers, Sculptra, PRF, and advanced skin treatments with unhurried consultations and natural results.",
  keywords: [
    "med spa McLean VA",
    "med spa McLean Virginia",
    "medical spa Northern Virginia",
    "aesthetic treatments McLean",
    "Botox McLean VA",
    "dermal fillers McLean Virginia",
    "Sculptra Northern Virginia",
    "PRF McLean",
    "PRP McLean VA",
    "HydraFacial McLean",
    "nurse injector McLean VA",
    "aesthetic nurse Northern Virginia",
    "luxury med spa Virginia",
    "lip filler McLean VA",
    "Aerolase Neo Elite McLean",
    "Sylfirm X RF microneedling",
    "regenerative aesthetics McLean VA",
    "IV hydration McLean VA",
    "ozone therapy Northern Virginia",
    "weight loss med spa McLean",
    "GLP-1 semaglutide McLean VA",
    "med spa safe for dark skin tones",
    "med spa",
    "medical spa",
    "aesthetic treatments",
    "injectables",
    "Botox",
    "Dysport",
    "dermal fillers",
    "Sculptra",
    "Radiesse",
    "Kybella",
    "PRF",
    "PRP",
    "facials",
    "HydraFacial",
    "VI Peel",
    "microneedling",
    "RF microneedling",
    "laser skin rejuvenation",
    "MADE Med Spa",
    "nurse injector",
    "aesthetic nurse",
    "Karlyne Bassam",
  ],
  authors: [{ name: "MADE Med Spa" }],
  alternates: {
    canonical: "https://mademedspa.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: business.name,
    title: `${business.name} | Luxury Aesthetic Treatments in McLean, VA`,
    description:
      "Luxury aesthetic med spa in McLean, Virginia. Natural results from a nurse injector who takes the time to get it right.",
    images: [
      {
        url: ogDefault.url,
        width: 1200,
        height: 630,
        alt: `${business.name} - Luxury Aesthetic Treatments in McLean, Virginia`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${business.name} | Luxury Aesthetic Treatments in McLean, VA`,
    description:
      "Luxury aesthetic med spa in McLean, Virginia. Natural results from a nurse injector who takes the time to get it right.",
    images: [ogDefault.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { business, social, ogDefault } = await getSiteSettings();
  const absoluteOgUrl = ogDefault.url.startsWith("http")
    ? ogDefault.url
    : `https://mademedspa.com${ogDefault.url}`;
  const sameAs = [social.instagram, social.tiktok, social.facebook, social.youtube].filter(
    (u) => u && u.trim()
  );

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalBusiness",
              name: business.name,
              url: "https://mademedspa.com",
              description:
                "MADE Med Spa is McLean's destination for regenerative aesthetics. Personalized injectable, laser, and wellness treatments by a registered nurse. Safe for all skin tones.",
              image: absoluteOgUrl,
              priceRange: business.priceRange,
              telephone: business.phone || undefined,
              email: business.email,
              ...(sameAs.length > 0 ? { sameAs } : {}),
              address: {
                "@type": "PostalAddress",
                streetAddress: business.streetAddress,
                addressLocality: business.city,
                addressRegion: business.state,
                postalCode: business.postalCode,
                addressCountry: "US",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 38.9339,
                longitude: -77.1773,
              },
              areaServed: [
                { "@type": "City", name: "McLean, Virginia" },
                { "@type": "State", name: "Virginia" },
                "Northern Virginia",
                "Tysons Corner",
                "Great Falls",
                "Vienna",
                "Arlington",
                "Fairfax",
                "Washington DC Metro",
              ],
              medicalSpecialty: "Dermatology",
              founder: {
                "@type": "Person",
                name: "Karlyne Bassam, BSN, RN",
                jobTitle: "Founder & Nurse Injector",
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "10:00",
                  closes: "18:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Saturday",
                  opens: "10:00",
                  closes: "15:00",
                },
              ],
              availableService: [
                { "@type": "MedicalProcedure", name: "Botox / Dysport", procedureType: "https://health-lifesci.schema.org/CosmeticProcedure" },
                { "@type": "MedicalProcedure", name: "Dermal Fillers", procedureType: "https://health-lifesci.schema.org/CosmeticProcedure" },
                { "@type": "MedicalProcedure", name: "Lip Enhancement", procedureType: "https://health-lifesci.schema.org/CosmeticProcedure" },
                { "@type": "MedicalProcedure", name: "Sculptra", procedureType: "https://health-lifesci.schema.org/CosmeticProcedure" },
                { "@type": "MedicalProcedure", name: "Hyperdilute Radiesse", procedureType: "https://health-lifesci.schema.org/CosmeticProcedure" },
                { "@type": "MedicalProcedure", name: "Kybella", procedureType: "https://health-lifesci.schema.org/CosmeticProcedure" },
                { "@type": "MedicalProcedure", name: "PRP Injections", procedureType: "https://health-lifesci.schema.org/CosmeticProcedure" },
                { "@type": "MedicalProcedure", name: "HydraFacial MD", procedureType: "https://health-lifesci.schema.org/CosmeticProcedure" },
                { "@type": "MedicalProcedure", name: "Aerolase Neo Elite Laser", procedureType: "https://health-lifesci.schema.org/CosmeticProcedure" },
                { "@type": "MedicalProcedure", name: "Sylfirm X RF Microneedling", procedureType: "https://health-lifesci.schema.org/CosmeticProcedure" },
                { "@type": "MedicalProcedure", name: "IV Hydration Therapy", procedureType: "https://health-lifesci.schema.org/CosmeticProcedure" },
                { "@type": "MedicalProcedure", name: "EBOO Ozone Therapy", procedureType: "https://health-lifesci.schema.org/CosmeticProcedure" },
                { "@type": "MedicalProcedure", name: "Medically Guided Weight Loss", procedureType: "https://health-lifesci.schema.org/CosmeticProcedure" },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${playfair.variable} ${jost.variable} ${montserrat.variable} antialiased`}
      >
        <ClerkProvider>
          <ConvexClientProvider>
            <PublicShell>{children}</PublicShell>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import {
  Playfair_Display,
  Cormorant_Garamond,
  Inter,
} from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";
import PublicShell from "@/components/layout/PublicShell";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mademedspaaesthetics.com"),
  title: {
    default: "MADE Med Spa McLean, VA | Luxury Aesthetic Treatments",
    template: "%s | MADE Med Spa McLean, VA",
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
    "med spa",
    "medical spa",
    "aesthetic treatments",
    "injectables",
    "Botox",
    "dermal fillers",
    "Sculptra",
    "PRF",
    "PRP",
    "facials",
    "HydraFacial",
    "chemical peels",
    "skin care",
    "MADE Med Spa",
    "nurse injector",
    "aesthetic nurse",
  ],
  authors: [{ name: "MADE Med Spa Aesthetics & Wellness" }],
  alternates: {
    canonical: "https://mademedspaaesthetics.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MADE Med Spa",
    title: "MADE Med Spa | Luxury Aesthetic Treatments in McLean, VA",
    description:
      "Luxury aesthetic med spa in McLean, Virginia. Natural results from a nurse injector who takes the time to get it right.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MADE Med Spa - Luxury Aesthetic Treatments in McLean, Virginia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MADE Med Spa | Luxury Aesthetic Treatments in McLean, VA",
    description:
      "Luxury aesthetic med spa in McLean, Virginia. Natural results from a nurse injector who takes the time to get it right.",
    images: ["/og-image.jpg"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalBusiness",
              name: "MADE Med Spa",
              url: "https://mademedspaaesthetics.com",
              description:
                "Luxury aesthetic med spa in McLean, Virginia offering Botox, dermal fillers, Sculptra, PRF, and advanced skin treatments with unhurried consultations and natural results.",
              image: "https://mademedspaaesthetics.com/og-image.jpg",
              priceRange: "$$-$$$",
              telephone: "+1-555-123-4567",
              email: "hello@mademedspaaesthetics.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "McLean",
                addressRegion: "VA",
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
              ],
              medicalSpecialty: "Dermatology",
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "09:00",
                  closes: "19:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Saturday",
                  opens: "10:00",
                  closes: "17:00",
                },
              ],
              availableService: [
                {
                  "@type": "MedicalProcedure",
                  name: "Botox Cosmetic",
                  procedureType: "https://health-lifesci.schema.org/CosmeticProcedure",
                },
                {
                  "@type": "MedicalProcedure",
                  name: "Dermal Fillers",
                  procedureType: "https://health-lifesci.schema.org/CosmeticProcedure",
                },
                {
                  "@type": "MedicalProcedure",
                  name: "Sculptra",
                  procedureType: "https://health-lifesci.schema.org/CosmeticProcedure",
                },
                {
                  "@type": "MedicalProcedure",
                  name: "PRF Facial Rejuvenation",
                  procedureType: "https://health-lifesci.schema.org/CosmeticProcedure",
                },
                {
                  "@type": "MedicalProcedure",
                  name: "Hyperdilute Radiesse",
                  procedureType: "https://health-lifesci.schema.org/CosmeticProcedure",
                },
                {
                  "@type": "MedicalProcedure",
                  name: "PRP Under-Eye Treatment",
                  procedureType: "https://health-lifesci.schema.org/CosmeticProcedure",
                },
                {
                  "@type": "MedicalProcedure",
                  name: "Lip Enhancement",
                  procedureType: "https://health-lifesci.schema.org/CosmeticProcedure",
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${playfair.variable} ${cormorant.variable} ${inter.variable} antialiased`}
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

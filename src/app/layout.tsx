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
    default: "MADE Med Spa | Luxury Aesthetic Treatments",
    template: "%s | MADE Med Spa",
  },
  description:
    "Where science meets artistry. MADE Med Spa offers personalized aesthetic treatments crafted for your unique beauty.",
  keywords: [
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
    "luxury spa",
    "wellness",
    "beauty treatments",
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
    title: "MADE Med Spa | Luxury Aesthetic Treatments",
    description:
      "Where science meets artistry. Personalized aesthetic treatments crafted for your unique beauty.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MADE Med Spa - Luxury Aesthetic Treatments",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MADE Med Spa | Luxury Aesthetic Treatments",
    description:
      "Where science meets artistry. Personalized aesthetic treatments crafted for your unique beauty.",
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
                "Luxury aesthetic med spa offering Botox, dermal fillers, Sculptra, PRF, and advanced skin treatments with unhurried consultations and honest care.",
              image: "https://mademedspaaesthetics.com/og-image.jpg",
              priceRange: "$$",
              medicalSpecialty: "Dermatology",
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

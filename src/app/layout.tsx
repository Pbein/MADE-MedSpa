import type { Metadata } from "next";
import {
  Playfair_Display,
  Cormorant_Garamond,
  Inter,
} from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
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
    "facials",
    "HydraFacial",
    "chemical peels",
    "skin care",
    "luxury spa",
    "wellness",
    "beauty treatments",
    "MADE Med Spa",
  ],
  authors: [{ name: "MADE Med Spa Aesthetics & Wellness" }],
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
      <body
        className={`${playfair.variable} ${cormorant.variable} ${inter.variable} antialiased`}
      >
        <ClerkProvider>
          <ConvexClientProvider>
            <Navigation />
            {children}
            <Footer />
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Jost } from "next/font/google";
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

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "MADE Med Spa | Luxury Aesthetic Treatments",
  description:
    "Where science meets artistry. MADE Med Spa offers personalized aesthetic treatments crafted for your unique beauty.",
  keywords: [
    "med spa",
    "aesthetic treatments",
    "injectables",
    "facials",
    "skin care",
    "luxury spa",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${cormorant.variable} ${jost.variable} antialiased`}
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

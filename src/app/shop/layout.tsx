import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Medical-Grade Skincare",
  description:
    "Shop curated medical-grade skincare products personally selected by Nurse Karlyne at MADE Med Spa in McLean, VA.",
  alternates: { canonical: "https://mademedspa.com/shop" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

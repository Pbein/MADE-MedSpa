import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet Nurse Karlyne Bassam, founder of MADE Med Spa in McLean, Virginia. A boutique regenerative aesthetics practice focused on natural results and clinical expertise.",
  alternates: { canonical: "https://mademedspa.com/about" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

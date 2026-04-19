import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for MADE Med Spa in McLean, Virginia. How we collect, use, and protect your personal and health information.",
  alternates: { canonical: "https://mademedspa.com/privacy" },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for MADE Med Spa Aesthetics & Wellness in McLean, Virginia. How we collect, use, and protect your personal information.",
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

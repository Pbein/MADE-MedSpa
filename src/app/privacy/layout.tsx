import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "MADE Med Spa privacy policy.",
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

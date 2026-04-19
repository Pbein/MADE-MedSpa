import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for MADE Med Spa in McLean, Virginia. Guidelines governing appointments, payments, and services.",
  alternates: { canonical: "https://mademedspa.com/terms" },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

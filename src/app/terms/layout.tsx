import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for MADE Med Spa Aesthetics & Wellness in McLean, Virginia. Guidelines governing use of our website and services.",
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

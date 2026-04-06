import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "MADE Med Spa terms of service.",
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

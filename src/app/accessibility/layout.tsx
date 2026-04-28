import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "MADE Med Spa is committed to making its website accessible to people of all abilities. Read our accessibility statement, conformance target, and how to report issues.",
  alternates: { canonical: "https://mademedspa.com/accessibility" },
};

export default function AccessibilityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

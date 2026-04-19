import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to frequently asked questions about treatments, booking, memberships, cancellation policy, and what to expect at MADE Med Spa in McLean, VA.",
  alternates: { canonical: "https://mademedspa.com/faq" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

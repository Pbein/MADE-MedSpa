import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membership Plans",
  description:
    "Join a MADE Med Spa membership tier for priority booking, treatment credits, and exclusive discounts. Four tiers designed for every stage of your aesthetic journey.",
  alternates: { canonical: "https://mademedspa.com/membership" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

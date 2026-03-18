import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membership Plans",
  description:
    "Join the MADE Med Spa membership for exclusive discounts, monthly treatments, priority booking, and member-only perks.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

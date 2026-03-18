import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Find answers to common questions about treatments, booking, memberships, and aftercare at MADE Med Spa.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

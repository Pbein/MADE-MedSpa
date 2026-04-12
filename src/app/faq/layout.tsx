import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about aesthetic treatments, booking, aftercare, and what to expect at MADE Med Spa in McLean, Virginia.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

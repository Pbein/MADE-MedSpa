import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore our full menu of luxury aesthetic treatments — from injectables and facials to body contouring and skin rejuvenation.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

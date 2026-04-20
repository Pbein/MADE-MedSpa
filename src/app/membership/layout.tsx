import { getPageMetadata } from "@/lib/siteSettings";

export async function generateMetadata() {
  return getPageMetadata({
    pageKey: "membership",
    path: "/membership",
    defaultTitle: "Membership Plans",
    defaultDescription:
      "Join a MADE Med Spa membership tier for priority booking, treatment credits, and exclusive discounts. Four tiers designed for every stage of your aesthetic journey.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

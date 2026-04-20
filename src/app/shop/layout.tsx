import { getPageMetadata } from "@/lib/siteSettings";

export async function generateMetadata() {
  return getPageMetadata({
    pageKey: "shop",
    path: "/shop",
    defaultTitle: "Shop Medical-Grade Skincare",
    defaultDescription:
      "Shop curated medical-grade skincare products personally selected by Nurse Karlyne at MADE Med Spa in McLean, VA.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

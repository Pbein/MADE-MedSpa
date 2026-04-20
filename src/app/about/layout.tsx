import { getPageMetadata } from "@/lib/siteSettings";

export async function generateMetadata() {
  return getPageMetadata({
    pageKey: "about",
    path: "/about",
    defaultTitle: "About Us",
    defaultDescription:
      "Meet Nurse Karlyne Bassam, founder of MADE Med Spa in McLean, Virginia. A boutique regenerative aesthetics practice focused on natural results and clinical expertise.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

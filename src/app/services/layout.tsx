import { getPageMetadata } from "@/lib/siteSettings";

export async function generateMetadata() {
  return getPageMetadata({
    pageKey: "services",
    path: "/services",
    defaultTitle: "Aesthetic Services in McLean, VA",
    defaultDescription:
      "Explore MADE Med Spa's full service menu: Botox, fillers, Sculptra, Aerolase laser, Sylfirm X RF microneedling, IV therapy, and medically guided weight loss in McLean, VA.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

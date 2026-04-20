import { getPageMetadata } from "@/lib/siteSettings";

export async function generateMetadata() {
  return getPageMetadata({
    pageKey: "testimonials",
    path: "/testimonials",
    defaultTitle: "Client Testimonials",
    defaultDescription:
      "Read what our clients say about their experience at MADE Med Spa in McLean, VA. Real reviews from real clients — Botox, fillers, Sculptra, and more.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

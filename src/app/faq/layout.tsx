import { getPageMetadata } from "@/lib/siteSettings";

export async function generateMetadata() {
  return getPageMetadata({
    pageKey: "faq",
    path: "/faq",
    defaultTitle: "FAQ",
    defaultDescription:
      "Answers to frequently asked questions about treatments, booking, memberships, cancellation policy, and what to expect at MADE Med Spa in McLean, VA.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

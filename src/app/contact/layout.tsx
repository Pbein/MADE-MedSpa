import { getPageMetadata } from "@/lib/siteSettings";

export async function generateMetadata() {
  return getPageMetadata({
    pageKey: "contact",
    path: "/contact",
    defaultTitle: "Contact Us",
    defaultDescription:
      "Get in touch with MADE Med Spa at 1311-A Dolley Madison Blvd, McLean, VA 22101. Book a consultation or ask about our aesthetic treatments.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

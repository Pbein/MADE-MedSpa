import { getPageMetadata } from "@/lib/siteSettings";

export async function generateMetadata() {
  return getPageMetadata({
    pageKey: "booking",
    path: "/booking",
    defaultTitle: "Book an Appointment",
    defaultDescription:
      "Schedule your consultation or treatment at MADE Med Spa in McLean, VA. View preparation tips, cancellation policy, and what to expect at your first visit.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

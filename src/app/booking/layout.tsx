import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Schedule your consultation or treatment at MADE Med Spa in McLean, VA. View preparation tips, cancellation policy, and what to expect at your first visit.",
  alternates: {
    canonical: "https://mademedspa.com/booking",
  },
  openGraph: {
    title: "Book an Appointment | MADE Med Spa McLean, VA",
    description:
      "Schedule your consultation or treatment at MADE Med Spa. Personalized aesthetic care from a registered nurse in McLean, Virginia.",
    url: "https://mademedspa.com/booking",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

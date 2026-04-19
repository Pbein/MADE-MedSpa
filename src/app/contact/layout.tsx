import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with MADE Med Spa at 1311-A Dolley Madison Blvd, McLean, VA 22101. Book a consultation or ask about our aesthetic treatments.",
  alternates: { canonical: "https://mademedspa.com/contact" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

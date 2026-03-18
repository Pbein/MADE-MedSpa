import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with MADE Med Spa. Book a consultation, ask about our services, or visit us today.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

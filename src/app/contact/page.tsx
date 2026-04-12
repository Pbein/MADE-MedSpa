import { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with MADE Med Spa. Book a consultation, ask about our services, or visit us today.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}

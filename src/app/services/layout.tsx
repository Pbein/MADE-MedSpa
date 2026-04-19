import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aesthetic Services in McLean, VA",
  description:
    "Explore MADE Med Spa's full service menu: Botox, fillers, Sculptra, Aerolase laser, Sylfirm X RF microneedling, IV therapy, and medically guided weight loss in McLean, VA.",
  alternates: { canonical: "https://mademedspa.com/services" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

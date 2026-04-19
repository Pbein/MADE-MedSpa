import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Testimonials",
  description:
    "Read what our clients say about their experience at MADE Med Spa in McLean, VA. Real reviews from real clients — Botox, fillers, Sculptra, and more.",
  alternates: { canonical: "https://mademedspa.com/testimonials" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

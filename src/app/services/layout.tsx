import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aesthetic Services in McLean, VA",
  description:
    "Botox, dermal fillers, Sculptra, PRF, lip enhancement, and advanced skin treatments at MADE Med Spa in McLean, Virginia. Natural results from an experienced nurse injector.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet Nurse Karlyne and the team at MADE Med Spa in McLean, Virginia. Unhurried consultations, natural results, and honest aesthetic care in Northern Virginia.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

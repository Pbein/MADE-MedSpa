import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Schedule your aesthetic treatment at MADE Med Spa in McLean, VA. Easy online booking for Botox, fillers, Sculptra, PRF, and skin treatments in Northern Virginia.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Schedule your next aesthetic treatment at MADE Med Spa. Easy online booking with flexible appointment times.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

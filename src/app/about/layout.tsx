import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet the team behind MADE Med Spa. Our passion for beauty, wellness, and personalized care drives everything we do.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Skincare",
  description:
    "Professional-grade skincare and wellness products handpicked by our experts. Shop cleansers, serums, moisturizers, and more.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

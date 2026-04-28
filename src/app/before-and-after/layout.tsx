import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Before & After | MADE Med Spa",
  description:
    "Real transformations from real MADE Med Spa clients. See before-and-after photos for Botox, filler, skin treatments, and more — shared with explicit consent.",
  alternates: { canonical: "/before-and-after" },
};

export default function BeforeAfterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

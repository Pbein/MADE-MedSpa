import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact MADE Med Spa in McLean, Virginia. Call, email, or send a message to book a consultation or ask about our aesthetic treatments in Northern Virginia.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

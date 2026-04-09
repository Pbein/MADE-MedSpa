"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface BusinessInfoSocial {
  label: string;
  href: string;
}

interface BusinessInfo {
  addressLine1: string;
  addressLine2: string;
  phone: string;
  phoneHref: string;
  email: string;
  emailHref: string;
  hours: { days: string; hours: string }[];
  socials: BusinessInfoSocial[];
}

const DEFAULT_BUSINESS_INFO: BusinessInfo = {
  addressLine1: "123 Beauty Lane, Suite 100",
  addressLine2: "City, State 12345",
  phone: "(555) 123-4567",
  phoneHref: "tel:+15551234567",
  email: "hello@mademedpsa.com",
  emailHref: "mailto:hello@mademedpsa.com",
  hours: [
    { days: "Monday - Friday", hours: "9:00 AM - 7:00 PM" },
    { days: "Saturday", hours: "10:00 AM - 5:00 PM" },
    { days: "Sunday", hours: "Closed" },
  ],
  socials: [
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "TikTok", href: "#" },
  ],
};

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/faq", label: "FAQ" },
  { href: "/booking", label: "Booking" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const businessInfoEntry = useQuery(api.siteContent.getByKey, { key: "business_info" });
  const info = (businessInfoEntry?.metadata as unknown as BusinessInfo) || DEFAULT_BUSINESS_INFO;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const subscribe = useMutation(api.newsletter.subscribe);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;

    setStatus("loading");
    try {
      await subscribe({ email });
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <footer
      className="w-full flex flex-col items-center gap-12 px-6 md:px-12 py-16 md:py-24"
      style={{
        backgroundColor: "var(--color-surface-low)",
        borderTop: "1px solid rgba(212, 195, 194, 0.15)",
      }}
    >
      {/* Brand */}
      <Link
        href="/"
        className="font-headline italic text-lg transition-colors duration-500"
        style={{ color: "var(--color-primary)" }}
      >
        MADE
      </Link>

      {/* Navigation Links */}
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 md:gap-12">
        {footerLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="link-ghost"
            style={{ color: "var(--color-primary)" }}
          >
            {link.label}
          </Link>
        ))}
        {info.socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            className="link-ghost"
            style={{ color: "var(--color-primary)" }}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
          >
            {social.label}
          </a>
        ))}
      </div>

      {/* Newsletter */}
      <form
        onSubmit={handleNewsletterSubmit}
        className="flex items-end gap-4 w-full max-w-sm"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email for updates"
          aria-label="Email for newsletter"
          disabled={status === "loading"}
          className="input-editorial flex-1"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="link-ghost shrink-0 pb-3 cursor-pointer"
          style={{ color: "var(--color-primary)" }}
        >
          {status === "loading"
            ? "..."
            : status === "success"
              ? "Joined!"
              : "Subscribe"}
        </button>
      </form>
      {status === "success" && (
        <p
          className="label-micro"
          style={{ color: "var(--color-tertiary)", marginTop: "-2rem" }}
        >
          Welcome to the MADE family!
        </p>
      )}
      {status === "error" && (
        <p
          className="label-micro"
          style={{ color: "var(--color-secondary)", marginTop: "-2rem" }}
        >
          Something went wrong. Please try again.
        </p>
      )}

      {/* Address */}
      <p
        className="label-micro text-center"
        style={{ color: "var(--color-primary)", opacity: 0.4 }}
      >
        {info.addressLine1} &middot; {info.addressLine2} &middot;{" "}
        <a href={info.phoneHref}>{info.phone}</a>
      </p>

      {/* Copyright */}
      <p
        className="label-micro"
        style={{ color: "var(--color-primary)", opacity: 0.4 }}
      >
        &copy; {currentYear} MADE Med Spa. All rights reserved.
      </p>
    </footer>
  );
}

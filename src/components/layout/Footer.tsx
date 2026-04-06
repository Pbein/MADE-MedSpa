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

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/faq", label: "FAQ" },
  { href: "/booking", label: "Booking" },
  { href: "/contact", label: "Contact" },
];

const services = [
  { href: "/services#injectables", label: "Injectables" },
  { href: "/services#facials", label: "Facials" },
  { href: "/services#body", label: "Body Treatments" },
  { href: "/services#skin", label: "Skin Rejuvenation" },
  { href: "/services#laser", label: "Laser Treatments" },
  { href: "/services#wellness", label: "Wellness" },
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
    <footer style={{ backgroundColor: "var(--color-espresso)" }}>
      {/* Top accent line */}
      <div
        style={{
          height: "1px",
          background:
            "linear-gradient(to right, transparent, var(--color-matcha), transparent)",
        }}
      />

      {/* Main Footer Content */}
      <div
        className="mx-auto max-w-[var(--max-width)] px-6 lg:px-10"
        style={{
          paddingTop: "var(--space-section)",
          paddingBottom: "var(--space-4xl)",
        }}
      >
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="mb-5 inline-block text-3xl tracking-[0.2em]"
              style={{
                fontFamily: "var(--font-headline)",
                color: "var(--color-glaze)",
              }}
            >
              MADE
            </Link>
            <p
              className="mb-6 max-w-xs text-lg leading-relaxed"
              style={{
                fontFamily: "var(--font-accent)",
                color: "rgba(247, 246, 235, 0.7)",
              }}
            >
              Where science meets artistry. Personalized aesthetic treatments
              crafted for your unique beauty.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {info.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border text-xs transition-all"
                  style={{
                    borderColor: "rgba(247, 246, 235, 0.15)",
                    color: "rgba(247, 246, 235, 0.6)",
                    transitionDuration: "var(--duration-normal)",
                    transitionTimingFunction: "var(--ease-smooth)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(247, 246, 235, 0.4)";
                    (e.currentTarget as HTMLElement).style.color = "var(--color-glaze)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(247, 246, 235, 0.15)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(247, 246, 235, 0.6)";
                  }}
                >
                  {social.label[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4
              className="eyebrow mb-6"
              style={{ color: "var(--color-glaze)" }}
            >
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors"
                    style={{
                      color: "rgba(247, 246, 235, 0.6)",
                      transitionDuration: "var(--duration-fast)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "var(--color-glaze)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "rgba(247, 246, 235, 0.6)";
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h4
              className="eyebrow mb-6"
              style={{ color: "var(--color-glaze)" }}
            >
              Services
            </h4>
            <ul className="flex flex-col gap-3">
              {services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors"
                    style={{
                      color: "rgba(247, 246, 235, 0.6)",
                      transitionDuration: "var(--duration-fast)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "var(--color-glaze)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "rgba(247, 246, 235, 0.6)";
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter Column */}
          <div>
            <h4
              className="eyebrow mb-6"
              style={{ color: "var(--color-glaze)" }}
            >
              Contact
            </h4>
            <div
              className="mb-6 flex flex-col gap-2 text-sm"
              style={{ color: "rgba(247, 246, 235, 0.6)" }}
            >
              <p>{info.addressLine1}</p>
              <p>{info.addressLine2}</p>
              <a
                href={info.phoneHref}
                className="transition-colors"
                style={{ transitionDuration: "var(--duration-fast)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "var(--color-glaze)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "rgba(247, 246, 235, 0.6)";
                }}
              >
                {info.phone}
              </a>
              <a
                href={info.emailHref}
                className="transition-colors"
                style={{ transitionDuration: "var(--duration-fast)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "var(--color-glaze)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "rgba(247, 246, 235, 0.6)";
                }}
              >
                {info.email}
              </a>
            </div>

            {/* Newsletter */}
            <h4
              className="eyebrow mb-3"
              style={{ color: "var(--color-glaze)" }}
            >
              Newsletter
            </h4>
            <form className="flex gap-2" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                aria-label="Email for newsletter"
                disabled={status === "loading"}
                className="flex-1 border-b bg-transparent px-0 py-2 text-sm outline-none transition-colors placeholder:text-[rgba(247,246,235,0.35)] disabled:opacity-50"
                style={{
                  borderColor: "rgba(247, 246, 235, 0.2)",
                  color: "var(--color-glaze)",
                  transitionDuration: "var(--duration-normal)",
                }}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="eyebrow transition-colors disabled:opacity-50"
                style={{
                  color: "var(--color-glaze)",
                  transitionDuration: "var(--duration-fast)",
                }}
              >
                {status === "loading"
                  ? "..."
                  : status === "success"
                    ? "Joined!"
                    : "Join"}
              </button>
            </form>
            {status === "success" && (
              <p
                className="mt-2 text-xs"
                style={{ color: "var(--color-matcha)" }}
              >
                Welcome to the MADE family!
              </p>
            )}
            {status === "error" && (
              <p
                className="mt-2 text-xs"
                style={{ color: "rgba(247, 246, 235, 0.6)" }}
              >
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div style={{ borderTop: "1px solid rgba(247, 246, 235, 0.08)" }}>
        <div className="mx-auto flex max-w-[var(--max-width)] flex-col items-center justify-between gap-2 px-6 py-6 sm:flex-row lg:px-10">
          <p
            className="text-xs"
            style={{ color: "rgba(247, 246, 235, 0.5)" }}
          >
            &copy; {currentYear} MADE Med Spa. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-xs transition-colors"
              style={{
                color: "rgba(247, 246, 235, 0.5)",
                transitionDuration: "var(--duration-fast)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(247, 246, 235, 0.7)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(247, 246, 235, 0.5)";
              }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs transition-colors"
              style={{
                color: "rgba(247, 246, 235, 0.5)",
                transitionDuration: "var(--duration-fast)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(247, 246, 235, 0.7)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(247, 246, 235, 0.5)";
              }}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/shop", label: "Shop" },
  { href: "/membership", label: "Membership" },
  { href: "/faq", label: "FAQ" },
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
      style={{ backgroundColor: "var(--color-deep-cocoa)" }}
    >
      {/* Thin accent line */}
      <div
        style={{
          height: "1px",
          background: "linear-gradient(to right, transparent, var(--color-accent), transparent)",
        }}
      />

      {/* Main Footer Content */}
      <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-10"
        style={{ paddingTop: "var(--space-section)", paddingBottom: "var(--space-4xl)" }}
      >
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="headline-text mb-5 inline-block text-3xl tracking-[0.2em]"
              style={{
                fontFamily: "var(--font-headline)",
                color: "var(--color-soft-ivory)",
              }}
            >
              MADE
            </Link>
            <p
              className="accent-text mb-6 max-w-xs text-lg leading-relaxed"
              style={{ color: "var(--color-cream)" }}
            >
              Where science meets artistry. Personalized aesthetic treatments
              crafted for your unique beauty.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {["Instagram", "Facebook", "TikTok"].map((social) => (
                <a
                  key={social}
                  href="#"
                  aria-label={social}
                  className="flex h-10 w-10 items-center justify-center rounded-full border text-xs transition-all"
                  style={{
                    borderColor: "rgba(157, 138, 124, 0.3)",
                    color: "var(--color-cream)",
                    transitionDuration: "var(--duration-normal)",
                    transitionTimingFunction: "var(--ease-smooth)",
                  }}
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4
              className="editorial-spacing mb-6"
              style={{ color: "var(--color-soft-ivory)", fontSize: "var(--text-xs)" }}
            >
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-[var(--color-soft-ivory)]"
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--color-cream)",
                      transitionDuration: "var(--duration-fast)",
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
              className="editorial-spacing mb-6"
              style={{ color: "var(--color-soft-ivory)", fontSize: "var(--text-xs)" }}
            >
              Services
            </h4>
            <ul className="flex flex-col gap-3">
              {services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-[var(--color-soft-ivory)]"
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--color-cream)",
                      transitionDuration: "var(--duration-fast)",
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
              className="editorial-spacing mb-6"
              style={{ color: "var(--color-soft-ivory)", fontSize: "var(--text-xs)" }}
            >
              Contact
            </h4>
            <div
              className="mb-6 flex flex-col gap-2"
              style={{ fontSize: "var(--text-sm)", color: "var(--color-cream)" }}
            >
              <p>123 Beauty Lane, Suite 100</p>
              <p>City, State 12345</p>
              <a
                href="tel:+15551234567"
                className="transition-colors hover:text-[var(--color-soft-ivory)]"
              >
                (555) 123-4567
              </a>
              <a
                href="mailto:hello@mademedpsa.com"
                className="transition-colors hover:text-[var(--color-soft-ivory)]"
              >
                hello@mademedpsa.com
              </a>
            </div>

            {/* Newsletter */}
            <h4
              className="editorial-spacing mb-3"
              style={{ color: "var(--color-soft-ivory)", fontSize: "var(--text-xs)" }}
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
                className="flex-1 border-b bg-transparent px-0 py-2 text-sm outline-none transition-colors disabled:opacity-50"
                style={{
                  borderColor: "rgba(157, 138, 124, 0.3)",
                  color: "var(--color-soft-ivory)",
                  transitionDuration: "var(--duration-normal)",
                }}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="editorial-spacing transition-colors disabled:opacity-50"
                style={{
                  color: "var(--color-soft-ivory)",
                  fontSize: "var(--text-xs)",
                  transitionDuration: "var(--duration-fast)",
                }}
              >
                {status === "loading" ? "..." : status === "success" ? "Joined!" : "Join"}
              </button>
            </form>
            {status === "success" && (
              <p className="mt-2 text-xs" style={{ color: "var(--color-accent-light)" }}>
                Welcome to the MADE family!
              </p>
            )}
            {status === "error" && (
              <p className="mt-2 text-xs" style={{ color: "var(--color-cream)" }}>
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div style={{ borderTop: "1px solid rgba(157, 138, 124, 0.15)" }}>
        <div className="mx-auto flex max-w-[var(--max-width)] flex-col items-center justify-between gap-2 px-6 py-6 sm:flex-row lg:px-10">
          <p
            style={{ fontSize: "var(--text-xs)", color: "var(--color-cream)" }}
          >
            &copy; {currentYear} MADE Med Spa. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="transition-colors hover:text-[var(--color-soft-ivory)]"
              style={{ fontSize: "var(--text-xs)", color: "var(--color-cream)" }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-[var(--color-soft-ivory)]"
              style={{ fontSize: "var(--text-xs)", color: "var(--color-cream)" }}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

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
      className="text-[var(--color-stone)]"
      style={{ backgroundColor: "var(--color-chocolate)" }}
    >
      {/* Main Footer Content */}
      <div className="mx-auto max-w-[var(--max-width)] px-6 py-[var(--space-section)] lg:px-10">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="headline-text mb-5 inline-block text-3xl tracking-[0.15em] text-[var(--color-ivory)]"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              MADE
            </Link>
            <p
              className="accent-text mb-6 max-w-xs text-lg leading-relaxed text-[var(--color-stone)]"
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
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-stone-dark)]/30 text-xs text-[var(--color-stone)] transition-all hover:border-[var(--color-burgundy)] hover:text-[var(--color-ivory)]"
                  style={{
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
              className="editorial-spacing mb-6 text-[var(--color-ivory)]"
              style={{ fontSize: "var(--text-xs)" }}
            >
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--color-stone)] transition-colors hover:text-[var(--color-ivory)]"
                    style={{
                      fontSize: "var(--text-sm)",
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
              className="editorial-spacing mb-6 text-[var(--color-ivory)]"
              style={{ fontSize: "var(--text-xs)" }}
            >
              Services
            </h4>
            <ul className="flex flex-col gap-3">
              {services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--color-stone)] transition-colors hover:text-[var(--color-ivory)]"
                    style={{
                      fontSize: "var(--text-sm)",
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
              className="editorial-spacing mb-6 text-[var(--color-ivory)]"
              style={{ fontSize: "var(--text-xs)" }}
            >
              Contact
            </h4>
            <div
              className="mb-6 flex flex-col gap-2 text-[var(--color-stone)]"
              style={{ fontSize: "var(--text-sm)" }}
            >
              <p>123 Beauty Lane, Suite 100</p>
              <p>City, State 12345</p>
              <a
                href="tel:+15551234567"
                className="transition-colors hover:text-[var(--color-ivory)]"
              >
                (555) 123-4567
              </a>
              <a
                href="mailto:hello@mademedpsa.com"
                className="transition-colors hover:text-[var(--color-ivory)]"
              >
                hello@mademedpsa.com
              </a>
            </div>

            {/* Newsletter */}
            <h4
              className="editorial-spacing mb-3 text-[var(--color-ivory)]"
              style={{ fontSize: "var(--text-xs)" }}
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
                className="flex-1 border-b border-[var(--color-stone-dark)]/30 bg-transparent px-0 py-2 text-sm text-[var(--color-ivory)] placeholder:text-[var(--color-stone-dark)] outline-none transition-colors focus:border-[var(--color-burgundy)] disabled:opacity-50"
                style={{
                  transitionDuration: "var(--duration-normal)",
                }}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="editorial-spacing text-[var(--color-ivory)] transition-colors hover:text-[var(--color-burgundy-light)] disabled:opacity-50"
                style={{
                  fontSize: "var(--text-xs)",
                  transitionDuration: "var(--duration-fast)",
                }}
              >
                {status === "loading" ? "..." : status === "success" ? "Joined!" : "Join"}
              </button>
            </form>
            {status === "success" && (
              <p className="mt-2 text-xs text-[var(--color-burgundy-light)]">
                Welcome to the MADE family!
              </p>
            )}
            {status === "error" && (
              <p className="mt-2 text-xs text-[var(--color-stone-dark)]">
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[var(--color-stone-dark)]/15">
        <div className="mx-auto flex max-w-[var(--max-width)] flex-col items-center justify-between gap-2 px-6 py-6 sm:flex-row lg:px-10">
          <p
            className="text-[var(--color-stone-dark)]"
            style={{ fontSize: "var(--text-xs)" }}
          >
            &copy; {currentYear} MADE Med Spa. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-[var(--color-stone-dark)] transition-colors hover:text-[var(--color-ivory)]"
              style={{ fontSize: "var(--text-xs)" }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-[var(--color-stone-dark)] transition-colors hover:text-[var(--color-ivory)]"
              style={{ fontSize: "var(--text-xs)" }}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

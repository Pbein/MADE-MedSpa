"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
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
  email: "hello@mademedspa.com",
  emailHref: "mailto:hello@mademedspa.com",
  hours: [
    { days: "Monday — Friday", hours: "9:00 AM – 7:00 PM" },
    { days: "Saturday", hours: "10:00 AM – 5:00 PM" },
    { days: "Sunday", hours: "Closed" },
  ],
  socials: [
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "TikTok", href: "#" },
  ],
};

const menuLinks = [
  { href: "/booking#pabau-iframe", label: "Book Now" },
  { href: "/services", label: "Services" },
  { href: "/membership", label: "Membership" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/before-and-after", label: "Before & After" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faq", label: "FAQs" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
  { href: "/accessibility", label: "Accessibility" },
];

const ESPRESSO = "#391e1e";
const SILK = "#f6f1ea";
const GLAZE = "#e8e0d5";

function SocialIcon({ label }: { label: string }) {
  const icons: Record<string, React.ReactNode> = {
    Instagram: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
    Facebook: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
        <path d="M13.5 21v-7.5h2.5l.5-3h-3v-2c0-.9.3-1.5 1.6-1.5H17V4.1C16.5 4 15.5 4 14.5 4 12.4 4 11 5.3 11 7.7v2.8H8v3h3V21h2.5z" />
      </svg>
    ),
    TikTok: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
        <path d="M19.5 8.5a5.5 5.5 0 01-3.5-1.3v7.6a5.5 5.5 0 11-5.5-5.5c.3 0 .6 0 .9.1v2.7a2.8 2.8 0 102 2.7V3h2.5a3.5 3.5 0 003.6 3.5v2z" />
      </svg>
    ),
    YouTube: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
        <path d="M21.6 8.2a2.5 2.5 0 00-1.8-1.8C18.2 6 12 6 12 6s-6.2 0-7.8.4A2.5 2.5 0 002.4 8.2 26 26 0 002 12a26 26 0 00.4 3.8 2.5 2.5 0 001.8 1.8C5.8 18 12 18 12 18s6.2 0 7.8-.4a2.5 2.5 0 001.8-1.8A26 26 0 0022 12a26 26 0 00-.4-3.8zM10 15V9l5 3-5 3z" />
      </svg>
    ),
  };
  return icons[label] ?? null;
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const businessInfoEntry = useQuery(api.siteContent.getByKey, { key: "business_info" });
  const info = (businessInfoEntry?.metadata as unknown as BusinessInfo) || DEFAULT_BUSINESS_INFO;
  const logoDoc = useQuery(api.siteContent.getByKey, { key: "site_logo" });
  const logoUrl = logoDoc?.imageUrl;
  const logoAlt = logoDoc?.title ?? "MADE Med Spa";

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <footer
      className="relative w-full overflow-hidden"
      style={{
        background: `linear-gradient(170deg, ${ESPRESSO} 0%, #2d1515 50%, #200a0a 100%)`,
        color: SILK,
      }}
    >
      <div className="w-full h-px" style={{ backgroundColor: GLAZE, opacity: 0.18 }} />

      {/* ─────────── Mobile (single column, collapsible menu) ─────────── */}
      <div className="md:hidden px-6 pt-12 pb-8">
        <Link href="/" aria-label={logoAlt} className="inline-block mb-6 transition-opacity duration-500 hover:opacity-80">
          <Image
            src={logoUrl ?? "/images/logo-white.svg"}
            alt={logoAlt}
            width={160}
            height={50}
            style={{ height: 44, width: "auto", objectFit: "contain" }}
          />
        </Link>

        <div className="space-y-2 mb-6 text-sm" style={{ opacity: 0.75 }}>
          <a href={info.phoneHref} className="block transition-opacity duration-300 hover:opacity-100">
            Phone: {info.phone}
          </a>
          <a href={info.emailHref} className="block break-all transition-opacity duration-300 hover:opacity-100">
            Email: {info.email}
          </a>
          <p style={{ opacity: 0.7 }}>
            {info.addressLine1}
            <br />
            {info.addressLine2}
          </p>
        </div>

        {/* Collapsible Menu */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="footer-menu"
          className="w-full flex items-center justify-between py-3 transition-opacity duration-300 hover:opacity-100"
          style={{
            color: SILK,
            opacity: 0.9,
            borderTop: `1px solid ${SILK}25`,
            borderBottom: menuOpen ? "none" : `1px solid ${SILK}25`,
            fontFamily: "var(--font-label)",
            fontSize: 13,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          <span>Menu</span>
          <span
            aria-hidden
            style={{
              transition: "transform 300ms ease",
              transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)",
              fontSize: 12,
            }}
          >
            ▾
          </span>
        </button>

        {menuOpen && (
          <ul
            id="footer-menu"
            className="py-3 space-y-3"
            style={{ borderBottom: `1px solid ${SILK}25` }}
          >
            {menuLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block text-sm transition-opacity duration-300 hover:opacity-100"
                  style={{ color: SILK, opacity: 0.7 }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Social icons */}
        <div className="flex items-center gap-5 mt-6" style={{ color: SILK, opacity: 0.65 }}>
          {info.socials.filter((s) => s.href && s.href !== "#").map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="transition-opacity duration-300 hover:opacity-100"
            >
              <SocialIcon label={social.label} />
            </a>
          ))}
        </div>

        {/* Bottom legal */}
        <div className="mt-8 pt-6 text-xs" style={{ borderTop: `1px solid ${SILK}15`, opacity: 0.4 }}>
          <p className="mb-2">&copy; {currentYear} MADE Med Spa</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-opacity duration-300 hover:opacity-100"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────── Desktop (3 columns: brand+contact | menu | social) ─────────── */}
      <div className="hidden md:block px-12 lg:px-16 pt-16 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-12 items-start">
            {/* Col 1: logo + contact + address */}
            <div className="col-span-5">
              <Link href="/" aria-label={logoAlt} className="inline-block mb-6 transition-opacity duration-500 hover:opacity-80">
                <Image
                  src={logoUrl ?? "/images/logo-white.svg"}
                  alt={logoAlt}
                  width={200}
                  height={60}
                  style={{ height: 56, width: "auto", objectFit: "contain" }}
                />
              </Link>
              <div className="space-y-2 text-sm" style={{ opacity: 0.7 }}>
                <a href={info.phoneHref} className="block transition-opacity duration-300 hover:opacity-100">
                  Phone: {info.phone}
                </a>
                <a href={info.emailHref} className="block transition-opacity duration-300 hover:opacity-100">
                  Email: {info.email}
                </a>
                <p style={{ opacity: 0.85 }}>
                  {info.addressLine1}
                  <br />
                  {info.addressLine2}
                </p>
              </div>
            </div>

            {/* Col 2: menu */}
            <div className="col-span-4">
              <p
                className="mb-5"
                style={{
                  fontFamily: "var(--font-label)",
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  color: GLAZE,
                  opacity: 0.85,
                }}
              >
                Menu
              </p>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
                {menuLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-opacity duration-300 hover:opacity-100"
                      style={{ color: SILK, opacity: 0.7 }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: social icons */}
            <div className="col-span-3 flex md:justify-end">
              <div className="flex items-center gap-5" style={{ color: SILK, opacity: 0.65 }}>
                {info.socials.filter((s) => s.href && s.href !== "#").map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="transition-opacity duration-300 hover:opacity-100"
                  >
                    <SocialIcon label={social.label} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom legal bar */}
          <div
            className="mt-12 pt-6 flex flex-row justify-between items-center text-xs"
            style={{ borderTop: `1px solid ${SILK}15`, opacity: 0.45 }}
          >
            <p>&copy; {currentYear} MADE Med Spa</p>
            <div className="flex gap-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-opacity duration-300 hover:opacity-100"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

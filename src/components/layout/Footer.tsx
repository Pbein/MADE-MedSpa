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

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/membership", label: "Membership" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/booking", label: "Booking" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

const ESPRESSO = "#391e1e";
const SILK = "#f7f6eb";
const GLAZE = "#d7cfc5";

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
      className="relative w-full overflow-hidden"
      style={{
        background: [
          "radial-gradient(ellipse 80% 60% at 15% 90%, rgba(215,207,197,0.08) 0%, transparent 55%)",
          "radial-gradient(ellipse 60% 50% at 85% 10%, rgba(162,60,64,0.04) 0%, transparent 50%)",
          `linear-gradient(170deg, ${ESPRESSO} 0%, #2d1515 50%, #200a0a 100%)`,
        ].join(", "),
      }}
    >
      {/* Top accent line — glaze */}
      <div className="w-full h-px" style={{ backgroundColor: GLAZE, opacity: 0.25 }} />

      <div className="px-6 md:px-12 pt-20 md:pt-28 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto">

          {/* ── Top: Brand wordmark + tagline ── */}
          <div className="mb-20 md:mb-24">
            <Link
              href="/"
              className="font-headline italic text-4xl md:text-5xl tracking-tight transition-opacity duration-500 hover:opacity-80"
              style={{ color: SILK }}
            >
              MADE
            </Link>
            <p
              className="body-editorial mt-4 max-w-sm"
              style={{ color: SILK, opacity: 0.45 }}
            >
              Thoughtful aesthetic care. Natural results, on purpose.
            </p>
          </div>

          {/* ── Middle: 4-column grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8 mb-16 md:mb-24">

            {/* Col 1: Navigation */}
            <div>
              <p
                className="label-micro mb-6"
                style={{ color: GLAZE }}
              >
                Navigate
              </p>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-headline italic text-lg transition-opacity duration-500 hover:opacity-100"
                      style={{ color: SILK, opacity: 0.7 }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 2: Contact */}
            <div>
              <p
                className="label-micro mb-6"
                style={{ color: GLAZE }}
              >
                Contact
              </p>
              <div className="space-y-4">
                <a
                  href={info.phoneHref}
                  className="font-headline italic text-lg block transition-opacity duration-500 hover:opacity-100"
                  style={{ color: SILK, opacity: 0.7 }}
                >
                  {info.phone}
                </a>
                <a
                  href={info.emailHref}
                  className="body-editorial text-sm block transition-opacity duration-500 hover:opacity-100 break-all"
                  style={{ color: SILK, opacity: 0.5 }}
                >
                  {info.email}
                </a>
                <p
                  className="body-editorial text-sm"
                  style={{ color: SILK, opacity: 0.4 }}
                >
                  {info.addressLine1}
                  <br />
                  {info.addressLine2}
                </p>
              </div>
            </div>

            {/* Col 3: Hours */}
            <div>
              <p
                className="label-micro mb-6"
                style={{ color: GLAZE }}
              >
                Hours
              </p>
              <ul className="space-y-3">
                {info.hours.map((schedule) => (
                  <li key={schedule.days}>
                    <span
                      className="body-editorial text-sm block"
                      style={{ color: SILK, opacity: 0.4 }}
                    >
                      {schedule.days}
                    </span>
                    <span
                      className="body-editorial text-sm"
                      style={{ color: SILK, opacity: 0.7 }}
                    >
                      {schedule.hours}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Newsletter + Socials */}
            <div>
              <p
                className="label-micro mb-6"
                style={{ color: GLAZE }}
              >
                Stay in the Know
              </p>
              <form
                onSubmit={handleNewsletterSubmit}
                className="mb-8"
              >
                <div className="flex items-end gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    aria-label="Email for newsletter"
                    disabled={status === "loading"}
                    className="flex-1 bg-transparent border-b py-2 text-sm outline-none transition-colors duration-500 placeholder:opacity-40"
                    style={{
                      borderColor: `${GLAZE}40`,
                      color: SILK,
                    }}
                    onFocus={(e) => (e.target.style.borderColor = GLAZE)}
                    onBlur={(e) => (e.target.style.borderColor = `${GLAZE}40`)}
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="label-micro shrink-0 pb-2 cursor-pointer transition-opacity duration-500 hover:opacity-100"
                    style={{ color: GLAZE, opacity: 0.8 }}
                  >
                    {status === "loading"
                      ? "..."
                      : status === "success"
                        ? "Joined"
                        : "Subscribe"}
                  </button>
                </div>
                {status === "success" && (
                  <p className="label-micro mt-3" style={{ color: GLAZE }}>
                    Welcome to the MADE family.
                  </p>
                )}
                {status === "error" && (
                  <p className="label-micro mt-3" style={{ color: "var(--color-secondary)" }}>
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>

              {/* Socials */}
              <div className="flex gap-6">
                {info.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="label-micro transition-all duration-500 hover:opacity-100"
                    style={{ color: SILK, opacity: 0.5 }}
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div
            className="pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4"
            style={{ borderColor: `${SILK}10` }}
          >
            <p
              className="label-micro"
              style={{ color: SILK, opacity: 0.25 }}
            >
              &copy; {currentYear} MADE Med Spa
            </p>
            <div className="flex gap-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="label-micro transition-opacity duration-500 hover:opacity-50"
                  style={{ color: SILK, opacity: 0.25 }}
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

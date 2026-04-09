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
    <footer>
      {/* Top accent line */}
      <div />

      {/* Main Footer Content */}
      <div>
        <div>
          {/* Brand Column */}
          <div>
            <Link href="/">
              MADE
            </Link>
            <p>
              Where science meets artistry. Personalized aesthetic treatments
              crafted for your unique beauty.
            </p>
            {/* Social Links */}
            <div>
              {info.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                >
                  {social.label[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4>Quick Links</h4>
            <ul>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h4>Services</h4>
            <ul>
              {services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter Column */}
          <div>
            <h4>Contact</h4>
            <div>
              <p>{info.addressLine1}</p>
              <p>{info.addressLine2}</p>
              <a href={info.phoneHref}>
                {info.phone}
              </a>
              <a href={info.emailHref}>
                {info.email}
              </a>
            </div>

            {/* Newsletter */}
            <h4>Newsletter</h4>
            <form onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                aria-label="Email for newsletter"
                disabled={status === "loading"}
              />
              <button
                type="submit"
                disabled={status === "loading"}
              >
                {status === "loading"
                  ? "..."
                  : status === "success"
                    ? "Joined!"
                    : "Join"}
              </button>
            </form>
            {status === "success" && (
              <p>Welcome to the MADE family!</p>
            )}
            {status === "error" && (
              <p>Something went wrong. Please try again.</p>
            )}
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div>
        <div>
          <p>
            &copy; {currentYear} MADE Med Spa. All rights reserved.
          </p>
          <div>
            <Link href="/privacy">
              Privacy Policy
            </Link>
            <Link href="/terms">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

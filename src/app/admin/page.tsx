"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function AdminDashboard() {
  const services = useQuery(api.services.list);
  const contacts = useQuery(api.contactSubmissions.list);
  const faqs = useQuery(api.faqs.list);
  const team = useQuery(api.teamMembers.list);
  const memberships = useQuery(api.memberships.listAll);
  const products = useQuery(api.shopProducts.listAll);
  const seedMemberships = useQuery(api.memberships.countSeed);
  const seedProducts = useQuery(api.shopProducts.countSeed);
  const newContacts = useQuery(api.contactSubmissions.countNew);

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsDesktop(e.matches);
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const totalSeed = (seedMemberships ?? 0) + (seedProducts ?? 0);

  return (
    <div>
      {/* Alerts */}
      {totalSeed > 0 && (
        <div style={{
          backgroundColor: "#FEF3C7",
          border: "1px solid #F59E0B",
          borderRadius: 8,
          padding: "14px 18px",
          marginBottom: 16,
          fontSize: 14,
          color: "#92400E",
          lineHeight: 1.5,
        }}>
          <strong>{totalSeed} item{totalSeed !== 1 ? "s" : ""} still ha{totalSeed !== 1 ? "ve" : "s"} placeholder data</strong> that should be reviewed before launch.
          {(seedMemberships ?? 0) > 0 && (
            <> <Link href="/admin/memberships" style={{ color: "#D97706", fontWeight: 500 }}>{seedMemberships} membership{seedMemberships !== 1 ? "s" : ""}</Link></>
          )}
          {(seedMemberships ?? 0) > 0 && (seedProducts ?? 0) > 0 && " and"}
          {(seedProducts ?? 0) > 0 && (
            <> <Link href="/admin/shop" style={{ color: "#D97706", fontWeight: 500 }}>{seedProducts} product{seedProducts !== 1 ? "s" : ""}</Link></>
          )}
          {" "}need real details. Editing an item clears this warning automatically.
        </div>
      )}

      {(newContacts ?? 0) > 0 && (
        <Link
          href="/admin/contacts"
          style={{
            display: "block",
            backgroundColor: "#EFF6FF",
            border: "1px solid #3B82F6",
            borderRadius: 8,
            padding: "14px 18px",
            marginBottom: 16,
            fontSize: 14,
            color: "#1E40AF",
            lineHeight: 1.5,
            textDecoration: "none",
          }}
        >
          <strong>You have {newContacts} new contact{newContacts !== 1 ? "s" : ""}</strong> waiting for your response. Click here to view them.
        </Link>
      )}

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isDesktop ? "repeat(4, 1fr)" : "repeat(2, 1fr)",
          gap: 14,
          marginBottom: 28,
        }}
      >
        {[
          { label: "Services", value: services?.length ?? "--", color: "#6366f1", href: "/admin/services" },
          { label: "Memberships", value: memberships?.length ?? "--", color: "#7c3aed", href: "/admin/memberships" },
          { label: "Products", value: products?.length ?? "--", color: "#0891b2", href: "/admin/shop" },
          { label: "Team", value: team?.length ?? "--", color: "#d97706", href: "/admin/team" },
          { label: "FAQs", value: faqs?.length ?? "--", color: "#059669", href: "/admin/faqs" },
          { label: "Testimonials", value: "--", color: "#ec4899", href: "/admin/testimonials" },
          { label: "Contacts", value: contacts?.length ?? "--", color: "#0ea5e9", href: "/admin/contacts" },
          { label: "New Leads", value: newContacts ?? "--", color: newContacts ? "#ef4444" : "#9ca3af", href: "/admin/contacts" },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            style={{
              backgroundColor: "#fff",
              borderRadius: 8,
              padding: "16px 16px",
              border: "1px solid #e5e7eb",
              textDecoration: "none",
              display: "block",
              transition: "border-color 0.15s ease",
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.1, marginBottom: 2, color: stat.color }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", letterSpacing: 0.5, textTransform: "uppercase" }}>
              {stat.label}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 12 }}>Quick Actions</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            { label: "Edit Homepage", href: "/admin/pages/home" },
            { label: "Edit About Page", href: "/admin/pages/about" },
            { label: "Manage Services", href: "/admin/services" },
            { label: "SEO Settings", href: "/admin/seo" },
            { label: "View Contacts", href: "/admin/contacts" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              style={{
                display: "inline-block",
                padding: "8px 16px",
                backgroundColor: "#6366f1",
                color: "#fff",
                borderRadius: 6,
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </section>

      {/* View Site */}
      <section>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 20px",
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 500,
            color: "#374151",
          }}
        >
          View Live Site &#8599;
        </a>
      </section>
    </div>
  );
}

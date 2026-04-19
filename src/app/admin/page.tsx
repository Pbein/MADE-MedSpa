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
  const seedMemberships = useQuery(api.memberships.countSeed);
  const seedProducts = useQuery(api.shopProducts.countSeed);

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsDesktop(e.matches);
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const stats = [
    { label: "Active Services", value: services ? services.length : "--", color: "#6366f1" },
    { label: "Contact Submissions", value: contacts ? contacts.length : "--", color: "#0891b2" },
    { label: "Active FAQs", value: faqs ? faqs.length : "--", color: "#059669" },
    { label: "Team Members", value: team ? team.length : "--", color: "#d97706" },
  ];

  const quickActions = [
    { label: "Manage Services", href: "/admin/services" },
    { label: "Edit Content", href: "/admin/content" },
    { label: "View Contacts", href: "/admin/contacts" },
  ];

  const totalSeed = (seedMemberships ?? 0) + (seedProducts ?? 0);

  return (
    <div>
      {totalSeed > 0 && (
        <div
          style={{
            backgroundColor: "#FEF3C7",
            border: "1px solid #F59E0B",
            borderRadius: 8,
            padding: "14px 18px",
            marginBottom: 20,
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>!</span>
          <div style={{ fontSize: 14, color: "#92400E", lineHeight: 1.5 }}>
            <strong>{totalSeed} item{totalSeed !== 1 ? "s" : ""} still ha{totalSeed !== 1 ? "ve" : "s"} placeholder data</strong> that should be reviewed before launch.
            {(seedMemberships ?? 0) > 0 && (
              <> <Link href="/admin/memberships" style={{ color: "#D97706", fontWeight: 500 }}>{seedMemberships} membership{seedMemberships !== 1 ? "s" : ""}</Link></>
            )}
            {(seedMemberships ?? 0) > 0 && (seedProducts ?? 0) > 0 && <> and</>}
            {(seedProducts ?? 0) > 0 && (
              <> <Link href="/admin/shop" style={{ color: "#D97706", fontWeight: 500 }}>{seedProducts} product{seedProducts !== 1 ? "s" : ""}</Link></>
            )}
            {" "} need to be edited with real details. Once you edit an item, this warning clears automatically.
          </div>
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isDesktop ? "repeat(4, 1fr)" : "repeat(2, 1fr)",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {stats.map((stat) => (
          <div key={stat.label} style={{
            backgroundColor: "#fff",
            borderRadius: 8,
            padding: "20px 18px",
            border: "1px solid #e5e7eb",
          }}>
            <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.1, marginBottom: 4, color: stat.color }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#6b7280", letterSpacing: 0.3, textTransform: "uppercase" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 14 }}>Quick Actions</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              style={{
                display: "inline-block",
                padding: "9px 20px",
                backgroundColor: "#6366f1",
                color: "#fff",
                borderRadius: 6,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

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

  return (
    <div>
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

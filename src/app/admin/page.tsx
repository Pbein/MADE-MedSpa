"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function AdminDashboard() {
  const products = useQuery(api.products.list);
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
    {
      label: "Total Products",
      value: products ? products.length : "--",
      color: "var(--color-burgundy)",
    },
    {
      label: "Total Orders",
      value: "--",
      color: "var(--color-chocolate)",
    },
    {
      label: "Active Members",
      value: "--",
      color: "var(--color-burgundy-dark)",
    },
    {
      label: "Contact Submissions",
      value: "--",
      color: "var(--color-chocolate)",
    },
  ];

  const quickActions = [
    { label: "Manage Products", href: "/admin/products" },
    { label: "View Orders", href: "/admin/orders" },
    { label: "Edit Content", href: "/admin/content" },
  ];

  return (
    <div>
      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isDesktop ? "repeat(4, 1fr)" : "repeat(2, 1fr)",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {stats.map((stat) => (
          <div key={stat.label} style={styles.statCard}>
            <div style={{ ...styles.statValue, color: stat.color }}>
              {stat.value}
            </div>
            <div style={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionsRow}>
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              style={styles.actionBtn}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Recent Activity</h2>
        <div style={styles.activityPlaceholder}>
          <p style={styles.activityText}>
            Activity feed will appear here once connected.
          </p>
        </div>
      </section>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  statCard: {
    backgroundColor: "var(--color-ivory)",
    borderRadius: 10,
    padding: "24px 20px",
    border: "1px solid var(--color-stone)",
  },
  statValue: {
    fontSize: 36,
    fontWeight: 700,
    lineHeight: 1.1,
    marginBottom: 6,
    fontFamily: "var(--font-jost), sans-serif",
  },
  statLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: "var(--color-chocolate)",
    letterSpacing: 0.5,
    textTransform: "uppercase" as const,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "var(--color-chocolate)",
    marginBottom: 14,
    fontFamily: "var(--font-jost), sans-serif",
  },
  actionsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
  },
  actionBtn: {
    display: "inline-block",
    padding: "10px 22px",
    backgroundColor: "var(--color-burgundy)",
    color: "#fff",
    borderRadius: 6,
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "var(--font-jost), sans-serif",
    letterSpacing: 0.3,
  },
  activityPlaceholder: {
    backgroundColor: "var(--color-ivory)",
    borderRadius: 10,
    padding: "32px 24px",
    border: "1px solid var(--color-stone)",
    textAlign: "center",
  },
  activityText: {
    color: "var(--color-stone-dark)",
    fontSize: 14,
    margin: 0,
  },
};

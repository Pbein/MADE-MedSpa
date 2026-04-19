"use client";

import Link from "next/link";
import { getAllPageDefinitions } from "@/lib/sectionDefinitions";

const pages = getAllPageDefinitions();

export default function PagesIndex() {
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#111827", margin: "0 0 0.25rem 0" }}>
        Edit Pages
      </h1>
      <p style={{ fontSize: "0.9375rem", color: "#6b7280", margin: "0 0 1.5rem 0" }}>
        Select a page to edit its sections — text, images, and layout.
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "0.75rem",
      }}>
        {pages.map((page) => (
          <Link
            key={page.key}
            href={`/admin/pages/${page.key}`}
            style={{
              display: "block",
              padding: "1.25rem",
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              textDecoration: "none",
              transition: "border-color 0.15s ease, box-shadow 0.15s ease",
            }}
          >
            <div style={{ fontSize: "1rem", fontWeight: 600, color: "#111827", marginBottom: 4 }}>
              {page.label}
            </div>
            <div style={{ fontSize: "0.8125rem", color: "#6b7280", lineHeight: 1.4 }}>
              {page.path !== "(global)" ? page.path : "Appears on every page"}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: 8 }}>
              {page.sections.length} section{page.sections.length !== 1 ? "s" : ""}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

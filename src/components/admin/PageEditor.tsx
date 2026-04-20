"use client";

import Link from "next/link";
import type { PageDefinition } from "@/lib/sectionDefinitions";
import SectionEditorCard from "./SectionEditorCard";

export default function PageEditor({ page }: { page: PageDefinition }) {
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
          <Link
            href="/admin"
            style={{ fontSize: "0.8125rem", color: "#6366f1", textDecoration: "none" }}
          >
            Dashboard
          </Link>
          <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>/</span>
          <span style={{ fontSize: "0.8125rem", color: "#6b7280" }}>{page.label}</span>
        </div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#111827", margin: "0 0 0.25rem 0" }}>
          {page.label}
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <p style={{ fontSize: "0.9375rem", color: "#6b7280", margin: 0, flex: 1 }}>
            {page.description}
          </p>
          {page.path !== "(global)" && (
            <a
              href={page.path}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "0.375rem 0.75rem",
                border: "1px solid #e5e7eb",
                borderRadius: "0.375rem",
                fontSize: "0.8125rem",
                color: "#374151",
                textDecoration: "none",
                whiteSpace: "nowrap",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              View Page &#8599;
            </a>
          )}
        </div>
      </div>

      {/* Section order indicator */}
      <div style={{
        fontSize: "0.75rem",
        fontWeight: 600,
        color: "#9ca3af",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: "0.75rem",
      }}>
        Sections (top to bottom on the page)
      </div>

      {/* Section Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {page.sections.map((section, index) => (
          <div key={section.key} style={{ position: "relative" }}>
            {/* Section number indicator */}
            <div style={{
              position: "absolute",
              left: -28,
              top: 14,
              width: 20,
              height: 20,
              borderRadius: "50%",
              backgroundColor: "#f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.625rem",
              fontWeight: 600,
              color: "#9ca3af",
            }}>
              {index + 1}
            </div>
            <SectionEditorCard section={section} pageKey={page.key} pagePath={page.path} />
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

type CategoryFilter = "all" | string;

export default function AdminServicesPage() {
  const services = useQuery(api.services.listAll);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  const categories = useMemo(() => {
    if (!services) return [];
    const cats = Array.from(new Set(services.map((s) => s.category)));
    return cats.sort();
  }, [services]);

  const filtered = useMemo(() => {
    if (!services) return [];
    let list = services;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q));
    }

    if (categoryFilter !== "all") {
      list = list.filter((s) => s.category === categoryFilter);
    }

    return list;
  }, [services, search, categoryFilter]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#3E2723", margin: 0 }}>Services</h1>
        <button
          style={{
            padding: "0.6rem 1.25rem",
            backgroundColor: "var(--color-burgundy)",
            color: "#fff",
            borderRadius: "0.5rem",
            border: "none",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
          onClick={() => alert("Add Service - coming soon")}
        >
          + Add Service
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search services by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          maxWidth: "24rem",
          padding: "0.6rem 1rem",
          border: "1px solid #d6d3d1",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          marginBottom: "1rem",
          boxSizing: "border-box",
        }}
      />

      {/* Category filter pills */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <button
          onClick={() => setCategoryFilter("all")}
          style={{
            padding: "0.4rem 1rem",
            borderRadius: "9999px",
            border: categoryFilter === "all" ? "2px solid var(--color-accent-text)" : "1px solid #d6d3d1",
            backgroundColor: categoryFilter === "all" ? "var(--color-burgundy)" : "#fff",
            color: categoryFilter === "all" ? "#fff" : "#57534e",
            fontSize: "0.8rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "9999px",
              border: categoryFilter === cat ? "2px solid var(--color-accent-text)" : "1px solid #d6d3d1",
              backgroundColor: categoryFilter === cat ? "var(--color-burgundy)" : "#fff",
              color: categoryFilter === cat ? "#fff" : "#57534e",
              fontSize: "0.8rem",
              fontWeight: 500,
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading */}
      {services === undefined && (
        <p style={{ color: "#78716c", textAlign: "center", padding: "3rem 0" }}>Loading services...</p>
      )}

      {/* Empty state */}
      {services !== undefined && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem 0", color: "#78716c" }}>
          <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>No services found.</p>
          <p style={{ fontSize: "0.875rem" }}>
            {search || categoryFilter !== "all"
              ? "Try adjusting your search or filters."
              : "Get started by adding your first service."}
          </p>
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#44403c", textAlign: "left" }}>
                <th style={{ padding: "0.75rem 1rem", color: "#fafaf9", fontWeight: 600 }}>Name</th>
                <th style={{ padding: "0.75rem 1rem", color: "#fafaf9", fontWeight: 600 }}>Category</th>
                <th style={{ padding: "0.75rem 1rem", color: "#fafaf9", fontWeight: 600 }}>Price Range</th>
                <th style={{ padding: "0.75rem 1rem", color: "#fafaf9", fontWeight: 600 }}>Duration</th>
                <th style={{ padding: "0.75rem 1rem", color: "#fafaf9", fontWeight: 600 }}>Status</th>
                <th style={{ padding: "0.75rem 1rem", color: "#fafaf9", fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((service, idx) => (
                <tr
                  key={service._id}
                  style={{
                    borderBottom: "1px solid #d6d3d1",
                    backgroundColor: idx % 2 === 0 ? "var(--color-ivory)" : "#fafaf9",
                  }}
                >
                  <td style={{ padding: "0.75rem 1rem", color: "#3E2723", fontWeight: 500 }}>{service.name}</td>
                  <td style={{ padding: "0.75rem 1rem", color: "#57534e", textTransform: "capitalize" }}>{service.category}</td>
                  <td style={{ padding: "0.75rem 1rem", color: "#57534e" }}>{service.priceRange || "---"}</td>
                  <td style={{ padding: "0.75rem 1rem", color: "#57534e" }}>{service.duration || "---"}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        padding: "0.125rem 0.5rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        backgroundColor: service.isActive ? "#dcfce7" : "#f3f4f6",
                        color: service.isActive ? "#166534" : "#6b7280",
                      }}
                    >
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <button
                        onClick={() => alert(`Edit service: ${service.name} - coming soon`)}
                        style={{
                          padding: "0.3rem 0.6rem",
                          border: "1px solid #d6d3d1",
                          borderRadius: "0.375rem",
                          backgroundColor: "transparent",
                          color: "var(--color-accent-text)",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => alert(`Toggle ${service.isActive ? "inactive" : "active"} - coming soon`)}
                        style={{
                          padding: "0.3rem 0.6rem",
                          border: "1px solid #d6d3d1",
                          borderRadius: "0.375rem",
                          backgroundColor: "transparent",
                          color: service.isActive ? "#b45309" : "#166534",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                        }}
                      >
                        {service.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

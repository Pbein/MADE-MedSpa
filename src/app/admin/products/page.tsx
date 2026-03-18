"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2);
}

type FilterMode = "all" | "active" | "inactive" | "lowstock";

export default function AdminProductsPage() {
  const products = useQuery(api.products.listAll);
  const updateProduct = useMutation(api.products.update);
  const removeProduct = useMutation(api.products.remove);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");

  const filtered = useMemo(() => {
    if (!products) return [];
    let list = products;

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    // Status filter
    switch (filter) {
      case "active":
        list = list.filter((p) => p.isActive);
        break;
      case "inactive":
        list = list.filter((p) => !p.isActive);
        break;
      case "lowstock":
        list = list.filter((p) => p.inventory < 10);
        break;
    }

    return list;
  }, [products, search, filter]);

  async function handleToggleActive(id: Id<"products">, currentActive: boolean) {
    await updateProduct({ id, isActive: !currentActive });
  }

  async function handleDelete(id: Id<"products">, name: string) {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This will deactivate the product.`)) {
      return;
    }
    await removeProduct({ id });
  }

  const filterPills: { label: string; value: FilterMode }[] = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "Low Stock", value: "lowstock" },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Products</h1>
        <Link
          href="/admin/products/new"
          style={{
            display: "inline-block",
            padding: "0.6rem 1.25rem",
            backgroundColor: "var(--color-burgundy)",
            color: "#fff",
            borderRadius: "0.5rem",
            textDecoration: "none",
            fontSize: "0.875rem",
            fontWeight: 600,
          }}
        >
          + Add Product
        </Link>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search products by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "0.6rem 1rem",
          border: "1px solid #d6d3d1",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          marginBottom: "1rem",
          boxSizing: "border-box",
        }}
      />

      {/* Filter pills */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {filterPills.map((pill) => (
          <button
            key={pill.value}
            onClick={() => setFilter(pill.value)}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "9999px",
              border: filter === pill.value ? "2px solid var(--color-accent-text)" : "1px solid #d6d3d1",
              backgroundColor: filter === pill.value ? "var(--color-burgundy)" : "#fff",
              color: filter === pill.value ? "#fff" : "#57534e",
              fontSize: "0.8rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {products === undefined && (
        <p style={{ color: "#78716c", textAlign: "center", padding: "3rem 0" }}>Loading products...</p>
      )}

      {/* Empty state */}
      {products !== undefined && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem 0", color: "#78716c" }}>
          <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>No products found.</p>
          <p style={{ fontSize: "0.875rem" }}>
            {search || filter !== "all"
              ? "Try adjusting your search or filters."
              : "Get started by adding your first product."}
          </p>
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #d6d3d1", textAlign: "left" }}>
                <th style={{ padding: "0.75rem 0.5rem", color: "#57534e", fontWeight: 600 }}>Name</th>
                <th style={{ padding: "0.75rem 0.5rem", color: "#57534e", fontWeight: 600 }}>Category</th>
                <th style={{ padding: "0.75rem 0.5rem", color: "#57534e", fontWeight: 600 }}>Price</th>
                <th style={{ padding: "0.75rem 0.5rem", color: "#57534e", fontWeight: 600 }}>Stock</th>
                <th style={{ padding: "0.75rem 0.5rem", color: "#57534e", fontWeight: 600 }}>Status</th>
                <th style={{ padding: "0.75rem 0.5rem", color: "#57534e", fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr
                  key={product._id}
                  style={{
                    borderBottom: "1px solid #e7e5e4",
                    backgroundColor: "var(--color-ivory)",
                  }}
                >
                  {/* Name */}
                  <td style={{ padding: "0.75rem 0.5rem" }}>
                    <Link
                      href={`/admin/products/${product._id}`}
                      style={{ color: "var(--color-accent-text)", textDecoration: "none", fontWeight: 500 }}
                    >
                      {product.name}
                    </Link>
                  </td>

                  {/* Category */}
                  <td style={{ padding: "0.75rem 0.5rem", color: "#57534e" }}>{product.category}</td>

                  {/* Price */}
                  <td style={{ padding: "0.75rem 0.5rem", color: "#1a1a1a" }}>${formatPrice(product.price)}</td>

                  {/* Stock */}
                  <td
                    style={{
                      padding: "0.75rem 0.5rem",
                      color: product.inventory < 10 ? "#dc2626" : "#1a1a1a",
                      fontWeight: product.inventory < 10 ? 600 : 400,
                    }}
                  >
                    {product.inventory}
                  </td>

                  {/* Status */}
                  <td style={{ padding: "0.75rem 0.5rem" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        backgroundColor: product.isActive ? "#dcfce7" : "#f3f4f6",
                        color: product.isActive ? "#166534" : "#6b7280",
                      }}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "0.75rem 0.5rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <Link
                        href={`/admin/products/${product._id}`}
                        style={{
                          padding: "0.3rem 0.6rem",
                          border: "1px solid #d6d3d1",
                          borderRadius: "0.375rem",
                          color: "#57534e",
                          textDecoration: "none",
                          fontSize: "0.8rem",
                        }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleToggleActive(product._id, product.isActive)}
                        style={{
                          padding: "0.3rem 0.6rem",
                          border: "1px solid #d6d3d1",
                          borderRadius: "0.375rem",
                          backgroundColor: "transparent",
                          color: product.isActive ? "#b45309" : "#166534",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                        }}
                      >
                        {product.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDelete(product._id, product.name)}
                        style={{
                          padding: "0.3rem 0.6rem",
                          border: "1px solid #fca5a5",
                          borderRadius: "0.375rem",
                          backgroundColor: "transparent",
                          color: "#dc2626",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                        }}
                      >
                        Delete
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

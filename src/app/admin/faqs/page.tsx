"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function AdminFaqsPage() {
  const faqs = useQuery(api.faqs.listAll);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = faqs
    ? ["all", ...new Set(faqs.map((f) => f.category || "General"))]
    : ["all"];

  const filtered = faqs
    ?.filter((f) => {
      const matchesSearch =
        !search ||
        f.question.toLowerCase().includes(search.toLowerCase()) ||
        f.answer.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || (f.category || "General") === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    ?? [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1
          className="text-2xl font-semibold"
          style={{ color: "var(--color-chocolate)" }}
        >
          FAQs{" "}
          <span
            className="text-base font-normal"
            style={{ color: "var(--color-stone-dark)" }}
          >
            ({filtered.length})
          </span>
        </h1>
        <button
          className="rounded-md px-4 py-2 text-sm text-white"
          style={{ backgroundColor: "var(--color-burgundy)" }}
        >
          Add FAQ
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search FAQs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm outline-none focus:border-[var(--color-burgundy)]"
          style={{
            borderColor: "var(--color-stone)",
            maxWidth: "300px",
            width: "100%",
          }}
        />
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className="rounded-full px-3 py-1 text-xs capitalize transition-colors"
              style={{
                backgroundColor:
                  categoryFilter === cat
                    ? "var(--color-burgundy)"
                    : "var(--color-ivory)",
                color:
                  categoryFilter === cat ? "white" : "var(--color-brown)",
                border: `1px solid ${categoryFilter === cat ? "var(--color-burgundy)" : "var(--color-stone)"}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {!faqs && (
        <div className="py-12 text-center" style={{ color: "var(--color-stone-dark)" }}>
          Loading...
        </div>
      )}

      {faqs && filtered.length === 0 && (
        <div className="py-12 text-center" style={{ color: "var(--color-stone-dark)" }}>
          No FAQs found.
        </div>
      )}

      {filtered.length > 0 && (
        <div className="overflow-hidden rounded-lg border" style={{ borderColor: "var(--color-stone)" }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "var(--color-stone)" }}>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-chocolate)" }}>
                  Question
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-chocolate)" }}>
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-chocolate)" }}>
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-chocolate)" }}>
                  Order
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-chocolate)" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((faq, i) => (
                <tr
                  key={faq._id}
                  style={{
                    backgroundColor: i % 2 === 0 ? "var(--color-ivory)" : "var(--color-cream)",
                    borderBottom: "1px solid var(--color-stone)",
                  }}
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium" style={{ color: "var(--color-chocolate)" }}>
                      {faq.question}
                    </p>
                    <p className="mt-1 text-xs line-clamp-1" style={{ color: "var(--color-stone-dark)" }}>
                      {faq.answer}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--color-brown)" }}>
                    {faq.category || "General"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex rounded-full px-2 py-0.5 text-xs"
                      style={{
                        backgroundColor: faq.isActive ? "#dcfce7" : "#f3f4f6",
                        color: faq.isActive ? "#166534" : "#6b7280",
                      }}
                    >
                      {faq.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--color-brown)" }}>
                    {faq.sortOrder}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      className="text-sm transition-colors hover:underline"
                      style={{ color: "var(--color-burgundy)" }}
                    >
                      Edit
                    </button>
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

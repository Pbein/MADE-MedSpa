"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function AdminContactsPage() {
  const submissions = useQuery(api.contactSubmissions.list);

  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!submissions) return [];
    if (!search.trim()) return submissions;

    const q = search.toLowerCase();
    return submissions.filter(
      (s) =>
        s.firstName.toLowerCase().includes(q) ||
        s.lastName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
    );
  }, [submissions, search]);

  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function truncate(text: string, maxLen: number) {
    if (text.length <= maxLen) return text;
    return text.slice(0, maxLen) + "...";
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#3E2723", margin: 0 }}>Contact Submissions</h1>
        <span style={{ fontSize: "0.875rem", color: "#78716c" }}>
          {submissions ? `${submissions.length} submissions` : "Loading..."}
        </span>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          maxWidth: "24rem",
          padding: "0.6rem 1rem",
          border: "1px solid #d6d3d1",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          marginBottom: "1.5rem",
          boxSizing: "border-box",
        }}
      />

      {/* Loading */}
      {submissions === undefined && (
        <p style={{ color: "#78716c", textAlign: "center", padding: "3rem 0" }}>Loading submissions...</p>
      )}

      {/* Empty state */}
      {submissions !== undefined && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem 0", color: "#78716c" }}>
          <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>No contact submissions found.</p>
          <p style={{ fontSize: "0.875rem" }}>
            {search ? "Try adjusting your search." : "No one has submitted a contact form yet."}
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
                <th style={{ padding: "0.75rem 1rem", color: "#fafaf9", fontWeight: 600 }}>Email</th>
                <th style={{ padding: "0.75rem 1rem", color: "#fafaf9", fontWeight: 600 }}>Phone</th>
                <th style={{ padding: "0.75rem 1rem", color: "#fafaf9", fontWeight: 600 }}>Date</th>
                <th style={{ padding: "0.75rem 1rem", color: "#fafaf9", fontWeight: 600 }}>Message</th>
                <th style={{ padding: "0.75rem 1rem", color: "#fafaf9", fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub, idx) => {
                const isExpanded = expandedId === sub._id;
                return (
                  <tr
                    key={sub._id}
                    onClick={() => setExpandedId(isExpanded ? null : sub._id)}
                    style={{
                      borderBottom: "1px solid #d6d3d1",
                      backgroundColor: idx % 2 === 0 ? "#FFFFF0" : "#fafaf9",
                      cursor: "pointer",
                    }}
                  >
                    <td style={{ padding: "0.75rem 1rem", color: "#3E2723", fontWeight: 500, verticalAlign: "top" }}>
                      {sub.firstName} {sub.lastName}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "#57534e", verticalAlign: "top" }}>{sub.email}</td>
                    <td style={{ padding: "0.75rem 1rem", color: "#57534e", verticalAlign: "top" }}>
                      {sub.phone || "---"}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "#57534e", verticalAlign: "top" }}>
                      {formatDate(sub.createdAt)}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "#57534e", verticalAlign: "top", maxWidth: "300px" }}>
                      {isExpanded ? (
                        <div>
                          <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{sub.message}</p>
                          <span style={{ fontSize: "0.75rem", color: "#a8a29e", marginTop: "0.25rem", display: "inline-block" }}>
                            Click row to collapse
                          </span>
                        </div>
                      ) : (
                        <span>{truncate(sub.message, 60)}</span>
                      )}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", verticalAlign: "top" }}>
                      <a
                        href={`mailto:${sub.email}?subject=Re: Your inquiry to MADE Med Spa`}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          padding: "0.3rem 0.6rem",
                          border: "1px solid #d6d3d1",
                          borderRadius: "0.375rem",
                          backgroundColor: "transparent",
                          color: "#722F37",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          textDecoration: "none",
                          display: "inline-block",
                        }}
                      >
                        Reply
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

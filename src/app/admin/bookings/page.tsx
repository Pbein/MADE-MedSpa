"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

type StatusTab = "all" | "confirmed" | "cancelled" | "completed" | "no_show" | "rescheduled";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  confirmed: { bg: "#dcfce7", text: "#166534" },
  cancelled: { bg: "#fee2e2", text: "#991b1b" },
  completed: { bg: "#dbeafe", text: "#1e40af" },
  rescheduled: { bg: "#fef3c7", text: "#92400e" },
  no_show: { bg: "#f3f4f6", text: "#6b7280" },
};

const STATUS_TABS: { label: string; value: StatusTab }[] = [
  { label: "All", value: "all" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Completed", value: "completed" },
  { label: "No-Show", value: "no_show" },
  { label: "Rescheduled", value: "rescheduled" },
];

export default function AdminBookingsPage() {
  const bookings = useQuery(api.bookings.list);
  const updateStatus = useMutation(api.bookings.updateStatus);

  const [statusFilter, setStatusFilter] = useState<StatusTab>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!bookings) return [];
    let list = bookings;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.guestName.toLowerCase().includes(q) ||
          b.guestEmail.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      list = list.filter((b) => b.status === statusFilter);
    }

    return list;
  }, [bookings, search, statusFilter]);

  async function handleUpdateStatus(id: Id<"bookings">, status: "completed" | "no_show" | "cancelled") {
    const labels: Record<string, string> = { completed: "Completed", no_show: "No-Show", cancelled: "Cancelled" };
    if (!window.confirm(`Mark this booking as ${labels[status]}?`)) return;
    await updateStatus({ id, status });
  }

  function formatDate(ts: number) {
    const d = new Date(ts);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function formatTime(ts: number) {
    const d = new Date(ts);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#3E2723", margin: 0 }}>Bookings</h1>
        <span style={{ fontSize: "0.875rem", color: "#78716c" }}>
          {bookings ? `${bookings.length} total bookings` : "Loading..."}
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
          marginBottom: "1rem",
          boxSizing: "border-box",
        }}
      />

      {/* Status tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "9999px",
              border: statusFilter === tab.value ? "2px solid #722F37" : "1px solid #d6d3d1",
              backgroundColor: statusFilter === tab.value ? "#722F37" : "#fff",
              color: statusFilter === tab.value ? "#fff" : "#57534e",
              fontSize: "0.8rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {bookings === undefined && (
        <p style={{ color: "#78716c", textAlign: "center", padding: "3rem 0" }}>Loading bookings...</p>
      )}

      {/* Empty state */}
      {bookings !== undefined && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem 0", color: "#78716c" }}>
          <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>No bookings found.</p>
          <p style={{ fontSize: "0.875rem" }}>
            {search || statusFilter !== "all"
              ? "Try adjusting your search or filters."
              : "No bookings have been made yet."}
          </p>
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#44403c", textAlign: "left" }}>
                <th style={{ padding: "0.75rem 1rem", color: "#fafaf9", fontWeight: 600 }}>Guest Name</th>
                <th style={{ padding: "0.75rem 1rem", color: "#fafaf9", fontWeight: 600 }}>Email</th>
                <th style={{ padding: "0.75rem 1rem", color: "#fafaf9", fontWeight: 600 }}>Service</th>
                <th style={{ padding: "0.75rem 1rem", color: "#fafaf9", fontWeight: 600 }}>Date / Time</th>
                <th style={{ padding: "0.75rem 1rem", color: "#fafaf9", fontWeight: 600 }}>Status</th>
                <th style={{ padding: "0.75rem 1rem", color: "#fafaf9", fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking, idx) => {
                const colors = STATUS_COLORS[booking.status] || STATUS_COLORS.confirmed;
                return (
                  <tr
                    key={booking._id}
                    style={{
                      borderBottom: "1px solid #d6d3d1",
                      backgroundColor: idx % 2 === 0 ? "#FFFFF0" : "#fafaf9",
                    }}
                  >
                    <td style={{ padding: "0.75rem 1rem", color: "#3E2723", fontWeight: 500 }}>
                      {booking.guestName}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "#57534e" }}>{booking.guestEmail}</td>
                    <td style={{ padding: "0.75rem 1rem", color: "#57534e" }}>
                      {booking.calEventTypeSlug || "---"}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "#57534e" }}>
                      <div>{formatDate(booking.startTime)}</div>
                      <div style={{ fontSize: "0.75rem", color: "#a8a29e" }}>{formatTime(booking.startTime)}</div>
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          padding: "0.125rem 0.5rem",
                          borderRadius: "9999px",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          backgroundColor: colors.bg,
                          color: colors.text,
                        }}
                      >
                        {booking.status.replace("_", " ")}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                        {booking.status === "confirmed" && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(booking._id, "completed")}
                              style={{
                                padding: "0.3rem 0.6rem",
                                border: "1px solid #d6d3d1",
                                borderRadius: "0.375rem",
                                backgroundColor: "transparent",
                                color: "#1e40af",
                                fontSize: "0.8rem",
                                cursor: "pointer",
                              }}
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(booking._id, "no_show")}
                              style={{
                                padding: "0.3rem 0.6rem",
                                border: "1px solid #d6d3d1",
                                borderRadius: "0.375rem",
                                backgroundColor: "transparent",
                                color: "#6b7280",
                                fontSize: "0.8rem",
                                cursor: "pointer",
                              }}
                            >
                              No-Show
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(booking._id, "cancelled")}
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
                              Cancel
                            </button>
                          </>
                        )}
                        {booking.status !== "confirmed" && (
                          <span style={{ fontSize: "0.8rem", color: "#a8a29e" }}>---</span>
                        )}
                      </div>
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

"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";

const STATUSES = ["received", "processed", "failed", "ignored"] as const;
type Status = (typeof STATUSES)[number];

const statusColors: Record<Status, { bg: string; fg: string }> = {
  received: { bg: "#e0f2fe", fg: "#0369a1" },
  processed: { bg: "#dcfce7", fg: "#166534" },
  failed: { bg: "#fee2e2", fg: "#991b1b" },
  ignored: { bg: "#f3f4f6", fg: "#4b5563" },
};

function formatDate(ms: number): string {
  return new Date(ms).toLocaleString();
}

export default function WebhookLogPage() {
  const [statusFilter, setStatusFilter] = useState<Status | "">("");
  const [entityFilter, setEntityFilter] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const events = useQuery(api.pabauWebhookEvents.list, {
    limit: 100,
    status: statusFilter || undefined,
    entityType: entityFilter || undefined,
  });
  const stats = useQuery(api.pabauWebhookEvents.stats);
  const requeue = useMutation(api.pabauWebhookEvents.requeue);

  async function handleRequeue(id: Id<"pabauWebhookEvents">) {
    if (!confirm("Re-queue this event for processing?")) return;
    try {
      await requeue({ id });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to requeue.");
    }
  }

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, margin: 0, color: "#111827" }}>
          Pabau Webhook Events
        </h2>
        <p style={{ color: "#6b7280", marginTop: 4, fontSize: 14 }}>
          Real-time log of incoming events from Pabau. Use this to debug sync issues.
        </p>
      </div>

      {stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Processed" value={stats.byStatus.processed} color="#166534" />
          <StatCard label="Failed" value={stats.byStatus.failed} color="#991b1b" />
          <StatCard label="Ignored" value={stats.byStatus.ignored} color="#4b5563" />
          <StatCard label="Pending" value={stats.byStatus.received} color="#0369a1" />
          <StatCard
            label="Last Received"
            value={stats.lastReceivedAt ? formatDate(stats.lastReceivedAt) : "—"}
            small
          />
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Status | "")}
          style={selectStyle}
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filter by entity (e.g. lead, client)"
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          style={{ ...selectStyle, minWidth: 240 }}
        />
      </div>

      {events === undefined && <p style={{ color: "#6b7280" }}>Loading…</p>}
      {events && events.length === 0 && (
        <div
          style={{
            padding: "40px 20px",
            textAlign: "center",
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            color: "#6b7280",
          }}
        >
          No webhook events yet. Once Pabau is configured to send to{" "}
          <code style={{ backgroundColor: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>
            /api/pabau/webhooks
          </code>
          , events will appear here.
        </div>
      )}

      {events && events.length > 0 && (
        <div style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <th style={th}>Received</th>
                <th style={th}>Entity</th>
                <th style={th}>Action</th>
                <th style={th}>Event ID</th>
                <th style={th}>Status</th>
                <th style={th}>Attempts</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => {
                const isOpen = expandedId === ev._id;
                const color = statusColors[ev.status];
                return (
                  <>
                    <tr
                      key={ev._id}
                      style={{ borderBottom: "1px solid #f3f4f6", cursor: "pointer" }}
                      onClick={() => setExpandedId(isOpen ? null : ev._id)}
                    >
                      <td style={td}>{formatDate(ev.receivedAt)}</td>
                      <td style={td}>
                        <code style={{ fontSize: 12 }}>{ev.entityType}</code>
                      </td>
                      <td style={td}>{ev.action}</td>
                      <td style={td}>
                        <code style={{ fontSize: 11, color: "#6b7280" }}>
                          {ev.eventId.length > 24 ? ev.eventId.slice(0, 24) + "…" : ev.eventId}
                        </code>
                      </td>
                      <td style={td}>
                        <span
                          style={{
                            backgroundColor: color.bg,
                            color: color.fg,
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: 10,
                            textTransform: "uppercase",
                            letterSpacing: 0.4,
                          }}
                        >
                          {ev.status}
                        </span>
                      </td>
                      <td style={td}>{ev.attempts}</td>
                      <td style={td}>
                        {(ev.status === "failed" || ev.status === "ignored") && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRequeue(ev._id);
                            }}
                            style={btnStyle}
                          >
                            Re-queue
                          </button>
                        )}
                      </td>
                    </tr>
                    {isOpen && (
                      <tr key={`${ev._id}-detail`}>
                        <td colSpan={7} style={{ padding: 16, backgroundColor: "#fafafa" }}>
                          {ev.errorMessage && (
                            <div style={{ marginBottom: 12, color: "#991b1b", fontSize: 13 }}>
                              <strong>Error:</strong> {ev.errorMessage}
                            </div>
                          )}
                          <details>
                            <summary style={{ cursor: "pointer", fontSize: 12, color: "#6b7280" }}>
                              Payload
                            </summary>
                            <pre
                              style={{
                                backgroundColor: "#fff",
                                border: "1px solid #e5e7eb",
                                borderRadius: 6,
                                padding: 12,
                                fontSize: 11,
                                overflow: "auto",
                                marginTop: 8,
                                maxHeight: 320,
                              }}
                            >
                              {JSON.stringify(ev.payload, null, 2)}
                            </pre>
                          </details>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color, small }: { label: string; value: number | string; color?: string; small?: boolean }) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: 14,
      }}
    >
      <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </div>
      <div
        style={{
          fontSize: small ? 13 : 22,
          fontWeight: 600,
          marginTop: 4,
          color: color ?? "#111827",
        }}
      >
        {value}
      </div>
    </div>
  );
}

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 14px",
  fontSize: 11,
  fontWeight: 600,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: 0.4,
};

const td: React.CSSProperties = {
  padding: "12px 14px",
  color: "#374151",
  verticalAlign: "top",
};

const selectStyle: React.CSSProperties = {
  padding: "8px 12px",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  backgroundColor: "#fff",
  fontSize: 13,
};

const btnStyle: React.CSSProperties = {
  padding: "4px 10px",
  fontSize: 12,
  border: "1px solid #d1d5db",
  borderRadius: 4,
  backgroundColor: "#fff",
  cursor: "pointer",
};

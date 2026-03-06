"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

type MemberStatus = "pending" | "active" | "past_due" | "cancelled" | "expired";
type StatusFilter = "all" | MemberStatus;
type TierFilter = "all" | string;

const STATUS_COLORS: Record<MemberStatus, { bg: string; text: string }> = {
  pending: { bg: "#e0f2fe", text: "#0c4a6e" },
  active: { bg: "#dcfce7", text: "#166534" },
  past_due: { bg: "#fef3c7", text: "#92400e" },
  cancelled: { bg: "#fee2e2", text: "#991b1b" },
  expired: { bg: "#f3f4f6", text: "#6b7280" },
};

function formatDate(epochMs: number | undefined): string {
  if (!epochMs) return "---";
  return new Date(epochMs).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminMembersPage() {
  const members = useQuery(api.members.listAll);
  const tiers = useQuery(api.membershipTiers.listAll);
  const users = useQuery(api.users.list);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");

  const isLoading = members === undefined || tiers === undefined || users === undefined;

  // Build lookup maps
  const tierMap = useMemo(() => {
    if (!tiers) return new Map<string, { name: string; bg: string; text: string }>();
    const colors = [
      { bg: "#fef9c3", text: "#854d0e" },
      { bg: "#e0e7ff", text: "#3730a3" },
      { bg: "#f3e8ff", text: "#6b21a8" },
      { bg: "#dbeafe", text: "#1e40af" },
      { bg: "#fce7f3", text: "#9d174d" },
    ];
    const map = new Map<string, { name: string; bg: string; text: string }>();
    tiers.forEach((tier, idx) => {
      const color = colors[idx % colors.length];
      map.set(tier._id, { name: tier.name, ...color });
    });
    return map;
  }, [tiers]);

  const userMap = useMemo(() => {
    if (!users) return new Map<string, { firstName: string; lastName: string; email: string }>();
    const map = new Map<string, { firstName: string; lastName: string; email: string }>();
    users.forEach((user) => {
      map.set(user._id, {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    });
    return map;
  }, [users]);

  // Enriched member list
  const enrichedMembers = useMemo(() => {
    if (!members) return [];
    return members.map((m) => {
      const user = userMap.get(m.userId);
      const tier = tierMap.get(m.tierId);
      return {
        ...m,
        name: user ? `${user.firstName} ${user.lastName}` : "Unknown",
        email: user?.email ?? "---",
        tierName: tier?.name ?? "Unknown",
        tierColor: tier ?? { bg: "#f3f4f6", text: "#6b7280" },
      };
    });
  }, [members, userMap, tierMap]);

  // Filter
  const filtered = useMemo(() => {
    let list = enrichedMembers;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      list = list.filter((m) => m.status === statusFilter);
    }

    if (tierFilter !== "all") {
      list = list.filter((m) => m.tierId === tierFilter);
    }

    return list;
  }, [enrichedMembers, search, statusFilter, tierFilter]);

  // Build tier pills dynamically
  const tierPills: { label: string; value: TierFilter }[] = useMemo(() => {
    const pills: { label: string; value: TierFilter }[] = [
      { label: "All Tiers", value: "all" },
    ];
    if (tiers) {
      tiers.forEach((tier) => {
        pills.push({ label: tier.name, value: tier._id });
      });
    }
    return pills;
  }, [tiers]);

  const statusPills: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Active", value: "active" },
    { label: "Past Due", value: "past_due" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Expired", value: "expired" },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--color-chocolate)", margin: 0 }}>Members</h1>
        <span style={{ fontSize: "0.8rem", color: "var(--color-stone)", fontStyle: "italic" }}>
          {isLoading ? "Loading..." : `${members?.length ?? 0} total members`}
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
          border: "1px solid var(--color-stone)",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          marginBottom: "1rem",
          boxSizing: "border-box",
        }}
      />

      {/* Status filter pills */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
        {statusPills.map((pill) => (
          <button
            key={pill.value}
            onClick={() => setStatusFilter(pill.value)}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "9999px",
              border: statusFilter === pill.value ? "2px solid var(--color-burgundy)" : "1px solid var(--color-stone)",
              backgroundColor: statusFilter === pill.value ? "var(--color-burgundy)" : "#fff",
              color: statusFilter === pill.value ? "#fff" : "var(--color-stone-dark)",
              fontSize: "0.8rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Tier filter pills */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {tierPills.map((pill) => (
          <button
            key={pill.value}
            onClick={() => setTierFilter(pill.value)}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "9999px",
              border: tierFilter === pill.value ? "2px solid var(--color-burgundy)" : "1px solid var(--color-stone)",
              backgroundColor: tierFilter === pill.value ? "var(--color-burgundy)" : "#fff",
              color: tierFilter === pill.value ? "#fff" : "var(--color-stone-dark)",
              fontSize: "0.8rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--color-brown)" }}>
          <p style={{ fontSize: "1.1rem" }}>Loading...</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--color-brown)" }}>
          <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>No members found.</p>
          <p style={{ fontSize: "0.875rem" }}>Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Table */}
      {!isLoading && filtered.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--color-stone-dark)", textAlign: "left" }}>
                <th style={{ padding: "0.75rem 1rem", color: "var(--color-ivory)", fontWeight: 600 }}>Name</th>
                <th style={{ padding: "0.75rem 1rem", color: "var(--color-ivory)", fontWeight: 600 }}>Email</th>
                <th style={{ padding: "0.75rem 1rem", color: "var(--color-ivory)", fontWeight: 600 }}>Tier</th>
                <th style={{ padding: "0.75rem 1rem", color: "var(--color-ivory)", fontWeight: 600 }}>Status</th>
                <th style={{ padding: "0.75rem 1rem", color: "var(--color-ivory)", fontWeight: 600 }}>Join Date</th>
                <th style={{ padding: "0.75rem 1rem", color: "var(--color-ivory)", fontWeight: 600 }}>Next Billing</th>
                <th style={{ padding: "0.75rem 1rem", color: "var(--color-ivory)", fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((member, idx) => {
                const statusColor = STATUS_COLORS[member.status as MemberStatus] ?? STATUS_COLORS.expired;
                return (
                  <tr
                    key={member._id}
                    style={{
                      borderBottom: "1px solid var(--color-stone)",
                      backgroundColor: idx % 2 === 0 ? "var(--color-ivory)" : "var(--color-cream)",
                    }}
                  >
                    <td style={{ padding: "0.75rem 1rem", color: "var(--color-chocolate)", fontWeight: 500 }}>{member.name}</td>
                    <td style={{ padding: "0.75rem 1rem", color: "var(--color-brown)" }}>{member.email}</td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          padding: "0.125rem 0.5rem",
                          borderRadius: "9999px",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          backgroundColor: member.tierColor.bg,
                          color: member.tierColor.text,
                        }}
                      >
                        {member.tierName}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          padding: "0.125rem 0.5rem",
                          borderRadius: "9999px",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          backgroundColor: statusColor.bg,
                          color: statusColor.text,
                        }}
                      >
                        {member.status.replace("_", " ")}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "var(--color-brown)" }}>{formatDate(member.createdAt)}</td>
                    <td style={{ padding: "0.75rem 1rem", color: "var(--color-brown)" }}>{formatDate(member.nextBillingDate)}</td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      {member.stripeSubscriptionId ? (
                        <a
                          href={`https://dashboard.stripe.com/subscriptions/${member.stripeSubscriptionId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: "0.3rem 0.6rem",
                            border: "1px solid var(--color-stone)",
                            borderRadius: "0.375rem",
                            backgroundColor: "transparent",
                            color: "var(--color-burgundy)",
                            fontSize: "0.8rem",
                            cursor: "pointer",
                            textDecoration: "none",
                          }}
                        >
                          View in Stripe
                        </a>
                      ) : (
                        <span style={{ fontSize: "0.8rem", color: "var(--color-stone)" }}>No subscription</span>
                      )}
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

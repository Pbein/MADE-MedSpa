"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { motion } from "framer-motion";
import Link from "next/link";

/* ── Framer Motion helpers ─────────────────────────── */
const ease = [0.16, 1, 0.3, 1] as const;

const revealUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ── Fallback data (shown when no membership exists) ─ */
const FALLBACK_TIER = {
  name: "No Active Membership",
  monthlyPrice: 0,
  benefits: [] as string[],
};

/* ── Status badge colors ───────────────────────────── */
function statusColor(status: string) {
  switch (status.toLowerCase()) {
    case "active":
    case "completed":
    case "delivered":
      return { bg: "#e8f5e9", color: "#2e7d32" };
    case "upcoming":
    case "confirmed":
      return { bg: "#e3f2fd", color: "#1565c0" };
    case "past_due":
    case "past due":
      return { bg: "#fff8e1", color: "#f57f17" };
    case "cancelled":
    case "expired":
    case "no_show":
      return { bg: "#fce4ec", color: "#c62828" };
    case "pending":
    case "rescheduled":
      return { bg: "#f3e5f5", color: "#7b1fa2" };
    default:
      return { bg: "#f5f5f5", color: "#616161" };
  }
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function displayStatus(status: string) {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ── Component ─────────────────────────────────────── */
export default function MemberDashboardPage() {
  const { user: clerkUser, isLoaded } = useUser();

  // Convex queries
  const convexUser = useQuery(
    api.users.getByAuthId,
    clerkUser?.id ? { authId: clerkUser.id } : "skip"
  );

  const member = useQuery(
    api.members.getByUserId,
    convexUser?._id ? { userId: convexUser._id } : "skip"
  );

  const allTiers = useQuery(api.membershipTiers.listAll);

  const bookings = useQuery(
    api.bookings.listByUserId,
    convexUser?._id ? { userId: convexUser._id } : "skip"
  );

  const orders = useQuery(
    api.orders.listByUser,
    convexUser?._id ? { userId: convexUser._id } : "skip"
  );

  // Derive tier from member record
  const tier =
    member && allTiers
      ? allTiers.find((t) => t._id === member.tierId)
      : undefined;

  const activeTier = tier || FALLBACK_TIER;
  const memberStatus = member?.status ?? "none";
  const hasMembership = !!member && !!tier;

  // Latest 4 bookings, latest 3 orders
  const recentBookings = bookings?.slice(0, 4) ?? [];
  const recentOrders = orders?.slice(0, 3) ?? [];

  if (!isLoaded || (clerkUser && convexUser === undefined)) {
    return (
      <div style={styles.loadingWrap}>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={styles.loadingText}
        >
          Loading your dashboard...
        </motion.div>
      </div>
    );
  }

  const firstName = clerkUser?.firstName || "Member";
  const email = clerkUser?.primaryEmailAddress?.emailAddress || "";
  const fullName = clerkUser?.fullName || firstName;
  const avatarUrl = clerkUser?.imageUrl;

  return (
    <main style={styles.page}>
      {/* ── Header ───────────────────────────────── */}
      <motion.section
        style={styles.header}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div style={styles.headerInner} variants={revealUp}>
          <div style={styles.headerLeft}>
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt={`${firstName}'s avatar`}
                style={styles.avatar}
              />
            )}
            <div>
              <h1 style={styles.welcomeHeading}>
                Welcome back, <span style={styles.accentName}>{firstName}</span>
              </h1>
              <p style={styles.welcomeSub}>
                Manage your membership, bookings, and orders
              </p>
            </div>
          </div>
          {hasMembership && (
            <div
              style={{
                ...styles.statusBadge,
                backgroundColor: statusColor(memberStatus).bg,
                color: statusColor(memberStatus).color,
              }}
            >
              {displayStatus(memberStatus)}
            </div>
          )}
        </motion.div>
      </motion.section>

      {/* ── Main Grid ────────────────────────────── */}
      <motion.div
        style={styles.grid}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* ── Membership Card ─────────────────── */}
        <motion.div style={styles.membershipCard} variants={revealUp}>
          <div style={styles.membershipCardHeader}>
            <div>
              <p style={styles.cardLabel}>Current Membership</p>
              <h2 style={styles.tierName}>{activeTier.name}</h2>
            </div>
            <div style={styles.priceBlock}>
              <span style={styles.priceAmount}>
                {formatPrice(activeTier.monthlyPrice)}
              </span>
              <span style={styles.priceInterval}>/month</span>
            </div>
          </div>

          <div style={styles.membershipMeta}>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Status</span>
              <span
                style={{
                  ...styles.statusBadgeSmall,
                  backgroundColor: statusColor(memberStatus).bg,
                  color: statusColor(memberStatus).color,
                }}
              >
                {hasMembership ? displayStatus(memberStatus) : "None"}
              </span>
            </div>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Next Billing</span>
              <span style={styles.metaValue}>
                {member?.nextBillingDate
                  ? formatDate(member.nextBillingDate)
                  : "N/A"}
              </span>
            </div>
          </div>

          <div style={styles.membershipActions}>
            {hasMembership ? (
              <>
                <button className="btn btn-primary" style={styles.manageBtn}>
                  Manage Subscription
                </button>
                <Link
                  href="/membership"
                  className="btn btn-outline"
                  style={styles.changeTierLink}
                >
                  Change Tier
                </Link>
              </>
            ) : (
              <Link
                href="/membership"
                className="btn btn-primary"
                style={styles.manageBtn}
              >
                Explore Memberships
              </Link>
            )}
          </div>
        </motion.div>

        {/* ── Quick Actions ───────────────────── */}
        <motion.div style={styles.quickActionsWrap} variants={revealUp}>
          <p style={styles.cardLabel}>Quick Actions</p>
          <div style={styles.quickActionsGrid}>
            <Link href="/booking" style={styles.quickCard}>
              <span style={styles.quickIcon}>&#128197;</span>
              <span style={styles.quickTitle}>Book Appointment</span>
              <span style={styles.quickArrow}>&rarr;</span>
            </Link>
            <Link href="/shop" style={styles.quickCard}>
              <span style={styles.quickIcon}>&#128722;</span>
              <span style={styles.quickTitle}>Browse Shop</span>
              <span style={styles.quickArrow}>&rarr;</span>
            </Link>
            <Link href="/services" style={styles.quickCard}>
              <span style={styles.quickIcon}>&#9733;</span>
              <span style={styles.quickTitle}>View Services</span>
              <span style={styles.quickArrow}>&rarr;</span>
            </Link>
          </div>
        </motion.div>

        {/* ── Benefits Summary ────────────────── */}
        <motion.div style={styles.card} variants={revealUp}>
          <h3 style={styles.cardTitle}>Your Benefits</h3>
          <p style={styles.cardSubtitle}>
            {hasMembership
              ? `Included with your ${activeTier.name} membership`
              : "Join a membership to unlock exclusive benefits"}
          </p>
          {activeTier.benefits.length > 0 ? (
            <ul style={styles.benefitsList}>
              {activeTier.benefits.map((benefit, i) => (
                <li key={i} style={styles.benefitItem}>
                  <span style={styles.checkmark}>&#10003;</span>
                  {benefit}
                </li>
              ))}
            </ul>
          ) : (
            <p style={styles.emptyState}>
              No benefits to display. Explore our membership tiers to get
              started.
            </p>
          )}
        </motion.div>

        {/* ── Recent Bookings ─────────────────── */}
        <motion.div style={styles.card} variants={revealUp}>
          <div style={styles.cardTitleRow}>
            <h3 style={styles.cardTitle}>Recent Bookings</h3>
            <Link href="/booking" style={styles.viewAllLink}>
              View All &rarr;
            </Link>
          </div>
          {recentBookings.length > 0 ? (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Guest</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => (
                    <tr key={b._id}>
                      <td style={styles.td}>{formatDate(b.startTime)}</td>
                      <td style={styles.td}>{b.guestName}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusBadgeSmall,
                            backgroundColor: statusColor(b.status).bg,
                            color: statusColor(b.status).color,
                          }}
                        >
                          {displayStatus(b.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={styles.emptyState}>
              No bookings yet. Book your first appointment to get started.
            </p>
          )}
        </motion.div>

        {/* ── Order History ───────────────────── */}
        <motion.div style={styles.card} variants={revealUp}>
          <div style={styles.cardTitleRow}>
            <h3 style={styles.cardTitle}>Order History</h3>
            <Link href="/shop" style={styles.viewAllLink}>
              View All &rarr;
            </Link>
          </div>
          {recentOrders.length > 0 ? (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Order #</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Items</th>
                    <th style={styles.th}>Total</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o._id}>
                      <td style={{ ...styles.td, fontWeight: 600 }}>
                        {o.orderNumber}
                      </td>
                      <td style={styles.td}>{formatDate(o.createdAt)}</td>
                      <td style={styles.td}>
                        {o.items.map((i) => i.productName).join(", ")}
                      </td>
                      <td style={styles.td}>{formatPrice(o.total)}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusBadgeSmall,
                            backgroundColor: statusColor(o.status).bg,
                            color: statusColor(o.status).color,
                          }}
                        >
                          {displayStatus(o.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={styles.emptyState}>
              No orders yet. Visit our shop to browse products.
            </p>
          )}
        </motion.div>

        {/* ── Account Section ─────────────────── */}
        <motion.div style={styles.card} variants={revealUp}>
          <h3 style={styles.cardTitle}>Account</h3>
          <div style={styles.accountGrid}>
            <div style={styles.accountField}>
              <span style={styles.metaLabel}>Name</span>
              <span style={styles.metaValue}>{fullName}</span>
            </div>
            <div style={styles.accountField}>
              <span style={styles.metaLabel}>Email</span>
              <span style={styles.metaValue}>{email}</span>
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            <Link
              href="/sign-out"
              className="btn btn-outline"
              style={styles.signOutBtn}
            >
              Sign Out
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}

/* ── Inline styles ─────────────────────────────────── */
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "var(--color-cream, #faf7f2)",
    paddingBottom: 80,
  },
  loadingWrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--color-cream, #faf7f2)",
  },
  loadingText: {
    fontFamily: "var(--font-body, sans-serif)",
    fontSize: 18,
    color: "var(--color-chocolate, #3e2c1c)",
  },

  /* Header */
  header: {
    padding: "48px 24px 32px",
    maxWidth: 1200,
    margin: "0 auto",
  },
  headerInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap" as const,
    gap: 16,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    objectFit: "cover" as const,
    border: "3px solid var(--color-burgundy, #6b2737)",
  },
  welcomeHeading: {
    fontFamily: "var(--font-heading, serif)",
    fontSize: 28,
    fontWeight: 400,
    color: "var(--color-chocolate, #3e2c1c)",
    margin: 0,
    lineHeight: 1.3,
  },
  accentName: {
    color: "var(--color-burgundy, #6b2737)",
  },
  welcomeSub: {
    fontFamily: "var(--font-body, sans-serif)",
    fontSize: 15,
    color: "var(--color-brown, #7a6552)",
    margin: "4px 0 0",
  },
  statusBadge: {
    display: "inline-block",
    padding: "6px 18px",
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
    fontFamily: "var(--font-body, sans-serif)",
  },

  /* Grid */
  grid: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 24px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 24,
  },

  /* Membership Card */
  membershipCard: {
    backgroundColor: "var(--color-ivory, #fffef9)",
    border: "1px solid var(--color-stone, #d6cfc4)",
    borderRadius: 16,
    padding: "32px 28px",
    borderTop: "4px solid var(--color-burgundy, #6b2737)",
  },
  membershipCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  cardLabel: {
    fontFamily: "var(--font-body, sans-serif)",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "var(--color-brown, #7a6552)",
    margin: "0 0 6px",
  },
  tierName: {
    fontFamily: "var(--font-heading, serif)",
    fontSize: 32,
    fontWeight: 400,
    color: "var(--color-burgundy, #6b2737)",
    margin: 0,
  },
  priceBlock: {
    textAlign: "right" as const,
  },
  priceAmount: {
    fontFamily: "var(--font-heading, serif)",
    fontSize: 28,
    fontWeight: 400,
    color: "var(--color-chocolate, #3e2c1c)",
  },
  priceInterval: {
    fontFamily: "var(--font-body, sans-serif)",
    fontSize: 14,
    color: "var(--color-brown, #7a6552)",
  },
  membershipMeta: {
    display: "flex",
    gap: 32,
    marginBottom: 28,
    paddingBottom: 24,
    borderBottom: "1px solid var(--color-stone, #d6cfc4)",
  },
  metaItem: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 4,
  },
  metaLabel: {
    fontFamily: "var(--font-body, sans-serif)",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "var(--color-brown, #7a6552)",
  },
  metaValue: {
    fontFamily: "var(--font-body, sans-serif)",
    fontSize: 15,
    color: "var(--color-chocolate, #3e2c1c)",
    fontWeight: 500,
  },
  statusBadgeSmall: {
    display: "inline-block",
    padding: "3px 12px",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "var(--font-body, sans-serif)",
  },
  membershipActions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap" as const,
  },
  manageBtn: {
    flex: 1,
    minWidth: 160,
  },
  changeTierLink: {
    flex: 1,
    minWidth: 120,
    textAlign: "center" as const,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
  },

  /* Quick Actions */
  quickActionsWrap: {
    backgroundColor: "var(--color-ivory, #fffef9)",
    border: "1px solid var(--color-stone, #d6cfc4)",
    borderRadius: 16,
    padding: "28px 28px",
  },
  quickActionsGrid: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 12,
    marginTop: 4,
  },
  quickCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "16px 20px",
    backgroundColor: "var(--color-cream, #faf7f2)",
    border: "1px solid var(--color-stone, #d6cfc4)",
    borderRadius: 12,
    textDecoration: "none",
    transition: "border-color 0.25s, box-shadow 0.25s",
    cursor: "pointer",
  },
  quickIcon: {
    fontSize: 22,
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--color-ivory, #fffef9)",
    borderRadius: 10,
    border: "1px solid var(--color-stone, #d6cfc4)",
  },
  quickTitle: {
    fontFamily: "var(--font-body, sans-serif)",
    fontSize: 15,
    fontWeight: 600,
    color: "var(--color-chocolate, #3e2c1c)",
    flex: 1,
  },
  quickArrow: {
    fontSize: 18,
    color: "var(--color-burgundy, #6b2737)",
    fontWeight: 600,
  },

  /* Generic card */
  card: {
    backgroundColor: "var(--color-ivory, #fffef9)",
    border: "1px solid var(--color-stone, #d6cfc4)",
    borderRadius: 16,
    padding: "28px 28px",
  },
  cardTitle: {
    fontFamily: "var(--font-heading, serif)",
    fontSize: 22,
    fontWeight: 400,
    color: "var(--color-chocolate, #3e2c1c)",
    margin: "0 0 4px",
  },
  cardSubtitle: {
    fontFamily: "var(--font-body, sans-serif)",
    fontSize: 14,
    color: "var(--color-brown, #7a6552)",
    margin: "0 0 20px",
  },
  cardTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  viewAllLink: {
    fontFamily: "var(--font-body, sans-serif)",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--color-burgundy, #6b2737)",
    textDecoration: "none",
    letterSpacing: "0.03em",
  },

  /* Benefits */
  benefitsList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column" as const,
    gap: 12,
  },
  benefitItem: {
    fontFamily: "var(--font-body, sans-serif)",
    fontSize: 15,
    color: "var(--color-chocolate, #3e2c1c)",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  checkmark: {
    color: "var(--color-burgundy, #6b2737)",
    fontWeight: 700,
    fontSize: 16,
    width: 22,
    height: 22,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--color-cream, #faf7f2)",
    borderRadius: "50%",
    flexShrink: 0,
  },

  /* Empty state */
  emptyState: {
    fontFamily: "var(--font-body, sans-serif)",
    fontSize: 14,
    color: "var(--color-brown, #7a6552)",
    fontStyle: "italic" as const,
    padding: "20px 0",
    margin: 0,
  },

  /* Table */
  tableWrap: {
    overflowX: "auto" as const,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontFamily: "var(--font-body, sans-serif)",
    fontSize: 14,
  },
  th: {
    textAlign: "left" as const,
    padding: "10px 12px",
    fontWeight: 600,
    fontSize: 12,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    color: "var(--color-brown, #7a6552)",
    borderBottom: "2px solid var(--color-stone, #d6cfc4)",
  },
  td: {
    padding: "12px 12px",
    color: "var(--color-chocolate, #3e2c1c)",
    borderBottom: "1px solid var(--color-stone, #d6cfc4)",
  },

  /* Account */
  accountGrid: {
    display: "flex",
    gap: 40,
    flexWrap: "wrap" as const,
    marginTop: 16,
  },
  accountField: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 4,
  },
  signOutBtn: {
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

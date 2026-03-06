"use client";

import { useUser } from "@clerk/nextjs";
import { api } from "../../../../convex/_generated/api";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

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

/* ── Placeholder data ──────────────────────────────── */
const PLACEHOLDER_TIER = {
  name: "Radiance",
  price: 19900,
  status: "Active" as const,
  nextBillingDate: "April 1, 2026",
  benefits: [
    "One signature facial per month",
    "15% off all additional services",
    "10% off retail products",
    "Priority booking access",
    "Complimentary skincare consultation",
    "Birthday month bonus treatment",
  ],
};

const PLACEHOLDER_BOOKINGS = [
  {
    id: 1,
    date: "Mar 12, 2026",
    service: "HydraFacial Signature",
    status: "Upcoming",
  },
  {
    id: 2,
    date: "Feb 14, 2026",
    service: "Botox - Forehead",
    status: "Completed",
  },
  {
    id: 3,
    date: "Jan 20, 2026",
    service: "Chemical Peel - Light",
    status: "Completed",
  },
  {
    id: 4,
    date: "Dec 18, 2025",
    service: "Signature Facial",
    status: "Completed",
  },
];

const PLACEHOLDER_ORDERS = [
  {
    id: "ORD-4821",
    date: "Feb 28, 2026",
    items: "SkinCeuticals CE Ferulic, Moisturizer",
    total: 18500,
    status: "Delivered",
  },
  {
    id: "ORD-4790",
    date: "Jan 15, 2026",
    items: "EltaMD UV Clear SPF 46",
    total: 3900,
    status: "Delivered",
  },
  {
    id: "ORD-4756",
    date: "Dec 22, 2025",
    items: "Gift Set - Holiday Glow Collection",
    total: 12500,
    status: "Delivered",
  },
];

/* ── Status badge colors ───────────────────────────── */
function statusColor(status: string) {
  switch (status.toLowerCase()) {
    case "active":
    case "completed":
    case "delivered":
      return { bg: "#e8f5e9", color: "#2e7d32" };
    case "upcoming":
      return { bg: "#e3f2fd", color: "#1565c0" };
    case "past due":
      return { bg: "#fff8e1", color: "#f57f17" };
    case "cancelled":
      return { bg: "#fce4ec", color: "#c62828" };
    default:
      return { bg: "#f5f5f5", color: "#616161" };
  }
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

/* ── Component ─────────────────────────────────────── */
export default function MemberDashboardPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
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

  const firstName = user?.firstName || "Member";
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const fullName = user?.fullName || firstName;
  const avatarUrl = user?.imageUrl;

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
          <div
            style={{
              ...styles.statusBadge,
              backgroundColor: statusColor(PLACEHOLDER_TIER.status).bg,
              color: statusColor(PLACEHOLDER_TIER.status).color,
            }}
          >
            {PLACEHOLDER_TIER.status}
          </div>
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
              <h2 style={styles.tierName}>{PLACEHOLDER_TIER.name}</h2>
            </div>
            <div style={styles.priceBlock}>
              <span style={styles.priceAmount}>
                {formatPrice(PLACEHOLDER_TIER.price)}
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
                  backgroundColor: statusColor(PLACEHOLDER_TIER.status).bg,
                  color: statusColor(PLACEHOLDER_TIER.status).color,
                }}
              >
                {PLACEHOLDER_TIER.status}
              </span>
            </div>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Next Billing</span>
              <span style={styles.metaValue}>
                {PLACEHOLDER_TIER.nextBillingDate}
              </span>
            </div>
          </div>

          <div style={styles.membershipActions}>
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
            Included with your {PLACEHOLDER_TIER.name} membership
          </p>
          <ul style={styles.benefitsList}>
            {PLACEHOLDER_TIER.benefits.map((benefit, i) => (
              <li key={i} style={styles.benefitItem}>
                <span style={styles.checkmark}>&#10003;</span>
                {benefit}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* ── Recent Bookings ─────────────────── */}
        <motion.div style={styles.card} variants={revealUp}>
          <div style={styles.cardTitleRow}>
            <h3 style={styles.cardTitle}>Recent Bookings</h3>
            <Link href="/booking" style={styles.viewAllLink}>
              View All &rarr;
            </Link>
          </div>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Service</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {PLACEHOLDER_BOOKINGS.map((b) => (
                  <tr key={b.id}>
                    <td style={styles.td}>{b.date}</td>
                    <td style={styles.td}>{b.service}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadgeSmall,
                          backgroundColor: statusColor(b.status).bg,
                          color: statusColor(b.status).color,
                        }}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ── Order History ───────────────────── */}
        <motion.div style={styles.card} variants={revealUp}>
          <div style={styles.cardTitleRow}>
            <h3 style={styles.cardTitle}>Order History</h3>
            <Link href="/shop" style={styles.viewAllLink}>
              View All &rarr;
            </Link>
          </div>
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
                {PLACEHOLDER_ORDERS.map((o) => (
                  <tr key={o.id}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{o.id}</td>
                    <td style={styles.td}>{o.date}</td>
                    <td style={styles.td}>{o.items}</td>
                    <td style={styles.td}>{formatPrice(o.total)}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadgeSmall,
                          backgroundColor: statusColor(o.status).bg,
                          color: statusColor(o.status).color,
                        }}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

/* -- Types ------------------------------------------------- */

type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

/* -- Helpers ----------------------------------------------- */

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const statusConfig: Record<
  OrderStatus,
  { label: string; bg: string; text: string }
> = {
  pending: { label: "Pending", bg: "#e5e5e5", text: "#525252" },
  paid: { label: "Paid", bg: "#dbeafe", text: "#1e40af" },
  processing: { label: "Processing", bg: "#fef3c7", text: "#92400e" },
  shipped: { label: "Shipped", bg: "#ede9fe", text: "#6b21a8" },
  delivered: { label: "Delivered", bg: "#dcfce7", text: "#166534" },
  cancelled: { label: "Cancelled", bg: "#fee2e2", text: "#991b1b" },
  refunded: { label: "Refunded", bg: "#fce4ec", text: "#880e4f" },
};

const allStatuses: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

/* -- Component --------------------------------------------- */

export default function AdminOrdersPage() {
  const orders = useQuery(api.orders.list);
  const updateStatus = useMutation(api.orders.updateStatus);
  const updateNotes = useMutation(api.orders.updateNotes);

  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [actionsOpenId, setActionsOpenId] = useState<string | null>(null);

  // Editable state for detail panel
  const [editingStatus, setEditingStatus] = useState<OrderStatus | "">("");
  const [editingNotes, setEditingNotes] = useState("");
  const [statusSaved, setStatusSaved] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [notesUpdating, setNotesUpdating] = useState(false);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    let result = orders;
    if (filterStatus !== "all") {
      result = result.filter((o) => o.status === filterStatus);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q)
      );
    }
    return result;
  }, [orders, filterStatus, searchQuery]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function openDetails(order: any) {
    setExpandedOrderId(order._id);
    setEditingStatus(order.status);
    setEditingNotes(order.notes || "");
    setActionsOpenId(null);
    setStatusSaved(false);
    setNotesSaved(false);
  }

  function closeDetails() {
    setExpandedOrderId(null);
  }

  async function handleStatusUpdate() {
    if (!expandedOrderId || !editingStatus) return;
    setStatusUpdating(true);
    try {
      await updateStatus({
        id: expandedOrderId as Id<"orders">,
        status: editingStatus as OrderStatus,
      });
      setStatusSaved(true);
      setTimeout(() => setStatusSaved(false), 2000);
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setStatusUpdating(false);
    }
  }

  async function handleNotesSave() {
    if (!expandedOrderId) return;
    setNotesUpdating(true);
    try {
      await updateNotes({
        id: expandedOrderId as Id<"orders">,
        notes: editingNotes,
      });
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    } catch (err) {
      console.error("Failed to update notes:", err);
    } finally {
      setNotesUpdating(false);
    }
  }

  const expandedOrder = orders?.find((o) => o._id === expandedOrderId);

  /* -- Loading state ---------------------------------------- */
  if (orders === undefined) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#faf9f6",
          padding: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            color: "var(--color-brown, #5C3A2E)",
            fontSize: "1.1rem",
          }}
        >
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#faf9f6", padding: "2rem" }}>
      {/* Header */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          marginBottom: "2rem",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-heading, Georgia, serif)",
            color: "var(--color-chocolate, #3C1A0E)",
            fontSize: "2rem",
            fontWeight: 700,
            margin: 0,
          }}
        >
          Orders
        </h1>
        <p
          style={{
            color: "var(--color-brown, #5C3A2E)",
            fontSize: "0.95rem",
            marginTop: "0.25rem",
          }}
        >
          {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
          {filterStatus !== "all" ? ` (${statusConfig[filterStatus].label})` : ""}
        </p>
      </div>

      {/* Filters & Search */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          marginBottom: "1.5rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Status Tabs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(["all", ...allStatuses] as const).map((status) => {
            const isActive = filterStatus === status;
            const label = status === "all" ? "All" : statusConfig[status].label;
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: "9999px",
                  border: isActive
                    ? "2px solid var(--color-burgundy, #6B1D3B)"
                    : "1px solid #d6d3d1",
                  background: isActive ? "var(--color-burgundy, #6B1D3B)" : "#fff",
                  color: isActive ? "#fff" : "var(--color-brown, #5C3A2E)",
                  fontSize: "0.85rem",
                  fontWeight: isActive ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by order #, name, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "0.5rem 1rem",
            border: "1px solid #d6d3d1",
            borderRadius: "0.5rem",
            fontSize: "0.9rem",
            width: 300,
            maxWidth: "100%",
            outline: "none",
            color: "var(--color-brown, #5C3A2E)",
          }}
        />
      </div>

      {/* Orders Table */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          background: "#fff",
          border: "1px solid #e7e5e4",
          borderRadius: "0.75rem",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        {/* Table Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "140px 1fr 160px 60px 100px 110px 80px",
            padding: "0.75rem 1.25rem",
            borderBottom: "1px solid #e7e5e4",
            background: "#faf9f6",
            fontSize: "0.78rem",
            fontWeight: 600,
            color: "var(--color-brown, #5C3A2E)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          <span>Order #</span>
          <span>Customer</span>
          <span>Date</span>
          <span>Items</span>
          <span>Total</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {orders.length === 0 && (
          <div
            style={{
              padding: "3rem",
              textAlign: "center",
              color: "#a8a29e",
              fontSize: "0.95rem",
            }}
          >
            No orders yet.
          </div>
        )}

        {orders.length > 0 && filteredOrders.length === 0 && (
          <div
            style={{
              padding: "3rem",
              textAlign: "center",
              color: "#a8a29e",
              fontSize: "0.95rem",
            }}
          >
            No orders found matching your filters.
          </div>
        )}

        {filteredOrders.map((order) => {
          const orderStatus = order.status as OrderStatus;
          const config = statusConfig[orderStatus] || statusConfig.pending;

          return (
            <div key={order._id}>
              {/* Table Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr 160px 60px 100px 110px 80px",
                  padding: "0.85rem 1.25rem",
                  borderBottom: "1px solid #f5f5f4",
                  alignItems: "center",
                  fontSize: "0.9rem",
                  color: "var(--color-brown, #5C3A2E)",
                  cursor: "pointer",
                  transition: "background 0.1s ease",
                  background:
                    expandedOrderId === order._id ? "#faf9f6" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (expandedOrderId !== order._id)
                    (e.currentTarget as HTMLDivElement).style.background = "#fdfcfa";
                }}
                onMouseLeave={(e) => {
                  if (expandedOrderId !== order._id)
                    (e.currentTarget as HTMLDivElement).style.background =
                      "transparent";
                }}
                onClick={() =>
                  expandedOrderId === order._id
                    ? closeDetails()
                    : openDetails(order)
                }
              >
                <span style={{ fontWeight: 600, fontFamily: "monospace", fontSize: "0.85rem" }}>
                  {order.orderNumber}
                </span>
                <div>
                  <div style={{ fontWeight: 500 }}>{order.customerName}</div>
                  <div style={{ fontSize: "0.8rem", color: "#a8a29e" }}>
                    {order.customerEmail}
                  </div>
                </div>
                <span style={{ fontSize: "0.85rem", color: "#78716c" }}>
                  {formatDate(order.createdAt)}
                </span>
                <span style={{ textAlign: "center" }}>
                  {order.items.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
                <span style={{ fontWeight: 600 }}>{formatPrice(order.total)}</span>
                <span>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "9999px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      background: config.bg,
                      color: config.text,
                    }}
                  >
                    {config.label}
                  </span>
                </span>
                <span style={{ position: "relative" }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActionsOpenId(
                        actionsOpenId === order._id ? null : order._id
                      );
                    }}
                    style={{
                      background: "none",
                      border: "1px solid #d6d3d1",
                      borderRadius: "0.375rem",
                      padding: "0.25rem 0.5rem",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      color: "var(--color-brown, #5C3A2E)",
                    }}
                  >
                    ...
                  </button>
                  {actionsOpenId === order._id && (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "100%",
                        marginTop: "0.25rem",
                        background: "#fff",
                        border: "1px solid #e7e5e4",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        zIndex: 20,
                        minWidth: 160,
                        overflow: "hidden",
                      }}
                    >
                      {[
                        { label: "View Details", action: () => openDetails(order) },
                        {
                          label: "Update Status",
                          action: () => openDetails(order),
                        },
                        {
                          label: "Edit Notes",
                          action: () => openDetails(order),
                        },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={(e) => {
                            e.stopPropagation();
                            item.action();
                          }}
                          style={{
                            display: "block",
                            width: "100%",
                            textAlign: "left",
                            padding: "0.6rem 1rem",
                            background: "none",
                            border: "none",
                            fontSize: "0.85rem",
                            color: "var(--color-brown, #5C3A2E)",
                            cursor: "pointer",
                            borderBottom: "1px solid #f5f5f4",
                          }}
                          onMouseEnter={(e) =>
                            ((e.target as HTMLElement).style.background = "#faf9f6")
                          }
                          onMouseLeave={(e) =>
                            ((e.target as HTMLElement).style.background =
                              "transparent")
                          }
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </span>
              </div>

              {/* Expanded Detail Panel */}
              {expandedOrderId === order._id && expandedOrder && (
                <div
                  style={{
                    background: "#faf9f6",
                    borderBottom: "1px solid #e7e5e4",
                    padding: "1.5rem 2rem",
                    boxShadow: "inset 0 2px 6px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "2rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    {/* Customer Info */}
                    <div>
                      <h3
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          color: "var(--color-chocolate, #3C1A0E)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "0.75rem",
                        }}
                      >
                        Customer
                      </h3>
                      <p
                        style={{
                          margin: "0 0 0.25rem",
                          fontWeight: 500,
                          color: "var(--color-brown, #5C3A2E)",
                        }}
                      >
                        {expandedOrder.customerName}
                      </p>
                      <p
                        style={{
                          margin: "0 0 0.25rem",
                          fontSize: "0.85rem",
                          color: "#78716c",
                        }}
                      >
                        {expandedOrder.customerEmail}
                      </p>
                      {expandedOrder.customerPhone && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.85rem",
                            color: "#78716c",
                          }}
                        >
                          {expandedOrder.customerPhone}
                        </p>
                      )}
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h3
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          color: "var(--color-chocolate, #3C1A0E)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "0.75rem",
                        }}
                      >
                        Shipping Address
                      </h3>
                      {expandedOrder.shippingAddress ? (
                        <div
                          style={{
                            fontSize: "0.9rem",
                            color: "var(--color-brown, #5C3A2E)",
                            lineHeight: 1.5,
                          }}
                        >
                          <div>{expandedOrder.shippingAddress.name}</div>
                          <div>{expandedOrder.shippingAddress.line1}</div>
                          {expandedOrder.shippingAddress.line2 && (
                            <div>{expandedOrder.shippingAddress.line2}</div>
                          )}
                          <div>
                            {expandedOrder.shippingAddress.city},{" "}
                            {expandedOrder.shippingAddress.state}{" "}
                            {expandedOrder.shippingAddress.postalCode}
                          </div>
                          <div>{expandedOrder.shippingAddress.country}</div>
                        </div>
                      ) : (
                        <p style={{ color: "#a8a29e", fontSize: "0.9rem", margin: 0 }}>
                          No address provided
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Line Items */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <h3
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: "var(--color-chocolate, #3C1A0E)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: "0.75rem",
                      }}
                    >
                      Items
                    </h3>
                    <div
                      style={{
                        background: "#fff",
                        border: "1px solid #e7e5e4",
                        borderRadius: "0.5rem",
                        overflow: "hidden",
                      }}
                    >
                      {/* Items Header */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 80px 100px 100px",
                          padding: "0.5rem 1rem",
                          background: "#faf9f6",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: "#78716c",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          borderBottom: "1px solid #e7e5e4",
                        }}
                      >
                        <span>Product</span>
                        <span style={{ textAlign: "center" }}>Qty</span>
                        <span style={{ textAlign: "right" }}>Price</span>
                        <span style={{ textAlign: "right" }}>Total</span>
                      </div>
                      {expandedOrder.items.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 80px 100px 100px",
                            padding: "0.6rem 1rem",
                            fontSize: "0.88rem",
                            color: "var(--color-brown, #5C3A2E)",
                            borderBottom:
                              idx < expandedOrder.items.length - 1
                                ? "1px solid #f5f5f4"
                                : "none",
                          }}
                        >
                          <span>{item.productName}</span>
                          <span style={{ textAlign: "center" }}>
                            {item.quantity}
                          </span>
                          <span style={{ textAlign: "right" }}>
                            {formatPrice(item.priceAtPurchase)}
                          </span>
                          <span style={{ textAlign: "right", fontWeight: 500 }}>
                            {formatPrice(item.priceAtPurchase * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "0.75rem",
                      }}
                    >
                      <div style={{ width: 220 }}>
                        {[
                          { label: "Subtotal", value: expandedOrder.subtotal },
                          { label: "Tax", value: expandedOrder.tax },
                          { label: "Shipping", value: expandedOrder.shipping },
                        ].map((row) => (
                          <div
                            key={row.label}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              padding: "0.2rem 0",
                              fontSize: "0.88rem",
                              color: "#78716c",
                            }}
                          >
                            <span>{row.label}</span>
                            <span>
                              {row.value === 0 ? "Free" : formatPrice(row.value)}
                            </span>
                          </div>
                        ))}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "0.5rem 0 0",
                            marginTop: "0.35rem",
                            borderTop: "1px solid #e7e5e4",
                            fontSize: "1rem",
                            fontWeight: 700,
                            color: "var(--color-chocolate, #3C1A0E)",
                          }}
                        >
                          <span>Total</span>
                          <span>{formatPrice(expandedOrder.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1.5rem",
                    }}
                  >
                    {/* Status Update */}
                    <div>
                      <h3
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          color: "var(--color-chocolate, #3C1A0E)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "0.75rem",
                        }}
                      >
                        Update Status
                      </h3>
                      <select
                        value={editingStatus}
                        onChange={(e) =>
                          setEditingStatus(e.target.value as OrderStatus)
                        }
                        style={{
                          width: "100%",
                          padding: "0.5rem 0.75rem",
                          border: "1px solid #d6d3d1",
                          borderRadius: "0.5rem",
                          fontSize: "0.88rem",
                          color: "var(--color-brown, #5C3A2E)",
                          background: "#fff",
                          marginBottom: "0.5rem",
                          outline: "none",
                        }}
                      >
                        {allStatuses.map((s) => (
                          <option key={s} value={s}>
                            {statusConfig[s].label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleStatusUpdate}
                        disabled={statusUpdating}
                        style={{
                          padding: "0.45rem 1.25rem",
                          background: "var(--color-burgundy, #6B1D3B)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "0.5rem",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          cursor: statusUpdating ? "not-allowed" : "pointer",
                          opacity: statusUpdating ? 0.6 : 1,
                          transition: "opacity 0.15s ease",
                        }}
                      >
                        {statusSaved ? "Saved!" : statusUpdating ? "Saving..." : "Update Status"}
                      </button>
                    </div>

                    {/* Admin Notes */}
                    <div>
                      <h3
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          color: "var(--color-chocolate, #3C1A0E)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "0.75rem",
                        }}
                      >
                        Notes (tracking, internal notes, etc.)
                      </h3>
                      <textarea
                        value={editingNotes}
                        onChange={(e) => setEditingNotes(e.target.value)}
                        placeholder="Internal notes, tracking info, etc..."
                        rows={4}
                        style={{
                          width: "100%",
                          padding: "0.5rem 0.75rem",
                          border: "1px solid #d6d3d1",
                          borderRadius: "0.5rem",
                          fontSize: "0.88rem",
                          color: "var(--color-brown, #5C3A2E)",
                          resize: "vertical",
                          fontFamily: "inherit",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                      <button
                        onClick={handleNotesSave}
                        disabled={notesUpdating}
                        style={{
                          marginTop: "0.5rem",
                          padding: "0.45rem 1.25rem",
                          background: "var(--color-burgundy, #6B1D3B)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "0.5rem",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          cursor: notesUpdating ? "not-allowed" : "pointer",
                          opacity: notesUpdating ? 0.6 : 1,
                          transition: "opacity 0.15s ease",
                        }}
                      >
                        {notesSaved ? "Saved!" : notesUpdating ? "Saving..." : "Save Notes"}
                      </button>
                    </div>
                  </div>

                  {/* Stripe Payment Intent ID (if present) */}
                  {expandedOrder.stripePaymentIntentId && (
                    <div style={{ marginTop: "1rem" }}>
                      <span
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          color: "#78716c",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        Stripe Payment ID:{" "}
                      </span>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontFamily: "monospace",
                          color: "var(--color-brown, #5C3A2E)",
                        }}
                      >
                        {expandedOrder.stripePaymentIntentId}
                      </span>
                    </div>
                  )}

                  {/* Close button */}
                  <div
                    style={{
                      marginTop: "1.25rem",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      onClick={closeDetails}
                      style={{
                        padding: "0.45rem 1.25rem",
                        background: "transparent",
                        color: "var(--color-brown, #5C3A2E)",
                        border: "1px solid #d6d3d1",
                        borderRadius: "0.5rem",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                    >
                      Close Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

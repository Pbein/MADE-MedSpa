"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

export default function AdminPabauReviewsPage() {
  const reviews = useQuery(api.pabauReviews.listAll);
  const setFeatured = useMutation(api.pabauReviews.setFeatured);
  const setHidden = useMutation(api.pabauReviews.setHidden);
  const setDisplayOrder = useMutation(api.pabauReviews.setDisplayOrder);

  const [search, setSearch] = useState("");
  const [showHidden, setShowHidden] = useState(false);

  const filtered =
    reviews
      ?.filter((r) => {
        if (!showHidden && r.isHidden) return false;
        if (!search) return true;
        const s = search.toLowerCase();
        return (
          r.name.toLowerCase().includes(s) ||
          r.quote.toLowerCase().includes(s) ||
          (r.treatment ?? "").toLowerCase().includes(s)
        );
      }) ?? [];

  async function handleFeature(id: Id<"pabauReviews">, current: boolean) {
    try {
      await setFeatured({ id, isFeatured: !current });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Couldn't change featured flag: ${message}`);
    }
  }

  async function handleHide(id: Id<"pabauReviews">, current: boolean) {
    try {
      await setHidden({ id, isHidden: !current });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Couldn't change hidden flag: ${message}`);
    }
  }

  async function handleOrderChange(id: Id<"pabauReviews">, value: string) {
    const n = parseInt(value, 10);
    if (!Number.isFinite(n)) return;
    try {
      await setDisplayOrder({ id, displayOrder: n });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Couldn't update sort order: ${message}`);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: "#111827" }}>
          Pabau Reviews{" "}
          <span className="text-base font-normal" style={{ color: "#6b7280" }}>
            ({filtered.length})
          </span>
        </h1>
        <p className="text-[14px]" style={{ color: "#6b7280", marginTop: 4 }}>
          Reviews submitted directly through Pabau — shown in a separate &ldquo;Recent
          Reviews&rdquo; section on the public testimonials page. Curated marketing
          testimonials live separately under{" "}
          <a href="/admin/testimonials" style={{ color: "#4f46e5", textDecoration: "underline" }}>
            Testimonials
          </a>
          .
        </p>
      </div>

      <div
        style={{
          backgroundColor: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          fontSize: 13,
          color: "#1e40af",
        }}
      >
        <strong>Source of truth:</strong> Pabau. Review text is managed in Pabau. Here you
        can feature, hide, or reorder them for the website. Force a sync from{" "}
        <a href="/admin/pabau" style={{ color: "#1e40af", textDecoration: "underline" }}>
          Pabau Sync
        </a>
        .
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search reviews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
          style={{ borderColor: "#e5e7eb", maxWidth: "300px", width: "100%" }}
        />
        <label
          style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#374151" }}
        >
          <input
            type="checkbox"
            checked={showHidden}
            onChange={(e) => setShowHidden(e.target.checked)}
          />
          Show hidden
        </label>
      </div>

      {!reviews && (
        <div className="py-12 text-center" style={{ color: "#6b7280" }}>
          Loading…
        </div>
      )}

      {reviews && filtered.length === 0 && (
        <div className="py-12 text-center" style={{ color: "#6b7280" }}>
          No Pabau reviews yet. Once Pabau syncs, they&apos;ll appear here.
        </div>
      )}

      {filtered.length > 0 && (
        <div className="overflow-hidden rounded-lg border" style={{ borderColor: "#e5e7eb" }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "#e5e7eb" }}>
                <th style={th}>Name</th>
                <th style={th}>Quote</th>
                <th style={th}>Treatment</th>
                <th style={th}>Order</th>
                <th style={th}>Featured</th>
                <th style={th}>Hidden</th>
                <th style={{ ...th, textAlign: "right" }}>Pabau ID</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr
                  key={r._id}
                  style={{
                    backgroundColor: i % 2 === 0 ? "#fff" : "#f9fafb",
                    borderBottom: "1px solid #e5e7eb",
                    opacity: r.isHidden ? 0.55 : 1,
                  }}
                >
                  <td style={td}>
                    <p style={{ fontSize: 15, fontWeight: 500, color: "#111827", margin: 0 }}>
                      {r.name}
                    </p>
                  </td>
                  <td style={td}>
                    <p style={{ fontSize: 14, color: "#374151", margin: 0 }}>
                      {r.quote.length > 80 ? r.quote.slice(0, 80) + "…" : r.quote}
                    </p>
                  </td>
                  <td style={{ ...td, color: "#374151", fontSize: 14 }}>
                    {r.treatment ?? "—"}
                  </td>
                  <td style={td}>
                    <input
                      type="number"
                      defaultValue={r.displayOrder}
                      onBlur={(e) => handleOrderChange(r._id, e.target.value)}
                      style={{
                        width: 70,
                        padding: "4px 8px",
                        border: "1px solid #d1d5db",
                        borderRadius: 4,
                        fontSize: 13,
                      }}
                    />
                  </td>
                  <td style={td}>
                    <button
                      onClick={() => handleFeature(r._id, r.isFeatured)}
                      style={{
                        padding: "4px 10px",
                        fontSize: 12,
                        borderRadius: 4,
                        border: "1px solid",
                        borderColor: r.isFeatured ? "#fde68a" : "#d1d5db",
                        backgroundColor: r.isFeatured ? "#fef3c7" : "#fff",
                        color: r.isFeatured ? "#92400e" : "#374151",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      {r.isFeatured ? "★ Featured" : "Feature"}
                    </button>
                  </td>
                  <td style={td}>
                    <button
                      onClick={() => handleHide(r._id, r.isHidden)}
                      style={{
                        padding: "4px 10px",
                        fontSize: 12,
                        borderRadius: 4,
                        border: "1px solid",
                        borderColor: r.isHidden ? "#fca5a5" : "#d1d5db",
                        backgroundColor: r.isHidden ? "#fee2e2" : "#fff",
                        color: r.isHidden ? "#991b1b" : "#374151",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      {r.isHidden ? "Hidden" : "Visible"}
                    </button>
                  </td>
                  <td style={{ ...td, textAlign: "right" }}>
                    <code style={{ fontSize: 11, color: "#6b7280" }}>{r.pabauReviewId}</code>
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

const th: React.CSSProperties = {
  padding: "10px 14px",
  textAlign: "left",
  fontSize: 12,
  fontWeight: 500,
  color: "#111827",
  textTransform: "uppercase",
  letterSpacing: 0.4,
};

const td: React.CSSProperties = {
  padding: "10px 14px",
  verticalAlign: "middle",
};

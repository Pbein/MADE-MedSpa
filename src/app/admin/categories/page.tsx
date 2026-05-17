"use client";

import { useState, Fragment } from "react";
import { useQuery, useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

interface CategoryFormData {
  name: string;
  pabauKeywords: string; // edited as comma-separated text
  isDefault: boolean;
}

const labelStyle = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  color: "#111827",
  marginBottom: 4,
};

const inputStyle = {
  width: "100%",
  borderRadius: 6,
  border: "1px solid #e5e7eb",
  padding: "8px 12px",
  fontSize: 15,
  outline: "none",
};

function CategoryForm({
  initial,
  onSave,
  onCancel,
  saving,
  isCreating,
}: {
  initial: CategoryFormData;
  onSave: (data: CategoryFormData) => void;
  onCancel: () => void;
  saving: boolean;
  isCreating?: boolean;
}) {
  const [form, setForm] = useState<CategoryFormData>(initial);

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        backgroundColor: "#f9fafb",
        padding: 16,
      }}
    >
      <div style={{ display: "grid", gap: 14 }}>
        <div>
          <label style={labelStyle}>Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Hair"
            style={inputStyle}
          />
          <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
            This is what shows on the public /services filter and in the admin dropdown.
          </p>
        </div>

        <div>
          <label style={labelStyle}>Pabau keywords</label>
          <input
            type="text"
            value={form.pabauKeywords}
            onChange={(e) => setForm({ ...form, pabauKeywords: e.target.value })}
            placeholder="e.g. hair, prp, regrowth"
            style={inputStyle}
          />
          <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
            Comma-separated. When Pabau syncs a service, if its category text contains
            any of these words, the service is bucketed here. Leave empty if you only
            want to assign services manually.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            id="isDefault"
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
          />
          <label htmlFor="isDefault" style={{ fontSize: 14, color: "#374151" }}>
            Use as fallback when a Pabau service matches no other category
          </label>
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button
          onClick={onCancel}
          disabled={saving}
          style={{
            border: "1px solid #e5e7eb",
            backgroundColor: "#fff",
            color: "#374151",
            padding: "6px 14px",
            borderRadius: 6,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(form)}
          disabled={saving || !form.name.trim()}
          style={{
            backgroundColor: "#6366f1",
            color: "#fff",
            padding: "6px 14px",
            borderRadius: 6,
            fontSize: 14,
            border: "none",
            cursor: "pointer",
            opacity: saving || !form.name.trim() ? 0.5 : 1,
          }}
        >
          {saving ? "Saving..." : isCreating ? "Add category" : "Save"}
        </button>
      </div>
    </div>
  );
}

export default function AdminCategoriesPage() {
  const categories = useQuery(api.serviceCategories.listAll);
  const services = useQuery(api.services.listAll);
  const create = useMutation(api.serviceCategories.create);
  const update = useMutation(api.serviceCategories.update);
  const hardDelete = useMutation(api.serviceCategories.hardDelete);
  const reorder = useMutation(api.serviceCategories.reorder);
  const seed = useMutation(api.serviceCategories.seedDefaultsAdmin);

  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<Id<"serviceCategories"> | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<Id<"serviceCategories"> | null>(null);

  // Count services per category for the table.
  const serviceCounts: Record<string, number> = {};
  if (services) {
    for (const s of services) {
      serviceCounts[s.category] = (serviceCounts[s.category] ?? 0) + 1;
    }
  }

  async function handleCreate(data: CategoryFormData) {
    setSaving(true);
    try {
      await create({
        name: data.name.trim(),
        pabauKeywords: data.pabauKeywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        isDefault: data.isDefault,
      });
      setShowCreate(false);
      toast.success(`Created "${data.name.trim()}"`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Couldn't create category: ${message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: Id<"serviceCategories">, data: CategoryFormData) {
    setSaving(true);
    try {
      await update({
        id,
        name: data.name.trim(),
        pabauKeywords: data.pabauKeywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        isDefault: data.isDefault,
      });
      setEditingId(null);
      toast.success(`Saved "${data.name.trim()}"`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Couldn't save category: ${message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(id: Id<"serviceCategories">, current: boolean) {
    try {
      await update({ id, isActive: !current });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Couldn't change status: ${message}`);
    }
  }

  async function handleHardDelete(id: Id<"serviceCategories">) {
    setSaving(true);
    try {
      await hardDelete({ id });
      setConfirmDeleteId(null);
      toast.success("Category deleted");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Couldn't delete category: ${message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleMove(id: Id<"serviceCategories">, direction: -1 | 1) {
    if (!categories) return;
    const idx = categories.findIndex((c) => c._id === id);
    const swapIdx = idx + direction;
    if (idx < 0 || swapIdx < 0 || swapIdx >= categories.length) return;

    const a = categories[idx];
    const b = categories[swapIdx];
    try {
      await reorder({
        items: [
          { id: a._id, sortOrder: b.sortOrder },
          { id: b._id, sortOrder: a.sortOrder },
        ],
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Couldn't reorder: ${message}`);
    }
  }

  async function handleSeed() {
    setSaving(true);
    try {
      const result = await seed({});
      toast.success(`Seeded ${result.created} default categories`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Couldn't seed defaults: ${message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: "#111827", margin: 0 }}>
            Service Categories{" "}
            <span style={{ fontSize: 16, fontWeight: 400, color: "#6b7280" }}>
              ({categories?.length ?? 0})
            </span>
          </h1>
          <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
            Edit the filter buttons that show on /services. Each category can have a list of Pabau
            keywords — when Pabau syncs services, matching ones get auto-assigned here.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {categories && categories.length === 0 && (
            <button
              onClick={handleSeed}
              disabled={saving}
              style={{
                backgroundColor: "#fff",
                color: "#374151",
                border: "1px solid #e5e7eb",
                padding: "8px 14px",
                borderRadius: 6,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              {saving ? "Seeding..." : "Seed default categories"}
            </button>
          )}
          <button
            onClick={() => {
              setShowCreate(!showCreate);
              setEditingId(null);
            }}
            style={{
              backgroundColor: "#6366f1",
              color: "#fff",
              border: "none",
              padding: "8px 14px",
              borderRadius: 6,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            {showCreate ? "Cancel" : "+ Add category"}
          </button>
        </div>
      </div>

      {showCreate && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#111827", marginBottom: 8 }}>
            New category
          </h2>
          <CategoryForm
            initial={{ name: "", pabauKeywords: "", isDefault: false }}
            onSave={handleCreate}
            onCancel={() => setShowCreate(false)}
            saving={saving}
            isCreating
          />
        </div>
      )}

      {!categories && (
        <div style={{ padding: 48, textAlign: "center", color: "#6b7280" }}>Loading…</div>
      )}

      {categories && categories.length === 0 && !showCreate && (
        <div style={{ padding: 48, textAlign: "center", border: "1px dashed #e5e7eb", borderRadius: 8, color: "#6b7280" }}>
          <p style={{ marginBottom: 12 }}>No categories yet.</p>
          <p style={{ fontSize: 13 }}>
            Click &ldquo;Seed default categories&rdquo; to add the original four (Injectables, Skin, Body, Wellness),
            or &ldquo;+ Add category&rdquo; to create your own.
          </p>
        </div>
      )}

      {categories && categories.length > 0 && (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden", backgroundColor: "#fff" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#111827", width: 80 }}>Order</th>
                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#111827" }}>Name</th>
                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#111827" }}>Pabau keywords</th>
                <th style={{ padding: "10px 16px", textAlign: "center", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#111827", width: 100 }}>Services</th>
                <th style={{ padding: "10px 16px", textAlign: "center", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#111827", width: 100 }}>Status</th>
                <th style={{ padding: "10px 16px", textAlign: "right", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#111827", width: 180 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <Fragment key={cat._id}>
                  <tr style={{ borderTop: "1px solid #e5e7eb", backgroundColor: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <button
                          onClick={() => handleMove(cat._id, -1)}
                          disabled={i === 0}
                          aria-label="Move up"
                          style={{
                            background: "none", border: "1px solid #e5e7eb", borderRadius: 4,
                            width: 24, height: 24, cursor: i === 0 ? "default" : "pointer",
                            opacity: i === 0 ? 0.3 : 1, fontSize: 12, color: "#374151",
                          }}
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMove(cat._id, 1)}
                          disabled={i === categories.length - 1}
                          aria-label="Move down"
                          style={{
                            background: "none", border: "1px solid #e5e7eb", borderRadius: 4,
                            width: 24, height: 24, cursor: i === categories.length - 1 ? "default" : "pointer",
                            opacity: i === categories.length - 1 ? 0.3 : 1, fontSize: 12, color: "#374151",
                          }}
                        >
                          ↓
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 15, fontWeight: 500, color: "#111827" }}>
                          {cat.name}
                        </span>
                        {cat.isDefault && (
                          <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 10, backgroundColor: "#dcfce7", color: "#166534", textTransform: "uppercase", letterSpacing: 0.4 }}>
                            Fallback
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151" }}>
                      {cat.pabauKeywords.length === 0 ? (
                        <span style={{ color: "#9ca3af", fontStyle: "italic" }}>None — manual assignment only</span>
                      ) : (
                        cat.pabauKeywords.join(", ")
                      )}
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "center", fontSize: 13, color: "#374151" }}>
                      {serviceCounts[cat.name] ?? 0}
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <button
                        onClick={() => handleToggleActive(cat._id, cat.isActive)}
                        title="Click to toggle"
                        style={{
                          backgroundColor: cat.isActive ? "#dcfce7" : "#f3f4f6",
                          color: cat.isActive ? "#166534" : "#6b7280",
                          border: "none",
                          padding: "2px 10px",
                          borderRadius: 12,
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        {cat.isActive ? "Active" : "Hidden"}
                      </button>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <button
                        onClick={() => {
                          setEditingId(editingId === cat._id ? null : cat._id);
                          setShowCreate(false);
                          setConfirmDeleteId(null);
                        }}
                        style={{ background: "none", border: "none", color: "#4f46e5", fontSize: 14, cursor: "pointer", marginRight: 12 }}
                      >
                        {editingId === cat._id ? "Close" : "Edit"}
                      </button>
                      {confirmDeleteId === cat._id ? (
                        <>
                          <button
                            onClick={() => handleHardDelete(cat._id)}
                            disabled={saving}
                            style={{ background: "#dc2626", color: "#fff", border: "none", padding: "4px 10px", borderRadius: 4, fontSize: 13, cursor: "pointer", marginRight: 6 }}
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            style={{ background: "none", border: "1px solid #e5e7eb", color: "#374151", padding: "4px 10px", borderRadius: 4, fontSize: 13, cursor: "pointer" }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(cat._id)}
                          style={{ background: "none", border: "none", color: "#dc2626", fontSize: 14, cursor: "pointer" }}
                          title={
                            (serviceCounts[cat.name] ?? 0) > 0
                              ? `${serviceCounts[cat.name]} services still use this category — they'll keep the label but the filter button will disappear.`
                              : "Remove this category"
                          }
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>

                  {editingId === cat._id && (
                    <tr style={{ backgroundColor: "#f9fafb" }}>
                      <td colSpan={6} style={{ padding: 16 }}>
                        <CategoryForm
                          initial={{
                            name: cat.name,
                            pabauKeywords: cat.pabauKeywords.join(", "),
                            isDefault: cat.isDefault ?? false,
                          }}
                          onSave={(data) => handleUpdate(cat._id, data)}
                          onCancel={() => setEditingId(null)}
                          saving={saving}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: 24, padding: 16, backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, fontSize: 13, color: "#1e3a8a", lineHeight: 1.6 }}>
        <strong>How auto-tagging works:</strong> When Pabau sync runs, each Pabau service has a category text
        (set in Pabau, like &ldquo;Hair PRP&rdquo; or &ldquo;Lip Filler&rdquo;). For each synced service, we check the
        categories above in order and pick the first one whose keyword list matches. If nothing
        matches, we use the fallback (marked with the green &ldquo;Fallback&rdquo; badge).
        <br /><br />
        Manually editing a service&rsquo;s category in <a href="/admin/services" style={{ color: "#1e40af", textDecoration: "underline" }}>Services</a> locks
        it from future Pabau overrides for that one service.
      </div>
    </div>
  );
}

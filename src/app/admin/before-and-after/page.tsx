"use client";

import { useState, Fragment } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import ImageUpload from "@/components/admin/ImageUpload";

const TREATMENT_OPTIONS = [
  "Botox",
  "Filler",
  "Skin",
  "Laser",
  "Body",
  "Wellness",
  "Other",
];

interface FormData {
  title: string;
  treatment: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  beforeAlt: string;
  afterAlt: string;
  caption: string;
  displayOrder: number;
  isFeatured: boolean;
}

const emptyForm: FormData = {
  title: "",
  treatment: "Botox",
  beforeImageUrl: "",
  afterImageUrl: "",
  beforeAlt: "",
  afterAlt: "",
  caption: "",
  displayOrder: 0,
  isFeatured: false,
};

function CaseForm({
  initial,
  onSave,
  onCancel,
  onDelete,
  saving,
}: {
  initial: FormData;
  onSave: (data: FormData) => void;
  onCancel: () => void;
  onDelete?: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<FormData>(initial);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const canSave =
    form.title.trim().length > 0 &&
    form.beforeImageUrl.length > 0 &&
    form.afterImageUrl.length > 0;

  return (
    <div
      className="rounded-lg border p-4"
      style={{ borderColor: "#e5e7eb", backgroundColor: "#f9fafb" }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label style={labelStyle}>Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder='e.g. "Lip Filler — Subtle Enhancement"'
            className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>
        <div>
          <label style={labelStyle}>Treatment</label>
          <select
            value={form.treatment}
            onChange={(e) => setForm({ ...form, treatment: e.target.value })}
            className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          >
            {TREATMENT_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <ImageUpload
            label="Before image"
            value={form.beforeImageUrl}
            onChange={(url) => setForm({ ...form, beforeImageUrl: url })}
            aspect="4/5"
          />
          <input
            type="text"
            value={form.beforeAlt}
            onChange={(e) => setForm({ ...form, beforeAlt: e.target.value })}
            placeholder="Alt text for before image (optional)"
            className="w-full mt-2 rounded-md border px-3 py-1.5 text-[13px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>
        <div>
          <ImageUpload
            label="After image"
            value={form.afterImageUrl}
            onChange={(url) => setForm({ ...form, afterImageUrl: url })}
            aspect="4/5"
          />
          <input
            type="text"
            value={form.afterAlt}
            onChange={(e) => setForm({ ...form, afterAlt: e.target.value })}
            placeholder="Alt text for after image (optional)"
            className="w-full mt-2 rounded-md border px-3 py-1.5 text-[13px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>

        <div className="sm:col-span-2">
          <label style={labelStyle}>Caption (optional)</label>
          <textarea
            value={form.caption}
            onChange={(e) => setForm({ ...form, caption: e.target.value })}
            rows={2}
            placeholder="Optional context — treatment details, sessions, anything that adds story"
            className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>

        <div>
          <label style={labelStyle}>Display order</label>
          <input
            type="number"
            value={form.displayOrder}
            onChange={(e) =>
              setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })
            }
            className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>
        <div className="flex items-center gap-2 pt-7">
          <input
            id="isFeatured"
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
          />
          <label htmlFor="isFeatured" style={{ fontSize: 13, color: "#374151" }}>
            Featured (shown first)
          </label>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          {onDelete && (
            <>
              {confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-[13px]" style={{ color: "#374151" }}>
                    Are you sure?
                  </span>
                  <button
                    onClick={onDelete}
                    disabled={saving}
                    className="rounded-md px-3 py-1 text-[13px] text-white"
                    style={{ backgroundColor: "#dc2626" }}
                  >
                    Yes, delete
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="rounded-md px-3 py-1 text-[13px]"
                    style={{ color: "#374151", border: "1px solid #e5e7eb" }}
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="rounded-md px-3 py-1 text-[13px] hover:underline"
                  style={{ color: "#dc2626" }}
                >
                  Delete
                </button>
              )}
            </>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={saving}
            className="rounded-md border px-4 py-1.5 text-[15px]"
            style={{ borderColor: "#e5e7eb", color: "#374151" }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving || !canSave}
            className="rounded-md px-4 py-1.5 text-[15px] text-white disabled:opacity-50"
            style={{ backgroundColor: "#6366f1" }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminBeforeAfterPage() {
  const cases = useQuery(api.beforeAfter.listAll);
  const createCase = useMutation(api.beforeAfter.create);
  const updateCase = useMutation(api.beforeAfter.update);
  const removeCase = useMutation(api.beforeAfter.remove);
  const toggleFeatured = useMutation(api.beforeAfter.toggleFeatured);

  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<Id<"beforeAfterCases"> | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered =
    cases?.filter((c) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        c.title.toLowerCase().includes(s) ||
        c.treatment.toLowerCase().includes(s) ||
        (c.caption ?? "").toLowerCase().includes(s)
      );
    }) ?? [];

  const nextOrder = cases ? Math.max(0, ...cases.map((c) => c.displayOrder)) + 1 : 0;

  async function handleCreate(data: FormData) {
    setSaving(true);
    try {
      await createCase({
        title: data.title.trim(),
        treatment: data.treatment,
        beforeImageUrl: data.beforeImageUrl,
        afterImageUrl: data.afterImageUrl,
        beforeAlt: data.beforeAlt.trim() || undefined,
        afterAlt: data.afterAlt.trim() || undefined,
        caption: data.caption.trim() || undefined,
        displayOrder: data.displayOrder,
        isFeatured: data.isFeatured,
      });
      setShowCreate(false);
    } catch (err) {
      console.error("Failed to create:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: Id<"beforeAfterCases">, data: FormData) {
    setSaving(true);
    try {
      await updateCase({
        id,
        title: data.title.trim(),
        treatment: data.treatment,
        beforeImageUrl: data.beforeImageUrl,
        afterImageUrl: data.afterImageUrl,
        beforeAlt: data.beforeAlt.trim() || undefined,
        afterAlt: data.afterAlt.trim() || undefined,
        caption: data.caption.trim() || undefined,
        displayOrder: data.displayOrder,
        isFeatured: data.isFeatured,
      });
      setEditingId(null);
    } catch (err) {
      console.error("Failed to update:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: Id<"beforeAfterCases">) {
    setSaving(true);
    try {
      await removeCase({ id });
      setEditingId(null);
    } catch (err) {
      console.error("Failed to delete:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "#111827" }}>
            Before & After{" "}
            <span className="text-base font-normal" style={{ color: "#6b7280" }}>
              ({filtered.length})
            </span>
          </h1>
          <p className="text-[14px]" style={{ color: "#6b7280", marginTop: 4 }}>
            Upload before/after photos to showcase real client transformations on the
            public /before-and-after page.
          </p>
        </div>
        <button
          onClick={() => {
            setShowCreate(!showCreate);
            setEditingId(null);
          }}
          className="rounded-md px-4 py-2 text-[15px] text-white"
          style={{ backgroundColor: "#6366f1" }}
        >
          {showCreate ? "Cancel" : "+ Add Case"}
        </button>
      </div>

      <div
        style={{
          backgroundColor: "#fef3c7",
          border: "1px solid #fde68a",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          fontSize: 13,
          color: "#92400e",
        }}
      >
        <strong>Privacy reminder:</strong> only upload photos you have explicit
        written client consent to share publicly. Consider obscuring identifying
        features (eyes, distinctive marks) where appropriate.
      </div>

      {showCreate && (
        <div className="mb-6">
          <h2
            className="mb-3 text-[15px] font-semibold uppercase tracking-wider"
            style={{ color: "#111827" }}
          >
            New Case
          </h2>
          <CaseForm
            initial={{ ...emptyForm, displayOrder: nextOrder }}
            onSave={handleCreate}
            onCancel={() => setShowCreate(false)}
            saving={saving}
          />
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title, treatment, or caption..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
          style={{ borderColor: "#e5e7eb", maxWidth: 320, width: "100%" }}
        />
      </div>

      {!cases && (
        <div className="py-12 text-center" style={{ color: "#6b7280" }}>
          Loading…
        </div>
      )}

      {cases && filtered.length === 0 && !showCreate && (
        <div className="py-12 text-center" style={{ color: "#6b7280" }}>
          {cases.length === 0
            ? "No cases yet. Click + Add Case to upload your first transformation."
            : "No results match your search."}
        </div>
      )}

      {filtered.length > 0 && (
        <div
          className="overflow-hidden rounded-lg border"
          style={{ borderColor: "#e5e7eb" }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "#e5e7eb" }}>
                <th style={th}>Preview</th>
                <th style={th}>Title</th>
                <th style={th}>Treatment</th>
                <th style={th}>Order</th>
                <th style={th}>Featured</th>
                <th style={th}>Status</th>
                <th style={{ ...th, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <Fragment key={c._id}>
                  <tr
                    style={{
                      backgroundColor: i % 2 === 0 ? "#fff" : "#f9fafb",
                      borderBottom: "1px solid #e5e7eb",
                      opacity: c.isActive ? 1 : 0.55,
                    }}
                  >
                    <td style={{ ...td, width: 80 }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={c.beforeImageUrl}
                          alt=""
                          style={{
                            width: 36,
                            height: 48,
                            objectFit: "cover",
                            borderRadius: 3,
                          }}
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={c.afterImageUrl}
                          alt=""
                          style={{
                            width: 36,
                            height: 48,
                            objectFit: "cover",
                            borderRadius: 3,
                          }}
                        />
                      </div>
                    </td>
                    <td style={td}>
                      <p
                        style={{
                          fontSize: 15,
                          fontWeight: 500,
                          color: "#111827",
                          margin: 0,
                        }}
                      >
                        {c.title}
                      </p>
                      {c.caption && (
                        <p
                          style={{
                            fontSize: 12,
                            color: "#6b7280",
                            margin: "2px 0 0 0",
                            maxWidth: 360,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {c.caption}
                        </p>
                      )}
                    </td>
                    <td style={{ ...td, fontSize: 13 }}>{c.treatment}</td>
                    <td style={{ ...td, fontSize: 13 }}>{c.displayOrder}</td>
                    <td style={td}>
                      <button
                        onClick={() => toggleFeatured({ id: c._id })}
                        style={{
                          padding: "2px 8px",
                          fontSize: 11,
                          borderRadius: 4,
                          border: "1px solid",
                          borderColor: c.isFeatured ? "#fde68a" : "#d1d5db",
                          backgroundColor: c.isFeatured ? "#fef3c7" : "#fff",
                          color: c.isFeatured ? "#92400e" : "#374151",
                          cursor: "pointer",
                        }}
                      >
                        {c.isFeatured ? "★ Featured" : "Feature"}
                      </button>
                    </td>
                    <td style={{ ...td, fontSize: 12 }}>
                      <span
                        style={{
                          padding: "2px 6px",
                          borderRadius: 10,
                          backgroundColor: c.isActive ? "#dcfce7" : "#f3f4f6",
                          color: c.isActive ? "#166534" : "#6b7280",
                        }}
                      >
                        {c.isActive ? "Active" : "Removed"}
                      </span>
                    </td>
                    <td style={{ ...td, textAlign: "right" }}>
                      <button
                        onClick={() =>
                          setEditingId(editingId === c._id ? null : c._id)
                        }
                        style={{ color: "#4f46e5", fontSize: 14 }}
                      >
                        {editingId === c._id ? "Cancel" : "Edit"}
                      </button>
                    </td>
                  </tr>
                  {editingId === c._id && (
                    <tr>
                      <td colSpan={7} style={{ padding: 12 }}>
                        <CaseForm
                          initial={{
                            title: c.title,
                            treatment: c.treatment,
                            beforeImageUrl: c.beforeImageUrl,
                            afterImageUrl: c.afterImageUrl,
                            beforeAlt: c.beforeAlt ?? "",
                            afterAlt: c.afterAlt ?? "",
                            caption: c.caption ?? "",
                            displayOrder: c.displayOrder,
                            isFeatured: c.isFeatured,
                          }}
                          onSave={(data) => handleUpdate(c._id, data)}
                          onCancel={() => setEditingId(null)}
                          onDelete={() => handleDelete(c._id)}
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
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 4,
  fontSize: 13,
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: 0.4,
  color: "#111827",
};

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

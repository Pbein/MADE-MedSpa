"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

interface MembershipFormData {
  name: string;
  price: number;
  billingPeriod: string;
  tagline: string;
  benefits: string[];
  isFeatured: boolean;
  pabauLink: string;
  sortOrder: number;
}

const emptyForm: MembershipFormData = {
  name: "",
  price: 0,
  billingPeriod: "mo",
  tagline: "",
  benefits: [""],
  isFeatured: false,
  pabauLink: "",
  sortOrder: 0,
};

function MembershipForm({
  initial,
  onSave,
  onCancel,
  onDelete,
  saving,
}: {
  initial: MembershipFormData;
  onSave: (data: MembershipFormData) => void;
  onCancel: () => void;
  onDelete?: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<MembershipFormData>(initial);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const addBenefit = () => setForm({ ...form, benefits: [...form.benefits, ""] });
  const removeBenefit = (i: number) =>
    setForm({ ...form, benefits: form.benefits.filter((_, j) => j !== i) });
  const updateBenefit = (i: number, val: string) =>
    setForm({
      ...form,
      benefits: form.benefits.map((b, j) => (j === i ? val : b)),
    });

  return (
    <div
      className="rounded-lg border p-4"
      style={{ borderColor: "#e5e7eb", backgroundColor: "#f9fafb" }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-[13px] font-medium uppercase tracking-wider" style={{ color: "#111827" }}>
            Tier Name *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. WELL MADE"
            className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-[13px] font-medium uppercase tracking-wider" style={{ color: "#111827" }}>
              Price *
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
              style={{ borderColor: "#e5e7eb" }}
            />
          </div>
          <div className="w-28">
            <label className="mb-1 block text-[13px] font-medium uppercase tracking-wider" style={{ color: "#111827" }}>
              Period
            </label>
            <select
              value={form.billingPeriod}
              onChange={(e) => setForm({ ...form, billingPeriod: e.target.value })}
              className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
              style={{ borderColor: "#e5e7eb" }}
            >
              <option value="mo">Monthly</option>
              <option value="yr">Yearly</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[13px] font-medium uppercase tracking-wider" style={{ color: "#111827" }}>
            Tagline *
          </label>
          <input
            type="text"
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            placeholder="e.g. The journey starts here"
            className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>

        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="mb-1 block text-[13px] font-medium uppercase tracking-wider" style={{ color: "#111827" }}>
              Sort Order
            </label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
              className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
              style={{ borderColor: "#e5e7eb" }}
            />
          </div>
          <label className="flex items-center gap-2 pb-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              className="h-4 w-4"
            />
            <span className="text-[13px] font-medium" style={{ color: "#111827" }}>
              Featured
            </span>
          </label>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-[13px] font-medium uppercase tracking-wider" style={{ color: "#111827" }}>
            Pabau Link
          </label>
          <input
            type="url"
            value={form.pabauLink}
            onChange={(e) => setForm({ ...form, pabauLink: e.target.value })}
            placeholder="https://partner.pabau.com/..."
            className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-[13px] font-medium uppercase tracking-wider" style={{ color: "#111827" }}>
            Benefits
          </label>
          <div className="space-y-2">
            {form.benefits.map((benefit, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => updateBenefit(i, e.target.value)}
                  placeholder="e.g. 10% off all services"
                  className="flex-1 rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
                  style={{ borderColor: "#e5e7eb" }}
                />
                {form.benefits.length > 1 && (
                  <button
                    onClick={() => removeBenefit(i)}
                    className="rounded-md px-2 text-[13px] transition-colors hover:bg-red-50"
                    style={{ color: "#dc2626" }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addBenefit}
            className="mt-2 text-[13px] font-medium transition-colors hover:underline"
            style={{ color: "#6366f1" }}
          >
            + Add benefit
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          {onDelete && (
            <>
              {confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-[13px]" style={{ color: "#374151" }}>Are you sure?</span>
                  <button onClick={onDelete} disabled={saving} className="rounded-md px-3 py-1 text-[13px] text-white" style={{ backgroundColor: "#dc2626" }}>
                    Yes, delete
                  </button>
                  <button onClick={() => setConfirmDelete(false)} className="rounded-md px-3 py-1 text-[13px]" style={{ color: "#374151", border: "1px solid #e5e7eb" }}>
                    No
                  </button>
                </div>
              ) : (
                <button onClick={() => setConfirmDelete(true)} className="rounded-md px-3 py-1 text-[13px] transition-colors hover:underline" style={{ color: "#dc2626" }}>
                  Delete
                </button>
              )}
            </>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} disabled={saving} className="rounded-md border px-4 py-1.5 text-[15px] transition-colors" style={{ borderColor: "#e5e7eb", color: "#374151" }}>
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.name.trim() || !form.tagline.trim() || form.price <= 0}
            className="rounded-md px-4 py-1.5 text-[15px] text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: "#6366f1" }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminMembershipsPage() {
  const memberships = useQuery(api.memberships.listAll);
  const createMembership = useMutation(api.memberships.create);
  const updateMembership = useMutation(api.memberships.update);
  const removeMembership = useMutation(api.memberships.remove);
  const toggleActive = useMutation(api.memberships.toggleActive);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<Id<"memberships"> | null>(null);
  const [saving, setSaving] = useState(false);

  const nextSortOrder = memberships
    ? Math.max(0, ...memberships.map((m) => m.sortOrder)) + 1
    : 0;

  async function handleCreate(data: MembershipFormData) {
    setSaving(true);
    try {
      await createMembership({
        name: data.name.trim(),
        price: data.price,
        billingPeriod: data.billingPeriod,
        tagline: data.tagline.trim(),
        benefits: data.benefits.filter((b) => b.trim()),
        isFeatured: data.isFeatured,
        pabauLink: data.pabauLink.trim() || undefined,
        sortOrder: data.sortOrder,
      });
      setShowCreateForm(false);
      toast.success(`Created "${data.name.trim()}"`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Couldn't create membership: ${message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: Id<"memberships">, data: MembershipFormData) {
    setSaving(true);
    try {
      await updateMembership({
        id,
        name: data.name.trim(),
        price: data.price,
        billingPeriod: data.billingPeriod,
        tagline: data.tagline.trim(),
        benefits: data.benefits.filter((b) => b.trim()),
        isFeatured: data.isFeatured,
        pabauLink: data.pabauLink.trim() || undefined,
        sortOrder: data.sortOrder,
      });
      setEditingId(null);
      toast.success(`Saved "${data.name.trim()}"`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Couldn't save membership: ${message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: Id<"memberships">) {
    setSaving(true);
    try {
      await removeMembership({ id });
      setEditingId(null);
      toast.success("Membership deleted");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Couldn't delete membership: ${message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "#111827" }}>
            Memberships
          </h1>
          <p className="text-[15px]" style={{ color: "#6b7280" }}>
            Manage membership tiers displayed on the website.
          </p>
        </div>
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="rounded-md px-4 py-2 text-[15px] text-white transition-colors"
            style={{ backgroundColor: "#6366f1" }}
          >
            + Add Tier
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="mb-6">
          <MembershipForm
            initial={{ ...emptyForm, sortOrder: nextSortOrder }}
            onSave={handleCreate}
            onCancel={() => setShowCreateForm(false)}
            saving={saving}
          />
        </div>
      )}

      {!memberships ? (
        <p className="py-12 text-center text-[15px]" style={{ color: "#9ca3af" }}>
          Loading...
        </p>
      ) : memberships.length === 0 && !showCreateForm ? (
        <p className="py-12 text-center text-[15px]" style={{ color: "#9ca3af" }}>
          No membership tiers yet. Click &ldquo;+ Add Tier&rdquo; to create one.
        </p>
      ) : (
        <div className="space-y-3">
          {memberships.map((m) =>
            editingId === m._id ? (
              <MembershipForm
                key={m._id}
                initial={{
                  name: m.name,
                  price: m.price,
                  billingPeriod: m.billingPeriod,
                  tagline: m.tagline,
                  benefits: m.benefits.length > 0 ? m.benefits : [""],
                  isFeatured: m.isFeatured,
                  pabauLink: m.pabauLink || "",
                  sortOrder: m.sortOrder,
                }}
                onSave={(data) => handleUpdate(m._id, data)}
                onCancel={() => setEditingId(null)}
                onDelete={() => handleDelete(m._id)}
                saving={saving}
              />
            ) : (
              <div
                key={m._id}
                className="flex items-center justify-between rounded-lg border p-4 transition-colors"
                style={{
                  borderColor: "#e5e7eb",
                  opacity: m.isActive ? 1 : 0.5,
                }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-[13px] font-mono" style={{ color: "#9ca3af" }}>
                    #{m.sortOrder}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-semibold" style={{ color: "#111827" }}>
                        {m.name}
                      </span>
                      {m.isFeatured && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                          Featured
                        </span>
                      )}
                      {!m.isActive && (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                          Inactive
                        </span>
                      )}
                    </div>
                    <span className="text-[13px]" style={{ color: "#6b7280" }}>
                      ${m.price}/{m.billingPeriod} &middot; {m.benefits.length} benefits
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive({ id: m._id })}
                    className="rounded-md px-3 py-1 text-[13px] transition-colors"
                    style={{ color: m.isActive ? "#6b7280" : "#059669", border: "1px solid #e5e7eb" }}
                  >
                    {m.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => setEditingId(m._id)}
                    className="rounded-md px-3 py-1 text-[13px] text-white transition-colors"
                    style={{ backgroundColor: "#6366f1" }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

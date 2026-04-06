"use client";

import { useState, useMemo, Fragment } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

interface ServiceFormData {
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  duration: string;
  priceRange: string;
  imageUrl: string;
  sortOrder: number;
}

const emptyForm: ServiceFormData = {
  name: "",
  slug: "",
  shortDescription: "",
  fullDescription: "",
  category: "Injectables",
  duration: "",
  priceRange: "",
  imageUrl: "",
  sortOrder: 0,
};

const categories = ["Injectables", "Skin", "Body", "Wellness"];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function ServiceForm({
  initial,
  onSave,
  onCancel,
  onDelete,
  saving,
}: {
  initial: ServiceFormData;
  onSave: (data: ServiceFormData) => void;
  onCancel: () => void;
  onDelete?: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<ServiceFormData>(initial);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!initial.slug);

  const updateName = (name: string) => {
    if (autoSlug) {
      setForm({ ...form, name, slug: generateSlug(name) });
    } else {
      setForm({ ...form, name });
    }
  };

  return (
    <div
      className="rounded-lg border p-4"
      style={{
        borderColor: "#e5e7eb",
        backgroundColor: "#f9fafb",
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Name */}
        <div>
          <label
            className="mb-1 block text-[13px] font-medium uppercase tracking-wider"
            style={{ color: "#111827" }}
          >
            Name *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateName(e.target.value)}
            placeholder="e.g. Botox Cosmetic"
            className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>

        {/* Slug */}
        <div>
          <label
            className="mb-1 block text-[13px] font-medium uppercase tracking-wider"
            style={{ color: "#111827" }}
          >
            Slug
          </label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => {
              setAutoSlug(false);
              setForm({ ...form, slug: e.target.value });
            }}
            placeholder="auto-generated-from-name"
            className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>

        {/* Category */}
        <div>
          <label
            className="mb-1 block text-[13px] font-medium uppercase tracking-wider"
            style={{ color: "#111827" }}
          >
            Category *
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label
            className="mb-1 block text-[13px] font-medium uppercase tracking-wider"
            style={{ color: "#111827" }}
          >
            Sort Order
          </label>
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) =>
              setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })
            }
            className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>

        {/* Duration */}
        <div>
          <label
            className="mb-1 block text-[13px] font-medium uppercase tracking-wider"
            style={{ color: "#111827" }}
          >
            Duration
          </label>
          <input
            type="text"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            placeholder="e.g. 30 minutes"
            className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>

        {/* Price Range */}
        <div>
          <label
            className="mb-1 block text-[13px] font-medium uppercase tracking-wider"
            style={{ color: "#111827" }}
          >
            Price Range
          </label>
          <input
            type="text"
            value={form.priceRange}
            onChange={(e) => setForm({ ...form, priceRange: e.target.value })}
            placeholder="e.g. $250 - $600"
            className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>

        {/* Image URL */}
        <div className="sm:col-span-2">
          <label
            className="mb-1 block text-[13px] font-medium uppercase tracking-wider"
            style={{ color: "#111827" }}
          >
            Image URL
          </label>
          <input
            type="text"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="https://..."
            className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>

        {/* Short Description */}
        <div className="sm:col-span-2">
          <label
            className="mb-1 block text-[13px] font-medium uppercase tracking-wider"
            style={{ color: "#111827" }}
          >
            Short Description *
          </label>
          <textarea
            value={form.shortDescription}
            onChange={(e) =>
              setForm({ ...form, shortDescription: e.target.value })
            }
            rows={2}
            placeholder="Brief summary shown on service cards..."
            className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>

        {/* Full Description */}
        <div className="sm:col-span-2">
          <label
            className="mb-1 block text-[13px] font-medium uppercase tracking-wider"
            style={{ color: "#111827" }}
          >
            Full Description *
          </label>
          <textarea
            value={form.fullDescription}
            onChange={(e) =>
              setForm({ ...form, fullDescription: e.target.value })
            }
            rows={5}
            placeholder="Detailed description shown on the service detail page..."
            className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          {onDelete && (
            <>
              {confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span
                    className="text-[13px]"
                    style={{ color: "#374151" }}
                  >
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
                    style={{
                      color: "#374151",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="rounded-md px-3 py-1 text-[13px] transition-colors hover:underline"
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
            className="rounded-md border px-4 py-1.5 text-[15px] transition-colors"
            style={{
              borderColor: "#e5e7eb",
              color: "#374151",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={
              saving ||
              !form.name.trim() ||
              !form.shortDescription.trim() ||
              !form.fullDescription.trim()
            }
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

export default function AdminServicesPage() {
  const services = useQuery(api.services.listAll);
  const createService = useMutation(api.services.create);
  const updateService = useMutation(api.services.update);
  const removeService = useMutation(api.services.remove);
  const toggleActive = useMutation(api.services.toggleActive);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<Id<"services"> | null>(null);
  const [saving, setSaving] = useState(false);

  const activeCats = useMemo(() => {
    if (!services) return [];
    return Array.from(new Set(services.map((s) => s.category))).sort();
  }, [services]);

  const filtered = useMemo(() => {
    if (!services) return [];
    let list = services;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "all") {
      list = list.filter((s) => s.category === categoryFilter);
    }

    return list;
  }, [services, search, categoryFilter]);

  const nextSortOrder = services
    ? Math.max(0, ...services.map((s) => s.sortOrder)) + 1
    : 0;

  async function handleCreate(data: ServiceFormData) {
    setSaving(true);
    try {
      await createService({
        name: data.name.trim(),
        slug: data.slug.trim() || generateSlug(data.name),
        shortDescription: data.shortDescription.trim(),
        fullDescription: data.fullDescription.trim(),
        category: data.category,
        duration: data.duration.trim() || undefined,
        priceRange: data.priceRange.trim() || undefined,
        imageUrl: data.imageUrl.trim() || undefined,
        sortOrder: data.sortOrder,
      });
      setShowCreateForm(false);
    } catch (err) {
      console.error("Failed to create service:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: Id<"services">, data: ServiceFormData) {
    setSaving(true);
    try {
      await updateService({
        id,
        name: data.name.trim(),
        slug: data.slug.trim() || generateSlug(data.name),
        shortDescription: data.shortDescription.trim(),
        fullDescription: data.fullDescription.trim(),
        category: data.category,
        duration: data.duration.trim() || undefined,
        priceRange: data.priceRange.trim() || undefined,
        imageUrl: data.imageUrl.trim() || undefined,
        sortOrder: data.sortOrder,
      });
      setEditingId(null);
    } catch (err) {
      console.error("Failed to update service:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: Id<"services">) {
    setSaving(true);
    try {
      await removeService({ id });
      setEditingId(null);
    } catch (err) {
      console.error("Failed to delete service:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(id: Id<"services">) {
    try {
      await toggleActive({ id });
    } catch (err) {
      console.error("Failed to toggle service status:", err);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1
          className="text-2xl font-semibold"
          style={{ color: "#111827" }}
        >
          Services{" "}
          <span
            className="text-base font-normal"
            style={{ color: "#6b7280" }}
          >
            ({filtered.length})
          </span>
        </h1>
        <button
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setEditingId(null);
          }}
          className="rounded-md px-4 py-2 text-[15px] text-white"
          style={{ backgroundColor: "#6366f1" }}
        >
          {showCreateForm ? "Cancel" : "+ Add Service"}
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="mb-6">
          <h2
            className="mb-3 text-[15px] font-semibold uppercase tracking-wider"
            style={{ color: "#111827" }}
          >
            New Service
          </h2>
          <ServiceForm
            initial={{ ...emptyForm, sortOrder: nextSortOrder }}
            onSave={handleCreate}
            onCancel={() => setShowCreateForm(false)}
            saving={saving}
          />
        </div>
      )}

      {/* Search + Category Filter */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
          style={{
            borderColor: "#e5e7eb",
            maxWidth: "300px",
            width: "100%",
          }}
        />
        <div className="flex gap-2">
          <button
            onClick={() => setCategoryFilter("all")}
            className="rounded-full px-3 py-1 text-[13px] capitalize transition-colors"
            style={{
              backgroundColor:
                categoryFilter === "all"
                  ? "#6366f1"
                  : "#fff",
              color:
                categoryFilter === "all" ? "white" : "#374151",
              border: `1px solid ${categoryFilter === "all" ? "#4f46e5" : "#e5e7eb"}`,
            }}
          >
            All
          </button>
          {activeCats.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className="rounded-full px-3 py-1 text-[13px] capitalize transition-colors"
              style={{
                backgroundColor:
                  categoryFilter === cat
                    ? "#6366f1"
                    : "#fff",
                color:
                  categoryFilter === cat ? "white" : "#374151",
                border: `1px solid ${categoryFilter === cat ? "#4f46e5" : "#e5e7eb"}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {!services && (
        <div
          className="py-12 text-center"
          style={{ color: "#6b7280" }}
        >
          Loading...
        </div>
      )}

      {/* Empty state */}
      {services && filtered.length === 0 && (
        <div
          className="py-12 text-center"
          style={{ color: "#6b7280" }}
        >
          No services found.
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div
          className="overflow-hidden rounded-lg border"
          style={{ borderColor: "#e5e7eb" }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "#e5e7eb" }}>
                <th
                  className="px-4 py-3 text-left text-[13px] font-medium uppercase tracking-wider"
                  style={{ color: "#111827" }}
                >
                  Name
                </th>
                <th
                  className="hidden px-4 py-3 text-left text-[13px] font-medium uppercase tracking-wider sm:table-cell"
                  style={{ color: "#111827" }}
                >
                  Category
                </th>
                <th
                  className="hidden px-4 py-3 text-left text-[13px] font-medium uppercase tracking-wider md:table-cell"
                  style={{ color: "#111827" }}
                >
                  Price
                </th>
                <th
                  className="hidden px-4 py-3 text-left text-[13px] font-medium uppercase tracking-wider md:table-cell"
                  style={{ color: "#111827" }}
                >
                  Duration
                </th>
                <th
                  className="px-4 py-3 text-left text-[13px] font-medium uppercase tracking-wider"
                  style={{ color: "#111827" }}
                >
                  Status
                </th>
                <th
                  className="px-4 py-3 text-right text-[13px] font-medium uppercase tracking-wider"
                  style={{ color: "#111827" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((service, i) => (
                <Fragment key={service._id}>
                  <tr
                    style={{
                      backgroundColor:
                        i % 2 === 0
                          ? "#fff"
                          : "#f9fafb",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <td className="px-4 py-3">
                      <p
                        className="text-[15px] font-medium"
                        style={{ color: "#111827" }}
                      >
                        {service.name}
                      </p>
                      <p
                        className="mt-0.5 text-[13px] line-clamp-1 sm:hidden"
                        style={{ color: "#6b7280" }}
                      >
                        {service.category} · {service.priceRange || "---"}
                      </p>
                    </td>
                    <td
                      className="hidden px-4 py-3 text-[15px] capitalize sm:table-cell"
                      style={{ color: "#374151" }}
                    >
                      {service.category}
                    </td>
                    <td
                      className="hidden px-4 py-3 text-[15px] md:table-cell"
                      style={{ color: "#374151" }}
                    >
                      {service.priceRange || "---"}
                    </td>
                    <td
                      className="hidden px-4 py-3 text-[15px] md:table-cell"
                      style={{ color: "#374151" }}
                    >
                      {service.duration || "---"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(service._id)}
                        title="Click to toggle active status"
                        className="inline-flex cursor-pointer rounded-full px-2 py-0.5 text-[13px] transition-opacity hover:opacity-80"
                        style={{
                          backgroundColor: service.isActive
                            ? "#dcfce7"
                            : "#f3f4f6",
                          color: service.isActive ? "#166534" : "#6b7280",
                        }}
                      >
                        {service.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          setEditingId(
                            editingId === service._id ? null : service._id
                          );
                          setShowCreateForm(false);
                        }}
                        className="text-[15px] transition-colors hover:underline"
                        style={{ color: "#4f46e5" }}
                      >
                        {editingId === service._id ? "Cancel" : "Edit"}
                      </button>
                    </td>
                  </tr>

                  {/* Inline Edit Form */}
                  {editingId === service._id && (
                    <tr key={`${service._id}-edit`}>
                      <td colSpan={6} className="px-4 py-3">
                        <ServiceForm
                          initial={{
                            name: service.name,
                            slug: service.slug,
                            shortDescription: service.shortDescription,
                            fullDescription: service.fullDescription,
                            category: service.category,
                            duration: service.duration || "",
                            priceRange: service.priceRange || "",
                            imageUrl: service.imageUrl || "",
                            sortOrder: service.sortOrder,
                          }}
                          onSave={(data) => handleUpdate(service._id, data)}
                          onCancel={() => setEditingId(null)}
                          onDelete={() => handleDelete(service._id)}
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

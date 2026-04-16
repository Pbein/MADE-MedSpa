"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import ImageUpload from "@/components/admin/ImageUpload";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  pabauLink: string;
  sortOrder: number;
}

const emptyForm: ProductFormData = {
  name: "",
  description: "",
  price: 0,
  category: "Skincare",
  imageUrl: "",
  pabauLink: "",
  sortOrder: 0,
};

const defaultCategories = ["Skincare", "Supplements", "Tools & Devices", "Gift Cards", "Bundles"];

function ProductForm({
  initial,
  onSave,
  onCancel,
  onDelete,
  saving,
  categories,
}: {
  initial: ProductFormData;
  onSave: (data: ProductFormData) => void;
  onCancel: () => void;
  onDelete?: () => void;
  saving: boolean;
  categories: string[];
}) {
  const [form, setForm] = useState<ProductFormData>(initial);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [customCategory, setCustomCategory] = useState(false);

  return (
    <div
      className="rounded-lg border p-4"
      style={{ borderColor: "#e5e7eb", backgroundColor: "#f9fafb" }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-[13px] font-medium uppercase tracking-wider" style={{ color: "#111827" }}>
            Product Name *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. SkinCeuticals C E Ferulic"
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
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
              style={{ borderColor: "#e5e7eb" }}
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-[13px] font-medium uppercase tracking-wider" style={{ color: "#111827" }}>
              Category *
            </label>
            {customCategory ? (
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="New category"
                className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
                style={{ borderColor: "#e5e7eb" }}
              />
            ) : (
              <select
                value={form.category}
                onChange={(e) => {
                  if (e.target.value === "__custom__") {
                    setCustomCategory(true);
                    setForm({ ...form, category: "" });
                  } else {
                    setForm({ ...form, category: e.target.value });
                  }
                }}
                className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
                style={{ borderColor: "#e5e7eb" }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="__custom__">+ New category</option>
              </select>
            )}
          </div>
        </div>

        <div>
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

        <div>
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
          <ImageUpload
            label="Product Image"
            value={form.imageUrl}
            onChange={(url) => setForm({ ...form, imageUrl: url })}
            aspect="1/1"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-[13px] font-medium uppercase tracking-wider" style={{ color: "#111827" }}>
            Description *
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            placeholder="Product description..."
            className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          />
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
            disabled={saving || !form.name.trim() || !form.description.trim() || form.price <= 0}
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

export default function AdminShopPage() {
  const products = useQuery(api.shopProducts.listAll);
  const createProduct = useMutation(api.shopProducts.create);
  const updateProduct = useMutation(api.shopProducts.update);
  const removeProduct = useMutation(api.shopProducts.remove);
  const toggleActive = useMutation(api.shopProducts.toggleActive);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<Id<"shopProducts"> | null>(null);
  const [saving, setSaving] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");

  const allCategories = useMemo(() => {
    if (!products) return defaultCategories;
    const fromProducts = products.map((p) => p.category);
    return Array.from(new Set([...defaultCategories, ...fromProducts])).sort();
  }, [products]);

  const filtered = useMemo(() => {
    if (!products) return [];
    if (categoryFilter === "all") return products;
    return products.filter((p) => p.category === categoryFilter);
  }, [products, categoryFilter]);

  const nextSortOrder = products
    ? Math.max(0, ...products.map((p) => p.sortOrder)) + 1
    : 0;

  async function handleCreate(data: ProductFormData) {
    setSaving(true);
    try {
      await createProduct({
        name: data.name.trim(),
        description: data.description.trim(),
        price: data.price,
        category: data.category.trim(),
        imageUrl: data.imageUrl.trim() || undefined,
        pabauLink: data.pabauLink.trim() || undefined,
        sortOrder: data.sortOrder,
      });
      setShowCreateForm(false);
    } catch (err) {
      console.error("Failed to create product:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: Id<"shopProducts">, data: ProductFormData) {
    setSaving(true);
    try {
      await updateProduct({
        id,
        name: data.name.trim(),
        description: data.description.trim(),
        price: data.price,
        category: data.category.trim(),
        imageUrl: data.imageUrl.trim() || undefined,
        pabauLink: data.pabauLink.trim() || undefined,
        sortOrder: data.sortOrder,
      });
      setEditingId(null);
    } catch (err) {
      console.error("Failed to update product:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: Id<"shopProducts">) {
    setSaving(true);
    try {
      await removeProduct({ id });
      setEditingId(null);
    } catch (err) {
      console.error("Failed to delete product:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "#111827" }}>
            Shop Products
          </h1>
          <p className="text-[15px]" style={{ color: "#6b7280" }}>
            Manage products displayed in the online shop.
          </p>
        </div>
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="rounded-md px-4 py-2 text-[15px] text-white transition-colors"
            style={{ backgroundColor: "#6366f1" }}
          >
            + Add Product
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="mb-6">
          <ProductForm
            initial={{ ...emptyForm, sortOrder: nextSortOrder }}
            onSave={handleCreate}
            onCancel={() => setShowCreateForm(false)}
            saving={saving}
            categories={allCategories}
          />
        </div>
      )}

      {products && products.length > 0 && (
        <div className="mb-4 flex gap-2 flex-wrap">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`rounded-md px-3 py-1 text-[13px] transition-colors ${categoryFilter === "all" ? "text-white" : ""}`}
            style={{
              backgroundColor: categoryFilter === "all" ? "#6366f1" : "transparent",
              color: categoryFilter === "all" ? "white" : "#6b7280",
              border: categoryFilter === "all" ? "none" : "1px solid #e5e7eb",
            }}
          >
            All
          </button>
          {allCategories
            .filter((c) => products.some((p) => p.category === c))
            .map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className="rounded-md px-3 py-1 text-[13px] transition-colors"
                style={{
                  backgroundColor: categoryFilter === cat ? "#6366f1" : "transparent",
                  color: categoryFilter === cat ? "white" : "#6b7280",
                  border: categoryFilter === cat ? "none" : "1px solid #e5e7eb",
                }}
              >
                {cat}
              </button>
            ))}
        </div>
      )}

      {!products ? (
        <p className="py-12 text-center text-[15px]" style={{ color: "#9ca3af" }}>
          Loading...
        </p>
      ) : filtered.length === 0 && !showCreateForm ? (
        <p className="py-12 text-center text-[15px]" style={{ color: "#9ca3af" }}>
          {products.length === 0
            ? 'No products yet. Click "+ Add Product" to create one.'
            : "No products in this category."}
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) =>
            editingId === p._id ? (
              <ProductForm
                key={p._id}
                initial={{
                  name: p.name,
                  description: p.description,
                  price: p.price,
                  category: p.category,
                  imageUrl: p.imageUrl || "",
                  pabauLink: p.pabauLink || "",
                  sortOrder: p.sortOrder,
                }}
                onSave={(data) => handleUpdate(p._id, data)}
                onCancel={() => setEditingId(null)}
                onDelete={() => handleDelete(p._id)}
                saving={saving}
                categories={allCategories}
              />
            ) : (
              <div
                key={p._id}
                className="flex items-center justify-between rounded-lg border p-4 transition-colors"
                style={{
                  borderColor: "#e5e7eb",
                  opacity: p.isActive ? 1 : 0.5,
                }}
              >
                <div className="flex items-center gap-4">
                  {p.imageUrl && (
                    <div
                      className="h-12 w-12 rounded bg-cover bg-center shrink-0"
                      style={{ backgroundImage: `url(${p.imageUrl})` }}
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-semibold" style={{ color: "#111827" }}>
                        {p.name}
                      </span>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                        {p.category}
                      </span>
                      {!p.isActive && (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                          Inactive
                        </span>
                      )}
                    </div>
                    <span className="text-[13px]" style={{ color: "#6b7280" }}>
                      ${p.price.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive({ id: p._id })}
                    className="rounded-md px-3 py-1 text-[13px] transition-colors"
                    style={{ color: p.isActive ? "#6b7280" : "#059669", border: "1px solid #e5e7eb" }}
                  >
                    {p.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => setEditingId(p._id)}
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

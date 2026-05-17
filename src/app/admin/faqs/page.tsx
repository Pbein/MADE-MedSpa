"use client";

import { useState, Fragment } from "react";
import { useQuery, useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

interface FaqFormData {
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
}

const emptyForm: FaqFormData = {
  question: "",
  answer: "",
  category: "",
  sortOrder: 0,
};

function FaqForm({
  initial,
  onSave,
  onCancel,
  onDelete,
  saving,
}: {
  initial: FaqFormData;
  onSave: (data: FaqFormData) => void;
  onCancel: () => void;
  onDelete?: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<FaqFormData>(initial);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div
      className="rounded-lg border p-4"
      style={{
        borderColor: "#e5e7eb",
        backgroundColor: "#f9fafb",
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            className="mb-1 block text-[13px] font-medium uppercase tracking-wider"
            style={{ color: "#111827" }}
          >
            Question
          </label>
          <textarea
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            rows={2}
            className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>
        <div className="sm:col-span-2">
          <label
            className="mb-1 block text-[13px] font-medium uppercase tracking-wider"
            style={{ color: "#111827" }}
          >
            Answer
          </label>
          <textarea
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            rows={3}
            className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>
        <div>
          <label
            className="mb-1 block text-[13px] font-medium uppercase tracking-wider"
            style={{ color: "#111827" }}
          >
            Category
          </label>
          <input
            type="text"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="e.g. General, Membership, Services"
            className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>
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
            disabled={saving || !form.question.trim() || !form.answer.trim()}
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

export default function AdminFaqsPage() {
  const faqs = useQuery(api.faqs.listAll);
  const createFaq = useMutation(api.faqs.create);
  const updateFaq = useMutation(api.faqs.update);
  const removeFaq = useMutation(api.faqs.remove);
  const toggleActive = useMutation(api.faqs.toggleActive);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<Id<"faqs"> | null>(null);
  const [saving, setSaving] = useState(false);

  const categories = faqs
    ? ["all", ...new Set(faqs.map((f) => f.category || "General"))]
    : ["all"];

  const filtered =
    faqs
      ?.filter((f) => {
        const matchesSearch =
          !search ||
          f.question.toLowerCase().includes(search.toLowerCase()) ||
          f.answer.toLowerCase().includes(search.toLowerCase());
        const matchesCategory =
          categoryFilter === "all" ||
          (f.category || "General") === categoryFilter;
        return matchesSearch && matchesCategory;
      }) ?? [];

  const nextSortOrder = faqs ? Math.max(0, ...faqs.map((f) => f.sortOrder)) + 1 : 0;

  async function handleCreate(data: FaqFormData) {
    setSaving(true);
    try {
      await createFaq({
        question: data.question.trim(),
        answer: data.answer.trim(),
        category: data.category.trim() || undefined,
        sortOrder: data.sortOrder,
      });
      setShowCreateForm(false);
      toast.success("FAQ created");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Couldn't create FAQ: ${message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: Id<"faqs">, data: FaqFormData) {
    setSaving(true);
    try {
      await updateFaq({
        id,
        question: data.question.trim(),
        answer: data.answer.trim(),
        category: data.category.trim() || undefined,
        sortOrder: data.sortOrder,
      });
      setEditingId(null);
      toast.success("FAQ saved");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Couldn't save FAQ: ${message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: Id<"faqs">) {
    setSaving(true);
    try {
      await removeFaq({ id });
      setEditingId(null);
      toast.success("FAQ deleted");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Couldn't delete FAQ: ${message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(id: Id<"faqs">) {
    try {
      await toggleActive({ id });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Couldn't change status: ${message}`);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1
          className="text-2xl font-semibold"
          style={{ color: "#111827" }}
        >
          FAQs{" "}
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
          {showCreateForm ? "Cancel" : "Add FAQ"}
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6">
          <h2
            className="mb-3 text-[15px] font-semibold uppercase tracking-wider"
            style={{ color: "#111827" }}
          >
            New FAQ
          </h2>
          <FaqForm
            initial={{ ...emptyForm, sortOrder: nextSortOrder }}
            onSave={handleCreate}
            onCancel={() => setShowCreateForm(false)}
            saving={saving}
          />
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search FAQs..."
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
          {categories.map((cat) => (
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

      {!faqs && (
        <div
          className="py-12 text-center"
          style={{ color: "#6b7280" }}
        >
          Loading...
        </div>
      )}

      {faqs && filtered.length === 0 && (
        <div
          className="py-12 text-center"
          style={{ color: "#6b7280" }}
        >
          No FAQs found.
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
                <th
                  className="px-4 py-3 text-left text-[13px] font-medium uppercase tracking-wider"
                  style={{ color: "#111827" }}
                >
                  Question
                </th>
                <th
                  className="px-4 py-3 text-left text-[13px] font-medium uppercase tracking-wider"
                  style={{ color: "#111827" }}
                >
                  Category
                </th>
                <th
                  className="px-4 py-3 text-left text-[13px] font-medium uppercase tracking-wider"
                  style={{ color: "#111827" }}
                >
                  Status
                </th>
                <th
                  className="px-4 py-3 text-left text-[13px] font-medium uppercase tracking-wider"
                  style={{ color: "#111827" }}
                >
                  Order
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
              {filtered.map((faq, i) => (
                <Fragment key={faq._id}>
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
                        {faq.question}
                      </p>
                      <p
                        className="mt-1 text-[13px] line-clamp-1"
                        style={{ color: "#6b7280" }}
                      >
                        {faq.answer}
                      </p>
                    </td>
                    <td
                      className="px-4 py-3 text-[15px]"
                      style={{ color: "#374151" }}
                    >
                      {faq.category || "General"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(faq._id)}
                        title="Click to toggle active status"
                        className="inline-flex cursor-pointer rounded-full px-2 py-0.5 text-[13px] transition-opacity hover:opacity-80"
                        style={{
                          backgroundColor: faq.isActive
                            ? "#dcfce7"
                            : "#f3f4f6",
                          color: faq.isActive ? "#166534" : "#6b7280",
                        }}
                      >
                        {faq.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td
                      className="px-4 py-3 text-[15px]"
                      style={{ color: "#374151" }}
                    >
                      {faq.sortOrder}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          setEditingId(
                            editingId === faq._id ? null : faq._id
                          );
                          setShowCreateForm(false);
                        }}
                        className="text-[15px] transition-colors hover:underline"
                        style={{ color: "#4f46e5" }}
                      >
                        {editingId === faq._id ? "Cancel" : "Edit"}
                      </button>
                    </td>
                  </tr>
                  {editingId === faq._id && (
                    <tr key={`${faq._id}-edit`}>
                      <td colSpan={5} className="px-4 py-3">
                        <FaqForm
                          initial={{
                            question: faq.question,
                            answer: faq.answer,
                            category: faq.category || "",
                            sortOrder: faq.sortOrder,
                          }}
                          onSave={(data) => handleUpdate(faq._id, data)}
                          onCancel={() => setEditingId(null)}
                          onDelete={() => handleDelete(faq._id)}
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

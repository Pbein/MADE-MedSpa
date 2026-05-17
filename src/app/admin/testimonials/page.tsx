"use client";

import { useState, Fragment } from "react";
import { useQuery, useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

interface TestimonialFormData {
  name: string;
  quote: string;
  treatment: string;
  sortOrder: number;
}

const emptyForm: TestimonialFormData = {
  name: "",
  quote: "",
  treatment: "",
  sortOrder: 0,
};

function TestimonialForm({
  initial,
  onSave,
  onCancel,
  onDelete,
  saving,
}: {
  initial: TestimonialFormData;
  onSave: (data: TestimonialFormData) => void;
  onCancel: () => void;
  onDelete?: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<TestimonialFormData>(initial);
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
        <div>
          <label
            className="mb-1 block text-[13px] font-medium uppercase tracking-wider"
            style={{ color: "#111827" }}
          >
            Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>
        <div>
          <label
            className="mb-1 block text-[13px] font-medium uppercase tracking-wider"
            style={{ color: "#111827" }}
          >
            Treatment
          </label>
          <input
            type="text"
            value={form.treatment}
            onChange={(e) => setForm({ ...form, treatment: e.target.value })}
            placeholder="e.g. HydraFacial, Lip Filler"
            className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>
        <div className="sm:col-span-2">
          <label
            className="mb-1 block text-[13px] font-medium uppercase tracking-wider"
            style={{ color: "#111827" }}
          >
            Quote
          </label>
          <textarea
            value={form.quote}
            onChange={(e) => setForm({ ...form, quote: e.target.value })}
            rows={4}
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
            disabled={saving || !form.name.trim() || !form.quote.trim() || !form.treatment.trim()}
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

export default function AdminTestimonialsPage() {
  const testimonials = useQuery(api.testimonials.listAll);
  const createTestimonial = useMutation(api.testimonials.create);
  const updateTestimonial = useMutation(api.testimonials.update);
  const removeTestimonial = useMutation(api.testimonials.remove);
  const toggleActive = useMutation(api.testimonials.toggleActive);

  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<Id<"testimonials"> | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered =
    testimonials
      ?.filter((t) => {
        const matchesSearch =
          !search ||
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.quote.toLowerCase().includes(search.toLowerCase());
        return matchesSearch;
      }) ?? [];

  const nextSortOrder = testimonials
    ? Math.max(0, ...testimonials.map((t) => t.sortOrder)) + 1
    : 0;

  async function handleCreate(data: TestimonialFormData) {
    setSaving(true);
    try {
      await createTestimonial({
        name: data.name.trim(),
        quote: data.quote.trim(),
        treatment: data.treatment.trim(),
        sortOrder: data.sortOrder,
      });
      setShowCreateForm(false);
      toast.success(`Added testimonial from "${data.name.trim()}"`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Couldn't create testimonial: ${message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: Id<"testimonials">, data: TestimonialFormData) {
    setSaving(true);
    try {
      await updateTestimonial({
        id,
        name: data.name.trim(),
        quote: data.quote.trim(),
        treatment: data.treatment.trim(),
        sortOrder: data.sortOrder,
      });
      setEditingId(null);
      toast.success("Testimonial saved");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Couldn't save testimonial: ${message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: Id<"testimonials">) {
    setSaving(true);
    try {
      await removeTestimonial({ id });
      setEditingId(null);
      toast.success("Testimonial deleted");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Couldn't delete testimonial: ${message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(id: Id<"testimonials">) {
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
          Testimonials{" "}
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
          {showCreateForm ? "Cancel" : "Add Testimonial"}
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6">
          <h2
            className="mb-3 text-[15px] font-semibold uppercase tracking-wider"
            style={{ color: "#111827" }}
          >
            New Testimonial
          </h2>
          <TestimonialForm
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
          placeholder="Search testimonials..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
          style={{
            borderColor: "#e5e7eb",
            maxWidth: "300px",
            width: "100%",
          }}
        />
      </div>

      {!testimonials && (
        <div
          className="py-12 text-center"
          style={{ color: "#6b7280" }}
        >
          Loading...
        </div>
      )}

      {testimonials && filtered.length === 0 && (
        <div
          className="py-12 text-center"
          style={{ color: "#6b7280" }}
        >
          No testimonials found.
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
                  Name
                </th>
                <th
                  className="px-4 py-3 text-left text-[13px] font-medium uppercase tracking-wider"
                  style={{ color: "#111827" }}
                >
                  Quote
                </th>
                <th
                  className="px-4 py-3 text-left text-[13px] font-medium uppercase tracking-wider"
                  style={{ color: "#111827" }}
                >
                  Treatment
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
              {filtered.map((testimonial, i) => (
                <Fragment key={testimonial._id}>
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
                        {testimonial.name}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p
                        className="text-[15px]"
                        style={{ color: "#374151" }}
                      >
                        {testimonial.quote.length > 60
                          ? `${testimonial.quote.slice(0, 60)}...`
                          : testimonial.quote}
                      </p>
                    </td>
                    <td
                      className="px-4 py-3 text-[15px]"
                      style={{ color: "#374151" }}
                    >
                      {testimonial.treatment}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(testimonial._id)}
                        title="Click to toggle active status"
                        className="inline-flex cursor-pointer rounded-full px-2 py-0.5 text-[13px] transition-opacity hover:opacity-80"
                        style={{
                          backgroundColor: testimonial.isActive
                            ? "#dcfce7"
                            : "#f3f4f6",
                          color: testimonial.isActive ? "#166534" : "#6b7280",
                        }}
                      >
                        {testimonial.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td
                      className="px-4 py-3 text-[15px]"
                      style={{ color: "#374151" }}
                    >
                      {testimonial.sortOrder}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          setEditingId(
                            editingId === testimonial._id ? null : testimonial._id
                          );
                          setShowCreateForm(false);
                        }}
                        className="text-[15px] transition-colors hover:underline"
                        style={{ color: "#4f46e5" }}
                      >
                        {editingId === testimonial._id ? "Cancel" : "Edit"}
                      </button>
                    </td>
                  </tr>
                  {editingId === testimonial._id && (
                    <tr key={`${testimonial._id}-edit`}>
                      <td colSpan={6} className="px-4 py-3">
                        <TestimonialForm
                          initial={{
                            name: testimonial.name,
                            quote: testimonial.quote,
                            treatment: testimonial.treatment,
                            sortOrder: testimonial.sortOrder,
                          }}
                          onSave={(data) => handleUpdate(testimonial._id, data)}
                          onCancel={() => setEditingId(null)}
                          onDelete={() => handleDelete(testimonial._id)}
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

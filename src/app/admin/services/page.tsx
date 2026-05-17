"use client";

import { useState, useMemo, Fragment } from "react";
import { useQuery, useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import ImageUpload from "@/components/admin/ImageUpload";

interface FaqItem {
  question: string;
  answer: string;
}

interface ExpectStep {
  title: string;
  description: string;
}

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
  // Detail-page enrichment (all optional on the schema)
  downtime: string;
  whoItsFor: string;
  preCareNotes: string;
  postCareNotes: string;
  // Stored as raw textarea string in the form; parsed to string[] on save
  benefitsText: string;
  whatToExpect: ExpectStep[];
  faqs: FaqItem[];
}

const emptyForm: ServiceFormData = {
  name: "",
  slug: "",
  shortDescription: "",
  fullDescription: "",
  category: "",
  duration: "",
  priceRange: "",
  imageUrl: "",
  sortOrder: 0,
  downtime: "",
  whoItsFor: "",
  preCareNotes: "",
  postCareNotes: "",
  benefitsText: "",
  whatToExpect: [],
  faqs: [],
};

function parseBenefits(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function ServiceForm({
  initial,
  categories,
  onSave,
  onCancel,
  onDelete,
  saving,
  pabauSyncedAt,
}: {
  initial: ServiceFormData;
  categories: string[];
  onSave: (data: ServiceFormData) => void;
  onCancel: () => void;
  onDelete?: () => void;
  saving: boolean;
  pabauSyncedAt?: number;
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
      {pabauSyncedAt !== undefined && (
        <div
          style={{
            backgroundColor: "#ede9fe",
            border: "1px solid #ddd6fe",
            color: "#5b21b6",
            padding: "10px 14px",
            borderRadius: 6,
            fontSize: 13,
            marginBottom: 16,
            lineHeight: 1.5,
          }}
        >
          <strong>Synced from Pabau.</strong> Edits to <em>name</em>, <em>price</em>, and
          <em> duration</em> will be overwritten on the next sync. Edit those in Pabau. The
          fields below this banner (image, slug, descriptions, sort order) are
          website-only and safe to change.
          <div style={{ fontSize: 11, marginTop: 4, opacity: 0.8 }}>
            Last synced{" "}
            {pabauSyncedAt
              ? new Date(pabauSyncedAt).toLocaleString()
              : "never"}
          </div>
        </div>
      )}
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
            {form.category && !categories.includes(form.category) && (
              <option value={form.category}>{form.category} (legacy)</option>
            )}
            {!form.category && <option value="">Select a category…</option>}
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

        {/* Service Image */}
        <div className="sm:col-span-2">
          <ImageUpload
            label="Service Image"
            value={form.imageUrl}
            onChange={(url) => setForm({ ...form, imageUrl: url })}
            aspect="4/5"
            purpose="service"
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

        {/* ───── Detail Page Content (all optional) ───── */}
        <div className="sm:col-span-2 mt-2">
          <div
            style={{
              borderTop: "1px solid #e5e7eb",
              paddingTop: 16,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 0.6,
              textTransform: "uppercase",
              color: "#6b7280",
            }}
          >
            Detail page content (optional)
          </div>
          <p
            style={{
              fontSize: 12,
              color: "#6b7280",
              marginTop: 4,
              marginBottom: 0,
              lineHeight: 1.5,
            }}
          >
            These fields enrich the public <code>/services/{form.slug || "[slug]"}</code> page.
            Anything left blank is simply hidden — the page degrades gracefully.
          </p>
        </div>

        {/* Downtime */}
        <div>
          <label
            className="mb-1 block text-[13px] font-medium uppercase tracking-wider"
            style={{ color: "#111827" }}
          >
            Downtime
          </label>
          <input
            type="text"
            value={form.downtime}
            onChange={(e) => setForm({ ...form, downtime: e.target.value })}
            placeholder="e.g. None, 24 hours"
            className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>

        {/* Spacer to balance the row */}
        <div />

        {/* Benefits */}
        <div className="sm:col-span-2">
          <label
            className="mb-1 block text-[13px] font-medium uppercase tracking-wider"
            style={{ color: "#111827" }}
          >
            Benefits (one per line)
          </label>
          <textarea
            value={form.benefitsText}
            onChange={(e) =>
              setForm({ ...form, benefitsText: e.target.value })
            }
            rows={4}
            placeholder={"Smooths fine lines\nNo visible recovery\nResults in 7-14 days"}
            className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>

        {/* Who it's for */}
        <div className="sm:col-span-2">
          <label
            className="mb-1 block text-[13px] font-medium uppercase tracking-wider"
            style={{ color: "#111827" }}
          >
            Who it&apos;s for
          </label>
          <textarea
            value={form.whoItsFor}
            onChange={(e) => setForm({ ...form, whoItsFor: e.target.value })}
            rows={3}
            placeholder="Ideal candidates and what concerns this addresses..."
            className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>

        {/* What to Expect (repeater) */}
        <div className="sm:col-span-2">
          <div className="mb-1 flex items-center justify-between">
            <label
              className="block text-[13px] font-medium uppercase tracking-wider"
              style={{ color: "#111827" }}
            >
              What to Expect (steps)
            </label>
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  whatToExpect: [
                    ...form.whatToExpect,
                    { title: "", description: "" },
                  ],
                })
              }
              className="rounded-md px-2 py-1 text-[12px]"
              style={{ color: "#4f46e5", border: "1px solid #c7d2fe" }}
            >
              + Add step
            </button>
          </div>
          {form.whatToExpect.length === 0 && (
            <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
              No steps yet. Add 3–4 short steps (e.g. Consultation · Treatment · Aftercare · Results).
            </p>
          )}
          <div className="mt-2 space-y-3">
            {form.whatToExpect.map((step, idx) => (
              <div
                key={idx}
                className="rounded-md border p-3"
                style={{ borderColor: "#e5e7eb", backgroundColor: "#fff" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: "#6b7280" }}
                  >
                    Step {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        whatToExpect: form.whatToExpect.filter(
                          (_, i) => i !== idx,
                        ),
                      })
                    }
                    className="text-[12px] hover:underline"
                    style={{ color: "#dc2626" }}
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => {
                    const next = [...form.whatToExpect];
                    next[idx] = { ...next[idx], title: e.target.value };
                    setForm({ ...form, whatToExpect: next });
                  }}
                  placeholder="Title (e.g. Consultation)"
                  className="mb-2 w-full rounded-md border px-2 py-1 text-[14px] outline-none focus:border-[#4f46e5]"
                  style={{ borderColor: "#e5e7eb" }}
                />
                <textarea
                  value={step.description}
                  onChange={(e) => {
                    const next = [...form.whatToExpect];
                    next[idx] = { ...next[idx], description: e.target.value };
                    setForm({ ...form, whatToExpect: next });
                  }}
                  rows={2}
                  placeholder="Description"
                  className="w-full rounded-md border px-2 py-1 text-[14px] outline-none focus:border-[#4f46e5]"
                  style={{ borderColor: "#e5e7eb" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* FAQs (repeater) */}
        <div className="sm:col-span-2">
          <div className="mb-1 flex items-center justify-between">
            <label
              className="block text-[13px] font-medium uppercase tracking-wider"
              style={{ color: "#111827" }}
            >
              FAQs
            </label>
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  faqs: [...form.faqs, { question: "", answer: "" }],
                })
              }
              className="rounded-md px-2 py-1 text-[12px]"
              style={{ color: "#4f46e5", border: "1px solid #c7d2fe" }}
            >
              + Add FAQ
            </button>
          </div>
          {form.faqs.length === 0 && (
            <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
              No FAQs yet. Add common questions for this service.
            </p>
          )}
          <div className="mt-2 space-y-3">
            {form.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-md border p-3"
                style={{ borderColor: "#e5e7eb", backgroundColor: "#fff" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: "#6b7280" }}
                  >
                    Q{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        faqs: form.faqs.filter((_, i) => i !== idx),
                      })
                    }
                    className="text-[12px] hover:underline"
                    style={{ color: "#dc2626" }}
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => {
                    const next = [...form.faqs];
                    next[idx] = { ...next[idx], question: e.target.value };
                    setForm({ ...form, faqs: next });
                  }}
                  placeholder="Question"
                  className="mb-2 w-full rounded-md border px-2 py-1 text-[14px] outline-none focus:border-[#4f46e5]"
                  style={{ borderColor: "#e5e7eb" }}
                />
                <textarea
                  value={faq.answer}
                  onChange={(e) => {
                    const next = [...form.faqs];
                    next[idx] = { ...next[idx], answer: e.target.value };
                    setForm({ ...form, faqs: next });
                  }}
                  rows={3}
                  placeholder="Answer"
                  className="w-full rounded-md border px-2 py-1 text-[14px] outline-none focus:border-[#4f46e5]"
                  style={{ borderColor: "#e5e7eb" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Pre-care */}
        <div className="sm:col-span-2">
          <label
            className="mb-1 block text-[13px] font-medium uppercase tracking-wider"
            style={{ color: "#111827" }}
          >
            Pre-care notes
          </label>
          <textarea
            value={form.preCareNotes}
            onChange={(e) =>
              setForm({ ...form, preCareNotes: e.target.value })
            }
            rows={3}
            placeholder="What clients should do before the appointment..."
            className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>

        {/* Post-care */}
        <div className="sm:col-span-2">
          <label
            className="mb-1 block text-[13px] font-medium uppercase tracking-wider"
            style={{ color: "#111827" }}
          >
            Post-care notes
          </label>
          <textarea
            value={form.postCareNotes}
            onChange={(e) =>
              setForm({ ...form, postCareNotes: e.target.value })
            }
            rows={3}
            placeholder="What clients should do after the appointment..."
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
  const dbCategories = useQuery(api.serviceCategories.listAll);
  const createService = useMutation(api.services.create);
  const updateService = useMutation(api.services.update);
  const removeService = useMutation(api.services.remove);
  const toggleActive = useMutation(api.services.toggleActive);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<Id<"services"> | null>(null);
  const [saving, setSaving] = useState(false);

  // Categories shown in the form's dropdown — admin-managed list, not derived
  // from existing services (so a brand-new category is selectable immediately).
  const formCategories = useMemo(
    () => (dbCategories ?? []).filter((c) => c.isActive).map((c) => c.name),
    [dbCategories],
  );

  // Filter chips: union of admin categories + any legacy categories still
  // present on services that aren't in the table (so nothing disappears).
  const activeCats = useMemo(() => {
    const fromDb = formCategories;
    const fromServices = services
      ? Array.from(new Set(services.map((s) => s.category))).filter(Boolean)
      : [];
    return Array.from(new Set([...fromDb, ...fromServices]));
  }, [services, formCategories]);

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
      const benefits = parseBenefits(data.benefitsText);
      const cleanedFaqs = data.faqs
        .map((f) => ({ question: f.question.trim(), answer: f.answer.trim() }))
        .filter((f) => f.question && f.answer);
      const cleanedSteps = data.whatToExpect
        .map((s) => ({
          title: s.title.trim(),
          description: s.description.trim(),
        }))
        .filter((s) => s.title || s.description);
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
        downtime: data.downtime.trim() || undefined,
        whoItsFor: data.whoItsFor.trim() || undefined,
        preCareNotes: data.preCareNotes.trim() || undefined,
        postCareNotes: data.postCareNotes.trim() || undefined,
        benefits: benefits.length ? benefits : undefined,
        whatToExpect: cleanedSteps.length ? cleanedSteps : undefined,
        faqs: cleanedFaqs.length ? cleanedFaqs : undefined,
      });
      setShowCreateForm(false);
      toast.success(`Created "${data.name.trim()}"`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Couldn't create service: ${message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: Id<"services">, data: ServiceFormData) {
    setSaving(true);
    try {
      const benefits = parseBenefits(data.benefitsText);
      const cleanedFaqs = data.faqs
        .map((f) => ({ question: f.question.trim(), answer: f.answer.trim() }))
        .filter((f) => f.question && f.answer);
      const cleanedSteps = data.whatToExpect
        .map((s) => ({
          title: s.title.trim(),
          description: s.description.trim(),
        }))
        .filter((s) => s.title || s.description);
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
        downtime: data.downtime.trim() || undefined,
        whoItsFor: data.whoItsFor.trim() || undefined,
        preCareNotes: data.preCareNotes.trim() || undefined,
        postCareNotes: data.postCareNotes.trim() || undefined,
        // Pass empty arrays as [] so the admin can clear these fields once set.
        benefits,
        whatToExpect: cleanedSteps,
        faqs: cleanedFaqs,
      });
      setEditingId(null);
      toast.success(`Saved "${data.name.trim()}"`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Couldn't save: ${message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: Id<"services">) {
    setSaving(true);
    try {
      await removeService({ id });
      setEditingId(null);
      toast.success("Service deleted");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Couldn't delete: ${message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(id: Id<"services">) {
    try {
      await toggleActive({ id });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Couldn't change status: ${message}`);
    }
  }

  return (
    <div>
      {/* Pabau ↔ admin relationship notice — kept short and scannable so Karlyne
          sees it before scrolling and knows where each kind of edit belongs. */}
      <div
        role="note"
        style={{
          border: "1px solid #fca5a5",
          backgroundColor: "#fef2f2",
          color: "#7f1d1d",
          borderRadius: 6,
          padding: "10px 14px",
          fontSize: 13,
          lineHeight: 1.5,
          marginBottom: 16,
        }}
      >
        <strong>Service images must be uploaded here.</strong> Pabau does not send service
        images to the website. Everything else (name, price, duration, description,
        category) syncs from Pabau automatically every 15 minutes — edit those in Pabau,
        not here.
      </div>

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
            initial={{
              ...emptyForm,
              sortOrder: nextSortOrder,
              category: formCategories[0] ?? "",
            }}
            categories={formCategories}
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
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <p
                          className="text-[15px] font-medium"
                          style={{ color: "#111827", margin: 0 }}
                        >
                          {service.name}
                        </p>
                        {service.pabauServiceId && (
                          <span
                            title={
                              service.pabauSyncedAt
                                ? `Last synced ${new Date(service.pabauSyncedAt).toLocaleString()}`
                                : "Synced from Pabau"
                            }
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              padding: "2px 6px",
                              borderRadius: 10,
                              backgroundColor: "#ede9fe",
                              color: "#6d28d9",
                              textTransform: "uppercase",
                              letterSpacing: 0.4,
                            }}
                          >
                            Pabau
                          </span>
                        )}
                        {!service.imageUrl && (
                          <span
                            title="No image uploaded — visitors see a placeholder. Click Edit to upload one."
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              padding: "2px 6px",
                              borderRadius: 10,
                              backgroundColor: "#fef3c7",
                              color: "#92400e",
                              textTransform: "uppercase",
                              letterSpacing: 0.4,
                            }}
                          >
                            No image
                          </span>
                        )}
                      </div>
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
                            downtime: service.downtime || "",
                            whoItsFor: service.whoItsFor || "",
                            preCareNotes: service.preCareNotes || "",
                            postCareNotes: service.postCareNotes || "",
                            benefitsText: (service.benefits ?? []).join("\n"),
                            whatToExpect: service.whatToExpect ?? [],
                            faqs: service.faqs ?? [],
                          }}
                          categories={formCategories}
                          onSave={(data) => handleUpdate(service._id, data)}
                          onCancel={() => setEditingId(null)}
                          onDelete={() => handleDelete(service._id)}
                          saving={saving}
                          pabauSyncedAt={
                            service.pabauServiceId ? service.pabauSyncedAt : undefined
                          }
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

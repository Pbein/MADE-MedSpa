"use client";

import { useState, Fragment } from "react";
import { useQuery, useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import ImageUpload from "@/components/admin/ImageUpload";

interface TeamMemberFormData {
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
  sortOrder: number;
}

const emptyForm: TeamMemberFormData = {
  name: "",
  title: "",
  bio: "",
  imageUrl: "",
  sortOrder: 0,
};

function TeamMemberForm({
  initial,
  onSave,
  onCancel,
  onDelete,
  saving,
}: {
  initial: TeamMemberFormData;
  onSave: (data: TeamMemberFormData) => void;
  onCancel: () => void;
  onDelete?: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<TeamMemberFormData>(initial);
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
            Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Lead Aesthetician, Medical Director"
            className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>
        <div className="sm:col-span-2">
          <label
            className="mb-1 block text-[13px] font-medium uppercase tracking-wider"
            style={{ color: "#111827" }}
          >
            Bio
          </label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={3}
            className="w-full rounded-md border px-3 py-2 text-[15px] outline-none focus:border-[#4f46e5]"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>
        <div>
          <ImageUpload
            label="Team Member Photo"
            value={form.imageUrl}
            onChange={(url) => setForm({ ...form, imageUrl: url })}
            aspect="3/4"
            purpose="headshot"
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
            disabled={saving || !form.name.trim() || !form.title.trim() || !form.bio.trim()}
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

export default function AdminTeamPage() {
  const teamMembers = useQuery(api.teamMembers.listAll);
  const createTeamMember = useMutation(api.teamMembers.create);
  const updateTeamMember = useMutation(api.teamMembers.update);
  const removeTeamMember = useMutation(api.teamMembers.remove);
  const toggleActive = useMutation(api.teamMembers.toggleActive);

  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<Id<"teamMembers"> | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered =
    teamMembers
      ?.filter((m) => {
        const matchesSearch =
          !search ||
          m.name.toLowerCase().includes(search.toLowerCase());
        return matchesSearch;
      }) ?? [];

  const nextSortOrder = teamMembers
    ? Math.max(0, ...teamMembers.map((m) => m.sortOrder)) + 1
    : 0;

  async function handleCreate(data: TeamMemberFormData) {
    setSaving(true);
    try {
      await createTeamMember({
        name: data.name.trim(),
        title: data.title.trim(),
        bio: data.bio.trim(),
        imageUrl: data.imageUrl.trim() || undefined,
        sortOrder: data.sortOrder,
      });
      setShowCreateForm(false);
      toast.success(`Added "${data.name.trim()}"`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Couldn't add team member: ${message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: Id<"teamMembers">, data: TeamMemberFormData) {
    setSaving(true);
    try {
      await updateTeamMember({
        id,
        name: data.name.trim(),
        title: data.title.trim(),
        bio: data.bio.trim(),
        imageUrl: data.imageUrl.trim() || undefined,
        sortOrder: data.sortOrder,
      });
      setEditingId(null);
      toast.success(`Saved "${data.name.trim()}"`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Couldn't save team member: ${message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: Id<"teamMembers">) {
    setSaving(true);
    try {
      await removeTeamMember({ id });
      setEditingId(null);
      toast.success("Team member removed");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Couldn't remove team member: ${message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(id: Id<"teamMembers">) {
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
          Team Members{" "}
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
          {showCreateForm ? "Cancel" : "Add Team Member"}
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6">
          <h2
            className="mb-3 text-[15px] font-semibold uppercase tracking-wider"
            style={{ color: "#111827" }}
          >
            New Team Member
          </h2>
          <TeamMemberForm
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
          placeholder="Search team members..."
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

      {!teamMembers && (
        <div
          className="py-12 text-center"
          style={{ color: "#6b7280" }}
        >
          Loading...
        </div>
      )}

      {teamMembers && filtered.length === 0 && (
        <div
          className="py-12 text-center"
          style={{ color: "#6b7280" }}
        >
          No team members found.
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
                  Title
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
              {filtered.map((member, i) => (
                <Fragment key={member._id}>
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
                        {member.name}
                      </p>
                    </td>
                    <td
                      className="px-4 py-3 text-[15px]"
                      style={{ color: "#374151" }}
                    >
                      {member.title}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(member._id)}
                        title="Click to toggle active status"
                        className="inline-flex cursor-pointer rounded-full px-2 py-0.5 text-[13px] transition-opacity hover:opacity-80"
                        style={{
                          backgroundColor: member.isActive
                            ? "#dcfce7"
                            : "#f3f4f6",
                          color: member.isActive ? "#166534" : "#6b7280",
                        }}
                      >
                        {member.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td
                      className="px-4 py-3 text-[15px]"
                      style={{ color: "#374151" }}
                    >
                      {member.sortOrder}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          setEditingId(
                            editingId === member._id ? null : member._id
                          );
                          setShowCreateForm(false);
                        }}
                        className="text-[15px] transition-colors hover:underline"
                        style={{ color: "#4f46e5" }}
                      >
                        {editingId === member._id ? "Cancel" : "Edit"}
                      </button>
                    </td>
                  </tr>
                  {editingId === member._id && (
                    <tr key={`${member._id}-edit`}>
                      <td colSpan={5} className="px-4 py-3">
                        <TeamMemberForm
                          initial={{
                            name: member.name,
                            title: member.title,
                            bio: member.bio,
                            imageUrl: member.imageUrl || "",
                            sortOrder: member.sortOrder,
                          }}
                          onSave={(data) => handleUpdate(member._id, data)}
                          onCancel={() => setEditingId(null)}
                          onDelete={() => handleDelete(member._id)}
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

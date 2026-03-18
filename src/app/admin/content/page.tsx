"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

interface ContentBlock {
  key: string;
  label: string;
  title: string;
  body: string;
}

const PLACEHOLDER_CONTENT: ContentBlock[] = [
  {
    key: "home_hero",
    label: "Home Hero",
    title: "Elevate Your Beauty",
    body: "Experience luxury medical aesthetics tailored to your unique beauty. At MADE Med Spa, every treatment is designed to help you look and feel your absolute best.",
  },
  {
    key: "about_story",
    label: "About - Our Story",
    title: "Our Story",
    body: "Founded with a passion for beauty and wellness, MADE Med Spa brings together cutting-edge medical aesthetics with a warm, inviting atmosphere. Our journey began with a simple belief: everyone deserves to feel confident in their own skin.",
  },
  {
    key: "about_mission",
    label: "About - Mission",
    title: "Our Mission",
    body: "To provide exceptional, personalized aesthetic treatments in a luxurious yet approachable setting. We combine medical expertise with artistic vision to help our guests achieve their beauty goals.",
  },
  {
    key: "about_values",
    label: "About - Values",
    title: "Our Values",
    body: "Excellence in every treatment. Genuine care for every guest. Continuous education and innovation. Transparency and honesty. Creating a welcoming, inclusive environment for all.",
  },
  {
    key: "contact_hero",
    label: "Contact Hero",
    title: "Get in Touch",
    body: "We would love to hear from you. Whether you have questions about our services, want to book a consultation, or just want to say hello, our team is here to help.",
  },
];

export default function AdminContentPage() {
  const dbContent = useQuery(api.siteContent.list);
  const upsertContent = useMutation(api.siteContent.upsert);

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [savedKey, setSavedKey] = useState<string | null>(null);

  // Merge DB content with placeholder defaults
  const content: ContentBlock[] = useMemo(() => {
    if (!dbContent) return PLACEHOLDER_CONTENT;

    const dbMap = new Map(dbContent.map((row) => [row.key, row]));

    return PLACEHOLDER_CONTENT.map((placeholder) => {
      const dbRow = dbMap.get(placeholder.key);
      if (dbRow) {
        return {
          key: placeholder.key,
          label: placeholder.label,
          title: dbRow.title ?? placeholder.title,
          body: dbRow.body ?? placeholder.body,
        };
      }
      return placeholder;
    });
  }, [dbContent]);

  function handleStartEdit(block: ContentBlock) {
    setEditingKey(block.key);
    setEditTitle(block.title);
    setEditBody(block.body);
  }

  async function handleSave(key: string) {
    await upsertContent({ key, title: editTitle, body: editBody });
    setEditingKey(null);
    setSavedKey(key);
    setTimeout(() => setSavedKey(null), 2000);
  }

  function handleCancel() {
    setEditingKey(null);
    setEditTitle("");
    setEditBody("");
  }

  // Loading state
  if (dbContent === undefined) {
    return (
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#3E2723", margin: "0 0 0.25rem 0" }}>Site Content</h1>
          <p style={{ fontSize: "0.875rem", color: "#78716c", margin: 0 }}>Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#3E2723", margin: "0 0 0.25rem 0" }}>Site Content</h1>
        <p style={{ fontSize: "0.875rem", color: "#78716c", margin: 0 }}>
          Edit the text content displayed across the website.
        </p>
      </div>

      {/* Content cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {content.map((block) => {
          const isEditing = editingKey === block.key;
          const justSaved = savedKey === block.key;

          return (
            <div
              key={block.key}
              style={{
                backgroundColor: "var(--color-ivory)",
                border: "1px solid #d6d3d1",
                borderRadius: "0.5rem",
                padding: "1.25rem 1.5rem",
              }}
            >
              {/* Card header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <div>
                  <span
                    style={{
                      display: "inline-flex",
                      padding: "0.125rem 0.5rem",
                      borderRadius: "9999px",
                      fontSize: "0.7rem",
                      fontWeight: 500,
                      backgroundColor: "#f3f4f6",
                      color: "#6b7280",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {block.label}
                  </span>
                  {!isEditing && (
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#3E2723", margin: "0.25rem 0 0 0" }}>
                      {block.title}
                    </h3>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {justSaved && (
                    <span style={{ fontSize: "0.8rem", color: "#16a34a", fontWeight: 500 }}>
                      Saved!
                    </span>
                  )}
                  {!isEditing && (
                    <button
                      onClick={() => handleStartEdit(block)}
                      style={{
                        padding: "0.4rem 0.8rem",
                        border: "1px solid #d6d3d1",
                        borderRadius: "0.375rem",
                        backgroundColor: "transparent",
                        color: "var(--color-accent-text)",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>

              {/* View mode */}
              {!isEditing && (
                <p style={{ fontSize: "0.875rem", color: "#57534e", lineHeight: 1.6, margin: 0 }}>
                  {block.body}
                </p>
              )}

              {/* Edit mode */}
              {isEditing && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#57534e", marginBottom: "0.25rem" }}>
                      Title
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.5rem 0.75rem",
                        border: "1px solid #d6d3d1",
                        borderRadius: "0.375rem",
                        fontSize: "0.875rem",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#57534e", marginBottom: "0.25rem" }}>
                      Body
                    </label>
                    <textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      rows={5}
                      style={{
                        width: "100%",
                        padding: "0.5rem 0.75rem",
                        border: "1px solid #d6d3d1",
                        borderRadius: "0.375rem",
                        fontSize: "0.875rem",
                        resize: "vertical",
                        lineHeight: 1.5,
                        boxSizing: "border-box",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                    <button
                      onClick={handleCancel}
                      style={{
                        padding: "0.4rem 0.8rem",
                        border: "1px solid #d6d3d1",
                        borderRadius: "0.375rem",
                        backgroundColor: "transparent",
                        color: "#57534e",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave(block.key)}
                      style={{
                        padding: "0.4rem 0.8rem",
                        border: "none",
                        borderRadius: "0.375rem",
                        backgroundColor: "var(--color-burgundy)",
                        color: "#fff",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

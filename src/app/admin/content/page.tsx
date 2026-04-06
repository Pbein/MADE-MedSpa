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

interface BusinessInfo {
  addressLine1: string;
  addressLine2: string;
  phone: string;
  phoneHref: string;
  email: string;
  emailHref: string;
  hours: { days: string; hours: string }[];
  socials: { label: string; href: string }[];
}

const DEFAULT_BUSINESS_INFO: BusinessInfo = {
  addressLine1: "123 Beauty Lane, Suite 100",
  addressLine2: "City, State 12345",
  phone: "(555) 123-4567",
  phoneHref: "tel:+15551234567",
  email: "hello@mademedpsa.com",
  emailHref: "mailto:hello@mademedpsa.com",
  hours: [
    { days: "Monday - Friday", hours: "9:00 AM - 7:00 PM" },
    { days: "Saturday", hours: "10:00 AM - 5:00 PM" },
    { days: "Sunday", hours: "Closed" },
  ],
  socials: [
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "TikTok", href: "#" },
  ],
};

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
    body: "Founded with a passion for beauty and wellness, MADE Med Spa brings together cutting-edge medical aesthetics with a warm, inviting atmosphere.",
  },
  {
    key: "about_mission",
    label: "About - Mission",
    title: "Our Mission",
    body: "To provide exceptional, personalized aesthetic treatments in a luxurious yet approachable setting.",
  },
  {
    key: "about_values",
    label: "About - Values",
    title: "Our Values",
    body: "Excellence in every treatment. Genuine care for every guest. Continuous education and innovation.",
  },
  {
    key: "contact_hero",
    label: "Contact Hero",
    title: "Get in Touch",
    body: "We would love to hear from you. Whether you have questions about our services or want to book a consultation, our team is here to help.",
  },
  {
    key: "privacy_policy",
    label: "Privacy Policy",
    title: "Privacy Policy",
    body: "Your privacy policy content here...",
  },
  {
    key: "terms_of_service",
    label: "Terms of Service",
    title: "Terms of Service",
    body: "Your terms of service content here...",
  },
];

// ── Business Info Editor ─────────────────────────────────────────────────────

function BusinessInfoEditor({
  initial,
  onSave,
}: {
  initial: BusinessInfo;
  onSave: (info: BusinessInfo) => Promise<void>;
}) {
  const [info, setInfo] = useState<BusinessInfo>(initial);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateField = (field: keyof BusinessInfo, value: string) => {
    setInfo({ ...info, [field]: value });
  };

  const updateHour = (index: number, field: "days" | "hours", value: string) => {
    const hours = [...info.hours];
    hours[index] = { ...hours[index], [field]: value };
    setInfo({ ...info, hours });
  };

  const addHour = () => {
    setInfo({ ...info, hours: [...info.hours, { days: "", hours: "" }] });
  };

  const removeHour = (index: number) => {
    setInfo({ ...info, hours: info.hours.filter((_, i) => i !== index) });
  };

  const updateSocial = (index: number, field: "label" | "href", value: string) => {
    const socials = [...info.socials];
    socials[index] = { ...socials[index], [field]: value };
    setInfo({ ...info, socials });
  };

  const addSocial = () => {
    setInfo({ ...info, socials: [...info.socials, { label: "", href: "" }] });
  };

  const removeSocial = (index: number) => {
    setInfo({ ...info, socials: info.socials.filter((_, i) => i !== index) });
  };

  const handleSave = async () => {
    await onSave(info);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle = {
    width: "100%",
    padding: "0.5rem 0.75rem",
    border: "1px solid #e5e7eb",
    borderRadius: "0.375rem",
    fontSize: "0.9375rem",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.8125rem",
    fontWeight: 600,
    color: "#111827",
    marginBottom: "0.25rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "0.5rem",
        padding: "1.25rem 1.5rem",
        marginBottom: "1.5rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <span
            style={{
              display: "inline-flex",
              padding: "0.125rem 0.5rem",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontWeight: 500,
              backgroundColor: "#6366f1",
              color: "#fff",
              marginBottom: "0.25rem",
            }}
          >
            Business Information
          </span>
          <p style={{ fontSize: "0.875rem", color: "#374151", margin: "0.25rem 0 0 0" }}>
            Address, phone, email, hours, and social links shown on the website.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {saved && (
            <span style={{ fontSize: "0.875rem", color: "#16a34a", fontWeight: 500 }}>Saved!</span>
          )}
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              style={{
                padding: "0.4rem 0.8rem",
                border: "1px solid #e5e7eb",
                borderRadius: "0.375rem",
                backgroundColor: "transparent",
                color: "#4f46e5",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {!editing ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.9375rem", color: "#111827" }}>
          <div>
            <strong style={{ color: "#111827" }}>Address:</strong>
            <p style={{ margin: "0.25rem 0" }}>{info.addressLine1}</p>
            <p style={{ margin: 0 }}>{info.addressLine2}</p>
          </div>
          <div>
            <strong style={{ color: "#111827" }}>Contact:</strong>
            <p style={{ margin: "0.25rem 0" }}>{info.phone}</p>
            <p style={{ margin: 0 }}>{info.email}</p>
          </div>
          <div>
            <strong style={{ color: "#111827" }}>Hours:</strong>
            {info.hours.map((h, i) => (
              <p key={i} style={{ margin: "0.25rem 0" }}>{h.days}: {h.hours}</p>
            ))}
          </div>
          <div>
            <strong style={{ color: "#111827" }}>Social Links:</strong>
            {info.socials.map((s, i) => (
              <p key={i} style={{ margin: "0.25rem 0" }}>{s.label}: {s.href === "#" ? "(not set)" : s.href}</p>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Address + Contact */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={labelStyle}>Address Line 1</label>
              <input style={inputStyle} value={info.addressLine1} onChange={(e) => updateField("addressLine1", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Address Line 2</label>
              <input style={inputStyle} value={info.addressLine2} onChange={(e) => updateField("addressLine2", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Phone (display)</label>
              <input style={inputStyle} value={info.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="(555) 123-4567" />
            </div>
            <div>
              <label style={labelStyle}>Phone Link</label>
              <input style={inputStyle} value={info.phoneHref} onChange={(e) => updateField("phoneHref", e.target.value)} placeholder="tel:+15551234567" />
            </div>
            <div>
              <label style={labelStyle}>Email (display)</label>
              <input style={inputStyle} value={info.email} onChange={(e) => updateField("email", e.target.value)} placeholder="hello@example.com" />
            </div>
            <div>
              <label style={labelStyle}>Email Link</label>
              <input style={inputStyle} value={info.emailHref} onChange={(e) => updateField("emailHref", e.target.value)} placeholder="mailto:hello@example.com" />
            </div>
          </div>

          {/* Hours */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <label style={labelStyle}>Business Hours</label>
              <button onClick={addHour} style={{ fontSize: "0.8125rem", color: "#4f46e5", background: "none", border: "none", cursor: "pointer" }}>
                + Add Row
              </button>
            </div>
            {info.hours.map((h, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
                <input style={{ ...inputStyle, flex: 1 }} value={h.days} onChange={(e) => updateHour(i, "days", e.target.value)} placeholder="Monday - Friday" />
                <input style={{ ...inputStyle, flex: 1 }} value={h.hours} onChange={(e) => updateHour(i, "hours", e.target.value)} placeholder="9:00 AM - 7:00 PM" />
                {info.hours.length > 1 && (
                  <button onClick={() => removeHour(i)} style={{ color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", padding: "0 0.25rem" }}>
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Socials */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <label style={labelStyle}>Social Links</label>
              <button onClick={addSocial} style={{ fontSize: "0.8125rem", color: "#4f46e5", background: "none", border: "none", cursor: "pointer" }}>
                + Add Link
              </button>
            </div>
            {info.socials.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
                <input style={{ ...inputStyle, flex: "0 0 140px" }} value={s.label} onChange={(e) => updateSocial(i, "label", e.target.value)} placeholder="Instagram" />
                <input style={{ ...inputStyle, flex: 1 }} value={s.href} onChange={(e) => updateSocial(i, "href", e.target.value)} placeholder="https://instagram.com/..." />
                {info.socials.length > 1 && (
                  <button onClick={() => removeSocial(i)} style={{ color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", padding: "0 0.25rem" }}>
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Save/Cancel */}
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
            <button
              onClick={() => setEditing(false)}
              style={{
                padding: "0.4rem 0.8rem",
                border: "1px solid #e5e7eb",
                borderRadius: "0.375rem",
                backgroundColor: "transparent",
                color: "#111827",
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: "0.4rem 0.8rem",
                border: "none",
                borderRadius: "0.375rem",
                backgroundColor: "#6366f1",
                color: "#fff",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Save Business Info
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Content Page ────────────────────────────────────────────────────────

export default function AdminContentPage() {
  const dbContent = useQuery(api.siteContent.list);
  const upsertContent = useMutation(api.siteContent.upsert);

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [savedKey, setSavedKey] = useState<string | null>(null);

  // Get business info from DB or defaults
  const businessInfo: BusinessInfo = useMemo(() => {
    if (!dbContent) return DEFAULT_BUSINESS_INFO;
    const row = dbContent.find((c) => c.key === "business_info");
    if (row?.metadata) return row.metadata as BusinessInfo;
    return DEFAULT_BUSINESS_INFO;
  }, [dbContent]);

  // Merge DB content with placeholder defaults (excluding business_info)
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

  async function handleSaveBusinessInfo(info: BusinessInfo) {
    await upsertContent({ key: "business_info", metadata: info });
  }

  if (dbContent === undefined) {
    return (
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#111827", margin: "0 0 0.25rem 0" }}>Site Content</h1>
          <p style={{ fontSize: "0.9375rem", color: "#374151", margin: 0 }}>Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#111827", margin: "0 0 0.25rem 0" }}>Site Content</h1>
        <p style={{ fontSize: "0.9375rem", color: "#374151", margin: 0 }}>
          Edit the text content and business information displayed across the website.
        </p>
      </div>

      {/* Business Info Editor */}
      <BusinessInfoEditor initial={businessInfo} onSave={handleSaveBusinessInfo} />

      {/* Content blocks */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {content.map((block) => {
          const isEditing = editingKey === block.key;
          const justSaved = savedKey === block.key;

          return (
            <div
              key={block.key}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                padding: "1.25rem 1.5rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <div>
                  <span
                    style={{
                      display: "inline-flex",
                      padding: "0.125rem 0.5rem",
                      borderRadius: "9999px",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      backgroundColor: "#f3f4f6",
                      color: "#6b7280",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {block.label}
                  </span>
                  {!isEditing && (
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#111827", margin: "0.25rem 0 0 0" }}>
                      {block.title}
                    </h3>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {justSaved && (
                    <span style={{ fontSize: "0.875rem", color: "#16a34a", fontWeight: 500 }}>Saved!</span>
                  )}
                  {!isEditing && (
                    <button
                      onClick={() => handleStartEdit(block)}
                      style={{
                        padding: "0.4rem 0.8rem",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.375rem",
                        backgroundColor: "transparent",
                        color: "#4f46e5",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>

              {!isEditing && (
                <p style={{ fontSize: "0.9375rem", color: "#111827", lineHeight: 1.6, margin: 0, whiteSpace: "pre-line" }}>
                  {block.body}
                </p>
              )}

              {isEditing && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#111827", marginBottom: "0.25rem" }}>
                      Title
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.5rem 0.75rem",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.375rem",
                        fontSize: "0.9375rem",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#111827", marginBottom: "0.25rem" }}>
                      Body
                    </label>
                    <textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      rows={block.key === "privacy_policy" || block.key === "terms_of_service" ? 12 : 5}
                      style={{
                        width: "100%",
                        padding: "0.5rem 0.75rem",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.375rem",
                        fontSize: "0.9375rem",
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
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.375rem",
                        backgroundColor: "transparent",
                        color: "#111827",
                        fontSize: "0.875rem",
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
                        backgroundColor: "#6366f1",
                        color: "#fff",
                        fontSize: "0.875rem",
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

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const CATEGORIES = ["Cleansers", "Serums", "Moisturizers", "SPF", "Treatments", "Kits"];

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.875rem",
  fontWeight: 600,
  color: "#1a1a1a",
  marginBottom: "0.35rem",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.75rem",
  border: "1px solid #d6d3d1",
  borderRadius: "0.5rem",
  fontSize: "0.875rem",
  boxSizing: "border-box",
};

const fieldWrap: React.CSSProperties = {
  marginBottom: "1.25rem",
};

export default function AdminNewProductPage() {
  const router = useRouter();
  const createProduct = useMutation(api.products.create);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [sku, setSku] = useState("");
  const [inventory, setInventory] = useState("0");
  const [isFeatured, setIsFeatured] = useState(false);
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleNameChange(value: string) {
    setName(value);
    setSlug(generateSlug(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Validation
    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("Price must be greater than 0.");
      return;
    }
    const inventoryNum = parseInt(inventory, 10);
    if (isNaN(inventoryNum) || inventoryNum < 0) {
      setError("Stock quantity must be 0 or more.");
      return;
    }
    if (!shortDescription.trim()) {
      setError("Short description is required.");
      return;
    }
    if (!fullDescription.trim()) {
      setError("Full description is required.");
      return;
    }

    setSubmitting(true);
    try {
      const compareAtPriceNum = compareAtPrice ? parseFloat(compareAtPrice) : undefined;

      await createProduct({
        name: name.trim(),
        slug: slug || generateSlug(name),
        category,
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim(),
        price: Math.round(priceNum * 100),
        compareAtPrice: compareAtPriceNum ? Math.round(compareAtPriceNum * 100) : undefined,
        sku: sku.trim() || undefined,
        inventory: inventoryNum,
        isFeatured,
        tags: tags.trim()
          ? tags.split(",").map((t) => t.trim()).filter(Boolean)
          : undefined,
        sortOrder: 0,
      });
      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product.");
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "1.5rem" }}>Add New Product</h1>

      {error && (
        <div style={{ padding: "0.75rem 1rem", backgroundColor: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "0.5rem", color: "#dc2626", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div style={fieldWrap}>
          <label style={labelStyle}>Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Hydrating Serum"
            style={inputStyle}
          />
        </div>

        {/* Slug */}
        <div style={fieldWrap}>
          <label style={labelStyle}>Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto-generated-from-name"
            style={{ ...inputStyle, color: "#78716c" }}
          />
        </div>

        {/* Category */}
        <div style={fieldWrap}>
          <label style={labelStyle}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={inputStyle}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Short Description */}
        <div style={fieldWrap}>
          <label style={labelStyle}>Short Description *</label>
          <textarea
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            rows={2}
            placeholder="Brief product summary..."
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        {/* Full Description */}
        <div style={fieldWrap}>
          <label style={labelStyle}>Full Description *</label>
          <textarea
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
            rows={5}
            placeholder="Detailed product description..."
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        {/* Price row */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem" }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Price ($) *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Compare At Price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
              placeholder="0.00"
              style={inputStyle}
            />
          </div>
        </div>

        {/* SKU + Stock row */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem" }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>SKU</label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="e.g. SKU-001"
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Stock Quantity *</label>
            <input
              type="number"
              min="0"
              value={inventory}
              onChange={(e) => setInventory(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Featured */}
        <div style={{ ...fieldWrap, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            id="featured"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            style={{ width: 18, height: 18, accentColor: "#722F37" }}
          />
          <label htmlFor="featured" style={{ fontSize: "0.875rem", fontWeight: 500, color: "#1a1a1a", cursor: "pointer" }}>
            Featured product
          </label>
        </div>

        {/* Tags */}
        <div style={fieldWrap}>
          <label style={labelStyle}>Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="hydrating, serum, best-seller (comma-separated)"
            style={inputStyle}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: "0.65rem 1.5rem",
              backgroundColor: submitting ? "#a8a29e" : "#722F37",
              color: "#fff",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Creating..." : "Create Product"}
          </button>
          <Link
            href="/admin/products"
            style={{
              padding: "0.65rem 1.5rem",
              border: "1px solid #d6d3d1",
              borderRadius: "0.5rem",
              color: "#57534e",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

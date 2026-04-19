"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

interface PabauService {
  id: number;
  service_name: string;
  description: string;
  price: string;
  duration: string;
  category_name: string;
  booking_url: string;
  bookable_online: number;
  is_active: number;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatDuration(dur: string): string {
  // "00:30" → "30 minutes", "01:00" → "60 minutes"
  const [h, m] = dur.split(":").map(Number);
  const total = h * 60 + m;
  return `${total} minutes`;
}

export default function AdminPabauPage() {
  const [pabauServices, setPabauServices] = useState<PabauService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState<Set<number>>(new Set());
  const [imported, setImported] = useState<Set<number>>(new Set());

  const convexServices = useQuery(api.services.listAll);
  const createService = useMutation(api.services.create);
  const updateService = useMutation(api.services.update);

  // Find which Pabau services are already linked in Convex
  const linkedPabauIds = useMemo(() => {
    if (!convexServices) return new Set<number>();
    return new Set(
      convexServices
        .filter((s) => s.pabauServiceId)
        .map((s) => s.pabauServiceId as number)
    );
  }, [convexServices]);

  useEffect(() => {
    async function fetchPabau() {
      try {
        const res = await fetch("/api/pabau/services");
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        const data = await res.json();
        setPabauServices(data.services || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch");
      } finally {
        setLoading(false);
      }
    }
    fetchPabau();
  }, []);

  const nextSortOrder = convexServices
    ? Math.max(0, ...convexServices.map((s) => s.sortOrder)) + 1
    : 100;

  async function handleImport(pabau: PabauService, index: number) {
    setImporting((prev) => new Set(prev).add(pabau.id));
    try {
      // Map Pabau category to our categories
      let category = "Body"; // default
      const catLower = pabau.category_name.toLowerCase();
      if (catLower.includes("hair")) category = "Body";
      if (catLower.includes("acne") || catLower.includes("skin") || catLower.includes("rejuvenation") || catLower.includes("melasma") || catLower.includes("rosacea")) category = "Skin";
      if (catLower.includes("inject") || catLower.includes("filler") || catLower.includes("botox")) category = "Injectables";
      if (catLower.includes("wellness") || catLower.includes("iv") || catLower.includes("vitamin")) category = "Wellness";

      await createService({
        name: pabau.service_name,
        slug: generateSlug(pabau.service_name),
        shortDescription: pabau.description || `${pabau.service_name} treatment.`,
        fullDescription: pabau.description || `${pabau.service_name} — professional treatment at MADE Med Spa.`,
        category,
        duration: formatDuration(pabau.duration),
        priceRange: `$${parseFloat(pabau.price).toFixed(0)}`,
        pabauServiceId: pabau.id,
        pabauBookingUrl: pabau.booking_url,
        sortOrder: nextSortOrder + index,
      });
      setImported((prev) => new Set(prev).add(pabau.id));
    } catch (err) {
      console.error("Failed to import:", err);
    } finally {
      setImporting((prev) => {
        const next = new Set(prev);
        next.delete(pabau.id);
        return next;
      });
    }
  }

  async function handleLinkBookingUrl(pabau: PabauService) {
    if (!convexServices) return;
    // Find matching Convex service by pabauServiceId
    const match = convexServices.find((s) => s.pabauServiceId === pabau.id);
    if (match) {
      await updateService({
        id: match._id,
        pabauBookingUrl: pabau.booking_url,
      });
    }
  }

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, PabauService[]>();
    pabauServices.forEach((s) => {
      const existing = map.get(s.category_name) || [];
      existing.push(s);
      map.set(s.category_name, existing);
    });
    return map;
  }, [pabauServices]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: "#111827" }}>
          Pabau Sync
        </h1>
        <p className="text-[15px]" style={{ color: "#6b7280" }}>
          View services from Pabau and import them to the website. Imported services get Pabau&apos;s direct booking URL.
        </p>
      </div>

      {/* What to do in Pabau */}
      <details style={{
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "0.5rem",
        marginBottom: "1.5rem",
        overflow: "hidden",
      }}>
        <summary style={{
          padding: "0.75rem 1.25rem",
          cursor: "pointer",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "#111827",
          userSelect: "none",
          listStyle: "none",
          display: "flex",
          justifyContent: "space-between",
        }}>
          <span>When to use Pabau vs. the Admin Portal</span>
          <span style={{ fontSize: "0.75rem", color: "#9ca3af", fontWeight: 400 }}>click to expand</span>
        </summary>
        <div style={{ padding: "0 1.25rem 1.25rem", fontSize: "0.8125rem", color: "#374151", lineHeight: 1.7 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "0.5rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", fontWeight: 600, color: "#6b7280", fontSize: "0.75rem" }}>Task</th>
                <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", fontWeight: 600, color: "#6b7280", fontSize: "0.75rem" }}>Where</th>
                <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", fontWeight: 600, color: "#6b7280", fontSize: "0.75rem" }}>Why</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Add/edit service pricing & duration", "Pabau", "Pabau is the source of truth for business data"],
                ["Update service descriptions & images for website", "Admin Portal", "Website-specific content not in Pabau"],
                ["Manage client bookings", "Pabau", "All scheduling happens in Pabau"],
                ["View revenue reports", "Pabau", "Financial data lives in Pabau"],
                ["Update what visitors see on the website", "Admin Portal", "Page editors control the public site"],
                ["Track contact form leads", "Admin Portal", "Leads come through the website contact form"],
                ["Manage memberships for the website", "Admin Portal", "Membership display is website-managed"],
                ["Process payments & checkout", "Pabau", "All transactions go through Pabau"],
              ].map(([task, where, why]) => (
                <tr key={task} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "0.5rem 0.75rem" }}>{task}</td>
                  <td style={{ padding: "0.5rem 0.75rem", fontWeight: 500, color: where === "Pabau" ? "#7c3aed" : "#6366f1" }}>{where}</td>
                  <td style={{ padding: "0.5rem 0.75rem", color: "#6b7280" }}>{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ marginTop: "1rem", marginBottom: 0 }}>
            <strong>Rule of thumb:</strong> If it affects how a client books or pays, do it in Pabau. If it affects how the website looks to visitors, do it in the Admin Portal.
          </p>
        </div>
      </details>

      {/* Stats bar */}
      {!loading && !error && (
        <div className="mb-6 flex gap-6 flex-wrap">
          <div className="rounded-lg border p-4" style={{ borderColor: "#e5e7eb" }}>
            <span className="text-2xl font-semibold" style={{ color: "#111827" }}>{pabauServices.length}</span>
            <span className="ml-2 text-[13px]" style={{ color: "#6b7280" }}>in Pabau</span>
          </div>
          <div className="rounded-lg border p-4" style={{ borderColor: "#e5e7eb" }}>
            <span className="text-2xl font-semibold" style={{ color: "#059669" }}>{linkedPabauIds.size}</span>
            <span className="ml-2 text-[13px]" style={{ color: "#6b7280" }}>linked</span>
          </div>
          <div className="rounded-lg border p-4" style={{ borderColor: "#e5e7eb" }}>
            <span className="text-2xl font-semibold" style={{ color: "#d97706" }}>{pabauServices.length - linkedPabauIds.size - imported.size}</span>
            <span className="ml-2 text-[13px]" style={{ color: "#6b7280" }}>not imported</span>
          </div>
          <div className="rounded-lg border p-4" style={{ borderColor: "#e5e7eb" }}>
            <span className="text-2xl font-semibold" style={{ color: "#111827" }}>{convexServices?.length || 0}</span>
            <span className="ml-2 text-[13px]" style={{ color: "#6b7280" }}>on website</span>
          </div>
        </div>
      )}

      {loading ? (
        <p className="py-12 text-center text-[15px]" style={{ color: "#9ca3af" }}>
          Fetching services from Pabau...
        </p>
      ) : error ? (
        <div className="rounded-lg border p-6 text-center" style={{ borderColor: "#fca5a5", backgroundColor: "#fef2f2" }}>
          <p className="text-[15px] font-medium" style={{ color: "#dc2626" }}>
            Failed to connect to Pabau
          </p>
          <p className="text-[13px] mt-1" style={{ color: "#6b7280" }}>{error}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Array.from(grouped.entries()).map(([category, services]) => (
            <div key={category}>
              <h2 className="text-[13px] font-medium uppercase tracking-wider mb-3" style={{ color: "#6b7280" }}>
                {category}
              </h2>
              <div className="space-y-2">
                {services.map((s, i) => {
                  const isLinked = linkedPabauIds.has(s.id);
                  const justImported = imported.has(s.id);
                  const isImporting = importing.has(s.id);

                  return (
                    <div
                      key={s.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                      style={{ borderColor: "#e5e7eb" }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[15px] font-semibold truncate" style={{ color: "#111827" }}>
                            {s.service_name}
                          </span>
                          {s.bookable_online === 1 && (
                            <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700 shrink-0">
                              Bookable online
                            </span>
                          )}
                          {isLinked && (
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 shrink-0">
                              Linked
                            </span>
                          )}
                          {justImported && (
                            <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700 shrink-0">
                              Just imported
                            </span>
                          )}
                        </div>
                        <span className="text-[13px]" style={{ color: "#6b7280" }}>
                          ${parseFloat(s.price).toFixed(0)} &middot; {formatDuration(s.duration)}
                          {s.description && ` · ${s.description.substring(0, 60)}${s.description.length > 60 ? "..." : ""}`}
                        </span>
                      </div>
                      <div className="ml-4 shrink-0">
                        {isLinked ? (
                          <span className="text-[13px]" style={{ color: "#059669" }}>
                            Synced
                          </span>
                        ) : justImported ? (
                          <span className="text-[13px]" style={{ color: "#059669" }}>
                            Done
                          </span>
                        ) : (
                          <button
                            onClick={() => handleImport(s, i)}
                            disabled={isImporting}
                            className="rounded-md px-3 py-1 text-[13px] text-white transition-colors disabled:opacity-50"
                            style={{ backgroundColor: "#6366f1" }}
                          >
                            {isImporting ? "Importing..." : "Import"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

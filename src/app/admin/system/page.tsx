"use client";

export default function SystemAdmin() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "Not set";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "Not set";
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const clerkEnv = clerkKey?.startsWith("pk_live_") ? "Production" : clerkKey?.startsWith("pk_test_") ? "Development" : "Not set";
  const pabauUrl = process.env.NEXT_PUBLIC_PABAU_BOOKING_URL || "Not set";

  const envVars = [
    { name: "NEXT_PUBLIC_CONVEX_URL", value: convexUrl, status: convexUrl !== "Not set" },
    { name: "NEXT_PUBLIC_SITE_URL", value: siteUrl, status: siteUrl !== "Not set" },
    { name: "Clerk Environment", value: clerkEnv, status: clerkEnv !== "Not set" },
    { name: "NEXT_PUBLIC_PABAU_BOOKING_URL", value: pabauUrl, status: pabauUrl !== "Not set" },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#111827", margin: "0 0 0.25rem 0" }}>
        System
      </h1>
      <p style={{ fontSize: "0.9375rem", color: "#6b7280", margin: "0 0 2rem 0" }}>
        Infrastructure and deployment information. Useful for developers and troubleshooting.
      </p>

      {/* Connected Services */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#111827", margin: "0 0 1rem 0" }}>Connected Services</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {envVars.map((env) => (
            <div key={env.name} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.75rem 1rem",
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "0.375rem",
            }}>
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "#111827" }}>{env.name}</div>
                <div style={{ fontSize: "0.8125rem", color: "#6b7280", fontFamily: "monospace" }}>
                  {env.value.length > 60 ? env.value.slice(0, 60) + "..." : env.value}
                </div>
              </div>
              <span style={{
                padding: "0.125rem 0.5rem",
                borderRadius: "9999px",
                fontSize: "0.75rem",
                fontWeight: 500,
                backgroundColor: env.status ? "#D1FAE5" : "#FEE2E2",
                color: env.status ? "#065F46" : "#991B1B",
              }}>
                {env.status ? "Connected" : "Missing"}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Reference */}
      <section>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#111827", margin: "0 0 1rem 0" }}>Quick Reference</h2>
        <div style={{
          padding: "1rem 1.25rem",
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "0.375rem",
          fontSize: "0.875rem",
          color: "#374151",
          lineHeight: 1.8,
        }}>
          <div><strong>Framework:</strong> Next.js + React</div>
          <div><strong>Backend:</strong> Convex (real-time database + functions)</div>
          <div><strong>Auth:</strong> Clerk (authentication + user management)</div>
          <div><strong>EMR:</strong> Pabau (services sync, booking)</div>
          <div><strong>Styling:</strong> CSS Variables + Tailwind CSS</div>
          <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid #e5e7eb" }}>
            <strong>Admin pages:</strong> src/app/admin/ &nbsp;|&nbsp; <strong>Public pages:</strong> src/app/ &nbsp;|&nbsp; <strong>Components:</strong> src/components/
          </div>
        </div>
      </section>
    </div>
  );
}

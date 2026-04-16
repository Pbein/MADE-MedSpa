"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "D" },
  { label: "Services", href: "/admin/services", icon: "S" },
  { label: "Memberships", href: "/admin/memberships", icon: "M" },
  { label: "Shop", href: "/admin/shop", icon: "P" },
  { label: "FAQs", href: "/admin/faqs", icon: "F" },
  { label: "Team", href: "/admin/team", icon: "T" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "Q" },
  { label: "Media", href: "/admin/media", icon: "I" },
  { label: "Content", href: "/admin/content", icon: "W" },
  { label: "Contacts", href: "/admin/contacts", icon: "C" },
  { label: "Pabau Sync", href: "/admin/pabau", icon: "↔" },
];

function getPageTitle(pathname: string): string {
  if (pathname === "/admin") return "Dashboard";
  const item = navItems.find(
    (n) => n.href !== "/admin" && pathname.startsWith(n.href)
  );
  return item ? item.label : "Dashboard";
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsDesktop(e.matches);
      if (e.matches) setSidebarOpen(false);
    };
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const pageTitle = getPageTitle(pathname);
  const showSidebar = isDesktop || sidebarOpen;

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8f9fa", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 15, lineHeight: 1.6, color: "#1f2937", WebkitFontSmoothing: "antialiased" }}>
      {/* Mobile overlay */}
      {sidebarOpen && !isDesktop && (
        <div
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 40 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 240,
          backgroundColor: "#1a1a2e",
          color: "#e0e0e0",
          display: "flex",
          flexDirection: "column",
          zIndex: 50,
          transform: showSidebar ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.2s ease",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>
            MADE Admin
          </span>
          {!isDesktop && (
            <button
              style={{ background: "none", border: "none", color: "#999", fontSize: 24, cursor: "pointer", padding: 0, lineHeight: 1 }}
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              &times;
            </button>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 16px",
                  margin: "2px 8px",
                  borderRadius: 6,
                  color: isActive ? "#fff" : "#a0a0b0",
                  backgroundColor: isActive ? "rgba(99,102,241,0.15)" : "transparent",
                  textDecoration: "none",
                  fontSize: 15,
                  fontWeight: isActive ? 500 : 400,
                  transition: "all 0.15s ease",
                }}
                onClick={() => setSidebarOpen(false)}
              >
                <span style={{
                  width: 26,
                  height: 26,
                  borderRadius: 5,
                  backgroundColor: isActive ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 600,
                  color: isActive ? "#818cf8" : "#888",
                  flexShrink: 0,
                }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                backgroundColor: "#6366f1",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 600,
                flexShrink: 0,
              }}>
                {user.firstName?.[0] || user.emailAddresses?.[0]?.emailAddress?.[0] || "U"}
              </div>
              <div style={{ fontSize: 13, color: "#ccc", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.fullName || user.emailAddresses?.[0]?.emailAddress || "Admin"}
              </div>
            </div>
          )}
          <button
            onClick={() => signOut()}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#999",
              fontSize: 12,
              padding: "6px 12px",
              borderRadius: 5,
              cursor: "pointer",
              width: "100%",
              transition: "all 0.15s ease",
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", ...(isDesktop ? { marginLeft: 240 } : {}) }}>
        {/* Top bar */}
        <header style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
          backgroundColor: "#fff",
          borderBottom: "1px solid #e5e7eb",
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {!isDesktop && (
              <button
                style={{ display: "flex", flexDirection: "column", gap: 4, background: "none", border: "none", cursor: "pointer", padding: 4 }}
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <span style={{ width: 20, height: 2, backgroundColor: "#374151", borderRadius: 1, display: "block" }} />
                <span style={{ width: 20, height: 2, backgroundColor: "#374151", borderRadius: 1, display: "block" }} />
                <span style={{ width: 20, height: 2, backgroundColor: "#374151", borderRadius: 1, display: "block" }} />
              </button>
            )}
            <h1 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: 0 }}>{pageTitle}</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {user && (
              <div style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "#6366f1",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 600,
                overflow: "hidden",
              }}>
                {user.imageUrl ? (
                  <img src={user.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span>{user.firstName?.[0] || "U"}</span>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <div className="admin-content" style={{ flex: 1, padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

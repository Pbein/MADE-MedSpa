"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

function getPageTitle(pathname: string, sections: NavSection[]): string {
  if (pathname === "/admin") return "Dashboard";
  for (const section of sections) {
    const item = section.items.find(
      (n) => n.href !== "/admin" && pathname.startsWith(n.href)
    );
    if (item) return item.label;
  }
  return "Dashboard";
}

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#6b7280",
  padding: "16px 16px 4px",
  display: "block",
};

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
  const newContacts = useQuery(api.contactSubmissions.countNew);

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

  const navSections: NavSection[] = [
    {
      title: "",
      items: [
        { label: "Dashboard", href: "/admin", icon: "D" },
      ],
    },
    {
      title: "Your Business",
      items: [
        { label: "Services", href: "/admin/services", icon: "S" },
        { label: "Memberships", href: "/admin/memberships", icon: "M" },
        { label: "Shop", href: "/admin/shop", icon: "P" },
        { label: "Team", href: "/admin/team", icon: "T" },
      ],
    },
    {
      title: "Pages",
      items: [
        { label: "Homepage", href: "/admin/pages/home", icon: "H" },
        { label: "About", href: "/admin/pages/about", icon: "A" },
        { label: "Services Page", href: "/admin/pages/services", icon: "S" },
        { label: "Membership Page", href: "/admin/pages/membership", icon: "M" },
        { label: "Shop Page", href: "/admin/pages/shop", icon: "P" },
        { label: "Contact", href: "/admin/pages/contact", icon: "C" },
        { label: "FAQ", href: "/admin/pages/faq", icon: "F" },
        { label: "Booking", href: "/admin/pages/booking", icon: "B" },
        { label: "Footer", href: "/admin/pages/footer", icon: "G" },
      ],
    },
    {
      title: "Content",
      items: [
        { label: "SEO", href: "/admin/seo", icon: "\u2197" },
        { label: "FAQs", href: "/admin/faqs", icon: "F" },
        { label: "Testimonials", href: "/admin/testimonials", icon: "Q" },
      ],
    },
    {
      title: "Leads",
      items: [
        { label: "Contacts", href: "/admin/contacts", icon: "C", badge: newContacts ?? 0 },
        { label: "Pabau Sync", href: "/admin/pabau", icon: "\u2194" },
      ],
    },
    {
      title: "Settings",
      items: [
        { label: "Site Settings", href: "/admin/settings", icon: "\u2699" },
        { label: "System", href: "/admin/system", icon: "\u2630" },
        { label: "Admin Guide", href: "/admin/guide", icon: "?" },
      ],
    },
  ];

  const pageTitle = getPageTitle(pathname, navSections);
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
        <nav style={{ flex: 1, overflowY: "auto", padding: "4px 0" }}>
          {navSections.map((section) => (
            <div key={section.title || "top"}>
              {section.title && (
                <span style={sectionLabelStyle}>{section.title}</span>
              )}
              {section.items.map((item) => {
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
                      padding: "8px 16px",
                      margin: "1px 8px",
                      borderRadius: 6,
                      color: isActive ? "#fff" : "#a0a0b0",
                      backgroundColor: isActive ? "rgba(99,102,241,0.15)" : "transparent",
                      textDecoration: "none",
                      fontSize: 14,
                      fontWeight: isActive ? 500 : 400,
                      transition: "all 0.15s ease",
                    }}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span style={{
                      width: 24,
                      height: 24,
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
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span style={{
                        minWidth: 18,
                        height: 18,
                        borderRadius: 9,
                        backgroundColor: "#ef4444",
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 5px",
                        flexShrink: 0,
                      }}>
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
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
                overflow: "hidden",
              }}>
                {user.imageUrl ? (
                  <img src={user.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span>{user.firstName?.[0] || user.emailAddresses?.[0]?.emailAddress?.[0] || "U"}</span>
                )}
              </div>
              <div style={{ fontSize: 13, color: "#ccc", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.fullName || user.emailAddresses?.[0]?.emailAddress || "Admin"}
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                background: "none",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#999",
                fontSize: 12,
                padding: "6px 12px",
                borderRadius: 5,
                cursor: "pointer",
                textAlign: "center",
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
            >
              View Site
            </a>
            <button
              onClick={() => signOut()}
              style={{
                flex: 1,
                background: "none",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#999",
                fontSize: 12,
                padding: "6px 12px",
                borderRadius: 5,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              Sign Out
            </button>
          </div>
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

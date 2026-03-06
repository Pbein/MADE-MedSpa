"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "D" },
  { label: "Products", href: "/admin/products", icon: "P" },
  { label: "Orders", href: "/admin/orders", icon: "O" },
  { label: "Services", href: "/admin/services", icon: "S" },
  { label: "Bookings", href: "/admin/bookings", icon: "B" },
  { label: "Members", href: "/admin/members", icon: "M" },
  { label: "Contacts", href: "/admin/contacts", icon: "C" },
  { label: "FAQs", href: "/admin/faqs", icon: "F" },
  { label: "Content", href: "/admin/content", icon: "W" },
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
    <div style={styles.wrapper}>
      {/* Mobile overlay */}
      {sidebarOpen && !isDesktop && (
        <div
          style={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          ...styles.sidebar,
          ...(showSidebar ? styles.sidebarVisible : {}),
          ...(isDesktop ? { position: "fixed" as const } : {}),
        }}
      >
        <div style={styles.sidebarHeader}>
          <span className="headline-text" style={styles.logo}>
            MADE Admin
          </span>
          {!isDesktop && (
            <button
              style={styles.closeMobile}
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              &times;
            </button>
          )}
        </div>

        <nav style={styles.nav}>
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
                  ...styles.navLink,
                  ...(isActive ? styles.navLinkActive : {}),
                }}
                onClick={() => setSidebarOpen(false)}
              >
                <span style={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={styles.sidebarFooter}>
          {user && (
            <div style={styles.userInfo}>
              <div style={styles.userAvatar}>
                {user.firstName?.[0] ||
                  user.emailAddresses?.[0]?.emailAddress?.[0] ||
                  "U"}
              </div>
              <div style={styles.userName}>
                {user.fullName ||
                  user.emailAddresses?.[0]?.emailAddress ||
                  "Admin"}
              </div>
            </div>
          )}
          <button onClick={() => signOut()} style={styles.signOutBtn}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div
        style={{
          ...styles.main,
          ...(isDesktop ? { marginLeft: 260 } : {}),
        }}
      >
        {/* Top bar */}
        <header style={styles.topBar}>
          <div style={styles.topBarLeft}>
            {!isDesktop && (
              <button
                style={styles.hamburger}
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <span style={styles.hamburgerLine} />
                <span style={styles.hamburgerLine} />
                <span style={styles.hamburgerLine} />
              </button>
            )}
            <h1 style={styles.pageTitle}>{pageTitle}</h1>
          </div>
          <div style={styles.topBarRight}>
            {user && (
              <div style={styles.topAvatar}>
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="User avatar"
                    style={styles.topAvatarImg}
                  />
                ) : (
                  <span>{user.firstName?.[0] || "U"}</span>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <div style={styles.content}>{children}</div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "var(--color-cream)",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 40,
  },
  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    width: 260,
    backgroundColor: "var(--color-chocolate)",
    color: "var(--color-stone)",
    display: "flex",
    flexDirection: "column",
    zIndex: 50,
    transform: "translateX(-100%)",
    transition: "transform 0.2s ease",
  },
  sidebarVisible: {
    transform: "translateX(0)",
  },
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "24px 20px 16px",
    borderBottom: "1px solid rgba(210,200,190,0.15)",
  },
  logo: {
    fontSize: 20,
    letterSpacing: 2,
    color: "var(--color-stone)",
  },
  closeMobile: {
    background: "none",
    border: "none",
    color: "var(--color-stone)",
    fontSize: 28,
    cursor: "pointer",
    lineHeight: 1,
    padding: 0,
  },
  nav: {
    flex: 1,
    overflowY: "auto",
    padding: "12px 0",
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 20px",
    color: "var(--color-stone)",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 400,
    letterSpacing: 0.5,
    transition: "background-color 0.15s ease",
  },
  navLinkActive: {
    backgroundColor: "var(--color-burgundy)",
    color: "#fff",
    fontWeight: 500,
  },
  navIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "rgba(210,200,190,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 600,
    flexShrink: 0,
  },
  sidebarFooter: {
    padding: "16px 20px",
    borderTop: "1px solid rgba(210,200,190,0.15)",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    backgroundColor: "var(--color-burgundy)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 600,
    flexShrink: 0,
  },
  userName: {
    fontSize: 13,
    color: "var(--color-stone)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  signOutBtn: {
    background: "none",
    border: "1px solid rgba(210,200,190,0.3)",
    color: "var(--color-stone)",
    fontSize: 12,
    padding: "6px 14px",
    borderRadius: 4,
    cursor: "pointer",
    width: "100%",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
    backgroundColor: "#fff",
    borderBottom: "1px solid var(--color-stone)",
    position: "sticky",
    top: 0,
    zIndex: 30,
  },
  topBarLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  hamburger: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
  },
  hamburgerLine: {
    width: 22,
    height: 2,
    backgroundColor: "var(--color-chocolate)",
    borderRadius: 1,
    display: "block",
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: "var(--color-chocolate)",
    margin: 0,
    fontFamily: "var(--font-jost), sans-serif",
  },
  topBarRight: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  topAvatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    backgroundColor: "var(--color-burgundy)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 600,
    overflow: "hidden",
  },
  topAvatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  content: {
    flex: 1,
    padding: 24,
  },
};

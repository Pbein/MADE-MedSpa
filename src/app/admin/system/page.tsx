"use client";

import { useEffect, useState, ReactNode } from "react";
import Link from "next/link";

// ─── Design tokens ──────────────────────────────────────────────────────────

const color = {
  text: "#0f172a",
  textMuted: "#475569",
  textDim: "#94a3b8",
  surface: "#fff",
  bg: "#f8fafc",
  border: "#e2e8f0",
  borderSoft: "#eef2f7",
  accent: "#6366f1",
  accentSoft: "#eef2ff",
  brandSoft: "#faf7f2",
  brandBorder: "#e8dfd2",
  brandInk: "#5c3a1e",
  success: "#065f46",
  successBg: "#d1fae5",
  danger: "#991b1b",
  dangerBg: "#fee2e2",
  warnInk: "#78350f",
  warnBg: "#fef3c7",
  warnBorder: "#fde68a",
  codeBg: "#f1f5f9",
  codeInk: "#0f172a",
};

// ─── Section definitions (drive TOC + scroll) ──────────────────────────────

interface DocSection {
  id: string;
  title: string;
  audience: "all" | "marketing" | "dev";
}

const SECTIONS: DocSection[] = [
  { id: "start", title: "Start here", audience: "all" },
  { id: "big-picture", title: "How this site works", audience: "all" },
  { id: "data-map", title: "Where each piece of data lives", audience: "all" },
  { id: "content", title: "Editing pages & content", audience: "marketing" },
  { id: "seo", title: "SEO & search", audience: "marketing" },
  { id: "leads", title: "Leads & contact forms", audience: "marketing" },
  { id: "pabau", title: "Pabau integration", audience: "all" },
  { id: "architecture", title: "Architecture & stack", audience: "dev" },
  { id: "adding-pages", title: "Adding a new page", audience: "dev" },
  { id: "deployment", title: "Deployment", audience: "dev" },
  { id: "status", title: "System status", audience: "dev" },
];

// ─── Small primitives ──────────────────────────────────────────────────────

function SectionHeading({ id, audience, children }: { id: string; audience: DocSection["audience"]; children: ReactNode }) {
  const tag =
    audience === "marketing" ? "For marketing" :
    audience === "dev" ? "For developers" : null;
  return (
    <div style={{ marginBottom: 16, scrollMarginTop: 96 }} id={id}>
      {tag && (
        <div style={{
          display: "inline-block",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: audience === "marketing" ? "#7c2d12" : "#3730a3",
          backgroundColor: audience === "marketing" ? "#ffedd5" : "#e0e7ff",
          padding: "3px 8px",
          borderRadius: 4,
          marginBottom: 10,
        }}>{tag}</div>
      )}
      <h2 style={{ fontSize: 22, fontWeight: 700, color: color.text, margin: 0, lineHeight: 1.25 }}>
        {children}
      </h2>
    </div>
  );
}

function Card({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      backgroundColor: color.surface,
      border: `1px solid ${color.border}`,
      borderRadius: 10,
      padding: "20px 24px",
      ...style,
    }}>
      {children}
    </div>
  );
}

function Callout({ kind, title, children }: { kind: "tip" | "warn" | "brand"; title?: string; children: ReactNode }) {
  const palette =
    kind === "tip" ? { bg: color.accentSoft, border: "#c7d2fe", ink: "#3730a3" } :
    kind === "warn" ? { bg: color.warnBg, border: color.warnBorder, ink: color.warnInk } :
    { bg: color.brandSoft, border: color.brandBorder, ink: color.brandInk };
  return (
    <div style={{
      backgroundColor: palette.bg,
      border: `1px solid ${palette.border}`,
      borderLeft: `4px solid ${palette.ink}`,
      borderRadius: 8,
      padding: "14px 18px",
      margin: "12px 0",
      fontSize: 14,
      color: color.text,
      lineHeight: 1.65,
    }}>
      {title && (
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: palette.ink,
          marginBottom: 6,
        }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

function Code({ children }: { children: ReactNode }) {
  return (
    <code style={{
      fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, monospace",
      fontSize: "0.875em",
      padding: "2px 6px",
      borderRadius: 4,
      backgroundColor: color.codeBg,
      color: color.codeInk,
    }}>
      {children}
    </code>
  );
}

function KV({ k, v }: { k: ReactNode; v: ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: `1px solid ${color.borderSoft}` }}>
      <div style={{ flex: "0 0 160px", fontSize: 13, color: color.textMuted, fontWeight: 500 }}>{k}</div>
      <div style={{ flex: 1, fontSize: 14, color: color.text }}>{v}</div>
    </div>
  );
}

// ─── Architecture diagram (SVG — replaces the old ASCII) ───────────────────

function ArchitectureDiagram() {
  return (
    <div style={{ backgroundColor: color.surface, border: `1px solid ${color.border}`, borderRadius: 10, padding: 24, overflowX: "auto" }}>
      <svg viewBox="0 0 720 360" style={{ width: "100%", height: "auto", minWidth: 560, display: "block", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#475569" />
          </marker>
        </defs>

        {/* Actors */}
        <g>
          <rect x="60" y="20" width="160" height="44" rx="22" fill="#f1f5f9" stroke="#cbd5e1" />
          <text x="140" y="47" textAnchor="middle" fontSize="13" fill="#0f172a" fontWeight="600">Visitor / Client</text>

          <rect x="500" y="20" width="160" height="44" rx="22" fill="#f1f5f9" stroke="#cbd5e1" />
          <text x="580" y="47" textAnchor="middle" fontSize="13" fill="#0f172a" fontWeight="600">Admin (you)</text>
        </g>

        {/* Site box */}
        <g>
          <rect x="60" y="110" width="600" height="80" rx="10" fill="#eef2ff" stroke="#6366f1" strokeWidth="1.5" />
          <text x="360" y="140" textAnchor="middle" fontSize="15" fill="#3730a3" fontWeight="700">MADE Med Spa Website</text>
          <text x="360" y="163" textAnchor="middle" fontSize="12" fill="#4338ca">Next.js  ·  Convex DB  ·  Clerk Auth</text>
          <text x="360" y="180" textAnchor="middle" fontSize="11" fill="#6366f1" fontStyle="italic">(this app)</text>
        </g>

        {/* Pabau box */}
        <g>
          <rect x="60" y="240" width="260" height="96" rx="10" fill="#fdf2f8" stroke="#db2777" strokeWidth="1.5" />
          <text x="190" y="270" textAnchor="middle" fontSize="14" fill="#9d174d" fontWeight="700">Pabau EMR</text>
          <text x="190" y="290" textAnchor="middle" fontSize="11" fill="#be185d">Booking · Payments</text>
          <text x="190" y="306" textAnchor="middle" fontSize="11" fill="#be185d">Patient records · Calendar</text>
          <text x="190" y="322" textAnchor="middle" fontSize="11" fill="#be185d">Memberships · Services</text>
        </g>

        {/* Convex box */}
        <g>
          <rect x="400" y="240" width="260" height="96" rx="10" fill="#ecfdf5" stroke="#059669" strokeWidth="1.5" />
          <text x="530" y="270" textAnchor="middle" fontSize="14" fill="#065f46" fontWeight="700">Convex DB</text>
          <text x="530" y="290" textAnchor="middle" fontSize="11" fill="#047857">Site copy · Images</text>
          <text x="530" y="306" textAnchor="middle" fontSize="11" fill="#047857">Shop · Memberships</text>
          <text x="530" y="322" textAnchor="middle" fontSize="11" fill="#047857">Team · Testimonials · FAQs</text>
        </g>

        {/* Arrows */}
        {/* Visitor → Site */}
        <line x1="140" y1="64" x2="140" y2="108" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow)" />
        {/* Admin → Site */}
        <line x1="580" y1="64" x2="580" y2="108" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow)" />
        {/* Site ↔ Pabau (one-way read) */}
        <line x1="190" y1="192" x2="190" y2="238" stroke="#db2777" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrow)" />
        <text x="205" y="220" fontSize="10" fill="#9d174d" fontStyle="italic">API read</text>
        {/* Site → Convex */}
        <line x1="530" y1="192" x2="530" y2="238" stroke="#059669" strokeWidth="1.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
        <text x="545" y="220" fontSize="10" fill="#065f46" fontStyle="italic">read / write</text>
      </svg>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 16, fontSize: 12, color: color.textMuted }}>
        <span><span style={{ display: "inline-block", width: 10, height: 10, backgroundColor: "#db2777", borderRadius: 2, marginRight: 6, verticalAlign: "middle" }} />Pabau = source of truth for money, schedules, records</span>
        <span><span style={{ display: "inline-block", width: 10, height: 10, backgroundColor: "#059669", borderRadius: 2, marginRight: 6, verticalAlign: "middle" }} />Convex = source of truth for site copy, images, presentation</span>
      </div>
    </div>
  );
}

// ─── TOC sidebar ────────────────────────────────────────────────────────────

function TOC({ active }: { active: string | null }) {
  return (
    <nav aria-label="Documentation sections" style={{
      position: "sticky",
      top: 24,
      alignSelf: "start",
      borderLeft: `2px solid ${color.borderSoft}`,
      paddingLeft: 16,
    }}>
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: color.textDim,
        marginBottom: 10,
      }}>On this page</div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                style={{
                  display: "block",
                  padding: "5px 10px",
                  fontSize: 13,
                  color: isActive ? color.text : color.textMuted,
                  backgroundColor: isActive ? color.accentSoft : "transparent",
                  borderRadius: 6,
                  textDecoration: "none",
                  fontWeight: isActive ? 600 : 400,
                  lineHeight: 1.4,
                }}
              >
                {s.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ─── Role cards (top of page — quick orientation) ──────────────────────────

function RoleCard({ role, tagline, jumps }: { role: string; tagline: string; jumps: { label: string; href: string }[] }) {
  return (
    <div style={{
      backgroundColor: color.surface,
      border: `1px solid ${color.border}`,
      borderRadius: 10,
      padding: "18px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
    }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: color.textDim, marginBottom: 4 }}>I&apos;m the</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: color.text }}>{role}</div>
        <div style={{ fontSize: 13, color: color.textMuted, marginTop: 4, lineHeight: 1.5 }}>{tagline}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
        {jumps.map((j) => (
          <a key={j.href} href={j.href} style={{
            fontSize: 13,
            color: color.accent,
            textDecoration: "none",
            fontWeight: 500,
          }}>→ {j.label}</a>
        ))}
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────

export default function SystemAdmin() {
  // Env inspection
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  const pabauUrl = process.env.NEXT_PUBLIC_PABAU_BOOKING_URL || "";

  const clerkEnv = clerkKey.startsWith("pk_live_") ? "Production" : clerkKey.startsWith("pk_test_") ? "Development" : "";

  const envVars = [
    { name: "Convex (backend DB)", key: "NEXT_PUBLIC_CONVEX_URL", value: convexUrl },
    { name: "Site URL", key: "NEXT_PUBLIC_SITE_URL", value: siteUrl },
    { name: "Clerk (auth)", key: "Environment", value: clerkEnv },
    { name: "Pabau booking URL", key: "NEXT_PUBLIC_PABAU_BOOKING_URL", value: pabauUrl },
  ];

  // Scroll spy — highlight active section in TOC
  const [activeId, setActiveId] = useState<string | null>("start");
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const targets = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );
    targets.forEach((t) => observer.observe(t));
    observers.push(observer);
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "2rem 1.5rem", color: color.text }}>
      {/* ── Page header ────────────────────────────────────────────── */}
      <header style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: color.textDim, marginBottom: 6 }}>
          Documentation
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: color.text, margin: "0 0 6px 0", lineHeight: 1.2 }}>
          Guide & System
        </h1>
        <p style={{ fontSize: 16, color: color.textMuted, margin: 0, lineHeight: 1.6, maxWidth: 720 }}>
          Everything you need to run the MADE Med Spa website — written for owners, marketers,
          and developers alike. Use the links below or the table of contents to jump in.
        </p>
      </header>

      {/* ── Role cards ─────────────────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 12,
        marginBottom: 40,
      }}>
        <RoleCard
          role="Owner"
          tagline="Running the business. Wants to know the big picture without getting into the weeds."
          jumps={[
            { label: "How this site works", href: "#big-picture" },
            { label: "Pabau integration", href: "#pabau" },
          ]}
        />
        <RoleCard
          role="Marketing team"
          tagline="Day-to-day: edits page copy, tunes SEO, responds to leads, swaps imagery."
          jumps={[
            { label: "Editing pages & content", href: "#content" },
            { label: "SEO & search", href: "#seo" },
            { label: "Leads & contacts", href: "#leads" },
          ]}
        />
        <RoleCard
          role="Developer"
          tagline="Adds features, fixes bugs, ships deploys. Needs the architecture and stack details."
          jumps={[
            { label: "Architecture", href: "#architecture" },
            { label: "Adding a new page", href: "#adding-pages" },
            { label: "Deployment", href: "#deployment" },
          ]}
        />
      </div>

      {/* ── Two-column: TOC + content ──────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) 220px",
        gap: 40,
        alignItems: "start",
      }}
      className="doc-grid"
      >
        {/* ── Content ──────────────────────────────────────────────── */}
        <main style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 48 }}>

          {/* Start here */}
          <section>
            <SectionHeading id="start" audience="all">Start here</SectionHeading>
            <p style={{ fontSize: 15, color: color.textMuted, lineHeight: 1.65, margin: "0 0 16px 0" }}>
              The MADE site is split into a <strong>public marketing site</strong> (what visitors see) and an
              <strong> admin portal</strong> (what you&apos;re looking at now). Everything you edit here
              goes live within seconds — there&apos;s no publish step to remember.
            </p>
            <Callout kind="brand" title="Rule of thumb">
              If it touches money, the calendar, or patient data — do it in <strong>Pabau</strong>.<br />
              If it&apos;s words, images, or how things are presented to visitors — do it <strong>here</strong>.
            </Callout>
            <Card style={{ marginTop: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: color.text, marginBottom: 10 }}>Common tasks — where to find them</div>
              <KV k="Edit page copy or images" v={<Link href="/admin/pages" style={{ color: color.accent }}>Pages</Link>} />
              <KV k="Turn a section on / off, change colors" v={<Link href="/admin/customize" style={{ color: color.accent }}>Customize Pages</Link>} />
              <KV k="Edit SEO titles & descriptions" v={<Link href="/admin/seo" style={{ color: color.accent }}>SEO</Link>} />
              <KV k="Add or edit services" v={<Link href="/admin/services" style={{ color: color.accent }}>Services</Link>} />
              <KV k="Review contact-form leads" v={<Link href="/admin/contacts" style={{ color: color.accent }}>Contacts</Link>} />
              <KV k="Upload a new image or video" v={<Link href="/admin/media" style={{ color: color.accent }}>Media</Link>} />
              <KV k="Sync services from Pabau" v={<Link href="/admin/pabau" style={{ color: color.accent }}>Pabau Sync</Link>} />
            </Card>
          </section>

          {/* Big picture */}
          <section>
            <SectionHeading id="big-picture" audience="all">How this site works</SectionHeading>
            <p style={{ fontSize: 15, color: color.textMuted, lineHeight: 1.65, margin: "0 0 16px 0" }}>
              This website is a custom-coded <strong>marketing &amp; conversion layer</strong>. It attracts visitors,
              educates them, and hands them off to book. <strong>Pabau</strong> is the EMR — bookings, payments,
              charts, memberships, and patient records all live there. The two systems talk through Pabau&apos;s
              REST API.
            </p>
            <ArchitectureDiagram />
            <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Card>
                <div style={{ fontSize: 13, fontWeight: 700, color: color.text, marginBottom: 6 }}>What this site is</div>
                <ul style={{ fontSize: 13, color: color.textMuted, lineHeight: 1.7, paddingLeft: 18, margin: 0 }}>
                  <li>Public marketing site</li>
                  <li>Content management (copy, images)</li>
                  <li>Lead capture (contact + newsletter)</li>
                  <li>Booking <em>entry point</em> (deep-links to Pabau)</li>
                </ul>
              </Card>
              <Card>
                <div style={{ fontSize: 13, fontWeight: 700, color: color.text, marginBottom: 6 }}>What this site is NOT</div>
                <ul style={{ fontSize: 13, color: color.textMuted, lineHeight: 1.7, paddingLeft: 18, margin: 0 }}>
                  <li>A medical records system</li>
                  <li>A calendar / scheduler</li>
                  <li>A payment processor</li>
                  <li>A patient database</li>
                </ul>
              </Card>
            </div>
          </section>

          {/* Data map */}
          <section>
            <SectionHeading id="data-map" audience="all">Where each piece of data lives</SectionHeading>
            <p style={{ fontSize: 15, color: color.textMuted, lineHeight: 1.65, margin: "0 0 12px 0" }}>
              Knowing the source of truth for each kind of data is the fastest way to know where to go when
              something needs changing.
            </p>
            <div style={{ overflowX: "auto", border: `1px solid ${color.border}`, borderRadius: 10, backgroundColor: color.surface }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 560 }}>
                <thead>
                  <tr style={{ backgroundColor: color.bg, borderBottom: `1px solid ${color.border}` }}>
                    <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: color.textMuted, fontSize: 12, letterSpacing: "0.04em", textTransform: "uppercase" }}>Data</th>
                    <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: color.textMuted, fontSize: 12, letterSpacing: "0.04em", textTransform: "uppercase" }}>Source of truth</th>
                    <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: color.textMuted, fontSize: 12, letterSpacing: "0.04em", textTransform: "uppercase" }}>How the site reads it</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Service prices, durations, availability", "Pabau", "Pabau API (cached 5 min)"],
                    ["Service descriptions, photos, sort order", "This site (Convex)", "Convex"],
                    ["Memberships (display)", "This site (Convex)", "Convex"],
                    ["Membership billing & enrollment", "Pabau", "Managed in Pabau"],
                    ["Shop products (display)", "This site (Convex)", "Convex"],
                    ["Shop checkout & inventory", "Pabau", "Managed in Pabau"],
                    ["Bookings & appointments", "Pabau", "Visitors deep-link to Pabau"],
                    ["Payments & deposits", "Pabau", "Not pulled into site"],
                    ["Patient records & charts", "Pabau", "Never pulled — PHI stays in Pabau"],
                    ["Site copy (hero, about, FAQs)", "This site (Convex)", "Convex"],
                    ["Team bios & photos", "This site (Convex)", "Convex"],
                    ["Testimonials", "This site (Convex)", "Convex"],
                    ["Contact form submissions", "This site (Convex)", "Convex"],
                  ].map(([data, truth, read], i) => {
                    const isPabau = truth === "Pabau";
                    return (
                      <tr key={i} style={{ borderBottom: `1px solid ${color.borderSoft}` }}>
                        <td style={{ padding: "10px 14px", color: color.text }}>{data}</td>
                        <td style={{ padding: "10px 14px" }}>
                          <span style={{
                            display: "inline-block",
                            padding: "2px 8px",
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 500,
                            backgroundColor: isPabau ? "#fce7f3" : "#d1fae5",
                            color: isPabau ? "#9d174d" : "#065f46",
                          }}>{truth}</span>
                        </td>
                        <td style={{ padding: "10px 14px", color: color.textMuted }}>{read}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Editing content */}
          <section>
            <SectionHeading id="content" audience="marketing">Editing pages & content</SectionHeading>
            <p style={{ fontSize: 15, color: color.textMuted, lineHeight: 1.65, margin: "0 0 16px 0" }}>
              Every page on the public site has a matching editor under the <strong>Pages</strong> sidebar
              item. Sections are listed top to bottom in the same order they appear on the live site.
            </p>
            <Card>
              <ol style={{ fontSize: 14, color: color.text, lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                <li><strong>Text edits:</strong> expand a section, change the fields, click <em>Save</em>. The change is live within seconds.</li>
                <li><strong>Images / video:</strong> expand a section with media, click <em>Replace</em>, pick a file — it uploads automatically.</li>
                <li><strong>Hide a section:</strong> use <Link href="/admin/customize" style={{ color: color.accent }}>Customize Pages</Link> to toggle sections on or off per page.</li>
                <li><strong>Change colors:</strong> same Customize page — per-page color palette overrides.</li>
              </ol>
            </Card>
            <Callout kind="tip" title="Preview before publishing">
              The Customize Pages tool has a preview mode — changes are shown in a new tab with a purple
              &ldquo;Preview Mode&rdquo; banner. They don&apos;t go live until you click Save.
            </Callout>
          </section>

          {/* SEO */}
          <section>
            <SectionHeading id="seo" audience="marketing">SEO & search</SectionHeading>
            <p style={{ fontSize: 15, color: color.textMuted, lineHeight: 1.65, margin: "0 0 16px 0" }}>
              The <Link href="/admin/seo" style={{ color: color.accent }}>SEO</Link> page lets you edit the
              page title, meta description, and keyword list for every public page. Leave fields blank to
              inherit the site default.
            </p>
            <Card>
              <div style={{ fontSize: 13, fontWeight: 700, color: color.text, marginBottom: 10 }}>Guidelines</div>
              <KV k="Page title" v={<>Under 60 characters. Include location (McLean, VA) and the core service.</>} />
              <KV k="Meta description" v={<>Under 160 characters. Write it like a pitch — why should someone click?</>} />
              <KV k="Keywords" v={<>Comma-separated. Include: service + location, common questions, competitor comparisons.</>} />
              <KV k="Previews" v={<>Each page shows a Google preview and a social-share preview so you can see before saving.</>} />
            </Card>
          </section>

          {/* Leads */}
          <section>
            <SectionHeading id="leads" audience="marketing">Leads & contact forms</SectionHeading>
            <p style={{ fontSize: 15, color: color.textMuted, lineHeight: 1.65, margin: "0 0 16px 0" }}>
              Every contact-form submission lands in <Link href="/admin/contacts" style={{ color: color.accent }}>Contacts</Link>.
              Each row shows the visitor&apos;s name, email, message, and status. You can export the list as
              CSV for email campaigns or CRM imports.
            </p>
            <Card>
              <div style={{ fontSize: 13, fontWeight: 700, color: color.text, marginBottom: 6 }}>Lead flow</div>
              <div style={{ fontSize: 14, color: color.textMuted, lineHeight: 1.7 }}>
                Visitor fills out form → saved to Convex → appears in Contacts → you reply via email → you book them into Pabau.
              </div>
            </Card>
          </section>

          {/* Pabau */}
          <section>
            <SectionHeading id="pabau" audience="all">Pabau integration</SectionHeading>
            <p style={{ fontSize: 15, color: color.textMuted, lineHeight: 1.65, margin: "0 0 16px 0" }}>
              Services are the only place the two systems share data. The sync is one-way — the site reads
              from Pabau, never writes to it.
            </p>

            <Card>
              <div style={{ fontSize: 13, fontWeight: 700, color: color.text, marginBottom: 10 }}>Service sync flow</div>
              <ol style={{ fontSize: 14, color: color.text, lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                <li>Staff creates or edits a service in Pabau (name, price, duration, bookability).</li>
                <li>Admin opens <Link href="/admin/pabau" style={{ color: color.accent }}>Pabau Sync</Link> — the page calls Pabau&apos;s <Code>/services</Code> endpoint and lists everything.</li>
                <li>Admin clicks <em>Import</em> to create a matching record in Convex (stores the Pabau service ID + per-service booking URL).</li>
                <li>The public site shows the Convex record — admin-controlled descriptions, images, sort order — and the Book button deep-links to Pabau.</li>
              </ol>
            </Card>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
              <Card>
                <div style={{ fontSize: 13, fontWeight: 700, color: color.text, marginBottom: 6 }}>API details</div>
                <KV k="Base URL" v={<Code>api.oauth.pabau.com</Code>} />
                <KV k="Endpoints" v={<><Code>/services</Code>, <Code>/packages</Code>, <Code>/products</Code></>} />
                <KV k="Rate limit" v="25,000 / day · 110 / min" />
                <KV k="Cache" v="5 min on site-side API route" />
                <KV k="Auth" v={<>API key, server-side only (<Code>PABAU_API_KEY</Code>)</>} />
              </Card>

              <Card>
                <div style={{ fontSize: 13, fontWeight: 700, color: color.text, marginBottom: 6 }}>Booking & payments</div>
                <div style={{ fontSize: 14, color: color.textMuted, lineHeight: 1.6 }}>
                  <strong>Book Now</strong> buttons deep-link to Pabau — pre-selected to the service when available,
                  falling back to the generic <Code>NEXT_PUBLIC_PABAU_BOOKING_URL</Code>. All payments (deposits,
                  memberships, shop) happen in Pabau, never here.
                </div>
              </Card>
            </div>

            <Callout kind="warn" title="Webhooks — not yet wired">
              Pabau supports outbound webhooks. If a price changes in Pabau, the site&apos;s cached Convex record
              is stale until re-imported. The planned fix: a <Code>/api/pabau/webhook</Code> endpoint that
              auto-updates Convex when Pabau emits a change event.
            </Callout>
          </section>

          {/* Architecture */}
          <section>
            <SectionHeading id="architecture" audience="dev">Architecture & stack</SectionHeading>
            <Card>
              <KV k="Framework" v="Next.js 16 (App Router)" />
              <KV k="Backend" v="Convex (real-time DB, queries, mutations, file storage)" />
              <KV k="Auth" v="Clerk" />
              <KV k="EMR" v="Pabau (REST API)" />
              <KV k="Styling" v="CSS variables + Tailwind" />
              <KV k="Hosting" v="Vercel (auto-deploy on push)" />
            </Card>
            <Card style={{ marginTop: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: color.text, marginBottom: 10 }}>Key directories</div>
              <div style={{ fontFamily: "ui-monospace, SFMono-Regular, monospace", fontSize: 13, color: color.textMuted, lineHeight: 1.9 }}>
                <div><Code>src/app/</Code> — public pages and routes</div>
                <div><Code>src/app/admin/</Code> — admin portal pages</div>
                <div><Code>src/components/sections/</Code> — public page section components</div>
                <div><Code>src/components/admin/</Code> — admin UI components</div>
                <div><Code>src/hooks/</Code> — <Code>usePageSettings</Code>, <Code>useSectionContent</Code></div>
                <div><Code>src/lib/</Code> — section definitions, page settings helpers</div>
                <div><Code>convex/</Code> — schema, queries, mutations, seeds</div>
              </div>
            </Card>
            <Card style={{ marginTop: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: color.text, marginBottom: 10 }}>How section content works</div>
              <ol style={{ fontSize: 14, color: color.text, lineHeight: 1.75, paddingLeft: 20, margin: 0 }}>
                <li>Section definitions in <Code>src/lib/sectionDefinitions.ts</Code> declare what&apos;s editable per section.</li>
                <li>The admin page editor reads definitions and renders <Code>SectionEditorCard</Code> components.</li>
                <li>Admin saves → upserts to the <Code>siteContent</Code> table with a metadata JSON payload.</li>
                <li>Public pages read via the <Code>useSectionContent(key, defaults)</Code> hook.</li>
                <li>If no DB value exists, the hook falls back to the hardcoded default.</li>
              </ol>
            </Card>
          </section>

          {/* Adding pages */}
          <section>
            <SectionHeading id="adding-pages" audience="dev">Adding a new page</SectionHeading>
            <Card>
              <ol style={{ fontSize: 14, color: color.text, lineHeight: 1.85, paddingLeft: 20, margin: 0 }}>
                <li>Create the public route: <Code>src/app/[slug]/page.tsx</Code>.</li>
                <li>Add a <Code>PageDefinition</Code> in <Code>src/lib/sectionDefinitions.ts</Code>.</li>
                <li>Create the admin editor: <Code>src/app/admin/pages/[slug]/page.tsx</Code> (thin wrapper passing the definition to <Code>PageEditor</Code>).</li>
                <li>Add to the admin sidebar in <Code>src/app/admin/layout.tsx</Code>.</li>
                <li>Add to the public nav in <Code>src/components/layout/Navigation.tsx</Code>.</li>
                <li>Add SEO metadata in <Code>src/app/[slug]/layout.tsx</Code>.</li>
              </ol>
            </Card>
          </section>

          {/* Deployment */}
          <section>
            <SectionHeading id="deployment" audience="dev">Deployment</SectionHeading>
            <Card>
              <ol style={{ fontSize: 14, color: color.text, lineHeight: 1.85, paddingLeft: 20, margin: 0 }}>
                <li>Push to GitHub → Vercel auto-deploys the web app.</li>
                <li>For Convex schema or function changes: run <Code>npx convex deploy</Code>.</li>
                <li>Environment variables must be set on the Vercel dashboard.</li>
                <li>Verify all env vars are present under <a href="#status" style={{ color: color.accent }}>System status</a> below.</li>
              </ol>
            </Card>
          </section>

          {/* Status */}
          <section>
            <SectionHeading id="status" audience="dev">System status</SectionHeading>
            <p style={{ fontSize: 15, color: color.textMuted, lineHeight: 1.65, margin: "0 0 16px 0" }}>
              Connected-service health for this environment. If any item is missing, the corresponding
              feature will fail — re-check the hosting platform&apos;s environment variables.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {envVars.map((env) => {
                const ok = env.value.length > 0;
                return (
                  <div key={env.key} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "12px 16px",
                    backgroundColor: color.surface,
                    border: `1px solid ${color.border}`,
                    borderLeft: `4px solid ${ok ? "#10b981" : "#ef4444"}`,
                    borderRadius: 8,
                  }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: color.text }}>{env.name}</div>
                      <div style={{ fontSize: 12, color: color.textMuted, fontFamily: "ui-monospace, SFMono-Regular, monospace", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {env.key}: {ok ? (env.value.length > 60 ? env.value.slice(0, 60) + "…" : env.value) : "not set"}
                      </div>
                    </div>
                    <span style={{
                      flexShrink: 0,
                      padding: "3px 10px",
                      borderRadius: 9999,
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      backgroundColor: ok ? color.successBg : color.dangerBg,
                      color: ok ? color.success : color.danger,
                    }}>
                      {ok ? "Connected" : "Missing"}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </main>

        {/* ── Sticky TOC ─────────────────────────────────────────── */}
        <aside>
          <TOC active={activeId} />
        </aside>
      </div>

      {/* Responsive: hide TOC on narrow screens */}
      <style>{`
        @media (max-width: 900px) {
          .doc-grid {
            grid-template-columns: 1fr !important;
          }
          .doc-grid > aside { display: none; }
        }
      `}</style>
    </div>
  );
}

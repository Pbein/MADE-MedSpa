"use client";

import { ReactNode } from "react";
import Link from "next/link";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details style={{
      backgroundColor: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "0.5rem",
      marginBottom: "0.5rem",
      overflow: "hidden",
    }}>
      <summary style={{
        padding: "0.875rem 1.25rem",
        cursor: "pointer",
        fontSize: "0.9375rem",
        fontWeight: 600,
        color: "#111827",
        userSelect: "none",
        listStyle: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span>{title}</span>
        <span style={{ fontSize: "0.75rem", color: "#9ca3af", fontWeight: 400 }}>click to expand</span>
      </summary>
      <div style={{ padding: "0 1.25rem 1.25rem", fontSize: "0.875rem", color: "#374151", lineHeight: 1.7 }}>
        {children}
      </div>
    </details>
  );
}

function Heading({ children }: { children: ReactNode }) {
  return <h2 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#111827", marginTop: "2rem", marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: "1px solid #e5e7eb" }}>{children}</h2>;
}

export default function AdminGuidePage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#111827", margin: "0 0 0.25rem 0" }}>
        Admin Guide
      </h1>
      <p style={{ fontSize: "0.9375rem", color: "#6b7280", margin: "0 0 2rem 0" }}>
        Everything you need to know about managing the MADE Med Spa website. For all users: founder, marketing team, and developers.
      </p>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      <Heading>For Everyone</Heading>

      <Section title="How the Page Editor Works">
        <p>Each page on the website has a corresponding editor in the <strong>Pages</strong> section of the sidebar. When you click a page (e.g., &ldquo;Homepage&rdquo;), you see all its sections listed top to bottom, exactly as they appear on the live site.</p>
        <p><strong>To edit text:</strong> Expand a section, change the text fields, and click Save. The change goes live immediately.</p>
        <p><strong>To change an image or video:</strong> Expand a section with media, click Replace, select a file, and it uploads automatically.</p>
        <p><strong>To hide a section:</strong> Use the <Link href="/admin/customize" style={{ color: "#6366f1" }}>Customize Pages</Link> tool to toggle sections on or off.</p>
        <p><strong>To change colors:</strong> Use the <Link href="/admin/customize" style={{ color: "#6366f1" }}>Customize Pages</Link> tool to adjust color palettes per page.</p>
      </Section>

      <Section title="What Each Sidebar Section Does">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
              <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", fontWeight: 600, color: "#6b7280" }}>Section</th>
              <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", fontWeight: 600, color: "#6b7280" }}>What It Does</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Your Business", "Manage the data behind your services, memberships, products, and team members"],
              ["Pages", "Edit what visitors see on each page \u2014 text, images, layout"],
              ["Content (SEO, FAQs, Testimonials)", "SEO metadata for search engines, FAQ content, and client reviews"],
              ["Leads", "View contact form submissions and sync with Pabau"],
              ["Settings", "Global site settings and system information"],
            ].map(([section, desc]) => (
              <tr key={section} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "0.5rem 0.75rem", fontWeight: 500 }}>{section}</td>
                <td style={{ padding: "0.5rem 0.75rem" }}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="Preview vs. Publish">
        <p>When you save changes in a page editor, they go live immediately. The site reads from the database in real-time.</p>
        <p>If you want to preview before publishing, use the <strong>Customize Pages</strong> tool which supports a preview mode \u2014 changes are shown in a new tab with a purple &ldquo;Preview Mode&rdquo; banner but are not live until you save.</p>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      <Heading>For the Marketing Team</Heading>

      <Section title="SEO: How to Optimize for Search">
        <p>Go to <Link href="/admin/seo" style={{ color: "#6366f1" }}>SEO Settings</Link> to edit page titles, meta descriptions, and keywords for each page. Tips:</p>
        <ul style={{ paddingLeft: "1.25rem" }}>
          <li><strong>Page title:</strong> Keep under 60 characters. Include location (McLean, VA) and key service.</li>
          <li><strong>Meta description:</strong> Keep under 160 characters. Write like a pitch \u2014 why should someone click?</li>
          <li><strong>Keywords:</strong> Comma-separated. Include: service name + location, competitor comparisons, long-tail queries.</li>
        </ul>
        <p>The SEO page shows a Google preview and a social sharing preview so you can see exactly how the page will appear in search results and when shared on social media.</p>
      </Section>

      <Section title="Managing Leads & Contacts">
        <p><Link href="/admin/contacts" style={{ color: "#6366f1" }}>Contacts</Link> shows all form submissions from the website. Each submission shows name, email, message, and status (new/read/replied).</p>
        <p><strong>Export CSV:</strong> Click the &ldquo;Export CSV&rdquo; button to download all contacts for email campaigns or CRM import.</p>
        <p><strong>Lead flow:</strong> Visitor fills out contact form &rarr; saved to database &rarr; appears in admin &rarr; you reply via email &rarr; book them in Pabau.</p>
      </Section>

      <Section title="Content Updates for Keyword Targeting">
        <p>To update content for better keyword targeting, go to <strong>Pages</strong> in the sidebar and edit the relevant section&apos;s text. For example:</p>
        <ul style={{ paddingLeft: "1.25rem" }}>
          <li>To target &ldquo;Botox McLean VA&rdquo;, edit the Services page hero subtitle to mention Botox and McLean</li>
          <li>To target seasonal keywords, update CTA banners with seasonal messaging</li>
          <li>To improve local SEO, mention &ldquo;McLean, VA&rdquo;, &ldquo;Northern Virginia&rdquo;, &ldquo;DMV&rdquo; in page text</li>
        </ul>
      </Section>

      <Section title="What to Update Seasonally">
        <ul style={{ paddingLeft: "1.25rem" }}>
          <li><strong>CTA banners:</strong> Update headlines to match seasonal promotions or events</li>
          <li><strong>Featured services:</strong> Reorder services in the admin to highlight seasonal treatments</li>
          <li><strong>Testimonials:</strong> Add fresh testimonials regularly \u2014 they&apos;re the #2 conversion driver</li>
          <li><strong>Hero images:</strong> Swap in seasonal imagery via the page editors</li>
        </ul>
      </Section>

      <Section title="How to Use Pabau for Business Insights">
        <p>Pabau is your EMR and business management platform. Use it for:</p>
        <ul style={{ paddingLeft: "1.25rem" }}>
          <li><strong>Booking reports:</strong> See which services are most booked, revenue by period</li>
          <li><strong>Client retention:</strong> Track repeat visits and client lifetime value</li>
          <li><strong>Service sync:</strong> Add services in Pabau and sync to the website via <Link href="/admin/pabau" style={{ color: "#6366f1" }}>Pabau Sync</Link></li>
        </ul>
        <p>The website handles marketing and first impressions. Pabau handles everything after the client books.</p>
      </Section>

      <Section title="Requesting Structural Changes">
        <p>Some changes require the dev team (not the admin portal):</p>
        <ul style={{ paddingLeft: "1.25rem" }}>
          <li>Adding new pages or changing the site map</li>
          <li>Major UX changes (new booking flow, concern-first navigation)</li>
          <li>Adding new features (blog, client portal, reviews integration)</li>
          <li>Changing the navigation structure</li>
          <li>Domain or hosting changes</li>
        </ul>
        <p>For these, contact the dev team with a description of what you want and why. The dev team will implement and deploy.</p>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      <Heading>For Developers</Heading>

      <Section title="Architecture Overview">
        <p><strong>Stack:</strong> Next.js 16 + React + Convex (real-time backend) + Clerk (auth) + Tailwind CSS</p>
        <p><strong>Key directories:</strong></p>
        <ul style={{ paddingLeft: "1.25rem", fontFamily: "monospace", fontSize: "0.8125rem" }}>
          <li>src/app/ \u2014 Next.js pages and routes</li>
          <li>src/app/admin/ \u2014 Admin portal pages</li>
          <li>src/components/sections/ \u2014 Public page section components</li>
          <li>src/components/admin/ \u2014 Admin UI components (SectionEditorCard, PageEditor)</li>
          <li>src/hooks/ \u2014 usePageSettings, useSectionContent</li>
          <li>src/lib/ \u2014 sectionDefinitions, pageSettings helpers</li>
          <li>convex/ \u2014 Convex schema, queries, mutations, seed data</li>
        </ul>
      </Section>

      <Section title="How Section Content Works">
        <p>The <code>siteContent</code> Convex table stores all editable content as key-value pairs. Section content uses keys like <code>section_home_hero</code>, <code>section_about_cta</code>, etc.</p>
        <p><strong>Data flow:</strong></p>
        <ol style={{ paddingLeft: "1.25rem" }}>
          <li>Section definitions in <code>src/lib/sectionDefinitions.ts</code> define what&apos;s editable per section</li>
          <li>Admin page editor reads definitions and renders SectionEditorCard components</li>
          <li>Admin saves &rarr; upserts to siteContent table with metadata JSON</li>
          <li>Public pages read via <code>useSectionContent(key, defaults)</code> hook</li>
          <li>If no DB value exists, the hardcoded default is used</li>
        </ol>
      </Section>

      <Section title="How to Add a New Page">
        <ol style={{ paddingLeft: "1.25rem" }}>
          <li>Create the public page route in <code>src/app/[page-name]/page.tsx</code></li>
          <li>Add a <code>PageDefinition</code> to <code>src/lib/sectionDefinitions.ts</code></li>
          <li>Create the admin page editor route in <code>src/app/admin/pages/[page-name]/page.tsx</code> (thin wrapper passing the definition to PageEditor)</li>
          <li>Add to the sidebar nav in <code>src/app/admin/layout.tsx</code></li>
          <li>Add to the public navigation in <code>src/components/layout/Navigation.tsx</code></li>
          <li>Add SEO metadata layout in <code>src/app/[page-name]/layout.tsx</code></li>
        </ol>
      </Section>

      <Section title="Deployment Process">
        <ol style={{ paddingLeft: "1.25rem" }}>
          <li>Push to GitHub &rarr; Vercel auto-deploys (or deploy manually)</li>
          <li>For Convex schema changes: run <code>npx convex deploy</code></li>
          <li>Environment variables must be set on hosting platform (Vercel dashboard)</li>
          <li>See <Link href="/admin/system" style={{ color: "#6366f1" }}>System</Link> page for connected services and env var status</li>
        </ol>
      </Section>
    </div>
  );
}

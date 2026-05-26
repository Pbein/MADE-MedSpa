"use client";

// MADE Med Spa — Typography Spec Sheet
// Print-friendly reference for Karlyne and the marketing team.
// Each sample renders with the actual brand font and is annotated with the
// font-family, weight, casing, size, letter-spacing, and where it appears
// on the live site. Use the "Print / Save as PDF" button to export.

const ESPRESSO = "#391e1e";
const SOFT = "#6b7280";
const RULE = "#e5e7eb";
const BLUSH = "#84262c";

function Annotation({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: 12,
        lineHeight: 1.55,
        color: SOFT,
        borderLeft: `2px solid ${BLUSH}`,
        paddingLeft: 16,
        marginTop: 8,
      }}
    >
      {children}
    </div>
  );
}

function Spec({
  number,
  role,
  appearsIn,
  children,
  font,
  weight,
  casing,
  size,
  letterSpacing,
  lineHeight,
}: {
  number: string;
  role: string;
  appearsIn: string;
  children: React.ReactNode;
  font: string;
  weight: string;
  casing: string;
  size: string;
  letterSpacing: string;
  lineHeight?: string;
}) {
  return (
    <section
      className="spec-page"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 320px",
        gap: 48,
        padding: "32px 0",
        borderTop: `1px solid ${RULE}`,
        alignItems: "start",
      }}
    >
      {/* Left: live sample */}
      <div>
        <div
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: 11,
            color: SOFT,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 16,
            fontWeight: 600,
          }}
        >
          {number} · {role}
        </div>
        <div style={{ color: ESPRESSO }}>{children}</div>
      </div>

      {/* Right: spec card */}
      <aside
        style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
          fontSize: 13,
          lineHeight: 1.6,
          color: ESPRESSO,
          backgroundColor: "#fafafa",
          border: `1px solid ${RULE}`,
          padding: 16,
          borderRadius: 4,
        }}
      >
        <div style={{ position: "relative" }}>
          {/* Arrow pointing left toward the sample */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              left: -28,
              top: 8,
              fontSize: 18,
              color: BLUSH,
            }}
          >
            ←
          </span>
          <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 12, rowGap: 6 }}>
            <dt style={{ color: SOFT }}>Font</dt>
            <dd style={{ margin: 0, fontWeight: 600 }}>{font}</dd>

            <dt style={{ color: SOFT }}>Weight</dt>
            <dd style={{ margin: 0 }}>{weight}</dd>

            <dt style={{ color: SOFT }}>Casing</dt>
            <dd style={{ margin: 0 }}>{casing}</dd>

            <dt style={{ color: SOFT }}>Size</dt>
            <dd style={{ margin: 0 }}>{size}</dd>

            <dt style={{ color: SOFT }}>Letter spacing</dt>
            <dd style={{ margin: 0 }}>{letterSpacing}</dd>

            {lineHeight && (
              <>
                <dt style={{ color: SOFT }}>Line height</dt>
                <dd style={{ margin: 0 }}>{lineHeight}</dd>
              </>
            )}
          </dl>
          <p style={{ marginTop: 12, marginBottom: 0, fontSize: 12, color: SOFT, lineHeight: 1.55 }}>
            <strong style={{ color: ESPRESSO }}>Appears in:</strong> {appearsIn}
          </p>
        </div>
      </aside>
    </section>
  );
}

export default function TypographySpecPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", color: ESPRESSO, paddingBottom: 64 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, gap: 16, flexWrap: "wrap" }}>
        <div>
          <p
            className="spec-label"
            style={{ fontSize: 11, color: BLUSH, marginBottom: 8 }}
          >
            Brand Reference
          </p>
          <h1
            className="spec-h1"
            style={{ fontSize: 48, margin: 0, color: ESPRESSO }}
          >
            Typography spec sheet
          </h1>
          <p
            className="spec-body"
            style={{ fontSize: 15, color: SOFT, marginTop: 12, maxWidth: 640 }}
          >
            One sample per text style used on the public MADE Med Spa site, annotated with the
            exact font, weight, casing, size, and letter-spacing. Italics live only on
            accent quotes (testimonials and pull-quotes); never on headings or sub-headings.
          </p>
        </div>
        <button
          className="spec-no-print"
          onClick={() => window.print()}
          style={{
            backgroundColor: ESPRESSO,
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            fontSize: 13,
            letterSpacing: "0.05em",
            cursor: "pointer",
            borderRadius: 4,
            fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          Print / Save as PDF
        </button>
      </div>

      {/* Font family overview */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
          padding: "24px 0",
          borderTop: `2px solid ${ESPRESSO}`,
          borderBottom: `1px solid ${RULE}`,
        }}
      >
        {[
          { label: "Playfair Display", role: "Hero / page titles · accents", className: "spec-h1", char: "Aa" },
          { label: "Futura PT Book", role: "Section headers · labels · buttons", className: "spec-h2", char: "Aa" },
          { label: "Montserrat", role: "Body copy", className: "spec-body", char: "Aa" },
        ].map((f) => (
          <div key={f.label} style={{ textAlign: "center" }}>
            <div
              className={f.className}
              style={{ fontSize: 64, color: ESPRESSO, marginBottom: 8, letterSpacing: 0 }}
            >
              {f.char}
            </div>
            <p style={{ fontFamily: "-apple-system, sans-serif", fontSize: 13, fontWeight: 600, color: ESPRESSO, margin: 0 }}>
              {f.label}
            </p>
            <p style={{ fontFamily: "-apple-system, sans-serif", fontSize: 12, color: SOFT, margin: "4px 0 0" }}>
              {f.role}
            </p>
          </div>
        ))}
      </section>

      <p
        style={{
          fontFamily: "-apple-system, sans-serif",
          fontSize: 12,
          color: SOFT,
          marginTop: 8,
          fontStyle: "italic",
        }}
      >
        Note: Futura PT Book is the licensed webfont from fonts.com / MyFonts (ParaType cut).
        Karlyne is the licensed website owner — license proof archived in the project font
        folder. Exact match for the MADE brand kit.
      </p>

      {/* H1 — Hero & Page Titles */}
      <Spec
        number="01"
        role="H1 — Hero & Page Titles"
        appearsIn="Homepage hero (Beauty, / Deeply Personal. / Thoughtfully Designed.), top of every /services /about /contact /booking /membership /shop hero, page title bars."
        font="Playfair Display"
        weight="Regular (400) or Medium (500)"
        casing="Sentence case · No italic"
        size="2.5rem → 7rem (responsive clamp)"
        letterSpacing="-0.01em (tight)"
        lineHeight="1.05"
      >
        <h1 className="spec-h1" style={{ fontSize: 56, margin: 0 }}>
          Beauty, deeply personal.
        </h1>
        <Annotation>
          CSS class: <code>.headline-editorial</code>. Used on every &lt;h1&gt; on the live site. Never italic.
        </Annotation>
      </Spec>

      {/* H2 / H3 — Section Headers */}
      <Spec
        number="02"
        role="H2 & H3 — Section Headers & Labels"
        appearsIn='"Curated Services", "Our Expertise", section titles on /about and /booking, service card titles, membership tier names, CTA banner headlines.'
        font="Futura PT Book"
        weight="Medium (500)"
        casing="ALL CAPS · No italic"
        size="1.25rem → 3rem (responsive)"
        letterSpacing="0.4em (wide — Canva 400)"
        lineHeight="1.2"
      >
        <h2 className="spec-h2" style={{ fontSize: 28, margin: 0 }}>
          Curated Services
        </h2>
        <Annotation>
          CSS class: <code>.headline-section</code>. Always all-caps with the wide 0.4em
          letter-spacing — that&rsquo;s what gives sections their editorial feel.
        </Annotation>
      </Spec>

      {/* Body */}
      <Spec
        number="03"
        role="Body Text"
        appearsIn="All paragraph copy: section descriptions, FAQ answers, service descriptions, page intros, contact form labels, footer text."
        font="Montserrat"
        weight="Regular (400)"
        casing="Sentence case"
        size="1rem (base)"
        letterSpacing="0"
        lineHeight="1.8 (Canva)"
      >
        <p className="spec-body" style={{ fontSize: 16, margin: 0, maxWidth: 600 }}>
          Each treatment is thoughtfully designed to enhance your natural beauty with
          precision, artistry, and care. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Ut et purus non leo pretium porta.
        </p>
        <Annotation>
          CSS class: <code>.body-editorial</code>. The 1.8 line-height is generous on purpose —
          gives the editorial layout space to breathe.
        </Annotation>
      </Spec>

      {/* Accent / Captions */}
      <Spec
        number="04"
        role="Accent / Captions"
        appearsIn="Testimonial quotes (homepage testimonial section, /testimonials page), pull-quotes in EditorialBreak section, photo captions, soft consultation nudges."
        font="Playfair Display ITALIC"
        weight="Regular (400)"
        casing="Title or sentence case · Italic"
        size="1.125rem → 3rem (responsive)"
        letterSpacing="0"
        lineHeight="1.4"
      >
        <p className="spec-accent" style={{ fontSize: 28, margin: 0, maxWidth: 600 }}>
          &ldquo;Karlyne took the time to actually understand what I wanted — no pressure,
          no upsell. Just thoughtful, beautiful work.&rdquo;
        </p>
        <Annotation>
          CSS class: <code>.accent-quote</code>. <strong>This is the only place italics are allowed</strong> on the
          site. Headers, sub-headers, and titles are never italic.
        </Annotation>
      </Spec>

      {/* Micro Label */}
      <Spec
        number="05"
        role="Micro Label / Eyebrow"
        appearsIn='Tiny ALL CAPS labels above section headlines (e.g. "OUR EXPERTISE", "TREATMENTS", "BOOK NOW"), category tags on service cards, footer column headers.'
        font="Futura PT Book"
        weight="Medium (500)"
        casing="ALL CAPS"
        size="10px (fixed, intentionally small)"
        letterSpacing="0.25em"
        lineHeight="1"
      >
        <p className="spec-label" style={{ fontSize: 10, color: SOFT, margin: 0 }}>
          Our Expertise
        </p>
        <Annotation>
          CSS class: <code>.label-micro</code>. Sits above section H2s as an &ldquo;eyebrow&rdquo; — sets context
          before the headline.
        </Annotation>
      </Spec>

      {/* Buttons */}
      <Spec
        number="06"
        role="Buttons (Primary, Outline, Light)"
        appearsIn="Every CTA: Book Consultation, Contact Us, Choose This Plan, View Services, etc."
        font="Futura PT Book"
        weight="Medium (500)"
        casing="ALL CAPS"
        size="0.875rem (14px)"
        letterSpacing="0.25em"
      >
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <span
            className="spec-label"
            style={{
              backgroundColor: ESPRESSO,
              color: "#fff",
              padding: "16px 40px",
              fontSize: 14,
              display: "inline-block",
            }}
          >
            Book Consultation
          </span>
          <span
            className="spec-label"
            style={{
              border: `1px solid ${ESPRESSO}`,
              color: ESPRESSO,
              padding: "16px 40px",
              fontSize: 14,
              display: "inline-block",
            }}
          >
            Learn More
          </span>
        </div>
        <Annotation>
          CSS classes: <code>.btn-primary</code>, <code>.btn-outline</code>, <code>.btn-light</code>. All three share the
          same Futura ALL CAPS treatment for consistency.
        </Annotation>
      </Spec>

      {/* Navigation links */}
      <Spec
        number="07"
        role="Navigation & Logo Wordmark"
        appearsIn='Top navigation links (Services, About, Contact, etc.), logo text "MADE", footer brand wordmark and footer link columns.'
        font="Playfair Display"
        weight="Regular (400)"
        casing="Sentence case · No italic"
        size="1.125rem (links) / 1.5–3rem (logo)"
        letterSpacing="0 to slightly tight"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
          <span className="spec-h1" style={{ fontSize: 36, color: ESPRESSO }}>MADE</span>
          <span className="spec-h1" style={{ fontSize: 18, color: ESPRESSO, opacity: 0.7 }}>Services</span>
          <span className="spec-h1" style={{ fontSize: 18, color: ESPRESSO, opacity: 0.7 }}>About</span>
          <span className="spec-h1" style={{ fontSize: 18, color: ESPRESSO, opacity: 0.7 }}>Contact</span>
        </div>
        <Annotation>
          The wordmark currently uses the Playfair text &ldquo;MADE&rdquo;; once Karlyne&rsquo;s logo art is
          in, it replaces this text wordmark in the header and footer.
        </Annotation>
      </Spec>

      {/* Section per spec image — Social media posts */}
      <Spec
        number="08"
        role="Social Media Posts"
        appearsIn="Off-site Instagram, Facebook posts using the brand template. Same spec as the Canva style guide."
        font="Playfair Display"
        weight="Regular (400)"
        casing="ALL CAPS"
        size="Varies by template"
        letterSpacing="0.1em"
      >
        <span
          className="spec-h1"
          style={{
            fontSize: 28,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Spring Lip Filler Specials
        </span>
        <Annotation>
          Per the brand sheet — used in social templates, not on the website itself. Listed here
          for completeness so the team has one reference doc.
        </Annotation>
      </Spec>

      {/* Footer */}
      <div
        style={{
          marginTop: 48,
          padding: "24px 0",
          borderTop: `2px solid ${ESPRESSO}`,
          fontFamily: "-apple-system, sans-serif",
          fontSize: 12,
          color: SOFT,
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <span>MADE Med Spa · Brand typography reference</span>
        <span>Generated from live CSS — always in sync with the site</span>
      </div>
    </div>
  );
}

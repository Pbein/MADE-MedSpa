# Customize-Design Architecture

**Status:** Phase 2 of customize-design rework. Locks the contract before code changes.
**Audience:** any developer touching section components on this site.

## Problem statement

The customize-design panel sets CSS variables on a section wrapper. **Every descendant of that wrapper must use the variables consistently for overrides to work.** Currently many components hardcode hex values, breaking the override chain.

This document defines the contract: which variables exist, what they mean, where to use them, and how to provide fallbacks.

## Token system

### Color tokens (T1–T6, matching the customize-design panel)

Each token has a **semantic name** (what it represents in the design system) and a **default value** (the current hardcoded look that must continue to work when no override is set).

| Token | Default value | Semantic meaning | When to use |
|---|---|---|---|
| `--color-surface` | varies per page (espresso for hero, cream for body) | Section background | The outermost background of a section. Set on the wrapper, not on inner elements. |
| `--color-on-surface` | `#391e1e` (espresso) on light bg / `#f6f1ea` (cream) on dark bg | Primary text — headlines, prominent body | Headlines, hero text, primary content text. Aliases as `--color-primary` in legacy code; treat them as the same value. |
| `--color-on-surface-variant` | `#391e1e` at ~70% opacity | Secondary / muted text | Subtitles, captions, descriptions, eyebrow labels. Lower visual hierarchy. |
| `--color-secondary` | `#84262c` (blush red) | Accent — links, secondary CTAs, brand-touched details | Anything where you want the blush accent to draw attention. Not for body text. |
| `--btn-bg` | `#391e1e` (espresso) | Button background fill | Used by `.btn-primary` global class — already wired. Section components should NOT override per-button. |
| `--btn-text` | `#f6f1ea` (cream) | Button label color | Used by `.btn-primary` global class — already wired. |
| `--divider-color` | `#d4c3c2` (light blush) | Section dividers, hairlines | Decorative horizontal/vertical rules, subtle separator lines. |

### Typography tokens (added in Phase 4 — not active yet)

| Token | Default value | Semantic meaning |
|---|---|---|
| `--font-headline` | Cormorant Garamond | Headlines (h1–h3) and display text |
| `--font-body` | Inter | Body copy, captions, eyebrows |
| `--text-headline-size` | `clamp(2.5rem, 4vw, 3.5rem)` | Section headline size — responsive |
| `--text-headline-weight` | `400` | Headline weight |
| `--text-headline-italic` | `italic` | Whether headlines are italic |
| `--text-body-size` | `1rem` | Body copy size |
| `--text-body-weight` | `400` | Body copy weight |

(Detailed in Phase 4 once colors are clean.)

## The contract for section components

Every section component **must follow these rules** so customize-design overrides flow through. Violations are bugs.

### Rule 1 — Wrap each section in a single root element with the section ID

```tsx
// ✅ Correct — id is what the customize-design wrapper targets
<section id="section-hero" className="...">
  ...
</section>
```

The page that composes the section sets the inline-style overrides on this wrapper via `getSectionDesignServer(meta, "hero")`. The inline styles set CSS variables that cascade to descendants.

### Rule 2 — NO hardcoded hex values in section components

```tsx
// ❌ Forbidden
<h2 style={{ color: "#391e1e" }}>{headline}</h2>
<div className="bg-[#f0ede4]">...</div>

// ✅ Required — use a CSS variable with a fallback
<h2 style={{ color: "var(--color-primary, #391e1e)" }}>{headline}</h2>
<div style={{ backgroundColor: "var(--color-surface, #f0ede4)" }}>...</div>
```

The fallback after the comma matches the pre-rework hardcoded value. **The design must look identical when no override is set.** This means we can refactor without visual regression.

### Rule 3 — Tailwind hex utilities are forbidden in section components

```tsx
// ❌ Forbidden — Tailwind hex utilities can't read CSS variables
<div className="bg-[#f0ede4] text-[#391e1e]">...</div>

// ✅ Required — use inline style or Tailwind arbitrary value with var()
<div style={{ backgroundColor: "var(--color-surface, #f0ede4)", color: "var(--color-primary, #391e1e)" }}>
```

(Tailwind v4 supports `bg-[var(--token)]` arbitrary values too, which is fine. The restriction is specifically on hex literals.)

### Rule 4 — Drop visual-style props that fork hardcoded colors

```tsx
// ❌ Anti-pattern — `dark` prop hardcodes one path's colors
<CTABanner dark={true} ... />  // forces #391e1e everywhere internally

// ✅ Required — single code path, color comes from CSS variables (which the wrapper or default sets)
<CTABanner ... />
```

Components don't need to know whether the section is dark or light. The CSS variables tell them. The page composing the section can apply a `designStyle` preset (e.g., `espresso-dark`) which sets the right variables on the wrapper.

### Rule 5 — Decorative gradients use variables when meaningful, hex when truly tuned

Gradient stops that map to design tokens (e.g., a gradient from surface → glaze) should use `var(--color-surface)`. Gradient stops that are visual transitions (e.g., 6%, 15% opacity stops in a fade) can keep their hex literals — those aren't user-overridable design tokens, they're visual tuning details.

Use judgment. When in doubt, prefer `var()` with a hex fallback.

### Rule 6 — Page-level inline section markup follows the same rules

If a page (e.g., `/membership`) renders sections inline instead of via a component, the same rules apply. No local color constants like `const ESPRESSO = "#391e1e"` — use CSS variables.

## How overrides flow (the cascade)

```
Site root (globals.css :root)
    --color-surface: #f6f1ea  (default cream)
    --color-on-surface: #391e1e  (default espresso)
        ↓ inherits to all descendants
    
Page wrapper (set by buildStyleOverrides for page-level customize)
    [usually no overrides]
        ↓
        
Section wrapper (set by getSectionDesignServer for section-level customize)
    style={{ "--color-surface": "#391e1e", "--color-on-surface": "#f6f1ea" }}
        ↓ overrides cascade to all descendants in this section
        
Section component (must read variables, not hardcode hex)
    <h2 style={{ color: "var(--color-primary, #391e1e)" }}>
        ↓ if --color-primary is set on wrapper, h2 picks it up
        ↓ else falls back to #391e1e
```

When admin picks "Cream" for headline text in customize-design panel, the section wrapper gets `style={{ "--color-on-surface": "#f6f1ea" }}`. The h2 reads `var(--color-primary, ...)`. The variable cascades. Headline turns cream. Done.

When admin doesn't set anything, the variable isn't on the wrapper. The h2 reads the fallback `#391e1e`. Same look as before. No regression.

## How preview overrides flow (admin live preview)

The `PreviewOverlay` client component reads `?_previewSection=...&_previewColors={...}` query params on hydration and applies them as inline styles to the matching section wrapper. **This means every section already wraps itself in `id="section-{key}"`.** Components that don't have that ID can't be previewed.

Verify every section component renders an element with `id="section-${sectionKey}"` matching its key in `sectionDefinitions.ts`.

## Migration path (Phase 3 work)

For each component listed in the audit (`docs/customize-design-audit.md`):

1. Find every hardcoded hex value
2. For each, determine which token it represents:
   - background → `--color-surface`
   - primary text / headline → `--color-on-surface` (or `--color-primary`, same thing)
   - muted / body text → `--color-on-surface-variant`
   - accent → `--color-secondary`
   - divider line → `--divider-color`
   - decorative gradient stop with no semantic meaning → leave as hex
3. Replace the hex with `var(--token, original-hex-as-fallback)`
4. Run the dev server, visit the page, confirm visual match (no regression)
5. In the admin customize-design panel, change that token, confirm the override flows through

Repeat per component, in priority order from the audit.

## Verification (Phase 7 lock-in)

After Phase 3 is complete:

1. **Manual smoke test:** for each section in every page, verify each customize-design control flows through. Use a checklist matrix matching the audit doc — flip every ❌ to ✅ and verify in browser.

2. **ESLint rule (recommended):** Add a custom ESLint rule or regex check in CI that fails if section components contain `style={{ color: "#` or `bg-[#` patterns. Forces future component edits to use variables.

3. **Visual regression:** if time permits, snapshot every section's default rendering before and after the rework — assert pixel-equal. (Skip if tooling overhead exceeds value.)

## What changes that admins will notice

- **Customize-design controls actually work for every token.** Background, headline text, body text, button color, button text, divider — all flow through to every section.
- **Live preview reflects choices in real time** (already shipped via `PreviewOverlay`).
- **Save Design persists those choices to the live site.**
- **No visual changes when no override is set** — defaults match the pre-rework look exactly.

## What we deliberately don't change

- The 6-token model stays. Not adding T7+ tokens during this rework.
- The customize-design panel UI stays the same (color pickers, preset buttons). We're fixing the cascade, not redesigning the UI.
- Section components don't gain new visual variants. We're just making the existing variants honor overrides.

## Decision: agreed-upon contract

By proceeding past this document into Phase 3, the team commits to:
- Every section component will follow Rules 1–6 above
- Every hex literal removed from a section component is replaced with `var(--token, hex-fallback)`
- Visual fidelity at default state must be preserved
- Phase 4 (typography) extends this same contract with typography tokens

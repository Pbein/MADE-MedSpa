# MADE Med Spa — Design System Reference

> Quick reference for AI agents and developers. All colors map to CSS custom properties in `globals.css`.

## Brand Palette

| Token      | Hex       | CSS Variable          |
|------------|-----------|-----------------------|
| Matcha     | `#838d60` | `--color-matcha`      |
| Blush      | `#84262c` | `--color-blush`       |
| Espresso   | `#391e1e` | `--color-espresso`    |
| Olive      | `#413e2a` | `--color-olive`       |
| Glaze      | `#f7f6eb` | `--color-glaze`       |
| Silk       | `#efe9df` | `--color-silk`        |

### Support Colors

| Token      | Hex       | CSS Variable          |
|------------|-----------|-----------------------|
| Ink        | `#241616` | `--color-ink`         |
| Mocha      | `#5a3d37` | `--color-mocha`       |
| Line       | `#d9d0c5` | `--color-line`        |
| WhiteSoft  | `#fffdf9` | `--color-white-soft`  |

## Color Roles

### Backgrounds
- **Page default:** Glaze
- **Alternating sections:** Silk
- **Dark sections / footer / hero overlay:** Espresso
- **Cards on dark backgrounds:** WhiteSoft or Glaze

### Text
- **Primary body:** Ink
- **Secondary body / subheadings:** Olive
- **Muted / labels / metadata:** Mocha
- **Text on dark (Espresso) backgrounds:** Glaze or Silk

### Accents
- **CTA buttons, links, active/hover states:** Blush
- **Icons, decorative elements, subtle highlights:** Matcha
- **Borders, dividers, rules:** Line

## Section Rhythm (Scroll Pattern)

Approved page-level background sequence:

```
Hero (Espresso + dark overlay) → Silk → Glaze → Silk → Espresso → Blush CTA banner → Espresso Footer
```

- Alternate Silk and Glaze for light sections to create visual rhythm.
- Use Espresso for dark accent sections (testimonials, stats, pre-footer).
- Blush is allowed ONLY for the narrow CTA banner strip.
- **Never use Matcha, Olive, or Blush as full section backgrounds.**

## Button System

| Variant          | Background | Text    | Border | Use Case                    |
|------------------|------------|---------|--------|-----------------------------|
| **Primary**      | Blush      | Glaze   | none   | Main CTAs, form submits     |
| **Secondary**    | transparent| Olive   | Olive  | Secondary actions, filters  |
| **Light**        | Glaze      | Espresso| none   | CTAs on dark backgrounds    |
| **Ghost**        | transparent| Blush   | none   | Inline text links, tertiary |

Hover states: darken background 8-10% or add subtle Matcha underline accent.

## Typography

| Role               | Font               | Weight    | Usage                        |
|--------------------|--------------------|-----------|------------------------------|
| Headlines (h1-h3)  | Playfair Display   | 600-700   | Page titles, section heads   |
| Editorial / Quotes | Cormorant Garamond | 400-500i  | Pullquotes, accent text      |
| Body / UI          | Inter              | 400-500   | Paragraphs, buttons, labels  |

- Body text color is always **Ink** on light backgrounds, **Glaze/Silk** on dark.
- Headlines may use Espresso or Olive on light backgrounds, Glaze on dark.
- Letter-spacing: `0.04em` on uppercase labels, `0.01em` on body.

## Contrast Rules

### Safe Pairs (WCAG AA+)
- Ink on Glaze, Silk, WhiteSoft
- Espresso on Glaze, Silk
- Blush on Glaze, Silk, WhiteSoft
- Glaze on Espresso, Blush
- Silk on Espresso

### Avoid (insufficient contrast)
- Mocha on Silk (borderline — use Ink instead for body)
- Matcha on Glaze or Silk (too low — icons only, never text)
- Olive on Espresso (too dark on dark)
- Line on Glaze (invisible)

## Do NOT

1. **No Matcha for paragraph text.** Matcha is decorative only (icons, borders, small accents).
2. **No Blush as a section background** — except the narrow CTA banner component.
3. **No random hex values.** Always use CSS variables (`var(--color-blush)`, etc.).
4. **No Cormorant Garamond for body copy.** It is for editorial accents and quotes only.
5. **No white (`#fff`) backgrounds.** Use Glaze or WhiteSoft instead.
6. **No pure black (`#000`) text.** Use Ink (`#241616`) for warmth.
7. **No more than two consecutive same-background sections.** Alternate Silk/Glaze.

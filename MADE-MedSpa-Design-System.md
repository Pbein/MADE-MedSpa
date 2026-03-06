# MADE Med Spa — Design System & Styling Guide

## For Claude Code: Read this document BEFORE implementing any visual components.

---

## 1. Design DNA — What This Site Must Feel Like

**Core Identity:** Luxury feminine sophistication. Think high-end fashion editorial meets clinical confidence. The site should feel like walking into a beautifully curated space where every detail has been considered — not cold and clinical, not bubbly and generic. It's the visual equivalent of a cashmere robe: soft, expensive, intentional.

**Key Emotional Targets:**
- Aspirational but approachable
- Confident femininity — empowered, not passive
- Editorial luxury — magazine-quality visual storytelling
- Warmth through rich neutrals, not through bright colors
- Quiet sophistication — let the content breathe

**Reference Inspiration:** The mood board and motion reference draw from the Showit luxury web design aesthetic (Studio Blonde style) — characterized by bold serif typography mixed with elegant scripts, warm earth tones, editorial photography as a design element, and smooth scroll-driven animations. The design palette also references high-end skincare branding (Cécil, Rave Luxe) and luxury fashion editorial layouts.

---

## 2. Color System

### 2.1 Primary Palette (from client mood board)

```css
:root {
  /* === PRIMARY PALETTE === */
  --color-white:        #EEEEEE;  /* Warm off-white — NOT pure white */
  --color-dark-red:     #7A0000;  /* Deep burgundy — primary accent */
  --color-black:        #000000;  /* Pure black — headlines, high contrast */
  --color-pastel-grey:  #D2C8BE;  /* Warm stone grey — backgrounds, cards */
  --color-gray-brown:   #574944;  /* Rich brown — secondary text, borders */

  /* === EXTENDED PALETTE (derived for UI needs) === */
  --color-cream:        #F5F0EB;  /* Lighter warm background */
  --color-warm-ivory:   #FAF7F4;  /* Lightest background */
  --color-dark-brown:   #3A2E2A;  /* Deep warm black — body text alternative */
  --color-burgundy-light: #9A2020; /* Hover state for dark-red */
  --color-burgundy-dark:  #5A0000; /* Active/pressed state for dark-red */
  --color-stone-dark:   #B8ACA2;  /* Darker stone for borders, dividers */
  --color-chocolate:    #2C2220;  /* Rich dark sections (testimonials, CTAs) */
}
```

### 2.2 Color Usage Rules

| Element | Color | Notes |
|---------|-------|-------|
| **Page backgrounds** | `--color-warm-ivory` or `--color-cream` | Never pure white (#FFFFFF). The warmth is critical. |
| **Alternate section backgrounds** | `--color-pastel-grey` | For contrast between page sections |
| **Dark sections** (testimonials, CTAs, hero overlays) | `--color-chocolate` or `--color-black` | With warm-ivory or cream text |
| **Headlines** | `--color-black` or `--color-dark-brown` | On light backgrounds |
| **Body text** | `--color-gray-brown` or `--color-dark-brown` | Never pure black for body — slightly softened |
| **Primary accent / CTAs** | `--color-dark-red` | Burgundy for buttons, links, highlights |
| **Accent hover** | `--color-burgundy-light` | Slightly lighter for hover states |
| **Borders / dividers** | `--color-stone-dark` | Subtle, warm-toned lines |
| **Card backgrounds** | `--color-white` (#EEEEEE) | Slight warmth, with subtle shadow |

### 2.3 Dark Section Treatment

Certain sections alternate to dark backgrounds for dramatic contrast (visible in both the mood board and motion reference). These sections use:

```css
.section-dark {
  background-color: var(--color-chocolate); /* #2C2220 */
  color: var(--color-cream);
}
.section-dark h2, .section-dark h3 {
  color: var(--color-white);
}
.section-dark .accent {
  color: var(--color-pastel-grey); /* Softened accent on dark */
}
```

---

## 3. Typography System

### 3.1 Font Stack

The mood board and video show a clear three-tier type system: a bold editorial serif for headlines, an elegant script/italic serif for accent phrases, and a clean refined sans-serif for body text.

```css
/* === PRIMARY FONTS === */

/* Display / Headlines — Bold editorial serif */
/* Options (in order of preference, load from Google Fonts): */
/* 1. Playfair Display (best match to mood board's bold serifs) */
/* 2. Cormorant Garamond (lighter, more refined alternative) */
/* 3. DM Serif Display (rounder, softer) */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700&display=swap');

/* Accent / Script — Elegant italic for feature phrases */
/* Options: */
/* 1. Cormorant Garamond Italic (refined, editorial) */
/* 2. Lora Italic (warm, readable) */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap');

/* Body / UI — Clean sans-serif */
/* Options: */
/* 1. Jost (geometric, luxury feel, matches mood board body text) */
/* 2. Outfit (modern, clean) */
/* 3. Montserrat (fallback — slightly overused but reliable) */
@import url('https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap');

:root {
  --font-display: 'Playfair Display', Georgia, serif;
  --font-accent:  'Cormorant Garamond', Georgia, serif;
  --font-body:    'Jost', 'Helvetica Neue', sans-serif;
}
```

### 3.2 Type Scale

```css
:root {
  /* Display — hero headlines, section titles */
  --text-hero:     clamp(3rem, 6vw, 5.5rem);    /* 48px → 88px */
  --text-display:  clamp(2.25rem, 4.5vw, 4rem);  /* 36px → 64px */

  /* Headings */
  --text-h1:       clamp(2rem, 3.5vw, 3rem);      /* 32px → 48px */
  --text-h2:       clamp(1.75rem, 3vw, 2.5rem);    /* 28px → 40px */
  --text-h3:       clamp(1.375rem, 2vw, 1.75rem);  /* 22px → 28px */
  --text-h4:       clamp(1.125rem, 1.5vw, 1.375rem); /* 18px → 22px */

  /* Body */
  --text-body-lg:  1.125rem;  /* 18px */
  --text-body:     1rem;      /* 16px */
  --text-body-sm:  0.875rem;  /* 14px */

  /* UI */
  --text-caption:  0.75rem;   /* 12px */
  --text-overline: 0.8125rem; /* 13px — all caps labels */

  /* Line Heights */
  --leading-tight:   1.1;
  --leading-snug:    1.25;
  --leading-normal:  1.5;
  --leading-relaxed: 1.65;

  /* Letter Spacing */
  --tracking-tight:   -0.02em;
  --tracking-normal:  0;
  --tracking-wide:    0.05em;
  --tracking-wider:   0.1em;
  --tracking-widest:  0.2em;
}
```

### 3.3 Typography Usage Patterns

```css
/* Hero headlines — massive, commanding, tight leading */
.hero-headline {
  font-family: var(--font-display);
  font-size: var(--text-hero);
  font-weight: 700;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  text-transform: uppercase; /* Some headlines are uppercase, some mixed — varies by context */
}

/* Section headlines */
.section-headline {
  font-family: var(--font-display);
  font-size: var(--text-display);
  font-weight: 600;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}

/* Accent/feature text — italic serif for editorial flair */
/* Used for: taglines, pull quotes, accent words within headlines */
.accent-text {
  font-family: var(--font-accent);
  font-style: italic;
  font-weight: 400;
  /* Typically same size as surrounding text or slightly larger */
}

/* The "mixed headline" pattern from the mood board:
   "PROFESSIONALISM. TAILORED PERSONALIZED PROTOCOLS FOR EACH PATIENT."
   Bold serif + italic accent words mixed together */
.mixed-headline {
  font-family: var(--font-display);
  font-weight: 700;
}
.mixed-headline em, .mixed-headline .italic {
  font-family: var(--font-accent);
  font-style: italic;
  font-weight: 400;
}

/* Overline labels — small caps navigation and category labels */
.overline {
  font-family: var(--font-body);
  font-size: var(--text-overline);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: var(--tracking-widest);
}

/* Body text */
.body-text {
  font-family: var(--font-body);
  font-size: var(--text-body);
  font-weight: 300; /* Light weight for body — elegant, airy */
  line-height: var(--leading-relaxed);
  color: var(--color-gray-brown);
}

/* Navigation links */
.nav-link {
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
}
```

### 3.4 Key Typography Pattern: Serif/Script Mixing

The mood board consistently shows a signature pattern where headlines mix bold serif with italic/script words for emphasis. This is central to the brand voice:

- "PROFESSIONALISM. *TAILORED* PERSONALIZED PROTOCOLS"
- "*Ready* TO BE ICONIC?"
- "*Stay* IN THE LOOP"
- "BECAUSE BOSS LADIES LIKE US *deserve* TO LEAD, NOT FOLLOW."

**Implementation:** In JSX, wrap accent words in an `<em>` or `<span className="accent-text">` tag. The CSS for `.accent-text` switches to the italic Cormorant Garamond while the surrounding text stays in bold Playfair Display.

---

## 4. Spacing & Layout

### 4.1 Spacing Scale

```css
:root {
  --space-1:   0.25rem;   /* 4px */
  --space-2:   0.5rem;    /* 8px */
  --space-3:   0.75rem;   /* 12px */
  --space-4:   1rem;      /* 16px */
  --space-5:   1.5rem;    /* 24px */
  --space-6:   2rem;      /* 32px */
  --space-7:   3rem;      /* 48px */
  --space-8:   4rem;      /* 64px */
  --space-9:   6rem;      /* 96px */
  --space-10:  8rem;      /* 128px */
  --space-11:  10rem;     /* 160px */
}
```

### 4.2 Layout Principles (from mood board analysis)

**Generous Whitespace:** The reference sites all use dramatic whitespace. Sections should breathe. Minimum vertical padding between sections: `--space-9` (96px) on desktop, `--space-7` (48px) on mobile.

**Asymmetric Grid:** The mood board shows layouts that frequently break the centered-content pattern. Content is often offset to one side with imagery on the other — a two-column asymmetric split, roughly 40/60 or 45/55.

**Full-Bleed Imagery:** Hero images and feature photography extend edge-to-edge. Content overlaps images using negative margins or absolute positioning.

**Editorial Grid Layout:**
```css
.editorial-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
  align-items: center;
}

/* Alternating layout — odd sections: text-left/image-right, even: reversed */
.editorial-grid:nth-child(even) {
  direction: rtl;
}
.editorial-grid:nth-child(even) > * {
  direction: ltr;
}
```

**Container Widths:**
```css
:root {
  --container-sm:   640px;   /* Narrow content (forms, article text) */
  --container-md:   960px;   /* Standard content */
  --container-lg:   1200px;  /* Wide content with media */
  --container-xl:   1440px;  /* Max-width wrapper */
}
```

---

## 5. Motion & Animation System

### 5.1 Motion Principles (from video reference analysis)

The video showcases a luxury Showit-style scroll experience with these key motion characteristics:

**Scroll Behavior:**
- Smooth, buttery scrolling — not instant jumps
- Content reveals as you scroll into view (scroll-triggered fade/slide)
- Parallax-like depth on hero images (subtle, not aggressive)
- Sections fade in with slight upward translation

**Transition Timing:**
- Everything moves slowly and deliberately — nothing snappy or bouncy
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` — fast start, very gentle deceleration (luxury feel)
- Duration: 600ms–1000ms for section reveals, 300ms–400ms for hover states
- Stagger: 100ms–150ms between elements in a group

**Page Load:**
- Hero content fades in with staggered timing (image first, then headline, then subtitle, then CTA)
- Navigation fades in after a slight delay

### 5.2 Animation CSS Variables

```css
:root {
  /* Timing */
  --duration-fast:    300ms;
  --duration-medium:  500ms;
  --duration-slow:    800ms;
  --duration-reveal:  1000ms;

  /* Easing */
  --ease-luxury:      cubic-bezier(0.16, 1, 0.3, 1);   /* Primary — smooth deceleration */
  --ease-in-out:      cubic-bezier(0.45, 0, 0.55, 1);   /* Subtle in-out */
  --ease-out-expo:    cubic-bezier(0.19, 1, 0.22, 1);   /* Dramatic ease-out */

  /* Reveal transforms */
  --reveal-distance:  30px;  /* How far elements translate on reveal */

  /* Stagger */
  --stagger-delay:    120ms;
}
```

### 5.3 Core Animation Classes

```css
/* === SCROLL-TRIGGERED REVEAL ANIMATIONS === */
/* Use with IntersectionObserver or Framer Motion */

/* Fade up — primary reveal animation */
.reveal-up {
  opacity: 0;
  transform: translateY(var(--reveal-distance));
  transition: opacity var(--duration-reveal) var(--ease-luxury),
              transform var(--duration-reveal) var(--ease-luxury);
}
.reveal-up.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Fade in — no movement, just opacity */
.reveal-fade {
  opacity: 0;
  transition: opacity var(--duration-slow) var(--ease-luxury);
}
.reveal-fade.visible {
  opacity: 1;
}

/* Slide from left */
.reveal-left {
  opacity: 0;
  transform: translateX(-40px);
  transition: opacity var(--duration-reveal) var(--ease-luxury),
              transform var(--duration-reveal) var(--ease-luxury);
}
.reveal-left.visible {
  opacity: 1;
  transform: translateX(0);
}

/* Slide from right */
.reveal-right {
  opacity: 0;
  transform: translateX(40px);
  transition: opacity var(--duration-reveal) var(--ease-luxury),
              transform var(--duration-reveal) var(--ease-luxury);
}
.reveal-right.visible {
  opacity: 1;
  transform: translateX(0);
}

/* Scale reveal — for images and cards */
.reveal-scale {
  opacity: 0;
  transform: scale(0.95);
  transition: opacity var(--duration-reveal) var(--ease-luxury),
              transform var(--duration-reveal) var(--ease-luxury);
}
.reveal-scale.visible {
  opacity: 1;
  transform: scale(1);
}

/* Stagger children — apply to parent, children get cascading delays */
.stagger-children > *:nth-child(1) { transition-delay: 0ms; }
.stagger-children > *:nth-child(2) { transition-delay: var(--stagger-delay); }
.stagger-children > *:nth-child(3) { transition-delay: calc(var(--stagger-delay) * 2); }
.stagger-children > *:nth-child(4) { transition-delay: calc(var(--stagger-delay) * 3); }
.stagger-children > *:nth-child(5) { transition-delay: calc(var(--stagger-delay) * 4); }
.stagger-children > *:nth-child(6) { transition-delay: calc(var(--stagger-delay) * 5); }

/* === HOVER ANIMATIONS === */

/* Image hover — subtle zoom */
.hover-zoom {
  overflow: hidden;
}
.hover-zoom img {
  transition: transform var(--duration-medium) var(--ease-luxury);
}
.hover-zoom:hover img {
  transform: scale(1.05);
}

/* Link hover — underline grows from left */
.hover-underline {
  position: relative;
}
.hover-underline::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background-color: currentColor;
  transition: width var(--duration-fast) var(--ease-luxury);
}
.hover-underline:hover::after {
  width: 100%;
}

/* Button hover — slight lift + shadow */
.hover-lift {
  transition: transform var(--duration-fast) var(--ease-luxury),
              box-shadow var(--duration-fast) var(--ease-luxury);
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(87, 73, 68, 0.15);
}
```

### 5.4 Recommended Libraries

```
npm install framer-motion    # For React scroll-triggered animations
npm install lenis            # For smooth scroll behavior (butter-smooth)
```

**Lenis setup (smooth scrolling — critical for the luxury feel):**
```typescript
// lib/smooth-scroll.ts
import Lenis from 'lenis';

export function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.2,        // Slower = more luxurious
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  return lenis;
}
```

**Framer Motion scroll reveal hook:**
```typescript
// hooks/useReveal.ts
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  return { ref, isInView };
}
```

---

## 6. Component Styling Patterns

### 6.1 Buttons

```css
/* Primary CTA — dark with warm hover */
.btn-primary {
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  padding: 1rem 2.5rem;
  background-color: var(--color-black);
  color: var(--color-white);
  border: 1px solid var(--color-black);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-luxury);
}
.btn-primary:hover {
  background-color: var(--color-gray-brown);
  border-color: var(--color-gray-brown);
}

/* Secondary — outlined */
.btn-secondary {
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  padding: 1rem 2.5rem;
  background-color: transparent;
  color: var(--color-black);
  border: 1px solid var(--color-black);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-luxury);
}
.btn-secondary:hover {
  background-color: var(--color-black);
  color: var(--color-white);
}

/* Accent — burgundy CTA */
.btn-accent {
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  padding: 1rem 2.5rem;
  background-color: var(--color-dark-red);
  color: var(--color-white);
  border: 1px solid var(--color-dark-red);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-luxury);
}
.btn-accent:hover {
  background-color: var(--color-burgundy-dark);
  border-color: var(--color-burgundy-dark);
}

/* Text link CTA — arrow pattern from mood board */
/* "OUR STORY →" / "VIEW SERVICES →" / "BOOK NOW →" */
.btn-text {
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--color-black);
  background: none;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.btn-text .arrow {
  transition: transform var(--duration-fast) var(--ease-luxury);
}
.btn-text:hover .arrow {
  transform: translateX(4px);
}
```

### 6.2 Cards

```css
/* Service card */
.service-card {
  background: var(--color-white);
  overflow: hidden;
  transition: transform var(--duration-medium) var(--ease-luxury);
}
.service-card:hover {
  transform: translateY(-4px);
}
.service-card .image-container {
  aspect-ratio: 3/4; /* Portrait orientation — matches editorial feel */
  overflow: hidden;
}
.service-card .image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--duration-medium) var(--ease-luxury);
}
.service-card:hover .image-container img {
  transform: scale(1.05);
}
.service-card .content {
  padding: var(--space-5) var(--space-5) var(--space-6);
}

/* Membership tier card */
.tier-card {
  background: var(--color-cream);
  border: 1px solid var(--color-stone-dark);
  padding: var(--space-7) var(--space-6);
  text-align: center;
  transition: all var(--duration-medium) var(--ease-luxury);
}
.tier-card.featured {
  background: var(--color-black);
  color: var(--color-white);
  border-color: var(--color-black);
  transform: scale(1.03);
}
```

### 6.3 Navigation

```css
/* Top navigation — clean, minimal, luxe */
.nav {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
  padding: var(--space-5) var(--space-7);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all var(--duration-medium) var(--ease-luxury);
  background: transparent;
}
/* On scroll — add backdrop */
.nav.scrolled {
  background: rgba(250, 247, 244, 0.9); /* warm-ivory with blur */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: var(--space-3) var(--space-7);
  border-bottom: 1px solid var(--color-stone-dark);
}
.nav .logo {
  font-family: var(--font-display);
  font-size: var(--text-h4);
  font-weight: 700;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
}
```

### 6.4 Dividers & Decorative Elements

```css
/* Thin line divider — warm toned */
.divider {
  height: 1px;
  background: var(--color-stone-dark);
  width: 100%;
  margin: var(--space-8) 0;
}

/* Short accent line — used above section headings */
.accent-line {
  width: 60px;
  height: 1px;
  background: var(--color-dark-red);
  margin-bottom: var(--space-4);
}

/* Numbered list pattern from mood board (01, 02, 03...) */
.numbered-item {
  display: flex;
  align-items: baseline;
  gap: var(--space-5);
  padding: var(--space-5) 0;
  border-bottom: 1px solid var(--color-stone-dark);
}
.numbered-item .number {
  font-family: var(--font-body);
  font-size: var(--text-h3);
  font-weight: 300;
  color: var(--color-pastel-grey);
  min-width: 3rem;
}
```

---

## 7. Image & Media Treatment

### 7.1 Photography Style

Based on the mood board, all photography should feel:
- **Warm-toned** — slight warm color grade (not cool/blue clinical)
- **Soft lighting** — diffused, golden, beauty-style lighting
- **Close-up and intimate** — skin texture, hands, facial features
- **Editorial composition** — unexpected crops, negative space in frame

### 7.2 Image CSS Treatment

```css
/* Warm overlay on all photos — subtle, unifies varied photography */
.image-warm {
  position: relative;
}
.image-warm::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(87, 73, 68, 0.05),
    rgba(87, 73, 68, 0.1)
  );
  pointer-events: none;
}

/* Grainy texture overlay — editorial feel */
.image-grain::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 1;
}

/* Standard image aspect ratios */
.image-portrait  { aspect-ratio: 3/4; }
.image-landscape { aspect-ratio: 16/9; }
.image-square    { aspect-ratio: 1/1; }
.image-editorial { aspect-ratio: 4/5; } /* Instagram-style */
```

---

## 8. Responsive Breakpoints

```css
:root {
  --bp-sm:  640px;
  --bp-md:  768px;
  --bp-lg:  1024px;
  --bp-xl:  1280px;
  --bp-2xl: 1536px;
}

/* Tailwind class mapping:
   sm:  @media (min-width: 640px)
   md:  @media (min-width: 768px)
   lg:  @media (min-width: 1024px)
   xl:  @media (min-width: 1280px)
   2xl: @media (min-width: 1536px)
*/
```

### 8.1 Mobile-First Rules

- Navigation collapses to hamburger below `lg` (1024px)
- Grid layouts go from 1 column → 2 columns at `md` → 3 columns at `lg`
- Hero text scales down via `clamp()` (already built into type scale)
- Section padding reduces: `--space-9` desktop → `--space-7` mobile
- Asymmetric layouts stack to single column below `md`

---

## 9. Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          'white':       '#EEEEEE',
          'cream':       '#F5F0EB',
          'ivory':       '#FAF7F4',
          'stone':       '#D2C8BE',
          'stone-dark':  '#B8ACA2',
          'brown':       '#574944',
          'dark-brown':  '#3A2E2A',
          'chocolate':   '#2C2220',
          'burgundy':    '#7A0000',
          'burgundy-light': '#9A2020',
          'burgundy-dark':  '#5A0000',
          'black':       '#000000',
        },
      },
      fontFamily: {
        'display': ['Playfair Display', 'Georgia', 'serif'],
        'accent':  ['Cormorant Garamond', 'Georgia', 'serif'],
        'body':    ['Jost', 'Helvetica Neue', 'sans-serif'],
      },
      fontSize: {
        'hero':    ['clamp(3rem, 6vw, 5.5rem)', { lineHeight: '1.1' }],
        'display': ['clamp(2.25rem, 4.5vw, 4rem)', { lineHeight: '1.1' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '36': '9rem',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        '800': '800ms',
        '1000': '1000ms',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 10. Section Pattern Library

These patterns come directly from the mood board and motion reference. Each section on the site should use one of these layout patterns:

### Pattern 1: Hero — Full-Bleed Image + Overlaid Text
- Full viewport height image or video
- Dark gradient overlay from bottom
- Display headline in white/cream, center or left-aligned
- Subtitle in accent font (italic)
- CTA button below

### Pattern 2: Editorial Split — Text + Image Side-by-Side
- Two-column asymmetric grid (45/55)
- One side: headline + body + CTA
- Other side: full-height image (portrait aspect)
- Alternates direction per section

### Pattern 3: Services Grid — Cards with Images
- 3-column grid (2 on tablet, 1 on mobile)
- Each card: portrait image + name + short description + arrow link
- Subtle hover zoom on images

### Pattern 4: Dark Section — Full-Width Testimonial/CTA
- Dark background (`--color-chocolate`)
- Large serif headline in cream
- Client photo on one side, quote on the other
- Subtle background texture or gradient

### Pattern 5: Numbered List — Features/Steps
- Single column, numbered items (01, 02, 03...)
- Each item has: number, headline, description, optional image
- Thin divider between items
- From mood board: "The One Design Trick..." pattern

### Pattern 6: Newsletter/CTA Banner — Full-Width with Background Image
- Background image with dark overlay
- Script/italic headline ("Stay IN THE LOOP")
- Email input + CTA button
- Compact — no more than 50vh

### Pattern 7: Social/Footer — Three-Column Link Bar
- Dark background
- Social platforms as columns: "Instagram — LET'S BE FRIENDS →"
- Clean, editorial footer with logo + nav links
- Gallery row of lifestyle images at very bottom

---

## 11. Do's and Don'ts

### DO:
- Use warm off-whites, never pure `#FFFFFF`
- Mix bold serif headlines with italic accent words
- Use generous whitespace between sections
- Apply subtle warm overlays on photography
- Animate elements on scroll with slow, luxurious timing
- Use uppercase + wide letter-spacing for UI labels and nav
- Alternate between light and dark sections for rhythm

### DON'T:
- Use bright, saturated colors anywhere
- Use rounded corners on buttons (keep square or very subtle 2px max)
- Use drop shadows on cards (use subtle elevation via translateY instead)
- Use bouncy or playful animations (everything should feel slow and intentional)
- Use pure white (#FFFFFF) backgrounds
- Use emoji or playful iconography
- Use generic stock photography with cool/blue tones
- Use more than 3 font families
- Center-align body text (left-align, except for very short centered headlines)
- Add borders/outlines to images (let them bleed)

---

*This design system should be placed in the project at `docs/DESIGN-SYSTEM.md` and referenced by Claude Code when implementing any visual component.*

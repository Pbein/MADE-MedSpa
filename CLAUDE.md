# MADE Med Spa — Project Guardrails

## Hosting & Storage Architecture

**Vercel:** Production runs on **Vercel Pro** ($20/mo). Hobby is not viable — Vercel's ToS prohibits commercial use under the Hobby plan, and this site is a paying client's commercial property.

**Convex:** Database + queries only. File storage moved off Convex in April 2026 after a bandwidth blowup (3.02 GB / 1 GB free).

**Vercel Blob (`@vercel/blob`):** Stores admin-uploaded media (team photos, services, before/after, section backgrounds, OG image, logo). Public access. URLs live as plain strings in Convex DB fields (`siteContent.imageUrl`, `services.imageUrl`, etc.). Upload flow goes through `/api/admin/blob/upload` (admin-gated via `assertAdmin`/Clerk middleware). Helper at `src/lib/admin/blobUpload.ts`.

**`/public/`:** Ship-with-design static media (hero video, decorative bg images, placeholder SVGs, logos that don't change). Vercel CDN serves these from the 1 TB/mo Fast Data Transfer bucket — the right place for large or universal assets.

## Convex Usage Discipline (CRITICAL)

This project hit Convex File Bandwidth limits in April 2026 (3.02 GB / 1 GB free tier). It is now on the Pro plan with a hard $20/mo spend cap and $10 warning. **The project should stay within free-tier limits — paid headroom is a safety net, not a budget.** Post-migration the goal is to drop back to Convex free tier (DB queries only, no file storage).

### Free-tier limits to respect

| Resource | Free limit | Strategy |
|---|---|---|
| File Bandwidth | 1 GB / mo | Heavy static media → `/public/`, served by Vercel CDN (free) |
| File Storage | 1 GB | Convex storage = admin-uploaded dynamic content only |
| Database Bandwidth | 1 GB / mo | Server-render queries when content is static across visits |
| Database Storage | 512 MB | Plenty of headroom — not a concern |
| Function Calls | (Pro) | Avoid per-render `useQuery` floods — see below |

### Rules

**Media placement decision:**

- **Ship-with-the-design media** (hero video, decorative bg images, design-system imagery, logos, icons) → `/public/` folder. Served free via Vercel CDN. **Never** upload these to Convex storage.
- **Admin-uploaded dynamic content** (team photos, service photos, testimonial avatars, hero image overrides Karlyne wants to swap herself) → Convex storage via `siteContent.imageUrl` and similar. The CMS workflow needs this.

**When in doubt:** if the file ships with the codebase and a developer (not the admin user) chose it, it goes in `/public/`. If an admin uploads it through `/admin`, it goes in Convex storage.

**Video files specifically:** Videos belong in `/public/videos/` (e.g., `/public/videos/hero.mp4`) and are served by Vercel's CDN. Hero video served from Convex storage was the primary cause of the April bandwidth blowup. Even Vercel Blob is wrong for video on this project — videos don't go through `next/image` edge caching, and at scale a 15 MB hero × 1000 visitors = 15 GB/mo of Blob transfer that would chew through the Hobby/Pro Blob allowance. `/public/` files draw from Vercel's general Fast Data Transfer bucket (1 TB/mo on Pro), which is the right place for large static media.

**Updating the hero video (procedure for future devs):**
1. Encode the new video as MP4 (H.264), max 25 MB, web-optimized (use HandBrake or `ffmpeg -movflags +faststart`).
2. Save the new file to `/public/videos/` with a **bumped version suffix** (e.g., `hero-v3.mp4`) — do NOT reuse the previous filename. The previous file was served with `Cache-Control: immutable, max-age=31536000`, so browsers refuse to refetch the same URL even after server replacement. New filename = new URL = fresh fetch.
3. Generate a poster from the new video using a matching version suffix: `ffmpeg -ss 0.5 -i public/videos/hero-v3.mp4 -frames:v 1 -vf "scale=1920:-1" public/images/hero-poster-v3.webp`
4. Update the constants in `src/components/sections/HeroSection.tsx` (`HERO_VIDEO` and `HERO_POSTER`) to point at the new filenames.
5. Delete the old versioned files (the previous `hero-vN.mp4` + poster) so they don't ship in the build output.
6. Commit, push, deploy.

The admin UI does NOT have a self-service hero video uploader. It's a developer-managed asset because video bandwidth doesn't fit our cost model. If Karlyne needs a hero video change, she emails the dev team.

**Query patterns:**

- Prefer `fetchQuery` in server components for content that's the same for every visitor (page settings, section content, hero backgrounds). The `/about` page does this correctly for `about_hero_bg` and `page_settings_about` — extend the pattern to other static lookups.
- Reserve client-side `useQuery` / `useSectionContent` for content that needs reactive updates (admin editing live, real-time data).
- Don't add new `useQuery` calls without considering whether the data could be server-rendered.

### Before merging anything that touches media or queries

1. Did you put any new image/video in `/public/` or in Convex storage? Justify the choice against the rule above.
2. Did you add any new `useQuery` / `useSectionContent` calls? Could it be a server-rendered `fetchQuery` instead?
3. Is anything served from a Convex `_storage` URL that doesn't need admin-editability?

If unsure, ask the user before adding bandwidth-burning code.

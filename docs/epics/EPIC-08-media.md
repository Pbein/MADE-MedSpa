# Epic 8: Photo/Video Content

## Goal

Build media management capabilities including before/after galleries, video sections, and image optimization to showcase MADE Med Spa's results and facilities.

---

## User Stories

### 8.1: Media Storage & Management
- [ ] **Complete**

**As a** content manager,
**I want** to upload and manage photos and videos,
**So that** I can keep the site's visual content fresh and compelling.

**Acceptance Criteria:**
- [ ] Media stored via Convex File Storage (or Cloudinary for optimization)
- [ ] Upload supports images (JPEG, PNG, WebP) and videos (MP4)
- [ ] File size limits enforced (images: 10MB, videos: 100MB)
- [ ] Automatic image optimization (resize, compress, WebP conversion)
- [ ] Thumbnail generation for gallery views
- [ ] Media metadata stored in Convex `media` table
- [ ] Tagging system for organization

**Implementation Notes:**
- Convex File Storage for primary storage
- Consider Cloudinary for advanced image transformations
- Use Next.js Image component for serving optimized images
- Admin upload UI in Epic 10

---

### 8.2: Before/After Gallery
- [ ] **Complete**

**As a** visitor,
**I want** to see before and after photos of treatments,
**So that** I can evaluate the quality of results.

**Acceptance Criteria:**
- [ ] Gallery page or section showcasing before/after pairs
- [ ] Interactive slider to compare before and after images
- [ ] Filter by service/treatment type
- [ ] Caption with treatment name and description
- [ ] Responsive layout (grid on desktop, stack on mobile)
- [ ] Lightbox for full-size viewing
- [ ] Images loaded lazily for performance
- [ ] Disclaimer text about individual results varying

**Implementation Notes:**
- Use a comparison slider component (e.g., `react-compare-slider`)
- Pull from Convex `media` table where `isBeforeAfter: true`
- Pair `beforeImageUrl` and `afterImageUrl` fields
- Comply with medical advertising regulations

---

### 8.3: Video Sections
- [ ] **Complete**

**As a** visitor,
**I want** to watch videos about MADE Med Spa and their treatments,
**So that** I can learn more before visiting.

**Acceptance Criteria:**
- [ ] Video player component for embedded videos
- [ ] Support for self-hosted videos and YouTube/Vimeo embeds
- [ ] Lazy loading (video loads on interaction, not page load)
- [ ] Thumbnail/poster image shown before play
- [ ] Responsive sizing
- [ ] Used on home page, about page, and service detail pages as appropriate
- [ ] Autoplay option (muted) for hero sections

**Implementation Notes:**
- Use HTML5 video element for self-hosted
- Use lite-youtube-embed or similar for YouTube (performance)
- Consider intersection observer for play-on-scroll

---

### 8.4: Image Gallery Component
- [ ] **Complete**

**As a** visitor,
**I want** to browse photos of the spa, team, and treatments,
**So that** I get a visual sense of the experience.

**Acceptance Criteria:**
- [ ] Reusable gallery component with grid layout
- [ ] Lightbox for full-screen viewing with navigation
- [ ] Keyboard navigation (arrow keys, escape to close)
- [ ] Swipe gestures on mobile
- [ ] Image captions
- [ ] Loading states with blur-up placeholders
- [ ] Lazy loading for off-screen images

**Implementation Notes:**
- Consider `yet-another-react-lightbox` or similar library
- Use Next.js Image with blur placeholder
- Component reusable across service pages, about page, etc.

---

### 8.5: Facility Tour Section
- [ ] **Complete**

**As a** visitor,
**I want** to see photos of the MADE Med Spa facility,
**So that** I feel comfortable and excited about visiting.

**Acceptance Criteria:**
- [ ] Facility photo gallery on about page or dedicated section
- [ ] High-quality images of treatment rooms, lobby, amenities
- [ ] Optional virtual tour embed (if available)
- [ ] Captions describing each area
- [ ] Professional, inviting presentation

**Implementation Notes:**
- Can be a section on the about page or standalone
- Pull images from Convex `media` table with category "facility"
- Consider carousel for space efficiency

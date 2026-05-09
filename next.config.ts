import type { NextConfig } from "next";

// Content Security Policy — currently in Report-Only mode.
// After 1 week of soak in production with no breakage, switch the header
// key below from "Content-Security-Policy-Report-Only" to
// "Content-Security-Policy" to enforce. See docs/PRODUCTION-DEPLOYMENT.md.
// Clerk hosts on a few origins:
//   *.clerk.accounts.dev — dev/preview instance
//   *.clerk.com          — Clerk's hosted assets + dashboard
//   clerk.mademedspa.com / accounts.mademedspa.com — production custom domain
// All three categories must be in script-src + connect-src; the account
// portal (accounts.*) also needs frame-src for the hosted UI iframe.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://clerk.com https://*.clerk.com https://clerk.mademedspa.com https://accounts.mademedspa.com https://challenges.cloudflare.com https://pabau.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.cdnfonts.com",
  "img-src 'self' data: blob: https: http:",
  "media-src 'self' blob: data: https://*.convex.cloud https://*.convex.site",
  "font-src 'self' data: https://fonts.gstatic.com https://fonts.cdnfonts.com",
  "frame-src 'self' https://accounts.mademedspa.com https://partner.pabau.com https://pabau.com https://*.pabau.com https://*.google.com https://maps.google.com",
  "connect-src 'self' https://*.convex.cloud https://*.convex.site wss://*.convex.cloud https://*.clerk.accounts.dev https://*.clerk.com https://clerk.mademedspa.com https://accounts.mademedspa.com https://api.oauth.pabau.com https://crm.pabau.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://crm.pabau.com",
  // Allow same-origin framing (admin live preview); deny cross-origin via the
  // empty list. This is the modern replacement for X-Frame-Options.
  "frame-ancestors 'self'",
].join("; ");

const nextConfig: NextConfig = {
  compress: true,
  images: {
    minimumCacheTTL: 2592000,
    // Skip the local dev server's image-optimization proxy in development.
    // Karlyne's full-size product photos (multi-MB JPGs) were timing out the
    // dev pipeline ("upstream image response timed out"). With unoptimized
    // in dev, the browser fetches directly from Vercel Blob — instant.
    // Production is unchanged: Vercel's edge optimizer still does its job.
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "*.convex.cloud",
      },
      {
        protocol: "https",
        hostname: "*.convex.site",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  async redirects() {
    return [
      // Defensive: admins sometimes type "/book" instead of "/booking" in the
      // page-editor button-link field. Make both work so a typo never 404s.
      { source: "/book", destination: "/booking", permanent: true },
      // Same defense: route is /membership (singular). Catch the common
      // plural form so /memberships hits the right page instead of 404.
      { source: "/memberships", destination: "/membership", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          // SAMEORIGIN (not DENY) so the admin live-preview iframe works on
          // the same domain. CSP frame-ancestors locks down cross-origin
          // framing as the real defense.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy-Report-Only",
            value: contentSecurityPolicy,
          },
        ],
      },
      {
        source: "/videos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

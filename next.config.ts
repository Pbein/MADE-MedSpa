import type { NextConfig } from "next";

// Content Security Policy — currently in Report-Only mode.
// After 1 week of soak in production with no breakage, switch the header
// key below from "Content-Security-Policy-Report-Only" to
// "Content-Security-Policy" to enforce. See docs/PRODUCTION-DEPLOYMENT.md.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://clerk.com https://*.clerk.com https://challenges.cloudflare.com https://pabau.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https: http:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "frame-src 'self' https://partner.pabau.com https://pabau.com https://*.pabau.com https://*.google.com https://maps.google.com",
  "connect-src 'self' https://*.convex.cloud https://*.convex.site wss://*.convex.cloud https://*.clerk.accounts.dev https://*.clerk.com https://api.oauth.pabau.com https://crm.pabau.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://crm.pabau.com",
].join("; ");

const nextConfig: NextConfig = {
  compress: true,
  images: {
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
    ],
  },
  async redirects() {
    return [
      // Defensive: admins sometimes type "/book" instead of "/booking" in the
      // page-editor button-link field. Make both work so a typo never 404s.
      { source: "/book", destination: "/booking", permanent: true },
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
          { key: "X-Frame-Options", value: "DENY" },
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

// Two Clerk issuers are accepted because the same Convex deployment serves
// both local dev (test Clerk instance, *.clerk.accounts.dev) and production
// (custom domain, clerk.mademedspa.com). JWTs from either issuer are valid;
// the website's middleware + assertAdmin still gate /admin separately.
//
// Set both env vars on the Convex deployment:
//   CLERK_FRONTEND_API_URL          → prod custom domain  (https://clerk.mademedspa.com)
//   CLERK_FRONTEND_API_URL_DEV      → dev Clerk frontend  (https://major-mallard-1.clerk.accounts.dev)
// If only one is set, the other slot is filtered out below.

const providers = [
  process.env.CLERK_FRONTEND_API_URL,
  process.env.CLERK_FRONTEND_API_URL_DEV,
]
  .filter((domain): domain is string => Boolean(domain))
  .map((domain) => ({
    domain,
    applicationID: "convex",
  }));

export default {
  providers,
};

import { clerkClient, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/admin/auth";

const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/api/admin(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isProtectedRoute(req)) return;

  // 1) Require sign-in (redirects unauth'd users to Clerk sign-in).
  await auth.protect();

  // 2) Allowlist check: pull email from Clerk and verify against ADMIN_EMAILS.
  const { userId, sessionClaims } = await auth();

  // sessionClaims.email is present if the Clerk session token template
  // includes it; otherwise we fetch the user record. Keep both paths.
  const claimEmail =
    typeof (sessionClaims as Record<string, unknown> | null | undefined)?.email === "string"
      ? ((sessionClaims as Record<string, unknown>).email as string)
      : null;

  let email: string | null | undefined = claimEmail;

  if (!email && userId) {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      email =
        user.primaryEmailAddress?.emailAddress ??
        user.emailAddresses[0]?.emailAddress ??
        null;
    } catch {
      // If Clerk lookup fails, treat as not-allowlisted.
      email = null;
    }
  }

  if (!isAdminEmail(email)) {
    return new NextResponse("Forbidden", { status: 403 });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { isAdminEmail } from "@/lib/admin/auth";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const { userId, sessionClaims } = await auth();
        if (!userId) {
          throw new Error("Unauthorized");
        }

        const claimEmail =
          typeof (sessionClaims as Record<string, unknown> | null | undefined)?.email === "string"
            ? ((sessionClaims as Record<string, unknown>).email as string)
            : null;

        let email: string | null | undefined = claimEmail;
        if (!email) {
          try {
            const client = await clerkClient();
            const user = await client.users.getUser(userId);
            email =
              user.primaryEmailAddress?.emailAddress ??
              user.emailAddresses[0]?.emailAddress ??
              null;
          } catch {
            email = null;
          }
        }

        if (!isAdminEmail(email)) {
          throw new Error("Forbidden: not an admin");
        }

        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/svg+xml",
            "video/mp4",
            "video/webm",
            "video/quicktime",
          ],
          maximumSizeInBytes: 100 * 1024 * 1024,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ userId, pathname, clientPayload }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log("[blob/upload] completed", {
          url: blob.url,
          pathname: blob.pathname,
          tokenPayload,
        });
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    const status = message.startsWith("Forbidden") ? 403 : message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

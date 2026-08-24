import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const isRealClerk =
  (publishableKey.startsWith("pk_live_") || publishableKey.startsWith("pk_test_")) &&
  publishableKey.length > 20;

let clerkMw: ((req: NextRequest) => ReturnType<typeof NextResponse.next>) | null = null;

async function getClerkMiddleware() {
  if (clerkMw) return clerkMw;
  const { clerkMiddleware, createRouteMatcher } = await import(
    "@clerk/nextjs/server"
  );

  const isPublicRoute = createRouteMatcher([
    "/",
    "/products",
    "/products/(.*)",
    "/blog",
    "/blog/(.*)",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/webhooks/clerk",
    "/api/webhooks/(.*)",
  ]);

  clerkMw = clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
  });
  return clerkMw;
}

export default async function middleware(req: NextRequest) {
  if (!isRealClerk) {
    return NextResponse.next();
  }
  const mw = await getClerkMiddleware();
  return mw(req);
}

export const config = {
  matcher: [
    "/((?!_next|.*\\.[a-zA-Z0-9]+$).*)",
    "/(api|trpc)(.*)",
  ],
};

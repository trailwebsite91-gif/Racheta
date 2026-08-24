import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// ── Role enum ──────────────────────────────────────────────────────────────────

export const UserRole = {
  CUSTOMER: "customer",
  SELLER: "seller",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// ── Auth session helpers ───────────────────────────────────────────────────────

/** Get the current auth session (does NOT throw/redirect). */
export async function getAuth() {
  return await auth();
}

/** Get the current Clerk user (does NOT throw/redirect). Returns null if unauthenticated. */
export async function getCurrentUser() {
  const user = await currentUser();
  return user;
}

/** Get the user's role from Clerk session claims. Returns "customer" by default. */
export async function getUserRole(): Promise<UserRole> {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  if (role === "admin") return UserRole.ADMIN;
  if (role === "seller") return UserRole.SELLER;
  return UserRole.CUSTOMER;
}

// ── Route guards ───────────────────────────────────────────────────────────────

/** Require authentication. Redirects to /sign-in if not signed in. Returns userId. */
export async function requireAuth(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  return userId;
}

/** Require seller or admin role. Redirects to /dashboard/onboarding if customer. */
export async function requireSeller(): Promise<string> {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  if (role !== "seller" && role !== "admin") {
    redirect("/dashboard/onboarding");
  }
  return userId;
}

/** Require admin role. Redirects to /dashboard if not admin. */
export async function requireAdmin(): Promise<string> {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  if (role !== "admin") {
    redirect("/dashboard");
  }
  return userId;
}

/** Get the full auth session (alias for getAuth, kept for backward compat). */
export async function getAuthSession() {
  return await auth();
}

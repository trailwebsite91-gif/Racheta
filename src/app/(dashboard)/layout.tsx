import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const role = (sessionClaims?.metadata as { role?: string })?.role;

  // If the user hasn't completed onboarding (no role set or is just "customer"),
  // redirect them to onboarding
  if (!role || role === "customer") {
    redirect("/dashboard/onboarding");
  }

  return <DashboardShell>{children}</DashboardShell>;
}

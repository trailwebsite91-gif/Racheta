import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const role = (sessionClaims?.metadata as { role?: string })?.role;

  // Only sellers and admins can access the dashboard
  if (role !== "seller" && role !== "admin") {
    redirect("/dashboard/onboarding");
  }

  return <>{children}</>;
}

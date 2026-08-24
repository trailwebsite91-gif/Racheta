import { requireSeller, getCurrentUser } from "@/lib/auth";
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { TopProducts } from "@/components/dashboard/top-products";

export default async function DashboardPage() {
  // Require seller role — will redirect to /sign-in or /dashboard/onboarding
  await requireSeller();
  const user = await getCurrentUser();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page heading */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome back, {user?.firstName ?? "Creator"}
        </h2>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={DollarSign}
          label="Total Revenue"
          value="₹1,24,500"
          trend={{ value: "12.5%", positive: true }}
          delay={0}
        />
        <StatsCard
          icon={ShoppingCart}
          label="Total Orders"
          value="847"
          trend={{ value: "8.2%", positive: true }}
          delay={1}
        />
        <StatsCard
          icon={Package}
          label="Active Products"
          value="142"
          subtext="12 drafts"
          delay={2}
        />
        <StatsCard
          icon={Users}
          label="Customers"
          value="623"
          trend={{ value: "22.4%", positive: true }}
          delay={3}
        />
      </div>

      {/* Middle row: chart + orders */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RevenueChart />
        </div>
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
      </div>

      {/* Bottom row: top products */}
      <div>
        <TopProducts />
      </div>
    </div>
  );
}

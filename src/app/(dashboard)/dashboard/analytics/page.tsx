import { requireSeller } from "@/lib/auth";
import { TrendingUp } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default async function AnalyticsPage() {
  await requireSeller();
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
      <p className="text-muted-foreground mt-1">View your store analytics and insights.</p>
      <EmptyState
        icon={TrendingUp}
        title="Coming soon"
        description="Advanced analytics features are under development."
      />
    </div>
  );
}

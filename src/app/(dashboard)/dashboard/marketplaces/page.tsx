import { requireSeller } from "@/lib/auth";
import { Store } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default async function MarketplacesPage() {
  await requireSeller();
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold tracking-tight">Marketplaces</h2>
      <p className="text-muted-foreground mt-1">Connect and manage marketplaces.</p>
      <EmptyState
        icon={Store}
        title="Coming soon"
        description="Marketplace integration features are under development."
      />
    </div>
  );
}

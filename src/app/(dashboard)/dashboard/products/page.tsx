import { requireSeller } from "@/lib/auth";
import { Package } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default async function ProductsPage() {
  await requireSeller();
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold tracking-tight">Products</h2>
      <p className="text-muted-foreground mt-1">Manage your product listings.</p>
      <EmptyState
        icon={Package}
        title="Coming soon"
        description="Product management features are under development."
      />
    </div>
  );
}

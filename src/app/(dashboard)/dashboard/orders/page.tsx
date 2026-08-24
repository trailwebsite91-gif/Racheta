import { requireSeller } from "@/lib/auth";
import { ShoppingCart } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default async function OrdersPage() {
  await requireSeller();
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
      <p className="text-muted-foreground mt-1">Track and manage your orders.</p>
      <EmptyState
        icon={ShoppingCart}
        title="Coming soon"
        description="Order management features are under development."
      />
    </div>
  );
}

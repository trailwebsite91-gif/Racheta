import { requireSeller } from "@/lib/auth";
import { Truck } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default async function SuppliersPage() {
  await requireSeller();
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold tracking-tight">Suppliers</h2>
      <p className="text-muted-foreground mt-1">Connect and manage your POD suppliers.</p>
      <EmptyState
        icon={Truck}
        title="Coming soon"
        description="Supplier management features are under development."
      />
    </div>
  );
}

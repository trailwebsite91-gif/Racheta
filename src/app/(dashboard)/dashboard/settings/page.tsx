import { requireSeller } from "@/lib/auth";
import { Settings } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default async function SettingsPage() {
  await requireSeller();
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
      <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      <EmptyState
        icon={Settings}
        title="Coming soon"
        description="Settings features are under development."
      />
    </div>
  );
}

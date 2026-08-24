import { requireSeller } from "@/lib/auth";
import { DesignerWorkspace } from "@/components/designer/designer-workspace";

export default async function DesignsPage() {
  await requireSeller();
  return (
    <div className="animate-fade-in">
      <DesignerWorkspace />
    </div>
  );
}

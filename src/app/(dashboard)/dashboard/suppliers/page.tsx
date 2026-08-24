import { requireSeller } from "@/lib/auth";
import { SupplierManager } from "@/components/suppliers/supplier-manager";

export default async function SuppliersPage() {
  await requireSeller();
  return <SupplierManager />;
}

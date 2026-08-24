"use client";

import { cn } from "@/lib/utils";
import { Truck, Check } from "lucide-react";
import type { ProductSupplier } from "@/lib/mock-products";

interface SupplierSelectorProps {
  suppliers: ProductSupplier[];
  selected: ProductSupplier | null;
  onSelect: (supplier: ProductSupplier) => void;
}

export function SupplierSelector({
  suppliers,
  selected,
  onSelect,
}: SupplierSelectorProps) {
  return (
    <div className="space-y-2">
      {suppliers.map((s) => {
        const isSelected = selected?.name === s.name;
        return (
          <button
            key={s.name}
            type="button"
            onClick={() => onSelect(s)}
            className={cn(
              "flex w-full items-center justify-between rounded-xl border p-3 transition-all text-left",
              isSelected
                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                : "border-border bg-card hover:border-primary/30 hover:bg-muted/20"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30"
                )}
              >
                {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {s.name}
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    ({s.region})
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Base price: ₹{s.basePrice.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Truck className="h-3 w-3" />
              <span>{s.deliveryDays}d</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

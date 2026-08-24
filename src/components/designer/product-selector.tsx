"use client";

import { Package } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCTS } from "./types";

interface ProductSelectorProps {
  value: string;
  onValueChange: (productId: string) => void;
}

/** Dropdown of supported products. Changing the product resizes the canvas. */
export function ProductSelector({ value, onValueChange }: ProductSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[200px] sm:w-[220px]" aria-label="Select product">
        <Package className="h-4 w-4 opacity-50" />
        <SelectValue placeholder="Select product" />
      </SelectTrigger>
      <SelectContent>
        {PRODUCTS.map((p) => (
          <SelectItem key={p.id} value={p.id}>
            {p.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/mock-products";

interface ProductFiltersProps {
  className?: string;
  onClose?: () => void; // for mobile sheet
}

const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "One Size"];
const REGIONS = ["India", "Global"];
const PRICE_RANGES = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { label: "₹1,000 – ₹2,000", min: 1000, max: 2000 },
  { label: "₹2,000 – ₹5,000", min: 2000, max: 5000 },
];

export function ProductFilters({ className, onClose }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCategories = searchParams.getAll("category");
  const selectedSizes = searchParams.getAll("size");
  const selectedRegions = searchParams.getAll("region");
  const selectedPrices = searchParams.getAll("price");
  const sort = searchParams.get("sort");

  const activeFilterCount =
    selectedCategories.length +
    selectedSizes.length +
    selectedRegions.length +
    selectedPrices.length;

  const updateParams = useCallback(
    (key: string, values: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      values.forEach((v) => params.append(key, v));
      if (sort) params.set("sort", sort);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router, sort]
  );

  const toggleParam = useCallback(
    (key: string, value: string) => {
      const current = searchParams.getAll(key);
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      updateParams(key, next);
    },
    [searchParams, updateParams]
  );

  const clearAll = useCallback(() => {
    const params = new URLSearchParams();
    if (sort) params.set("sort", sort);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, sort]);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm">Filters</h3>
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Active filters as badges */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedCategories.map((c) => (
            <Badge key={c} variant="secondary" className="gap-1 pr-1">
              {c}
              <button
                type="button"
                onClick={() => toggleParam("category", c)}
                className="ml-1 rounded-full hover:bg-muted p-0.5"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </Badge>
          ))}
          {selectedSizes.map((s) => (
            <Badge key={s} variant="outline" className="gap-1 pr-1">
              {s}
              <button
                type="button"
                onClick={() => toggleParam("size", s)}
                className="ml-1 rounded-full hover:bg-muted p-0.5"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </Badge>
          ))}
          {selectedRegions.map((r) => (
            <Badge key={r} variant="accent" className="gap-1 pr-1">
              {r}
              <button
                type="button"
                onClick={() => toggleParam("region", r)}
                className="ml-1 rounded-full hover:bg-muted p-0.5"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Categories */}
      <FilterSection title="Category">
        {categories.map((cat) => (
          <FilterRow
            key={cat}
            label={cat}
            checked={selectedCategories.includes(cat)}
            onChange={() => toggleParam("category", cat)}
          />
        ))}
      </FilterSection>

      {/* Size */}
      <FilterSection title="Size">
        {SIZES.map((size) => (
          <FilterRow
            key={size}
            label={size}
            checked={selectedSizes.includes(size)}
            onChange={() => toggleParam("size", size)}
          />
        ))}
      </FilterSection>

      {/* Supplier Region */}
      <FilterSection title="Supplier Region">
        {REGIONS.map((region) => (
          <FilterRow
            key={region}
            label={region}
            checked={selectedRegions.includes(region)}
            onChange={() => toggleParam("region", region)}
          />
        ))}
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        {PRICE_RANGES.map((range) => (
          <FilterRow
            key={range.label}
            label={range.label}
            checked={selectedPrices.includes(range.label)}
            onChange={() => toggleParam("price", range.label)}
          />
        ))}
      </FilterSection>

      {/* Mobile close */}
      {onClose && (
        <Button onClick={onClose} className="w-full mt-4 lg:hidden" size="sm">
          Show results
        </Button>
      )}
    </div>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h4>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function FilterRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-0.5 py-1 transition-colors hover:text-foreground">
      <Checkbox checked={checked} onCheckedChange={onChange} />
      <span className="text-sm text-muted-foreground">{label}</span>
    </label>
  );
}

"use client";

import { useMemo, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductCard } from "@/components/products/product-card";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import { products } from "@/lib/mock-products";
import type { Product } from "@/lib/mock-products";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "bestselling", label: "Bestselling" },
] as const;

function priceRangeLabel(s: string) {
  switch (s) {
    case "Under ₹500": return [0, 500] as const;
    case "₹500 – ₹1,000": return [500, 1000] as const;
    case "₹1,000 – ₹2,000": return [1000, 2000] as const;
    case "₹2,000 – ₹5,000": return [2000, 5000] as const;
    default: return null;
  }
}

function filterAndSortProducts(
  searchParams: URLSearchParams
): Product[] {
  let filtered = [...products];

  const categoryFilters = searchParams.getAll("category");
  const sizeFilters = searchParams.getAll("size");
  const regionFilters = searchParams.getAll("region");
  const priceFilters = searchParams.getAll("price");
  const sort = searchParams.get("sort") ?? "newest";

  // Category filter
  if (categoryFilters.length > 0) {
    filtered = filtered.filter((p) => categoryFilters.includes(p.category));
  }

  // Size filter
  if (sizeFilters.length > 0) {
    filtered = filtered.filter((p) =>
      p.variants.sizes.some((s) => sizeFilters.includes(s))
    );
  }

  // Region filter
  if (regionFilters.length > 0) {
    filtered = filtered.filter((p) =>
      p.suppliers.some((s) => regionFilters.includes(s.region))
    );
  }

  // Price filter
  if (priceFilters.length > 0) {
    filtered = filtered.filter((p) => {
      return priceFilters.some((pf) => {
        const range = priceRangeLabel(pf);
        if (!range) return false;
        return p.priceRange.min <= range[1] && p.priceRange.max >= range[0];
      });
    });
  }

  // Sort
  switch (sort) {
    case "price-low":
      filtered.sort((a, b) => a.priceRange.min - b.priceRange.min);
      break;
    case "price-high":
      filtered.sort((a, b) => b.priceRange.max - a.priceRange.max);
      break;
    case "bestselling":
      filtered.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case "newest":
    default:
      break;
  }

  return filtered;
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentSort = searchParams.get("sort") ?? "newest";
  const filtered = useMemo(() => filterAndSortProducts(searchParams), [searchParams]);

  const updateSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      {/* Toolbar */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-heading-3">Shop All Products</h1>
          <p className="mt-1 text-body-sm">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} available
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile filters trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 lg:hidden">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[320px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <ProductFilters />
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort */}
          <Select value={currentSort} onValueChange={updateSort}>
            <SelectTrigger className="h-9 w-[180px] gap-2 text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Body */}
      <div className="flex gap-10">
        {/* Desktop sidebar filters */}
        <aside className="hidden w-[240px] flex-shrink-0 lg:block">
          <div className="sticky top-24">
            <ProductFilters />
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1 min-w-0">
          {filtered.length > 0 ? (
            <ProductGrid>
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </ProductGrid>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <X className="h-6 w-6 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-semibold">No products found</h2>
              <p className="mt-1 text-body-sm max-w-sm">
                Try adjusting your filters or clearing them to see all available
                products.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => router.push(pathname)}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="space-y-8">
            <div className="h-9 w-48 animate-pulse rounded-lg bg-muted" />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-2xl bg-muted"
                />
              ))}
            </div>
          </div>
        }
      >
        <ProductsContent />
      </Suspense>
    </div>
  );
}

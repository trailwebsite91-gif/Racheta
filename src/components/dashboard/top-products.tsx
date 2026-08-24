"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Package, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer, staggerItem } from "@/styles/animations";

interface Product {
  id: string;
  name: string;
  imageColor: string; // Placeholder color for image
  sales: number;
  revenue: string;
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Abstract Wave Tee",
    imageColor: "#7C3AED",
    sales: 243,
    revenue: "₹4,85,700",
  },
  {
    id: "2",
    name: "Geo Pattern Hoodie",
    imageColor: "#2563EB",
    sales: 187,
    revenue: "₹9,34,130",
  },
  {
    id: "3",
    name: "Minimal Logo Mug",
    imageColor: "#059669",
    sales: 312,
    revenue: "₹2,49,288",
  },
  {
    id: "4",
    name: "Mountain Poster",
    imageColor: "#D97706",
    sales: 156,
    revenue: "₹2,02,644",
  },
  {
    id: "5",
    name: "Botanical Tote Bag",
    imageColor: "#DC2626",
    sales: 98,
    revenue: "₹1,86,102",
  },
];

interface TopProductsProps {
  products?: Product[];
  isLoading?: boolean;
}

export function TopProducts({ products = mockProducts, isLoading = false }: TopProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 w-64 animate-pulse rounded-xl bg-muted shrink-0"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Package}
            title="No products yet"
            description="Your top performing products will appear here."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Top Products</CardTitle>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              variants={staggerItem}
              initial="hidden"
              animate="visible"
              transition={{ delay: idx * 0.08 }}
              className="group shrink-0 cursor-pointer"
              whileHover={{ y: -2 }}
            >
              <div className="w-[220px] rounded-xl border bg-card transition-all duration-200 group-hover:border-primary/30 group-hover:shadow-md group-hover:shadow-primary/5">
                {/* Product image placeholder */}
                <div
                  className="h-28 rounded-t-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${product.imageColor}20, ${product.imageColor}40)`,
                  }}
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{
                      background: `${product.imageColor}30`,
                      border: `2px solid ${product.imageColor}50`,
                    }}
                  >
                    <Package
                      className="h-6 w-6"
                      style={{ color: product.imageColor }}
                    />
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-semibold truncate">
                    {product.name}
                  </h4>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                      <span className="text-xs font-medium text-muted-foreground">
                        {product.sales} sales
                      </span>
                    </div>
                    <span className="text-sm font-bold">
                      {product.revenue}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

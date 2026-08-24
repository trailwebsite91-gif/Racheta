"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/mock-products";
import { getPriceRangeLabel } from "@/lib/mock-products";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
      className="group relative"
    >
      <Link
        href={`/products/${product.slug}`}
        className="block rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 overflow-hidden"
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <div className={cn(
            "absolute inset-0 transition-all duration-500 group-hover:scale-105",
            !imgLoaded && "animate-shimmer"
          )}>
            <img
              src={product.images[0]}
              alt={product.name}
              onLoad={() => setImgLoaded(true)}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Category Badge */}
          <div className="absolute left-3 top-3">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs font-medium">
              {product.category}
            </Badge>
          </div>

          {/* Wishlist Heart */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setWishlisted(!wishlisted);
            }}
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm shadow-sm transition-all hover:bg-background hover:shadow-md"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-all",
                wishlisted ? "fill-red-500 text-red-500 scale-110" : "text-muted-foreground"
              )}
            />
          </button>

          {/* Supplier Badges */}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
            {product.suppliers.slice(0, 3).map((s) => (
              <span
                key={s.name}
                className="inline-flex items-center rounded-full bg-background/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-muted-foreground shadow-sm"
              >
                {s.name}
              </span>
            ))}
            {product.suppliers.length > 3 && (
              <span className="inline-flex items-center rounded-full bg-background/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-muted-foreground shadow-sm">
                +{product.suppliers.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground text-sm sm:text-base line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="mt-1 flex items-center gap-1">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3 w-3",
                    i < Math.floor(product.rating)
                      ? "fill-accent text-accent"
                      : "fill-muted text-muted"
                  )}
                />
              ))}
            </div>
            <span className="text-[11px] text-muted-foreground">
              ({product.reviewCount.toLocaleString()})
            </span>
          </div>

          {/* Price Range */}
          <p className="mt-2 text-base font-bold text-primary">
            {getPriceRangeLabel(product)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

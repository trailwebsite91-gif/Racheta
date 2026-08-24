"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Minus, Plus, ShoppingCart, Star, Truck, Shield } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductGallery } from "@/components/products/product-gallery";
import { VariantSelector } from "@/components/products/variant-selector";
import { SupplierSelector } from "@/components/products/supplier-selector";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductCard } from "@/components/products/product-card";
import { getPriceRangeLabel } from "@/lib/mock-products";
import type { Product, ProductSupplier } from "@/lib/mock-products";

interface ProductDetailClientProps {
  product: Product;
  related: Product[];
}

export function ProductDetailClient({ product, related }: ProductDetailClientProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.variants.colors[0]?.name ?? null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.variants.sizes[0] ?? null
  );
  const [selectedSupplier, setSelectedSupplier] = useState<ProductSupplier | null>(
    product.suppliers[0] ?? null
  );
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    toast.success(`${product.name} added to cart!`, {
      description: `${quantity}x, ${selectedSupplier?.name ?? ""} — ${getPriceRangeLabel(product)}`,
    });
  };

  const supplierPrice = selectedSupplier
    ? `₹${selectedSupplier.basePrice.toLocaleString("en-IN")}`
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/products" className="hover:text-foreground transition-colors">
          Products
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium truncate">{product.name}</span>
      </nav>

      {/* Two-column layout */}
      <div className="grid gap-10 lg:grid-cols-[60%_40%]">
        {/* Left: Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ProductGallery images={product.images} productName={product.name} />
        </motion.div>

        {/* Right: Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col gap-6"
        >
          {/* Category + Rating */}
          <div className="flex items-center gap-3">
            <Badge variant="secondary">{product.category}</Badge>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(product.rating)
                      ? "fill-accent text-accent"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
              <span className="ml-1 text-sm text-muted-foreground">
                {product.rating} ({product.reviewCount.toLocaleString()})
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-heading-2">{product.name}</h1>

          {/* Price */}
          <div>
            <p className="text-3xl font-bold text-primary">
              {getPriceRangeLabel(product)}
            </p>
            {supplierPrice && (
              <p className="mt-1 text-sm text-muted-foreground">
                Starting at {supplierPrice} base price with {selectedSupplier?.name}
              </p>
            )}
          </div>

          {/* Color Variant */}
          {product.variants.colors.length > 0 && (
            <div className="space-y-2.5">
              <LabelRow label="Color" selected={selectedColor ?? ""} />
              <VariantSelector
                type="color"
                options={product.variants.colors}
                selected={selectedColor}
                onSelect={setSelectedColor}
              />
            </div>
          )}

          {/* Size Variant */}
          {product.variants.sizes.length > 0 && (
            <div className="space-y-2.5">
              <LabelRow label="Size" selected={selectedSize ?? ""} />
              <VariantSelector
                type="size"
                options={product.variants.sizes.map((s) => ({ name: s }))}
                selected={selectedSize}
                onSelect={setSelectedSize}
              />
            </div>
          )}

          {/* Supplier */}
          <div className="space-y-2.5">
            <LabelRow label="Supplier" selected={selectedSupplier?.name ?? ""} />
            <SupplierSelector
              suppliers={product.suppliers}
              selected={selectedSupplier}
              onSelect={setSelectedSupplier}
            />
          </div>

          {/* Quantity */}
          <div className="space-y-2.5">
            <label className="text-sm font-medium text-foreground">Quantity</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="flex h-10 w-12 items-center justify-center rounded-lg border border-border bg-muted/50 text-sm font-medium tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <Button
            size="xl"
            onClick={handleAddToCart}
            className="w-full gap-2"
          >
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </Button>

          {/* Delivery estimate */}
          {selectedSupplier && (
            <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 p-3">
              <Truck className="h-4 w-4 text-primary" />
              <p className="text-sm text-muted-foreground">
                Estimated delivery:{" "}
                <span className="font-medium text-foreground">
                  {selectedSupplier.deliveryDays} days
                </span>{" "}
                via {selectedSupplier.name} ({selectedSupplier.region})
              </p>
            </div>
          )}

          {/* Trust banner */}
          <div className="flex gap-4 rounded-xl border border-border bg-muted/30 p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5 text-green-600" />
              Quality Guarantee
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Truck className="h-3.5 w-3.5 text-primary" />
              Free shipping over ₹999
            </div>
          </div>

          <Separator />

          {/* Accordion Sections */}
          <AccordionSection title="Description" defaultOpen>
            <p className="text-body leading-relaxed">{product.description}</p>
          </AccordionSection>

          <AccordionSection title="Shipping & Delivery">
            <div className="space-y-3 text-body-sm">
              <p>
                All products are print-on-demand and shipped directly from the
                supplier. Production time is typically 2-4 business days before
                shipping.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {product.suppliers.map((s) => (
                  <div
                    key={s.name}
                    className="rounded-lg border border-border p-2.5"
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {s.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {s.region} — {s.deliveryDays} days
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </AccordionSection>

          <AccordionSection title="Size Guide">
            <p className="text-body-sm">
              Please refer to the size chart below. Measurements are in inches.
              If you&apos;re between sizes, we recommend sizing up for a
              comfortable fit.
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-2 pr-4 font-semibold">Size</th>
                    <th className="pb-2 pr-4 font-semibold">Chest</th>
                    <th className="pb-2 pr-4 font-semibold">Length</th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.sizes.slice(0, 6).map((size, i) => {
                    const chestBase = 36 + i * 2;
                    const lengthBase = 26 + i;
                    return (
                      <tr key={size} className="border-b border-border/50">
                        <td className="py-2 pr-4 font-medium">{size}</td>
                        <td className="py-2 pr-4 text-muted-foreground">
                          {chestBase}-{chestBase + 2}&quot;
                        </td>
                        <td className="py-2 pr-4 text-muted-foreground">
                          {lengthBase}-{lengthBase + 1}&quot;
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </AccordionSection>
        </motion.div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-20">
          <div className="mb-8">
            <h2 className="text-heading-3">You May Also Like</h2>
            <p className="mt-1 text-body-sm">
              Similar products our customers love
            </p>
          </div>
          <ProductGrid>
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </ProductGrid>
        </section>
      )}
    </div>
  );
}

function LabelRow({ label, selected }: { label: string; selected: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {selected && (
        <span className="text-xs text-muted-foreground">— {selected}</span>
      )}
    </div>
  );
}

function AccordionSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border pb-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-3 text-left"
      >
        <span className="font-semibold text-foreground">{title}</span>
        <span
          className={`text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <ChevronRight className="h-4 w-4" />
        </span>
      </button>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="pb-2">{children}</div>
        </motion.div>
      )}
    </div>
  );
}

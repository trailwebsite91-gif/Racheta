"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DesignElementView } from "./design-element";
import type { DesignElement, MockupKind, Product } from "./types";

interface MockupPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  elements: DesignElement[];
  product: Product;
}

/**
 * Renders the current canvas design overlaid on a stylised product
 * silhouette so sellers can check how the design maps to the print area.
 */
export function MockupPreview({ open, onOpenChange, elements, product }: MockupPreviewProps) {
  const { mockup } = product;
  // Scale the design so its canvas width maps onto the mockup print area.
  const scale = mockup.printWidth / product.canvasWidth;
  const empty = elements.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Mockup preview — {product.name}
          </DialogTitle>
          <DialogDescription>
            A stylised preview of how your design maps onto the product&apos;s print area. Actual
            colours and proportions vary by supplier.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center rounded-xl bg-muted/50 p-6">
          <div className="relative" style={{ width: mockup.bodyWidth, height: mockup.bodyHeight }}>
            {/* Product silhouette */}
            <ProductSilhouette kind={mockup.kind} gradient={mockup.gradient} />

            {/* Print area with the design rendered at scale */}
            <div
              className="absolute overflow-hidden rounded-sm border border-dashed border-foreground/25"
              style={{
                left: mockup.printX,
                top: mockup.printY,
                width: mockup.printWidth,
                height: mockup.printHeight,
              }}
            >
              {empty ? (
                <div className="flex h-full w-full items-center justify-center bg-background/40 p-2 text-center">
                  <p className="text-[11px] text-muted-foreground">Your design appears here</p>
                </div>
              ) : (
                elements.map((element, index) => (
                  <DesignElementView
                    key={element.id}
                    element={element}
                    scale={scale}
                    zIndex={index}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          <p>
            This is a <span className="font-medium text-foreground">design preview</span> — the
            print area is the region a supplier prints on. Generate a full mockup (product photo
            with your design) is available on paid tiers.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProductSilhouette({ kind, gradient }: { kind: MockupKind; gradient: string }) {
  return (
    <div className="absolute inset-0">
      {kind === "shirt" && (
        <div
          className="absolute inset-0 rounded-t-[90px] rounded-b-2xl shadow-lg"
          style={{ background: gradient, boxShadow: "0 6px 18px rgb(0 0 0 / 0.18)" }}
        >
          <div className="absolute left-1/2 top-0 h-10 w-20 -translate-x-1/2 rounded-b-full bg-background" />
        </div>
      )}

      {kind === "hoodie" && (
        <>
          <div
            className="absolute inset-0 rounded-t-[90px] rounded-b-2xl shadow-lg"
            style={{ background: gradient }}
          />
          {/* Hood strings + pocket */}
          <div className="absolute left-1/2 top-6 h-14 w-16 -translate-x-1/2 rounded-b-2xl border-2 border-t-0 border-background/70" />
          <div className="absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 rounded-full bg-background/80" />
          <div className="absolute left-1/2 top-4 h-2 w-1 -translate-x-1/2 rounded-full bg-background/80" />
          <div className="absolute bottom-8 left-1/2 h-10 w-24 -translate-x-1/2 rounded-2xl border-2 border-background/60" />
        </>
      )}

      {kind === "sweatshirt" && (
        <div
          className="absolute inset-0 rounded-t-[90px] rounded-b-2xl shadow-lg"
          style={{ background: gradient }}
        >
          <div className="absolute left-1/2 top-0 h-10 w-20 -translate-x-1/2 rounded-b-full bg-background" />
          <div className="absolute bottom-6 left-1/2 h-1.5 w-24 -translate-x-1/2 rounded-full bg-background/50" />
        </div>
      )}

      {kind === "mug" && (
        <>
          <div
            className="absolute inset-y-0 left-0 w-[calc(100%-36px)] rounded-b-xl rounded-t-lg shadow-lg"
            style={{ background: gradient }}
          />
          {/* Handle (right-side arc) */}
          <div
            className="absolute right-0 top-5 h-24 w-9"
            style={{
              border: "8px solid #b6b3ae",
              borderLeft: "none",
              borderRadius: "0 22px 22px 0",
            }}
          />
        </>
      )}

      {kind === "phone" && (
        <div
          className="absolute inset-0 rounded-[26px] shadow-lg"
          style={{ background: gradient }}
        >
          <div className="absolute left-1/2 top-2.5 h-3 w-12 -translate-x-1/2 rounded-full bg-background/70" />
        </div>
      )}

      {kind === "tote" && (
        <>
          {/* Straps */}
          <div
            className="absolute left-[28%] top-0 h-12 w-9 rounded-t-full"
            style={{ border: "5px solid #b0aca6", borderBottom: "none" }}
          />
          <div
            className="absolute right-[28%] top-0 h-12 w-9 rounded-t-full"
            style={{ border: "5px solid #b0aca6", borderBottom: "none" }}
          />
          <div
            className="absolute inset-x-0 bottom-0 top-8 rounded-b-lg rounded-t-sm shadow-lg"
            style={{ background: gradient }}
          />
        </>
      )}

      {kind === "poster" && (
        <div
          className="absolute inset-0 rounded-md shadow-lg"
          style={{ background: gradient, boxShadow: "0 6px 16px rgb(0 0 0 / 0.15)" }}
        />
      )}

      {kind === "cap" && (
        <>
          <div
            className="absolute inset-x-0 top-0 h-[120px] rounded-t-full shadow-lg"
            style={{ background: gradient }}
          />
          <div className="absolute inset-x-0 bottom-6 h-6 rounded-md bg-stone-700" style={{ background: "#5b5650" }} />
        </>
      )}
    </div>
  );
}

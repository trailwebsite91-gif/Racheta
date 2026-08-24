"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Palette, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DesignCanvas } from "./design-canvas";
import { ExportButton } from "./export-button";
import { MockupPreview } from "./mockup-preview";
import { ProductSelector } from "./product-selector";
import { PropertiesPanel } from "./properties-panel";
import { ToolPanel } from "./tool-panel";
import { genId, getProduct, type CreationTool, type DesignElement, type Tool } from "./types";

const STORAGE_KEY = "smartprint.designs.v1";

function makeElement(tool: CreationTool, x: number, y: number): DesignElement {
  const base = { id: genId(), x, y, rotation: 0, opacity: 100 };
  switch (tool) {
    case "text":
      return { ...base, type: "text", width: 200, height: 64, content: "Your text", color: "#18181b", fontSize: 24 };
    case "rect":
      return { ...base, type: "shape", shape: "rect", width: 120, height: 120, content: "", color: "#7c3aed", fontSize: 24 };
    case "circle":
      return { ...base, type: "shape", shape: "circle", width: 120, height: 120, content: "", color: "#f59e0b", fontSize: 24 };
  }
}

interface SavedDesign {
  name: string;
  productId: string;
  elements: DesignElement[];
  savedAt: string;
}

/** Full design tool: toolbar + tool rail + canvas + properties + actions. */
export function DesignerWorkspace() {
  const [tool, setTool] = React.useState<Tool>("select");
  const [elements, setElements] = React.useState<DesignElement[]>([]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [productId, setProductId] = React.useState("classic-tee");
  const [mockupOpen, setMockupOpen] = React.useState(false);

  const product = getProduct(productId);
  const selectedElement = elements.find((el) => el.id === selectedId) ?? null;

  const updateElement = React.useCallback((id: string, patch: Partial<DesignElement>) => {
    setElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...patch } : el)));
  }, []);

  const deleteElement = React.useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    setSelectedId((current) => (current === id ? null : current));
  }, []);

  const selectAndFocus = React.useCallback((id: string) => {
    setSelectedId(id);
    setTool("select");
  }, []);

  const addElement = React.useCallback(
    (creationTool: CreationTool, x?: number, y?: number) => {
      const cx = product.canvasWidth / 2;
      const cy = product.canvasHeight / 2;
      const el = makeElement(
        creationTool,
        x ?? cx - 100,
        y ?? cy - 60
      );
      setElements((prev) => [...prev, el]);
      selectAndFocus(el.id);
    },
    [product.canvasWidth, product.canvasHeight, selectAndFocus]
  );

  const handleToolChange = React.useCallback(
    (next: Tool) => {
      if (next === "select") {
        setTool("select");
        return;
      }
      if (next === "text" || next === "rect" || next === "circle") {
        addElement(next);
        return;
      }
      setTool(next);
    },
    [addElement]
  );

  const handleUpload = React.useCallback(
    (dataUrl: string) => {
      const w = Math.min(180, Math.round(product.canvasWidth * 0.45));
      const h = Math.min(180, Math.round(product.canvasHeight * 0.36));
      const el: DesignElement = {
        id: genId(),
        type: "image",
        x: Math.round((product.canvasWidth - w) / 2),
        y: Math.round((product.canvasHeight - h) / 2),
        width: w,
        height: h,
        rotation: 0,
        opacity: 100,
        content: dataUrl,
        color: "#18181b",
        fontSize: 24,
      };
      setElements((prev) => [...prev, el]);
      selectAndFocus(el.id);
      toast.success("Image added", { description: "Drag it into place on the canvas." });
    },
    [product.canvasWidth, product.canvasHeight, selectAndFocus]
  );

  const handleSave = React.useCallback(() => {
    if (elements.length === 0) {
      toast.info("Nothing to save", { description: "Add some elements to the canvas first." });
      return;
    }
    const saved: SavedDesign = {
      name: `Design on ${product.name}`,
      productId,
      elements,
      savedAt: new Date().toISOString(),
    };
    const existing: SavedDesign[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    localStorage.setItem(STORAGE_KEY, JSON.stringify([saved, ...existing].slice(0, 20)));
    toast.success("Design saved", {
      description: `${elements.length} element${elements.length === 1 ? "" : "s"} stored in your browser. Server sync lands with the designs library.`,
    });
  }, [elements, product.name, productId]);

  // Esc: deselect + back to the select tool.
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedId(null);
        setTool("select");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* ── Toolbar ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div className="mx-1 h-5 w-px bg-border" />
          <span className="flex items-center gap-1.5 text-sm font-semibold">
            <Palette className="h-4 w-4 text-primary" />
            Design Studio
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-muted-foreground sm:inline">Product:</span>
          <ProductSelector value={productId} onValueChange={setProductId} />
        </div>

        <Button size="sm" onClick={handleSave}>
          <Save className="mr-1.5 h-4 w-4" />
          Save
        </Button>
      </div>

      {/* ── Workspace ───────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-[210px_minmax(0,1fr)_260px]">
        <ToolPanel tool={tool} onToolChange={handleToolChange} onUpload={handleUpload} />

        <div className="flex min-w-0 items-start justify-center rounded-xl border bg-card p-4 shadow-sm sm:p-6">
          <DesignCanvas
            width={product.canvasWidth}
            height={product.canvasHeight}
            elements={elements}
            selectedId={selectedId}
            tool={tool}
            onSelect={setSelectedId}
            onUpdate={updateElement}
            onAddAt={(creationTool, x, y) => addElement(creationTool, x, y)}
          />
        </div>

        <PropertiesPanel
          element={selectedElement}
          onChange={updateElement}
          onDelete={deleteElement}
        />
      </div>

      {/* ── Actions ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-center gap-3 rounded-xl border bg-card p-3 shadow-sm">
        <Button onClick={() => setMockupOpen(true)} disabled={elements.length === 0}>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Mockup
        </Button>
        <ExportButton
          elements={elements}
          canvasWidth={product.canvasWidth}
          canvasHeight={product.canvasHeight}
        />
        <p className="w-full text-center text-xs text-muted-foreground sm:w-auto">
          Canvas: {product.canvasWidth} × {product.canvasHeight}px · {product.name}
        </p>
      </div>

      <MockupPreview
        open={mockupOpen}
        onOpenChange={setMockupOpen}
        elements={elements}
        product={product}
      />
    </div>
  );
}

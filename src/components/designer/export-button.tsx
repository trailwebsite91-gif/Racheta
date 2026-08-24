"use client";

import * as React from "react";
import { Download, FileImage, FileCode2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { DesignElement } from "./types";
import { exportPng, exportSvg } from "./export-utils";

interface ExportButtonProps {
  elements: DesignElement[];
  canvasWidth: number;
  canvasHeight: number;
}

const OPTIONS = [
  {
    id: "png-transparent",
    title: "PNG — transparent",
    description: "Best for layered designs on coloured products.",
    icon: FileImage,
  },
  {
    id: "png-white",
    title: "PNG — white background",
    description: "Flat file, good for marketplaces that need a background.",
    icon: FileImage,
  },
  {
    id: "svg",
    title: "SVG — text & shapes",
    description: "Vector file (text + shapes, images excluded) for print shops.",
    icon: FileCode2,
  },
] as const;

type OptionId = (typeof OPTIONS)[number]["id"];

/** Export dialog: real PNG rendering via <canvas> + SVG serialization. */
export function ExportButton({ elements, canvasWidth, canvasHeight }: ExportButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState<OptionId | null>(null);

  const handleExport = async (option: OptionId) => {
    if (busy) return;
    setBusy(option);
    try {
      if (option === "svg") {
        exportSvg(elements, canvasWidth, canvasHeight);
      } else {
        await exportPng(elements, canvasWidth, canvasHeight, option === "png-white" ? "white" : "transparent");
      }
      toast.success("Export complete", { description: "Your file has been downloaded." });
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Export failed", { description: "Something went wrong while generating the file." });
    } finally {
      setBusy(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={elements.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export PNG
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Export design</DialogTitle>
          <DialogDescription>
            {canvasWidth} × {canvasHeight}px print area · {elements.length} element
            {elements.length === 1 ? "" : "s"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {OPTIONS.map(({ id, title, description, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => handleExport(id)}
              disabled={busy !== null}
              className={cn(
                "flex items-start gap-3 rounded-lg border border-border p-3 text-left transition-colors",
                "hover:border-primary/50 hover:bg-accent/50 disabled:cursor-not-allowed disabled:opacity-60"
              )}
            >
              {busy === id ? (
                <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-primary" />
              ) : (
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              )}
              <span>
                <span className="block text-sm font-medium">{title}</span>
                <span className="block text-xs text-muted-foreground">{description}</span>
              </span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

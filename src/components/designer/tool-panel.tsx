"use client";

import * as React from "react";
import { Circle, ImagePlus, MousePointer2, Square, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tool } from "./types";

interface ToolPanelProps {
  tool: Tool;
  onToolChange: (tool: Tool) => void;
  onUpload: (dataUrl: string, fileName: string) => void;
}

const TOOLS: { id: Tool; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "select", label: "Select", icon: MousePointer2 },
  { id: "text", label: "Add Text", icon: Type },
  { id: "rect", label: "Rectangle", icon: Square },
  { id: "circle", label: "Circle", icon: Circle },
  { id: "upload", label: "Upload Image", icon: ImagePlus },
];

/** Vertical tool rail: select / add text / shapes / upload. */
export function ToolPanel({ tool, onToolChange, onUpload }: ToolPanelProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleToolClick = (id: Tool) => {
    if (id === "upload") {
      fileInputRef.current?.click();
      return;
    }
    onToolChange(id);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onUpload(reader.result, file.name);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-1.5 rounded-xl border bg-card p-2 shadow-sm lg:h-fit">
      <p className="px-2 pb-1 pt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Tools
      </p>
      {TOOLS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => handleToolClick(id)}
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            tool === id
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
          aria-pressed={tool === id}
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </button>
      ))}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/svg+xml,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileChange}
        aria-label="Upload image"
      />

      <div className="mt-2 border-t border-border px-2 pt-3 pb-1">
        <p className="text-[11px] leading-relaxed text-muted-foreground/70">
          Tip: select an element, then drag the corner handle to resize. Press Esc to deselect.
        </p>
      </div>
    </div>
  );
}

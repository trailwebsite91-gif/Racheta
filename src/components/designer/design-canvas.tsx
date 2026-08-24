"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { DesignElementView } from "./design-element";
import type { CreationTool, DesignElement, Tool } from "./types";

interface DesignCanvasProps {
  width: number;
  height: number;
  elements: DesignElement[];
  selectedId: string | null;
  tool: Tool;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, patch: Partial<DesignElement>) => void;
  onAddAt: (tool: CreationTool, x: number, y: number) => void;
}

type DragState =
  | {
      mode: "move";
      id: string;
      startX: number;
      startY: number;
      origX: number;
      origY: number;
    }
  | {
      mode: "resize";
      id: string;
      startX: number;
      startY: number;
      origWidth: number;
      origHeight: number;
    };

/** The printable design area. Elements are absolutely positioned divs. */
export function DesignCanvas({
  width,
  height,
  elements,
  selectedId,
  tool,
  onSelect,
  onUpdate,
  onAddAt,
}: DesignCanvasProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dragRef = React.useRef<DragState | null>(null);

  const handleElementPointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    element: DesignElement
  ) => {
    if (tool !== "select") return;
    e.stopPropagation();
    onSelect(element.id);
    dragRef.current = {
      mode: "move",
      id: element.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: element.x,
      origY: element.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleResizeStart = (
    e: React.PointerEvent<HTMLDivElement>,
    element: DesignElement
  ) => {
    if (tool !== "select") return;
    e.stopPropagation();
    dragRef.current = {
      mode: "resize",
      id: element.id,
      startX: e.clientX,
      startY: e.clientY,
      origWidth: element.width,
      origHeight: element.height,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;

    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    if (drag.mode === "move") {
      onUpdate(drag.id, { x: drag.origX + dx, y: drag.origY + dy });
    } else {
      // Proportional resize: scale both dimensions by the largest relative
      // pointer delta, clamped to a sane minimum.
      const scale = Math.max(
        0.1,
        (drag.origWidth + dx) / drag.origWidth,
        (drag.origHeight + dy) / drag.origHeight
      );
      onUpdate(drag.id, {
        width: Math.max(8, drag.origWidth * scale),
        height: Math.max(8, drag.origHeight * scale),
      });
    }
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only background clicks land here (elements stop propagation).
    if (tool === "select") {
      onSelect(null);
      return;
    }
    if (tool === "upload") return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onAddAt(tool, x, y);
  };

  return (
    <div
      ref={containerRef}
      className="designer-grid relative shrink-0 overflow-hidden rounded-lg border border-border shadow-inner"
      style={{ width, height, touchAction: "none" }}
      onPointerDown={handleCanvasPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {/* Center guides */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px bg-primary/10" />
      <div className="pointer-events-none absolute left-0 top-1/2 h-px w-full bg-primary/10" />

      {elements.map((element, index) => (
        <DesignElementView
          key={element.id}
          element={element}
          zIndex={index}
          interactive
          selected={element.id === selectedId}
          onPointerDown={handleElementPointerDown}
          onResizeStart={handleResizeStart}
        />
      ))}

      {elements.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Your print area — {width} × {height}px
          </p>
          <p className={cn("max-w-[240px] text-xs text-muted-foreground/70")}>
            Pick a tool on the left to add text, shapes, or an image. Click and drag elements to
            move them.
          </p>
        </div>
      )}
    </div>
  );
}

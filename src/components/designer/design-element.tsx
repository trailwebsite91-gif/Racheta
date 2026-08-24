"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { DesignElement } from "./types";

interface DesignElementViewProps {
  element: DesignElement;
  /** Render scale (1 on the canvas, <1 in mockup previews). */
  scale?: number;
  zIndex?: number;
  selected?: boolean;
  interactive?: boolean;
  onPointerDown?: (e: React.PointerEvent<HTMLDivElement>, element: DesignElement) => void;
  onResizeStart?: (e: React.PointerEvent<HTMLDivElement>, element: DesignElement) => void;
}

/**
 * Renders a single design element as an absolutely-positioned div.
 * Shared by the design canvas (scale 1, interactive) and the mockup
 * preview (scaled down, pointer-events disabled).
 */
export function DesignElementView({
  element,
  scale = 1,
  zIndex = 0,
  selected = false,
  interactive = false,
  onPointerDown,
  onResizeStart,
}: DesignElementViewProps) {
  const style: React.CSSProperties = {
    left: element.x * scale,
    top: element.y * scale,
    width: element.width * scale,
    height: element.height * scale,
    transform: `rotate(${element.rotation}deg)`,
    opacity: element.opacity / 100,
    zIndex,
  };

  return (
    <div
      className={cn(
        "absolute overflow-hidden",
        interactive ? "cursor-move touch-none" : "pointer-events-none",
        selected && "ring-2 ring-primary ring-offset-1 ring-offset-background"
      )}
      style={style}
      onPointerDown={interactive ? (e) => onPointerDown?.(e, element) : undefined}
      role={interactive ? "button" : undefined}
      aria-label={interactive ? `Design element: ${element.type}` : undefined}
    >
      {element.type === "text" && (
        <div
          className="flex h-full w-full select-none items-center justify-center whitespace-pre-line text-center"
          style={{ color: element.color, fontSize: element.fontSize * scale }}
        >
          {element.content || " "}
        </div>
      )}

      {element.type === "shape" && element.shape === "rect" && (
        <div className="h-full w-full" style={{ backgroundColor: element.color, borderRadius: 4 }} />
      )}

      {element.type === "shape" && element.shape === "circle" && (
        <div className="h-full w-full rounded-full" style={{ backgroundColor: element.color }} />
      )}

      {element.type === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={element.content}
          alt=""
          draggable={false}
          className="pointer-events-none h-full w-full select-none object-contain"
        />
      )}

      {selected && interactive && (
        <div
          className="absolute -bottom-1.5 -right-1.5 h-3.5 w-3.5 cursor-nwse-resize touch-none rounded-[3px] border-2 border-background bg-primary shadow-sm"
          onPointerDown={(e) => onResizeStart?.(e, element)}
          aria-label="Resize element"
        />
      )}
    </div>
  );
}

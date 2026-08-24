"use client";

import * as React from "react";
import { MousePointer2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FONT_SIZES, PRESET_COLORS, type DesignElement } from "./types";

interface PropertiesPanelProps {
  element: DesignElement | null;
  onChange: (id: string, patch: Partial<DesignElement>) => void;
  onDelete: (id: string) => void;
}

function NumberField({
  label,
  value,
  onChange,
  min,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        type="number"
        value={Math.round(value)}
        min={min}
        step={step}
        onChange={(e) => {
          const next = Number.parseFloat(e.target.value);
          if (!Number.isNaN(next)) onChange(next);
        }}
        className="h-8"
      />
    </div>
  );
}

function SliderField({
  label,
  value,
  max,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <span className="text-xs font-medium tabular-nums text-foreground">
          {Math.round(value)}
          {max === 360 ? "°" : "%"}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number.parseFloat(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
        aria-label={label}
      />
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-10 shrink-0 cursor-pointer rounded border border-input bg-transparent p-0.5"
          aria-label={`${label} picker`}
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 font-mono text-xs"
          aria-label={`${label} hex`}
        />
      </div>
      <div className="flex flex-wrap gap-1.5 pt-0.5">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={cn(
              "h-5 w-5 rounded-full border border-black/10 transition-transform hover:scale-110",
              value.toLowerCase() === color.toLowerCase() &&
                "ring-2 ring-primary ring-offset-1 ring-offset-background"
            )}
            style={{ backgroundColor: color }}
            aria-label={`Use color ${color}`}
          />
        ))}
      </div>
    </div>
  );
}

/** Right-hand inspector: position, size, rotation, opacity, per-type options. */
export function PropertiesPanel({ element, onChange, onDelete }: PropertiesPanelProps) {
  if (!element) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-xl border bg-card p-6 text-center shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
          <MousePointer2 className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">Nothing selected</p>
        <p className="max-w-[200px] text-xs text-muted-foreground">
          Select an element on the canvas to edit its position, size, rotation and styling.
        </p>
      </div>
    );
  }

  const update = (patch: Partial<DesignElement>) => onChange(element.id, patch);
  const isText = element.type === "text";
  const isShape = element.type === "shape";

  return (
    <div className="space-y-4 rounded-xl border bg-card p-4 shadow-sm lg:h-fit">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold capitalize">{element.type}</h3>
          <p className="text-xs text-muted-foreground">
            {element.width.toFixed(0)} × {element.height.toFixed(0)}px
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
          {isText ? "Text" : isShape ? (element.shape === "circle" ? "Circle" : "Rectangle") : "Image"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <NumberField
          label="X"
          value={element.x}
          onChange={(x) => update({ x })}
        />
        <NumberField
          label="Y"
          value={element.y}
          onChange={(y) => update({ y })}
        />
        <NumberField
          label="W"
          value={element.width}
          min={8}
          onChange={(width) => update({ width: Math.max(8, width) })}
        />
        <NumberField
          label="H"
          value={element.height}
          min={8}
          onChange={(height) => update({ height: Math.max(8, height) })}
        />
      </div>

      <SliderField
        label="Rotation"
        value={element.rotation}
        max={360}
        onChange={(rotation) => update({ rotation })}
      />

      <SliderField
        label="Opacity"
        value={element.opacity}
        max={100}
        onChange={(opacity) => update({ opacity })}
      />

      {isText && (
        <>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Font size</Label>
            <Select
              value={String(element.fontSize)}
              onValueChange={(v) => update({ fontSize: Number.parseInt(v, 10) })}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Font size" />
              </SelectTrigger>
              <SelectContent>
                {FONT_SIZES.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}px
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ColorField
            label="Text color"
            value={element.color}
            onChange={(color) => update({ color })}
          />

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Content</Label>
            <Textarea
              value={element.content}
              onChange={(e) => update({ content: e.target.value })}
              className="min-h-[72px] text-xs"
              placeholder="Type your text…"
            />
          </div>
        </>
      )}

      {isShape && (
        <ColorField
          label="Fill color"
          value={element.color}
          onChange={(color) => update({ color })}
        />
      )}

      {element.type === "image" && (
        <div className="rounded-lg border border-dashed border-border p-3 text-center">
          <p className="text-xs text-muted-foreground">Image uploaded. Drag to position, use the handle to resize.</p>
        </div>
      )}

      <Button
        variant="destructive"
        size="sm"
        className="w-full"
        onClick={() => onDelete(element.id)}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete element
      </Button>
    </div>
  );
}

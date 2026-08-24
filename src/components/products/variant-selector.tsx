"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type VariantType = "color" | "size";

interface VariantSelectorProps {
  type: VariantType;
  options: { name: string; hex?: string }[];
  selected: string | null;
  onSelect: (value: string) => void;
}

export function VariantSelector({
  type,
  options,
  selected,
  onSelect,
}: VariantSelectorProps) {
  if (type === "color") {
    return (
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => {
          const isSelected = selected === opt.name;
          return (
            <button
              key={opt.name}
              type="button"
              onClick={() => onSelect(opt.name)}
              className={cn(
                "relative flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all",
                isSelected
                  ? "border-primary ring-2 ring-primary/20 scale-110"
                  : "border-transparent hover:border-muted-foreground/30"
              )}
              title={opt.name}
              aria-label={`Color: ${opt.name}`}
            >
              <span
                className={cn(
                  "inline-block h-7 w-7 rounded-full border border-black/10 shadow-sm",
                  opt.name === "White" && "border-gray-300"
                )}
                style={{ backgroundColor: opt.hex ?? "transparent" }}
              />
              {isSelected && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                  <Check className="h-2.5 w-2.5 text-primary-foreground" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Size buttons
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isSelected = selected === opt.name;
        return (
          <button
            key={opt.name}
            type="button"
            onClick={() => onSelect(opt.name)}
            className={cn(
              "min-w-[3rem] rounded-lg border px-3 py-2 text-sm font-medium transition-all",
              isSelected
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted/50"
            )}
            aria-label={`Size: ${opt.name}`}
          >
            {opt.name}
          </button>
        );
      })}
    </div>
  );
}

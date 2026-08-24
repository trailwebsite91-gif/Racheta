"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
}

export function Logo({ className, size = 32, showWordmark = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        whileHover={{ rotate: -5, scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Outer hexagon frame */}
        <path
          d="M20 2L36 10.5V28.5L20 37L4 28.5V10.5L20 2Z"
          className="fill-primary/10 stroke-primary"
          strokeWidth="1.5"
        />
        {/* Inner geometric "S" mark */}
        <path
          d="M14 14L20 10L26 14V20L20 24L14 20V14Z"
          className="fill-primary/20 stroke-primary"
          strokeWidth="1.2"
        />
        {/* Center accent dot */}
        <circle cx="20" cy="17" r="2.5" className="fill-accent" />
      </motion.svg>

      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span className="text-sm font-bold tracking-tight text-foreground sm:text-base">
            SmartPrint
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground sm:text-xs">
            Studio
          </span>
        </div>
      )}
    </div>
  );
}

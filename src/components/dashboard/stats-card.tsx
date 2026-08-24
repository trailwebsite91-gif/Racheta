"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { fadeInUp, staggerDelay } from "@/styles/animations";

interface StatsCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  subtext?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  delay?: number;
  format?: "currency" | "number" | "plain";
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  subtext,
  trend,
  delay = 0,
}: StatsCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [displayValue, setDisplayValue] = useState("0");
  const animRef = useRef<number | null>(null);
  const targetRef = useRef(value);

  const parseNumericValue = (v: string): number => {
    // Extract numeric value from formatted string like "₹1,24,500" -> 124500
    const cleaned = v.replace(/[^0-9.]/g, "");
    return parseFloat(cleaned) || 0;
  };

  useEffect(() => {
    targetRef.current = value;
    const targetNum = parseNumericValue(value);

    if (!animRef.current) {
      let current = 0;
      const duration = 800;
      const startTime = performance.now();

      const animate = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        current = Math.floor(targetNum * eased);

        // Format display appropriately
        if (value.startsWith("₹")) {
          setDisplayValue(formatIndianCurrency(current));
        } else if (value.includes(",")) {
          setDisplayValue(current.toLocaleString("en-IN"));
        } else {
          setDisplayValue(String(current));
        }

        if (progress < 1) {
          animRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayValue(value);
        }
      };

      animRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      }
    };
  }, [value]);

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      transition={staggerDelay(delay)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={cn(
          "relative overflow-hidden border transition-all duration-300",
          isHovered
            ? "border-primary/30 shadow-lg shadow-primary/5 scale-[1.02]"
            : "hover:border-border/80"
        )}
      >
        {/* Background gradient glow on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        <div className="relative p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {label}
              </p>
              <motion.p
                className="text-2xl font-bold tracking-tight"
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {displayValue}
              </motion.p>
              {subtext && (
                <p className="text-xs text-muted-foreground">{subtext}</p>
              )}
            </div>
            <motion.div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                "bg-primary/10 text-primary"
              )}
              whileHover={{ rotate: -10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Icon className="h-5 w-5" />
            </motion.div>
          </div>

          {trend && (
            <div className="mt-3 flex items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
                  trend.positive
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                )}
              >
                {trend.positive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {trend.value}
              </span>
              <span className="text-[10px] text-muted-foreground">
                vs last month
              </span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function formatIndianCurrency(num: number): string {
  const x = Math.floor(num);
  const lastThree = x % 1000;
  const other = Math.floor(x / 1000);
  const otherFormatted = other > 0
    ? other.toLocaleString("en-IN", { maximumFractionDigits: 0 })
    : "";
  const prefix = "₹";
  if (other === 0) return prefix + lastThree;
  return prefix + otherFormatted + "," + String(lastThree).padStart(3, "0");
}

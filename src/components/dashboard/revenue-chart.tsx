"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Generate 30 days of mock revenue data
function generateRevenueData() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const data: { label: string; value: number; date: string }[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayName = days[d.getDay() === 0 ? 6 : d.getDay() - 1]; // Adjust Sun/Mon
    const dateStr = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    // Generate realistic-looking revenue between 1500 and 8500
    const base = 3000;
    const variance = Math.sin(i * 0.3) * 2000 + Math.random() * 3000;
    data.push({
      label: dayName,
      value: Math.round(base + variance),
      date: dateStr,
    });
  }
  return data;
}

const revenueData = generateRevenueData();
const maxRevenue = Math.max(...revenueData.map((d) => d.value));

export function RevenueChart() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const totalRevenue = revenueData.reduce((sum, d) => sum + d.value, 0);

  const displayedData = useMemo(() => revenueData, []);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold">
            Revenue (30 Days)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Total: ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
            Daily Revenue
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-[220px]">
          {/* Bar chart */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-[2px] px-1">
            {displayedData.map((item, idx) => {
              const heightPct = (item.value / maxRevenue) * 100;
              const isSelected = selectedIndex === idx;
              const showLabel = idx % 5 === 0;

              return (
                <motion.div
                  key={idx}
                  className="group relative flex flex-1 cursor-pointer flex-col items-center justify-end"
                  onHoverStart={() => setSelectedIndex(idx)}
                  onHoverEnd={() => setSelectedIndex(null)}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{
                    delay: idx * 0.02,
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                  style={{ originY: 1 }}
                >
                  {/* Tooltip */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-9 z-10 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-[11px] font-medium text-background shadow-lg"
                    >
                      ₹{item.value.toLocaleString("en-IN")}
                      <br />
                      <span className="opacity-70">{item.date}</span>
                      {/* Arrow */}
                      <div className="absolute left-1/2 top-full -translate-x-1/2 border-[4px] border-transparent border-t-foreground" />
                    </motion.div>
                  )}

                  {/* Bar */}
                  <motion.div
                    className={cn(
                      "w-full rounded-t-[3px] transition-colors duration-150",
                      isSelected
                        ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.4)]"
                        : "bg-primary/70 group-hover:bg-primary/85"
                    )}
                    style={{ height: `${Math.max(heightPct, 3)}%` }}
                    animate={{
                      height: `${Math.max(heightPct, 3)}%`,
                    }}
                  />

                  {/* Day label */}
                  {showLabel && (
                    <span className="mt-2 text-[10px] font-medium text-muted-foreground">
                      {item.date.split(" ")[0]}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Y-axis grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between py-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="border-t border-border/40"
                style={{ height: 0 }}
              />
            ))}
          </div>

          {/* Y-axis labels */}
          <div className="absolute -left-1 top-1 flex h-full flex-col justify-between pb-6 text-[10px] text-muted-foreground">
            <span>₹{Math.round(maxRevenue).toLocaleString("en-IN")}</span>
            <span>₹{Math.round(maxRevenue * 0.66).toLocaleString("en-IN")}</span>
            <span>₹{Math.round(maxRevenue * 0.33).toLocaleString("en-IN")}</span>
            <span>₹0</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

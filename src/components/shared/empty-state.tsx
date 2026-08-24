"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { fadeInUp } from "@/styles/animations";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className
      )}
    >
      {Icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-8 w-8" />
        </div>
      )}
      <h3 className="mt-6 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {actionLabel && (actionHref || onAction) && (
        <div className="mt-6">
          <Button
            variant={actionHref ? "default" : "outline"}
            asChild={!!actionHref}
            onClick={onAction}
          >
            {actionHref ? (
              <a href={actionHref}>{actionLabel}</a>
            ) : (
              actionLabel
            )}
          </Button>
        </div>
      )}
    </motion.div>
  );
}

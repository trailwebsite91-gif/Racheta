"use client";

import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/styles/animations";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  heading: string;
  subheading?: string;
  items: FaqItem[];
}

/* Lightweight accordion using native details/summary — no extra radix dep needed */
export function FaqSection({ heading, subheading, items }: FaqSectionProps) {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-heading-2">{heading}</h2>
          {subheading && (
            <p className="mt-4 text-body-lg">{subheading}</p>
          )}
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-12 space-y-3"
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="group rounded-xl border border-border/50 bg-card transition-all duration-200 hover:border-primary/20"
            >
              <details className="group/details">
                <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 font-medium text-foreground list-none [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span className="shrink-0 text-muted-foreground transition-transform duration-200 group-open/details:rotate-180">
                    <Plus className="h-4 w-4 group-open/details:hidden" />
                    <Minus className="hidden h-4 w-4 group-open/details:block" />
                  </span>
                </summary>
                <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </div>
              </details>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

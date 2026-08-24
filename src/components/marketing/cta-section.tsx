"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeInUp } from "@/styles/animations";

interface CtaSectionProps {
  icon?: "sparkles" | "none";
  heading: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export function CtaSection({
  icon = "sparkles",
  heading,
  description,
  primaryCta,
  secondaryCta,
}: CtaSectionProps) {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/5 p-10 text-center shadow-xl sm:p-16"
        >
          {/* Background glass effect */}
          <div className="absolute inset-0 glass" />

          <div className="relative">
            {icon === "sparkles" && (
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary"
              >
                <Sparkles className="h-7 w-7" />
              </motion.div>
            )}

            <h2 className="mt-6 text-heading-2">{heading}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-body-lg">{description}</p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="xl" className="group" asChild>
                <Link href={primaryCta.href}>
                  {primaryCta.label}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              {secondaryCta && (
                <Button size="xl" variant="outline" asChild>
                  <Link href={secondaryCta.href}>
                    {secondaryCta.label}
                  </Link>
                </Button>
              )}
            </div>

            <p className="mt-5 text-sm text-muted-foreground">
              No credit card required. Free plan available.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

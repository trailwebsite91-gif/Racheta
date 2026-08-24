"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { heroAnimation, heroItem, fadeIn } from "@/styles/animations";

interface HeroSectionProps {
  badge?: string;
  headline: string;
  highlightedWord?: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export function HeroSection({
  badge,
  headline,
  highlightedWord,
  subtitle,
  primaryCta,
  secondaryCta,
}: HeroSectionProps) {
  const parts = highlightedWord
    ? headline.split(highlightedWord)
    : [headline];

  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-primary/8 blur-3xl" />
      <div className="absolute top-1/3 right-0 h-[400px] w-[500px] rounded-full bg-accent/5 blur-3xl" />

      <motion.div
        variants={heroAnimation}
        initial="hidden"
        animate="visible"
        className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8"
      >
        {badge && (
          <motion.div variants={heroItem}>
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-1.5 text-sm font-medium"
            >
              {badge}
            </Badge>
          </motion.div>
        )}

        <motion.h1
          variants={heroItem}
          className="text-display"
        >
          {highlightedWord ? (
            <>
              {parts[0]}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent animate-gradient">
                {highlightedWord}
              </span>
              {parts[1]}
            </>
          ) : (
            headline
          )}
        </motion.h1>

        <motion.p
          variants={heroItem}
          className="mx-auto mt-6 max-w-2xl text-body-lg sm:text-xl"
        >
          {subtitle}
        </motion.p>

        <motion.div
          variants={heroItem}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Button size="xl" className="group" asChild>
            <Link href={primaryCta.href}>
              {primaryCta.label}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          {secondaryCta && (
            <Button size="xl" variant="outline" asChild>
              <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          )}
        </motion.div>

        <motion.p
          variants={heroItem}
          className="mt-5 text-sm text-muted-foreground"
        >
          No credit card required. 14-day free trial on Pro plan.
        </motion.p>

        {/* Mockup placeholder */}
        <motion.div
          variants={fadeIn}
          className="mx-auto mt-14 max-w-4xl"
        >
          <div className="relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-primary/5 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10" />
            <div className="flex items-center gap-1.5 border-b border-border/50 bg-muted/30 px-4 py-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
              <span className="ml-3 text-[11px] text-muted-foreground">
                SmartPrint Studio — Dashboard
              </span>
            </div>
            <div className="aspect-video p-6 sm:p-10">
              <div className="grid h-full grid-cols-3 gap-4">
                <div className="col-span-2 rounded-lg bg-muted/50 p-4">
                  <div className="h-3 w-24 rounded-full bg-primary/20" />
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-lg bg-card/80 border border-border/30 flex items-center justify-center"
                      >
                        <div className="h-8 w-8 rounded-full bg-primary/10" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                  <div className="h-3 w-16 rounded-full bg-accent/30" />
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-8 rounded-md bg-card/80 border border-border/30"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

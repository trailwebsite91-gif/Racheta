"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { staggerContainer, staggerItem, fadeIn } from "@/styles/animations";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar?: string;
  rating?: number;
}

interface TestimonialsProps {
  badge?: string;
  heading: string;
  subheading?: string;
  testimonials: Testimonial[];
}

export function Testimonials({
  badge,
  heading,
  subheading,
  testimonials,
}: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isCarousel = testimonials.length > 3;

  const next = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );

  return (
    <section className="py-20 sm:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          {badge && (
            <Badge variant="secondary" className="mb-4">
              {badge}
            </Badge>
          )}
          <h2 className="text-heading-2">{heading}</h2>
          {subheading && (
            <p className="mt-4 text-body-lg">{subheading}</p>
          )}
        </motion.div>

        {isCarousel ? (
          <div className="mt-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="mx-auto max-w-2xl"
              >
                <div className="relative rounded-2xl border border-border/50 bg-card p-8 sm:p-10 glass-card">
                  <Quote className="absolute right-6 top-6 h-10 w-10 text-primary/10" />
                  <p className="text-lg leading-relaxed text-foreground">
                    &ldquo;{testimonials[activeIndex].quote}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-4 border-t border-border/50 pt-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {testimonials[activeIndex].author[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {testimonials[activeIndex].author}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {testimonials[activeIndex].role}
                      </p>
                    </div>
                    {testimonials[activeIndex].rating && (
                      <div className="ml-auto flex gap-0.5">
                        {Array.from({
                          length: testimonials[activeIndex].rating,
                        }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-accent text-accent"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex justify-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={prev}
                className="rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      i === activeIndex
                        ? "w-8 bg-primary"
                        : "w-2 bg-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={next}
                className="rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.author}
                variants={staggerItem}
                className="glass-card flex flex-col justify-between rounded-xl p-6"
              >
                <div>
                  {t.rating && (
                    <div className="mb-3 flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-accent text-accent"
                        />
                      ))}
                    </div>
                  )}
                  <p className="text-sm leading-relaxed text-foreground">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-5 flex items-center gap-3 border-t border-border/50 pt-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {t.author[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {t.author}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

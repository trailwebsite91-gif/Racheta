"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Check, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { fadeInUp } from "@/styles/animations";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

interface NewsletterFormProps {
  heading?: string;
  description?: string;
  className?: string;
  variant?: "default" | "compact";
}

export function NewsletterForm({
  heading = "Stay in the loop",
  description = "Get product updates, POD tips, and early access to new features.",
  className,
  variant = "default",
}: NewsletterFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (_data: NewsletterFormData) => {
    setStatus("loading");
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setStatus("success");
    reset();
    setTimeout(() => setStatus("idle"), 4000);
  };

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className={cn("w-full max-w-md", className)}>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              className="pl-9"
              disabled={status === "loading" || status === "success"}
            />
          </div>
          <Button
            type="submit"
            size="default"
            disabled={status === "loading" || status === "success"}
            className="shrink-0"
          >
            {status === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : status === "success" ? (
              <Check className="h-4 w-4" />
            ) : (
              "Subscribe"
            )}
          </Button>
        </div>
        {errors.email && (
          <p className="mt-1.5 text-xs text-destructive">{errors.email.message}</p>
        )}
        {status === "success" && (
          <p className="mt-1.5 text-xs text-emerald-500">Thanks for subscribing!</p>
        )}
      </form>
    );
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={cn(
        "mx-auto max-w-lg rounded-2xl border border-border/50 bg-card p-8 text-center",
        className
      )}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Mail className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{heading}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className="flex-1"
            disabled={status === "loading" || status === "success"}
          />
          <Button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="group shrink-0"
          >
            {status === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : status === "success" ? (
              <>
                <Check className="h-4 w-4" />
                Subscribed
              </>
            ) : (
              <>
                Subscribe
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
        </div>
        {errors.email && (
          <p className="mt-2 text-xs text-destructive text-left">
            {errors.email.message}
          </p>
        )}
        {status === "success" && (
          <p className="mt-2 text-xs font-medium text-emerald-500">
            🎉 You&apos;re in! Check your inbox for a confirmation email.
          </p>
        )}
      </form>

      <p className="mt-4 text-[11px] text-muted-foreground">
        No spam, unsubscribe anytime. Read our{" "}
        <a href="/privacy-policy" className="underline hover:text-foreground">
          privacy policy
        </a>
        .
      </p>
    </motion.div>
  );
}

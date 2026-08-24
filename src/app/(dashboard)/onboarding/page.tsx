"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Store,
  Globe,
  Check,
  ArrowRight,
  Loader2,
  Sparkles,
  Link as LinkIcon,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, slugify } from "@/lib/utils";

// ── Validation schema ──────────────────────────────────────────────────────────

const onboardingSchema = z.object({
  storeName: z
    .string()
    .min(2, "Store name must be at least 2 characters")
    .max(50, "Store name must be under 50 characters"),
  storeSlug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(30, "Slug must be under 30 characters")
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  country: z.enum(["india", "global", "both"], {
    required_error: "Please select your country/market",
  }),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

// ── Steps ─────────────────────────────────────────────────────────────────────

const steps = [
  { id: "store", label: "Store Details", icon: Store },
  { id: "market", label: "Market", icon: Globe },
  { id: "review", label: "Review", icon: CheckCircle2 },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      storeName: "",
      storeSlug: "",
      country: "global",
      acceptTerms: false as unknown as true,
    },
    mode: "onChange",
  });

  const { register, handleSubmit, watch, setValue, formState: { errors, isValid } } = form;
  const storeName = watch("storeName");

  // Auto-generate slug from store name
  const handleStoreNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.value;
      setValue("storeName", name);
      const currentSlug = form.getValues("storeSlug");
      // Only auto-fill slug if it hasn't been manually edited
      if (!currentSlug || currentSlug === slugify(form.getValues("storeName"))) {
        setValue("storeSlug", slugify(name));
      }
    },
    [setValue, form]
  );

  const onNext = () => {
    if (currentStep === 0) {
      // Validate store fields
      const nameValid = storeName.length >= 2;
      const slugValid = /^[a-z0-9-]+$/.test(form.getValues("storeSlug")) &&
        form.getValues("storeSlug").length >= 3;
      if (!nameValid || !slugValid) {
        form.trigger(["storeName", "storeSlug"]);
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const onBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);
    try {
      // Update Clerk user metadata with role and store info
      const metadataRes = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "seller",
          storeName: data.storeName,
          storeSlug: data.storeSlug,
          country: data.country,
        }),
      });

      if (!metadataRes.ok) {
        const err = await metadataRes.json();
        throw new Error(err.error || "Failed to update user metadata");
      }

      // Create seller record
      const sellerRes = await fetch("/api/sellers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName: data.storeName,
          storeSlug: data.storeSlug,
          country: data.country === "india" ? "IN" : data.country === "global" ? "US" : "US",
          region: data.country,
        }),
      });

      if (!sellerRes.ok) {
        const err = await sellerRes.json();
        throw new Error(err.error || "Failed to create seller profile");
      }

      toast.success("Your store is ready! 🎉", {
        description: "Welcome to SmartPrint Studio. Start creating!",
      });

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const StepIcon = steps[currentStep].icon;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-heading-3">Set up your store</h1>
          <p className="mt-2 text-body-sm">
            Complete your profile to start selling on SmartPrint Studio
          </p>
        </div>

        {/* Step indicators */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => idx < currentStep && setCurrentStep(idx)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-all",
                  idx < currentStep
                    ? "bg-primary text-primary-foreground cursor-pointer"
                    : idx === currentStep
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {idx < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <step.icon className="h-4 w-4" />
                )}
              </button>
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-8 rounded-full",
                    idx < currentStep ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form card */}
        <Card className="glass-card border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <StepIcon className="h-5 w-5 text-primary" />
              {steps[currentStep].label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 0: Store Details */}
              {currentStep === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name *</Label>
                    <Input
                      id="storeName"
                      placeholder="My Awesome Store"
                      className="h-11"
                      {...register("storeName")}
                      onChange={handleStoreNameChange}
                    />
                    {errors.storeName && (
                      <p className="text-sm text-destructive">{errors.storeName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storeSlug" className="flex items-center gap-1.5">
                      Store URL *
                      <LinkIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    </Label>
                    <div className="flex items-center rounded-lg border border-input bg-background">
                      <span className="pl-3 text-sm text-muted-foreground">
                        smartprint.studio/
                      </span>
                      <Input
                        id="storeSlug"
                        placeholder="my-store"
                        className="h-11 border-0 pl-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...register("storeSlug")}
                        onChange={(e) => {
                          const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
                          setValue("storeSlug", slug, { shouldValidate: true });
                        }}
                      />
                    </div>
                    {errors.storeSlug && (
                      <p className="text-sm text-destructive">{errors.storeSlug.message}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 1: Market */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label htmlFor="country">Where do you want to sell? *</Label>
                    <Select
                      onValueChange={(value: "india" | "global" | "both") =>
                        setValue("country", value, { shouldValidate: true })
                      }
                      defaultValue="global"
                    >
                      <SelectTrigger id="country" className="h-11">
                        <SelectValue placeholder="Select market" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="india">
                          🇮🇳 India (Qikink, Printrove, Blinkstore)
                        </SelectItem>
                        <SelectItem value="global">
                          🌍 Global (Printful, Printify, Gelato)
                        </SelectItem>
                        <SelectItem value="both">
                          🌐 Both — India + Global
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.country && (
                      <p className="text-sm text-destructive">{errors.country.message}</p>
                    )}
                  </div>

                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-sm text-muted-foreground">
                      You can always change this later and add more suppliers from
                      your dashboard settings.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Review & Accept */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-5"
                >
                  <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Store name</span>
                      <span className="font-medium">{storeName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Store URL</span>
                      <span className="font-medium">
                        smartprint.studio/{form.getValues("storeSlug")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Market</span>
                      <span className="font-medium capitalize">
                        {form.getValues("country")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="acceptTerms"
                      className="mt-1"
                      onCheckedChange={(checked) =>
                        setValue("acceptTerms", checked as true, { shouldValidate: true })
                      }
                    />
                    <div className="grid gap-1">
                      <Label htmlFor="acceptTerms" className="text-sm font-normal leading-relaxed">
                        I agree to the{" "}
                        <a href="/terms" className="font-medium text-primary hover:underline">
                          Terms of Service
                        </a>
                        ,{" "}
                        <a href="/privacy" className="font-medium text-primary hover:underline">
                          Privacy Policy
                        </a>
                        , and acknowledge that I am responsible for the content I upload and sell
                        on SmartPrint Studio.
                      </Label>
                      {errors.acceptTerms && (
                        <p className="text-sm text-destructive">
                          {errors.acceptTerms.message}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4">
                {currentStep > 0 ? (
                  <Button type="button" variant="outline" onClick={onBack}>
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={onNext} className="gap-2">
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating store...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Complete Setup
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

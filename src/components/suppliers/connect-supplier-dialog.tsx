"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Plug, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  suppliers,
  regionLabel,
  type Supplier,
} from "@/lib/mock-suppliers";

const connectSchema = z.object({
  supplierSlug: z.string().min(1, "Please choose a supplier."),
  apiKey: z
    .string()
    .min(8, "API key must be at least 8 characters.")
    .regex(/^[A-Za-z0-9_\-]+$/, "API key can only contain letters, numbers, _ and -."),
});

type ConnectForm = z.infer<typeof connectSchema>;

interface ConnectSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultSupplierSlug?: string;
  onConnected?: (slug: string) => void;
}

export function ConnectSupplierDialog({
  open,
  onOpenChange,
  defaultSupplierSlug,
  onConnected,
}: ConnectSupplierDialogProps) {
  const [showKey, setShowKey] = React.useState(false);
  const [testing, setTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState<
    "idle" | "testing" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ConnectForm>({
    resolver: zodResolver(connectSchema),
    defaultValues: { supplierSlug: defaultSupplierSlug ?? "", apiKey: "" },
  });

  const selectedSlug = watch("supplierSlug");
  const selected = suppliers.find((s) => s.slug === selectedSlug);

  React.useEffect(() => {
    if (open) {
      setTestResult("idle");
      setTesting(false);
      reset({ supplierSlug: defaultSupplierSlug ?? "", apiKey: "" });
      if (defaultSupplierSlug) setValue("supplierSlug", defaultSupplierSlug);
    }
  }, [open, defaultSupplierSlug, reset, setValue]);

  const handleTest = () => {
    setTestResult("testing");
    setTesting(true);
    // Simulate an API probe with a small artificial delay.
    window.setTimeout(() => {
      setTesting(false);
      setTestResult("success");
    }, 1400);
  };

  const onSubmit = (data: ConnectForm) => {
    const supplier = suppliers.find((s) => s.slug === data.supplierSlug);
    toast.success(`${supplier?.name ?? "Supplier"} connected successfully.`, {
      description: "Products and shipping rates have been imported.",
    });
    onConnected?.(data.supplierSlug);
    onOpenChange(false);
    setTestResult("idle");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Plug className="h-4 w-4" />
            </span>
            Connect Supplier
          </DialogTitle>
          <DialogDescription>
            Link a POD supplier to start importing products and syncing orders.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label>Supplier</Label>
            <Select
              value={selectedSlug || undefined}
              onValueChange={(v) => setValue("supplierSlug", v, { shouldValidate: true })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((s) => (
                  <SelectItem key={s.id} value={s.slug}>
                    <span className="flex items-center gap-2">
                      <span>{s.name}</span>
                      <span className="text-xs text-muted-foreground">
                        · {regionLabel(s.region)}
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.supplierSlug && (
              <p className="text-sm text-destructive">{errors.supplierSlug.message}</p>
            )}
          </div>

          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2"
            >
              <span className="text-sm">{selected.name}</span>
              <Badge variant={selected.region === "india" ? "warning" : "secondary"}>
                {regionLabel(selected.region)}
              </Badge>
            </motion.div>
          )}

          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showKey ? "text" : "password"}
                placeholder="sk_live_••••••••••••••••"
                className="pr-10"
                {...register("apiKey")}
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showKey ? "Hide API key" : "Show API key"}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.apiKey && (
              <p className="text-sm text-destructive">{errors.apiKey.message}</p>
            )}
          </div>

          <AnimatePresence mode="wait">
            {testResult !== "idle" && (
              <motion.div
                key={testResult}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                    testResult === "testing"
                      ? "bg-muted text-muted-foreground"
                      : "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200"
                  }`}
                >
                  {testResult === "testing" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Testing credentials…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" /> Connection successful — credentials valid.
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <DialogFooter className="gap-2 sm:justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={testing}
              onClick={handleTest}
            >
              {testing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : testResult === "success" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              Test Connection
            </Button>
            <Button type="submit" disabled={testing}>
              <Plug className="h-4 w-4" /> Connect
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Globe,
  RefreshCw,
  Unplug,
  Boxes,
  Cable,
  Truck,
  BarChart3,
  Loader2,
  CheckCircle2,
  TrendingUp,
  Timer,
  AlertTriangle,
  ExternalLink,
  KeyRound,
} from "lucide-react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { regionLabel, type Supplier } from "@/lib/mock-suppliers";

interface SupplierDetailProps {
  supplier: Supplier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDisconnect: (slug: string) => void;
}

export function SupplierDetailSheet({
  supplier,
  open,
  onOpenChange,
  onDisconnect,
}: SupplierDetailProps) {
  const [syncing, setSyncing] = React.useState(false);

  if (!supplier) return null;

  const handleSync = () => {
    setSyncing(true);
    window.setTimeout(() => {
      setSyncing(false);
      toast.success(`Synced ${supplier.name}`, {
        description: "Catalog, pricing and shipping rates are up to date.",
      });
    }, 1500);
  };

  const handleDisconnect = () => {
    onDisconnect(supplier.slug);
    onOpenChange(false);
    toast.info(`${supplier.name} disconnected.`);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full border-sidebar-border p-0 sm:max-w-md"
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="space-y-4 p-6 pb-4">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-lg font-bold text-white shadow-lg ${supplier.color}`}
              >
                {supplier.logoInitials}
              </div>
              <div className="min-w-0 flex-1 pr-8">
                <SheetTitle className="flex items-center gap-2 text-lg">
                  {supplier.name}
                </SheetTitle>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant={supplier.region === "india" ? "warning" : "secondary"}>
                    {regionLabel(supplier.region)}
                  </Badge>
                  <Badge variant={supplier.status === "connected" ? "success" : "secondary"}>
                    {supplier.status === "connected" ? "Connected" : "Not Connected"}
                  </Badge>
                  <a
                    href={supplier.baseUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5" /> Website
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
            <Separator />
          </SheetHeader>

          <Tabs defaultValue="catalog" className="flex min-h-0 flex-1 flex-col">
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="catalog">
                  <Boxes className="h-4 w-4" />
                  <span className="ml-1">Catalog</span>
                </TabsTrigger>
                <TabsTrigger value="connection">
                  <Cable className="h-4 w-4" />
                  <span className="ml-1">Connect</span>
                </TabsTrigger>
                <TabsTrigger value="shipping">
                  <Truck className="h-4 w-4" />
                  <span className="ml-1">Shipping</span>
                </TabsTrigger>
                <TabsTrigger value="analytics">
                  <BarChart3 className="h-4 w-4" />
                  <span className="ml-1">Stats</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-6 pt-4">
              <TabsContent value="catalog" className="m-0">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Product Catalog</h3>
                    <Badge variant="secondary">
                      {supplier.products.length} products
                    </Badge>
                  </div>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Days</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {supplier.products.map((p) => (
                          <TableRow key={p.name}>
                            <TableCell className="font-medium">{p.name}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {p.category}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(p.price)}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                              {p.productionDays}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="connection" className="m-0">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <KeyRound className="h-4 w-4 text-muted-foreground" /> API Key
                      </span>
                      <Badge
                        variant={
                          supplier.apiKeyStatus === "configured" ? "success" : "secondary"
                        }
                      >
                        {supplier.apiKeyStatus === "configured" ? "Configured" : "Missing"}
                      </Badge>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">Webhook URL</span>
                      <code className="max-w-[60%] truncate rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                        {supplier.webhookUrl}
                      </code>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Last synced {supplier.lastSynced}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={handleSync}
                      disabled={syncing}
                    >
                      {syncing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      Sync Now
                    </Button>
                    <Button variant="destructive" onClick={handleDisconnect}>
                      <Unplug className="h-4 w-4" /> Disconnect
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="shipping" className="m-0">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <h3 className="mb-2 text-sm font-semibold">Shipping Rates</h3>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Region</TableHead>
                          <TableHead className="text-right">Est. Days</TableHead>
                          <TableHead className="text-right">Cost</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {supplier.shipping.map((s) => (
                          <TableRow key={s.region}>
                            <TableCell className="font-medium">{s.region}</TableCell>
                            <TableCell className="text-right text-muted-foreground">
                              {s.days}
                            </TableCell>
                            <TableCell className="text-right">
                              {s.cost === 0 ? "Free" : formatCurrency(s.cost)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="analytics" className="m-0">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border bg-muted/40 p-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <TrendingUp className="h-4 w-4" /> Order Volume
                      </div>
                      <p className="mt-2 text-2xl font-bold">
                        {supplier.orderVolume.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-lg border bg-muted/40 p-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Timer className="h-4 w-4" /> Avg Fulfillment
                      </div>
                      <p className="mt-2 text-2xl font-bold">
                        {supplier.avgFulfillmentTime
                          ? `${supplier.avgFulfillmentTime} days`
                          : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/40">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      Issue Rate
                    </div>
                    <span className="text-lg font-bold">
                      {supplier.issueRate ? `${supplier.issueRate}%` : "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <span className="text-sm text-muted-foreground">Countries served</span>
                    <span className="flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {supplier.countriesServed}
                    </span>
                  </div>
                </motion.div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}

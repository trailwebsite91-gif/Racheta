"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Globe,
  Package,
  Timer,
  MapPin,
  CheckCircle2,
  Circle,
  ExternalLink,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/styles/animations";
import { suppliers, regionLabel, type Supplier } from "@/lib/mock-suppliers";
import { ConnectSupplierDialog } from "@/components/suppliers/connect-supplier-dialog";
import { SupplierDetailSheet } from "@/components/suppliers/supplier-detail";

interface StatTileProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatTile({ icon, label, value }: StatTileProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-muted/40 px-3 py-2.5">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function SupplierCard({
  supplier,
  index,
  onConnect,
  onManage,
}: {
  supplier: Supplier;
  index: number;
  onConnect: (slug: string) => void;
  onManage: (slug: string) => void;
}) {
  const connected = supplier.status === "connected";
  const avgDays =
    supplier.products.length > 0
      ? Math.round(
          (supplier.products.reduce((sum, p) => sum + p.productionDays, 0) /
            supplier.products.length) *
            10
        ) / 10
      : 0;

  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.08 }}
    >
      <Card className="group relative h-full overflow-hidden border-border/60 bg-card/70 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
        <CardContent className="flex h-full flex-col p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-base font-bold text-white shadow-md ${supplier.color}`}
              >
                {supplier.logoInitials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold">{supplier.name}</h3>
                </div>
                <a
                  href={supplier.baseUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  View site
                </a>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <Badge variant={supplier.region === "india" ? "warning" : "secondary"}>
                {regionLabel(supplier.region)}
              </Badge>
              <Badge variant={connected ? "success" : "secondary"} className="gap-1">
                {connected ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <Circle className="h-3 w-3" />
                )}
                {connected ? "Connected" : "Not Connected"}
              </Badge>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2">
            <StatTile
              icon={<Package className="h-4 w-4" />}
              label="Products available"
              value={String(supplier.products.length)}
            />
            <StatTile
              icon={<Timer className="h-4 w-4" />}
              label="Avg production"
              value={avgDays ? `${avgDays} days` : "—"}
            />
            <StatTile
              icon={<MapPin className="h-4 w-4" />}
              label="Countries served"
              value={String(supplier.countriesServed)}
            />
          </div>

          <div className="mt-auto pt-4">
            <Button
              className="w-full"
              variant={connected ? "outline" : "default"}
              onClick={() => (connected ? onManage(supplier.slug) : onConnect(supplier.slug))}
            >
              {connected ? (
                <>
                  <Globe className="h-4 w-4" /> Manage
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Connect
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function SupplierManager() {
  const [connectOpen, setConnectOpen] = React.useState(false);
  const [detailSupplier, setDetailSupplier] = React.useState<Supplier | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [list, setList] = React.useState<Supplier[]>(suppliers);

  const handleConnected = (slug: string) => {
    setList((prev) =>
      prev.map((s) =>
        s.slug === slug
          ? { ...s, status: "connected", apiKeyStatus: "configured" as const }
          : s
      )
    );
  };

  const handleDisconnect = (slug: string) => {
    setList((prev) =>
      prev.map((s) =>
        s.slug === slug
          ? {
              ...s,
              status: "not_connected" as const,
              apiKeyStatus: "missing" as const,
            }
          : s
      )
    );
  };

  const openManage = (slug: string) => {
    const found = list.find((s) => s.slug === slug);
    if (found) {
      setDetailSupplier(found);
      setDetailOpen(true);
    }
  };

  const openConnect = (slug?: string) => {
    void slug;
    setConnectOpen(true);
  };

  const connectedCount = list.filter((s) => s.status === "connected").length;
  const indiaCount = list.filter((s) => s.region === "india").length;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="animate-fade-in space-y-6"
    >
      {/* Top bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Suppliers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect and manage your print-on-demand suppliers from India and around the world.
          </p>
        </div>
        <Button className="shrink-0" onClick={() => openConnect()}>
          <Plus className="h-4 w-4" /> Connect Supplier
        </Button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total suppliers", value: list.length },
          { label: "Connected", value: connectedCount },
          { label: "India", value: indiaCount },
          { label: "Global", value: list.length - indiaCount },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 + i * 0.05 }}
            className="rounded-xl border bg-card/60 p-4 backdrop-blur"
          >
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-2xl font-bold">{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {list.map((supplier, i) => (
          <SupplierCard
            key={supplier.id}
            supplier={supplier}
            index={i}
            onConnect={openConnect}
            onManage={openManage}
          />
        ))}
      </div>

      <ConnectSupplierDialog
        open={connectOpen}
        onOpenChange={setConnectOpen}
        onConnected={handleConnected}
      />

      <SupplierDetailSheet
        supplier={detailSupplier}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onDisconnect={handleDisconnect}
      />
    </motion.div>
  );
}

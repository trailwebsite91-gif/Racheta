"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Palette,
  Package,
  ShoppingCart,
  Store,
  Truck,
  BarChart3,
  Settings,
  TrendingUp,
  ChevronLeft,
  LogOut,
  User,
  Plus,
  Search,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const primaryNav: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: BarChart3 },
  { label: "Products", href: "/dashboard/products", icon: Package },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { label: "Designs", href: "/dashboard/designs", icon: Palette },
  { label: "Suppliers", href: "/dashboard/suppliers", icon: Truck },
  { label: "Marketplaces", href: "/dashboard/marketplaces", icon: Store },
];

const secondaryNav: NavItem[] = [
  { label: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { signOut, user } = useClerk();
  const [searchQuery, setSearchQuery] = useState("");

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href);
    const Icon = item.icon;

    return (
      <Link
        href={item.href}
        className={cn(
          "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
          active
            ? "bg-primary/15 text-primary shadow-sm"
            : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
        )}
      >
        {/* Active indicator bar */}
        {active && (
          <motion.div
            layoutId="activeNav"
            className="absolute -left-3 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
        <Icon
          className={cn(
            "h-4 w-4 transition-colors",
            active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
          )}
        />
        <span>{item.label}</span>
        {item.badge && (
          <span className="ml-auto rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Logo section */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
        <Logo size={28} />
      </div>

      {/* Quick search */}
      <div className="px-3 pt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Quick search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-9 text-xs bg-sidebar-accent border-sidebar-border focus-visible:ring-primary/30"
          />
        </div>
      </div>

      {/* Primary navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3 pt-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/50">
          Main
        </p>
        {primaryNav.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        <div className="my-3 px-3">
          <Separator className="bg-sidebar-border/50" />
        </div>

        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/50">
          Insights
        </p>
        {secondaryNav.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* Quick action */}
      <div className="px-3 pb-1">
        <Button
          size="sm"
          className="w-full gap-1.5 text-xs shadow-sm shadow-primary/25"
        >
          <Plus className="h-3.5 w-3.5" />
          New Design
        </Button>
      </div>

      {/* Bottom user section */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 ring-2 ring-sidebar-border">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {user?.firstName?.charAt(0) ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.fullName ?? "User"}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {user?.primaryEmailAddress?.emailAddress ?? ""}
            </p>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 justify-start gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link href="/dashboard/settings">
              <Settings className="h-3 w-3" />
              Settings
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => signOut()}
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

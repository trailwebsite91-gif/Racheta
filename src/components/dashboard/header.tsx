"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  ChevronRight,
  Home,
  User,
  LogOut,
  Settings,
  HelpCircle,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/dashboard/sidebar";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { signOut, user } = useClerk();
  const [mounted] = useState(true); // already mounted by ThemeProvider
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Breadcrumb generation
  const breadcrumbs = (() => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) return [{ label: "Dashboard", href: "/dashboard" }];

    const crumbs: { label: string; href: string }[] = [
      { label: "Dashboard", href: "/dashboard" },
    ];

    let accumulated = "/dashboard";
    parts.forEach((part, i) => {
      if (part === "dashboard" && i === 0) return;
      accumulated += `/${part}`;
      const label = part
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      crumbs.push({ label, href: accumulated });
    });

    return crumbs;
  })();

  const pageTitle = breadcrumbs[breadcrumbs.length - 1]?.label ?? "Dashboard";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-16 items-center justify-between gap-4 glass-nav px-4 sm:px-6",
        className
      )}
    >
      {/* Left side: mobile menu + breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Mobile sidebar trigger */}
        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-full hover:bg-accent"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0 bg-sidebar border-r">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center gap-1.5">
          {breadcrumbs.map((crumb, idx) => (
            <div key={crumb.href} className="flex items-center gap-1.5">
              {idx > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
              )}
              {idx === breadcrumbs.length - 1 ? (
                <span className="text-sm font-semibold text-foreground">
                  {crumb.label}
                </span>
              ) : (
                <a
                  href={crumb.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </a>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile title */}
        <h1 className="text-lg font-semibold text-foreground sm:hidden">
          {pageTitle}
        </h1>
      </div>

      {/* Right side: search + notifications + theme + user */}
      <div className="flex items-center gap-1.5">
        {/* Search bar - hidden on small screens */}
        <div className="hidden md:flex items-center">
          <div className="relative w-48 lg:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search anything..."
              className="h-9 pl-9 text-sm bg-muted/50 border-transparent focus-visible:bg-background focus-visible:border-input rounded-full"
            />
          </div>
        </div>

        {/* Notifications */}
        <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full"
            >
              <Bell className="h-5 w-5" />
              {/* Notification dot */}
              <span className="absolute right-2 top-2 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Button variant="ghost" size="sm" className="text-xs h-auto py-0.5">
                Mark all read
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              {[
                {
                  title: "New order received",
                  desc: "Order SP-2406 for ₹3,499 from Priya Sharma",
                  time: "5 min ago",
                  unread: true,
                },
                {
                  title: "Product approved",
                  desc: "Your 'Summer Vibes Tee' design was approved on Printful",
                  time: "1 hour ago",
                  unread: true,
                },
                {
                  title: "Revenue milestone",
                  desc: "You've crossed ₹1,00,000 in total revenue! 🎉",
                  time: "3 hours ago",
                  unread: false,
                },
                {
                  title: "Subscription update",
                  desc: "Your Pro plan renews in 7 days",
                  time: "1 day ago",
                  unread: false,
                },
              ].map((notif, idx) => (
                <DropdownMenuItem
                  key={idx}
                  className={cn(
                    "flex flex-col items-start gap-0.5 py-3 cursor-pointer",
                    notif.unread && "bg-primary/5"
                  )}
                >
                  <div className="flex items-center gap-2 w-full">
                    {notif.unread && (
                      <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                    )}
                    <span className="text-sm font-medium">{notif.title}</span>
                    <span className="ml-auto text-[10px] text-muted-foreground">
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-0">
                    {notif.desc}
                  </p>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-sm text-primary font-medium cursor-pointer">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="rounded-full"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme === "dark" ? "dark" : "light"}
              initial={{ y: -20, opacity: 0, rotate: -90 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 20, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </motion.div>
          </AnimatePresence>
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full ml-1">
              <Avatar className="h-8 w-8 ring-2 ring-border transition-shadow hover:ring-primary/30">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {user?.firstName?.charAt(0) ?? "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium">{user?.fullName ?? "User"}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.primaryEmailAddress?.emailAddress ?? ""}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer gap-2" asChild>
              <a href="/dashboard/settings">
                <User className="h-4 w-4" />
                Profile
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2" asChild>
              <a href="/dashboard/settings">
                <Settings className="h-4 w-4" />
                Settings
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2">
              <HelpCircle className="h-4 w-4" />
              Help & Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer gap-2 text-destructive focus:text-destructive"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

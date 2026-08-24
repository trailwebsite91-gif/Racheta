"use client";

import { cn } from "@/lib/utils";
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  ExternalLink,
  Globe,
  Image,
  Info,
  Loader2,
  LogOut,
  Mail,
  Menu,
  Moon,
  Package,
  Palette,
  Plus,
  Search,
  Settings,
  Share2,
  ShoppingCart,
  Star,
  Sun,
  Trash2,
  Truck,
  Upload,
  User,
  X,
  Zap,
  BarChart3,
  Store,
  Shield,
  LayoutDashboard,
  Layers,
  type LucideIcon,
} from "lucide-react";

type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeMap: Record<IconSize, string> = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
};

export interface IconProps {
  className?: string;
  size?: IconSize;
}

function withIcon(Icon: LucideIcon, defaultSize: IconSize = "md") {
  return function StyledIcon({ className, size = defaultSize }: IconProps) {
    return <Icon className={cn(sizeMap[size], className)} />;
  };
}

export const Icons = {
  Sparkles: withIcon(Sparkles),
  ArrowRight: withIcon(ArrowRight),
  ArrowUpRight: withIcon(ArrowUpRight),
  Check: withIcon(Check),
  ChevronDown: withIcon(ChevronDown),
  ChevronLeft: withIcon(ChevronLeft),
  ChevronRight: withIcon(ChevronRight),
  ChevronUp: withIcon(ChevronUp),
  Copy: withIcon(Copy),
  ExternalLink: withIcon(ExternalLink),
  Globe: withIcon(Globe),
  Image: withIcon(Image),
  Info: withIcon(Info),
  Loader2: withIcon(Loader2),
  LogOut: withIcon(LogOut),
  Mail: withIcon(Mail),
  Menu: withIcon(Menu),
  Moon: withIcon(Moon),
  Package: withIcon(Package),
  Palette: withIcon(Palette),
  Plus: withIcon(Plus),
  Search: withIcon(Search),
  Settings: withIcon(Settings),
  Share2: withIcon(Share2),
  ShoppingCart: withIcon(ShoppingCart),
  Star: withIcon(Star),
  Sun: withIcon(Sun),
  Trash2: withIcon(Trash2),
  Truck: withIcon(Truck),
  Upload: withIcon(Upload),
  User: withIcon(User),
  X: withIcon(X),
  Zap: withIcon(Zap),
  BarChart3: withIcon(BarChart3),
  Store: withIcon(Store),
  Shield: withIcon(Shield),
  LayoutDashboard: withIcon(LayoutDashboard),
  Layers: withIcon(Layers),
} as const;

export type IconName = keyof typeof Icons;

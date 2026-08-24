export const SITE = {
  name: "SmartPrint Studio",
  tagline: "Design Once. Sell Everywhere.",
  description:
    "A unified platform that lets creators upload a design, mock it up on any product, connect to both Indian and global POD suppliers, and publish across Etsy, Amazon Merch, and more — all from one dashboard.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://smartprint.studio",
  ogImage: "/og-image.png",
  links: {
    twitter: "https://twitter.com/smartprintstudio",
    github: "https://github.com/smartprint-studio",
  },
} as const;

export const NAV_LINKS = [
  { label: "Products", href: "/products" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Docs", href: "/docs" },
] as const;

export const DASHBOARD_LINKS = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    label: "Designs",
    href: "/dashboard/designs",
    icon: "Palette",
  },
  {
    label: "Products",
    href: "/dashboard/products",
    icon: "Package",
  },
  {
    label: "Orders",
    href: "/dashboard/orders",
    icon: "ShoppingCart",
  },
  {
    label: "Marketplaces",
    href: "/dashboard/marketplaces",
    icon: "Store",
  },
  {
    label: "Suppliers",
    href: "/dashboard/suppliers",
    icon: "Truck",
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: "BarChart3",
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: "Settings",
  },
] as const;

export const PLANS = [
  {
    name: "Starter",
    price: 0,
    description: "For creators just getting started",
    features: [
      "10 product listings",
      "2 marketplace connections",
      "Basic analytics",
      "Community support",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: 29,
    description: "For growing print-on-demand businesses",
    features: [
      "100 product listings",
      "All marketplace connections",
      "Advanced analytics",
      "AI design tools",
      "Priority support",
    ],
    cta: "Start Pro",
    popular: true,
  },
  {
    name: "Business",
    price: 79,
    description: "For scaling POD entrepreneurs",
    features: [
      "Unlimited product listings",
      "White-label storefront",
      "API access",
      "Team accounts",
      "Dedicated support",
    ],
    cta: "Start Business",
    popular: false,
  },
] as const;

export const SUPPLIERS = {
  india: [
    { name: "Qikink", logo: "/suppliers/qikink.svg", region: "India" },
    { name: "Printrove", logo: "/suppliers/printrove.svg", region: "India" },
    { name: "Blinkstore", logo: "/suppliers/blinkstore.svg", region: "India" },
  ],
  global: [
    { name: "Printful", logo: "/suppliers/printful.svg", region: "Global" },
    { name: "Printify", logo: "/suppliers/printify.svg", region: "Global" },
    { name: "Gelato", logo: "/suppliers/gelato.svg", region: "Global" },
  ],
} as const;

export const MARKETPLACES = [
  { name: "Etsy", logo: "/marketplaces/etsy.svg" },
  { name: "Amazon Merch", logo: "/marketplaces/amazon-merch.svg" },
  { name: "Shopify", logo: "/marketplaces/shopify.svg" },
  { name: "WooCommerce", logo: "/marketplaces/woocommerce.svg" },
  { name: "eBay", logo: "/marketplaces/ebay.svg" },
] as const;

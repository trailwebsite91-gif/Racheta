"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shirt,
  Coffee,
  Smartphone,
  ImageIcon,
  ShoppingBag,
  Sun,
  Sticker,
  Upload,
  Package,
  Globe,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { HeroSection } from "@/components/marketing/hero-section";
import { FeaturesGrid } from "@/components/marketing/features-grid";
import { Testimonials } from "@/components/marketing/testimonials";
import { FaqSection } from "@/components/marketing/faq-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  staggerContainer,
  staggerItem,
  fadeInUp,
} from "@/styles/animations";
import {
  Package as PackageIcon,
  Globe as GlobeIcon,
  Store,
  Zap,
  BarChart3,
  Shield,
} from "lucide-react";

/* ── Feature definitions ── */
const features = [
  {
    icon: PackageIcon,
    title: "Design Studio",
    description:
      "Drag-and-drop editor with AI-powered background removal, smart mockup generation, and variant creation. Professional product images in seconds.",
  },
  {
    icon: GlobeIcon,
    title: "India-First POD",
    description:
      "Native integrations with Qikink, Printrove, and Blinkstore. Serve customers across India with fast domestic shipping and localized pricing.",
  },
  {
    icon: Store,
    title: "Global Reach",
    description:
      "Connect to Printful, Printify, and Gelato for worldwide fulfillment. Reach customers in 200+ countries with production hubs on every continent.",
  },
  {
    icon: Zap,
    title: "Multi-Marketplace",
    description:
      "Publish to Etsy, Amazon Merch, Shopify, WooCommerce, and your own storefront simultaneously. One product listing syncs everywhere.",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description:
      "Real-time profit and sales dashboards across every channel and supplier. Track margins, best-sellers, and trends to make data-driven decisions.",
  },
  {
    icon: Shield,
    title: "Lightning Fast",
    description:
      "Deployed on global edge infrastructure with a 100 Lighthouse performance score. Your storefront and dashboard load instantly, everywhere.",
  },
];

/* ── Category definitions ── */
const categories: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "T-Shirts", href: "/products?category=t-shirts", icon: Shirt },
  { label: "Hoodies", href: "/products?category=hoodies", icon: Shirt },
  { label: "Mugs", href: "/products?category=mugs", icon: Coffee },
  { label: "Phone Cases", href: "/products?category=phone-cases", icon: Smartphone },
  { label: "Posters", href: "/products?category=posters", icon: ImageIcon },
  { label: "Tote Bags", href: "/products?category=tote-bags", icon: ShoppingBag },
  { label: "Caps", href: "/products?category=caps", icon: Sun },
  { label: "Stickers", href: "/products?category=stickers", icon: Sticker },
];

/* ── Testimonial definitions ── */
const testimonials = [
  {
    quote:
      "SmartPrint Studio saved us 20+ hours per week. Managing six marketplaces used to be a nightmare — now it's one click. The India supplier integration is a game-changer.",
    author: "Priya Sharma",
    role: "Founder, DesignCraft India",
    rating: 5,
  },
  {
    quote:
      "The India + global supplier combo is genius. I serve customers in Mumbai with Qikink and New York with Printful — all from the same dashboard. My revenue doubled in two months.",
    author: "Alex Chen",
    role: "POD Entrepreneur",
    rating: 5,
  },
  {
    quote:
      "AI mockups alone are worth the subscription. What used to take our designer three days now takes thirty minutes. The quality is indistinguishable from professional photography.",
    author: "Marcus Rivera",
    role: "Creative Director, TeeLab",
    rating: 5,
  },
  {
    quote:
      "I was stitching together five different tools before SmartPrint. Now everything syncs automatically — designs, inventory, pricing, and orders. I finally have time to focus on creating.",
    author: "Sarah Okonkwo",
    role: "Independent Artist",
    rating: 5,
  },
  {
    quote:
      "The analytics dashboard showed me that my mug designs were my highest-margin product. I doubled down and increased monthly profit by 40%. The data is presented so clearly.",
    author: "David Park",
    role: "Etsy Top Seller",
    rating: 5,
  },
  {
    quote:
      "Onboarding took less than ten minutes. Connecting my Etsy and Amazon Merch accounts was seamless. Within an hour I had my first product live across both platforms.",
    author: "Lisa Thompson",
    role: "Merchandise Manager",
    rating: 5,
  },
];

/* ── FAQ definitions ── */
const faqs = [
  {
    question: "How does print-on-demand work?",
    answer:
      "Print-on-demand (POD) lets you sell custom-designed products without holding inventory. When a customer places an order, your design is printed on the product by our partner suppliers and shipped directly to them. You set the price, keep the profit margin, and never touch the product — we handle production, packaging, and delivery.",
  },
  {
    question: "Can I use my own designs?",
    answer:
      "Absolutely. SmartPrint Studio is built for creators. Upload your own artwork in PNG, SVG, JPEG, or PSD format. Our built-in design studio lets you position, resize, and preview your designs on any product before publishing. You retain full ownership of all your intellectual property.",
  },
  {
    question: "Which suppliers do you support in India?",
    answer:
      "We have native integrations with India's top three POD suppliers: Qikink (the largest Indian POD network), Printrove (known for premium apparel), and Blinkstore (specializing in fast Delhi-NCR fulfillment). Each supplier offers different product catalogs and pricing, and you can connect multiple simultaneously.",
  },
  {
    question: "How do I connect my Etsy store?",
    answer:
      "Connecting your Etsy store takes under two minutes. From your SmartPrint dashboard, go to Marketplaces → Add Connection → Etsy, and authenticate with your Etsy account. Once connected, any product you publish can be auto-listed on Etsy with optimized titles, tags, and descriptions generated by our AI.",
  },
  {
    question: "What are the profit margins?",
    answer:
      "You set your own retail prices — we never dictate your margins. Typically, POD creators earn 40-60% margins after the base product and printing costs. For example, a t-shirt with a ₹350 base cost can sell for ₹800-1,200, giving you ₹450-850 profit per shirt. Our analytics dashboard shows real-time margin breakdowns across every product and channel.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Yes! Our Starter plan is completely free and includes up to 10 product listings and 2 marketplace connections with basic analytics. You can design, mockup, and sell without paying a cent. As your business grows, our Pro (₹2,499/mo) and Business (₹6,999/mo) plans unlock unlimited listings, AI tools, API access, and priority support.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Shipping times depend on the supplier and destination. Indian suppliers (Qikink, Printrove, Blinkstore) typically deliver within 3-7 business days domestically. Global suppliers (Printful, Printify, Gelato) deliver within 5-12 business days depending on the destination country. Expedited shipping options are available at checkout.",
  },
  {
    question: "Can I sell on Amazon Merch?",
    answer:
      "Yes! SmartPrint Studio integrates with Amazon Merch on Demand. Once you have an approved Amazon Merch account, you can connect it to SmartPrint and publish your designs directly to Amazon's marketplace. Our platform handles the technical listing requirements — product mockups, metadata, and category compliance — automatically.",
  },
];

/* ── How It Works steps ── */
const steps = [
  {
    number: "1",
    icon: Upload,
    title: "Upload Your Design",
    description:
      "Drag and drop your artwork, or create from scratch with our AI-powered design studio. Supports PNG, SVG, JPEG, and PSD formats.",
  },
  {
    number: "2",
    icon: Package,
    title: "Choose Products & Suppliers",
    description:
      "Select from 200+ products across Indian and global suppliers. Preview your design on every product in real-time with photorealistic mockups.",
  },
  {
    number: "3",
    icon: Globe,
    title: "Publish to Marketplaces",
    description:
      "One click publishes your listing to Etsy, Amazon Merch, Shopify, WooCommerce, and your own storefront. AI-optimized titles and tags included.",
  },
  {
    number: "4",
    icon: TrendingUp,
    title: "Earn Profit on Every Sale",
    description:
      "Orders route automatically to the best supplier. You set your margin, we handle fulfillment. Track every rupee in your real-time profit dashboard.",
  },
];

export function MarketingHome() {
  return (
    <>
      {/* 1. Hero Section */}
      <HeroSection
        badge="Now supporting 6 POD suppliers across India and globally"
        headline="Design Once. Sell Everywhere."
        highlightedWord="Everywhere"
        subtitle="Create, mockup, and sell custom products across India and worldwide — all from one dashboard. Connect to Qikink, Printful, Etsy, and more."
        primaryCta={{ label: "Start Designing", href: "/sign-up" }}
        secondaryCta={{ label: "Explore Products", href: "/products" }}
      />

      {/* Trust badges row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="pb-16 text-center"
      >
        <p className="text-sm font-medium text-muted-foreground">
          Trusted by 10,000+ creators worldwide
        </p>
      </motion.div>

      {/* 2. Features Grid */}
      <FeaturesGrid
        badge="Features"
        heading="Everything you need to scale your POD business"
        subheading="From design to delivery, we handle the complexity so you can focus on creating."
        features={features}
        columns={3}
      />

      {/* 3. Popular Categories */}
      <section className="py-20 sm:py-28 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center"
          >
            <Badge variant="secondary" className="mb-4">
              Categories
            </Badge>
            <h2 className="text-heading-2">Popular Categories</h2>
            <p className="mt-4 text-body-lg">
              Start designing on our most popular products — new categories added every month.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          >
            {categories.map((cat) => (
              <motion.div key={cat.label} variants={staggerItem}>
                <Link href={cat.href}>
                  <Card className="group flex flex-col items-center gap-3 p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/25">
                      <cat.icon className="h-7 w-7" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {cat.label}
                    </span>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. Testimonials */}
      <Testimonials
        badge="Testimonials"
        heading="Loved by POD creators worldwide"
        subheading="From solo artists to six-figure brands, see why creators choose SmartPrint Studio."
        testimonials={testimonials}
      />

      {/* 5. How It Works */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center"
          >
            <Badge variant="secondary" className="mb-4">
              How It Works
            </Badge>
            <h2 className="text-heading-2">
              From design to profit in four simple steps
            </h2>
            <p className="mt-4 text-body-lg">
              No technical skills required. Set up your first product in under 10 minutes.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="relative mt-16"
          >
            {/* Connector line (desktop only) */}
            <div className="absolute top-24 left-0 right-0 hidden lg:block">
              <div className="mx-auto h-0.5 w-3/4 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  variants={staggerItem}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Step number badge */}
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-xl font-bold shadow-lg shadow-primary/25">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <step.icon className="h-6 w-6" />
                  </div>

                  {/* Content */}
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground max-w-xs">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. FAQ */}
      <FaqSection
        heading="Frequently asked questions"
        subheading="Everything you need to know about SmartPrint Studio and print-on-demand."
        items={faqs}
      />

      {/* 7. CTA Section */}
      <CtaSection
        heading="Ready to start selling?"
        description="Join thousands of creators who design once and sell everywhere with SmartPrint Studio. No credit card required — start free today."
        primaryCta={{ label: "Create your free account", href: "/sign-up" }}
        secondaryCta={{ label: "View Pricing", href: "/pricing" }}
      />

      {/* 8. Newsletter */}
      <section className="pb-20 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <NewsletterForm
            heading="Stay updated"
            description="Get notified about new features, supplier launches, and POD tips to grow your business."
          />
        </div>
      </section>
    </>
  );
}

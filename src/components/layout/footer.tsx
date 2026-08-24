"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Twitter,
  Github,
  Linkedin,
  Youtube,
  Instagram,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import { SITE } from "@/lib/constants";
import { staggerContainer, staggerItem } from "@/styles/animations";

const footerLinks = {
  product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Marketplaces", href: "/marketplaces" },
    { label: "Suppliers", href: "/suppliers" },
    { label: "Changelog", href: "/changelog" },
  ],
  resources: [
    { label: "Blog", href: "/blog" },
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/api" },
    { label: "Community", href: "/community" },
    { label: "Help Center", href: "/help" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Contact", href: "/contact" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5"
        >
          {/* Brand column */}
          <motion.div variants={staggerItem} className="lg:col-span-2">
            <Logo size={34} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {SITE.description}
            </p>
            <div className="mt-5 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border/50 text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <motion.div key={category} variants={staggerItem}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
                {category}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Newsletter row */}
        <div className="mt-12 rounded-2xl border border-border/50 bg-card/50 p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Subscribe to our newsletter
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                POD tips, product updates, and early access — straight to your inbox.
              </p>
            </div>
            <NewsletterForm variant="compact" className="sm:w-80" />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SmartPrint Studio. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with ❤️ for POD creators worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SmartPrint Studio — Design Once. Sell Everywhere.",
    template: "%s | SmartPrint Studio",
  },
  description:
    "A unified platform that lets creators upload a design, mock it up on any product, connect to both Indian and global POD suppliers, and publish across multiple marketplaces — all from one dashboard.",
  keywords: [
    "print on demand",
    "POD",
    "design marketplace",
    "custom merchandise",
    "printful",
    "printify",
    "qikink",
    "etsy integration",
  ],
  authors: [{ name: "SmartPrint Studio" }],
  creator: "SmartPrint Studio",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://smartprint.studio"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SmartPrint Studio",
    title: "SmartPrint Studio — Design Once. Sell Everywhere.",
    description:
      "Unified POD platform for Indian and global suppliers. Design once, sell everywhere.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartPrint Studio",
    description:
      "Unified POD platform for Indian and global suppliers. Design once, sell everywhere.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

function AppContent({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
  // Skip ClerkProvider when running with a dummy key (build/dev without real Clerk)
  const isRealClerk =
    publishableKey.startsWith("pk_live_") || publishableKey.startsWith("pk_test_") && publishableKey.length > 20;

  const content = (
    <html
      lang="en"
      className={`${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="bottom-right"
            richColors
            closeButton
            toastOptions={{
              classNames: {
                toast: "font-sans text-sm",
              },
            }}
          />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );

  if (isRealClerk) {
    return <ClerkProvider>{content}</ClerkProvider>;
  }

  return content;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppContent>{children}</AppContent>;
}

import type { Metadata } from "next";
import { MarketingHome } from "./_components/marketing-home";

export const metadata: Metadata = {
  title: "SmartPrint Studio — Design Once. Sell Everywhere.",
  description:
    "Create, mockup, and sell custom products across India and worldwide — all from one dashboard. Connect to Qikink, Printful, Etsy, Amazon Merch, and more.",
  openGraph: {
    title: "SmartPrint Studio — Design Once. Sell Everywhere.",
    description:
      "Create, mockup, and sell custom products across India and worldwide — all from one dashboard. Connect to Qikink, Printful, Etsy, Amazon Merch, and more.",
    siteName: "SmartPrint Studio",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartPrint Studio — Design Once. Sell Everywhere.",
    description:
      "Create, mockup, and sell custom products across India and worldwide — all from one dashboard.",
  },
};

export default function MarketingPage() {
  return <MarketingHome />;
}

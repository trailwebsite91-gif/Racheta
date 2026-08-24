export type SupplierRegion = "india" | "global";
export type SupplierStatus = "connected" | "not_connected";
export type ConnectionState = SupplierStatus;

export interface SupplierProduct {
  name: string;
  category: string;
  price: number;
  productionDays: number;
  countries: string[];
}

export interface SupplierShipping {
  region: string;
  days: string;
  cost: number;
}

export interface Supplier {
  id: string;
  name: string;
  slug: string;
  region: SupplierRegion;
  logoInitials: string;
  /** Tailwind-friendly data URI / gradient colors for the logo placeholder. */
  color: string;
  baseUrl: string;
  status: SupplierStatus;
  products: SupplierProduct[];
  shipping: SupplierShipping[];
  orderVolume: number;
  avgFulfillmentTime: number;
  countriesServed: number;
  apiKeyStatus: "configured" | "missing";
  webhookUrl: string;
  lastSynced: string;
  issueRate: number;
}

export const suppliers: Supplier[] = [
  {
    id: "sup_qikink",
    name: "Qikink",
    slug: "qikink",
    region: "india",
    logoInitials: "QK",
    color: "from-orange-500 to-rose-500",
    baseUrl: "https://www.qikink.com",
    status: "connected",
    products: [
      { name: "Premium Cotton T-Shirt", category: "Apparel", price: 5.5, productionDays: 4, countries: ["India", "UAE", "USA"] },
      { name: "Hooded Sweatshirt", category: "Apparel", price: 12.9, productionDays: 5, countries: ["India", "UAE", "USA"] },
      { name: "Ceramic Coffee Mug", category: "Home & Living", price: 3.2, productionDays: 3, countries: ["India"] },
      { name: "Hard Cover Journal", category: "Stationery", price: 4.5, productionDays: 4, countries: ["India", "UAE"] },
      { name: "Canvas Tote Bag", category: "Accessories", price: 4.1, productionDays: 4, countries: ["India", "UAE", "USA"] },
      { name: "Phone Case", category: "Accessories", price: 3.9, productionDays: 3, countries: ["India"] },
    ],
    shipping: [
      { region: "Domestic (India)", days: "2-4", cost: 0 },
      { region: "UAE", days: "4-6", cost: 6 },
      { region: "USA", days: "6-9", cost: 9 },
      { region: "Rest of World", days: "7-12", cost: 11 },
    ],
    orderVolume: 1240,
    avgFulfillmentTime: 3.2,
    countriesServed: 32,
    apiKeyStatus: "configured",
    webhookUrl: "https://api.smartprint.studio/hooks/qikink",
    lastSynced: "10 min ago",
    issueRate: 1.8,
  },
  {
    id: "sup_printrove",
    name: "Printrove",
    slug: "printrove",
    region: "india",
    logoInitials: "PR",
    color: "from-sky-500 to-indigo-500",
    baseUrl: "https://www.printrove.com",
    status: "connected",
    products: [
      { name: "Unisex T-Shirt", category: "Apparel", price: 5.0, productionDays: 4, countries: ["India", "USA", "UK"] },
      { name: "Oversized Hoodie", category: "Apparel", price: 13.5, productionDays: 5, countries: ["India", "USA"] },
      { name: "Photo Frame", category: "Home & Living", price: 6.2, productionDays: 5, countries: ["India"] },
      { name: "Pillow Cover", category: "Home & Living", price: 4.8, productionDays: 4, countries: ["India", "USA"] },
      { name: "Cap (Structured)", category: "Accessories", price: 4.4, productionDays: 4, countries: ["India", "UK"] },
      { name: "Mug (11oz)", category: "Home & Living", price: 3.1, productionDays: 3, countries: ["India"] },
    ],
    shipping: [
      { region: "Domestic (India)", days: "3-5", cost: 0 },
      { region: "USA", days: "7-10", cost: 8 },
      { region: "UK", days: "6-9", cost: 8 },
      { region: "Rest of World", days: "8-12", cost: 10 },
    ],
    orderVolume: 980,
    avgFulfillmentTime: 3.6,
    countriesServed: 28,
    apiKeyStatus: "configured",
    webhookUrl: "https://api.smartprint.studio/hooks/printrove",
    lastSynced: "23 min ago",
    issueRate: 2.4,
  },
  {
    id: "sup_blinkstore",
    name: "Blinkstore",
    slug: "blinkstore",
    region: "india",
    logoInitials: "BS",
    color: "from-fuchsia-500 to-purple-600",
    baseUrl: "https://www.blinkstore.in",
    status: "not_connected",
    products: [
      { name: "Classic T-Shirt", category: "Apparel", price: 4.6, productionDays: 3, countries: ["India"] },
      { name: "Polo Shirt", category: "Apparel", price: 6.0, productionDays: 4, countries: ["India"] },
      { name: "Sublimation Mug", category: "Home & Living", price: 2.9, productionDays: 3, countries: ["India"] },
      { name: "Custom Tote", category: "Accessories", price: 3.8, productionDays: 4, countries: ["India"] },
      { name: "Acrylic Keychain", category: "Accessories", price: 1.6, productionDays: 3, countries: ["India"] },
    ],
    shipping: [
      { region: "Metro Cities", days: "2-4", cost: 0 },
      { region: "Non-Metro", days: "3-5", cost: 0 },
      { region: "Rest of World", days: "8-12", cost: 12 },
    ],
    orderVolume: 0,
    avgFulfillmentTime: 0,
    countriesServed: 12,
    apiKeyStatus: "missing",
    webhookUrl: "—",
    lastSynced: "—",
    issueRate: 0,
  },
  {
    id: "sup_printful",
    name: "Printful",
    slug: "printful",
    region: "global",
    logoInitials: "PF",
    color: "from-emerald-500 to-teal-500",
    baseUrl: "https://www.printful.com",
    status: "connected",
    products: [
      { name: "Bella+Canvas 3001 Tee", category: "Apparel", price: 11.2, productionDays: 3, countries: ["USA", "EU", "UK", "Canada", "Australia"] },
      { name: "Gildan Hoodie", category: "Apparel", price: 22.5, productionDays: 4, countries: ["USA", "EU", "UK", "Canada"] },
      { name: "Poster (18x24)", category: "Wall Art", price: 9.8, productionDays: 2, countries: ["USA", "EU", "UK"] },
      { name: "Embroidered Beanie", category: "Accessories", price: 14.0, productionDays: 4, countries: ["USA", "EU"] },
      { name: "Canvas Print", category: "Wall Art", price: 29.9, productionDays: 3, countries: ["USA", "EU", "UK", "Australia"] },
      { name: "Tote Bag (Canvas)", category: "Accessories", price: 12.4, productionDays: 3, countries: ["USA", "EU"] },
    ],
    shipping: [
      { region: "USA", days: "3-6", cost: 3.99 },
      { region: "European Union", days: "4-7", cost: 4.99 },
      { region: "United Kingdom", days: "4-7", cost: 4.49 },
      { region: "Canada", days: "5-8", cost: 5.99 },
      { region: "Australia", days: "6-10", cost: 6.99 },
    ],
    orderVolume: 2310,
    avgFulfillmentTime: 2.9,
    countriesServed: 85,
    apiKeyStatus: "configured",
    webhookUrl: "https://api.smartprint.studio/hooks/printful",
    lastSynced: "5 min ago",
    issueRate: 1.2,
  },
  {
    id: "sup_printify",
    name: "Printify",
    slug: "printify",
    region: "global",
    logoInitials: "PY",
    color: "from-amber-500 to-yellow-500",
    baseUrl: "https://www.printify.com",
    status: "connected",
    products: [
      { name: "Champion T-Shirt", category: "Apparel", price: 10.4, productionDays: 3, countries: ["USA", "EU", "UK"] },
      { name: "Heavyweight Hoodie", category: "Apparel", price: 24.0, productionDays: 5, countries: ["USA", "EU"] },
      { name: "Ceramic Mug (11oz)", category: "Home & Living", price: 7.1, productionDays: 2, countries: ["USA", "EU", "UK", "Canada"] },
      { name: "Sticker Sheet", category: "Stationery", price: 3.5, productionDays: 2, countries: ["USA", "EU"] },
      { name: "Throw Pillow", category: "Home & Living", price: 19.0, productionDays: 4, countries: ["USA", "EU"] },
      { name: "Kids T-Shirt", category: "Apparel", price: 9.8, productionDays: 3, countries: ["USA", "EU", "UK"] },
    ],
    shipping: [
      { region: "USA", days: "4-7", cost: 3.49 },
      { region: "European Union", days: "5-8", cost: 4.79 },
      { region: "United Kingdom", days: "5-8", cost: 4.29 },
      { region: "Canada", days: "6-9", cost: 5.49 },
      { region: "Rest of World", days: "7-12", cost: 6.49 },
    ],
    orderVolume: 1870,
    avgFulfillmentTime: 3.1,
    countriesServed: 110,
    apiKeyStatus: "configured",
    webhookUrl: "https://api.smartprint.studio/hooks/printify",
    lastSynced: "1 hr ago",
    issueRate: 1.6,
  },
  {
    id: "sup_gelato",
    name: "Gelato",
    slug: "gelato",
    region: "global",
    logoInitials: "GL",
    color: "from-rose-500 to-red-500",
    baseUrl: "https://www.gelato.com",
    status: "not_connected",
    products: [
      { name: "Organic Cotton Tee", category: "Apparel", price: 12.8, productionDays: 3, countries: ["EU", "USA", "UK"] },
      { name: "Wall Poster (A2)", category: "Wall Art", price: 8.9, productionDays: 2, countries: ["EU", "USA", "UK", "Canada"] },
      { name: "Photo Book", category: "Stationery", price: 21.0, productionDays: 5, countries: ["EU", "USA"] },
      { name: "Canvas Tote", category: "Accessories", price: 9.5, productionDays: 3, countries: ["EU", "USA"] },
      { name: "Acrylic Wall Art", category: "Wall Art", price: 27.4, productionDays: 4, countries: ["EU", "USA", "UK"] },
    ],
    shipping: [
      { region: "European Union", days: "3-6", cost: 4.29 },
      { region: "USA", days: "4-7", cost: 4.99 },
      { region: "United Kingdom", days: "3-6", cost: 3.99 },
      { region: "Canada", days: "5-8", cost: 5.49 },
    ],
    orderVolume: 0,
    avgFulfillmentTime: 0,
    countriesServed: 95,
    apiKeyStatus: "missing",
    webhookUrl: "—",
    lastSynced: "—",
    issueRate: 0,
  },
];

export function getSupplier(slug: string): Supplier | undefined {
  return suppliers.find((s) => s.slug === slug);
}

export function regionLabel(region: SupplierRegion): string {
  return region === "india" ? "India" : "Global";
}

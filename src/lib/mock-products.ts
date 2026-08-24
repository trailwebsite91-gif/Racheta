export interface ProductVariant {
  colors: { name: string; hex: string }[];
  sizes: string[];
}

export interface ProductSupplier {
  name: string;
  basePrice: number;
  deliveryDays: number;
  region: "India" | "Global";
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  priceRange: { min: number; max: number };
  images: string[];
  variants: ProductVariant;
  suppliers: ProductSupplier[];
  rating: number;
  reviewCount: number;
}

function svgImg(hue: number, label: string): string {
  const c1 = `hsl(${hue},70%,65%)`;
  const c2 = `hsl(${hue + 30},80%,50%)`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:${c1}"/>
    <stop offset="100%" style="stop-color:${c2}"/>
  </linearGradient></defs>
  <rect width="400" height="400" fill="url(#g)"/>
  <text x="200" y="200" text-anchor="middle" dy=".35em" font-family="system-ui,sans-serif" font-size="28" font-weight="700" fill="white" opacity="0.9">${label}</text>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const INDIA_SUPPLIERS: ProductSupplier[] = [
  { name: "Qikink", basePrice: 199, deliveryDays: 5, region: "India" },
  { name: "Printrove", basePrice: 229, deliveryDays: 4, region: "India" },
  { name: "Blinkstore", basePrice: 249, deliveryDays: 6, region: "India" },
];

const GLOBAL_SUPPLIERS: ProductSupplier[] = [
  { name: "Printful", basePrice: 899, deliveryDays: 8, region: "Global" },
  { name: "Printify", basePrice: 799, deliveryDays: 7, region: "Global" },
  { name: "Gelato", basePrice: 849, deliveryDays: 5, region: "Global" },
];

const ALL_SUPPLIERS = [...INDIA_SUPPLIERS, ...GLOBAL_SUPPLIERS];

export const products: Product[] = [
  {
    id: "p1",
    slug: "premium-cotton-tee",
    name: "Premium Cotton Tee",
    description:
      "Ultra-soft 180 GSM ring-spun cotton t-shirt with a modern fit. Pre-shrunk, bio-washed, and ready for vibrant full-color prints. Perfect for brands that want their designs to feel as good as they look.",
    category: "T-Shirts",
    basePrice: 299,
    priceRange: { min: 299, max: 1499 },
    images: [svgImg(220, "Premium Tee"), svgImg(225, "Tee Back"), svgImg(230, "Tee Detail")],
    variants: {
      colors: [
        { name: "White", hex: "#FFFFFF" },
        { name: "Black", hex: "#1A1A1A" },
        { name: "Navy", hex: "#1B2838" },
        { name: "Heather Grey", hex: "#B0B5B9" },
      ],
      sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    },
    suppliers: ALL_SUPPLIERS,
    rating: 4.7,
    reviewCount: 1243,
  },
  {
    id: "p2",
    slug: "oversized-street-tee",
    name: "Oversized Street Tee",
    description:
      "Boxy, dropped-shoulder fit in heavyweight 220 GSM cotton. Garment-dyed for a lived-in feel. The go-to canvas for streetwear brands and bold graphic statements.",
    category: "T-Shirts",
    basePrice: 399,
    priceRange: { min: 399, max: 1799 },
    images: [svgImg(45, "Street Tee"), svgImg(50, "Tee Back")],
    variants: {
      colors: [
        { name: "Sand", hex: "#C2B280" },
        { name: "Olive", hex: "#556B2F" },
        { name: "Rust", hex: "#B7410E" },
        { name: "Charcoal", hex: "#36454F" },
        { name: "Cream", hex: "#FFFDD0" },
      ],
      sizes: ["S", "M", "L", "XL", "2XL"],
    },
    suppliers: [...INDIA_SUPPLIERS, GLOBAL_SUPPLIERS[0], GLOBAL_SUPPLIERS[1]],
    rating: 4.5,
    reviewCount: 876,
  },
  {
    id: "p3",
    slug: "athletic-performance-tee",
    name: "Athletic Performance Tee",
    description:
      "Moisture-wicking polyester-elastane blend with four-way stretch. Flatlock seams prevent chafing. Ideal for gym brands, run clubs, and active lifestyle merch.",
    category: "T-Shirts",
    basePrice: 449,
    priceRange: { min: 449, max: 1999 },
    images: [svgImg(180, "Athletic Tee"), svgImg(185, "Tee Side")],
    variants: {
      colors: [
        { name: "Electric Blue", hex: "#0066FF" },
        { name: "Neon Green", hex: "#39FF14" },
        { name: "Black", hex: "#1A1A1A" },
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    suppliers: ALL_SUPPLIERS,
    rating: 4.3,
    reviewCount: 520,
  },
  {
    id: "p4",
    slug: "organic-bamboo-tee",
    name: "Organic Bamboo Tee",
    description:
      "Sustainable 70% bamboo viscose / 30% organic cotton blend. Silky soft, naturally antibacterial, and hypoallergenic. The premium eco-conscious choice.",
    category: "T-Shirts",
    basePrice: 599,
    priceRange: { min: 599, max: 2499 },
    images: [svgImg(140, "Bamboo Tee"), svgImg(145, "Tee Detail")],
    variants: {
      colors: [
        { name: "Natural", hex: "#F5F0E1" },
        { name: "Sage", hex: "#88B04B" },
        { name: "Sky", hex: "#87CEEB" },
        { name: "Blush", hex: "#DE5D83" },
      ],
      sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    },
    suppliers: [INDIA_SUPPLIERS[0], INDIA_SUPPLIERS[1], GLOBAL_SUPPLIERS[2]],
    rating: 4.8,
    reviewCount: 389,
  },
  {
    id: "p5",
    slug: "classic-pullover-hoodie",
    name: "Classic Pullover Hoodie",
    description:
      "350 GSM fleece-lined hoodie with front kangaroo pocket and adjustable drawcord hood. Brushed interior for unmatched coziness. A streetwear essential.",
    category: "Hoodies",
    basePrice: 899,
    priceRange: { min: 899, max: 3499 },
    images: [svgImg(280, "Hoodie"), svgImg(285, "Hoodie Back")],
    variants: {
      colors: [
        { name: "Black", hex: "#1A1A1A" },
        { name: "Grey Marl", hex: "#9B9B9B" },
        { name: "Navy", hex: "#1B2838" },
        { name: "Burgundy", hex: "#800020" },
      ],
      sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    },
    suppliers: ALL_SUPPLIERS,
    rating: 4.6,
    reviewCount: 2105,
  },
  {
    id: "p6",
    slug: "zip-up-tech-hoodie",
    name: "Zip-Up Tech Hoodie",
    description:
      "Modern full-zip hoodie with water-repellent shell, laser-cut zipper garage, and hidden media pocket. Athletic silhouette with reflective accents.",
    category: "Hoodies",
    basePrice: 1299,
    priceRange: { min: 1299, max: 4499 },
    images: [svgImg(200, "Tech Hoodie"), svgImg(205, "Hoodie Detail")],
    variants: {
      colors: [
        { name: "Stealth Black", hex: "#1C1C1E" },
        { name: "Graphite", hex: "#4A4A4A" },
        { name: "Midnight Blue", hex: "#191970" },
      ],
      sizes: ["S", "M", "L", "XL", "2XL"],
    },
    suppliers: GLOBAL_SUPPLIERS,
    rating: 4.4,
    reviewCount: 667,
  },
  {
    id: "p7",
    slug: "ceramic-matte-mug",
    name: "Ceramic Matte Mug",
    description:
      "Premium 11oz ceramic mug with a velvety matte finish and vibrant sublimation print. Microwave and dishwasher safe. The perfect canvas for typography and illustration.",
    category: "Mugs",
    basePrice: 249,
    priceRange: { min: 249, max: 899 },
    images: [svgImg(30, "Mug"), svgImg(35, "Mug Side")],
    variants: {
      colors: [
        { name: "Matte White", hex: "#F8F8F8" },
        { name: "Matte Black", hex: "#2C2C2C" },
        { name: "Matte Navy", hex: "#1B2838" },
      ],
      sizes: ["11oz"],
    },
    suppliers: ALL_SUPPLIERS,
    rating: 4.9,
    reviewCount: 3200,
  },
  {
    id: "p8",
    slug: "enamel-camp-mug",
    name: "Enamel Camp Mug",
    description:
      "Retro-inspired 12oz enamel mug with speckled finish and steel rim. Lightweight, durable, and perfect for outdoor brands. Feels like a campfire in your hands.",
    category: "Mugs",
    basePrice: 349,
    priceRange: { min: 349, max: 1099 },
    images: [svgImg(15, "Camp Mug"), svgImg(20, "Mug Detail")],
    variants: {
      colors: [
        { name: "Speckled White", hex: "#F5F5F0" },
        { name: "Speckled Blue", hex: "#4682B4" },
        { name: "Speckled Green", hex: "#556B2F" },
      ],
      sizes: ["12oz"],
    },
    suppliers: [INDIA_SUPPLIERS[0], GLOBAL_SUPPLIERS[0], GLOBAL_SUPPLIERS[1]],
    rating: 4.6,
    reviewCount: 892,
  },
  {
    id: "p9",
    slug: "tough-shield-phone-case",
    name: "Tough Shield Phone Case",
    description:
      "Dual-layer impact-resistant case with 360° full-wrap print. Slim profile, precise cutouts, and raised bezel for screen protection. Supports iPhone and Galaxy models.",
    category: "Phone Cases",
    basePrice: 399,
    priceRange: { min: 399, max: 1299 },
    images: [svgImg(330, "Phone Case"), svgImg(335, "Case Detail")],
    variants: {
      colors: [{ name: "Clear Back", hex: "#EEEEEE" }],
      sizes: ["iPhone 14", "iPhone 15", "iPhone 16", "Galaxy S24"],
    },
    suppliers: ALL_SUPPLIERS,
    rating: 4.2,
    reviewCount: 1540,
  },
  {
    id: "p10",
    slug: "eco-wood-phone-case",
    name: "Eco Wood Phone Case",
    description:
      "Real wood veneer on a shock-absorbent core. Each case has unique grain patterns, making every piece one-of-a-kind. Ultra-slim and biodegradable packaging.",
    category: "Phone Cases",
    basePrice: 599,
    priceRange: { min: 599, max: 1599 },
    images: [svgImg(35, "Wood Case"), svgImg(40, "Case Back")],
    variants: {
      colors: [
        { name: "Bamboo", hex: "#C2B280" },
        { name: "Walnut", hex: "#5C4033" },
        { name: "Rosewood", hex: "#65000B" },
      ],
      sizes: ["iPhone 14", "iPhone 15", "iPhone 16"],
    },
    suppliers: [GLOBAL_SUPPLIERS[0], GLOBAL_SUPPLIERS[2]],
    rating: 4.3,
    reviewCount: 476,
  },
  {
    id: "p11",
    slug: "matte-art-poster",
    name: "Matte Art Poster",
    description:
      "Museum-quality 200 GSM matte paper with archival-grade pigment inks. Available in three sizes. Vivid color reproduction that doesn't fade. Ships in rigid tubes.",
    category: "Posters",
    basePrice: 199,
    priceRange: { min: 199, max: 999 },
    images: [svgImg(310, "Poster"), svgImg(315, "Poster Frame")],
    variants: {
      colors: [{ name: "Natural White", hex: "#FAF9F6" }],
      sizes: ['12"x18"', '18"x24"', '24"x36"'],
    },
    suppliers: ALL_SUPPLIERS,
    rating: 4.5,
    reviewCount: 723,
  },
  {
    id: "p12",
    slug: "canvas-tote-bag",
    name: "Canvas Tote Bag",
    description:
      "Heavy-duty 12oz organic cotton canvas tote with reinforced stitching and wide shoulder straps. Full-color print area on both sides. The ultimate everyday carry.",
    category: "Tote Bags",
    basePrice: 349,
    priceRange: { min: 349, max: 1199 },
    images: [svgImg(60, "Tote Bag"), svgImg(65, "Tote Detail")],
    variants: {
      colors: [
        { name: "Natural", hex: "#F5E6D3" },
        { name: "Black", hex: "#2C2C2C" },
        { name: "Denim Blue", hex: "#1560BD" },
      ],
      sizes: ["One Size"],
    },
    suppliers: [...INDIA_SUPPLIERS, GLOBAL_SUPPLIERS[0]],
    rating: 4.7,
    reviewCount: 1034,
  },
  {
    id: "p13",
    slug: "snapback-cap",
    name: "Classic Snapback Cap",
    description:
      "Structured six-panel cap with flat brim and adjustable snap closure. Premium cotton twill with embroidered eyelets. Perfect for streetwear brands and merch drops.",
    category: "Caps",
    basePrice: 299,
    priceRange: { min: 299, max: 999 },
    images: [svgImg(90, "Cap"), svgImg(95, "Cap Side")],
    variants: {
      colors: [
        { name: "Black", hex: "#1A1A1A" },
        { name: "Navy", hex: "#1B2838" },
        { name: "Red", hex: "#CC0000" },
        { name: "Khaki", hex: "#C3B091" },
      ],
      sizes: ["One Size"],
    },
    suppliers: ALL_SUPPLIERS,
    rating: 4.4,
    reviewCount: 567,
  },
  {
    id: "p14",
    slug: "die-cut-sticker-pack",
    name: "Die-Cut Sticker Pack",
    description:
      "Weatherproof vinyl stickers with crisp die-cut edges and UV laminate. Pack of 5 individual designs. Dishwasher-safe for water bottles and laptops.",
    category: "Stickers",
    basePrice: 99,
    priceRange: { min: 99, max: 499 },
    images: [svgImg(120, "Stickers"), svgImg(125, "Sticker Sheet")],
    variants: {
      colors: [{ name: "Gloss White", hex: "#FFFFFF" }],
      sizes: ["3x3", "4x4", "5x5"],
    },
    suppliers: [INDIA_SUPPLIERS[0], INDIA_SUPPLIERS[1], GLOBAL_SUPPLIERS[1], GLOBAL_SUPPLIERS[2]],
    rating: 4.8,
    reviewCount: 2103,
  },
];

export const categories = [
  "T-Shirts",
  "Hoodies",
  "Mugs",
  "Phone Cases",
  "Posters",
  "Tote Bags",
  "Caps",
  "Stickers",
] as const;

export type ProductCategory = (typeof categories)[number];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(slug: string, count = 4): Product[] {
  const current = products.find((p) => p.slug === slug);
  const others = products.filter((p) => p.slug !== slug);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getPriceRangeLabel(p: Product): string {
  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  if (p.priceRange.min === p.priceRange.max) return fmt(p.priceRange.min);
  return `${fmt(p.priceRange.min)}–${fmt(p.priceRange.max)}`;
}

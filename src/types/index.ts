export interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  plan: "starter" | "pro" | "business" | "enterprise";
  createdAt: Date;
  updatedAt: Date;
}

export interface Design {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  imageUrl: string;
  thumbnailUrl: string | null;
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  designId: string | null;
  userId: string;
  title: string;
  description: string | null;
  productType: "t-shirt" | "hoodie" | "mug" | "phone-case" | "tote-bag" | "poster" | "sticker" | "pillow";
  images: string[];
  basePrice: number;
  sellingPrice: number;
  supplierId: string;
  supplierSku: string | null;
  marketplaceIds: string[];
  status: "draft" | "published" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  marketplaceId: string;
  marketplaceOrderId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: Record<string, string>;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  supplierCost: number;
  profit: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  trackingNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  region: "india" | "global";
  apiKey: string | null;
  isActive: boolean;
  createdAt: Date;
}

export interface Marketplace {
  id: string;
  name: string;
  platform: "etsy" | "amazon-merch" | "shopify" | "woocommerce" | "ebay";
  apiKey: string | null;
  apiSecret: string | null;
  storeName: string | null;
  isActive: boolean;
  createdAt: Date;
}

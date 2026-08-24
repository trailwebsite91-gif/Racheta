import { relations } from "drizzle-orm/relations";

// ── Users ────────────────────────────────────────────────────────────────────
import {
  users,
  profiles,
  sellers,
  addresses,
  wishlists,
  notifications,
} from "./users";

// ── Products ─────────────────────────────────────────────────────────────────
import {
  productCategories,
  products,
  productVariants,
  productImages,
  designs,
  reviews,
  coupons,
} from "./products";

// ── Orders ───────────────────────────────────────────────────────────────────
import { orders, orderItems, transactions } from "./orders";

// ── Suppliers ────────────────────────────────────────────────────────────────
import { suppliers, supplierProducts, supplierConnections } from "./suppliers";

// ── Marketplaces ─────────────────────────────────────────────────────────────
import { marketplaceConnections, marketplaceListings } from "./marketplaces";

// ── Analytics ────────────────────────────────────────────────────────────────
import { analyticsEvents, sellerAnalytics } from "./analytics";

// ── CMS ──────────────────────────────────────────────────────────────────────
import { posts } from "./cms";

// ═══════════════════════════════════════════════════════════════════════════════
// Relations
// ═══════════════════════════════════════════════════════════════════════════════

// ── Users → Profiles / Sellers / Addresses / Wishlists / Notifications ───────

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  seller: one(sellers, {
    fields: [users.id],
    references: [sellers.userId],
  }),
  addresses: many(addresses),
  wishlists: many(wishlists),
  notifications: many(notifications),
  orders: many(orders, { relationName: "buyer" }),
  reviews: many(reviews),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export const sellersRelations = relations(sellers, ({ one, many }) => ({
  user: one(users, {
    fields: [sellers.userId],
    references: [users.id],
  }),
  products: many(products),
  designs: many(designs),
  coupons: many(coupons),
  supplierConnections: many(supplierConnections),
  marketplaceConnections: many(marketplaceConnections),
  orders: many(orders, { relationName: "sellerOrders" }),
  analyticsEvents: many(analyticsEvents),
  sellerAnalytics: many(sellerAnalytics),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  user: one(users, {
    fields: [wishlists.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [wishlists.productId],
    references: [products.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// ── Products ─────────────────────────────────────────────────────────────────

export const productCategoriesRelations = relations(
  productCategories,
  ({ one, many }) => ({
    parent: one(productCategories, {
      fields: [productCategories.parentId],
      references: [productCategories.id],
      relationName: "subcategories",
    }),
    subcategories: many(productCategories, {
      relationName: "subcategories",
    }),
    products: many(products),
  }),
);

export const productsRelations = relations(products, ({ one, many }) => ({
  seller: one(sellers, {
    fields: [products.sellerId],
    references: [sellers.id],
  }),
  category: one(productCategories, {
    fields: [products.categoryId],
    references: [productCategories.id],
  }),
  variants: many(productVariants),
  images: many(productImages),
  reviews: many(reviews),
  marketplaceListings: many(marketplaceListings),
  wishlists: many(wishlists),
  orderItems: many(orderItems),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    orderItems: many(orderItems),
  }),
);

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const designsRelations = relations(designs, ({ one, many }) => ({
  seller: one(sellers, {
    fields: [designs.sellerId],
    references: [sellers.id],
  }),
  orderItems: many(orderItems),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const couponsRelations = relations(coupons, ({ one }) => ({
  seller: one(sellers, {
    fields: [coupons.sellerId],
    references: [sellers.id],
  }),
}));

// ── Orders ───────────────────────────────────────────────────────────────────

export const ordersRelations = relations(orders, ({ one, many }) => ({
  buyer: one(users, {
    fields: [orders.buyerId],
    references: [users.id],
    relationName: "buyer",
  }),
  seller: one(sellers, {
    fields: [orders.sellerId],
    references: [sellers.id],
    relationName: "sellerOrders",
  }),
  supplier: one(suppliers, {
    fields: [orders.supplierId],
    references: [suppliers.id],
  }),
  items: many(orderItems),
  transactions: many(transactions),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.productVariantId],
    references: [productVariants.id],
  }),
  supplierProduct: one(supplierProducts, {
    fields: [orderItems.supplierProductId],
    references: [supplierProducts.id],
  }),
  design: one(designs, {
    fields: [orderItems.designId],
    references: [designs.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  order: one(orders, {
    fields: [transactions.orderId],
    references: [orders.id],
  }),
}));

// ── Suppliers ────────────────────────────────────────────────────────────────

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  supplierProducts: many(supplierProducts),
  supplierConnections: many(supplierConnections),
  orders: many(orders),
}));

export const supplierProductsRelations = relations(
  supplierProducts,
  ({ one, many }) => ({
    supplier: one(suppliers, {
      fields: [supplierProducts.supplierId],
      references: [suppliers.id],
    }),
    orderItems: many(orderItems),
  }),
);

export const supplierConnectionsRelations = relations(
  supplierConnections,
  ({ one }) => ({
    seller: one(sellers, {
      fields: [supplierConnections.sellerId],
      references: [sellers.id],
    }),
    supplier: one(suppliers, {
      fields: [supplierConnections.supplierId],
      references: [suppliers.id],
    }),
  }),
);

// ── Marketplaces ─────────────────────────────────────────────────────────────

export const marketplaceConnectionsRelations = relations(
  marketplaceConnections,
  ({ one, many }) => ({
    seller: one(sellers, {
      fields: [marketplaceConnections.sellerId],
      references: [sellers.id],
    }),
    listings: many(marketplaceListings),
  }),
);

export const marketplaceListingsRelations = relations(
  marketplaceListings,
  ({ one }) => ({
    product: one(products, {
      fields: [marketplaceListings.productId],
      references: [products.id],
    }),
    connection: one(marketplaceConnections, {
      fields: [marketplaceListings.marketplaceConnectionId],
      references: [marketplaceConnections.id],
    }),
  }),
);

// ── Analytics ────────────────────────────────────────────────────────────────

export const analyticsEventsRelations = relations(analyticsEvents, ({ one }) => ({
  seller: one(sellers, {
    fields: [analyticsEvents.sellerId],
    references: [sellers.id],
  }),
}));

export const sellerAnalyticsRelations = relations(
  sellerAnalytics,
  ({ one }) => ({
    seller: one(sellers, {
      fields: [sellerAnalytics.sellerId],
      references: [sellers.id],
    }),
  }),
);

// ── CMS ──────────────────────────────────────────────────────────────────────

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));

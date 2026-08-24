import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  pgEnum,
  index,
  integer,
  numeric,
} from "drizzle-orm/pg-core";

// ── Enums ────────────────────────────────────────────────────────────────────

export const marketplaceSourceEnum = pgEnum("marketplace_source", [
  "storefront",
  "etsy",
  "amazon_merch",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "processing",
  "printed",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

export const transactionTypeEnum = pgEnum("transaction_type", [
  "sale",
  "refund",
  "fee",
  "payout",
]);

export const transactionGatewayEnum = pgEnum("transaction_gateway", [
  "stripe",
  "razorpay",
]);

// ── Orders ───────────────────────────────────────────────────────────────────

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    buyerId: uuid("buyer_id").notNull(),
    sellerId: uuid("seller_id").notNull(),
    supplierId: uuid("supplier_id"),
    externalOrderId: text("external_order_id"),
    marketplace: marketplaceSourceEnum("marketplace").notNull().default("storefront"),
    status: orderStatusEnum("status").notNull().default("pending"),
    subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
    shipping: numeric("shipping", { precision: 12, scale: 2 }).notNull().default("0"),
    tax: numeric("tax", { precision: 12, scale: 2 }).notNull().default("0"),
    total: numeric("total", { precision: 12, scale: 2 }).notNull(),
    currency: text("currency").notNull().default("USD"),
    trackingNumber: text("tracking_number"),
    trackingUrl: text("tracking_url"),
    shippingAddress: jsonb("shipping_address").$type<{
      name: string;
      line1: string;
      line2?: string;
      city: string;
      state?: string;
      zip: string;
      country: string;
      phone?: string;
    }>(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    buyerIdx: index("idx_orders_buyer_id").on(table.buyerId),
    sellerIdx: index("idx_orders_seller_id").on(table.sellerId),
    supplierIdx: index("idx_orders_supplier_id").on(table.supplierId),
    statusIdx: index("idx_orders_status").on(table.status),
    marketplaceIdx: index("idx_orders_marketplace").on(table.marketplace),
    externalIdx: index("idx_orders_external_order_id").on(table.externalOrderId),
    createdIdx: index("idx_orders_created_at").on(table.createdAt),
    sellerCreatedIdx: index("idx_orders_seller_created").on(
      table.sellerId,
      table.createdAt,
    ),
  }),
);

// ── Order Items ──────────────────────────────────────────────────────────────

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productVariantId: uuid("product_variant_id"),
    supplierProductId: uuid("supplier_product_id"),
    quantity: integer("quantity").notNull().default(1),
    unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
    designId: uuid("design_id"),
    customization: jsonb("customization").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    orderIdx: index("idx_order_items_order_id").on(table.orderId),
    variantIdx: index("idx_order_items_variant_id").on(table.productVariantId),
    supplierProductIdx: index("idx_order_items_supplier_product").on(
      table.supplierProductId,
    ),
    designIdx: index("idx_order_items_design_id").on(table.designId),
  }),
);

// ── Transactions ─────────────────────────────────────────────────────────────

export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "restrict" }),
    type: transactionTypeEnum("type").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    currency: text("currency").notNull().default("USD"),
    gateway: transactionGatewayEnum("gateway").notNull(),
    gatewayTransactionId: text("gateway_transaction_id"),
    status: text("status").notNull().default("pending"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    orderIdx: index("idx_transactions_order_id").on(table.orderId),
    gatewayTxIdx: index("idx_transactions_gateway_tx").on(
      table.gatewayTransactionId,
    ),
    typeIdx: index("idx_transactions_type").on(table.type),
    createdIdx: index("idx_transactions_created_at").on(table.createdAt),
    statusIdx: index("idx_transactions_status").on(table.status),
  }),
);

// ── Type Exports ─────────────────────────────────────────────────────────────

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

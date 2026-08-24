import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  index,
  integer,
  numeric,
} from "drizzle-orm/pg-core";

// ── Enums ────────────────────────────────────────────────────────────────────

export const marketplaceEnum = pgEnum("marketplace", ["etsy", "amazon_merch"]);
export const marketplaceConnectionStatusEnum = pgEnum(
  "marketplace_connection_status",
  ["connected", "disconnected", "error", "expired", "pending"],
);
export const marketplaceListingStatusEnum = pgEnum("marketplace_listing_status", [
  "active",
  "inactive",
  "out_of_stock",
  "error",
]);

// ── Marketplace Connections ──────────────────────────────────────────────────

export const marketplaceConnections = pgTable(
  "marketplace_connections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sellerId: uuid("seller_id").notNull(),
    marketplace: marketplaceEnum("marketplace").notNull(),
    apiKey: text("api_key"),
    shopId: text("shop_id"),
    status: marketplaceConnectionStatusEnum("status")
      .notNull()
      .default("pending"),
    syncSettings: jsonb("sync_settings").$type<{
      autoSync?: boolean;
      syncIntervalMinutes?: number;
      priceMarkup?: number;
      syncInventory?: boolean;
      syncPricing?: boolean;
    }>().default({}),
    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    sellerMarketplaceIdx: index(
      "idx_marketplace_conn_seller_marketplace",
    ).on(table.sellerId, table.marketplace),
    sellerIdx: index("idx_marketplace_conn_seller_id").on(table.sellerId),
    marketplaceIdx: index("idx_marketplace_conn_marketplace").on(
      table.marketplace,
    ),
    statusIdx: index("idx_marketplace_conn_status").on(table.status),
  }),
);

// ── Marketplace Listings ─────────────────────────────────────────────────────

export const marketplaceListings = pgTable(
  "marketplace_listings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id").notNull(),
    marketplaceConnectionId: uuid("marketplace_connection_id")
      .notNull()
      .references(() => marketplaceConnections.id, { onDelete: "cascade" }),
    externalListingId: text("external_listing_id"),
    externalUrl: text("external_url"),
    title: text("title"),
    description: text("description"),
    tags: text("tags").array().default([]),
    price: numeric("price", { precision: 12, scale: 2 }),
    quantity: integer("quantity").default(0),
    status: marketplaceListingStatusEnum("status").notNull().default("inactive"),
    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    productConnIdx: index("idx_marketplace_listings_product_conn").on(
      table.productId,
      table.marketplaceConnectionId,
    ),
    productIdx: index("idx_marketplace_listings_product_id").on(table.productId),
    connIdx: index("idx_marketplace_listings_conn_id").on(
      table.marketplaceConnectionId,
    ),
    externalIdx: index("idx_marketplace_listings_external").on(
      table.externalListingId,
    ),
    statusIdx: index("idx_marketplace_listings_status").on(table.status),
  }),
);

// ── Type Exports ─────────────────────────────────────────────────────────────

export type MarketplaceConnection = typeof marketplaceConnections.$inferSelect;
export type NewMarketplaceConnection = typeof marketplaceConnections.$inferInsert;
export type MarketplaceListing = typeof marketplaceListings.$inferSelect;
export type NewMarketplaceListing = typeof marketplaceListings.$inferInsert;

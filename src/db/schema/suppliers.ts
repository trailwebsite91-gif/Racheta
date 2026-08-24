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

export const supplierRegionEnum = pgEnum("supplier_region", ["india", "global"]);
export const supplierStatusEnum = pgEnum("supplier_status", [
  "active",
  "inactive",
  "testing",
]);
export const supplierConnectionStatusEnum = pgEnum("supplier_connection_status", [
  "connected",
  "disconnected",
  "error",
  "pending",
]);

// ── Suppliers ────────────────────────────────────────────────────────────────

export const suppliers = pgTable(
  "suppliers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    region: supplierRegionEnum("region").notNull(),
    apiBaseUrl: text("api_base_url").notNull(),
    webhookSecret: text("webhook_secret"),
    status: supplierStatusEnum("status").notNull().default("active"),
    supportedCountries: text("supported_countries").array().default([]),
    logo: text("logo"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    slugIdx: index("idx_suppliers_slug").on(table.slug),
    regionIdx: index("idx_suppliers_region").on(table.region),
    statusIdx: index("idx_suppliers_status").on(table.status),
  }),
);

// ── Supplier Products ────────────────────────────────────────────────────────

export const supplierProducts = pgTable(
  "supplier_products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    supplierId: uuid("supplier_id")
      .notNull()
      .references(() => suppliers.id, { onDelete: "cascade" }),
    externalId: text("external_id").notNull(),
    title: text("title").notNull(),
    basePrice: numeric("base_price", { precision: 12, scale: 2 }).notNull(),
    currency: text("currency").notNull().default("USD"),
    category: text("category"),
    variants: jsonb("variants").$type<
      {
        sku: string;
        color?: string;
        size?: string;
        price?: number;
        stock?: number;
      }[]
    >().default([]),
    shippingProfiles: jsonb("shipping_profiles").$type<
      {
        country: string;
        rate: number;
        estimatedDays: number;
      }[]
    >().default([]),
    productionDays: integer("production_days").default(3),
    mockupTemplates: jsonb("mockup_templates").$type<
      {
        view: string;
        url: string;
        width: number;
        height: number;
        printArea: { x: number; y: number; w: number; h: number };
      }[]
    >().default([]),
    availableCountries: text("available_countries").array().default([]),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    supplierExternalIdx: index("idx_supplier_products_supplier_external").on(
      table.supplierId,
      table.externalId,
    ),
    supplierIdx: index("idx_supplier_products_supplier_id").on(table.supplierId),
    externalIdx: index("idx_supplier_products_external_id").on(table.externalId),
    categoryIdx: index("idx_supplier_products_category").on(table.category),
  }),
);

// ── Supplier Connections ─────────────────────────────────────────────────────

export const supplierConnections = pgTable(
  "supplier_connections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sellerId: uuid("seller_id").notNull(),
    supplierId: uuid("supplier_id")
      .notNull()
      .references(() => suppliers.id, { onDelete: "cascade" }),
    apiKey: text("api_key"),
    webhookUrl: text("webhook_url"),
    status: supplierConnectionStatusEnum("status")
      .notNull()
      .default("pending"),
    syncStatus: text("sync_status").default("idle"),
    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    sellerSupplierIdx: index("idx_supplier_connections_seller_supplier").on(
      table.sellerId,
      table.supplierId,
    ),
    sellerIdx: index("idx_supplier_connections_seller_id").on(table.sellerId),
    supplierIdx: index("idx_supplier_connections_supplier_id").on(
      table.supplierId,
    ),
    statusIdx: index("idx_supplier_connections_status").on(table.status),
  }),
);

// ── Type Exports ─────────────────────────────────────────────────────────────

export type Supplier = typeof suppliers.$inferSelect;
export type NewSupplier = typeof suppliers.$inferInsert;
export type SupplierProduct = typeof supplierProducts.$inferSelect;
export type NewSupplierProduct = typeof supplierProducts.$inferInsert;
export type SupplierConnection = typeof supplierConnections.$inferSelect;
export type NewSupplierConnection = typeof supplierConnections.$inferInsert;

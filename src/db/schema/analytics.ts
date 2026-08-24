import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  index,
  integer,
  numeric,
  date,
} from "drizzle-orm/pg-core";

// ── Analytics Events ─────────────────────────────────────────────────────────
//
// Designed for high-volume time-series ingestion. Recommend partitioning by
// month using pg_partman or manual partition DDL for production scale.
// Queries should always include `seller_id` and `timestamp` to hit indexes.

export const analyticsEvents = pgTable(
  "analytics_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sellerId: uuid("seller_id").notNull(),
    event: text("event").notNull(),
    properties: jsonb("properties").$type<Record<string, unknown>>().default({}),
    timestamp: timestamp("timestamp", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    sellerEventTsIdx: index("idx_analytics_events_seller_event_ts").on(
      table.sellerId,
      table.event,
      table.timestamp,
    ),
    sellerTsIdx: index("idx_analytics_events_seller_ts").on(
      table.sellerId,
      table.timestamp,
    ),
    eventIdx: index("idx_analytics_events_event").on(table.event),
    tsIdx: index("idx_analytics_events_timestamp").on(table.timestamp),
  }),
);

// ── Seller Analytics (Materialized Daily Aggregates) ─────────────────────────
//
// Pre-aggregated daily snapshot per seller. Populated by a cron job or
// materialized view. Drives dashboards without scanning raw events.

export const sellerAnalytics = pgTable(
  "seller_analytics",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sellerId: uuid("seller_id").notNull(),
    date: date("date").notNull(),
    revenue: numeric("revenue", { precision: 14, scale: 2 })
      .notNull()
      .default("0"),
    orders: integer("orders").notNull().default(0),
    visitors: integer("visitors").notNull().default(0),
    conversionRate: numeric("conversion_rate", {
      precision: 5,
      scale: 2,
    }).default("0"),
    topProducts: jsonb("top_products").$type<
      { productId: string; title: string; revenue: number; quantity: number }[]
    >().default([]),
    topMarketplaces: jsonb("top_marketplaces").$type<
      { marketplace: string; revenue: number; orders: number }[]
    >().default([]),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    sellerDateIdx: index("idx_seller_analytics_seller_date").on(
      table.sellerId,
      table.date,
    ),
    dateIdx: index("idx_seller_analytics_date").on(table.date),
    revenueIdx: index("idx_seller_analytics_revenue").on(table.revenue),
  }),
);

// ── Type Exports ─────────────────────────────────────────────────────────────

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type NewAnalyticsEvent = typeof analyticsEvents.$inferInsert;
export type SellerAnalytic = typeof sellerAnalytics.$inferSelect;
export type NewSellerAnalytic = typeof sellerAnalytics.$inferInsert;

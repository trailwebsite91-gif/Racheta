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
} from "drizzle-orm/pg-core";

// ── Enums ────────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", ["customer", "seller", "admin"]);
export const sellerStatusEnum = pgEnum("seller_status", [
  "active",
  "suspended",
  "pending",
]);
export const addressTypeEnum = pgEnum("address_type", ["shipping", "billing"]);
export const notificationTypeEnum = pgEnum("notification_type", [
  "order_update",
  "message",
  "system",
  "promotion",
  "review",
]);

// ── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: text("clerk_id").notNull().unique(),
    email: text("email").notNull(),
    name: text("name"),
    role: userRoleEnum("role").notNull().default("customer"),
    avatar: text("avatar"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    clerkIdIdx: index("idx_users_clerk_id").on(table.clerkId),
    emailIdx: index("idx_users_email").on(table.email),
    roleIdx: index("idx_users_role").on(table.role),
    createdIdx: index("idx_users_created_at").on(table.createdAt),
    deletedIdx: index("idx_users_deleted_at").on(table.deletedAt),
  }),
);

// ── Profiles ─────────────────────────────────────────────────────────────────

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    displayName: text("display_name").notNull(),
    bio: text("bio"),
    website: text("website"),
    socialLinks: jsonb("social_links").$type<{
      twitter?: string;
      instagram?: string;
      youtube?: string;
      linkedin?: string;
    }>().default({}),
    preferences: jsonb("preferences").$type<{
      theme?: "light" | "dark" | "system";
      locale?: string;
      emailNotifications?: boolean;
      pushNotifications?: boolean;
    }>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdIdx: index("idx_profiles_user_id").on(table.userId),
  }),
);

// ── Sellers ──────────────────────────────────────────────────────────────────

export const sellers = pgTable(
  "sellers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    storeName: text("store_name").notNull(),
    storeSlug: text("store_slug").notNull().unique(),
    storeDescription: text("store_description"),
    logo: text("logo"),
    banner: text("banner"),
    country: text("country").notNull().default("US"),
    currency: text("currency").notNull().default("USD"),
    commissionTier: text("commission_tier").notNull().default("standard"),
    status: sellerStatusEnum("status").notNull().default("pending"),
    onboardingComplete: boolean("onboarding_complete").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdIdx: index("idx_sellers_user_id").on(table.userId),
    storeSlugIdx: index("idx_sellers_store_slug").on(table.storeSlug),
    statusIdx: index("idx_sellers_status").on(table.status),
    countryIdx: index("idx_sellers_country").on(table.country),
  }),
);

// ── Addresses ────────────────────────────────────────────────────────────────

export const addresses = pgTable(
  "addresses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: addressTypeEnum("type").notNull().default("shipping"),
    name: text("name").notNull(),
    line1: text("line1").notNull(),
    line2: text("line2"),
    city: text("city").notNull(),
    state: text("state"),
    zip: text("zip").notNull(),
    country: text("country").notNull().default("US"),
    phone: text("phone"),
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdIdx: index("idx_addresses_user_id").on(table.userId),
    userIdTypeIdx: index("idx_addresses_user_id_type").on(
      table.userId,
      table.type,
    ),
  }),
);

// ── Wishlists ────────────────────────────────────────────────────────────────

export const wishlists = pgTable(
  "wishlists",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: uuid("product_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdProductIdx: index("idx_wishlists_user_product").on(
      table.userId,
      table.productId,
    ),
    userIdIdx: index("idx_wishlists_user_id").on(table.userId),
  }),
);

// ── Notifications ────────────────────────────────────────────────────────────

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: notificationTypeEnum("type").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    read: boolean("read").notNull().default(false),
    actionUrl: text("action_url"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdReadIdx: index("idx_notifications_user_read").on(
      table.userId,
      table.read,
    ),
    createdIdx: index("idx_notifications_created_at").on(table.createdAt),
  }),
);

// ── Type Exports ─────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Seller = typeof sellers.$inferSelect;
export type NewSeller = typeof sellers.$inferInsert;
export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;
export type Wishlist = typeof wishlists.$inferSelect;
export type NewWishlist = typeof wishlists.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;

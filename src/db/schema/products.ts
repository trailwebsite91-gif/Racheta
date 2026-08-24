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
  real,
} from "drizzle-orm/pg-core";

// ── Enums ────────────────────────────────────────────────────────────────────

export const productStatusEnum = pgEnum("product_status", [
  "draft",
  "published",
  "archived",
]);

export const productImageTypeEnum = pgEnum("product_image_type", [
  "mockup",
  "lifestyle",
  "gallery",
  "thumbnail",
]);

export const couponTypeEnum = pgEnum("coupon_type", ["percentage", "fixed"]);

// ── Product Categories ───────────────────────────────────────────────────────

export const productCategories = pgTable(
  "product_categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    parentId: uuid("parent_id").references(
      (): any => productCategories.id,
      { onDelete: "set null" },
    ),
    icon: text("icon"),
    image: text("image"),
    order: integer("order").notNull().default(0),
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    slugIdx: index("idx_categories_slug").on(table.slug),
    parentIdx: index("idx_categories_parent_id").on(table.parentId),
    orderIdx: index("idx_categories_order").on(table.order),
    featuredIdx: index("idx_categories_featured").on(table.featured),
  }),
);

// ── Products ─────────────────────────────────────────────────────────────────

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sellerId: uuid("seller_id").notNull(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    basePrice: numeric("base_price", { precision: 12, scale: 2 }).notNull(),
    currency: text("currency").notNull().default("USD"),
    status: productStatusEnum("status").notNull().default("draft"),
    categoryId: uuid("category_id").references(
      () => productCategories.id,
      { onDelete: "set null" },
    ),
    tags: text("tags").array().default([]),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    version: integer("version").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    sellerSlugIdx: index("idx_products_seller_slug").on(
      table.sellerId,
      table.slug,
    ),
    sellerIdx: index("idx_products_seller_id").on(table.sellerId),
    statusIdx: index("idx_products_status").on(table.status),
    categoryIdx: index("idx_products_category_id").on(table.categoryId),
    createdIdx: index("idx_products_created_at").on(table.createdAt),
    deletedIdx: index("idx_products_deleted_at").on(table.deletedAt),
    tagsIdx: index("idx_products_tags").using("gin", table.tags),
  }),
);

// ── Product Variants ─────────────────────────────────────────────────────────

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    sku: text("sku").notNull(),
    color: text("color"),
    size: text("size"),
    price: numeric("price", { precision: 12, scale: 2 }),
    stock: integer("stock").default(0),
    mockupUrls: jsonb("mockup_urls").$type<Record<string, string>>().default({}),
    attributes: jsonb("attributes").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    productIdx: index("idx_variants_product_id").on(table.productId),
    skuIdx: index("idx_variants_sku").on(table.sku),
    productSkuIdx: index("idx_variants_product_sku").on(
      table.productId,
      table.sku,
    ),
    colorSizeIdx: index("idx_variants_color_size").on(table.color, table.size),
  }),
);

// ── Product Images ───────────────────────────────────────────────────────────

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    alt: text("alt"),
    order: integer("order").notNull().default(0),
    type: productImageTypeEnum("type").notNull().default("gallery"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    productOrderIdx: index("idx_images_product_order").on(
      table.productId,
      table.order,
    ),
    productTypeIdx: index("idx_images_product_type").on(
      table.productId,
      table.type,
    ),
  }),
);

// ── Designs ──────────────────────────────────────────────────────────────────

export const designs = pgTable(
  "designs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sellerId: uuid("seller_id").notNull(),
    name: text("name").notNull(),
    fileUrl: text("file_url").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    fileType: text("file_type").notNull(),
    width: integer("width"),
    height: integer("height"),
    dpi: integer("dpi").default(300),
    layers: jsonb("layers").$type<
      { name: string; visible: boolean; data: unknown }[]
    >().default([]),
    isTemplate: boolean("is_template").notNull().default(false),
    aiGenerated: boolean("ai_generated").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    sellerIdx: index("idx_designs_seller_id").on(table.sellerId),
    nameIdx: index("idx_designs_name").on(table.name),
    aiGenIdx: index("idx_designs_ai_generated").on(table.aiGenerated),
    deletedIdx: index("idx_designs_deleted_at").on(table.deletedAt),
  }),
);

// ── Reviews ──────────────────────────────────────────────────────────────────

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull(),
    rating: integer("rating").notNull(),
    title: text("title"),
    body: text("body"),
    verified: boolean("verified").notNull().default(false),
    helpfulCount: integer("helpful_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    productIdx: index("idx_reviews_product_id").on(table.productId),
    userIdx: index("idx_reviews_user_id").on(table.userId),
    productUserIdx: index("idx_reviews_product_user").on(
      table.productId,
      table.userId,
    ),
    ratingIdx: index("idx_reviews_rating").on(table.rating),
    createdIdx: index("idx_reviews_created_at").on(table.createdAt),
  }),
);

// ── Coupons ──────────────────────────────────────────────────────────────────

export const coupons = pgTable(
  "coupons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sellerId: uuid("seller_id").notNull(),
    code: text("code").notNull(),
    type: couponTypeEnum("type").notNull(),
    value: numeric("value", { precision: 12, scale: 2 }).notNull(),
    minOrder: numeric("min_order", { precision: 12, scale: 2 }).default("0"),
    maxUses: integer("max_uses"),
    usedCount: integer("used_count").notNull().default(0),
    startsAt: timestamp("starts_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    applicableProducts: uuid("applicable_products").array(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    sellerCodeIdx: index("idx_coupons_seller_code").on(
      table.sellerId,
      table.code,
    ),
    codeIdx: index("idx_coupons_code").on(table.code),
    expiresIdx: index("idx_coupons_expires_at").on(table.expiresAt),
    sellerIdx: index("idx_coupons_seller_id").on(table.sellerId),
  }),
);

// ── Type Exports ─────────────────────────────────────────────────────────────

export type ProductCategory = typeof productCategories.$inferSelect;
export type NewProductCategory = typeof productCategories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;
export type ProductImage = typeof productImages.$inferSelect;
export type NewProductImage = typeof productImages.$inferInsert;
export type Design = typeof designs.$inferSelect;
export type NewDesign = typeof designs.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Coupon = typeof coupons.$inferSelect;
export type NewCoupon = typeof coupons.$inferInsert;

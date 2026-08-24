-- ═══════════════════════════════════════════════════════════════════════════════
-- SmartPrint Studio — Initial PostgreSQL Schema
-- Migration: 0000_initial
-- Generated: 2026-07-22
-- ═══════════════════════════════════════════════════════════════════════════════

-- Extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Extension for GIN indexes on array/jsonb columns
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- ═══════════════════════════════════════════════════════════════════════════════
-- ENUMS
-- ═══════════════════════════════════════════════════════════════════════════════

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'seller', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE seller_status AS ENUM ('active', 'suspended', 'pending');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE address_type AS ENUM ('shipping', 'billing');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('order_update', 'message', 'system', 'promotion', 'review');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE product_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE product_image_type AS ENUM ('mockup', 'lifestyle', 'gallery', 'thumbnail');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE coupon_type AS ENUM ('percentage', 'fixed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE supplier_region AS ENUM ('india', 'global');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE supplier_status AS ENUM ('active', 'inactive', 'testing');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE supplier_connection_status AS ENUM ('connected', 'disconnected', 'error', 'pending');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE marketplace_source AS ENUM ('storefront', 'etsy', 'amazon_merch');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'processing', 'printed', 'shipped', 'delivered', 'cancelled', 'refunded');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('sale', 'refund', 'fee', 'payout');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_gateway AS ENUM ('stripe', 'razorpay');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE marketplace AS ENUM ('etsy', 'amazon_merch');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE marketplace_connection_status AS ENUM ('connected', 'disconnected', 'error', 'expired', 'pending');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE marketplace_listing_status AS ENUM ('active', 'inactive', 'out_of_stock', 'error');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════════
-- AUTO-UPDATED_AT TRIGGER FUNCTION
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════════════════════
-- CORE TABLES: USERS / PROFILES / SELLERS
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id        TEXT NOT NULL UNIQUE,
    email           TEXT NOT NULL,
    name            TEXT,
    role            user_role NOT NULL DEFAULT 'customer',
    avatar          TEXT,
    metadata        JSONB DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX idx_users_clerk_id    ON users (clerk_id);
CREATE INDEX        idx_users_email       ON users (email);
CREATE INDEX        idx_users_role        ON users (role);
CREATE INDEX        idx_users_created_at  ON users (created_at);
CREATE INDEX        idx_users_deleted_at  ON users (deleted_at);

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Profiles ─────────────────────────────────────────────────────────────────

CREATE TABLE profiles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    display_name    TEXT NOT NULL,
    bio             TEXT,
    website         TEXT,
    social_links    JSONB DEFAULT '{}'::jsonb,
    preferences     JSONB DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_profiles_user_id ON profiles (user_id);

CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Sellers ──────────────────────────────────────────────────────────────────

CREATE TABLE sellers (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    store_name          TEXT NOT NULL,
    store_slug          TEXT NOT NULL UNIQUE,
    store_description   TEXT,
    logo                TEXT,
    banner              TEXT,
    country             TEXT NOT NULL DEFAULT 'US',
    currency            TEXT NOT NULL DEFAULT 'USD',
    commission_tier     TEXT NOT NULL DEFAULT 'standard',
    status              seller_status NOT NULL DEFAULT 'pending',
    onboarding_complete BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_sellers_user_id    ON sellers (user_id);
CREATE UNIQUE INDEX idx_sellers_store_slug ON sellers (store_slug);
CREATE INDEX        idx_sellers_status     ON sellers (status);
CREATE INDEX        idx_sellers_country    ON sellers (country);

CREATE TRIGGER trg_sellers_updated_at
    BEFORE UPDATE ON sellers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════════════════
-- PRODUCT CATEGORIES
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE product_categories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    parent_id       UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    icon            TEXT,
    image           TEXT,
    "order"         INTEGER NOT NULL DEFAULT 0,
    featured        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_categories_slug       ON product_categories (slug);
CREATE INDEX        idx_categories_parent_id  ON product_categories (parent_id);
CREATE INDEX        idx_categories_order      ON product_categories ("order");
CREATE INDEX        idx_categories_featured   ON product_categories (featured);

CREATE TRIGGER trg_product_categories_updated_at
    BEFORE UPDATE ON product_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════════════════
-- PRODUCTS
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE products (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id       UUID NOT NULL,
    title           TEXT NOT NULL,
    slug            TEXT NOT NULL,
    description     TEXT,
    base_price      NUMERIC(12,2) NOT NULL,
    currency        TEXT NOT NULL DEFAULT 'USD',
    status          product_status NOT NULL DEFAULT 'draft',
    category_id     UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    tags            TEXT[] DEFAULT '{}'::text[],
    seo_title       TEXT,
    seo_description TEXT,
    metadata        JSONB DEFAULT '{}'::jsonb,
    version         INTEGER NOT NULL DEFAULT 1,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX idx_products_seller_slug   ON products (seller_id, slug);
CREATE INDEX        idx_products_seller_id     ON products (seller_id);
CREATE INDEX        idx_products_status        ON products (status);
CREATE INDEX        idx_products_category_id   ON products (category_id);
CREATE INDEX        idx_products_created_at    ON products (created_at);
CREATE INDEX        idx_products_deleted_at    ON products (deleted_at);
CREATE INDEX        idx_products_tags          ON products USING GIN (tags);

CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Product Variants ─────────────────────────────────────────────────────────

CREATE TABLE product_variants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku             TEXT NOT NULL,
    color           TEXT,
    size            TEXT,
    price           NUMERIC(12,2),
    stock           INTEGER DEFAULT 0,
    mockup_urls     JSONB DEFAULT '{}'::jsonb,
    attributes      JSONB DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX        idx_variants_product_id   ON product_variants (product_id);
CREATE UNIQUE INDEX idx_variants_sku          ON product_variants (sku);
CREATE UNIQUE INDEX idx_variants_product_sku  ON product_variants (product_id, sku);
CREATE INDEX        idx_variants_color_size   ON product_variants (color, size);

CREATE TRIGGER trg_product_variants_updated_at
    BEFORE UPDATE ON product_variants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Product Images ───────────────────────────────────────────────────────────

CREATE TABLE product_images (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url             TEXT NOT NULL,
    alt             TEXT,
    "order"         INTEGER NOT NULL DEFAULT 0,
    type            product_image_type NOT NULL DEFAULT 'gallery',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_images_product_order ON product_images (product_id, "order");
CREATE INDEX idx_images_product_type  ON product_images (product_id, type);

-- ── Designs ──────────────────────────────────────────────────────────────────

CREATE TABLE designs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id       UUID NOT NULL,
    name            TEXT NOT NULL,
    file_url        TEXT NOT NULL,
    thumbnail_url   TEXT,
    file_type       TEXT NOT NULL,
    width           INTEGER,
    height          INTEGER,
    dpi             INTEGER DEFAULT 300,
    layers          JSONB DEFAULT '[]'::jsonb,
    is_template     BOOLEAN NOT NULL DEFAULT FALSE,
    ai_generated    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_designs_seller_id     ON designs (seller_id);
CREATE INDEX idx_designs_name          ON designs (name);
CREATE INDEX idx_designs_ai_generated  ON designs (ai_generated);
CREATE INDEX idx_designs_deleted_at    ON designs (deleted_at);

CREATE TRIGGER trg_designs_updated_at
    BEFORE UPDATE ON designs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Reviews ──────────────────────────────────────────────────────────────────

CREATE TABLE reviews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL,
    rating          INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title           TEXT,
    body            TEXT,
    verified        BOOLEAN NOT NULL DEFAULT FALSE,
    helpful_count   INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX        idx_reviews_product_id    ON reviews (product_id);
CREATE INDEX        idx_reviews_user_id       ON reviews (user_id);
CREATE UNIQUE INDEX idx_reviews_product_user  ON reviews (product_id, user_id);
CREATE INDEX        idx_reviews_rating        ON reviews (rating);
CREATE INDEX        idx_reviews_created_at    ON reviews (created_at);

CREATE TRIGGER trg_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Coupons ──────────────────────────────────────────────────────────────────

CREATE TABLE coupons (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id           UUID NOT NULL,
    code                TEXT NOT NULL,
    type                coupon_type NOT NULL,
    value               NUMERIC(12,2) NOT NULL,
    min_order           NUMERIC(12,2) DEFAULT 0,
    max_uses            INTEGER,
    used_count          INTEGER NOT NULL DEFAULT 0,
    starts_at           TIMESTAMPTZ,
    expires_at          TIMESTAMPTZ,
    applicable_products UUID[],
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_coupons_seller_code ON coupons (seller_id, code);
CREATE INDEX        idx_coupons_code        ON coupons (code);
CREATE INDEX        idx_coupons_expires_at  ON coupons (expires_at);
CREATE INDEX        idx_coupons_seller_id   ON coupons (seller_id);

CREATE TRIGGER trg_coupons_updated_at
    BEFORE UPDATE ON coupons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════════════════
-- SUPPLIERS
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE suppliers (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                TEXT NOT NULL,
    slug                TEXT NOT NULL UNIQUE,
    region              supplier_region NOT NULL,
    api_base_url        TEXT NOT NULL,
    webhook_secret      TEXT,
    status              supplier_status NOT NULL DEFAULT 'active',
    supported_countries TEXT[] DEFAULT '{}'::text[],
    logo                TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_suppliers_slug   ON suppliers (slug);
CREATE INDEX        idx_suppliers_region ON suppliers (region);
CREATE INDEX        idx_suppliers_status ON suppliers (status);

CREATE TRIGGER trg_suppliers_updated_at
    BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Supplier Products ────────────────────────────────────────────────────────

CREATE TABLE supplier_products (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id         UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    external_id         TEXT NOT NULL,
    title               TEXT NOT NULL,
    base_price          NUMERIC(12,2) NOT NULL,
    currency            TEXT NOT NULL DEFAULT 'USD',
    category            TEXT,
    variants            JSONB DEFAULT '[]'::jsonb,
    shipping_profiles   JSONB DEFAULT '[]'::jsonb,
    production_days     INTEGER DEFAULT 3,
    mockup_templates    JSONB DEFAULT '[]'::jsonb,
    available_countries TEXT[] DEFAULT '{}'::text[],
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_supplier_products_supplier_external ON supplier_products (supplier_id, external_id);
CREATE INDEX        idx_supplier_products_supplier_id        ON supplier_products (supplier_id);
CREATE INDEX        idx_supplier_products_external_id        ON supplier_products (external_id);
CREATE INDEX        idx_supplier_products_category           ON supplier_products (category);

CREATE TRIGGER trg_supplier_products_updated_at
    BEFORE UPDATE ON supplier_products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Supplier Connections ─────────────────────────────────────────────────────

CREATE TABLE supplier_connections (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id       UUID NOT NULL,
    supplier_id     UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    api_key         TEXT,
    webhook_url     TEXT,
    status          supplier_connection_status NOT NULL DEFAULT 'pending',
    sync_status     TEXT DEFAULT 'idle',
    last_synced_at  TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_supplier_connections_seller_supplier ON supplier_connections (seller_id, supplier_id);
CREATE INDEX        idx_supplier_connections_seller_id       ON supplier_connections (seller_id);
CREATE INDEX        idx_supplier_connections_supplier_id     ON supplier_connections (supplier_id);
CREATE INDEX        idx_supplier_connections_status          ON supplier_connections (status);

CREATE TRIGGER trg_supplier_connections_updated_at
    BEFORE UPDATE ON supplier_connections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════════════════
-- ORDERS
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE orders (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id            UUID NOT NULL,
    seller_id           UUID NOT NULL,
    supplier_id         UUID,
    external_order_id   TEXT,
    marketplace         marketplace_source NOT NULL DEFAULT 'storefront',
    status              order_status NOT NULL DEFAULT 'pending',
    subtotal            NUMERIC(12,2) NOT NULL,
    shipping            NUMERIC(12,2) NOT NULL DEFAULT 0,
    tax                 NUMERIC(12,2) NOT NULL DEFAULT 0,
    total               NUMERIC(12,2) NOT NULL,
    currency            TEXT NOT NULL DEFAULT 'USD',
    tracking_number     TEXT,
    tracking_url        TEXT,
    shipping_address    JSONB,
    metadata            JSONB DEFAULT '{}'::jsonb,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_buyer_id        ON orders (buyer_id);
CREATE INDEX idx_orders_seller_id       ON orders (seller_id);
CREATE INDEX idx_orders_supplier_id     ON orders (supplier_id);
CREATE INDEX idx_orders_status          ON orders (status);
CREATE INDEX idx_orders_marketplace     ON orders (marketplace);
CREATE INDEX idx_orders_external_order  ON orders (external_order_id);
CREATE INDEX idx_orders_created_at      ON orders (created_at);
CREATE INDEX idx_orders_seller_created  ON orders (seller_id, created_at);

CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Order Items ──────────────────────────────────────────────────────────────

CREATE TABLE order_items (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id            UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_variant_id  UUID,
    supplier_product_id UUID,
    quantity            INTEGER NOT NULL DEFAULT 1,
    unit_price          NUMERIC(12,2) NOT NULL,
    design_id           UUID,
    customization       JSONB DEFAULT '{}'::jsonb,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id         ON order_items (order_id);
CREATE INDEX idx_order_items_variant_id       ON order_items (product_variant_id);
CREATE INDEX idx_order_items_supplier_product ON order_items (supplier_product_id);
CREATE INDEX idx_order_items_design_id        ON order_items (design_id);

-- ── Transactions ─────────────────────────────────────────────────────────────

CREATE TABLE transactions (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id                UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    type                    transaction_type NOT NULL,
    amount                  NUMERIC(12,2) NOT NULL,
    currency                TEXT NOT NULL DEFAULT 'USD',
    gateway                 transaction_gateway NOT NULL,
    gateway_transaction_id  TEXT,
    status                  TEXT NOT NULL DEFAULT 'pending',
    metadata                JSONB DEFAULT '{}'::jsonb,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX        idx_transactions_order_id    ON transactions (order_id);
CREATE UNIQUE INDEX idx_transactions_gateway_tx   ON transactions (gateway_transaction_id);
CREATE INDEX        idx_transactions_type        ON transactions (type);
CREATE INDEX        idx_transactions_created_at  ON transactions (created_at);
CREATE INDEX        idx_transactions_status      ON transactions (status);

-- ═══════════════════════════════════════════════════════════════════════════════
-- MARKETPLACES
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE marketplace_connections (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id       UUID NOT NULL,
    marketplace     marketplace NOT NULL,
    api_key         TEXT,
    shop_id         TEXT,
    status          marketplace_connection_status NOT NULL DEFAULT 'pending',
    sync_settings   JSONB DEFAULT '{}'::jsonb,
    last_synced_at  TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_marketplace_conn_seller_marketplace ON marketplace_connections (seller_id, marketplace);
CREATE INDEX        idx_marketplace_conn_seller_id           ON marketplace_connections (seller_id);
CREATE INDEX        idx_marketplace_conn_marketplace         ON marketplace_connections (marketplace);
CREATE INDEX        idx_marketplace_conn_status              ON marketplace_connections (status);

CREATE TRIGGER trg_marketplace_connections_updated_at
    BEFORE UPDATE ON marketplace_connections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Marketplace Listings ─────────────────────────────────────────────────────

CREATE TABLE marketplace_listings (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id                  UUID NOT NULL,
    marketplace_connection_id   UUID NOT NULL REFERENCES marketplace_connections(id) ON DELETE CASCADE,
    external_listing_id         TEXT,
    external_url                TEXT,
    title                       TEXT,
    description                 TEXT,
    tags                        TEXT[] DEFAULT '{}'::text[],
    price                       NUMERIC(12,2),
    quantity                    INTEGER DEFAULT 0,
    status                      marketplace_listing_status NOT NULL DEFAULT 'inactive',
    last_synced_at              TIMESTAMPTZ,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_marketplace_listings_product_conn   ON marketplace_listings (product_id, marketplace_connection_id);
CREATE INDEX        idx_marketplace_listings_product_id     ON marketplace_listings (product_id);
CREATE INDEX        idx_marketplace_listings_conn_id        ON marketplace_listings (marketplace_connection_id);
CREATE INDEX        idx_marketplace_listings_external       ON marketplace_listings (external_listing_id);
CREATE INDEX        idx_marketplace_listings_status         ON marketplace_listings (status);

CREATE TRIGGER trg_marketplace_listings_updated_at
    BEFORE UPDATE ON marketplace_listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════════════════
-- ANALYTICS (partitioning-ready)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE analytics_events (
    id              UUID DEFAULT gen_random_uuid(),
    seller_id       UUID NOT NULL,
    event           TEXT NOT NULL,
    properties      JSONB DEFAULT '{}'::jsonb,
    timestamp       TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (timestamp);

-- Create initial partitions: current month + next 2 months
-- Adjust these ranges based on deployment date
DO $$
DECLARE
    start_date DATE;
    end_date   DATE;
    part_name  TEXT;
BEGIN
    start_date := date_trunc('month', NOW())::DATE;
    FOR i IN 0..2 LOOP
        start_date := date_trunc('month', NOW())::DATE + (i || ' months')::INTERVAL;
        end_date   := start_date + INTERVAL '1 month';
        part_name  := 'analytics_events_' || to_char(start_date, 'YYYY_MM');
        EXECUTE format(
            'CREATE TABLE IF NOT EXISTS %I PARTITION OF analytics_events FOR VALUES FROM (%L) TO (%L)',
            part_name, start_date, end_date
        );
    END LOOP;
END $$;

-- Indexes on the partitioned table cascade to partitions
CREATE INDEX idx_analytics_events_seller_event_ts ON analytics_events (seller_id, event, timestamp);
CREATE INDEX idx_analytics_events_seller_ts       ON analytics_events (seller_id, timestamp);
CREATE INDEX idx_analytics_events_event           ON analytics_events (event);
CREATE INDEX idx_analytics_events_timestamp       ON analytics_events (timestamp);

-- ── Seller Analytics (daily pre-aggregated) ──────────────────────────────────

CREATE TABLE seller_analytics (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id        UUID NOT NULL,
    date             DATE NOT NULL,
    revenue          NUMERIC(14,2) NOT NULL DEFAULT 0,
    orders           INTEGER NOT NULL DEFAULT 0,
    visitors         INTEGER NOT NULL DEFAULT 0,
    conversion_rate  NUMERIC(5,2) DEFAULT 0,
    top_products     JSONB DEFAULT '[]'::jsonb,
    top_marketplaces JSONB DEFAULT '[]'::jsonb,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_seller_analytics_seller_date ON seller_analytics (seller_id, date);
CREATE INDEX        idx_seller_analytics_date         ON seller_analytics (date);
CREATE INDEX        idx_seller_analytics_revenue      ON seller_analytics (revenue);

-- ═══════════════════════════════════════════════════════════════════════════════
-- CMS / BLOG
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE posts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id       UUID NOT NULL,
    title           TEXT NOT NULL,
    slug            TEXT NOT NULL,
    excerpt         TEXT,
    content         JSONB,
    featured_image  TEXT,
    status          post_status NOT NULL DEFAULT 'draft',
    category        TEXT,
    tags            TEXT[] DEFAULT '{}'::text[],
    seo_title       TEXT,
    seo_description TEXT,
    published_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_posts_slug          ON posts (slug);
CREATE INDEX        idx_posts_author_id     ON posts (author_id);
CREATE INDEX        idx_posts_status        ON posts (status);
CREATE INDEX        idx_posts_published_at  ON posts (published_at);
CREATE INDEX        idx_posts_category      ON posts (category);
CREATE INDEX        idx_posts_author_status ON posts (author_id, status);

CREATE TRIGGER trg_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════════════════
-- OTHER: ADDRESSES / WISHLISTS / NOTIFICATIONS
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE addresses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type            address_type NOT NULL DEFAULT 'shipping',
    name            TEXT NOT NULL,
    line1           TEXT NOT NULL,
    line2           TEXT,
    city            TEXT NOT NULL,
    state           TEXT,
    zip             TEXT NOT NULL,
    country         TEXT NOT NULL DEFAULT 'US',
    phone           TEXT,
    is_default      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_addresses_user_id       ON addresses (user_id);
CREATE INDEX idx_addresses_user_id_type  ON addresses (user_id, type);

CREATE TRIGGER trg_addresses_updated_at
    BEFORE UPDATE ON addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Wishlists ────────────────────────────────────────────────────────────────

CREATE TABLE wishlists (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id      UUID NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_wishlists_user_product ON wishlists (user_id, product_id);
CREATE INDEX        idx_wishlists_user_id      ON wishlists (user_id);

-- ── Notifications ────────────────────────────────────────────────────────────

CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type            notification_type NOT NULL,
    title           TEXT NOT NULL,
    body            TEXT NOT NULL,
    read            BOOLEAN NOT NULL DEFAULT FALSE,
    action_url      TEXT,
    metadata        JSONB DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_read  ON notifications (user_id, read);
CREATE INDEX idx_notifications_created_at ON notifications (created_at);

-- ═══════════════════════════════════════════════════════════════════════════════
-- PARTITION MANAGEMENT HELPER (monthly cron job)
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- Run monthly via pg_cron or external scheduler to create next month's
-- analytics_events partition before it's needed.

CREATE OR REPLACE FUNCTION create_future_analytics_partitions()
RETURNS void AS $$
DECLARE
    start_date DATE;
    end_date   DATE;
    part_name  TEXT;
BEGIN
    start_date := date_trunc('month', NOW() + INTERVAL '1 month')::DATE;
    end_date   := start_date + INTERVAL '1 month';
    part_name  := 'analytics_events_' || to_char(start_date, 'YYYY_MM');
    BEGIN
        EXECUTE format(
            'CREATE TABLE IF NOT EXISTS %I PARTITION OF analytics_events FOR VALUES FROM (%L) TO (%L)',
            part_name, start_date, end_date
        );
    EXCEPTION WHEN duplicate_table THEN
        -- partition already exists, skip
        NULL;
    END;
END;
$$ LANGUAGE plpgsql;

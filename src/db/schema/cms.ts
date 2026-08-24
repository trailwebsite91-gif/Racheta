import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  pgEnum,
  index,
  integer,
} from "drizzle-orm/pg-core";

// ── Enums ────────────────────────────────────────────────────────────────────

export const postStatusEnum = pgEnum("post_status", [
  "draft",
  "published",
  "archived",
]);

// ── Posts ────────────────────────────────────────────────────────────────────

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    authorId: uuid("author_id").notNull(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    excerpt: text("excerpt"),
    content: jsonb("content").$type<{
      type: string;
      content?: unknown[];
      text?: string;
    }>(),
    featuredImage: text("featured_image"),
    status: postStatusEnum("status").notNull().default("draft"),
    category: text("category"),
    tags: text("tags").array().default([]),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    slugIdx: index("idx_posts_slug").on(table.slug),
    authorIdx: index("idx_posts_author_id").on(table.authorId),
    statusIdx: index("idx_posts_status").on(table.status),
    publishedIdx: index("idx_posts_published_at").on(table.publishedAt),
    categoryIdx: index("idx_posts_category").on(table.category),
    authorStatusIdx: index("idx_posts_author_status").on(
      table.authorId,
      table.status,
    ),
  }),
);

// ── Type Exports ─────────────────────────────────────────────────────────────

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

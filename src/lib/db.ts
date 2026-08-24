import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

// Validate DATABASE_URL at startup (only logs a warning during build —
// the actual connection failure surfaces at runtime when a route uses the DB)
if (!process.env.DATABASE_URL) {
  console.error(
    "DATABASE_URL is not set. Please add it to your .env file.\n" +
    "Example: DATABASE_URL=postgres://user:password@host/dbname"
  );
}

const sql = neon(process.env.DATABASE_URL ?? "postgres://dummy");
export const db = drizzle(sql, { schema });

// Type exports for convenience
export type DbClient = typeof db;
export type DbSchema = typeof schema;

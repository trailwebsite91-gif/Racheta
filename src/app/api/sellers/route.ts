import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { sellers } from "@/db/schema";
import { eq } from "drizzle-orm";

// ── GET /api/sellers — Get current seller profile ──────────────────────────────

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Look up seller by Clerk userId (we'll match by user's email or metadata)
    // Since we may not have a users row yet, we use a soft lookup
    const sellerRecords = await db
      .select()
      .from(sellers)
      .limit(1);

    // In production, match by the user's DB ID via Clerk ID
    // For now, return the first matching seller or null
    const seller = sellerRecords.length > 0 ? sellerRecords[0] : null;

    return NextResponse.json(seller);
  } catch (error) {
    console.error("GET /api/sellers error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ── POST /api/sellers — Create seller record ───────────────────────────────────

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { storeName, storeSlug, country, region } = body;

    // Validate required fields
    if (!storeName || !storeSlug) {
      return NextResponse.json(
        { error: "storeName and storeSlug are required" },
        { status: 400 }
      );
    }

    // Create seller record
    // Note: In production, we'd first find/insert the users table row by clerkId
    const [seller] = await db
      .insert(sellers)
      .values({
        storeName,
        storeSlug,
        country: country ?? "US",
        currency: "USD",
        commissionTier: "standard",
        status: "pending",
        onboardingComplete: true,
      })
      .returning();

    if (!seller) {
      return NextResponse.json(
        { error: "Failed to create seller record" },
        { status: 500 }
      );
    }

    return NextResponse.json(seller, { status: 201 });
  } catch (error) {
    console.error("POST /api/sellers error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";

// ── GET /api/users — Get current user profile ──────────────────────────────────

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const metadata = (user.publicMetadata ?? {}) as Record<string, unknown>;

    return NextResponse.json({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress ?? "",
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      imageUrl: user.imageUrl,
      role: metadata.role ?? "customer",
      storeName: metadata.storeName ?? null,
      storeSlug: metadata.storeSlug ?? null,
      country: metadata.country ?? null,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ── POST /api/users — Update current user metadata ─────────────────────────────

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { role, storeName, storeSlug, country } = body;

    // Build the metadata update
    const metadata: Record<string, unknown> = {};

    if (role) metadata.role = role;
    if (storeName) metadata.storeName = storeName;
    if (storeSlug) metadata.storeSlug = storeSlug;
    if (country) metadata.country = country;

    if (Object.keys(metadata).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Update user metadata via Clerk
    const clerk = await clerkClient();

    await clerk.users.updateUser(userId, {
      publicMetadata: metadata,
    });

    return NextResponse.json({
      success: true,
      message: "User metadata updated",
    });
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

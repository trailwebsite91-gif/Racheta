import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// ── POST /api/webhooks/clerk — Handle Clerk webhook events ─────────────────────
//
// This endpoint receives events from Clerk when users are created, updated,
// or deleted. It syncs the data to our own database.
//
// IMPORTANT: This route MUST be public — Clerk signs each request with
// your webhook secret, which is verified below.

interface ClerkEmailAddress {
  email_address: string;
  id: string;
}

interface ClerkWebhookData {
  id: string;
  email_addresses?: ClerkEmailAddress[];
  first_name?: string;
  last_name?: string;
  image_url?: string;
  public_metadata?: Record<string, unknown>;
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  // Verify the webhook signature using Svix
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing required Svix headers" },
      { status: 400 }
    );
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: { type: string; data: ClerkWebhookData };

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as { type: string; data: ClerkWebhookData };
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  const { type: eventType, data } = evt;

  try {
    switch (eventType) {
      case "user.created": {
        const primaryEmail =
          data.email_addresses && data.email_addresses.length > 0
            ? data.email_addresses[0].email_address
            : "";

        const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || null;

        await db
          .insert(users)
          .values({
            clerkId: data.id,
            email: primaryEmail,
            name,
            role: "customer",
            avatar: data.image_url ?? null,
            metadata: data.public_metadata ?? {},
          })
          .onConflictDoUpdate({
            target: users.clerkId,
            set: {
              email: primaryEmail,
              name,
              avatar: data.image_url ?? null,
              updatedAt: new Date(),
            },
          });

        console.log(`User created: ${data.id} (${primaryEmail})`);
        break;
      }

      case "user.updated": {
        const primaryEmail =
          data.email_addresses && data.email_addresses.length > 0
            ? data.email_addresses[0].email_address
            : "";

        const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || null;

        await db
          .update(users)
          .set({
            email: primaryEmail,
            name,
            avatar: data.image_url ?? null,
            metadata: data.public_metadata ?? {},
            updatedAt: new Date(),
          })
          .where(eq(users.clerkId, data.id));

        console.log(`User updated: ${data.id}`);
        break;
      }

      case "user.deleted": {
        await db.update(users)
          .set({ deletedAt: new Date() })
          .where(eq(users.clerkId, data.id));

        console.log(`User deleted: ${data.id}`);
        break;
      }

      default:
        console.log(`Unhandled event: ${eventType}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Webhook error (${eventType}):`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

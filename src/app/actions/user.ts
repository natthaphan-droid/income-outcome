"use server";

import { auth } from "@/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: { name?: string; image?: string | null }) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  let env;
  try {
    env = getCloudflareContext().env;
  } catch (e) {
    env = process.env;
  }
  
  if (!env?.DB) {
    console.warn("No DB binding found");
    return { success: false, error: "Database not configured" };
  }

  const db = createDb(env as any);
  
  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.image !== undefined) updateData.image = data.image;

  if (Object.keys(updateData).length === 0) {
    return { success: true };
  }

  await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, session.user.id));

  revalidatePath("/settings");
  revalidatePath("/settings/profile");

  return { success: true };
}

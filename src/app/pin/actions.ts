"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

async function getDb() {
  let env;
  try {
    env = getCloudflareContext().env;
  } catch (e) {
    console.warn("Could not get Cloudflare env");
  }
  if (!env?.DB) return null;
  return createDb(env as any);
}

export async function checkPinStatus() {
  const session = await auth();
  if (!session?.user?.id) return false;

  const db = await getDb();
  if (!db) return false;

  const user = await db.select().from(users).where(eq(users.id, session.user.id));
  if (user.length > 0 && user[0].pinHash) {
    return true;
  }
  return false;
}

export async function verifyPin(pin: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const db = await getDb();
  if (!db) {
    // Fallback logic for dev without DB
    if (pin === "123456") {
      const cookieStore = await cookies();
      cookieStore.set("pin_verified", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
      return { success: true };
    }
    return { error: "DB Error" };
  }

  const user = await db.select().from(users).where(eq(users.id, session.user.id));
  if (user.length === 0 || !user[0].pinHash) {
    return { error: "คุณยังไม่ได้ตั้งรหัส PIN" };
  }

  const isValid = await bcrypt.compare(pin, user[0].pinHash);
  if (isValid) {
    const cookieStore = await cookies();
    // Session cookie (no maxAge), expires when browser closes
    cookieStore.set("pin_verified", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    return { success: true };
  } else {
    return { error: "รหัส PIN ไม่ถูกต้อง" };
  }
}

export async function setupPin(pin: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  if (pin.length !== 6) {
    return { error: "รหัส PIN ต้องมี 6 หลัก" };
  }

  const db = await getDb();
  if (!db) return { error: "DB Error" };

  const hash = await bcrypt.hash(pin, 10);
  await db.update(users).set({ pinHash: hash }).where(eq(users.id, session.user.id));

  const cookieStore = await cookies();
  cookieStore.set("pin_verified", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  
  return { success: true };
}

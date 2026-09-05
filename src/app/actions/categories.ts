"use server";

import { auth } from "@/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createDb } from "@/db";
import { categories, budgets } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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

export async function getCategoriesWithBudgets() {
  const session = await auth();
  const fallback = [
    { id: "1", name: "อาหาร", icon: "Food", type: "expense", budget: 5000 },
    { id: "2", name: "เดินทาง", icon: "Transport", type: "expense", budget: 2000 },
    { id: "3", name: "ช้อปปิ้ง", icon: "Shopping", type: "expense", budget: 0 },
  ];

  if (!session?.user?.id) return fallback;

  try {
    const db = await getDb();
    if (!db) return fallback;
    const userId = session.user.id;
    const now = new Date();
    
    const cats = await db.select().from(categories).where(eq(categories.userId, userId));
    const activeBudgets = await db.select().from(budgets).where(
      and(
        eq(budgets.userId, userId),
        eq(budgets.month, now.getMonth() + 1),
        eq(budgets.year, now.getFullYear())
      )
    );

    const merged = cats.map(c => {
      const b = activeBudgets.find(ab => ab.categoryId === c.id);
      return {
        ...c,
        budget: b?.amount || 0
      };
    });

    return merged.length > 0 ? merged : fallback;
  } catch (e) {
    console.error(e);
    return fallback;
  }
}

export async function setCategoryBudget(categoryId: string, amount: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const db = await getDb();
  if (!db) {
    revalidatePath("/");
    revalidatePath("/categories");
    return { success: true };
  }
  const userId = session.user.id;
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const existing = await db.select().from(budgets).where(
    and(
      eq(budgets.categoryId, categoryId),
      eq(budgets.month, month),
      eq(budgets.year, year)
    )
  );

  if (existing.length > 0) {
    await db.update(budgets)
      .set({ amount })
      .where(eq(budgets.id, existing[0].id));
  } else {
    await db.insert(budgets).values({
      id: crypto.randomUUID(),
      userId,
      categoryId,
      amount,
      month,
      year,
    });
  }

  revalidatePath("/");
  revalidatePath("/categories");
  return { success: true };
}

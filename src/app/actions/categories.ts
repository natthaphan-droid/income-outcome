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

  if (!session?.user?.id) return [];

  try {
    const db = await getDb();
    if (!db) return [];
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

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const { transactions } = await import("@/db/schema");
    const { gte, lte } = await import("drizzle-orm");

    const currentMonthTx = await db.select().from(transactions).where(
      and(
        eq(transactions.userId, userId),
        gte(transactions.date, startOfMonth),
        lte(transactions.date, endOfMonth)
      )
    );

    const merged = cats.map(c => {
      const b = activeBudgets.find(ab => ab.categoryId === c.id);
      const spent = currentMonthTx
        .filter(t => t.categoryId === c.id && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
        
      return {
        ...c,
        budget: b?.amount || 0,
        spent: spent
      };
    });

    return merged;
  } catch (e) {
    console.error(e);
    return [];
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

export async function addCategory(name: string, icon: string, type: "income" | "expense") {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const db = await getDb();
  if (!db) {
    revalidatePath("/categories");
    return { success: true };
  }

  await db.insert(categories).values({
    id: crypto.randomUUID(),
    userId: session.user.id,
    name,
    icon,
    type,
    
  });

  revalidatePath("/categories");
  revalidatePath("/add");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const db = await getDb();
  if (!db) {
    revalidatePath("/categories");
    return { success: true };
  }

  await db.delete(categories).where(and(eq(categories.id, id), eq(categories.userId, session.user.id)));

  revalidatePath("/categories");
  revalidatePath("/add");
  return { success: true };
}

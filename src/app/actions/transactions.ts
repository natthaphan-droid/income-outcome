"use server";

import { auth } from "@/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createDb } from "@/db";
import { transactions, budgets, categories, savingsGoals } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq, and, sum, sql, desc, gte, lt } from "drizzle-orm";

async function getDb() {
  let env;
  try {
    env = getCloudflareContext().env;
  } catch (e) {
    console.warn("Could not get Cloudflare env in server action.");
  }
  
  if (!env?.DB) {
    // For local UI testing without Wrangler
    return null;
  }
  
  return createDb(env as any);
}

export async function addTransaction(data: {
  type: "income" | "expense" | "saving";
  amount: number;
  categoryId?: string;
  savingGoalId?: string;
  note?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const db = await getDb();
  if (!db) {
    console.warn("Mock saving transaction (No DB)");
    revalidatePath("/");
    revalidatePath("/transactions");
    revalidatePath("/add");
    return { success: true };
  }

  const userId = session.user.id;

  // Insert transaction
  await db.insert(transactions).values({
    id: crypto.randomUUID(),
    userId,
    type: data.type,
    amount: data.amount,
    categoryId: data.categoryId || null,
    savingGoalId: data.savingGoalId || null,
    note: data.note || null,
    date: new Date(),
    isRecurring: false,
  });

  // If saving, update saving goal current amount
  if (data.type === "saving" && data.savingGoalId) {
    await db.update(savingsGoals)
      .set({ currentAmount: sql`${savingsGoals.currentAmount} + ${data.amount}` })
      .where(and(eq(savingsGoals.id, data.savingGoalId), eq(savingsGoals.userId, userId)));
  }

  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/add");
  return { success: true };
}

export async function getDashboardData() {
  const session = await auth();
  // Mock fallback if not logged in or DB not available
  const fallback = {
    balance: 24500,
    totalIncome: 35000,
    totalExpense: 10500,
    recentTransactions: [],
    budgetAlerts: [],
  };

  if (!session?.user?.id) return fallback;

  try {
    const db = await getDb();
    if (!db) return fallback;
    const userId = session.user.id;

    // Get current month date range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Calculate income and expenses for current month
    const monthlyStats = await db
      .select({
        type: transactions.type,
        total: sum(transactions.amount).mapWith(Number),
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          gte(transactions.date, startOfMonth),
          lt(transactions.date, endOfMonth)
        )
      )
      .groupBy(transactions.type);

    let totalIncome = 0;
    let totalExpense = 0;
    let totalSaving = 0;

    for (const stat of monthlyStats) {
      if (stat.type === "income") totalIncome += stat.total;
      if (stat.type === "expense") totalExpense += stat.total;
      if (stat.type === "saving") totalSaving += stat.total;
    }

    // Balance calculation (All time)
    const allStats = await db
      .select({
        type: transactions.type,
        total: sum(transactions.amount).mapWith(Number),
      })
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .groupBy(transactions.type);
      
    let allIncome = 0;
    let allExpense = 0;
    let allSaving = 0;
    for (const stat of allStats) {
      if (stat.type === "income") allIncome += stat.total;
      if (stat.type === "expense") allExpense += stat.total;
      if (stat.type === "saving") allSaving += stat.total;
    }
    const balance = allIncome - allExpense - allSaving;

    // Recent transactions
    const recent = await db
      .select({
        id: transactions.id,
        amount: transactions.amount,
        type: transactions.type,
        note: transactions.note,
        date: transactions.date,
        categoryName: categories.name,
        categoryIcon: categories.icon,
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.date))
      .limit(5);

    // Budget alerts (<= 5% remaining)
    const activeBudgets = await db
      .select({
        id: budgets.id,
        amount: budgets.amount, // limit
        categoryId: budgets.categoryId,
        categoryName: categories.name,
      })
      .from(budgets)
      .leftJoin(categories, eq(budgets.categoryId, categories.id))
      .where(
        and(
          eq(budgets.userId, userId),
          eq(budgets.month, now.getMonth() + 1),
          eq(budgets.year, now.getFullYear())
        )
      );

    const budgetAlerts = [];
    for (const b of activeBudgets) {
      const expenses = await db
        .select({ total: sum(transactions.amount).mapWith(Number) })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, userId),
            eq(transactions.categoryId, b.categoryId as string),
            eq(transactions.type, "expense"),
            gte(transactions.date, startOfMonth),
            lt(transactions.date, endOfMonth)
          )
        );
      
      const spent = expenses[0]?.total || 0;
      const remaining = b.amount - spent;
      const percentageLeft = (remaining / b.amount) * 100;

      if (percentageLeft <= 5) {
        budgetAlerts.push({
          categoryName: b.categoryName,
          limit: b.amount,
          spent,
          remaining,
          percentageLeft,
        });
      }
    }

    return {
      balance,
      totalIncome,
      totalExpense,
      recentTransactions: recent,
      budgetAlerts,
    };
  } catch (error) {
    console.error(error);
    return fallback;
  }
}

export async function getCategories(type?: "income" | "expense") {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const db = await getDb();
    if (!db) throw new Error("No DB");
    
    const conditions = [eq(categories.userId, session.user.id)];
    if (type) conditions.push(eq(categories.type, type));

    return await db.select().from(categories).where(and(...conditions));
  } catch (e) {
    // Return mock categories for UI if DB fails
    if (type === "expense" || !type) {
      return [
        { id: "1", name: "อาหาร", icon: "Food", type: "expense" },
        { id: "2", name: "เดินทาง", icon: "Transport", type: "expense" },
        { id: "3", name: "ช้อปปิ้ง", icon: "Shopping", type: "expense" },
      ];
    }
    return [{ id: "4", name: "เงินเดือน", icon: "Wallet", type: "income" }];
  }
}

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

export async function deleteTransaction(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const db = await getDb();
  if (!db) return { success: false, error: "No DB" };

  await db.delete(transactions).where(and(eq(transactions.id, id), eq(transactions.userId, session.user.id)));

  revalidatePath("/");
  revalidatePath("/transactions");
  return { success: true };
}

export async function updateTransaction(id: string, data: {
  amount?: number;
  categoryId?: string;
  note?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const db = await getDb();
  if (!db) return { success: false, error: "No DB" };

  const updateData: any = {};
  if (data.amount !== undefined) updateData.amount = data.amount;
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId || null;
  if (data.note !== undefined) updateData.note = data.note || null;

  if (Object.keys(updateData).length > 0) {
    await db.update(transactions)
      .set(updateData)
      .where(and(eq(transactions.id, id), eq(transactions.userId, session.user.id)));
  }

  revalidatePath("/");
  revalidatePath("/transactions");
  return { success: true };
}

export async function getDashboardData() {
  const session = await auth();
  const emptyData = {
    balance: 0,
    totalIncome: 0,
    totalExpense: 0,
    recentTransactions: [],
    budgetAlerts: [],
    expensesByCategory: [],
  };

  if (!session?.user?.id) return emptyData;

  try {
    const db = await getDb();
    if (!db) return emptyData;
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

    // Expense by category for Donut chart
    const expensesByCategoryRaw = await db
      .select({
        categoryName: categories.name,
        total: sum(transactions.amount).mapWith(Number),
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.type, "expense"),
          gte(transactions.date, startOfMonth),
          lt(transactions.date, endOfMonth)
        )
      )
      .groupBy(categories.name);
      
    const expensesByCategory = expensesByCategoryRaw.map(e => ({
      name: e.categoryName || "เธญเธทเนเธเน",
      value: e.total,
    }));

    return {
      balance,
      totalIncome,
      totalExpense,
      recentTransactions: recent,
      budgetAlerts,
      expensesByCategory,
    };
  } catch (error) {
    console.error(error);
    return emptyData;
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
        { id: "1", name: "เธญเธฒเธซเธฒเธฃ", icon: "Food", type: "expense" },
        { id: "2", name: "เน€เธ”เธดเธเธ—เธฒเธ", icon: "Transport", type: "expense" },
        { id: "3", name: "เธเนเธญเธเธเธดเนเธ", icon: "Shopping", type: "expense" },
      ];
    }
    return [{ id: "4", name: "เน€เธเธดเธเน€เธ”เธทเธญเธ", icon: "Wallet", type: "income" }];
  }
}

export async function getAllTransactions() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const db = await getDb();
    if (!db) return [];
    const userId = session.user.id;

    const all = await db
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
      .orderBy(desc(transactions.date));

    return all;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getMonthlyAnalysisData() {
  const session = await auth();

  if (!session?.user?.id) return [];

  try {
    const db = await getDb();
    if (!db) return [];
    const userId = session.user.id;

    // Get date 6 months ago
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const rawTx = await db
      .select({
        amount: transactions.amount,
        type: transactions.type,
        date: transactions.date,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          gte(transactions.date, sixMonthsAgo),
          lt(transactions.date, startOfNextMonth)
        )
      );

    // Thai month abbreviations
    const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

    // Initialize the last 6 months array
    const monthsData: Record<string, { name: string; income: number; expense: number; savings: number; sortKey: number }> = {};
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
      monthsData[monthStr] = {
        name: thaiMonths[d.getMonth()],
        income: 0,
        expense: 0,
        savings: 0,
        sortKey: d.getTime()
      };
    }

    for (const tx of rawTx) {
      const txDate = new Date(tx.date);
      const monthStr = txDate.getFullYear() + '-' + String(txDate.getMonth() + 1).padStart(2, '0');
      if (monthsData[monthStr]) {
        if (tx.type === 'income') {
          monthsData[monthStr].income += Number(tx.amount);
        } else if (tx.type === 'expense') {
          monthsData[monthStr].expense += Number(tx.amount);
        }
      }
    }

    const result = Object.values(monthsData)
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(m => ({
        name: m.name,
        income: m.income,
        expense: m.expense,
        savings: m.income - m.expense
      }));

    return result;

  } catch (error) {
    console.error(error);
    return [];
  }
}

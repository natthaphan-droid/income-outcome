"use server";

import { auth } from "@/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createDb } from "@/db";
import { transactions, categories } from "@/db/schema";
import { eq, and, gte, lt } from "drizzle-orm";

async function getDb() {
  let env;
  try {
    env = getCloudflareContext().env;
  } catch (e) {
    console.warn("Could not get Cloudflare env in reports action.");
  }
  
  if (!env?.DB) return null;
  return createDb(env as any);
}

export async function getReportData(period: "day" | "week" | "month" | "year") {
  const session = await auth();
  
  const emptyData = {
    balance: 0,
    income: 0,
    expense: 0,
    chartData: [],
    topExpenses: []
  };

  if (!session?.user?.id) return emptyData;

  try {
    const db = await getDb();
    if (!db) return emptyData;
    const userId = session.user.id;
    
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 30);
    
    const txs = await db
      .select({
        amount: transactions.amount,
        type: transactions.type,
        date: transactions.date,
        categoryId: transactions.categoryId,
        categoryName: categories.name,
        categoryIcon: categories.icon,
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          eq(transactions.userId, userId),
          gte(transactions.date, startDate)
        )
      );
      
    let totalIncome = 0;
    let totalExpense = 0;
    
    const expensesByCategory = new Map();
    
    for (const tx of txs) {
      if (tx.type === "income") totalIncome += tx.amount;
      if (tx.type === "expense") totalExpense += tx.amount;
      
      if (tx.type === "expense") {
        const catName = tx.categoryName || "อื่นๆ";
        const currentCat = expensesByCategory.get(catName) || { amount: 0, icon: tx.categoryIcon || "Wallet" };
        currentCat.amount += tx.amount;
        expensesByCategory.set(catName, currentCat);
      }
    }

    const topExpenses = Array.from(expensesByCategory.entries())
      .map(([name, data]: any) => ({
        name,
        amount: data.amount,
        icon: data.icon,
        percent: totalExpense > 0 ? Math.round((data.amount / totalExpense) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return {
      balance: totalIncome - totalExpense,
      income: totalIncome,
      expense: totalExpense,
      chartData: [],
      topExpenses
    };
  } catch (error) {
    console.error(error);
    return emptyData;
  }
}

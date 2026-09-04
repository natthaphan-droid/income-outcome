import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { createDb } from "@/db";
import { transactions, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const runtime = "edge";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  let env;
  try {
    env = getRequestContext().env;
  } catch (e) {
    console.warn("No env");
  }

  if (!env?.DB) {
    // Return dummy CSV for local testing
    const dummyCsv = `date,type,category,amount,note\n2026-09-04,expense,อาหาร,60.00,ข้าวกะเพราไก่ไข่ดาว`;
    return new NextResponse(dummyCsv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="export.csv"',
      },
    });
  }

  const db = createDb(env as any);
  const data = await db
    .select({
      date: transactions.date,
      type: transactions.type,
      amount: transactions.amount,
      note: transactions.note,
      categoryName: categories.name,
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(eq(transactions.userId, session.user.id))
    .orderBy(desc(transactions.date));

  // Convert to CSV
  let csv = "date,type,category,amount,note\n";
  for (const row of data) {
    const d = new Date(row.date).toISOString().split("T")[0];
    const cat = row.categoryName || "";
    const note = (row.note || "").replace(/,/g, " "); // Basic escape
    csv += `${d},${row.type},${cat},${row.amount},${note}\n`;
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="export.csv"',
    },
  });
}

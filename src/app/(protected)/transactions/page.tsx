import { Icons } from "@/components/Icons";
import Link from "next/link";
import { getAllTransactions } from "@/app/actions/transactions";
import { TransactionItem } from "@/components/TransactionItem";

export default async function TransactionsPage() {
  const transactions = await getAllTransactions();

  return (
    <div className="flex flex-col min-h-screen relative bg-background">
      {/* Header */}
      <header className="px-6 py-8 rounded-b-3xl shadow-lg relative text-primary-foreground z-10 bg-primary">
        <h1 className="text-2xl font-bold">รายการทั้งหมด</h1>
        <p className="text-sm opacity-90 mt-1">ประวัติการรับ-จ่ายเงินของคุณ</p>
      </header>

      <main className="flex-1 px-4 py-6 pb-24">
        <div className="space-y-4">
          {/* We assume transactions are already sorted by date desc */}
          {transactions.length > 0 ? (
            transactions.map((tx: any, idx: number) => (
              <TransactionItem key={idx} tx={tx} />
            ))
          ) : (
            <div className="text-center p-10 text-muted text-sm bg-card text-card-foreground rounded-2xl border border-border">
              ยังไม่มีรายการ
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button (FAB) */}
      <Link 
        href="/add" 
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-primary-foreground text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform z-40"
      >
        <Icons.Plus className="w-6 h-6" />
      </Link>
    </div>
  );
}

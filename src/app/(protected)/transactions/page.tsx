import { Icons } from "@/components/Icons";
import Link from "next/link";
import { getAllTransactions } from "@/app/actions/transactions";

export default async function TransactionsPage() {
  const transactions = await getAllTransactions();

  // Dynamic icons mapping
  const getIcon = (iconName: string | null) => {
    if (iconName && (Icons as any)[iconName]) {
      const IconComponent = (Icons as any)[iconName];
      return <IconComponent className="w-5 h-5" />;
    }
    return <Icons.Wallet className="w-5 h-5" />;
  };

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
              <div key={idx} className="bg-card text-card-foreground p-4 rounded-2xl border border-border flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-success/10 text-success' : 'bg-surface text-surface-foreground text-foreground'}`}>
                    {getIcon(tx.categoryIcon)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{tx.note || tx.categoryName || (tx.type === 'income' ? 'รายรับ' : 'รายจ่าย')}</h4>
                    <p className="text-xs text-muted mt-0.5">
                      {new Date(tx.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })} • {new Date(tx.date).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className={`font-semibold text-lg ${tx.type === 'income' ? 'text-success' : 'text-danger'}`}>
                  {tx.type === 'income' ? '+' : '-'}฿{tx.amount.toLocaleString()}
                </div>
              </div>
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

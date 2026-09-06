import { Icons } from "@/components/Icons";
import Link from "next/link";
import { getDashboardData } from "@/app/actions/transactions";
import { ExpenseDonutChart } from "@/components/ExpenseDonutChart";

export default async function DashboardPage() {
  const data = await getDashboardData();
  
  // Dynamic icons mapping
  const getIcon = (iconName: string | null) => {
    switch(iconName) {
      case "Food": return <Icons.Food className="w-5 h-5" />;
      case "Transport": return <Icons.Transport className="w-5 h-5" />;
      case "Shopping": return <Icons.Shopping className="w-5 h-5" />;
      default: return <Icons.Wallet className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Header */}
      <header className="px-6 py-8 rounded-b-3xl shadow-md border-b border-border/30 relative text-foreground z-10 bg-background">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm opacity-90">ยินดีต้อนรับกลับมา</p>
            <h1 className="text-2xl font-bold">สรุปภาพรวม</h1>
          </div>
          <Link href="/notifications" className="w-10 h-10 bg-card text-card-foreground/20 rounded-full flex items-center justify-center hover:bg-card text-card-foreground/30 transition relative border border-border">
            <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border border-white"></span>
          </Link>
        </div>
        <div className="text-xs opacity-90 mb-1">ยอดเงินคงเหลือ</div>
        <div className="text-4xl font-bold">
          ฿ {data.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
        
        {/* Quick summary */}
        <div className="flex gap-4 mt-6">
          <div className="flex-1 bg-card text-card-foreground rounded-xl p-3 shadow-sm border border-border/50">
            <div className="text-xs opacity-90 mb-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success"></span> รายรับ (เดือนนี้)
            </div>
            <div className="font-semibold text-success">฿ {data.totalIncome.toLocaleString()}</div>
          </div>
          <div className="flex-1 bg-card text-card-foreground rounded-xl p-3 shadow-sm border border-border/50">
            <div className="text-xs opacity-90 mb-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-danger"></span> รายจ่าย (เดือนนี้)
            </div>
            <div className="font-semibold text-danger">฿ {data.totalExpense.toLocaleString()}</div>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        {/* Expense Donut Chart */}
        <section className="mb-8">
          <ExpenseDonutChart data={data.expensesByCategory} />
        </section>

        {/* Budget Alerts */}
        {data.budgetAlerts.map((alert, idx) => {
          const dashoffset = 100 - alert.percentageLeft;
          return (
            <div key={idx} className="bg-danger/10 border border-[danger]/20 rounded-2xl p-4 mb-6 flex gap-4 items-center">
              <div className="w-12 h-12 relative shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-[danger]/20" strokeWidth="4" />
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-[danger]" strokeWidth="4" strokeDasharray="100" strokeDashoffset={dashoffset} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-danger">
                  {Math.round(alert.percentageLeft)}%
                </div>
              </div>
              <div>
                <h3 className="font-bold text-danger text-sm">งบ{alert.categoryName}ใกล้หมด!</h3>
                <p className="text-xs text-danger/80 mt-1">ใช้ไป {alert.spent.toLocaleString()} / {alert.limit.toLocaleString()} ฿ (เหลือ {alert.remaining.toLocaleString()} ฿)</p>
              </div>
            </div>
          )
        })}

        {/* Recent Transactions */}
        <section className="pt-2">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-bold text-foreground">รายการล่าสุด</h2>
            <Link href="/transactions" className="text-sm text-primary">ดูทั้งหมด</Link>
          </div>
          <div className="space-y-3">
            {data.recentTransactions.length > 0 ? (
              data.recentTransactions.map((tx: any, idx: number) => (
                <div key={idx} className="bg-card text-card-foreground p-4 rounded-2xl border border-border flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface text-surface-foreground flex items-center justify-center text-foreground">
                      {getIcon(tx.categoryIcon)}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{tx.note || tx.categoryName || (tx.type === 'income' ? 'รายรับ' : 'รายจ่าย')}</h4>
                      <p className="text-xs text-muted">
                        {new Date(tx.date).toLocaleDateString('th-TH')} {new Date(tx.date).toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                  <div className={`font-semibold ${tx.type === 'income' ? 'text-success' : 'text-danger'}`}>
                    {tx.type === 'income' ? '+' : '-'}฿{tx.amount.toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-6 text-muted text-sm bg-card text-card-foreground rounded-2xl border border-border">
                ยังไม่มีรายการล่าสุด
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Floating Action Button (FAB) */}
      <Link 
        href="/add" 
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform z-40"
      >
        <Icons.Plus className="w-6 h-6" />
      </Link>
    </div>
  );
}

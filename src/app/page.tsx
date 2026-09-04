import { Icons } from "@/components/Icons";
import Link from "next/link";
import { getDashboardData } from "@/app/actions/transactions";

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
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="px-6 py-8 bg-[var(--wood-base)] text-white rounded-b-3xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm opacity-90">ยินดีต้อนรับกลับมา</p>
            <h1 className="text-2xl font-bold">ยอดเงินคงเหลือ</h1>
          </div>
          <Link href="/notifications" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition relative">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--danger)] rounded-full border border-white"></span>
          </Link>
        </div>
        <div className="text-4xl font-bold">
          ฿ {data.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
        
        {/* Quick summary */}
        <div className="flex gap-4 mt-6">
          <div className="flex-1 bg-white/10 rounded-xl p-3">
            <div className="text-xs opacity-90 mb-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[var(--success)]"></span> รายรับ (เดือนนี้)
            </div>
            <div className="font-semibold">฿ {data.totalIncome.toLocaleString()}</div>
          </div>
          <div className="flex-1 bg-white/10 rounded-xl p-3">
            <div className="text-xs opacity-90 mb-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[var(--danger)]"></span> รายจ่าย (เดือนนี้)
            </div>
            <div className="font-semibold">฿ {data.totalExpense.toLocaleString()}</div>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 mb-20 overflow-auto">
        {/* Budget Alerts */}
        {data.budgetAlerts.map((alert, idx) => {
          const dashoffset = 100 - alert.percentageLeft;
          return (
            <div key={idx} className="bg-[var(--danger)]/10 border border-[var(--danger)]/20 rounded-2xl p-4 mb-6 flex gap-4 items-center">
              <div className="w-12 h-12 relative shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-[var(--danger)]/20" strokeWidth="4" />
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-[var(--danger)]" strokeWidth="4" strokeDasharray="100" strokeDashoffset={dashoffset} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[var(--danger)]">
                  {Math.round(alert.percentageLeft)}%
                </div>
              </div>
              <div>
                <h3 className="font-bold text-[var(--danger)] text-sm">งบ{alert.categoryName}ใกล้หมด!</h3>
                <p className="text-xs text-[var(--danger)]/80 mt-1">ใช้ไป {alert.spent.toLocaleString()} / {alert.limit.toLocaleString()} ฿ (เหลือ {alert.remaining.toLocaleString()} ฿)</p>
              </div>
            </div>
          )
        })}

        {/* Categories / Wallets */}
        <section className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-bold text-[var(--wood-dark)]">หมวดหมู่ด่วน</h2>
            <Link href="/categories" className="text-sm text-[var(--wood-base)]">จัดการ</Link>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-white border border-[var(--border)] rounded-2xl flex items-center justify-center text-[var(--wood-base)] shadow-sm">
                <Icons.Food className="w-6 h-6" />
              </div>
              <span className="text-xs text-[var(--muted)]">อาหาร</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-white border border-[var(--border)] rounded-2xl flex items-center justify-center text-[var(--wood-base)] shadow-sm">
                <Icons.Transport className="w-6 h-6" />
              </div>
              <span className="text-xs text-[var(--muted)]">เดินทาง</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-white border border-[var(--border)] rounded-2xl flex items-center justify-center text-[var(--wood-base)] shadow-sm">
                <Icons.Shopping className="w-6 h-6" />
              </div>
              <span className="text-xs text-[var(--muted)]">ช้อปปิ้ง</span>
            </div>
            <Link href="/add" className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-white border border-[var(--border)] rounded-2xl flex items-center justify-center text-[var(--wood-base)] shadow-sm">
                <Icons.Plus className="w-6 h-6" />
              </div>
              <span className="text-xs text-[var(--muted)]">เพิ่ม</span>
            </Link>
          </div>
        </section>

        {/* Recent Transactions */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-bold text-[var(--wood-dark)]">รายการล่าสุด</h2>
            <Link href="/transactions" className="text-sm text-[var(--wood-base)]">ดูทั้งหมด</Link>
          </div>
          <div className="space-y-3">
            {data.recentTransactions.length > 0 ? (
              data.recentTransactions.map((tx: any, idx: number) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-[var(--border)] flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--wood-light)] flex items-center justify-center text-[var(--wood-dark)]">
                      {getIcon(tx.categoryIcon)}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{tx.note || tx.categoryName || (tx.type === 'income' ? 'รายรับ' : 'รายจ่าย')}</h4>
                      <p className="text-xs text-[var(--muted)]">{new Date(tx.date).toLocaleDateString('th-TH')}</p>
                    </div>
                  </div>
                  <div className={`font-semibold ${tx.type === 'income' ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                    {tx.type === 'income' ? '+' : '-'}฿{tx.amount.toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-6 text-[var(--muted)] text-sm bg-white rounded-2xl border border-[var(--border)]">
                ยังไม่มีรายการล่าสุด
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-[var(--border)] pb-safe pt-2 px-6 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button className="flex flex-col items-center gap-1 p-2 text-[var(--wood-dark)]">
          <Icons.Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">หน้าแรก</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-[var(--muted)]">
          <Icons.Chart className="w-6 h-6" />
          <span className="text-[10px] font-medium">สรุปผล</span>
        </button>
        
        {/* Floating Action Button */}
        <div className="relative -top-6">
          <Link href="/add" className="w-14 h-14 bg-[var(--wood-dark)] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[var(--wood-xdark)] transition-transform hover:scale-105">
            <Icons.Plus className="w-7 h-7" />
          </Link>
        </div>

        <button className="flex flex-col items-center gap-1 p-2 text-[var(--muted)]">
          <Icons.Wallet className="w-6 h-6" />
          <span className="text-[10px] font-medium">เป้าหมายออม</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-[var(--muted)]">
          <Icons.Settings className="w-6 h-6" />
          <span className="text-[10px] font-medium">ตั้งค่า</span>
        </button>
      </nav>
    </div>
  );
}

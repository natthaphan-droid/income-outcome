import { Icons } from "@/components/Icons";
import Link from "next/link";
import { getReportData } from "@/app/actions/reports";
import ReportView from "@/components/ReportView";

export default async function ReportsPage() {
  const initialData = await getReportData("week");

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)] pb-20">
      <header className="px-6 py-6 bg-white border-b border-[var(--border)] sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-[var(--wood-dark)] text-center">สรุปผลการเงิน</h1>
        <ReportView initialData={initialData} />
      </header>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-[var(--border)] pb-safe pt-2 px-6 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
        <Link href="/" className="flex flex-col items-center gap-1 p-2 text-[var(--muted)]">
          <Icons.Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">หน้าแรก</span>
        </Link>
        <button className="flex flex-col items-center gap-1 p-2 text-[var(--wood-dark)]">
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
        <Link href="/settings" className="flex flex-col items-center gap-1 p-2 text-[var(--muted)]">
          <Icons.Settings className="w-6 h-6" />
          <span className="text-[10px] font-medium">ตั้งค่า</span>
        </Link>
      </nav>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { Icons } from "@/components/Icons";

export default function RecurringPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-4 bg-card text-card-foreground border-b border-border flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-foreground p-2 -ml-2 rounded-full hover:bg-surface text-surface-foreground">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-foreground">รายการอัตโนมัติ</h1>
      </header>

      <main className="p-6">
        <button className="w-full py-4 mb-6 bg-card text-card-foreground border-2 border-dashed border-[var(--wood-base)] text-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-surface text-surface-foreground transition">
          <Icons.Plus className="w-5 h-5" />
          เพิ่มรายการอัตโนมัติ
        </button>

        <div className="space-y-4">
          <div className="bg-card text-card-foreground p-4 rounded-2xl border border-border shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface text-surface-foreground text-foreground flex items-center justify-center">
                  <Icons.Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">เงินเดือนเข้า</h3>
                  <p className="text-xs text-muted">ทุกวันที่ 1 ของเดือน</p>
                </div>
              </div>
              <span className="font-semibold text-success">+฿35,000</span>
            </div>
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
              <span className="text-xs px-2 py-1 bg-success/10 text-success rounded-md font-medium">ทำงานอยู่</span>
              <button className="text-xs text-danger">ลบ</button>
            </div>
          </div>

          <div className="bg-card text-card-foreground p-4 rounded-2xl border border-border shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface text-surface-foreground text-foreground flex items-center justify-center">
                  <Icons.Home className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">จ่ายค่าหอพัก</h3>
                  <p className="text-xs text-muted">ทุกวันที่ 5 ของเดือน</p>
                </div>
              </div>
              <span className="font-semibold text-danger">-฿4,500</span>
            </div>
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
              <span className="text-xs px-2 py-1 bg-success/10 text-success rounded-md font-medium">ทำงานอยู่</span>
              <button className="text-xs text-danger">ลบ</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { Icons } from "@/components/Icons";

export default function RecurringPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <header className="px-6 py-4 bg-white border-b border-[var(--border)] flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-[var(--wood-dark)] p-2 -ml-2 rounded-full hover:bg-[var(--wood-light)]">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-[var(--wood-dark)]">รายการอัตโนมัติ</h1>
      </header>

      <main className="p-6">
        <button className="w-full py-4 mb-6 bg-white border-2 border-dashed border-[var(--wood-base)] text-[var(--wood-base)] font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--wood-light)] transition">
          <Icons.Plus className="w-5 h-5" />
          เพิ่มรายการอัตโนมัติ
        </button>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-[var(--border)] shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--wood-light)] text-[var(--wood-dark)] flex items-center justify-center">
                  <Icons.Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">เงินเดือนเข้า</h3>
                  <p className="text-xs text-[var(--muted)]">ทุกวันที่ 1 ของเดือน</p>
                </div>
              </div>
              <span className="font-semibold text-[var(--success)]">+฿35,000</span>
            </div>
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-[var(--border)]">
              <span className="text-xs px-2 py-1 bg-[var(--success)]/10 text-[var(--success)] rounded-md font-medium">ทำงานอยู่</span>
              <button className="text-xs text-[var(--danger)]">ลบ</button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[var(--border)] shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--wood-light)] text-[var(--wood-dark)] flex items-center justify-center">
                  <Icons.Home className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">จ่ายค่าหอพัก</h3>
                  <p className="text-xs text-[var(--muted)]">ทุกวันที่ 5 ของเดือน</p>
                </div>
              </div>
              <span className="font-semibold text-[var(--danger)]">-฿4,500</span>
            </div>
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-[var(--border)]">
              <span className="text-xs px-2 py-1 bg-[var(--success)]/10 text-[var(--success)] rounded-md font-medium">ทำงานอยู่</span>
              <button className="text-xs text-[var(--danger)]">ลบ</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

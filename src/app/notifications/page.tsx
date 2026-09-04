"use client";

import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <header className="px-6 py-4 bg-white border-b border-[var(--border)] flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-[var(--wood-dark)] p-2 -ml-2 rounded-full hover:bg-[var(--wood-light)]">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-[var(--wood-dark)]">การแจ้งเตือน</h1>
      </header>

      <main className="p-6 space-y-4">
        {/* Unread Alert */}
        <div className="bg-[var(--wood-light)] p-4 rounded-2xl border border-[var(--wood-base)] flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 text-[var(--danger)] shadow-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-sm text-[var(--wood-dark)]">งบค่าอาหารใกล้หมด!</h3>
            <p className="text-xs text-[var(--muted)] mt-1">คุณใช้จ่ายหมวดอาหารไปแล้ว 95% ของงบเดือนนี้ (เหลืออีก 250 ฿)</p>
            <p className="text-[10px] text-[var(--wood-base)] mt-2 font-medium">เพิ่งส่งเมื่อ 1 ชั่วโมงที่แล้ว</p>
          </div>
        </div>

        {/* Read Notification */}
        <div className="bg-white p-4 rounded-2xl border border-[var(--border)] flex items-start gap-4 opacity-75">
          <div className="w-10 h-10 rounded-full bg-[var(--background)] flex items-center justify-center shrink-0 text-[var(--success)]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-sm text-[var(--foreground)]">อัปเดตแอปเวอร์ชันใหม่</h3>
            <p className="text-xs text-[var(--muted)] mt-1">ยินดีต้อนรับสู่แอปพลิเคชัน ธีมใหม่เพิ่มแล้ว! ไปที่ตั้งค่าเพื่อทดลองใช้</p>
            <p className="text-[10px] text-[var(--muted)] mt-2">เมื่อวานนี้</p>
          </div>
        </div>
      </main>
    </div>
  );
}

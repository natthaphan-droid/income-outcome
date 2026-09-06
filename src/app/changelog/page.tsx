"use client";

import { useRouter } from "next/navigation";

export default function ChangelogPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-4 bg-card text-card-foreground border-b border-border flex items-center gap-4 sticky top-0">
        <button onClick={() => router.back()} className="text-foreground p-2 -ml-2 rounded-full hover:bg-surface text-surface-foreground">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-foreground">ประกาศการอัปเดต</h1>
      </header>

      <main className="p-6">
        <div className="relative border-l-2 border-[primary] ml-4 space-y-10 pb-10">
          
          <div className="relative pl-6">
            <div className="absolute -left-2 top-1 w-4 h-4 bg-primary text-primary-foreground rounded-full border-4 border-[var(--background)]"></div>
            <div className="mb-1 text-sm text-foreground font-bold">เวอร์ชัน 1.0.0</div>
            <div className="mb-2 text-xs text-muted">4 กันยายน 2026</div>
            <div className="bg-card text-card-foreground p-4 rounded-xl border border-border shadow-sm">
              <h3 className="font-medium text-sm mb-2">🎉 เปิดตัวแอปพลิเคชันอย่างเป็นทางการ</h3>
              <ul className="text-sm text-muted space-y-1 list-disc pl-4">
                <li>ธีมมินิมอลสีไม้ และสีพื้นขาวสะอาดตา (#B38B6D + #FDFBF7)</li>
                <li>ระบบล็อกอินด้วย PIN 6 หลักเพื่อความปลอดภัย</li>
                <li>จัดสรรงบประมาณรายเดือนพร้อมแจ้งเตือน 5% สุดท้าย</li>
                <li>สรุปผลกราฟแท่งแนวโน้มรายสัปดาห์</li>
                <li>สามารถส่งออกข้อมูลเป็น CSV ได้</li>
              </ul>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

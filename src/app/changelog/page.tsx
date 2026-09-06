"use client";

import { useRouter } from "next/navigation";

export default function ChangelogPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-6 bg-primary text-primary-foreground shadow-md flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-primary-foreground p-2 -ml-2 rounded-full hover:bg-primary/80 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">ประกาศการอัปเดต</h1>
      </header>

      <main className="p-6">
        <div className="relative border-l-2 border-[primary] ml-4 space-y-10 pb-10">
          
          {/* Version 1.1.0 */}
          <div className="relative pl-6">
            <div className="absolute -left-2 top-1 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
            <div className="mb-1 text-sm text-foreground font-bold">เวอร์ชัน 1.1.0 (อัปเดตล่าสุด)</div>
            <div className="mb-2 text-xs text-muted">6 กันยายน 2026</div>
            <div className="bg-card text-card-foreground p-4 rounded-xl border border-border shadow-sm">
              <h3 className="font-medium text-sm mb-2">✨ อัปเดตฟีเจอร์ใหม่เพียบ!</h3>
              <ul className="text-sm text-muted space-y-2 list-none">
                <li className="flex gap-2"><span>🎨</span> <span><b>ระบบ 6 ธีมใหม่:</b> เลือกบรรยากาศที่คุณชอบได้ตามใจ (มินิมอล, โหมดกลางคืน, ชมพูพาสเทล ฯลฯ)</span></li>
                <li className="flex gap-2"><span>🦖</span> <span><b>หน้าโหลดใหม่:</b> เพิ่มมาสคอตน้องไดโนเสาร์กระโดดเด้งดึ๋งแก้เบื่อตอนรอโหลดและสลับธีม</span></li>
                <li className="flex gap-2"><span>⚠️</span> <span><b>แจ้งเตือนงบ:</b> หน้าต่าง Popup เด้งเตือนกลางจอทันที เมื่อเงินในหมวดหมู่เหลือน้อยกว่า 5%</span></li>
                <li className="flex gap-2"><span>🐛</span> <span><b>แก้ไขบัค:</b> ซ่อมกล่องข้อความ (Tooltip) ในกราฟแท่งที่เคยเป็นสีดำ ให้กลับมาเป็นสีขาวอ่านง่าย</span></li>
                <li className="flex gap-2"><span>💅</span> <span><b>ปรับ UI:</b> เปลี่ยนสีแถบด้านบน (Header) ให้ตัดกับพื้นหลังชัดเจนขึ้น</span></li>
              </ul>
            </div>
          </div>

          {/* Version 1.0.0 */}
          <div className="relative pl-6">
            <div className="absolute -left-2 top-1 w-4 h-4 bg-surface rounded-full border-4 border-background"></div>
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

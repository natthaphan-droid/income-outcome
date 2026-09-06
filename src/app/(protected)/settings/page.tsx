"use client";

import { Icons } from "@/components/Icons";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20 transition-colors duration-300">
      <header className="px-6 py-6 bg-card text-card-foreground border-b border-border sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-foreground text-center">ตั้งค่า</h1>
      </header>

      <main className="p-6 space-y-6">
        <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-bold text-foreground">ธีมแอปพลิเคชัน</h2>
          </div>
          <div className="p-4">
            <p className="text-sm text-muted mb-3">เลือกบรรยากาศที่คุณชื่นชอบ</p>
            {mounted && (
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setTheme("minimal")}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${theme === 'minimal' ? 'border-[primary] bg-surface text-surface-foreground' : 'border-border bg-background'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#ffffff', border: '2px solid #7ba3c8' }}></div>
                    <span className={`text-sm font-medium ${theme === 'minimal' ? 'text-foreground' : 'text-foreground'}`}>Minimal Sky (ฟ้าหม่น สะอาดตา)</span>
                  </div>
                  {theme === 'minimal' && <Icons.Plus className="w-5 h-5 text-primary rotate-45" />}
                </button>
                <button 
                  onClick={() => setTheme("theme-cozy-wood")}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${theme === 'theme-cozy-wood' ? 'border-[primary] bg-surface text-surface-foreground' : 'border-border bg-background'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#f5ede0', border: '2px solid #9c6644' }}></div>
                    <span className={`text-sm font-medium ${theme === 'theme-cozy-wood' ? 'text-foreground' : 'text-foreground'}`}>Cozy Wood Cafe (โฮมมี่ อบอุ่น)</span>
                  </div>
                  {theme === 'theme-cozy-wood' && <Icons.Plus className="w-5 h-5 text-primary rotate-45" />}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-bold text-foreground">บัญชี</h2>
          </div>
          <div className="p-4 flex items-center justify-between hover:bg-surface text-surface-foreground/50 transition cursor-pointer">
            <span className="text-sm font-medium">เปลี่ยนรหัส PIN</span>
            <span className="text-muted">›</span>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full text-left p-4 flex items-center justify-between hover:bg-danger/5 transition text-danger"
          >
            <span className="text-sm font-medium">ออกจากระบบ</span>
          </button>
        </div>

        <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-bold text-foreground">ข้อมูลและการทำงาน</h2>
          </div>
          <Link href="/recurring" className="block p-4 flex items-center justify-between hover:bg-surface text-surface-foreground/50 transition cursor-pointer border-b border-border">
            <span className="text-sm font-medium">รายการอัตโนมัติ (Recurring)</span>
            <span className="text-muted">›</span>
          </Link>
          <a 
            href="/api/export" 
            target="_blank"
            className="block p-4 flex items-center justify-between hover:bg-surface text-surface-foreground/50 transition cursor-pointer"
          >
            <span className="text-sm font-medium">ดาวน์โหลดข้อมูล (CSV)</span>
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
        </div>

        <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-bold text-foreground">เกี่ยวกับแอป</h2>
          </div>
          <Link href="/changelog" className="block p-4 flex items-center justify-between hover:bg-surface text-surface-foreground/50 transition cursor-pointer">
            <span className="text-sm font-medium">ประกาศการอัปเดต (Changelog)</span>
            <span className="text-muted">›</span>
          </Link>
          <div className="p-4 flex items-center justify-between text-sm">
            <span className="font-medium">เวอร์ชัน</span>
            <span className="text-muted">1.0.0</span>
          </div>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full bg-card text-card-foreground border-t border-border pb-safe pt-2 px-6 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
        <Link href="/" className="flex flex-col items-center gap-1 p-2 text-muted">
          <Icons.Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">หน้าแรก</span>
        </Link>
        <Link href="/reports" className="flex flex-col items-center gap-1 p-2 text-muted">
          <Icons.Chart className="w-6 h-6" />
          <span className="text-[10px] font-medium">สรุปผล</span>
        </Link>
        
        {/* Floating Action Button */}
        <div className="relative -top-6">
          <Link href="/add" className="w-14 h-14 bg-primary text-primary-foreground text-white rounded-full flex items-center justify-center shadow-lg hover:bg-dino-500 transition-transform hover:scale-105">
            <Icons.Plus className="w-7 h-7" />
          </Link>
        </div>

        <button className="flex flex-col items-center gap-1 p-2 text-muted">
          <Icons.Wallet className="w-6 h-6" />
          <span className="text-[10px] font-medium">เป้าหมายออม</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-foreground">
          <Icons.Settings className="w-6 h-6" />
          <span className="text-[10px] font-medium">ตั้งค่า</span>
        </button>
      </nav>
    </div>
  );
}

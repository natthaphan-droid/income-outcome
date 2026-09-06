"use client";

import { Icons } from "@/components/Icons";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  // New states for theme confirmation and loading
  const [selectedThemePending, setSelectedThemePending] = useState<{id: string, name: string} | null>(null);
  const [isChangingTheme, setIsChangingTheme] = useState(false);

  useEffect(() => setMounted(true), []);

  const user = session?.user;
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  const handleConfirmTheme = () => {
    if (!selectedThemePending) return;
    
    // Hide modal, show loading overlay
    const targetThemeId = selectedThemePending.id;
    setSelectedThemePending(null);
    setIsChangingTheme(true);

    // Fake delay 1.5s
    setTimeout(() => {
      setTheme(targetThemeId);
      // Let it render for 0.5s before hiding loader
      setTimeout(() => {
        setIsChangingTheme(false);
      }, 500);
    }, 1500);
  };

  const themesList = [
    { id: 'theme-dino-green', name: 'Dino Green (สีเขียวสดใส)', bg: '#5ec182', border: '#1a422c' },
    { id: 'theme-minimal-sky', name: 'Minimal Sky (ฟ้าหม่น สะอาดตา)', bg: '#e0f2fe', border: '#0284c7' },
    { id: 'theme-cozy-wood', name: 'Cozy Wood Cafe (โฮมมี่ อบอุ่น)', bg: '#f5ebe0', border: '#8b5e34' },
    { id: 'theme-dark', name: 'Dark Mode (โหมดกลางคืน ถนอมสายตา)', bg: '#0f172a', border: '#3b82f6' },
    { id: 'theme-sakura-pink', name: 'Sakura Pink (ชมพูพาสเทล น่ารัก)', bg: '#fce7f3', border: '#db2777' },
    { id: 'theme-ocean-deep', name: 'Ocean Deep (น้ำเงินเข้ม สุขุม)', bg: '#172554', border: '#3b82f6' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20 transition-colors duration-300">
      
      {/* Full Screen Loading Overlay */}
      {isChangingTheme && (
        <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[100] animate-in fade-in duration-300">
          <div className="relative w-48 h-48 animate-bounce-slow">
            <Image
              src="/dino-full.jpg"
              alt="Loading Theme..."
              fill
              className="object-contain drop-shadow-xl"
              priority
            />
          </div>
          <div className="mt-8 text-primary font-bold text-xl animate-pulse">
            กำลังปรับเปลี่ยนสี...
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {selectedThemePending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-card text-card-foreground w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden p-6 text-center animate-in zoom-in-95 duration-300">
            <h2 className="text-xl font-bold mb-3">เปลี่ยนธีมแอปพลิเคชัน?</h2>
            <p className="text-muted text-sm mb-6">คุณต้องการเปลี่ยนเป็นธีม <b>{selectedThemePending.name}</b> ใช่หรือไม่?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedThemePending(null)}
                className="flex-1 py-3 bg-surface text-surface-foreground rounded-xl font-bold hover:bg-border transition-colors"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleConfirmTheme}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="px-6 py-6 bg-primary text-primary-foreground shadow-md sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-foreground text-center">ตั้งค่า</h1>
      </header>

      <main className="p-6 space-y-6">
        {/* User Info Section */}
        <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {user?.image ? (
              <img src={user.image} alt="Profile" className="w-14 h-14 rounded-full object-cover border-2 border-primary/20" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold border-2 border-primary/20">
                {initial}
              </div>
            )}
            <div>
              <h2 className="font-bold text-foreground text-lg">{user?.name || "User"}</h2>
              <p className="text-xs text-muted mt-0.5">{user?.email}</p>
            </div>
          </div>
          <Link href="/settings/profile" className="p-2 bg-surface text-surface-foreground hover:bg-border rounded-xl transition-colors">
            <Icons.Settings className="w-5 h-5" />
          </Link>
        </div>
        <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-bold text-foreground">ธีมแอปพลิเคชัน</h2>
          </div>
          <div className="p-4">
            <p className="text-sm text-muted mb-3">เลือกบรรยากาศที่คุณชื่นชอบ</p>
            {mounted && (
              <div className="flex flex-col gap-3">
                {themesList.map((t) => (
                  <button 
                    key={t.id}
                    onClick={() => {
                      // If it's already the active theme, do nothing
                      if (theme === t.id || (!theme && t.id === 'theme-dino-green')) return;
                      // Otherwise, open confirm modal
                      setSelectedThemePending({ id: t.id, name: t.name });
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${theme === t.id || (!theme && t.id === 'theme-dino-green') ? 'border-[primary] bg-surface text-surface-foreground' : 'border-border bg-background'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: t.bg, border: `2px solid ${t.border}` }}></div>
                      <span className={`text-sm font-medium ${theme === t.id || (!theme && t.id === 'theme-dino-green') ? 'text-foreground' : 'text-foreground'}`}>{t.name}</span>
                    </div>
                    {(theme === t.id || (!theme && t.id === 'theme-dino-green')) && <Icons.Plus className="w-5 h-5 text-primary rotate-45" />}
                  </button>
                ))}
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
          <Link href="/changelog" className="block p-4 flex items-center justify-between hover:bg-surface text-surface-foreground/50 transition cursor-pointer border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">มีอะไรใหม่ (Changelog)</span>
              <span className="w-2 h-2 bg-danger rounded-full inline-block"></span>
            </div>
            <span className="text-sm font-bold text-primary">ดูอัปเดต</span>
          </Link>
          <div className="p-4 flex items-center justify-between text-sm">
            <span className="font-medium">เวอร์ชัน</span>
            <span className="text-muted">1.1.0 (อัปเดตใหม่)</span>
          </div>
        </div>

        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full text-center p-4 rounded-2xl bg-danger/10 text-danger font-bold hover:bg-danger/20 transition-colors mt-6"
        >
          ออกจากระบบ
        </button>
      </main>
    </div>
  );
}

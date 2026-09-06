"use client";

import { Icons } from "@/components/Icons";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    setMounted(true);
    if (session?.user?.name) {
      setEditName(session.user.name);
    }
  }, [session]);

  const handleSaveProfile = () => {
    // โค้ดสำหรับบันทึกโปรไฟล์จริงๆ จะใส่ตรงนี้ (เช่น เรียก API)
    // สำหรับตอนนี้เราปิด modal ไปก่อน
    setShowEditModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20 transition-colors duration-300">
      <header className="px-6 py-6 bg-primary text-primary-foreground shadow-md sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-foreground text-center">ตั้งค่า</h1>
      </header>

      <main className="p-6 space-y-6">
        {/* User Profile Banner */}
        <div className="bg-card text-card-foreground rounded-3xl border border-border shadow-md overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-16 bg-primary/20"></div>
          <div className="p-6 pt-8 relative flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-card shadow-sm bg-surface flex items-center justify-center">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Icons.User className="w-12 h-12 text-muted" />
                )}
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-foreground mb-1">
              {session?.user?.name || "ผู้ใช้งาน"}
            </h2>
            <p className="text-sm text-muted mb-5">
              {session?.user?.email || "กำลังโหลด..."}
            </p>
            
            <button 
              onClick={() => setShowEditModal(true)}
              className="px-6 py-2 bg-surface hover:bg-border text-foreground text-sm font-bold rounded-full transition-colors border border-border"
            >
              แก้ไขโปรไฟล์
            </button>
          </div>
        </div>

        <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-bold text-foreground">ธีมแอปพลิเคชัน</h2>
          </div>
          <div className="p-4">
            <p className="text-sm text-muted mb-3">เลือกบรรยากาศที่คุณชื่นชอบ</p>
            {mounted && (
              <div className="flex flex-col gap-3">
                {[
                  { id: 'theme-dino-green', name: 'Dino Green (สีเขียวสดใส)', bg: '#5ec182', border: '#1a422c' },
                  { id: 'theme-minimal-sky', name: 'Minimal Sky (ฟ้าหม่น สะอาดตา)', bg: '#e0f2fe', border: '#0284c7' },
                  { id: 'theme-cozy-wood', name: 'Cozy Wood Cafe (โฮมมี่ อบอุ่น)', bg: '#f5ebe0', border: '#8b5e34' },
                  { id: 'theme-dark', name: 'Dark Mode (โหมดกลางคืน ถนอมสายตา)', bg: '#0f172a', border: '#3b82f6' },
                  { id: 'theme-sakura-pink', name: 'Sakura Pink (ชมพูพาสเทล น่ารัก)', bg: '#fce7f3', border: '#db2777' },
                  { id: 'theme-ocean-deep', name: 'Ocean Deep (น้ำเงินเข้ม สุขุม)', bg: '#172554', border: '#3b82f6' }
                ].map((t) => (
                  <button 
                    key={t.id}
                    onClick={() => setTheme(t.id)}
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

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowEditModal(false);
          }}
        >
          <div className="bg-card text-card-foreground rounded-3xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-bold">แก้ไขโปรไฟล์</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface text-muted transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 flex flex-col items-center">
              <div className="relative group cursor-pointer mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border bg-surface flex items-center justify-center transition-opacity group-hover:opacity-80">
                  {session?.user?.image ? (
                    <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Icons.User className="w-12 h-12 text-muted" />
                  )}
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
                  <Icons.Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div className="w-full space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5">ชื่อที่แสดง</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-surface text-foreground px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-colors"
                    placeholder="ชื่อของคุณ"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5">อีเมล (เปลี่ยนไม่ได้)</label>
                  <input 
                    type="email" 
                    value={session?.user?.email || ""}
                    disabled
                    className="w-full bg-background text-muted px-4 py-3 rounded-xl border border-border outline-none opacity-70 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 px-6 border-t border-border flex gap-3">
              <button 
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-3 bg-surface hover:bg-border rounded-xl font-bold transition-colors"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleSaveProfile}
                className="flex-1 py-3 bg-primary text-primary-foreground hover:bg-primary/90 text-white rounded-xl font-bold transition-colors"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

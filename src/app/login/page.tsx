"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const reset = searchParams.get("reset");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } else {
      router.push("/");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {registered && (
        <div className="bg-green-100 text-green-700 p-3 rounded-xl text-sm text-center">
          สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ
        </div>
      )}
      {reset && (
        <div className="bg-green-100 text-green-700 p-3 rounded-xl text-sm text-center">
          เปลี่ยนรหัสผ่านสำเร็จ! กรุณาเข้าสู่ระบบใหม่
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-xl text-sm text-center">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
          อีเมล
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-[var(--wood-light)]/40 border border-[var(--border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--wood-base)]"
          placeholder="your@email.com"
          autoCapitalize="none"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
          รหัสผ่าน
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-[var(--wood-light)]/40 border border-[var(--border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--wood-base)]"
          placeholder="••••••••"
        />
      </div>
      
      <div className="flex justify-end">
        <Link href="/forgot-password" className="text-sm font-semibold text-[var(--wood-xdark)] hover:underline">
          ลืมรหัสผ่าน?
        </Link>
      </div>
      
      <button
        type="submit"
        className="w-full py-3 bg-[var(--wood-base)] text-white font-bold rounded-2xl shadow-md hover:bg-[var(--wood-dark)] transition-colors mt-2"
      >
        เข้าสู่ระบบ
      </button>

      <div className="text-center mt-6">
        <p className="text-sm text-[var(--muted)]">
          ยังไม่มีบัญชีผู้ใช้?{" "}
          <Link href="/register" className="font-bold text-[var(--wood-xdark)] hover:underline">
            สมัครสมาชิก
          </Link>
        </p>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] p-4">
      <div className="w-full max-w-sm bg-[var(--card)] rounded-3xl shadow-xl p-8 border border-[var(--border)]/50">
        <div className="flex flex-col items-center text-center mb-8 gap-3">
          <img src="/logo.jpg" alt="JustNavigate Logo" className="w-24 h-24 rounded-full shadow-sm object-cover border-4 border-white" />
          <div>
            <h1 className="text-2xl font-black text-[var(--foreground)]">JustNavigate</h1>
            <p className="text-sm text-[var(--muted)] font-medium mt-1">Income & Expense Tracker</p>
          </div>
        </div>
        
        <Suspense fallback={<div className="text-center">กำลังโหลด...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}


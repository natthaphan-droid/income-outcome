"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

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
    <div className="min-h-screen flex items-center justify-center bg-[var(--wood-light)] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-[var(--border)]">
        <div className="p-8 text-center bg-[var(--wood-base)] text-white">
          <h1 className="text-3xl font-bold">เข้าสู่ระบบ</h1>
          <p className="mt-2 opacity-90 text-[var(--wood-xdark)]">Income Outcome Tracker</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-[var(--danger)]/10 text-[var(--danger)] p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-[var(--wood-dark)] mb-1">
              อีเมล
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--wood-base)] bg-[var(--background)]"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--wood-dark)] mb-1">
              รหัสผ่าน
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--wood-base)] bg-[var(--background)]"
              placeholder="••••••••"
            />
            <p className="text-xs text-[var(--muted)] mt-2">
              (ทดสอบใช้ Email: test@test.com / Pass: password)
            </p>
          </div>
          
          <button
            type="submit"
            className="w-full py-3 bg-[var(--wood-base)] text-white font-medium rounded-lg hover:bg-[var(--wood-dark)] transition-colors"
          >
            เข้าสู่ระบบ
          </button>
          
          <div className="text-center mt-4">
            <span className="text-sm text-[var(--muted)]">หรือล็อกอินด้วย</span>
          </div>
          
          <button
            type="button"
            onClick={() => signIn("google")}
            className="w-full py-2 flex items-center justify-center gap-2 border border-[var(--border)] rounded-lg hover:bg-[var(--wood-light)] transition-colors text-[var(--foreground)]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
        </form>
      </div>
    </div>
  );
}

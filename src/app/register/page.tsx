"use client";
import { useState } from "react";
import { registerUser } from "../actions/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Register() {
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const res = await registerUser(formData);
    if (res.error) {
      setError(res.error);
    } else {
      router.push("/login?registered=true");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-3xl bg-card p-8 shadow-xl text-foreground">
        <div className="flex flex-col items-center gap-2 mb-8">
          <img src="/logo.jpg" alt="JustNavigate Logo" className="h-20 w-20 rounded-full shadow-sm object-cover" />
          <h1 className="text-2xl font-bold">สมัครสมาชิก</h1>
          <p className="text-sm text-muted">สร้างบัญชีเพื่อเริ่มต้นใช้งาน</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">ชื่อ</label>
            <input type="text" name="name" required className="w-full rounded-2xl border px-4 py-3 bg-wood-light/20 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="ชื่อของคุณ" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">อีเมล</label>
            <input type="email" name="email" required className="w-full rounded-2xl border px-4 py-3 bg-wood-light/20 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="you@example.com" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">รหัสผ่าน</label>
            <input type="password" name="password" required className="w-full rounded-2xl border px-4 py-3 bg-wood-light/20 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="••••••••" />
          </div>
          {error && <div className="text-sm text-red-500 bg-red-100 p-2 rounded-xl text-center">{error}</div>}
          <button type="submit" className="mt-2 w-full rounded-2xl bg-primary py-3 font-semibold text-white hover:bg-primary-dark transition shadow-md">สมัครสมาชิก</button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          มีบัญชีอยู่แล้ว?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}

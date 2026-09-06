"use client";
import { useState } from "react";
import { forgotPassword } from "../actions/auth";
import Link from "next/link";

export default function ForgotPassword() {
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");
    const formData = new FormData(e.currentTarget);
    const res = await forgotPassword(formData);
    if (res.error) {
      setMsg(res.error);
      setIsError(true);
    } else {
      setMsg("เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมลของคุณแล้ว (โปรดตรวจสอบในโฟลเดอร์จดหมายขยะด้วย)");
      setIsError(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-3xl bg-card p-8 shadow-xl text-foreground">
        <div className="flex flex-col items-center gap-2 mb-8">
          <img src="/logo.jpg" alt="Logo" className="h-20 w-20 rounded-full shadow-sm object-cover" />
          <h1 className="text-2xl font-bold">ลืมรหัสผ่าน?</h1>
          <p className="text-sm text-center text-muted">กรอกอีเมลของคุณเพื่อรับลิงก์สำหรับตั้งรหัสผ่านใหม่</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">อีเมล</label>
            <input type="email" name="email" required className="w-full rounded-2xl border px-4 py-3 bg-background text-foreground border-border focus:outline-none focus:ring-2 focus:ring-primary" placeholder="you@example.com" />
          </div>
          {msg && <div className={`text-sm p-3 rounded-xl text-center ${isError ? "bg-danger/20 text-danger" : "bg-success/20 text-success"}`}>{msg}</div>}
          <button type="submit" className="mt-2 w-full rounded-2xl bg-primary py-3 font-semibold text-primary-foreground hover:bg-dino-500 transition shadow-md">ส่งลิงก์รีเซ็ตรหัสผ่าน</button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          <Link href="/login" className="font-semibold text-primary hover:underline">
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}

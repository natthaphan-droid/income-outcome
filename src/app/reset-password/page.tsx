"use client";
import { useState, useEffect, Suspense } from "react";
import { resetPassword } from "../actions/auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    formData.append("token", token || "");
    const res = await resetPassword(formData);
    if (res.error) {
      setError(res.error);
    } else {
      router.push("/login?reset=true");
    }
  }

  if (!token) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500 mb-4">ไม่มี Token สำหรับรีเซ็ตรหัสผ่าน</p>
        <Link href="/forgot-password" className="text-primary hover:underline">ขอลิงก์ใหม่</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium">รหัสผ่านใหม่</label>
        <input type="password" name="password" required className="w-full rounded-2xl border px-4 py-3 bg-wood-light/20 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="••••••••" minLength={6} />
      </div>
      {error && <div className="text-sm text-red-500 bg-red-100 p-2 rounded-xl text-center">{error}</div>}
      <button type="submit" className="mt-2 w-full rounded-2xl bg-primary py-3 font-semibold text-white hover:bg-primary-dark transition shadow-md">บันทึกรหัสผ่านใหม่</button>
    </form>
  );
}

export default function ResetPassword() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-3xl bg-card p-8 shadow-xl text-foreground">
        <div className="flex flex-col items-center gap-2 mb-8">
          <img src="/logo.jpg" alt="Logo" className="h-20 w-20 rounded-full shadow-sm object-cover" />
          <h1 className="text-2xl font-bold">ตั้งรหัสผ่านใหม่</h1>
          <p className="text-sm text-muted">กรอกรหัสผ่านใหม่ที่คุณต้องการใช้งาน</p>
        </div>
        <Suspense fallback={<div className="text-center">กำลังโหลด...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}

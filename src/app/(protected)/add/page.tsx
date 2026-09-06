"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/Icons";
import { addTransaction, getCategories } from "@/app/actions/transactions";

export default function AddTransactionPage() {
  const [type, setType] = useState<"expense" | "income" | "saving">("expense");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    
    startTransition(async () => {
      try {
        await addTransaction({
          type,
          amount: Number(amount),
          categoryId: categoryId || undefined,
          note,
        });
        router.push("/");
      } catch (err) {
        console.error(err);
        alert("เกิดข้อผิดพลาดในการบันทึก");
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-4 bg-card text-card-foreground border-b border-border flex items-center gap-4">
        <button onClick={() => router.back()} className="text-foreground p-2 -ml-2 rounded-full hover:bg-surface text-surface-foreground">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-foreground">เพิ่มรายการใหม่</h1>
      </header>

      <main className="flex-1 p-6">
        {/* Type Selector */}
        <div className="flex bg-surface text-surface-foreground p-1 rounded-xl mb-8">
          <button
            onClick={() => setType("expense")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              type === "expense" ? "bg-card text-card-foreground text-danger shadow-sm" : "text-muted"
            }`}
          >
            รายจ่าย
          </button>
          <button
            onClick={() => setType("income")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              type === "income" ? "bg-card text-card-foreground text-success shadow-sm" : "text-muted"
            }`}
          >
            รายรับ
          </button>
          <button
            onClick={() => setType("saving")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              type === "saving" ? "bg-card text-card-foreground text-foreground shadow-sm" : "text-muted"
            }`}
          >
            เงินออม
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm text-center">
            <label className="text-sm font-medium text-muted">ระบุจำนวนเงิน</label>
            <div className="flex items-center justify-center mt-2 text-4xl font-bold">
              <span className="text-muted mr-2">฿</span>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-32 bg-transparent text-center focus:outline-none placeholder-muted text-foreground"
                placeholder="0.00"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">หมวดหมู่</label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { id: "1", icon: <Icons.Food />, label: "อาหาร" },
                { id: "2", icon: <Icons.Transport />, label: "เดินทาง" },
                { id: "3", icon: <Icons.Shopping />, label: "ช้อปปิ้ง" },
                { id: "4", icon: <Icons.Home />, label: "ที่พัก" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`w-14 h-14 bg-card text-card-foreground border ${categoryId === cat.id ? 'border-[foreground] bg-surface text-surface-foreground' : 'border-border'} rounded-2xl flex items-center justify-center text-primary shadow-sm transition-colors`}>
                    <div className="w-6 h-6">{cat.icon}</div>
                  </div>
                  <span className={`text-xs ${categoryId === cat.id ? 'text-foreground font-bold' : 'text-muted'}`}>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">บันทึกช่วยจำ (ถ้ามี)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 bg-card text-card-foreground border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[primary]"
              placeholder="เช่น ค่ารถไฟฟ้า, กินข้าวกับเพื่อน..."
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 bg-primary text-primary-foreground text-white font-bold rounded-xl hover:bg-dino-500 disabled:opacity-50 transition-colors shadow-lg mt-8"
          >
            {isPending ? "กำลังบันทึก..." : "บันทึกรายการ"}
          </button>
        </form>
      </main>
    </div>
  );
}

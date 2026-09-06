"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/Icons";
import { getCategoriesWithBudgets, setCategoryBudget } from "@/app/actions/categories";

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategoriesWithBudgets().then(data => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  const handleSaveBudget = async (id: string) => {
    const amt = Number(editAmount);
    if (isNaN(amt)) return;
    
    // Optimistic update
    setCategories(cats => cats.map(c => c.id === id ? { ...c, budget: amt } : c));
    setEditingId(null);
    
    await setCategoryBudget(id, amt);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Food": return <Icons.Food />;
      case "Transport": return <Icons.Transport />;
      case "Shopping": return <Icons.Shopping />;
      default: return <Icons.Wallet />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-4 bg-card text-card-foreground border-b border-border flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-foreground p-2 -ml-2 rounded-full hover:bg-surface text-surface-foreground">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-foreground">จัดการหมวดหมู่และงบ</h1>
      </header>

      <main className="p-6">
        {loading ? (
          <div className="text-center py-10 text-muted">กำลังโหลด...</div>
        ) : (
          <div className="space-y-4">
            {categories.filter(c => c.type === 'expense').map(cat => (
              <div key={cat.id} className="bg-card text-card-foreground p-4 rounded-2xl border border-border shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-surface text-surface-foreground flex items-center justify-center text-foreground">
                    {getIcon(cat.icon)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{cat.name}</h3>
                    {editingId === cat.id ? (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-muted text-sm">฿</span>
                        <input
                          type="number"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          className="w-24 border-b border-[primary] focus:outline-none text-sm bg-transparent"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <p className="text-xs text-muted mt-1">งบรายเดือน: {cat.budget > 0 ? `฿${cat.budget.toLocaleString()}` : "ไม่ได้ตั้ง"}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  {editingId === cat.id ? (
                    <button 
                      onClick={() => handleSaveBudget(cat.id)}
                      className="px-3 py-1 bg-primary text-primary-foreground text-white text-xs font-bold rounded-lg"
                    >
                      บันทึก
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        setEditingId(cat.id);
                        setEditAmount(cat.budget.toString());
                      }}
                      className="px-3 py-1 bg-surface text-surface-foreground text-foreground text-xs font-bold rounded-lg hover:bg-primary text-primary-foreground hover:text-white transition-colors"
                    >
                      ตั้งงบ
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Icons } from "@/components/Icons";
import { getCategoriesWithBudgets, setCategoryBudget, addCategory, deleteCategory } from "@/app/actions/categories";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("Wallet");
  const [newCatType, setNewCatType] = useState<"income" | "expense">("expense");

  const availableIcons = [
    "Food", "Coffee", "Utensils", "Wine", "IceCream",
    "Transport", "Car", "Fuel", "Plane", "Train", "Bike", "MapPin",
    "Shopping", "ShoppingCart", "Gift", "Shirt", "Tag",
    "HouseRent", "Electricity", "Water", "Laundry",
    "Heart", "Hospital", "Dumbbell", "Pill",
    "Gamepad", "Music", "Film", "Tv", "Camera", "Headphones",
    "Book", "GraduationCap",
    "Smartphone", "Wifi", "Laptop",
    "Scissors", "Sparkles", "Flower",
    "PawPrint", "Baby", "Users",
    "Shield", "Receipt", "HandHeart", "Subscription", "Wrench",
    "Briefcase", "Banknote", "CreditCard", "Wallet", "Savings",
    "Star", "Clock", "Calendar",
  ];

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) return <IconComponent className="w-5 h-5" />;
    return <Icons.Wallet className="w-5 h-5" />;
  };

  const loadData = () => {
    setLoading(true);
    getCategoriesWithBudgets().then(data => {
      setCategories(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveBudget = async (id: string) => {
    const amt = Number(editAmount);
    if (isNaN(amt)) return;
    
    // Optimistic update
    setCategories(cats => cats.map(c => c.id === id ? { ...c, budget: amt } : c));
    setEditingId(null);
    
    await setCategoryBudget(id, amt);
  };

  const handleAddCategory = async () => {
    if (!newCatName) return;
    setShowAddModal(false);
    setNewCatName("");
    await addCategory(newCatName, newCatIcon, newCatType);
    loadData();
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm("คุณต้องการลบหมวดหมู่นี้ใช่หรือไม่?")) {
      await deleteCategory(id);
      loadData();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative pb-20">
      <header className="px-6 py-8 bg-background relative text-foreground z-10 border-b border-border/30">
        <h1 className="text-2xl font-bold text-foreground">หมวดหมู่และงบ</h1>
        <p className="text-sm opacity-90 mt-1">จัดการหมวดหมู่และการตั้งงบประมาณรายเดือน</p>
      </header>

      <main className="flex-1 p-4">
        {loading ? (
          <div className="text-center py-10 text-muted">กำลังโหลด...</div>
        ) : (
          <div className="space-y-4">
            {categories.map(cat => (
              <div key={cat.id} className="bg-card text-card-foreground p-4 rounded-2xl border border-border shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-foreground ${cat.type === 'income' ? 'bg-success/10 text-success' : 'bg-surface text-surface-foreground'}`}>
                    {getIcon(cat.icon)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                      {cat.name}
                      {cat.type === 'income' && <span className="text-[10px] px-2 py-0.5 bg-success/20 text-success rounded-full">รายรับ</span>}
                    </h3>
                    {cat.type === 'expense' && (
                      editingId === cat.id ? (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-muted text-sm">฿</span>
                          <input
                            type="number"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            className="w-24 border-b border-primary focus:outline-none text-sm bg-transparent"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <p className="text-xs text-muted mt-1">งบรายเดือน: {cat.budget > 0 ? `฿${cat.budget.toLocaleString()}` : "ไม่ได้ตั้ง"}</p>
                      )
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {cat.type === 'expense' && (
                    editingId === cat.id ? (
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
                    )
                  )}
                  {!cat.isDefault && (
                    <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-danger hover:bg-danger/10 rounded-lg">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-primary-foreground text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform z-40"
      >
        <Icons.Plus className="w-6 h-6" />
      </button>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">เพิ่มหมวดหมู่ใหม่</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted block mb-1">ประเภท</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setNewCatType("expense")}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold ${newCatType === "expense" ? "bg-danger text-white" : "bg-surface text-foreground"}`}
                  >รายจ่าย</button>
                  <button 
                    onClick={() => setNewCatType("income")}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold ${newCatType === "income" ? "bg-success text-white" : "bg-surface text-foreground"}`}
                  >รายรับ</button>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted block mb-1">ชื่อหมวดหมู่</label>
                <input 
                  type="text" 
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-surface text-foreground p-3 rounded-xl border border-border focus:border-primary outline-none"
                  placeholder="เช่น ค่าไฟ, ค่าน้ำ"
                />
              </div>

              <div>
                <label className="text-sm text-muted block mb-2">เลือกไอคอน</label>
                <div className="flex flex-wrap gap-3">
                  {availableIcons.map(icon => (
                    <button 
                      key={icon}
                      onClick={() => setNewCatIcon(icon)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        newCatIcon === icon ? "bg-primary text-primary-foreground text-white" : "bg-surface text-foreground hover:bg-border"
                      }`}
                    >
                      {getIcon(icon)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 bg-surface text-foreground rounded-xl font-bold"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleAddCategory}
                className="flex-1 py-3 bg-primary text-primary-foreground text-white rounded-xl font-bold"
                disabled={!newCatName}
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

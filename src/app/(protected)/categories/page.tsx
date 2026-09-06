"use client";

import { useEffect, useState } from "react";
import { Icons } from "@/components/Icons";
import { getCategoriesWithBudgets, setCategoryBudget, addCategory, deleteCategory } from "@/app/actions/categories";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [selectedTab, setSelectedTab] = useState<"all" | "expense" | "income">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("Food");
  const [newCatType, setNewCatType] = useState<"income" | "expense">("expense");

  // ไอคอนสำหรับรายรับ (Income)
  const incomeIcons = [
    "Briefcase",   // เงินเดือน / งานประจำ
    "Laptop",      // ฟรีแลนซ์ / งานออนไลน์
    "TrendingUp",  // การลงทุน / หุ้น
    "Coins",       // ปันผล / ดอกเบี้ย
    "Trophy",      // โบนัส / รางวัล
    "BadgeDollar", // ค่าจ้างพิเศษ / คอมมิชชั่น
    "Store",       // ค้าขาย / กำไรธุรกิจ
    "Building",    // ค่าเช่า / อสังหา
    "PiggyBank",   // เงินออม / สะสม
    "Savings",     // บัญชีออมทรัพย์
    "Wallet",      // กระเป๋าเงิน
    "Banknote",    // เงินสด
    "CreditCard",  // เงินคืน / แคชแบ็ก
    "Gift",        // ของขวัญ / เงินรับไหว้
    "HandHeart",   // เงินช่วยเหลือ / บริจาค
    "Star",        // รายได้พิเศษ / อื่นๆ
  ];

  // ไอคอนสำหรับรายจ่าย (Expense)
  const expenseIcons = [
    "Food", "Coffee", "Burger", "Utensils", "Wine", "IceCream",
    "Transport", "Car", "Fuel", "Plane", "Train", "Bike", "MapPin",
    "Shopping", "ShoppingCart", "Gift", "Shirt", "Tag",
    "HouseRent", "Electricity", "Water", "Laundry",
    "Heart", "Hospital", "Dumbbell", "Pill",
    "Gamepad", "Music", "Film", "Tv", "Camera", "Headphones",
    "Book", "GraduationCap",
    "Smartphone", "Wifi", "Laptop",
    "Scissors", "Sparkles", "Flower",
    "PawPrint", "Baby", "Users",
    "Shield", "Receipt", "Subscription", "Wrench",
    "Clock", "Calendar",
  ];

  // ชื่อภาษาไทยของแต่ละไอคอน
  const iconThaiNames: Record<string, string> = {
    // รายรับ
    Briefcase: "เงินเดือน / งานประจำ",
    Laptop: "ฟรีแลนซ์ / งานออนไลน์",
    TrendingUp: "การลงทุน / หุ้น",
    Coins: "ปันผล / ดอกเบี้ย",
    Trophy: "โบนัส / รางวัล",
    BadgeDollar: "ค่าจ้างพิเศษ / คอมมิชชั่น",
    Store: "ค้าขาย / กำไรธุรกิจ",
    Building: "ค่าเช่า / อสังหาฯ",
    PiggyBank: "เงินออม / สะสม",
    Savings: "บัญชีออมทรัพย์",
    Wallet: "กระเป๋าเงิน",
    Banknote: "เงินสด / ธนบัตร",
    CreditCard: "เงินคืน / แคชแบ็ก",
    Gift: "ของขวัญ / เงินรับไหว้",
    HandHeart: "เงินช่วยเหลือ / บริจาค",
    Star: "รายได้พิเศษ / อื่นๆ",

    // รายจ่าย
    Food: "อาหาร",
    Coffee: "กาแฟ / เครื่องดื่ม",
    Burger: "ฟาสต์ฟู้ด / ของกินเล่น",
    Utensils: "ร้านอาหาร / ทานนอกบ้าน",
    Wine: "สังสรรค์ / ปาร์ตี้",
    IceCream: "ขนมหวาน / เบเกอรี่",
    Transport: "การเดินทาง / รถสาธารณะ",
    Car: "รถยนต์ส่วนตัว",
    Fuel: "ค่าน้ำมัน",
    Plane: "ตั๋วเครื่องบิน / ท่องเที่ยว",
    Train: "รถไฟฟ้า / รถไฟ",
    Bike: "มอเตอร์ไซค์ / จักรยาน",
    MapPin: "ค่าที่จอด / ทางด่วน",
    Shopping: "ช้อปปิ้ง",
    ShoppingCart: "ซื้อของเข้าบ้าน / ตลาด",
    Shirt: "เสื้อผ้า / แฟชั่น",
    Tag: "โปรโมชั่น / ของเซล",
    HouseRent: "ค่าเช่าห้อง / ค่าบ้าน",
    Electricity: "ค่าไฟฟ้า",
    Water: "ค่าน้ำประปา",
    Laundry: "ซักรีด / ทำความสะอาด",
    Heart: "สุขภาพ / ประกันสุขภาพ",
    Hospital: "หาหมอ / ค่ายา",
    Dumbbell: "ฟิตเนส / ออกกำลังกาย",
    Pill: "ยา / วิตามิน",
    Gamepad: "เกม / เติมเกม",
    Music: "ฟังเพลง / สตรีมมิ่ง",
    Film: "ดูหนัง / ตั๋วหนัง",
    Tv: "ทีวี / ซีรีส์ / เน็ตฟลิกซ์",
    Camera: "ถ่ายภาพ / คอนเทนต์",
    Headphones: "แกดเจ็ต / หูฟัง",
    Book: "หนังสือ / การเรียนรู้",
    GraduationCap: "การศึกษา / ค่าเทอม",
    Smartphone: "ค่าโทรศัพท์",
    Wifi: "ค่าอินเทอร์เน็ต",
    Scissors: "ตัดผม / เสริมสวย",
    Sparkles: "บิวตี้ / เครื่องสำอาง",
    Flower: "ต้นไม้ / ดอกไม้ / แต่งห้อง",
    PawPrint: "สัตว์เลี้ยง",
    Baby: "ของใช้เด็ก / ลูก",
    Users: "ครอบครัว / ดูแลคนในบ้าน",
    Shield: "ประกันภัย",
    Receipt: "บิล / ภาษี",
    Subscription: "สมาชิกรายเดือน / ซับสคริปชัน",
    Wrench: "ซ่อมแซม / บำรุงรักษา",
    Clock: "ค่าบริการรายชั่วโมง",
    Calendar: "ค่าธรรมเนียมรายปี",
  };

  const currentIcons = newCatType === "income" ? incomeIcons : expenseIcons;

  const handleTypeChange = (type: "income" | "expense") => {
    setNewCatType(type);
    if (type === "income" && !incomeIcons.includes(newCatIcon)) {
      setNewCatIcon("Briefcase");
    } else if (type === "expense" && !expenseIcons.includes(newCatIcon)) {
      setNewCatIcon("Food");
    }
  };

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

      {/* Filter Tabs */}
      <div className="flex p-1 bg-surface rounded-xl mx-4 mt-4 border border-border/40">
        <button
          onClick={() => setSelectedTab("all")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            selectedTab === "all" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          ทั้งหมด ({categories.length})
        </button>
        <button
          onClick={() => setSelectedTab("income")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            selectedTab === "income" ? "bg-success text-white shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          รายรับ ({categories.filter(c => c.type === 'income').length})
        </button>
        <button
          onClick={() => setSelectedTab("expense")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            selectedTab === "expense" ? "bg-danger text-white shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          รายจ่าย ({categories.filter(c => c.type === 'expense').length})
        </button>
      </div>

      <main className="flex-1 p-4">
        {loading ? (
          <div className="text-center py-10 text-muted">กำลังโหลด...</div>
        ) : (
          <div className="space-y-4">
            {categories
              .filter(cat => selectedTab === "all" || cat.type === selectedTab)
              .map(cat => (
              <div key={cat.id} className="bg-card text-card-foreground p-4 rounded-2xl border border-border shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-foreground ${cat.type === 'income' ? 'bg-success/10 text-success' : 'bg-surface text-surface-foreground'}`}>
                    {getIcon(cat.icon)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                      {cat.name}
                      {cat.type === 'income' ? (
                        <span className="text-[10px] px-2 py-0.5 bg-success/20 text-success rounded-full font-semibold">รายรับ</span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 bg-danger/10 text-danger rounded-full font-semibold">รายจ่าย</span>
                      )}
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
        onClick={() => {
          handleTypeChange(selectedTab === "income" ? "income" : "expense");
          setShowAddModal(true);
        }}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-primary-foreground text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform z-40"
      >
        <Icons.Plus className="w-6 h-6" />
      </button>

      {/* Add Category Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddModal(false);
          }}
        >
          <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-2xl w-full max-w-sm max-h-[75vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-border flex items-center justify-between shrink-0 bg-card">
              <h2 className="text-lg font-bold text-foreground">
                เพิ่มหมวดหมู่{newCatType === "income" ? "รายรับ" : "รายจ่าย"}ใหม่
              </h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-foreground hover:bg-surface transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Modal Body (Flex Column instead of Scrollable) */}
            <div className="flex flex-col flex-1 p-5 space-y-4 overflow-hidden">
              <div className="shrink-0">
                <label className="text-xs font-semibold text-muted block mb-1.5">ประเภท</label>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => handleTypeChange("income")}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${newCatType === "income" ? "bg-success text-white shadow-sm" : "bg-surface text-foreground hover:bg-border"}`}
                  >
                    รายรับ
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleTypeChange("expense")}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${newCatType === "expense" ? "bg-danger text-white shadow-sm" : "bg-surface text-foreground hover:bg-border"}`}
                  >
                    รายจ่าย
                  </button>
                </div>
              </div>

              <div className="shrink-0">
                <label className="text-xs font-semibold text-muted block mb-1.5">ชื่อหมวดหมู่</label>
                <input 
                  type="text" 
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-surface text-foreground px-3.5 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                  placeholder={newCatType === "income" ? "เช่น เงินเดือน, โบนัส, ขายของ" : "เช่น ค่าอาหาร, ค่าน้ำมัน, ช้อปปิ้ง"}
                />
              </div>

              <div className="flex flex-col flex-1 min-h-0">
                <div className="flex items-center justify-between mb-1.5 shrink-0">
                  <label className="text-xs font-semibold text-muted">
                    ไอคอน{newCatType === "income" ? "รายรับ" : "รายจ่าย"}
                  </label>
                  <span className="text-[11px] text-muted">เลือกได้ ({currentIcons.length} แบบ)</span>
                </div>
                
                {/* Scrollable Icon Grid */}
                <div className="flex-1 overflow-y-auto p-2.5 border border-border rounded-xl bg-surface/40 overscroll-contain">
                  <div className="grid grid-cols-4 gap-2.5">
                    {currentIcons.map(icon => (
                      <button 
                        key={icon}
                        type="button"
                        onClick={() => setNewCatIcon(icon)}
                        className={`aspect-square rounded-xl flex items-center justify-center transition-all ${
                          newCatIcon === icon 
                            ? (newCatType === "income" 
                                ? "bg-success text-white ring-2 ring-success ring-offset-2 scale-105 shadow-sm" 
                                : "bg-danger text-white ring-2 ring-danger ring-offset-2 scale-105 shadow-sm")
                            : "bg-card text-foreground hover:bg-surface border border-border/50"
                        }`}
                        title={iconThaiNames[icon] || icon}
                      >
                        {getIcon(icon)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* แสดงชื่อไอคอนภาษาไทยที่เลือก */}
                <div className="mt-2.5 px-3 py-2 bg-surface/80 border border-border/60 rounded-xl flex items-center gap-2.5 shrink-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    newCatType === "income" ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
                  }`}>
                    {getIcon(newCatIcon)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-muted leading-tight">ไอคอนที่เลือก:</span>
                    <span className="text-xs font-bold text-foreground truncate">
                      {iconThaiNames[newCatIcon] || newCatIcon}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer (Fixed) */}
            <div className="p-4 px-5 shrink-0 border-t border-border flex gap-2.5 bg-card">
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 bg-surface text-foreground hover:bg-border rounded-xl font-bold text-sm transition-colors"
              >
                ยกเลิก
              </button>
              <button 
                type="button"
                onClick={handleAddCategory}
                className={`flex-1 py-2.5 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm ${
                  newCatType === "income" ? "bg-success hover:bg-success/90" : "bg-danger hover:bg-danger/90"
                }`}
                disabled={!newCatName.trim()}
              >
                บันทึก{newCatType === "income" ? "รายรับ" : "รายจ่าย"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

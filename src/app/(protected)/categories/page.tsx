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

  // เนเธญเธเธญเธเธชเธณเธซเธฃเธฑเธเธฃเธฒเธขเธฃเธฑเธ (Income)
  const incomeIcons = [
    "Briefcase",   // เน€เธเธดเธเน€เธ”เธทเธญเธ / เธเธฒเธเธเธฃเธฐเธเธณ
    "Laptop",      // เธเธฃเธตเนเธฅเธเธเน / เธเธฒเธเธญเธญเธเนเธฅเธเน
    "TrendingUp",  // เธเธฒเธฃเธฅเธเธ—เธธเธ / เธซเธธเนเธ
    "Coins",       // เธเธฑเธเธเธฅ / เธ”เธญเธเน€เธเธตเนเธข
    "Trophy",      // เนเธเธเธฑเธช / เธฃเธฒเธเธงเธฑเธฅ
    "BadgeDollar", // เธเนเธฒเธเนเธฒเธเธเธดเน€เธจเธฉ / เธเธญเธกเธกเธดเธเธเธฑเนเธ
    "Store",       // เธเนเธฒเธเธฒเธข / เธเธณเนเธฃเธเธธเธฃเธเธดเธ
    "Building",    // เธเนเธฒเน€เธเนเธฒ / เธญเธชเธฑเธเธซเธฒ
    "PiggyBank",   // เน€เธเธดเธเธญเธญเธก / เธชเธฐเธชเธก
    "Savings",     // เธเธฑเธเธเธตเธญเธญเธกเธ—เธฃเธฑเธเธขเน
    "Wallet",      // เธเธฃเธฐเน€เธเนเธฒเน€เธเธดเธ
    "Banknote",    // เน€เธเธดเธเธชเธ”
    "CreditCard",  // เน€เธเธดเธเธเธทเธ / เนเธเธเนเธเนเธ
    "Gift",        // เธเธญเธเธเธงเธฑเธ / เน€เธเธดเธเธฃเธฑเธเนเธซเธงเน
    "HandHeart",   // เน€เธเธดเธเธเนเธงเธขเน€เธซเธฅเธทเธญ / เธเธฃเธดเธเธฒเธ
    "Star",        // เธฃเธฒเธขเนเธ”เนเธเธดเน€เธจเธฉ / เธญเธทเนเธเน
  ];

  // เนเธญเธเธญเธเธชเธณเธซเธฃเธฑเธเธฃเธฒเธขเธเนเธฒเธข (Expense)
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

  // เธเธทเนเธญเธ เธฒเธฉเธฒเนเธ—เธขเธเธญเธเนเธ•เนเธฅเธฐเนเธญเธเธญเธ
  const iconThaiNames: Record<string, string> = {
    // เธฃเธฒเธขเธฃเธฑเธ
    Briefcase: "เน€เธเธดเธเน€เธ”เธทเธญเธ / เธเธฒเธเธเธฃเธฐเธเธณ",
    Laptop: "เธเธฃเธตเนเธฅเธเธเน / เธเธฒเธเธญเธญเธเนเธฅเธเน",
    TrendingUp: "เธเธฒเธฃเธฅเธเธ—เธธเธ / เธซเธธเนเธ",
    Coins: "เธเธฑเธเธเธฅ / เธ”เธญเธเน€เธเธตเนเธข",
    Trophy: "เนเธเธเธฑเธช / เธฃเธฒเธเธงเธฑเธฅ",
    BadgeDollar: "เธเนเธฒเธเนเธฒเธเธเธดเน€เธจเธฉ / เธเธญเธกเธกเธดเธเธเธฑเนเธ",
    Store: "เธเนเธฒเธเธฒเธข / เธเธณเนเธฃเธเธธเธฃเธเธดเธ",
    Building: "เธเนเธฒเน€เธเนเธฒ / เธญเธชเธฑเธเธซเธฒเธฏ",
    PiggyBank: "เน€เธเธดเธเธญเธญเธก / เธชเธฐเธชเธก",
    Savings: "เธเธฑเธเธเธตเธญเธญเธกเธ—เธฃเธฑเธเธขเน",
    Wallet: "เธเธฃเธฐเน€เธเนเธฒเน€เธเธดเธ",
    Banknote: "เน€เธเธดเธเธชเธ” / เธเธเธเธฑเธ•เธฃ",
    CreditCard: "เน€เธเธดเธเธเธทเธ / เนเธเธเนเธเนเธ",
    Gift: "เธเธญเธเธเธงเธฑเธ / เน€เธเธดเธเธฃเธฑเธเนเธซเธงเน",
    HandHeart: "เน€เธเธดเธเธเนเธงเธขเน€เธซเธฅเธทเธญ / เธเธฃเธดเธเธฒเธ",
    Star: "เธฃเธฒเธขเนเธ”เนเธเธดเน€เธจเธฉ / เธญเธทเนเธเน",

    // เธฃเธฒเธขเธเนเธฒเธข
    Food: "เธญเธฒเธซเธฒเธฃ",
    Coffee: "เธเธฒเนเธ / เน€เธเธฃเธทเนเธญเธเธ”เธทเนเธก",
    Burger: "เธเธฒเธชเธ•เนเธเธนเนเธ” / เธเธญเธเธเธดเธเน€เธฅเนเธ",
    Utensils: "เธฃเนเธฒเธเธญเธฒเธซเธฒเธฃ / เธ—เธฒเธเธเธญเธเธเนเธฒเธ",
    Wine: "เธชเธฑเธเธชเธฃเธฃเธเน / เธเธฒเธฃเนเธ•เธตเน",
    IceCream: "เธเธเธกเธซเธงเธฒเธ / เน€เธเน€เธเธญเธฃเธตเน",
    Transport: "เธเธฒเธฃเน€เธ”เธดเธเธ—เธฒเธ / เธฃเธ–เธชเธฒเธเธฒเธฃเธ“เธฐ",
    Car: "เธฃเธ–เธขเธเธ•เนเธชเนเธงเธเธ•เธฑเธง",
    Fuel: "เธเนเธฒเธเนเธณเธกเธฑเธ",
    Plane: "เธ•เธฑเนเธงเน€เธเธฃเธทเนเธญเธเธเธดเธ / เธ—เนเธญเธเน€เธ—เธตเนเธขเธง",
    Train: "เธฃเธ–เนเธเธเนเธฒ / เธฃเธ–เนเธ",
    Bike: "เธกเธญเน€เธ•เธญเธฃเนเนเธเธเน / เธเธฑเธเธฃเธขเธฒเธ",
    MapPin: "เธเนเธฒเธ—เธตเนเธเธญเธ” / เธ—เธฒเธเธ”เนเธงเธ",
    Shopping: "เธเนเธญเธเธเธดเนเธ",
    ShoppingCart: "เธเธทเนเธญเธเธญเธเน€เธเนเธฒเธเนเธฒเธ / เธ•เธฅเธฒเธ”",
    Shirt: "เน€เธชเธทเนเธญเธเนเธฒ / เนเธเธเธฑเนเธ",
    Tag: "เนเธเธฃเนเธกเธเธฑเนเธ / เธเธญเธเน€เธเธฅ",
    HouseRent: "เธเนเธฒเน€เธเนเธฒเธซเนเธญเธ / เธเนเธฒเธเนเธฒเธ",
    Electricity: "เธเนเธฒเนเธเธเนเธฒ",
    Water: "เธเนเธฒเธเนเธณเธเธฃเธฐเธเธฒ",
    Laundry: "เธเธฑเธเธฃเธตเธ” / เธ—เธณเธเธงเธฒเธกเธชเธฐเธญเธฒเธ”",
    Heart: "เธชเธธเธเธ เธฒเธ / เธเธฃเธฐเธเธฑเธเธชเธธเธเธ เธฒเธ",
    Hospital: "เธซเธฒเธซเธกเธญ / เธเนเธฒเธขเธฒ",
    Dumbbell: "เธเธดเธ•เน€เธเธช / เธญเธญเธเธเธณเธฅเธฑเธเธเธฒเธข",
    Pill: "เธขเธฒ / เธงเธดเธ•เธฒเธกเธดเธ",
    Gamepad: "เน€เธเธก / เน€เธ•เธดเธกเน€เธเธก",
    Music: "เธเธฑเธเน€เธเธฅเธ / เธชเธ•เธฃเธตเธกเธกเธดเนเธ",
    Film: "เธ”เธนเธซเธเธฑเธ / เธ•เธฑเนเธงเธซเธเธฑเธ",
    Tv: "เธ—เธตเธงเธต / เธเธตเธฃเธตเธชเน / เน€เธเนเธ•เธเธฅเธดเธเธเน",
    Camera: "เธ–เนเธฒเธขเธ เธฒเธ / เธเธญเธเน€เธ—เธเธ•เน",
    Headphones: "เนเธเธ”เน€เธเนเธ• / เธซเธนเธเธฑเธ",
    Book: "เธซเธเธฑเธเธชเธทเธญ / เธเธฒเธฃเน€เธฃเธตเธขเธเธฃเธนเน",
    GraduationCap: "เธเธฒเธฃเธจเธถเธเธฉเธฒ / เธเนเธฒเน€เธ—เธญเธก",
    Smartphone: "เธเนเธฒเนเธ—เธฃเธจเธฑเธเธ—เน",
    Wifi: "เธเนเธฒเธญเธดเธเน€เธ—เธญเธฃเนเน€เธเนเธ•",
    Scissors: "เธ•เธฑเธ”เธเธก / เน€เธชเธฃเธดเธกเธชเธงเธข",
    Sparkles: "เธเธดเธงเธ•เธตเน / เน€เธเธฃเธทเนเธญเธเธชเธณเธญเธฒเธ",
    Flower: "เธ•เนเธเนเธกเน / เธ”เธญเธเนเธกเน / เนเธ•เนเธเธซเนเธญเธ",
    PawPrint: "เธชเธฑเธ•เธงเนเน€เธฅเธตเนเธขเธ",
    Baby: "เธเธญเธเนเธเนเน€เธ”เนเธ / เธฅเธนเธ",
    Users: "เธเธฃเธญเธเธเธฃเธฑเธง / เธ”เธนเนเธฅเธเธเนเธเธเนเธฒเธ",
    Shield: "เธเธฃเธฐเธเธฑเธเธ เธฑเธข",
    Receipt: "เธเธดเธฅ / เธ เธฒเธฉเธต",
    Subscription: "เธชเธกเธฒเธเธดเธเธฃเธฒเธขเน€เธ”เธทเธญเธ / เธเธฑเธเธชเธเธฃเธดเธเธเธฑเธ",
    Wrench: "เธเนเธญเธกเนเธเธก / เธเธณเธฃเธธเธเธฃเธฑเธเธฉเธฒ",
    Clock: "เธเนเธฒเธเธฃเธดเธเธฒเธฃเธฃเธฒเธขเธเธฑเนเธงเนเธกเธ",
    Calendar: "เธเนเธฒเธเธฃเธฃเธกเน€เธเธตเธขเธกเธฃเธฒเธขเธเธต",
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
    if (confirm("เธเธธเธ“เธ•เนเธญเธเธเธฒเธฃเธฅเธเธซเธกเธงเธ”เธซเธกเธนเนเธเธตเนเนเธเนเธซเธฃเธทเธญเนเธกเน?")) {
      await deleteCategory(id);
      loadData();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative pb-20">
      <header className="px-6 py-8 bg-primary text-primary-foreground shadow-md relative z-10">
        <h1 className="text-2xl font-bold">เธซเธกเธงเธ”เธซเธกเธนเนเนเธฅเธฐเธเธ</h1>
        <p className="text-sm opacity-90 mt-1">เธเธฑเธ”เธเธฒเธฃเธซเธกเธงเธ”เธซเธกเธนเนเนเธฅเธฐเธเธฒเธฃเธ•เธฑเนเธเธเธเธเธฃเธฐเธกเธฒเธ“เธฃเธฒเธขเน€เธ”เธทเธญเธ</p>
      </header>

      {/* Filter Tabs */}
      <div className="flex p-1 bg-surface rounded-xl mx-4 mt-4 border border-border/40">
        <button
          onClick={() => setSelectedTab("all")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            selectedTab === "all" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          เธ—เธฑเนเธเธซเธกเธ” ({categories.length})
        </button>
        <button
          onClick={() => setSelectedTab("income")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            selectedTab === "income" ? "bg-success text-white shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          เธฃเธฒเธขเธฃเธฑเธ ({categories.filter(c => c.type === 'income').length})
        </button>
        <button
          onClick={() => setSelectedTab("expense")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            selectedTab === "expense" ? "bg-danger text-white shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          เธฃเธฒเธขเธเนเธฒเธข ({categories.filter(c => c.type === 'expense').length})
        </button>
      </div>

      <main className="flex-1 p-4">
        {loading ? (
          <div className="text-center py-10 text-muted">เธเธณเธฅเธฑเธเนเธซเธฅเธ”...</div>
        ) : (
          <div className="space-y-5">
            {/* Overall Budget Chart */}
            {(() => {
              const expenseCats = categories.filter(c => c.type === 'expense');
              const totalBudget = expenseCats.reduce((sum, c) => sum + (c.budget || 0), 0);
              const totalSpent = expenseCats.reduce((sum, c) => sum + (c.spent || 0), 0);
              const percent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
              const remaining = Math.max(totalBudget - totalSpent, 0);

              if (totalBudget > 0 && selectedTab !== 'income') {
                return (
                  <div className="bg-card p-5 rounded-3xl border border-border shadow-sm">
                    <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                      <Icons.Chart className="w-4 h-4 text-primary" />
                      เธ เธฒเธเธฃเธงเธกเธเธเธเธฃเธฐเธกเธฒเธ“เน€เธ”เธทเธญเธเธเธตเน
                    </h2>
                    <div className="flex justify-between text-xs font-medium text-muted mb-2">
                      <span>เนเธเนเนเธเนเธฅเนเธง เธฟ{totalSpent.toLocaleString()}</span>
                      <span>เธเธเธ—เธฑเนเธเธซเธกเธ” เธฟ{totalBudget.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-surface rounded-full h-3.5 mb-2.5 overflow-hidden border border-border/50">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${percent > 90 ? 'bg-danger' : percent > 75 ? 'bg-orange-500' : 'bg-primary'}`} 
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-muted">{percent.toFixed(1)}% เธเธญเธเธเธ</span>
                      <span className={`text-xs font-bold ${remaining === 0 ? 'text-danger' : 'text-primary'}`}>
                        เน€เธซเธฅเธทเธญเธญเธตเธ เธฟ{remaining.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            <div className="space-y-3">
              {categories
                .filter(cat => selectedTab === "all" || cat.type === selectedTab)
                .map(cat => (
                <div key={cat.id} className="bg-card text-card-foreground p-4 rounded-2xl border border-border shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0 pr-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-foreground ${cat.type === 'income' ? 'bg-success/10 text-success' : 'bg-surface text-surface-foreground'}`}>
                      {getIcon(cat.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                        <span className="truncate">{cat.name}</span>
                        {cat.type === 'income' ? (
                          <span className="text-[10px] px-2 py-0.5 bg-success/20 text-success rounded-full font-semibold shrink-0">เธฃเธฒเธขเธฃเธฑเธ</span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 bg-danger/10 text-danger rounded-full font-semibold shrink-0">เธฃเธฒเธขเธเนเธฒเธข</span>
                        )}
                      </h3>
                      {cat.type === 'expense' && (
                        editingId === cat.id ? (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-muted text-sm">เธฟ</span>
                            <input
                              type="number"
                              value={editAmount}
                              onChange={(e) => setEditAmount(e.target.value)}
                              className="w-24 border-b border-primary focus:outline-none text-sm bg-transparent"
                              autoFocus
                            />
                          </div>
                        ) : (
                          <div className="mt-1.5 w-full pr-4">
                            {cat.budget > 0 ? (
                              <>
                                <div className="flex justify-between text-[10px] text-muted mb-1">
                                  <span>เนเธเนเนเธ: เธฟ{(cat.spent || 0).toLocaleString()}</span>
                                  <span>เธเธ: เธฟ{cat.budget.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-surface rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all ${
                                      ((cat.spent || 0) / cat.budget) * 100 > 90 ? 'bg-danger' : 
                                      ((cat.spent || 0) / cat.budget) * 100 > 75 ? 'bg-orange-500' : 'bg-primary'
                                    }`} 
                                    style={{ width: `${Math.min(((cat.spent || 0) / cat.budget) * 100, 100)}%` }}
                                  ></div>
                                </div>
                              </>
                            ) : (
                              <p className="text-xs text-muted">เธขเธฑเธเนเธกเนเนเธ”เนเธ•เธฑเนเธเธเธ</p>
                            )}
                          </div>
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
                        เธเธฑเธเธ—เธถเธ
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          setEditingId(cat.id);
                          setEditAmount(cat.budget.toString());
                        }}
                        className="px-3 py-1 bg-surface text-surface-foreground text-foreground text-xs font-bold rounded-lg hover:bg-primary text-primary-foreground hover:text-white transition-colors"
                      >
                        เธ•เธฑเนเธเธเธ
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
                เน€เธเธดเนเธกเธซเธกเธงเธ”เธซเธกเธนเน{newCatType === "income" ? "เธฃเธฒเธขเธฃเธฑเธ" : "เธฃเธฒเธขเธเนเธฒเธข"}เนเธซเธกเน
              </h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-foreground hover:bg-surface transition-colors"
              >
                โ•
              </button>
            </div>
            
            {/* Modal Body (Flex Column instead of Scrollable) */}
            <div className="flex flex-col flex-1 p-5 space-y-4 overflow-hidden">
              <div className="shrink-0">
                <label className="text-xs font-semibold text-muted block mb-1.5">เธเธฃเธฐเน€เธ เธ—</label>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => handleTypeChange("income")}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${newCatType === "income" ? "bg-success text-white shadow-sm" : "bg-surface text-foreground hover:bg-border"}`}
                  >
                    เธฃเธฒเธขเธฃเธฑเธ
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleTypeChange("expense")}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${newCatType === "expense" ? "bg-danger text-white shadow-sm" : "bg-surface text-foreground hover:bg-border"}`}
                  >
                    เธฃเธฒเธขเธเนเธฒเธข
                  </button>
                </div>
              </div>

              <div className="shrink-0">
                <label className="text-xs font-semibold text-muted block mb-1.5">เธเธทเนเธญเธซเธกเธงเธ”เธซเธกเธนเน</label>
                <input 
                  type="text" 
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-surface text-foreground px-3.5 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                  placeholder={newCatType === "income" ? "เน€เธเนเธ เน€เธเธดเธเน€เธ”เธทเธญเธ, เนเธเธเธฑเธช, เธเธฒเธขเธเธญเธ" : "เน€เธเนเธ เธเนเธฒเธญเธฒเธซเธฒเธฃ, เธเนเธฒเธเนเธณเธกเธฑเธ, เธเนเธญเธเธเธดเนเธ"}
                />
              </div>

              <div className="flex flex-col flex-1 min-h-0">
                <div className="flex items-center justify-between mb-1.5 shrink-0">
                  <label className="text-xs font-semibold text-muted">
                    เนเธญเธเธญเธ{newCatType === "income" ? "เธฃเธฒเธขเธฃเธฑเธ" : "เธฃเธฒเธขเธเนเธฒเธข"}
                  </label>
                  <span className="text-[11px] text-muted">เน€เธฅเธทเธญเธเนเธ”เน ({currentIcons.length} เนเธเธ)</span>
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

                {/* เนเธชเธ”เธเธเธทเนเธญเนเธญเธเธญเธเธ เธฒเธฉเธฒเนเธ—เธขเธ—เธตเนเน€เธฅเธทเธญเธ */}
                <div className="mt-2.5 px-3 py-2 bg-surface/80 border border-border/60 rounded-xl flex items-center gap-2.5 shrink-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    newCatType === "income" ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
                  }`}>
                    {getIcon(newCatIcon)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-muted leading-tight">เนเธญเธเธญเธเธ—เธตเนเน€เธฅเธทเธญเธ:</span>
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
                เธขเธเน€เธฅเธดเธ
              </button>
              <button 
                type="button"
                onClick={handleAddCategory}
                className={`flex-1 py-2.5 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm ${
                  newCatType === "income" ? "bg-success hover:bg-success/90" : "bg-danger hover:bg-danger/90"
                }`}
                disabled={!newCatName.trim()}
              >
                เธเธฑเธเธ—เธถเธ{newCatType === "income" ? "เธฃเธฒเธขเธฃเธฑเธ" : "เธฃเธฒเธขเธเนเธฒเธข"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

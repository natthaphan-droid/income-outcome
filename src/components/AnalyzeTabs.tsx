"use client";

import { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: 'ม.ค.', income: 40000, expense: 24000, savings: 16000 },
  { name: 'ก.พ.', income: 35000, expense: 22000, savings: 13000 },
  { name: 'มี.ค.', income: 42000, expense: 28000, savings: 14000 },
  { name: 'เม.ย.', income: 38000, expense: 25000, savings: 13000 },
  { name: 'พ.ค.', income: 45000, expense: 30000, savings: 15000 },
  { name: 'มิ.ย.', income: 39000, expense: 21000, savings: 18000 },
];

export function AnalyzeTabs() {
  const [activeTab, setActiveTab] = useState<"income" | "expense" | "savings">("income");

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex p-1 bg-surface rounded-xl mb-6">
        <button
          onClick={() => setActiveTab("income")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === "income" ? "bg-card text-success shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          รายรับ
        </button>
        <button
          onClick={() => setActiveTab("expense")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === "expense" ? "bg-card text-danger shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          รายจ่าย
        </button>
        <button
          onClick={() => setActiveTab("savings")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === "savings" ? "bg-card text-primary shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          เงินออม
        </button>
      </div>

      {/* Chart Section */}
      <div className="bg-card border border-border/50 rounded-2xl p-4 mb-6 h-72">
        <h3 className="text-sm font-bold text-foreground mb-4">
          เปรียบเทียบ{activeTab === 'income' ? 'รายรับ' : activeTab === 'expense' ? 'รายจ่าย' : 'เงินออม'}รายเดือน
        </h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === 'savings' ? (
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted)' }} />
                <Tooltip 
                  cursor={{ fill: 'var(--surface)' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}
                  formatter={(value: number) => [`฿ ${value.toLocaleString()}`, 'จำนวนเงิน']}
                />
                <Line type="monotone" dataKey="savings" stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--primary)', strokeWidth: 2 }} />
              </LineChart>
            ) : (
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted)' }} />
                <Tooltip 
                  cursor={{ fill: 'var(--surface)' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}
                  formatter={(value: number) => [`฿ ${value.toLocaleString()}`, 'จำนวนเงิน']}
                />
                <Bar 
                  dataKey={activeTab} 
                  fill={activeTab === 'income' ? '#10b981' : '#ef4444'} 
                  radius={[4, 4, 0, 0]} 
                  barSize={30}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* List Section */}
      <div className="flex-1">
        <h3 className="text-lg font-bold text-foreground mb-4">
          รายการ{activeTab === 'income' ? 'รับ' : activeTab === 'expense' ? 'จ่าย' : 'ออม'}สูงสุด
        </h3>
        <div className="space-y-3">
          {/* Mock data for list */}
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-card text-card-foreground p-4 rounded-2xl border border-border flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activeTab === 'income' ? 'bg-success/10 text-success' : 
                  activeTab === 'expense' ? 'bg-danger/10 text-danger' : 
                  'bg-primary/10 text-primary'
                }`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-sm">
                    {activeTab === 'income' ? 'เงินเดือน' : activeTab === 'expense' ? 'ค่าอาหาร' : 'เงินเก็บไปเที่ยว'}
                  </h4>
                  <p className="text-xs text-muted">มิถุนายน</p>
                </div>
              </div>
              <div className={`font-semibold ${
                activeTab === 'income' ? 'text-success' : 
                activeTab === 'expense' ? 'text-danger' : 
                'text-primary'
              }`}>
                {activeTab === 'income' ? '+' : activeTab === 'expense' ? '-' : '+'}
                ฿{(15000 / item).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

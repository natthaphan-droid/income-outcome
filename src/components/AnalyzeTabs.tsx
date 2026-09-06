"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: 'ม.ค.', income: 40000, expense: 24000, savings: 16000 },
  { name: 'ก.พ.', income: 35000, expense: 22000, savings: 13000 },
  { name: 'มี.ค.', income: 42000, expense: 28000, savings: 14000 },
  { name: 'เม.ย.', income: 38000, expense: 25000, savings: 13000 },
  { name: 'พ.ค.', income: 45000, expense: 30000, savings: 15000 },
  { name: 'มิ.ย.', income: 39000, expense: 21000, savings: 18000 },
];

// Summary cards data
const totalIncome = data.reduce((sum, d) => sum + d.income, 0);
const totalExpense = data.reduce((sum, d) => sum + d.expense, 0);
const totalSavings = data.reduce((sum, d) => sum + d.savings, 0);

export function AnalyzeTabs() {
  return (
    <div className="flex flex-col h-full">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-card border border-border/50 rounded-xl p-3 shadow-sm">
          <div className="text-[10px] text-muted mb-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#10b981]"></span> รายรับ
          </div>
          <div className="font-bold text-sm text-success">฿{totalIncome.toLocaleString()}</div>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-3 shadow-sm">
          <div className="text-[10px] text-muted mb-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#ef4444]"></span> รายจ่าย
          </div>
          <div className="font-bold text-sm text-danger">฿{totalExpense.toLocaleString()}</div>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-3 shadow-sm">
          <div className="text-[10px] text-muted mb-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span> เงินออม
          </div>
          <div className="font-bold text-sm text-primary">฿{totalSavings.toLocaleString()}</div>
        </div>
      </div>

      {/* Combined Comparison Chart */}
      <div className="bg-card border border-border/50 rounded-2xl p-4 mb-6">
        <h3 className="text-sm font-bold text-foreground mb-4">เปรียบเทียบรายรับ รายจ่าย เงินออม รายเดือน</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--muted)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--muted)' }} />
              <Tooltip
                cursor={{ fill: 'var(--surface)', opacity: 0.5 }}
                contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', color: 'var(--card-foreground)', fontSize: '12px' }}
                formatter={(value: any, name: any) => {
                  const label = name === 'income' ? 'รายรับ' : name === 'expense' ? 'รายจ่าย' : 'เงินออม';
                  return [`฿ ${value.toLocaleString()}`, label];
                }}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                iconType="circle"
                formatter={(value: string) => {
                  const label = value === 'income' ? 'รายรับ' : value === 'expense' ? 'รายจ่าย' : 'เงินออม';
                  return <span style={{ fontSize: '12px', color: 'var(--foreground)' }}>{label}</span>;
                }}
              />
              <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={16} />
              <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={16} />
              <Bar dataKey="savings" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly breakdown list */}
      <div className="flex-1">
        <h3 className="text-lg font-bold text-foreground mb-4">รายละเอียดรายเดือน</h3>
        <div className="space-y-3">
          {[...data].reverse().map((month) => (
            <div key={month.name} className="bg-card text-card-foreground p-4 rounded-2xl border border-border shadow-sm">
              <div className="font-bold text-sm text-foreground mb-3">{month.name}</div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-[10px] text-muted mb-0.5">รายรับ</div>
                  <div className="font-semibold text-sm text-success">+฿{month.income.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted mb-0.5">รายจ่าย</div>
                  <div className="font-semibold text-sm text-danger">-฿{month.expense.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted mb-0.5">เงินออม</div>
                  <div className="font-semibold text-sm text-primary">฿{month.savings.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

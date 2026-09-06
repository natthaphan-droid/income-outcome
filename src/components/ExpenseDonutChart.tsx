"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

interface ExpenseDonutChartProps {
  data: { name: string; value: number }[];
}

export function ExpenseDonutChart({ data }: ExpenseDonutChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted text-sm border border-border/50 rounded-2xl bg-card">
        ไม่มีข้อมูลรายจ่ายในเดือนนี้
      </div>
    );
  }

  return (
    <div className="h-64 w-full bg-card border border-border/50 rounded-2xl p-4 flex flex-col">
      <h3 className="text-sm font-bold text-foreground mb-2">สัดส่วนรายจ่าย</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => `฿ ${value.toLocaleString()}`}
              contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

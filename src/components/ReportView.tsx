"use client";

import { useState, useEffect } from "react";
import { Icons } from "@/components/Icons";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getReportData } from "@/app/actions/reports";

export default function ReportView({ initialData }: { initialData: any }) {
  const [tab, setTab] = useState<"day" | "week" | "month" | "year">("week");
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getReportData(tab).then(res => {
      if (mounted) {
        setData(res);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [tab]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Food": return <Icons.Food />;
      case "Transport": return <Icons.Transport />;
      case "Shopping": return <Icons.Shopping />;
      default: return <Icons.Wallet />;
    }
  };

  return (
    <>
      <div className="flex bg-surface p-1 rounded-xl mt-6">
        {(["day", "week", "month", "year"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${
              tab === t ? "bg-card text-foreground shadow-sm" : "text-muted"
            }`}
          >
            {t === "day" ? "วัน" : t === "week" ? "สัปดาห์" : t === "month" ? "เดือน" : "ปี"}
          </button>
        ))}
      </div>

      <main className="p-6">
        <div className={`transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm mb-6">
            <div className="text-center mb-6">
              <h2 className="text-muted text-sm">ยอดเงินคงเหลือ ({tab === "day" ? "วัน" : tab === "week" ? "สัปดาห์" : tab === "month" ? "เดือน" : "ปี"})</h2>
              <div className="text-3xl font-bold text-foreground mt-1">
                ฿ {data.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 bg-success/10 rounded-xl p-3 text-center">
                <div className="text-xs text-success mb-1">รายรับ</div>
                <div className="font-semibold text-success">฿ {data.income.toLocaleString()}</div>
              </div>
              <div className="flex-1 bg-danger/10 rounded-xl p-3 text-center">
                <div className="text-xs text-danger mb-1">รายจ่าย</div>
                <div className="font-semibold text-danger">฿ {data.expense.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm mb-6">
            <h3 className="text-sm font-bold text-foreground mb-6">เปรียบเทียบรายจ่ายรายเดือน</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "#dcf5e5", opacity: 0.5 }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      backgroundColor: "#ffffff",
                      color: "#0e2518",
                      fontSize: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                    labelStyle={{ color: "#0e2518", fontWeight: "bold", marginBottom: "4px" }}
                    itemStyle={{ color: "#0e2518" }}
                    formatter={(value: any, name: any) => {
                      const label = name === 'income' ? 'รายรับ' : 'รายจ่าย';
                      return [`฿ ${Number(value).toLocaleString()}`, label];
                    }}
                  />
                  <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={8} />
                  <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Expenses */}
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-4">รายจ่ายสูงสุด</h3>
            <div className="space-y-4">
              {data.topExpenses.map((item: any, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <div className="text-primary w-4 h-4">{getIcon(item.icon)}</div>
                      <span className="text-foreground">{item.name}</span>
                    </div>
                    <span className="font-semibold text-foreground">฿{item.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-surface rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${item.percent}%` }}></div>
                  </div>
                </div>
              ))}
              {data.topExpenses.length === 0 && (
                <div className="text-center text-muted text-sm py-4">ไม่มีข้อมูลรายจ่าย</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

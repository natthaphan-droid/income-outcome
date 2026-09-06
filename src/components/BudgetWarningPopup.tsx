"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Alert {
  categoryName: string | null;
  limit: number;
  spent: number;
  remaining: number;
  percentageLeft: number;
}

export function BudgetWarningPopup({ alerts }: { alerts: Alert[] }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show popup only if there are alerts and we haven't shown it in this session yet
    if (alerts && alerts.length > 0) {
      const hasSeen = sessionStorage.getItem("hasSeenBudgetWarning");
      if (!hasSeen) {
        setVisible(true);
        sessionStorage.setItem("hasSeenBudgetWarning", "true");
      }
    }
  }, [alerts]);

  if (!visible || !alerts || alerts.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-card text-card-foreground w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header Image Area */}
        <div className="bg-danger/10 pt-8 pb-4 flex justify-center relative">
          {/* We use the sad dinosaur image when the user provides it, for now using placeholder or the same logo with CSS filter */}
          <div className="relative w-32 h-32 animate-bounce-slow" style={{ filter: "sepia(0.5) hue-rotate(-50deg) saturate(2)" }}>
            <Image
              src="/dino-full.jpg"
              alt="Warning"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="p-6 text-center">
          <h2 className="text-xl font-bold text-danger mb-2">เตือนภัย! งบใกล้หมด!</h2>
          <p className="text-muted text-sm mb-6">
            คุณมีหมวดหมู่ที่ใช้เงินใกล้ถึงขีดจำกัด (เหลือน้อยกว่า 5%) โปรดระมัดระวังการใช้จ่าย:
          </p>

          <div className="space-y-3 mb-6 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {alerts.map((alert, idx) => (
              <div key={idx} className="bg-surface text-surface-foreground border border-danger/20 rounded-xl p-3 text-left">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm">{alert.categoryName}</span>
                  <span className="text-xs font-bold text-danger">{Math.round(alert.percentageLeft)}%</span>
                </div>
                <div className="w-full bg-border rounded-full h-1.5 mb-1">
                  <div className="bg-danger h-1.5 rounded-full" style={{ width: `${100 - alert.percentageLeft}%` }}></div>
                </div>
                <div className="text-[10px] text-muted flex justify-between">
                  <span>ใช้ไป ฿{alert.spent.toLocaleString()}</span>
                  <span>เหลือ ฿{alert.remaining.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setVisible(false)}
            className="w-full py-3 bg-danger text-white font-bold rounded-xl shadow-lg shadow-danger/30 hover:opacity-90 transition-opacity"
          >
            รับทราบและจะระวังครับ
          </button>
        </div>
      </div>
    </div>
  );
}

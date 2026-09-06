"use client";

import { useState, useTransition } from "react";
import { deleteTransaction, updateTransaction } from "@/app/actions/transactions";
import { Icons } from "@/components/Icons";

export function TransactionItem({ tx }: { tx: any }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState(tx.amount.toString());
  const [editNote, setEditNote] = useState(tx.note || "");
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("คุณต้องการลบรายการนี้ใช่หรือไม่?")) return;
    setIsDeleting(true);
    startTransition(async () => {
      await deleteTransaction(tx.id);
    });
  };

  const handleUpdate = () => {
    if (!editAmount || isNaN(Number(editAmount))) return;
    startTransition(async () => {
      await updateTransaction(tx.id, {
        amount: Number(editAmount),
        note: editNote,
      });
      setIsEditing(false);
    });
  };

  const getIcon = (iconName: string | null) => {
    if (iconName && (Icons as any)[iconName]) {
      const IconComponent = (Icons as any)[iconName];
      return <IconComponent className="w-5 h-5" />;
    }
    return <Icons.Wallet className="w-5 h-5" />;
  };

  if (isEditing) {
    return (
      <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col gap-3 transition-all">
        <div className="flex gap-2 items-center text-sm font-medium">
          <span className="text-muted">แก้ไขจำนวนเงิน (฿):</span>
          <input 
            type="number" 
            value={editAmount} 
            onChange={e => setEditAmount(e.target.value)} 
            className="border border-border bg-surface text-foreground px-2 py-1.5 rounded-lg flex-1 focus:outline-none focus:ring-1 focus:ring-primary" 
          />
        </div>
        <div className="flex gap-2 items-center text-sm font-medium">
          <span className="text-muted">บันทึกช่วยจำ:</span>
          <input 
            type="text" 
            value={editNote} 
            onChange={e => setEditNote(e.target.value)} 
            placeholder="ไม่มี" 
            className="border border-border bg-surface text-foreground px-2 py-1.5 rounded-lg flex-1 focus:outline-none focus:ring-1 focus:ring-primary" 
          />
        </div>
        <div className="flex justify-end gap-2 mt-1">
          <button onClick={() => setIsEditing(false)} className="px-4 py-1.5 bg-surface text-foreground rounded-lg text-sm font-medium hover:bg-surface/80">ยกเลิก</button>
          <button onClick={handleUpdate} disabled={isPending} className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
            {isPending ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card text-card-foreground p-4 rounded-2xl border border-border flex items-center justify-between shadow-sm group transition-opacity relative overflow-hidden ${isDeleting || isPending ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center gap-4 flex-1 truncate pr-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-success/10 text-success' : 'bg-surface text-surface-foreground text-foreground'}`}>
          {getIcon(tx.categoryIcon)}
        </div>
        <div className="truncate">
          <h4 className="font-bold text-sm sm:text-base text-foreground truncate">{tx.note || tx.categoryName || (tx.type === 'income' ? 'รายรับ' : 'รายจ่าย')}</h4>
          <p className="text-xs text-muted mt-0.5">
            {new Date(tx.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })} • {new Date(tx.date).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-1 shrink-0">
        <div className={`font-semibold sm:text-lg ${tx.type === 'income' ? 'text-success' : 'text-danger'}`}>
          {tx.type === 'income' ? '+' : '-'}฿{tx.amount.toLocaleString()}
        </div>
        
        {/* Actions (visible on hover or focus, or default visible on mobile if no hover) */}
        <div className="flex gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button onClick={() => setIsEditing(true)} className="p-1.5 text-blue-500 bg-blue-50/50 hover:bg-blue-100 rounded-md transition-colors" title="แก้ไข">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </button>
          <button onClick={handleDelete} className="p-1.5 text-red-500 bg-red-50/50 hover:bg-red-100 rounded-md transition-colors" title="ลบ">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>
    </div>
  )
}

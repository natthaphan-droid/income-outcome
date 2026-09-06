"use client";

import { useState, useTransition } from "react";
import { verifyPin } from "./actions";

export default function PinPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleDigitClick = (digit: string) => {
    if (pin.length < 6) {
      setPin((prev) => prev + digit);
      setError("");
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 6) {
      startTransition(async () => {
        const res = await verifyPin(pin);
        if (res?.error) {
          setError(res.error);
          setPin("");
        }
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface text-surface-foreground p-4">
      <div className="w-full max-w-sm bg-card text-card-foreground rounded-2xl shadow-xl overflow-hidden border border-border p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">กรอก PIN</h1>
          <p className="text-muted text-sm mt-2">กรุณากรอกรหัส 6 หลักของคุณ (ทดสอบใช้ 123456)</p>
        </div>

        {error && (
          <div className="mb-4 bg-danger/10 text-danger p-2 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex justify-center gap-3 mb-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-colors ${
                i < pin.length ? "bg-[var(--wood-base)]" : "bg-[var(--border)]"
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigitClick(digit.toString())}
              className="w-16 h-16 mx-auto rounded-full bg-background hover:bg-surface text-surface-foreground border border-border text-xl font-medium text-foreground transition-colors"
            >
              {digit}
            </button>
          ))}
          <div /> {/* Empty cell for alignment */}
          <button
            onClick={() => handleDigitClick("0")}
            className="w-16 h-16 mx-auto rounded-full bg-background hover:bg-surface text-surface-foreground border border-border text-xl font-medium text-foreground transition-colors"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-danger/10 hover:bg-danger/20 text-danger transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
            </svg>
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={pin.length !== 6 || isPending}
          className="w-full py-3 bg-[var(--wood-base)] disabled:bg-[var(--border)] disabled:text-muted text-white font-medium rounded-lg hover:bg-primary text-primary-foreground transition-colors"
        >
          {isPending ? "กำลังตรวจสอบ..." : "ยืนยัน"}
        </button>
      </div>
    </div>
  );
}

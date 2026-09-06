"use client";

import { useState, useTransition, useEffect } from "react";
import { verifyPin, setupPin, checkPinStatus } from "./actions";
import { useRouter } from "next/navigation";

export default function PinPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [firstPin, setFirstPin] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<"loading" | "setup_step1" | "setup_step2" | "verify">("loading");

  useEffect(() => {
    checkPinStatus().then((hasPin) => {
      setMode(hasPin ? "verify" : "setup_step1");
    });
  }, []);

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
    if (pin.length !== 6) return;

    if (mode === "setup_step1") {
      setFirstPin(pin);
      setPin("");
      setMode("setup_step2");
    } else if (mode === "setup_step2") {
      if (pin !== firstPin) {
        setError("รหัส PIN ไม่ตรงกัน กรุณาตั้งรหัสใหม่");
        setFirstPin("");
        setPin("");
        setMode("setup_step1");
      } else {
        startTransition(async () => {
          const res = await setupPin(pin);
          if (res?.error) {
            setError(res.error);
            setFirstPin("");
            setPin("");
            setMode("setup_step1");
          } else {
            router.push("/");
          }
        });
      }
    } else if (mode === "verify") {
      startTransition(async () => {
        const res = await verifyPin(pin);
        if (res?.error) {
          setError(res.error);
          setPin("");
        } else {
          router.push("/");
        }
      });
    }
  };

  if (mode === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface text-foreground">
        กำลังโหลด...
      </div>
    );
  }

  let title = "กรอกรหัส PIN";
  let subtitle = "เพื่อเข้าสู่ระบบ";
  if (mode === "setup_step1") {
    title = "ตั้งรหัส PIN ใหม่";
    subtitle = "ตั้งรหัส 6 หลักสำหรับเข้าใช้งานครั้งต่อไป";
  } else if (mode === "setup_step2") {
    title = "ยืนยันรหัส PIN";
    subtitle = "กรุณากรอกรหัส PIN เดิมอีกครั้ง";
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface text-surface-foreground p-4">
      <div className="w-full max-w-sm bg-card text-card-foreground rounded-3xl shadow-xl overflow-hidden border border-border p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-muted text-sm mt-2">{subtitle}</p>
        </div>

        {error && (
          <div className="mb-6 bg-danger/10 border border-danger/20 text-danger p-3 rounded-xl text-sm font-medium text-center">
            {error}
          </div>
        )}

        <div className="flex justify-center gap-3 mb-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-colors duration-300 ${
                i < pin.length ? "bg-primary text-primary-foreground shadow-sm scale-110" : "bg-border"
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigitClick(digit.toString())}
              className="w-16 h-16 mx-auto rounded-full bg-background hover:bg-surface border border-border text-2xl font-semibold text-foreground transition-all hover:scale-105 active:scale-95"
            >
              {digit}
            </button>
          ))}
          <div /> {/* Empty cell for alignment */}
          <button
            onClick={() => handleDigitClick("0")}
            className="w-16 h-16 mx-auto rounded-full bg-background hover:bg-surface border border-border text-2xl font-semibold text-foreground transition-all hover:scale-105 active:scale-95"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-danger/10 hover:bg-danger/20 text-danger transition-all hover:scale-105 active:scale-95"
          >
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
            </svg>
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={pin.length !== 6 || isPending}
          className="w-full py-3.5 bg-primary disabled:bg-border text-primary-foreground disabled:text-muted font-bold rounded-xl transition-all active:scale-[0.98] shadow-sm disabled:shadow-none text-white"
        >
          {isPending ? "กำลังดำเนินการ..." : "ยืนยัน"}
        </button>
      </div>
    </div>
  );
}

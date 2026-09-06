"use client";

import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      <div className="relative w-48 h-48 animate-bounce-slow">
        <Image
          src="/dino-full.jpg"
          alt="Loading..."
          fill
          className="object-contain drop-shadow-xl"
          priority
        />
      </div>
      <div className="mt-8 text-primary font-bold text-xl animate-pulse">
        กำลังโหลด...
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/Icons";

export function BottomNav() {
  const pathname = usePathname();

  // Hide bottom nav on specific pages if needed
  if (pathname === "/add" || pathname === "/login" || pathname === "/register" || pathname === "/pin") {
    return null;
  }

  const navItems = [
    { name: "สรุป", path: "/", icon: Icons.Home },
    { name: "วิเคราะห์", path: "/analyze", icon: Icons.Chart },
    { name: "หมวด/งบ", path: "/categories", icon: Icons.Wallet },
    { name: "รายการ", path: "/transactions", icon: Icons.List },
    { name: "ตั้งค่า", path: "/settings", icon: Icons.Settings },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-card text-card-foreground border-t border-border pb-safe pt-2 px-2 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`flex-1 flex flex-col items-center gap-1 p-2 ${
              isActive ? "text-primary font-bold" : "text-muted hover:text-foreground"
            } transition-colors`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-[10px] whitespace-nowrap">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

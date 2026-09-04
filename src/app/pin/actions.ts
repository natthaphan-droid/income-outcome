"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function verifyPin(pin: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  // TODO: Check against the database if the user has this PIN setup
  // For now, let's assume if it's '123456' it's correct (or bypass for setup phase)
  if (pin === "123456") {
    const cookieStore = await cookies();
    cookieStore.set("pin_verified", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    
    redirect("/");
  } else {
    return { error: "PIN ไม่ถูกต้อง" };
  }
}

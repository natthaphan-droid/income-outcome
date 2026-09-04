import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export default async function proxy(req: NextRequest) {
  const { nextUrl } = req;
  const session = await auth();
  const isLoggedIn = !!session?.user;

  const isAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isLoginPage = nextUrl.pathname === "/login";
  const isPinPage = nextUrl.pathname === "/pin";
  const isPublicRoute = isAuthRoute || isLoginPage;

  if (isAuthRoute) {
    return NextResponse.next();
  }

  if (isLoginPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/pin", nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isLoggedIn && !isPinPage) {
    const hasPinCookie = req.cookies.has("pin_verified");
    if (!hasPinCookie) {
      return NextResponse.redirect(new URL("/pin", nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};

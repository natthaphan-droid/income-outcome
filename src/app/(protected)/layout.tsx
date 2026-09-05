import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { auth } from "@/auth";



export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  const hasPinCookie = cookieStore.has("pin_verified");

  if (!hasPinCookie) {
    redirect("/pin");
  }

  return children;
}

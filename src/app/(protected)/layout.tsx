import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { BottomNav } from "@/components/BottomNav";


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

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {children}
      <BottomNav />
    </div>
  );
}

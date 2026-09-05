import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const runtime = "edge";

export default async function PinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return children;
}

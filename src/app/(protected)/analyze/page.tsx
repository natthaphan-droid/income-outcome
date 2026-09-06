import { AnalyzeTabs } from "@/components/AnalyzeTabs";

export default function AnalyzePage() {
  return (
    <div className="flex flex-col min-h-screen relative bg-background">
      {/* Header */}
      <header className="px-6 py-8 rounded-b-3xl shadow-md border-b border-border/30 relative text-foreground z-10 bg-background">
        <h1 className="text-2xl font-bold">วิเคราะห์</h1>
        <p className="text-sm opacity-90 mt-1">เปรียบเทียบและดูรายละเอียดการเงินของคุณ</p>
      </header>

      <main className="flex-1 px-4 py-6">
        <AnalyzeTabs />
      </main>
    </div>
  );
}

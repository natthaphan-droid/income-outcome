import { AnalyzeTabs } from "@/components/AnalyzeTabs";
import { getMonthlyAnalysisData } from "@/app/actions/transactions";

export default async function AnalyzePage() {
  const data = await getMonthlyAnalysisData();

  return (
    <div className="flex flex-col min-h-screen relative bg-background">
      {/* Header */}
      <header className="px-6 py-8 rounded-b-3xl shadow-lg relative text-primary-foreground z-10 bg-primary">
        <h1 className="text-2xl font-bold">วิเคราะห์</h1>
        <p className="text-sm opacity-90 mt-1">เปรียบเทียบและดูรายละเอียดการเงินของคุณ</p>
      </header>

      <main className="flex-1 px-4 py-6">
        <AnalyzeTabs data={data} />
      </main>
    </div>
  );
}

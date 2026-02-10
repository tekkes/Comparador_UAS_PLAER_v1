import { fetchUASData } from "@/lib/googleSheets";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export default async function Home() {
  const data = await fetchUASData();

  return (
    <div className="min-h-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Systems Inventory</h2>
        <p className="text-slate-400">
          Reviewing {data.length} active UAS models in the PLAER Database.
          Use filters to refine your search or select models for comparison.
        </p>
      </div>

      <DashboardClient initialData={data} />
    </div>
  );
}

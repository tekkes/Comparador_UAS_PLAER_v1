import { fetchUASData } from "@/lib/googleSheets";
import { ComparisonClient } from "@/components/comparison/ComparisonClient";
import { Suspense } from "react";

export const dynamic = 'force-static';

export default async function ComparePage() {
    // Fetch ALL data at build time
    const allData = await fetchUASData();

    return (
        <div className="min-h-full">
            <Suspense fallback={<div className="text-center p-10">Loading comparison...</div>}>
                <ComparisonClient allData={allData} />
            </Suspense>
        </div>
    );
}

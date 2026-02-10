import { fetchUASData } from "@/lib/googleSheets";
import { ComparisonClient } from "@/components/comparison/ComparisonClient";
import { redirect } from "next/navigation";

export default async function ComparePage({
    searchParams,
}: {
    searchParams: Promise<{ ids?: string }>;
}) {
    const resolvedParams = await searchParams;
    const ids = resolvedParams.ids?.split(',') || [];

    if (ids.length === 0) {
        redirect('/');
    }

    const allData = await fetchUASData();
    const selectedUAS = allData.filter(u => ids.includes(u.id));

    return (
        <div className="min-h-full">
            <ComparisonClient selectedUAS={selectedUAS} />
        </div>
    );
}

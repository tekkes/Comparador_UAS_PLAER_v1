"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { UAS, UASFilter } from '@/lib/types';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { UASList } from '@/components/dashboard/UASList';
import { Search } from 'lucide-react';

import { fetchUASData } from '@/lib/googleSheets';
import { Loader2 } from 'lucide-react';

interface DashboardClientProps {
    initialData?: UAS[]; // Optional now
}

export const DashboardClient = ({ initialData = [] }: DashboardClientProps) => {
    const router = useRouter();
    const [data, setData] = useState<UAS[]>(initialData);
    const [loading, setLoading] = useState(true);
    const [selectedUAS, setSelectedUAS] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    // In a real app, we would have complex filter state key-value pairs
    const [activeFilters, setActiveFilters] = useState<UASFilter>({});

    React.useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const freshData = await fetchUASData();
                if (freshData.length > 0) {
                    setData(freshData);
                }
            } catch (error) {
                console.error("Failed to load live data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const toggleSelection = (id: string) => {
        if (selectedUAS.includes(id)) {
            setSelectedUAS(prev => prev.filter(item => item !== id));
        } else {
            if (selectedUAS.length >= 5) {
                alert("Maximum 5 UAS can be selected for comparison.");
                return;
            }
            setSelectedUAS(prev => [...prev, id]);
        }
    };

    const filteredData = useMemo(() => {
        return data.filter(uas => {
            const matchesSearch = uas.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                uas.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesManufacturer = activeFilters.manufacturer?.length
                ? activeFilters.manufacturer.includes(uas.manufacturer)
                : true;

            const matchesCountry = activeFilters.country?.length
                ? activeFilters.country.includes(uas.country)
                : true;

            const matchesGroup = activeFilters.group?.length
                ? activeFilters.group.includes(uas.group_classification)
                : true;

            return matchesSearch && matchesManufacturer && matchesCountry && matchesGroup;
        });
    }, [data, searchTerm, activeFilters]);

    return (
        <div className="flex flex-col gap-6 h-full">
            {/* Search & Actions Bar */}
            <div className="flex items-center justify-between gap-4 bg-card/50 backdrop-blur-md p-4 rounded-xl border border-border shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, manufacturer..."
                        className="w-full bg-background border border-input rounded-lg pl-10 pr-4 py-2 text-foreground focus:ring-2 focus:ring-ring outline-none transition-all placeholder:text-muted-foreground"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground font-medium">
                        {selectedUAS.length}/5 Selected
                    </span>
                    <button
                        className={`px-6 py-2 rounded-lg font-medium transition-colors shadow-sm ${selectedUAS.length > 0
                            ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                            }`}
                        disabled={selectedUAS.length === 0}
                        onClick={() => router.push(`/compare?ids=${selectedUAS.join(',')}`)}
                    >
                        Compare Selected
                    </button>
                </div>
            </div>

            <div className="flex gap-6 relative items-start">
                {/* Filters Sidebar */}
                <div className="w-72 flex-shrink-0 sticky top-24">
                    <FilterBar data={data} filters={activeFilters} setFilters={setActiveFilters} />
                </div>

                {/* Main Grid */}
                <div className="flex-1">
                    <div className="mb-4 text-sm text-muted-foreground flex justify-between items-center">
                        <span className="font-medium">Showing {filteredData.length} results</span>
                    </div>
                    {filteredData.length > 0 ? (
                        <UASList data={filteredData} selectedIds={selectedUAS} onToggle={toggleSelection} />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                            <p className="text-lg">No systems found matching your criteria.</p>
                            <button onClick={() => { setSearchTerm(''); setActiveFilters({}); }} className="mt-4 text-primary hover:underline">
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Loading Overlay */}
                {loading && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="text-sm font-medium text-muted-foreground">Updating data...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

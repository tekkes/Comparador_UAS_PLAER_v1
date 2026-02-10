import React from 'react';
import { UAS, UASFilter } from '@/lib/types';
import { Filter, X } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
    data: UAS[];
    filters: UASFilter;
    setFilters: (f: UASFilter) => void;
}

export const FilterBar = ({ data, filters, setFilters }: Props) => {
    // Extract unique values for filters
    const manufacturers = Array.from(new Set(data.map(d => d.manufacturer))).sort();
    const countries = Array.from(new Set(data.map(d => d.country))).sort();
    const types = Array.from(new Set(data.map(d => d.group_classification))).sort();

    const toggleFilter = (key: keyof UASFilter, value: string) => {
        const current = filters[key] as string[] || [];
        const newValues = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];

        setFilters({ ...filters, [key]: newValues });
    };

    const clearFilters = () => setFilters({});

    const hasActiveFilters = Object.values(filters).some(v => v && v.length > 0);

    return (
        <div className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-5 sticky top-24 shadow-sm h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                    <Filter size={18} className="text-primary" />
                    <h2>Filters</h2>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
                    >
                        <X size={12} /> Clear
                    </button>
                )}
            </div>

            <div className="space-y-8">
                <FilterSection
                    title="Group"
                    options={types}
                    selected={filters.group || []}
                    onChange={(val) => toggleFilter('group', val)}
                />

                <FilterSection
                    title="Country"
                    options={countries}
                    selected={filters.country || []}
                    onChange={(val) => toggleFilter('country', val)}
                />

                <FilterSection
                    title="Manufacturer"
                    options={manufacturers}
                    selected={filters.manufacturer || []}
                    onChange={(val) => toggleFilter('manufacturer', val)}
                />
            </div>
        </div>
    );
};

const FilterSection = ({ title, options, selected, onChange }: {
    title: string,
    options: string[],
    selected: string[],
    onChange: (val: string) => void
}) => (
    <div className="space-y-3">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</h3>
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {options.map(opt => (
                <label key={opt} className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer group transition-colors">
                    <div className={clsx(
                        "w-4 h-4 rounded border flex items-center justify-center transition-all",
                        selected.includes(opt)
                            ? "bg-primary border-primary"
                            : "border-input group-hover:border-primary/50 bg-background"
                    )}>
                        {selected.includes(opt) && <span className="text-primary-foreground text-[10px] font-bold">✓</span>}
                    </div>
                    <input
                        type="checkbox"
                        className="hidden"
                        checked={selected.includes(opt)}
                        onChange={() => onChange(opt)}
                    />
                    <span className={clsx("truncate", selected.includes(opt) && "font-medium text-foreground")} title={opt}>{opt}</span>
                </label>
            ))}
        </div>
    </div>
);

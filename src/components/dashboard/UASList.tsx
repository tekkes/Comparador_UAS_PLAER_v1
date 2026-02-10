import React from 'react';
import { UAS } from '@/lib/types';
import { UASCard } from './UASCard';

interface Props {
    data: UAS[];
    selectedIds: string[];
    onToggle: (id: string) => void;
}

export const UASList = ({ data, selectedIds, onToggle }: Props) => {
    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-slate-500 border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
                <p>No UAS found matching criteria.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {data.map(uas => (
                <UASCard
                    key={uas.id}
                    uas={uas}
                    isSelected={selectedIds.includes(uas.id)}
                    onToggle={() => onToggle(uas.id)}
                />
            ))}
        </div>
    );
};

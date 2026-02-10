"use client";

import React, { useState } from 'react';
import { UAS } from '@/lib/types';
import { ArrowLeft, Table2, BarChart3, FileDown } from 'lucide-react';
import Link from 'next/link';
import { ComparisonTable } from './ComparisonTable';
import { ComparisonCharts } from './ComparisonCharts';
import { PDFExportButton } from './PDFExportButton';

interface Props {
    selectedUAS: UAS[];
}

export const ComparisonClient = ({ selectedUAS }: Props) => {
    const [viewMode, setViewMode] = useState<'table' | 'charts'>('table');

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Comparative Analysis</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-1 rounded-lg flex items-center">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'table' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <Table2 size={16} />
                            Table View
                        </button>
                        <button
                            onClick={() => setViewMode('charts')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'charts' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <BarChart3 size={16} />
                            Charts View
                        </button>
                    </div>

                    {/* Replaced the placeholder button with the PDFExportButton component */}
                    <PDFExportButton uas={selectedUAS} />
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 min-h-[600px]">
                {selectedUAS.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                        <p>No UAS selected for comparison.</p>
                        <Link href="/" className="text-blue-500 hover:underline mt-2">Return to Inventory</Link>
                    </div>
                ) : (
                    <>
                        {viewMode === 'table' && <ComparisonTable uas={(selectedUAS)} />}
                        {viewMode === 'charts' && <ComparisonCharts uas={(selectedUAS)} />}

                        {/* Summary/Analysis Text */}
                        <div className="mt-8 border-t border-slate-800 pt-6">
                            <h3 className="text-lg font-bold text-white mb-4">Analysis Summary</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Comparing {selectedUAS.map(u => u.name).join(", ")}.
                                {(() => {
                                    // SAFELY calculate stats without mutating the read-only props
                                    const heaviest = [...selectedUAS].sort((a, b) => b.mtow_kg - a.mtow_kg)[0];
                                    const longestEndurance = [...selectedUAS].sort((a, b) =>
                                        parseFloat(String(b.endurance_hours)) - parseFloat(String(a.endurance_hours))
                                    )[0];

                                    return (
                                        <>
                                            The heaviest system is <span className="text-white font-medium">{heaviest?.name}</span> ({heaviest?.mtow_kg} kg),
                                            while the longest endurance is provided by <span className="text-white font-medium">{longestEndurance?.name}</span>.
                                        </>
                                    );
                                })()}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

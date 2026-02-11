"use client";

import React from 'react';
import { UAS } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface Props {
    uas: UAS[];
    id?: string;
    exportMode?: boolean;
}

export const ComparisonCharts = ({ uas, id = "comparison-charts-container", exportMode = false }: Props) => {
    // Prep data for Recharts
    // We want to compare multple metrics. Maybe separate charts or one big one?
    // Different scales (kg vs km/h vs km) means separate charts are better.

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-xl">
                    <p className="font-bold text-white mb-1">{label}</p>
                    <p className="text-blue-400 text-sm">
                        {payload[0].value} {payload[0].unit}
                    </p>
                </div>
            );
        }
        return null;
    };

    const ChartBlock = ({ title, dataKey, unit }: { title: string, dataKey: keyof UAS, unit: string }) => {
        // Hardcode colors for export to avoid 'oklab'/CSS var issues in html2canvas
        // AND use white background as requested
        const containerStyle = exportMode
            ? { backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderWidth: '1px', borderStyle: 'solid' }
            : {};
        const titleStyle = exportMode ? { color: '#0f172a' } : {};

        return (
            <div className={exportMode ? "p-2 rounded-xl" : "bg-slate-950/30 p-4 rounded-xl border border-slate-800"} style={containerStyle}>
                <h3 className={exportMode ? "text-xs font-bold uppercase tracking-wider mb-2 ml-2" : "text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 ml-2"} style={titleStyle}>{title}</h3>
                <div className={exportMode ? "h-48" : "h-64"}>
                    {exportMode ? (
                        <div style={{ width: '100%', height: 200 }}>
                            <BarChart
                                width={500}
                                height={200}
                                data={uas}
                                layout="vertical"
                                margin={{ left: 0, right: 30, top: 0, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                                <XAxis type="number" stroke="#64748b" fontSize={10} tickFormatter={(val) => `${val}`} />
                                <YAxis type="category" dataKey="name" stroke="#475569" fontSize={10} width={100} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9', opacity: 0.4 }} wrapperStyle={{ zIndex: 100 }} />
                                <Bar dataKey={dataKey} radius={[0, 4, 4, 0]} unit={unit} isAnimationActive={false}>
                                    {uas.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={uas}
                                layout="vertical"
                                margin={{ left: 0, right: 30, top: 0, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                                <XAxis type="number" stroke="#64748b" fontSize={12} tickFormatter={(val) => `${val}`} />
                                <YAxis type="category" dataKey="name" stroke="#cbd5e1" fontSize={11} width={100} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b', opacity: 0.4 }} wrapperStyle={{ zIndex: 100 }} />
                                <Bar dataKey={dataKey} radius={[0, 4, 4, 0]} unit={unit}>
                                    {uas.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div id={id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4" style={exportMode ? { backgroundColor: '#ffffff' } : {}}>
            <ChartBlock title="Maximum Takeoff Weight (MTOW)" dataKey="mtow_kg" unit="kg" />
            <ChartBlock title="Link Range (Data)" dataKey="datalink_range_km" unit="km" />
            <ChartBlock title="Cruise Speed" dataKey="cruise_speed_kmh" unit="km/h" />
            <ChartBlock title="Payload Capacity" dataKey="payload_capacity_kg" unit="kg" />
        </div>
    );
};

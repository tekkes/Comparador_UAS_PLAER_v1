"use client";

import React from 'react';
import { UAS } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface Props {
    uas: UAS[];
}

export const ComparisonCharts = ({ uas }: Props) => {
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

    const ChartBlock = ({ title, dataKey, unit }: { title: string, dataKey: keyof UAS, unit: string }) => (
        <div className="bg-slate-950/30 p-4 rounded-xl border border-slate-800">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 ml-2">{title}</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={uas} layout="vertical" margin={{ left: 0, right: 30, top: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                        <XAxis type="number" stroke="#64748b" fontSize={12} tickFormatter={(val) => `${val}`} />
                        <YAxis type="category" dataKey="name" stroke="#cbd5e1" fontSize={11} width={100} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b', opacity: 0.4 }} />
                        <Bar dataKey={dataKey} radius={[0, 4, 4, 0]} unit={unit}>
                            {uas.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    return (
        <div id="comparison-charts-container" className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
            <ChartBlock title="Maximum Takeoff Weight (MTOW)" dataKey="mtow_kg" unit="kg" />
            <ChartBlock title="Maximum Range" dataKey="aircraft_range_km" unit="km" />
            <ChartBlock title="Cruise Speed" dataKey="cruise_speed_kmh" unit="km/h" />
            <ChartBlock title="Payload Capacity" dataKey="payload_capacity_kg" unit="kg" />
        </div>
    );
};

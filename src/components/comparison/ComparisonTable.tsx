import React from 'react';
import { UAS } from '@/lib/types';
import { Check, X, Minus, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
    uas: UAS[];
}

export const ComparisonTable = ({ uas }: Props) => {
    if (uas.length === 0) return (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground bg-card/50 rounded-xl border border-dashed border-border">
            <AlertCircle size={48} className="mb-4 text-muted-foreground/50" />
            <p>No systems selected for comparison.</p>
        </div>
    );

    const renderBool = (val: boolean) => val
        ? <div className="flex justify-center"><Check size={18} className="text-green-500" /></div>
        : <div className="flex justify-center"><X size={18} className="text-destructive/50" /></div>;

    const renderText = (val: string | number) => val || <div className="flex justify-center"><Minus size={14} className="text-muted-foreground/50" /></div>;

    // Helper to highlight potential best values (simple max logic for now)
    const isMax = (val: number, key: keyof UAS) => {
        const numbers = uas.map(u => Number(u[key]) || 0);
        const max = Math.max(...numbers);
        // Only highlight if it's the max and clearly distinct (and positive)
        return val === max && max > 0 && numbers.some(n => n < max)
            ? "text-green-500 font-bold bg-green-500/10 dark:bg-green-500/20"
            : "";
    };

    const rows: { label: string; key?: keyof UAS; type?: 'text' | 'number' | 'bool' }[] = [
        { label: "General Information", type: 'text' },
        { label: "Manufacturer", key: 'manufacturer', type: 'text' },
        { label: "Country", key: 'country', type: 'text' },
        { label: "Class", key: 'group_classification', type: 'text' },
        { label: "Mission", key: 'mission_type', type: 'text' },

        { label: "Physical Specs", type: 'text' },
        { label: "MTOW (kg)", key: 'mtow_kg', type: 'number' },
        { label: "Wingspan (m)", key: 'wingspan_m', type: 'number' },
        { label: "Length (m)", key: 'length_m', type: 'number' },
        { label: "Payload (kg)", key: 'payload_capacity_kg', type: 'number' },

        { label: "Performance", type: 'text' },
        { label: "Endurance (hr)", key: 'endurance_hours', type: 'text' }, // it's a string range
        { label: "Cruise Speed (km/h)", key: 'cruise_speed_kmh', type: 'number' },
        { label: "Max Speed (km/h)", key: 'max_speed_kmh', type: 'number' },
        { label: "Range (km)", key: 'aircraft_range_km', type: 'number' },
        { label: "Link Range (km)", key: 'datalink_range_km', type: 'number' },
        { label: "Ceiling (m)", key: 'ceiling_m', type: 'number' },

        { label: "Dimensions", type: 'text' },
        { label: "Length (m)", key: 'length_m', type: 'number' },
        { label: "Wingspan (m)", key: 'wingspan_m', type: 'number' },
        { label: "Height (m)", key: 'height_m', type: 'number' },

        { label: "Propulsion", type: 'text' },
        { label: "Powerplant", key: 'powerplant_type', type: 'text' },
        { label: "Fuel", key: 'fuel_type', type: 'text' },

        { label: "Mission Capabilities", type: 'text' },
        { label: "Payload Capacity (kg)", key: 'payload_capacity_kg', type: 'number' },
        { label: "Sensors", key: 'payload_type', type: 'text' },

        { label: "Capabilities", type: 'text' },
        { label: "Laser Rangefinder", key: 'laser_rangefinder', type: 'bool' },
        { label: "Laser Designator", key: 'laser_designator', type: 'bool' },
        { label: "SAR", key: 'sar_capability', type: 'bool' },
        { label: "SIGINT", key: 'sigint_capability', type: 'bool' },
        { label: "EW / Jamming", key: 'ew_capability', type: 'bool' },
        { label: "Kinetic Load", key: 'kinetic_load', type: 'bool' },
        { label: "SATCOM", key: 'blos_satcom', type: 'bool' },
    ];

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr>
                            <th className="p-4 border-b border-border bg-muted/50 sticky left-0 z-20 min-w-[200px] backdrop-blur-sm shadow-[1px_0_0_0_rgba(0,0,0,0.1)]">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Parameter</span>
                            </th>
                            {uas.map(u => (
                                <th key={u.id} className="p-4 border-b border-border min-w-[220px] text-center bg-card">
                                    <div className="text-xs font-bold text-primary uppercase mb-1 tracking-wider">{u.manufacturer}</div>
                                    <div className="text-lg font-bold text-foreground leading-tight">{u.name}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {rows.map((row, idx) => {
                            if (!row.key) {
                                return (
                                    <tr key={idx} className="bg-muted/30">
                                        <td colSpan={uas.length + 1} className="p-2 pl-4 text-xs font-bold text-muted-foreground uppercase tracking-wider border-y border-border/50">
                                            {row.label}
                                        </td>
                                    </tr>
                                );
                            }

                            return (
                                <tr key={idx} className="group hover:bg-muted/50 transition-colors">
                                    <td className="p-3 pl-4 font-medium text-muted-foreground bg-card sticky left-0 z-10 border-r border-border shadow-[1px_0_0_0_rgba(0,0,0,0.1)] group-hover:bg-muted/50 transition-colors">
                                        {row.label}
                                    </td>
                                    {uas.map(u => {
                                        const val = u[row.key!] as any;
                                        return (
                                            <td key={u.id} className={clsx(
                                                "p-3 text-center border-r border-border/50 last:border-0",
                                                row.type === 'number' ? isMax(val, row.key!) : 'text-foreground'
                                            )}>
                                                {row.type === 'bool' ? renderBool(val) : renderText(val)}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

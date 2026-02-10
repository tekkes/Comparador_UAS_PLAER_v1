import React from 'react';
import { UAS } from '@/lib/types';
import { Check, Plane, Scale, Gauge, Signal, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface Props {
    uas: UAS;
    isSelected: boolean;
    onToggle: () => void;
}

export const UASCard = ({ uas, isSelected, onToggle }: Props) => {
    return (
        <div
            className={twMerge(
                "group relative bg-card/50 backdrop-blur-sm border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 flex flex-col h-full",
                isSelected ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/50"
            )}
        >
            {/* Header/Image Area Placeholder */}
            <div className="relative h-40 bg-muted/30 flex items-center justify-center p-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/10 z-0"></div>

                {/* Selection Checkbox */}
                <button
                    onClick={(e) => { e.stopPropagation(); onToggle(); }}
                    className={clsx(
                        "absolute top-3 right-3 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all z-20 shadow-sm",
                        isSelected
                            ? "bg-primary border-primary text-primary-foreground scale-110"
                            : "border-muted-foreground/30 bg-background/50 text-transparent hover:border-primary hover:text-primary/50"
                    )}
                >
                    <Check size={16} strokeWidth={3} />
                </button>

                <div className="text-center z-10 transform group-hover:scale-105 transition-transform duration-500">
                    <Plane className="mx-auto text-muted-foreground/50 mb-2" size={48} strokeWidth={1.5} />
                    <span className="text-[10px] text-muted-foreground font-mono tracking-widest uppercase">No Image Available</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-4">
                    <div className="text-xs text-primary font-bold uppercase tracking-wider mb-1 flex justify-between items-center">
                        <span>{uas.manufacturer}</span>
                        <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded border border-border/50">{uas.country}</span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground leading-tight truncate px-0.5 -mx-0.5" title={uas.name}>
                        {uas.name}
                    </h3>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4 flex-grow">
                    <MetricItem icon={<Scale size={14} />} label="MTOW" value={uas.mtow_kg} unit="kg" />
                    <MetricItem icon={<Gauge size={14} />} label="Speed" value={uas.max_speed_kmh} unit="km/h" />
                    <MetricItem icon={<Clock size={14} />} label="Endurance" value={uas.endurance_hours} unit="hr" truncate />
                    <MetricItem icon={<Signal size={14} />} label="Range" value={uas.datalink_range_km} unit="km" />
                </div>

                <div className="pt-3 border-t border-border mt-auto flex justify-between items-center">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold bg-muted px-2 py-1 rounded">
                        {uas.group_classification}
                    </span>
                    <button
                        onClick={onToggle}
                        className={clsx(
                            "text-xs font-medium transition-colors px-3 py-1.5 rounded-md",
                            isSelected
                                ? "text-destructive hover:bg-destructive/10"
                                : "text-primary hover:bg-primary/10"
                        )}
                    >
                        {isSelected ? "Remove" : "Select for Compare"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const MetricItem = ({ icon, label, value, unit, truncate = false }: { icon: React.ReactNode, label: string, value: string | number, unit: string, truncate?: boolean }) => (
    <div className="bg-secondary/30 p-2 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors">
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
            {icon}
            <span>{label}</span>
        </div>
        <div className={clsx("text-foreground font-mono font-medium text-sm", truncate && "truncate")} title={String(value)}>
            {value || "-"} <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
    </div>
);

import React from 'react';
import { UAS } from '@/lib/types';
import { Check, Plane, Scale, Gauge, Signal, Clock, Database, Crosshair, Radio, Battery, Anchor, AlertCircle, Eye, Zap, Box, Users } from 'lucide-react';
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
                "group relative bg-card/80 backdrop-blur-md border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 flex flex-col h-full",
                isSelected ? "border-primary ring-1 ring-primary shadow-lg shadow-primary/20" : "border-border hover:border-primary/50"
            )}
        >
            {/* Minimal Header */}
            <div className="relative h-28 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-3 overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-grid-white/[0.05] z-0"></div>

                {/* Selection Checkbox */}
                <button
                    onClick={(e) => { e.stopPropagation(); onToggle(); }}
                    className={clsx(
                        "absolute top-2 right-2 w-6 h-6 rounded-full border flex items-center justify-center transition-all z-20 shadow-sm",
                        isSelected
                            ? "bg-primary border-primary text-primary-foreground scale-110"
                            : "border-white/20 bg-black/20 text-transparent hover:border-primary hover:text-primary/80"
                    )}
                >
                    <Check size={14} strokeWidth={3} />
                </button>

                <div className="text-center z-10 w-full pl-2 pr-8">
                    <div className="text-[10px] text-primary font-bold uppercase tracking-widest mb-0.5 flex items-center justify-center gap-2">
                        <span>{uas.manufacturer}</span>
                        <span className="w-1 h-1 rounded-full bg-primary/50"></span>
                        <span>{uas.country}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white leading-tight truncate" title={uas.name}>
                        {uas.name}
                    </h3>
                    <span className="text-[9px] text-slate-400 bg-slate-900/50 px-1.5 py-0.5 rounded border border-white/10 mt-1 inline-block">
                        {uas.group_classification}
                    </span>
                </div>
            </div>

            {/* DENSE Content Grid */}
            <div className="p-3 flex flex-col flex-grow gap-3 overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">

                {/* 1. Dimensions & Weight */}
                <Section title="Dimensions & Weight" icon={<Scale size={12} />}>
                    <GridItem label="MTOW" value={uas.mtow_kg} unit="kg" />
                    <GridItem label="Empty" value={uas.empty_weight_kg} unit="kg" />
                    <GridItem label="Payload" value={uas.payload_capacity_kg} unit="kg" />
                    <GridItem label="Length" value={uas.length_m} unit="m" />
                    <GridItem label="Wingspan" value={uas.wingspan_m} unit="m" />
                    <GridItem label="Height" value={uas.height_m} unit="m" />
                </Section>

                {/* 2. Performance */}
                <Section title="Performance" icon={<Gauge size={12} />}>
                    <GridItem label="Speed (Max)" value={uas.max_speed_kmh} unit="km/h" highlight />
                    <GridItem label="Speed (Cr)" value={uas.cruise_speed_kmh} unit="km/h" />
                    <GridItem label="Endurance" value={uas.endurance_hours} unit="hr" highlight />
                    <GridItem label="Ceiling" value={uas.ceiling_m} unit="m" />
                    <GridItem label="Range (Air)" value={uas.aircraft_range_km} unit="km" />
                    <GridItem label="Range (DL)" value={uas.datalink_range_km} unit="km" />
                </Section>

                {/* 3. Launch & Recovery */}
                <Section title="Launch & Ops" icon={<Anchor size={12} />}>
                    <TextItem label="Launch" value={uas.launch_method} />
                    <TextItem label="Recovery" value={uas.recovery_method} />
                    <TextItem label="Setup" value={uas.setup_time_min} />
                    <TextItem label="Crew" value={uas.crew_size} />
                </Section>

                {/* 4. Powerplant */}
                <Section title="Propulsion" icon={<Zap size={12} />}>
                    <TextItem label="Type" value={uas.powerplant_type} fullWidth />
                    <TextItem label="Engine" value={uas.engine_displacement} />
                    <TextItem label="Fuel" value={uas.fuel_type} />
                </Section>

                {/* 5. Comms & Data */}
                <Section title="Comms & Data" icon={<Signal size={12} />}>
                    <TextItem label="Freq" value={uas.datalink_freq} fullWidth />
                    <TextItem label="Encryption" value={uas.encryption} fullWidth />
                    <TextItem label="Video" value={uas.video_standard} />
                    <TextItem label="GCS" value={uas.gcs_type} />
                    <BoolItem label="BLOS/Satcom" value={uas.blos_satcom} />
                    <TextItem label="Autopilot" value={uas.autopilot} fullWidth />
                </Section>

                {/* 6. Payload & Sensors */}
                <Section title="Payload & Sensors" icon={<Eye size={12} />}>
                    <TextItem label="Type" value={uas.payload_type} fullWidth />
                    <TextItem label="Gimbal" value={uas.gimbal_type} fullWidth />
                    <TextItem label="EO" value={uas.eo_resolution} />
                    <TextItem label="IR" value={uas.ir_type} />
                </Section>

                {/* 7. Capabilities (Boolean badges) */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                    <CapabilityBadge label="Laser Range" active={uas.laser_rangefinder} />
                    <CapabilityBadge label="Designator" active={uas.laser_designator} />
                    <CapabilityBadge label="SAR" active={uas.sar_capability} />
                    <CapabilityBadge label="SIGINT" active={uas.sigint_capability} />
                    <CapabilityBadge label="EW" active={uas.ew_capability} />
                    <CapabilityBadge label="Kinetic" active={uas.kinetic_load} />
                </div>

            </div>
            <div className="p-3 border-t border-border bg-secondary/10 mt-auto">
                <button
                    onClick={onToggle}
                    className={clsx(
                        "w-full text-xs font-bold transition-all py-2 rounded shadow-sm border",
                        isSelected
                            ? "bg-destructive/10 border-destructive/20 text-destructive hover:bg-destructive/20"
                            : "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                    )}
                >
                    {isSelected ? "Remove from Compare" : "Select for Compare"}
                </button>
            </div>
        </div>
    );
};

// --- Helper Components ---

const Section = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div className="bg-secondary/20 rounded-lg p-2 border border-border/30">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 border-b border-border/30 pb-1">
            {icon} {title}
        </div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
            {children}
        </div>
    </div>
);

const GridItem = ({ label, value, unit, highlight = false }: { label: string, value: string | number, unit?: string, highlight?: boolean }) => (
    <div className="flex justify-between items-baseline border-b border-dashed border-border/20 pb-0.5 last:border-0">
        <span className="text-[10px] text-muted-foreground truncate mr-1">{label}</span>
        <span className={clsx("text-[11px] font-mono font-medium truncate", highlight ? "text-primary" : "text-foreground")}>
            {value || "-"} <span className="text-[9px] text-muted-foreground/70 scale-90">{unit}</span>
        </span>
    </div>
);

const TextItem = ({ label, value, fullWidth = false }: { label: string, value: string, fullWidth?: boolean }) => (
    <div className={clsx("flex flex-col", fullWidth ? "col-span-2" : "col-span-1")}>
        <span className="text-[9px] text-muted-foreground uppercase">{label}</span>
        <span className="text-[10px] font-medium text-foreground leading-tight truncate" title={value}>{value || "-"}</span>
    </div>
);

const BoolItem = ({ label, value }: { label: string, value: boolean }) => (
    <div className="flex items-center justify-between col-span-2 bg-background/30 rounded px-1.5 py-0.5">
        <span className="text-[10px] text-muted-foreground">{label}</span>
        {value ? <Check size={12} className="text-green-500" /> : <div className="w-3 h-3 rounded-full border border-muted-foreground/30"></div>}
    </div>
);

const CapabilityBadge = ({ label, active }: { label: string, active: boolean }) => {
    if (!active) return null;
    return (
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-primary/10 border-primary/20 text-primary flex items-center gap-1">
            <Check size={8} strokeWidth={4} /> {label}
        </span>
    );
};

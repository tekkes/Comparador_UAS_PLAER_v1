export interface UAS {
    id: string;
    name: string;
    manufacturer: string;
    country: string;
    primary_market: string;
    group_classification: string;
    mission_type: string;
    launch_method: string;
    recovery_method: string;
    length_m: number;
    wingspan_m: number;
    height_m: number;
    mtow_kg: number;
    empty_weight_kg: number;
    payload_capacity_kg: number;
    powerplant_type: string;
    engine_displacement: string;
    fuel_type: string;
    endurance_hours: string; // Keep as string for ranges like "8-16"
    cruise_speed_kmh: number; // Avg if range
    max_speed_kmh: number;
    ceiling_m: number;
    datalink_range_km: number; // comms range
    aircraft_range_km: number; // max aircraft range
    payload_type: string;
    gimbal_type: string;
    eo_resolution: string;
    ir_type: string;
    laser_rangefinder: boolean;
    laser_designator: boolean;
    sar_capability: boolean;
    sigint_capability: boolean;
    ew_capability: boolean;
    kinetic_load: boolean;
    autopilot: string;
    datalink_freq: string;
    encryption: string;
    blos_satcom: boolean;
    video_standard: string;
    gcs_type: string;
    setup_time_min: string;
    crew_size: string;
}

export type UASFilter = {
    manufacturer?: string[];
    country?: string[];
    group?: string[];
    mtowRange?: [number, number];
    enduranceRange?: [number, number];
    rangeRange?: [number, number];
};

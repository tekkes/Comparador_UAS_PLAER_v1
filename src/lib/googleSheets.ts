import Papa from 'papaparse';
import { UAS } from './types';

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRuV7E0wUj3tMnfbw38JEh_R_KI5TpUgQrOd_1RqyRnvQXFpRQbhD0fC5U_KqgSUG83m0X_BCeXedTV/pub?output=csv';

// Helper to clean numeric values (remove non-numeric chars except . and -)
const cleanNumber = (val: string): number => {
    if (!val) return 0;
    // Handle ranges like "8-16" -> take average? Or just min/max?
    // For sorting/filtering, let's take the max value if range, or just first number found.
    // Actually, if it's "8-16", usually we want the max capability.
    // Let's try to extract the first valid number sequence.
    const match = val.match(/([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
};

// Helper for boolean conversion (Yes/Optional -> true, No/Empty -> false)
const cleanBool = (val: string): boolean => {
    if (!val) return false;
    const lower = val.toLowerCase();
    return lower.includes('yes') || lower.includes('optional') || lower.includes('true');
};

export const fetchUASData = async (): Promise<UAS[]> => {
    try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL, { cache: 'no-store' });
        const csvText = await response.text();

        const parsed = Papa.parse(csvText, { skipEmptyLines: true });
        const data = parsed.data as string[][];

        // Transpose logic
        // Row 0: Header with UAS Names (cols 1...)
        // Col 0: Metadata Keys
        // We strictly need to define the map from "Parameter Name" (Col 0) to "UAS Property"

        if (data.length < 2) return [];

        const uasNames = data[0].slice(1);
        const uasObjects: Partial<UAS>[] = uasNames.map(name => ({
            id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            name: name.trim(),
        }));

        // Iterate rows starting from 1
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            const key = row[0]?.trim();
            const isHeader = !key || row.slice(1).every(c => !c); // Detect separator rows

            if (isHeader) continue;

            // Map keys to properties
            for (let j = 0; j < uasObjects.length; j++) {
                const value = row[j + 1]?.trim() || '';
                const cur = uasObjects[j] as any; // Allow indexing

                switch (key) {
                    case 'Company': cur.manufacturer = value; break;
                    case 'Country of Origin': cur.country = value; break;
                    case 'Primary Market': cur.primary_market = value; break;
                    case 'UAS Group Classification': cur.group_classification = value; break;
                    case 'Primary Mission Type': cur.mission_type = value; break;
                    case 'Launch Method': cur.launch_method = value; break;
                    case 'Recovery Method': cur.recovery_method = value; break;
                    case 'Length (m)': cur.length_m = cleanNumber(value); break;
                    case 'Wingspan (m)': cur.wingspan_m = cleanNumber(value); break;
                    case 'Height (m)': cur.height_m = cleanNumber(value); break;
                    case 'MTOW (kg)': cur.mtow_kg = cleanNumber(value); break;
                    case 'Empty Weight (kg)': cur.empty_weight_kg = cleanNumber(value); break;
                    case 'Maximum Payload Capacity (kg)': cur.payload_capacity_kg = cleanNumber(value); break;
                    case 'Powerplant Type': cur.powerplant_type = value; break;
                    case 'Engine Displacement': cur.engine_displacement = value; break;
                    case 'Fuel Type': cur.fuel_type = value; break;
                    case 'Maximum Endurance (hours)': cur.endurance_hours = value; break;
                    case 'Cruise Speed (km/h)': cur.cruise_speed_kmh = cleanNumber(value); break;
                    case 'Maximum Speed (km/h)': cur.max_speed_kmh = cleanNumber(value); break;
                    case 'Service Ceiling (m)': cur.ceiling_m = cleanNumber(value); break;
                    case 'Datalink/Comms Range (km)': cur.datalink_range_km = cleanNumber(value); break;
                    case 'Maximum Aircraft Range (km)': cur.aircraft_range_km = cleanNumber(value); break;
                    case 'Primary Payload Type': cur.payload_type = value; break;
                    case 'Gimbal Type': cur.gimbal_type = value; break;
                    case 'EO Sensor Resolution': cur.eo_resolution = value; break;
                    case 'IR Sensor Type': cur.ir_type = value; break;
                    case 'Laser Rangefinder': cur.laser_rangefinder = cleanBool(value); break;
                    case 'Laser Designator/Illuminator': cur.laser_designator = cleanBool(value); break;
                    case 'SAR Capability': cur.sar_capability = cleanBool(value); break;
                    case 'SIGINT Capability': cur.sigint_capability = cleanBool(value); break;
                    case 'EW/Jamming Capability': cur.ew_capability = cleanBool(value); break;
                    case 'Kinetic Payload Capability': cur.kinetic_load = cleanBool(value); break;
                    case 'Autopilot Type': cur.autopilot = value; break;
                    case 'Datalink Frequency': cur.datalink_freq = value; break;
                    case 'Encryption': cur.encryption = value; break;
                    case 'BLOS/SATCOM Capable': cur.blos_satcom = cleanBool(value); break;
                    case 'Video Standard': cur.video_standard = value; break;
                    case 'GCS Type': cur.gcs_type = value; break;
                    case 'Setup Time (minutes)': cur.setup_time_min = value; break;
                    case 'Crew Size': cur.crew_size = value; break;
                }
            }
        }

        return uasObjects as UAS[];

    } catch (error) {
        console.error("Error fetching UAS data:", error);
        return [];
    }
};

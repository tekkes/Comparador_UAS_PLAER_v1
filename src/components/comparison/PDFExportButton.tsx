"use client";

import React from 'react';
import { UAS } from '@/lib/types';
import { FileDown, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useState } from 'react';

interface Props {
    uas: UAS[];
}

const getDataUrl = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject('No ctx');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
        img.src = url;
    });
};

export const PDFExportButton = ({ uas }: Props) => {
    const [generating, setGenerating] = useState(false);

    const handleExport = async () => {
        setGenerating(true);
        // Small delay to let UI show spinner
        await new Promise(resolve => setTimeout(resolve, 500));

        // Capture Charts
        let chartsDataUrl = null;
        try {
            const chartsElement = document.getElementById('comparison-charts-container');
            if (chartsElement) {
                // @ts-ignore
                const canvas = await (await import('html2canvas')).default(chartsElement, {
                    scale: 2,
                    backgroundColor: '#0f172a', // Match theme background
                    logging: false
                });
                chartsDataUrl = canvas.toDataURL('image/png');
            }
        } catch (error) {
            console.error("Error capturing charts:", error);
        }

        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 14;

        // --- HEADER ---
        doc.setFillColor(15, 23, 42); // slate-900
        doc.rect(0, 0, pageWidth, 25, 'F');

        // Logo
        try {
            const logoData = await getDataUrl('/shield.png');
            doc.addImage(logoData, 'PNG', pageWidth - 25, 2, 16, 20); // Top right
        } catch (e) {
            console.error("Logo load error", e);
        }

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text("PLAER // UAS COMPARADOR", margin, 12);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text("Comparative Analysis Report", margin, 18);

        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // slate-400
        doc.text(`Generated: ${new Date().toLocaleString('es-ES')}`, margin, 29);

        // --- TITLE & SYSTEMS ---
        doc.setTextColor(15, 23, 42); // slate-900
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        const systemNames = uas.map(u => u.name).join(' vs ');
        const splitTitle = doc.splitTextToSize(`Systems: ${systemNames}`, pageWidth - (margin * 2));
        doc.text(splitTitle, margin, 35);

        let startY = 35 + (splitTitle.length * 5) + 5;

        // --- TABLE DATA ---
        const getVal = (u: UAS, key: keyof UAS) => {
            const val = u[key];
            if (typeof val === 'boolean') return val ? 'YES' : 'NO';
            if (!val) return '-';
            return String(val);
        };

        const rows = [
            { section: "General", label: "Manufacturer", key: 'manufacturer' },
            { section: "General", label: "Country", key: 'country' },
            { section: "General", label: "Class", key: 'group_classification' },
            { section: "Physical", label: "MTOW (kg)", key: 'mtow_kg' },
            { section: "Physical", label: "Wingspan (m)", key: 'wingspan_m' },
            { section: "Physical", label: "Length (m)", key: 'length_m' },
            { section: "Physical", label: "Height (m)", key: 'height_m' },
            { section: "Performance", label: "Endurance (hr)", key: 'endurance_hours' },
            { section: "Performance", label: "Range (Air) (km)", key: 'aircraft_range_km' },
            { section: "Performance", label: "Range (DL) (km)", key: 'datalink_range_km' },
            { section: "Performance", label: "Speed (Max) (km/h)", key: 'max_speed_kmh' },
            { section: "Performance", label: "Speed (Cr) (km/h)", key: 'cruise_speed_kmh' },
            { section: "Performance", label: "Ceiling (m)", key: 'ceiling_m' },
            { section: "Propulsion", label: "Powerplant", key: 'powerplant_type' },
            { section: "Propulsion", label: "Fuel", key: 'fuel_type' },
            { section: "Ops", label: "Runway (m)", key: 'runway_min_m' },
            { section: "Ops", label: "Crew", key: 'crew_size' },
            { section: "Comms", label: "Freq", key: 'datalink_freq' },
            { section: "Payload", label: "Capacity (kg)", key: 'payload_capacity_kg' },
            { section: "Payload", label: "Sensors", key: 'payload_type' },
            { section: "Cap (Bool)", label: "Laser RF", key: 'laser_rangefinder' },
            { section: "Cap (Bool)", label: "Laser Des", key: 'laser_designator' },
            { section: "Cap (Bool)", label: "SATCOM", key: 'blos_satcom' },
            { section: "Cap (Bool)", label: "SAR", key: 'sar_capability' },
            { section: "Cap (Bool)", label: "EW", key: 'ew_capability' },
            { section: "Cap (Bool)", label: "Kinetic", key: 'kinetic_load' },
        ];

        const tableBody = rows.map(r => [
            r.label,
            ...uas.map(u => getVal(u, r.key as keyof UAS))
        ]);

        autoTable(doc, {
            startY: startY,
            head: [['Param', ...uas.map(u => u.name)]],
            body: tableBody,
            theme: 'grid',
            headStyles: {
                fillColor: [30, 41, 59], // slate-800
                textColor: 255,
                fontSize: 8,
                fontStyle: 'bold',
                halign: 'center',
                cellPadding: 2
            },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 30, fillColor: [241, 245, 249], fontSize: 7 }, // slate-100 for labels
                // Dynamic columns for UAS data
            },
            styles: {
                fontSize: 7,
                cellPadding: 1.5,
                lineColor: [226, 232, 240], // slate-200
                lineWidth: 0.1,
                overflow: 'linebreak',
                valign: 'middle'
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252] // slate-50
            },
            margin: { left: margin, right: margin },
            didDrawPage: (data) => {
                // Footer
                doc.setFontSize(8);
                doc.setTextColor(148, 163, 184); // slate-400
                doc.text(`Page ${data.pageNumber}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
                doc.text("PLAER Confidential", margin, pageHeight - 8);
            }
        });

        // --- CHARTS ---
        // Always add to 2nd page
        if (chartsDataUrl) {
            doc.addPage();

            doc.setFontSize(12);
            doc.setTextColor(15, 23, 42); // slate-900
            doc.text("Performance Comparison Charts", margin, 20);

            // Aspect ratio of charts
            // Assuming 16:9 roughly or capture dimensions
            doc.addImage(chartsDataUrl, 'PNG', margin, 25, pageWidth - (margin * 2), 0); // 0 height means auto-scale
        }

        doc.save(`UAS_Comparison_PLAER_${new Date().toISOString().split('T')[0]}.pdf`);
        setGenerating(false);
    };

    return (
        <button
            onClick={handleExport}
            disabled={generating}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {generating ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />}
            {generating ? "Generating..." : "Export Report PDF"}
        </button>
    );
};

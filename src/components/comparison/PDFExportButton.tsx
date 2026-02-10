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

export const PDFExportButton = ({ uas }: Props) => {
    const [generating, setGenerating] = useState(false);

    const handleExport = async () => {
        setGenerating(true);
        // Small delay to let UI show spinner
        await new Promise(resolve => setTimeout(resolve, 500));

        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;

        // --- HEADER ---
        doc.setFillColor(15, 23, 42); // slate-900
        doc.rect(0, 0, pageWidth, 20, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text("PLAER SYSTEM // UAS COMPARATOR", 14, 13);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated: ${new Date().toLocaleString('es-ES')}`, pageWidth - 14, 13, { align: 'right' });

        // --- TITLE ---
        doc.setTextColor(15, 23, 42); // slate-900
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text("Comparative Analysis Report", 14, 35);

        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139); // slate-500
        const systemNames = uas.map(u => u.name).join(' vs ');
        doc.text(doc.splitTextToSize(`Systems: ${systemNames}`, pageWidth - 28), 14, 42);

        // --- TABLE DATA ---
        // Define rows properly mapped
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
            { section: "Performance", label: "Endurance (hr)", key: 'endurance_hours' },
            { section: "Performance", label: "Range (km)", key: 'aircraft_range_km' },
            { section: "Performance", label: "Speed (km/h)", key: 'max_speed_kmh' },
            { section: "Capabilities", label: "Laser RF", key: 'laser_rangefinder' },
            { section: "Capabilities", label: "SATCOM", key: 'blos_satcom' },
        ];

        const tableBody = rows.map(r => [
            r.label,
            ...uas.map(u => getVal(u, r.key as keyof UAS))
        ]);

        autoTable(doc, {
            startY: 50,
            head: [['Parameter', ...uas.map(u => u.name)]],
            body: tableBody,
            theme: 'grid',
            headStyles: {
                fillColor: [30, 41, 59], // slate-800
                textColor: 255,
                fontStyle: 'bold',
                halign: 'center'
            },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 40, fillColor: [241, 245, 249] }, // slate-100 for labels
                // Dynamic columns for UAS data
            },
            styles: {
                fontSize: 9,
                cellPadding: 3,
                lineColor: [226, 232, 240], // slate-200
                lineWidth: 0.1,
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252] // slate-50
            },
            didDrawPage: (data) => {
                // Footer
                doc.setFontSize(8);
                doc.setTextColor(148, 163, 184); // slate-400
                doc.text(`Page ${data.pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
                doc.text("PLAER SYSTEM Confidential", 14, pageHeight - 10);
            }
        });

        doc.save(`UAS_Comparison_${new Date().toISOString().split('T')[0]}.pdf`);
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

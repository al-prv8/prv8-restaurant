"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Download,
  BarChart3,
  Calendar,
  CheckCircle2,
  FileCheck,
} from "lucide-react";
import { Card, SectionTitle, KpiRow, Button, Pill } from "@/components/prive/ui";

export default function GmReportsPage() {
  const reports = [
    { title: "Daily Sales & Food Cost Summary", type: "PDF / CSV", date: "Aug 17, 2026", status: "Ready" },
    { title: "Weekly Labor Variance & Overtime Audit", type: "PDF / Excel", date: "Aug 17, 2026", status: "Ready" },
    { title: "Month-to-Date Store P&L Statement", type: "PDF", date: "Aug 15, 2026", status: "Generated" },
    { title: "Health Dept Compliance Audit Log", type: "PDF", date: "Aug 10, 2026", status: "Archived" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337] mb-1">
            BALLANTYNE #02 · FINANCIAL & AUDIT REPORTS
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">
            Reports & Audit Library
          </h1>
          <p className="mt-1 max-w-3xl text-sm font-medium text-[#78716C]">
            Daily financial statements, labor variance exports, health department logs, and automated P&L summaries.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button className="flex items-center gap-1.5">
            <Download className="size-3.5" />
            <span>Export Daily P&L (PDF)</span>
          </Button>
        </div>
      </div>

      {/* KPI Strip */}
      <KpiRow
        items={[
          { label: "Reports Generated", value: "24 this month", tone: "good", sub: "Automated night audit" },
          { label: "Audit Log Status", value: "100% Compliant", tone: "good", sub: "No discrepancies found" },
          { label: "P&L Margin (MTD)", value: "21.4%", tone: "good", sub: "+1.2% vs budget" },
          { label: "Last Export", value: "Today 12:00 PM", tone: "neutral", sub: "Jordan Ellis" },
        ]}
      />

      {/* Reports Table */}
      <Card>
        <SectionTitle hint="Automated Scheduled Reports">
          Available Financial & Operational Reports
        </SectionTitle>

        <div className="overflow-x-auto rounded-xl border border-[#E7E5E0]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F5F2] border-b border-[#E7E5E0] text-[10px] font-bold uppercase tracking-widest text-[#78716C]">
              <tr>
                <th className="p-3">REPORT NAME</th>
                <th className="p-3">FORMAT</th>
                <th className="p-3">GENERATED DATE</th>
                <th className="p-3">STATUS</th>
                <th className="p-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F2F0] font-medium text-[#1C1917]">
              {reports.map((r) => (
                <tr key={r.title} className="hover:bg-[#FAFAF8] transition-colors">
                  <td className="p-3 font-bold text-[#1C1917]">{r.title}</td>
                  <td className="p-3 text-[#78716C]">{r.type}</td>
                  <td className="p-3 text-[#78716C]">{r.date}</td>
                  <td className="p-3">
                    <Pill tone="teal">{r.status}</Pill>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      className="text-xs font-bold text-[#881337] hover:underline inline-flex items-center gap-1"
                    >
                      <Download className="size-3" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

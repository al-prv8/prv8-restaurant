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
  FileSpreadsheet,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Card, SectionTitle, KpiRow, Button, Pill, PriveIntelBanner } from "@/components/prive/ui";

export default function GmReportsPage() {
  const reports = [
    { title: "Daily Sales & Food Cost Summary", type: "PDF / CSV", date: "Aug 17, 2026", status: "Ready" },
    { title: "Weekly Labor Variance & Overtime Audit", type: "PDF / Excel", date: "Aug 17, 2026", status: "Ready" },
    { title: "Month-to-Date Store P&L Statement", type: "PDF", date: "Aug 15, 2026", status: "Generated" },
    { title: "Health Dept Compliance Audit Log", type: "PDF", date: "Aug 10, 2026", status: "Archived" },
  ];

  const quickExports = [
    { title: "Daily P&L Statement", format: "PDF", desc: "Gross revenue, food cost %, labor cost %, net margin.", icon: FileText, tone: "good" },
    { title: "Weekly Labor Variance", format: "XLSX", desc: "Shift breakdown, overtime hours, 7shifts schedule sync.", icon: FileSpreadsheet, tone: "warn" },
    { title: "Inventory Depletion Log", format: "CSV", desc: "SKU usage, waste logs, supplier reorder totals.", icon: BarChart3, tone: "good" },
    { title: "Health & Safety Audit", format: "PDF", desc: "ServSafe certifications, food temp logs, permit status.", icon: ShieldCheck, tone: "good" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337] mb-1">
            BALLANTYNE #02 · FINANCIAL & AUDIT REPORTS
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">
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

      <PriveIntelBanner
        summary="3 reports are ready for export. This week's performance summary shows $31,842 in sales, +8.2% above forecast and +1.2% margin improvement."
        details={[
          "Automated night audit ran at 2:00 AM with zero discrepancies detected across 24 line items.",
          "P&L margin for the month-to-date is 21.4%, exceeding the 20.2% budget target.",
          "Audit log is 100% compliant. All GM actions logged with timestamp and approval chain.",
        ]}
      />

      {/* Quick Export Grid */}
      <Card>
        <SectionTitle hint="One-Click Downloads">
          Featured Operational & Financial Exports
        </SectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {quickExports.map((q) => {
            const Icon = q.icon;
            return (
              <div
                key={q.title}
                className="rounded-xl border border-[#E7E5E0] bg-[#FAFAF8] p-4 flex flex-col justify-between space-y-3 hover:border-[#881337]/30 hover:bg-white transition-all shadow-2xs group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="grid size-9 place-items-center rounded-lg bg-[#881337]/10 text-[#881337]">
                      <Icon className="size-4" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider rounded border border-[#E7E5E0] bg-white px-2 py-0.5 text-[#1C1917]">
                      {q.format}
                    </span>
                  </div>

                  <h3 className="text-xs font-extrabold text-[#1C1917] mt-3 group-hover:text-[#881337] transition-colors">
                    {q.title}
                  </h3>
                  <p className="text-[11px] font-medium text-[#78716C] mt-1 leading-normal">
                    {q.desc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => alert(`Downloading ${q.title} (${q.format})...`)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-[#E7E5E0] bg-white py-2 text-xs font-bold text-[#1C1917] hover:bg-[#881337] hover:text-white hover:border-[#881337] transition-all cursor-pointer"
                >
                  <Download className="size-3.5" />
                  <span>Download Report</span>
                </button>
              </div>
            );
          })}
        </div>
      </Card>

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
                      onClick={() => alert(`Downloading ${r.title}...`)}
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

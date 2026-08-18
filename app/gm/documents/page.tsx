"use client";

import React from "react";
import Link from "next/link";
import {
  Folder,
  FileText,
  Upload,
  Search,
  CheckCircle2,
  FileCheck,
} from "lucide-react";
import { Card, SectionTitle, KpiRow, Button, Pill, PriveIntelBanner } from "@/components/prive/ui";

export default function GmDocumentsPage() {
  const documents = [
    { title: "Standard Operating Procedures (SOP 2026)", category: "Operations", updated: "Aug 1, 2026", size: "4.2 MB", version: "v4.1" },
    { title: "Employee Handbook & Code of Conduct", category: "HR & Policy", updated: "Jul 15, 2026", size: "2.8 MB", version: "v3.0" },
    { title: "Emergency Action Plan & Evacuation Route", category: "Safety", updated: "Jun 10, 2026", size: "1.5 MB", version: "v2.2" },
    { title: "Allergen Management & Cross-Contamination", category: "Food Safety", updated: "Aug 5, 2026", size: "3.1 MB", version: "v5.0" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337] mb-1">
            BALLANTYNE #02 · DOCUMENTATION & POLICY
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">
            Documents & SOP Library
          </h1>
          <p className="mt-1 max-w-3xl text-sm font-medium text-[#78716C]">
            Central repository for restaurant operating procedures, employee handbooks, food safety guidelines, and emergency protocols.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button className="flex items-center gap-1.5">
            <Upload className="size-3.5" />
            <span>Upload Document</span>
          </Button>
        </div>
      </div>

      {/* KPI Strip */}
      <KpiRow
        items={[
          { label: "Active Documents", value: "18 files", tone: "good", sub: "All current versions" },
          { label: "Staff Sign-Offs", value: "98.4%", tone: "good", sub: "34 / 35 acknowledged" },
          { label: "SOP Revisions", value: "Up to date", tone: "good", sub: "Last revised Aug 5" },
          { label: "Storage Used", value: "48 MB / 5 GB", tone: "good", sub: "Cloud synced" },
        ]}
      />

      <PriveIntelBanner
        summary="18 operational documents are current and cloud-synced. 34 of 35 staff have acknowledged the latest policy updates."
        details={[
          "All SOPs are up to date as of Aug 5. No pending revision cycles.",
          "1 team member (Jordan Smith) has not signed the updated allergen handling policy.",
          "Storage: 48 MB used of 5 GB allocated. Automatic backup runs nightly at 2:00 AM.",
        ]}
      />

      {/* Document Table */}
      <Card>
        <SectionTitle hint="Privé Cloud Storage">
          Store Operations & Policy Documents
        </SectionTitle>

        <div className="overflow-x-auto rounded-xl border border-[#E7E5E0]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F5F2] border-b border-[#E7E5E0] text-[10px] font-bold uppercase tracking-widest text-[#78716C]">
              <tr>
                <th className="p-3">DOCUMENT TITLE</th>
                <th className="p-3">CATEGORY</th>
                <th className="p-3">VERSION</th>
                <th className="p-3">LAST UPDATED</th>
                <th className="p-3 text-right">SIZE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F2F0] font-medium text-[#1C1917]">
              {documents.map((d) => (
                <tr key={d.title} className="hover:bg-[#FAFAF8] transition-colors cursor-pointer">
                  <td className="p-3 font-bold text-[#1C1917] flex items-center gap-2">
                    <FileText className="size-4 text-[#881337] shrink-0" />
                    <span>{d.title}</span>
                  </td>
                  <td className="p-3 text-[#78716C]">{d.category}</td>
                  <td className="p-3 font-mono text-[11px]">{d.version}</td>
                  <td className="p-3 text-[#78716C]">{d.updated}</td>
                  <td className="p-3 text-right text-[#78716C] tabular-nums">{d.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

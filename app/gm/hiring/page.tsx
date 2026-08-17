"use client";

import React from "react";
import Link from "next/link";
import {
  UserPlus,
  Users,
  CheckCircle2,
  Clock,
  FileText,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { Card, SectionTitle, KpiRow, Button, Pill } from "@/components/prive/ui";

export default function GmHiringPage() {
  const applicants = [
    { name: "Devon Vance", position: "Line Cook", applied: "2 days ago", stage: "Interview Scheduled", status: "High Fit (94%)" },
    { name: "Samantha Cross", position: "Server", applied: "3 days ago", stage: "Background Check", status: "Passed" },
    { name: "Liam Patel", position: "Cashier", applied: "Yesterday", stage: "Offer Extended", status: "Pending Acceptance" },
    { name: "Elena Rostova", position: "Shift Supervisor", applied: "5 days ago", stage: "Onboarding (Day 2)", status: "In Progress" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337] mb-1">
            BALLANTYNE #02 · TALENT ACQUISITION
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">
            Hiring & Onboarding Pipeline
          </h1>
          <p className="mt-1 max-w-3xl text-sm font-medium text-[#78716C]">
            Applicant tracking, candidate interview scheduling, I-9 verification, and new hire onboarding workflows.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button className="flex items-center gap-1">
            <UserPlus className="size-3.5" />
            <span>Post Open Requisition</span>
          </Button>
        </div>
      </div>

      {/* KPI Strip */}
      <KpiRow
        items={[
          { label: "Active Applicants", value: "8 candidates", tone: "good", sub: "3 interviews this week" },
          { label: "Open Positions", value: "2 roles", tone: "warn", sub: "Line Cook, Server" },
          { label: "Avg Time to Hire", value: "9 days", tone: "good", sub: "-3 days vs regional benchmark" },
          { label: "Onboarding Progress", value: "100%", tone: "good", sub: "Elena Rostova Day 2" },
        ]}
      />

      {/* Applicant Tracking Table */}
      <Card>
        <SectionTitle hint="Recruiting Pipeline">
          Active Candidates & Onboarding Candidates
        </SectionTitle>

        <div className="overflow-x-auto rounded-xl border border-[#E7E5E0]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F5F2] border-b border-[#E7E5E0] text-[10px] font-bold uppercase tracking-widest text-[#78716C]">
              <tr>
                <th className="p-3">CANDIDATE</th>
                <th className="p-3">POSITION</th>
                <th className="p-3">APPLIED</th>
                <th className="p-3">STAGE</th>
                <th className="p-3 text-right">FIT / STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F2F0] font-medium text-[#1C1917]">
              {applicants.map((a) => (
                <tr key={a.name} className="hover:bg-[#FAFAF8] transition-colors">
                  <td className="p-3 font-bold text-[#1C1917]">{a.name}</td>
                  <td className="p-3 text-[#78716C]">{a.position}</td>
                  <td className="p-3 text-[#78716C]">{a.applied}</td>
                  <td className="p-3 font-bold text-[#881337]">{a.stage}</td>
                  <td className="p-3 text-right">
                    <Pill tone="teal">{a.status}</Pill>
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

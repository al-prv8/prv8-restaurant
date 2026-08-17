"use client";

import React from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Award,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { Card, SectionTitle, KpiRow, Button, Pill } from "@/components/prive/ui";

export default function GmPerformancePage() {
  const benchmarks = [
    { metric: "Overall Health Score", storeVal: "96 / 100", regionalAvg: "89 / 100", rank: "#1 of 12", tone: "good" },
    { metric: "Labor Cost %", storeVal: "24.8%", regionalAvg: "25.4%", rank: "#3 of 12", tone: "good" },
    { metric: "Sales Growth vs Plan", storeVal: "+8.2%", regionalAvg: "+4.1%", rank: "#1 of 12", tone: "good" },
    { metric: "Guest NPS Score", storeVal: "+72", regionalAvg: "+64", rank: "#2 of 12", tone: "good" },
    { metric: "Staff Turnover Rate", storeVal: "12%", regionalAvg: "22%", rank: "#1 of 12", tone: "good" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337] mb-1">
            BALLANTYNE #02 · REGIONAL BENCHMARKING
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">
            Store Performance & Leaderboard
          </h1>
          <p className="mt-1 max-w-3xl text-sm font-medium text-[#78716C]">
            Performance benchmarking against the 12 Carolinas locations across revenue growth, labor efficiency, guest NPS, and staff retention.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/regional/portfolio">
            <Button variant="quiet">View Full Carolinas Portfolio</Button>
          </Link>
        </div>
      </div>

      {/* KPI Strip */}
      <KpiRow
        items={[
          { label: "Regional Rank", value: "#1 of 12", tone: "good", sub: "Top performing location" },
          { label: "Health Score", value: "96 / 100", tone: "good", sub: "Grade A Grade" },
          { label: "Sales vs Budget", value: "+8.2%", tone: "good", sub: "$31,842 today" },
          { label: "Guest Rating", value: "4.9 ★", tone: "good", sub: "342 reviews" },
        ]}
      />

      {/* Benchmarks Table */}
      <Card>
        <SectionTitle hint="Carolinas District 4">
          Ballantyne #02 vs Regional Averages
        </SectionTitle>

        <div className="overflow-x-auto rounded-xl border border-[#E7E5E0]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F5F2] border-b border-[#E7E5E0] text-[10px] font-bold uppercase tracking-widest text-[#78716C]">
              <tr>
                <th className="p-3">KEY PERFORMANCE METRIC</th>
                <th className="p-3">BALLANTYNE #02</th>
                <th className="p-3">CAROLINAS REGIONAL AVG</th>
                <th className="p-3 text-right">DISTRICT RANK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F2F0] font-medium text-[#1C1917]">
              {benchmarks.map((b) => (
                <tr key={b.metric} className="hover:bg-[#FAFAF8] transition-colors">
                  <td className="p-3 font-bold text-[#1C1917]">{b.metric}</td>
                  <td className="p-3 font-extrabold text-[#881337] tabular-nums">{b.storeVal}</td>
                  <td className="p-3 text-[#78716C] tabular-nums">{b.regionalAvg}</td>
                  <td className="p-3 text-right">
                    <Pill tone="teal">{b.rank}</Pill>
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

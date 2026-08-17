"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Users,
  Send,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Card, SectionTitle, KpiRow, Button, Pill } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export default function GmSchedulePage() {
  const { state, dispatch } = usePrive();
  const [selectedRole, setSelectedRole] = useState("All");

  const roster = [
    { name: "Maya Robinson", role: "Server", sat: "10 AM - 4 PM", sun: "10 AM - 4 PM", mon: "OFF", tue: "4 PM - 10 PM", wed: "10 AM - 4 PM", thu: "OFF", fri: "4 PM - 10 PM", hours: 30 },
    { name: "Jordan Smith", role: "Server", sat: "4 PM - 10 PM", sun: "OFF", mon: "10 AM - 4 PM", tue: "OFF", wed: "4 PM - 10 PM", thu: "10 AM - 4 PM", fri: "OFF", hours: 24 },
    { name: "Taylor Morgan", role: "Server", sat: "10 AM - 4 PM", sun: "10 AM - 4 PM", mon: "4 PM - 10 PM", tue: "10 AM - 4 PM", wed: "OFF", thu: "4 PM - 10 PM", fri: "10 AM - 4 PM", hours: 36 },
    { name: "Chris Bennett", role: "Cashier", sat: "8 AM - 3 PM", sun: "8 AM - 3 PM", mon: "8 AM - 3 PM", tue: "OFF", wed: "8 AM - 3 PM", thu: "8 AM - 3 PM", fri: "OFF", hours: 35 },
    { name: "Marcus Vance", role: "Line Cook", sat: "3 PM - 11 PM", sun: "3 PM - 11 PM", mon: "OFF", tue: "3 PM - 11 PM", wed: "3 PM - 11 PM", thu: "OFF", fri: "3 PM - 11 PM", hours: 40 },
    { name: "Andre Vega", role: "Line Cook", sat: "7 AM - 3 PM", sun: "7 AM - 3 PM", mon: "7 AM - 3 PM", tue: "7 AM - 3 PM", wed: "7 AM - 3 PM", thu: "OFF", fri: "OFF", hours: 40 },
  ];

  const filteredRoster = selectedRole === "All" ? roster : roster.filter((r) => r.role === selectedRole);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337] mb-1">
            BALLANTYNE #02 · LABOR MANAGEMENT
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">
            Master Shift Schedule & Roster
          </h1>
          <p className="mt-1 max-w-3xl text-sm font-medium text-[#78716C]">
            Weekly staff scheduling, shift swap approvals, open shift broadcasts, and overtime prevention.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={() => dispatch({ type: "sendShiftOffer" })}
            className="flex items-center gap-1.5"
          >
            <Send className="size-3.5" />
            <span>{state.shiftOfferSent ? "Offer Sent" : "Broadcast Open Shift"}</span>
          </Button>
        </div>
      </div>

      {/* KPI Strip */}
      <KpiRow
        items={[
          { label: "Scheduled Shifts", value: "124", tone: "good", sub: "35 team members" },
          { label: "Open Shifts", value: "2", tone: "warn", sub: "Sat 4–8 PM (2 Servers)" },
          { label: "Labor Forecast", value: "$7,904", tone: "neutral", sub: "24.8% of sales" },
          { label: "Overtime Hours", value: "0 hrs", tone: "good", sub: "100% compliant" },
        ]}
      />

      {/* Open Shift Alert Banner */}
      <Card tone="intel">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#B45309]/10 text-[#B45309] mt-0.5">
              <AlertTriangle className="size-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#B45309]">
                Shift Coverage Alert
              </div>
              <div className="text-sm font-bold text-[#1C1917]">
                Saturday Peak (4:00 PM – 8:00 PM) requires 2 additional servers.
              </div>
              <p className="text-xs text-[#78716C] mt-0.5">
                Privé recommends broadcasting this open shift to qualified off-duty staff.
              </p>
            </div>
          </div>

          <Button
            onClick={() => dispatch({ type: "sendShiftOffer" })}
            disabled={state.shiftOfferSent}
            className="shrink-0"
          >
            {state.shiftOfferSent ? "Broadcast Sent to 6 Staff" : "Send Open Shift Broadcast"}
          </Button>
        </div>
      </Card>

      {/* Roster Controls & Filter */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3F2F0] pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-[#881337]" />
            <span className="text-sm font-black text-[#1C1917]">
              Week of Aug 17 – Aug 23, 2026
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            <Filter className="size-3.5 text-[#78716C]" />
            {["All", "Server", "Cashier", "Line Cook"].map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                  selectedRole === role
                    ? "bg-[#881337] text-white"
                    : "bg-[#F7F5F2] text-[#78716C] hover:text-[#1C1917]"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Weekly Schedule Table */}
        <div className="overflow-x-auto rounded-xl border border-[#E7E5E0]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F5F2] border-b border-[#E7E5E0] text-[10px] font-bold uppercase tracking-widest text-[#78716C]">
              <tr>
                <th className="p-3">EMPLOYEE</th>
                <th className="p-3">ROLE</th>
                <th className="p-3">SAT 17</th>
                <th className="p-3">SUN 18</th>
                <th className="p-3">MON 19</th>
                <th className="p-3">TUE 20</th>
                <th className="p-3">WED 21</th>
                <th className="p-3">THU 22</th>
                <th className="p-3">FRI 23</th>
                <th className="p-3 text-right">TOTAL HRS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F2F0] font-medium text-[#1C1917]">
              {filteredRoster.map((r) => (
                <tr key={r.name} className="hover:bg-[#FAFAF8] transition-colors">
                  <td className="p-3 font-bold text-[#1C1917]">{r.name}</td>
                  <td className="p-3 text-[#78716C]">{r.role}</td>
                  <td className="p-3 text-[11px]">{r.sat === "OFF" ? <span className="text-[#A8A29E]">OFF</span> : <span className="font-semibold text-[#881337]">{r.sat}</span>}</td>
                  <td className="p-3 text-[11px]">{r.sun === "OFF" ? <span className="text-[#A8A29E]">OFF</span> : <span className="font-semibold">{r.sun}</span>}</td>
                  <td className="p-3 text-[11px]">{r.mon === "OFF" ? <span className="text-[#A8A29E]">OFF</span> : <span className="font-semibold">{r.mon}</span>}</td>
                  <td className="p-3 text-[11px]">{r.tue === "OFF" ? <span className="text-[#A8A29E]">OFF</span> : <span className="font-semibold">{r.tue}</span>}</td>
                  <td className="p-3 text-[11px]">{r.wed === "OFF" ? <span className="text-[#A8A29E]">OFF</span> : <span className="font-semibold">{r.wed}</span>}</td>
                  <td className="p-3 text-[11px]">{r.thu === "OFF" ? <span className="text-[#A8A29E]">OFF</span> : <span className="font-semibold">{r.thu}</span>}</td>
                  <td className="p-3 text-[11px]">{r.fri === "OFF" ? <span className="text-[#A8A29E]">OFF</span> : <span className="font-semibold">{r.fri}</span>}</td>
                  <td className="p-3 text-right font-extrabold tabular-nums">{r.hours}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

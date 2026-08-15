"use client";

import { useState } from "react";
import {
  CheckCircle2, Activity, ShieldCheck, Database,
  Clock, ArrowRight, Lock
} from "lucide-react";
import { Card, Pill, SectionTitle, Pagination } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";
import { DataFlowMesh } from "@/components/prive/DataFlowMesh";

const SYSTEMS = [
  {
    name: "Toast POS",
    desc: "Sales, item mix, transactions",
    scope: "Real-time · Every 90s",
    icon: "🍞",
  },
  {
    name: "Paycor",
    desc: "Payroll, labor cost, turnover",
    scope: "Daily sync · 3:00 AM",
    icon: "💼",
  },
  {
    name: "7shifts",
    desc: "Scheduling and availability",
    scope: "Real-time · On change",
    icon: "📅",
  },
  {
    name: "Restaurant365",
    desc: "Inventory and purchasing",
    scope: "Daily sync · 4:00 AM",
    icon: "📦",
  },
  {
    name: "Guest Feedback CRM",
    desc: "Complaints and recovery",
    scope: "Real-time · Webhook",
    icon: "💬",
  },
  {
    name: "Voice AI",
    desc: "Inbound guest calls",
    scope: "Real-time · On call",
    icon: "📞",
  },
];

export default function IntegrationsPage() {
  const { state } = usePrive();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.ceil(state.audit.length / pageSize);
  const paginatedAudit = state.audit.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337] mb-1">
            Security & Governance
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">
            Integrations & Audit Log
          </h1>
          <p className="mt-1.5 text-sm font-medium text-[#78716C] max-w-2xl">
            Privé reads from connected systems in real time and records an immutable audit
            log for every human approval — nothing executes without a traceable actor.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-[#15803D]/8 px-4 py-2.5 shrink-0">
          <Activity className="size-4 text-[#15803D]" />
          <span className="text-[13px] font-bold text-[#15803D]">
            {SYSTEMS.length} Systems Connected
          </span>
        </div>
      </div>

      {/* Live Operational Telemetry Node Graph Mesh */}
      <div className="mb-6">
        <DataFlowMesh />
      </div>

      {/* Stats Strip */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-4 text-center">
          <div className="text-2xl font-black text-[#15803D] tabular-nums">{SYSTEMS.length}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#A8A29E] mt-0.5">Active Sources</div>
        </div>
        <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-4 text-center">
          <div className="text-2xl font-black text-[#1C1917] tabular-nums">{state.audit.length}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#A8A29E] mt-0.5">Audit Events</div>
        </div>
        <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-4 text-center">
          <div className="text-2xl font-black text-[#881337] tabular-nums">100%</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#A8A29E] mt-0.5">Human Approved</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">

        {/* Source Systems */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <SectionTitle hint="All live">Connected Source Systems</SectionTitle>
            <div className="space-y-2">
              {SYSTEMS.map(({ name, desc, scope, icon }) => (
                <div
                  key={name}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-white/40 backdrop-blur-sm shadow-sm ring-1 ring-black/[0.04] px-3.5 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl shrink-0">{icon}</span>
                    <div className="min-w-0">
                      <div className="text-[13px] font-bold text-[#1C1917] truncate">{name}</div>
                      <div className="text-[11px] font-medium text-[#78716C] truncate">{desc}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Pill tone="teal">
                      <CheckCircle2 className="size-3" /> Live
                    </Pill>
                    <span className="text-[10px] text-[#A8A29E] font-medium whitespace-nowrap">{scope}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Governance Note */}
          <Card tone="intel">
            <div className="flex items-start gap-3">
              <ShieldCheck className="size-5 text-[#881337] shrink-0 mt-0.5" />
              <div>
                <div className="text-[13px] font-bold text-[#1C1917]">Human Governance Engine</div>
                <p className="mt-1 text-[12px] font-medium text-[#78716C] leading-relaxed">
                  No financial credits are issued, orders submitted, or schedules modified
                  without explicit GM sign-off. Every AI-recommended action is held in a
                  pending queue until a human approves.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Audit Ledger */}
        <div className="lg:col-span-7">
          <Card className="h-full">
            <SectionTitle hint={`${state.audit.length} events`}>
              Immutable Audit Ledger
            </SectionTitle>

            {state.audit.length === 0 ? (
              <div className="rounded-2xl bg-white/8 backdrop-blur-xl shadow-md ring-1 ring-black/[0.04] p-8 text-center space-y-2">
                <Database className="size-8 text-[#1C1917]/20 mx-auto" />
                <p className="text-sm font-semibold text-[#78716C]">
                  No actions recorded yet.
                </p>
                <p className="text-xs text-[#A8A29E]">
                  Approve an action in the GM Command Center to see it logged here.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {paginatedAudit.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-4 shadow-sm space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-[#881337]/8">
                          <Lock className="size-3 text-[#881337]" />
                        </div>
                        <span className="text-[13px] font-bold text-[#1C1917] leading-snug">
                          {a.action}
                        </span>
                      </div>
                      <Pill tone={a.approval === "Pending" ? "amber" : "teal"}>
                        {a.approval}
                      </Pill>
                    </div>
                    <div className="flex items-center gap-3 pl-8 text-[11px] font-medium text-[#A8A29E]">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" /> {a.at}
                      </span>
                      <span className="flex items-center gap-1">
                        <ArrowRight className="size-3" /> {a.actor}
                      </span>
                      <span className="text-[#78716C]">{a.agent}</span>
                    </div>
                    {a.detail && (
                      <p className="pl-8 text-[11px] font-medium text-[#78716C] leading-snug">
                        {a.detail}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={state.audit.length}
              pageSize={pageSize}
            />
          </Card>
        </div>
      </div>
    </>
  );
}

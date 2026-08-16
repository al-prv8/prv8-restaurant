"use client";

import { useState } from "react";
import {
  CheckCircle2, Activity, ShieldCheck, Database,
  Clock, ArrowRight, Lock
} from "lucide-react";
import { Card, Pill, SectionTitle, Pagination, KpiRow, DataTable } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

const SYSTEMS = [
  {
    name: "Toast POS",
    desc: "Sales, item mix, transactions",
    scope: "Real-time",
    status: "Live",
    lastSync: "Every 90s",
    icon: "🍞",
  },
  {
    name: "Paycor",
    desc: "Payroll, labor cost, turnover",
    scope: "Daily sync",
    status: "Live",
    lastSync: "3:00 AM",
    icon: "💼",
  },
  {
    name: "7shifts",
    desc: "Scheduling and availability",
    scope: "Real-time",
    status: "Live",
    lastSync: "On change",
    icon: "📅",
  },
  {
    name: "Restaurant365",
    desc: "Inventory and purchasing",
    scope: "Daily sync",
    status: "Live",
    lastSync: "4:00 AM",
    icon: "📦",
  },
  {
    name: "Guest Feedback CRM",
    desc: "Complaints and recovery",
    scope: "Real-time",
    status: "Live",
    lastSync: "Webhook",
    icon: "💬",
  },
  {
    name: "Voice AI",
    desc: "Inbound guest calls",
    scope: "Real-time",
    status: "Live",
    lastSync: "On call",
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

  const tableData = SYSTEMS.map((s) => ({
    System: (
      <div className="flex items-center gap-2">
        <span className="text-lg">{s.icon}</span>
        <span className="font-bold text-[#1C1917]">{s.name}</span>
      </div>
    ),
    "Data Type": s.desc,
    "Sync Mode": s.scope,
    Status: (
      <div className="flex items-center gap-1 text-[#15803D] font-bold text-xs">
        <CheckCircle2 className="size-3.5" /> {s.status}
      </div>
    ),
    "Last Sync": s.lastSync,
  }));

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
            Privé reads from connected systems in real time and records a complete audit trail
            for every human approval — nothing executes without a traceable actor.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-[#15803D]/8 px-4 py-2.5 shrink-0">
          <Activity className="size-4 text-[#15803D]" />
          <span className="text-[13px] font-bold text-[#15803D]">
            {SYSTEMS.length} Systems Connected
          </span>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="mb-8">
        <KpiRow
          items={[
            { label: "Active Sources", value: SYSTEMS.length },
            { label: "Audit Events", value: state.audit.length },
            { label: "Human Approved", value: "100%", valueColor: "text-[#881337]" },
          ]}
        />
      </div>

      <div className="mb-8">
        <div className="rounded-xl bg-white border border-[#E7E5E0] p-5 shadow-sm overflow-hidden">
          <DataTable
            columns={["System", "Data Type", "Sync Mode", "Status", "Last Sync"]}
            data={tableData}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5 space-y-4">
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
              Audit Trail
            </SectionTitle>

            {state.audit.length === 0 ? (
              <div className="rounded-xl bg-white border border-[#E7E5E0] p-8 text-center space-y-2 mt-4">
                <Database className="size-8 text-[#1C1917]/20 mx-auto" />
                <p className="text-sm font-semibold text-[#78716C]">
                  No actions recorded yet.
                </p>
                <p className="text-xs text-[#A8A29E]">
                  Approve an action in the GM Command Center to see it logged here.
                </p>
              </div>
            ) : (
              <div className="mt-4 flex flex-col">
                {paginatedAudit.map((a, i) => (
                  <div
                    key={a.id}
                    className={`flex items-start justify-between gap-2 py-3 ${i !== paginatedAudit.length - 1 ? 'border-b border-[#F3F2F0]' : ''}`}
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-[#881337]/8">
                          <Lock className="size-3 text-[#881337]" />
                        </div>
                        <span className="text-[13px] font-bold text-[#1C1917] leading-snug">
                          {a.action}
                        </span>
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
                    <div className="shrink-0">
                      <Pill tone={a.approval === "Pending" ? "amber" : "teal"}>
                        {a.approval}
                      </Pill>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={state.audit.length}
                pageSize={pageSize}
              />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

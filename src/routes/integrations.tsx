import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PriveShell } from "@/components/prive/Shell";
import { Card, Pill, SectionTitle, Pagination } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export const Route = createFileRoute("/integrations")({
  head: () => ({
    meta: [
      { title: "Integrations & Audit — Privé" },
      { name: "description", content: "Connected source systems and the human-approval trail behind every Privé action." },
      { property: "og:title", content: "Integrations & Audit — Privé" },
      { property: "og:description", content: "Connected source systems and the human-approval trail behind every Privé action." },
    ],
  }),
  component: IntegrationsPage,
});

const SYSTEMS = [
  ["Toast POS", "Sales, item mix, transactions"],
  ["Paycor", "Payroll, labor cost, turnover"],
  ["7shifts", "Scheduling and availability"],
  ["Restaurant365", "Inventory and purchasing"],
  ["Guest Feedback CRM", "Complaints and recovery"],
  ["Voice AI", "Inbound guest calls"],
];

function IntegrationsPage() {
  const { state } = usePrive();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const totalPages = Math.ceil(state.audit.length / pageSize);
  const paginatedAudit = state.audit.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <PriveShell persona="gm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Integrations & Audit Log</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#101828]/60">
          Privé reads from connected POS & payroll systems and records an immutable audit log for every action.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <SectionTitle hint="All connected">Source Systems</SectionTitle>
          <div className="space-y-2.5">
            {SYSTEMS.map(([name, desc]) => (
              <div key={name} className="flex items-center justify-between gap-3 rounded-xl border border-[#101828]/8 bg-white p-3.5 shadow-xs">
                <div>
                  <div className="text-sm font-bold text-[#101828]">{name}</div>
                  <div className="text-xs font-semibold text-[#101828]/50">{desc}</div>
                </div>
                <Pill tone="teal">Connected</Pill>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle hint={`${state.audit.length} events`}>Immutable Audit Ledger</SectionTitle>
          <div className="space-y-2.5">
            {state.audit.length === 0 ? (
              <p className="text-sm font-medium text-[#101828]/55">No actions recorded yet in this session.</p>
            ) : (
              paginatedAudit.map((a) => (
                <div key={a.id} className="rounded-xl border border-[#101828]/8 bg-white p-3.5 shadow-xs space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-[#101828]">{a.action}</span>
                    <Pill tone={a.approval === "Pending" ? "amber" : "teal"}>{a.approval}</Pill>
                  </div>
                  <p className="text-xs font-medium text-[#101828]/60">
                    {a.at} · {a.actor} · {a.agent} — {a.detail}
                  </p>
                </div>
              ))
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={state.audit.length}
            pageSize={pageSize}
          />
        </Card>
      </div>
    </PriveShell>
  );
}

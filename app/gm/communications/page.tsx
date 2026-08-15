"use client";

import { useState } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Card, Pill, SectionTitle, PriveIntelBanner, Pagination } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export default function GmCommunicationsPage() {
  const { derived: d, dispatch } = usePrive();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const unacknowledgedCount = d.comms.filter((c) => !c.acknowledged).length;
  const acknowledgedCount = d.comms.filter((c) => c.acknowledged).length;
  const totalPages = Math.ceil(d.comms.length / pageSize);
  const paginatedComms = d.comms.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleAcknowledgeAll = () => {
    d.comms.forEach((c) => {
      if (!c.acknowledged) {
        dispatch({ type: "acknowledge", id: c.id, title: c.title });
      }
    });
  };

  return (
    <>
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#881337] mb-1.5">Corporate Policy</p>
        <h1 className="text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">Corporate Communications</h1>
        <p className="mt-2 max-w-3xl text-sm font-medium text-[#78716C]">
          Corporate broadcasts, seasonal LTO launches, and policy updates requiring store manager sign-off.
        </p>
      </div>

      <PriveIntelBanner
        summary={`${unacknowledgedCount > 0 ? `${unacknowledgedCount} unacknowledged broadcast(s) require GM sign-off.` : "All corporate broadcasts and policy updates are acknowledged."}`}
        details={[
          "Unacknowledged high-priority broadcasts impact regional audit scores.",
          "Summer LTO prep checklist items must be distributed to shift leads before Friday.",
        ]}
        action={unacknowledgedCount > 0 ? handleAcknowledgeAll : undefined}
        actionLabel={unacknowledgedCount > 0 ? `Acknowledge All (${unacknowledgedCount})` : undefined}
      />

      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-1">Total Broadcasts</div>
          <div className="text-3xl font-black tabular-nums text-[#1C1917]">{d.comms.length}</div>
          <div className="text-sm font-medium text-[#78716C] mt-1">Active announcements</div>
        </div>
        <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-1">Pending Sign-Off</div>
          <div className={`text-3xl font-black tabular-nums ${unacknowledgedCount > 0 ? "text-[#B45309]" : "text-[#1C1917]"}`}>
            {unacknowledgedCount}
          </div>
          <div className="text-sm font-medium text-[#78716C] mt-1">Requires GM attention</div>
        </div>
        <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-1">Acknowledged</div>
          <div className="text-3xl font-black tabular-nums text-[#15803D]">{acknowledgedCount}</div>
          <div className="text-sm font-medium text-[#78716C] mt-1">Policy accepted</div>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <SectionTitle hint={`${d.comms.length} Broadcasts`}>Corporate Announcements & SOPs</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            {paginatedComms.map((a) => (
              <div key={a.id} className={`rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5 shadow-sm flex flex-col justify-between space-y-4 ${a.acknowledged ? "border-l-4" : "border-l-4"}`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-[#E7E5E0] pb-3">
                    <span className="font-bold text-base text-[#1C1917]">{a.title}</span>
                    <Pill tone={a.acknowledged ? "teal" : "amber"}>
                      {a.acknowledged ? "Acknowledged" : "Pending Sign-Off"}
                    </Pill>
                  </div>
                  <p className="text-xs text-[#78716C] font-bold uppercase tracking-wider">
                    {a.from} · {a.date}
                  </p>
                  <p className="text-sm text-[#44403C] leading-relaxed font-medium">{a.summary}</p>
                </div>

                {!a.acknowledged ? (
                  <div className="pt-3 border-t border-[#E7E5E0]">
                    <button
                      onClick={() => dispatch({ type: "acknowledge", id: a.id, title: a.title })}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#881337] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#6B0F2A] transition-all"
                    >
                      <ShieldCheck className="size-4" />
                      Sign Off & Acknowledge
                    </button>
                  </div>
                ) : (
                  <div className="text-sm font-bold text-[#15803D] flex items-center gap-2 pt-3 border-t border-[#E7E5E0]">
                    <CheckCircle2 className="size-5" /> Signed off & recorded in audit ledger
                  </div>
                )}
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={d.comms.length}
            pageSize={pageSize}
          />
        </Card>
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Card, Pill, SectionTitle, PriveIntelBanner, Pagination, KpiRow } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export default function GmCommunicationsPage() {
  const { derived: d, dispatch } = usePrive();
  const [currentPage, setCurrentPage] = useState(1);
  const [signedOffAt, setSignedOffAt] = useState<Record<string, string>>({});
  const pageSize = 4;

  const unacknowledgedCount = d.comms.filter((c) => !c.acknowledged).length;
  const acknowledgedCount = d.comms.filter((c) => c.acknowledged).length;
  const totalPages = Math.ceil(d.comms.length / pageSize);
  const paginatedComms = d.comms.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleAcknowledgeAll = () => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newSignOffs: Record<string, string> = {};
    d.comms.forEach((c) => {
      if (!c.acknowledged) {
        dispatch({ type: "acknowledge", id: c.id, title: c.title });
        newSignOffs[c.id] = now;
      }
    });
    setSignedOffAt((prev) => ({ ...prev, ...newSignOffs }));
  };

  return (
    <>
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#881337] mb-1.5">Corporate Policy</p>
        <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">Corporate Communications</h1>
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

      {/* Broadcast Acknowledgment Progress Ring & Receipt Counter */}
      <div className="mb-6 bg-white border border-[#E7E5E0] rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E7E5E0] pb-3 mb-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#881337]">SOP Audit Compliance</div>
            <div className="text-base font-black text-[#1C1917]">Store Sign-Off Compliance Rate</div>
          </div>
          <Pill tone={unacknowledgedCount === 0 ? "teal" : "amber"}>
            {Math.round((acknowledgedCount / Math.max(d.comms.length, 1)) * 100)}% Signed Off
          </Pill>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#1C1917]">
            <span>Audit Progress: {acknowledgedCount} of {d.comms.length} SOPs Confirmed</span>
            <span className="text-[#78716C]">{unacknowledgedCount} Pending Action</span>
          </div>

          <div className="w-full bg-[#E7E5E0] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#15803D] h-full transition-all duration-500 rounded-full"
              style={{ width: `${(acknowledgedCount / Math.max(d.comms.length, 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <KpiRow
          items={[
            {
              label: "Total Broadcasts",
              value: d.comms.length.toString(),
              subtext: "Active announcements",
            },
            {
              label: "Pending Sign-Off",
              value: unacknowledgedCount.toString(),
              subtext: "Requires GM attention",
              valueColor: unacknowledgedCount > 0 ? "text-[#B45309]" : "text-[#1C1917]"
            },
            {
              label: "Acknowledged",
              value: acknowledgedCount.toString(),
              subtext: "Policy accepted",
              valueColor: "text-[#15803D]"
            }
          ]}
        />
      </div>

      <div className="space-y-6">
        <Card>
          <SectionTitle hint={`${d.comms.length} Broadcasts`}>Corporate Announcements & SOPs</SectionTitle>
          <div className="flex flex-col mt-4">
            {paginatedComms.map((a, index) => (
              <div key={a.id} className={`py-4 flex flex-col justify-between space-y-4 ${index !== paginatedComms.length - 1 ? "border-b border-[#F3F2F0]" : ""}`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
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
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        dispatch({ type: "acknowledge", id: a.id, title: a.title });
                        setSignedOffAt(prev => ({
                          ...prev,
                          [a.id]: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }));
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#881337] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#6B0F2A] transition-all"
                    >
                      <ShieldCheck className="size-4" />
                      Sign Off & Acknowledge
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1 pt-2">
                    <div className="text-sm font-bold text-[#15803D] flex items-center gap-2">
                      <CheckCircle2 className="size-5" /> Signed off & recorded in audit ledger
                    </div>
                    {signedOffAt[a.id] && (
                      <div className="text-xs font-semibold text-[#15803D]">
                        ✓ Signed off by Jordan Ellis · {signedOffAt[a.id]}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={d.comms.length}
              pageSize={pageSize}
            />
          </div>
        </Card>
      </div>
    </>
  );
}

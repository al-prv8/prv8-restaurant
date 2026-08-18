"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Card, Pill, SectionTitle, PriveIntelBanner, Pagination, KpiRow } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export default function GmApprovalsPage() {
  const { derived: d, dispatch } = usePrive();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const openApprovals = d.pendingApprovals.filter((p) => !p.done);
  const clearedApprovals = d.pendingApprovals.filter((p) => p.done);
  const totalPages = Math.ceil(d.pendingApprovals.length / pageSize);
  const paginatedApprovals = d.pendingApprovals.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleApproveAll = () => {
    dispatch({ type: "increasePotatoOrder", lbs: 35 });
    dispatch({ type: "approveStaffing" });
  };

  const time = "Today, 10:42 AM"; // Mock time for the approval timestamp

  return (
    <>
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#881337] mb-1.5">Administration</p>
        <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">Pending Approvals Queue</h1>
        <p className="mt-2 max-w-3xl text-sm font-medium text-[#78716C]">
          Centralized human-in-the-loop queue for all operational actions requiring GM sign-off.
        </p>
      </div>

      <PriveIntelBanner
        summary={
          openApprovals.length > 0
            ? `${openApprovals.length} pending action(s) require GM sign-off. Approving boosts store readiness to ~88%.`
            : "All operational approvals are cleared, store readiness is at optimal state."
        }
        details={[
          "Human-in-the-loop governance: Privé does not order inventory or issue gift credits without explicit sign-off.",
          "Every approved action is automatically recorded in the immutable audit log with timestamp.",
        ]}
        action={openApprovals.length > 0 ? handleApproveAll : undefined}
        actionLabel={openApprovals.length > 0 ? `Approve All Pending (${openApprovals.length})` : undefined}
      />

      {/* Batch Approval Action Toolbar */}
      {openApprovals.length > 0 && (
        <div className="mb-6 bg-[#FEF3C7] border border-[#B45309]/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#881337]">Human-in-the-Loop Governance</div>
            <div className="text-base font-black text-[#1C1917]">{openApprovals.length} Pending Actions Require GM Sign-Off</div>
          </div>

          <button
            type="button"
            onClick={handleApproveAll}
            className="rounded-xl bg-[#881337] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#6B0F2A] active:scale-95 transition-all shrink-0"
          >
            ✦ Approve All Pending Actions ({openApprovals.length})
          </button>
        </div>
      )}

      <KpiRow
        items={[
          {
            label: "Pending Actions",
            value: openApprovals.length.toString(),
            sub: "Requires GM sign-off",
            tone: openApprovals.length > 0 ? "warn" : "neutral",
          },
          {
            label: "Cleared",
            value: clearedApprovals.length.toString(),
            sub: "Approved & executed",
            tone: "good",
          },
          {
            label: "Total Queue",
            value: d.pendingApprovals.length.toString(),
            sub: "All tracked actions",
            tone: "neutral",
          },
        ]}
      />

      <div className="space-y-6">
        <Card>
          <SectionTitle hint={`${openApprovals.length} Pending`}>Action Queue</SectionTitle>
          <div className="space-y-0">
            {paginatedApprovals.map((p) => (
              <div
                key={p.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F3F2F0] py-4 gap-4 last:border-0"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-base ${p.done ? "text-[#A8A29E] line-through font-medium" : "font-bold text-[#1C1917]"}`}>
                      {p.label}
                    </span>
                  </div>
                  <p className="text-sm text-[#78716C] font-medium">
                    {p.done ? "Approved & logged in audit ledger" : "Requires GM approval before execution"}
                  </p>
                  {p.done && <div className="text-xs text-[#15803D] font-semibold mt-1">✓ Approved · {time}</div>}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Pill tone={p.done ? "neutral" : "amber"}>{p.done ? "Cleared" : "Action Needed"}</Pill>
                  {!p.done ? (
                    p.id === "ap-staff" ? (
                      <button
                        onClick={() => dispatch({ type: "approveStaffing" })}
                        className="rounded-lg bg-[#881337] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#6B0F2A] transition-all"
                      >
                        Approve Staffing
                      </button>
                    ) : p.id === "ap-guest" ? (
                      <Link
                        href="/gm/guests"
                        className="rounded-lg bg-[#881337] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#6B0F2A] transition-all flex items-center justify-center"
                      >
                        Review Drafts
                      </Link>
                    ) : p.id === "ap-order" ? (
                      <button
                        onClick={() => dispatch({ type: "increasePotatoOrder", lbs: 35 })}
                        className="rounded-lg bg-[#881337] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#6B0F2A] transition-all"
                      >
                        Approve Order
                      </button>
                    ) : p.id === "ap-sep" ? (
                      <Link
                        href="/gm/workforce"
                        className="rounded-lg bg-[#881337] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#6B0F2A] transition-all flex items-center justify-center"
                      >
                        Review Separation
                      </Link>
                    ) : null
                  ) : null}
                </div>
              </div>
            ))}

            {openApprovals.length === 0 ? (
              <div className="rounded-xl bg-[#15803D]/10 p-5 text-center text-sm font-bold text-[#15803D] flex items-center justify-center gap-2 mt-4">
                <CheckCircle2 className="size-5" /> All operational approvals are cleared! Store readiness is optimal.
              </div>
            ) : null}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={d.pendingApprovals.length}
            pageSize={pageSize}
          />
        </Card>
      </div>
    </>
  );
}

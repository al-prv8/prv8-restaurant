"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Card, Pill, SectionTitle, PriveIntelBanner, Pagination } from "@/components/prive/ui";
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

  return (
    <>
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#881337] mb-1.5">Administration</p>
        <h1 className="text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">Pending Approvals Queue</h1>
        <p className="mt-2 max-w-3xl text-sm font-medium text-[#78716C]">
          Centralized human-in-the-loop queue for all operational actions requiring GM sign-off.
        </p>
      </div>

      <PriveIntelBanner
        summary={
          openApprovals.length > 0
            ? `${openApprovals.length} pending action(s) require GM sign-off. Approving boosts store readiness to ~88%.`
            : "All operational approvals are cleared — store readiness is at optimal state."
        }
        details={[
          "Human-in-the-loop governance: Privé does not order inventory or issue gift credits without explicit sign-off.",
          "Every approved action is automatically recorded in the immutable audit log with timestamp.",
        ]}
        action={openApprovals.length > 0 ? handleApproveAll : undefined}
        actionLabel={openApprovals.length > 0 ? `Approve All Pending (${openApprovals.length})` : undefined}
      />

      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-1">Pending Actions</div>
          <div className={`text-3xl font-black tabular-nums ${openApprovals.length > 0 ? "text-[#B45309]" : "text-[#1C1917]"}`}>
            {openApprovals.length}
          </div>
          <div className="text-sm font-medium text-[#78716C] mt-1">Requires GM sign-off</div>
        </div>
        <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-1">Cleared</div>
          <div className="text-3xl font-black tabular-nums text-[#15803D]">{clearedApprovals.length}</div>
          <div className="text-sm font-medium text-[#78716C] mt-1">Approved & executed</div>
        </div>
        <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-1">Total Queue</div>
          <div className="text-3xl font-black tabular-nums text-[#1C1917]">{d.pendingApprovals.length}</div>
          <div className="text-sm font-medium text-[#78716C] mt-1">All tracked actions</div>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <SectionTitle hint={`${openApprovals.length} Pending`}>Action Queue</SectionTitle>
          <div className="space-y-4">
            {paginatedApprovals.map((p) => (
              <div
                key={p.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5 shadow-sm ${
                  p.done ? "border-l-4" : "border-l-4"
                }`}
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
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Pill tone={p.done ? "teal" : "amber"}>{p.done ? "Cleared" : "Action Needed"}</Pill>
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
              <div className="rounded-xl bg-[#15803D]/10 p-5 text-center text-sm font-bold text-[#15803D] flex items-center justify-center gap-2">
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

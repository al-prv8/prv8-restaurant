import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, Pill, SectionTitle, Button, PriveIntelBanner, Pagination } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export const Route = createFileRoute("/gm/approvals")({
  head: () => ({ meta: [{ title: "Pending Approvals — GM · Privé" }] }),
  component: GmApprovals,
});

function GmApprovals() {
  const { derived: d, dispatch } = usePrive();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const openApprovals = d.pendingApprovals.filter((p) => !p.done);
  const totalPages = Math.ceil(d.pendingApprovals.length / pageSize);
  const paginatedApprovals = d.pendingApprovals.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleApproveAll = () => {
    dispatch({ type: "potatoOrderIncrease" });
    dispatch({ type: "approveStaffing" });
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Pending Approvals Queue</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#101828]/60">
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

      <div className="space-y-6">
        <Card>
          <SectionTitle hint={`${openApprovals.length} Pending`}>Action Queue ({d.pendingApprovals.length} Total)</SectionTitle>
          <div className="space-y-3">
            {paginatedApprovals.map((p) => (
              <div
                key={p.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#101828]/8 bg-white p-4 text-sm shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={p.done ? "text-[#101828]/50 line-through font-medium" : "font-bold text-[#101828]"}>
                      {p.label}
                    </span>
                  </div>
                  <p className="text-xs text-[#101828]/50 font-medium">
                    {p.done ? "Approved & logged in audit ledger" : "Requires GM approval before execution"}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Pill tone={p.done ? "teal" : "amber"}>{p.done ? "Cleared" : "Action Needed"}</Pill>
                  {!p.done ? (
                    p.id === "ap-staff" ? (
                      <Button
                        variant="primary"
                        onClick={() => dispatch({ type: "approveStaffing" })}
                        className="py-1 px-3 text-xs"
                      >
                        Approve Staffing
                      </Button>
                    ) : p.id === "ap-guest" ? (
                      <Link
                        to="/gm/guests"
                        className="rounded-lg bg-[#5146E5] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#4238cf] transition-all"
                      >
                        Review Drafts
                      </Link>
                    ) : p.id === "ap-order" ? (
                      <Button
                        variant="primary"
                        onClick={() => dispatch({ type: "potatoOrderIncrease" })}
                        className="py-1 px-3 text-xs"
                      >
                        Approve Order
                      </Button>
                    ) : p.id === "ap-sep" ? (
                      <Link
                        to="/gm/workforce"
                        className="rounded-lg bg-[#5146E5] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#4238cf] transition-all"
                      >
                        Review Separation
                      </Link>
                    ) : null
                  ) : null}
                </div>
              </div>
            ))}

            {openApprovals.length === 0 ? (
              <div className="rounded-xl border border-[#0F9D8A]/30 bg-[#0F9D8A]/10 p-4 text-center text-sm font-semibold text-[#0B7A6C] flex items-center justify-center gap-2">
                <CheckCircle2 className="size-4" /> All operational approvals are cleared! Store readiness is optimal.
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

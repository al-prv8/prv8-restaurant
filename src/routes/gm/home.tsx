import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import { MorningBrief, ReadinessCard, AlertCard } from "@/components/prive/panels";
import { Card, Metric, SectionTitle, PageTabs, Button, PriveIntelBanner } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";
import { money } from "@/lib/prive/forecast";

export const Route = createFileRoute("/gm/home")({
  head: () => ({
    meta: [
      { title: "Command Center — GM · Privé" },
      { name: "description", content: "Morning intelligence brief, readiness score and today's key signals at Ballantyne #02." },
    ],
  }),
  component: GmHome,
});

type Tab = "all" | "readiness" | "alerts";

function GmHome() {
  const { state, derived: d, dispatch } = usePrive();
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const pendingCount = d.pendingApprovals.filter((p) => !p.done).length;

  const handleApproveAll = () => {
    dispatch({ type: "potatoOrderIncrease" });
    dispatch({ type: "approveStaffing" });
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Command Center</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#101828]/60">
          Everything Privé knows about tomorrow, ranked by financial margin and guest impact.
        </p>
      </div>

      {/* Sleek Non-Intrusive Cognitive Banner */}
      <PriveIntelBanner
        summary={`Good morning Jordan. Tomorrow volume is projected +${d.tomorrow.vsTypicalPct}% above typical (${money(d.tomorrow.sales)}). ${pendingCount} approval(s) needed to reach 88% readiness.`}
        details={[
          `Russet Potato inventory short by ${d.potato.shortage} lbs (supplier cutoff 5:00 PM).`,
          `Saturday 4–8 PM peak block requires +${d.staffing.gap} staff member for full coverage.`,
          `${d.awaitingApproval} guest recovery draft(s) awaiting GM confirmation.`,
        ]}
        action={pendingCount > 0 ? handleApproveAll : undefined}
        actionLabel={pendingCount > 0 ? `Approve All Pending Actions (${pendingCount})` : undefined}
      />

      <PageTabs
        tabs={[
          { id: "all", label: "Overview & Signals" },
          { id: "readiness", label: "Readiness Driver Score", badge: `${d.readiness.score}%` },
          { id: "alerts", label: "Operational Alerts", badge: d.alerts.length },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      <div className="space-y-6">
        {(activeTab === "all" || activeTab === "readiness") && (
          <div className="grid gap-4 sm:grid-cols-3">
            <Metric
              label="Tomorrow Sales"
              value={money(d.tomorrow.sales)}
              sub={`${d.tomorrow.transactions.toLocaleString()} txns · ${d.tomorrow.vsTypicalPct > 0 ? "+" : ""}${d.tomorrow.vsTypicalPct}% vs typical`}
              tone="good"
              sparkline={[3800, 4100, 3950, 4200, 4400, 4600, d.tomorrow.sales]}
            />
            <Metric
              label="Labor Projected"
              value={`${d.staffing.projectedLaborPct}%`}
              sub={`Target ${d.staffing.targetLaborPct}% · ${d.staffing.gap > 0 ? `${d.staffing.gap} gap` : "Covered"}`}
              tone={d.staffing.projectedLaborPct > d.staffing.targetLaborPct ? "warn" : "good"}
              sparkline={[24.2, 24.8, 25.1, 25.4, 26.0, 26.2, d.staffing.projectedLaborPct]}
            />
            <Metric
              label="Guest Complaints"
              value={`${d.openComplaints}`}
              sub={`${d.awaitingApproval} awaiting GM approval`}
              tone={d.openComplaints > 0 ? "warn" : "good"}
            />
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-12">
          {(activeTab === "all" || activeTab === "readiness") && (
            <div className="lg:col-span-6 space-y-6">
              <MorningBrief />
            </div>
          )}

          {(activeTab === "all" || activeTab === "readiness") && (
            <div className="lg:col-span-6 space-y-6">
              <ReadinessCard />
            </div>
          )}
        </div>

        {(activeTab === "all" || activeTab === "alerts") && (
          <Card>
            <SectionTitle hint={`${d.alerts.length} active`}>Prioritized Operational Signals</SectionTitle>
            {d.alerts.length === 0 ? (
              <p className="text-sm font-semibold text-[#0B7A6C]">No operational alerts active — store running cleanly.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {d.alerts.map((a) => (
                  <AlertCard key={a.id} a={a} onDismiss={() => dispatch({ type: "dismissAlert", id: a.id })} />
                ))}
              </div>
            )}
          </Card>
        )}
      </div>
    </>
  );
}

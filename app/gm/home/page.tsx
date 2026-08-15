"use client";

import { useState } from "react";
import {
 TrendingUp, TrendingDown, Users, ShoppingCart,
 MessageCircle, ChevronRight, CheckCircle2, AlertTriangle
} from "lucide-react";
import { MorningBrief, AlertCard } from "@/components/prive/panels";
import { Card, Metric, SectionTitle, PageTabs, PriveIntelBanner, Sparkline, Meter, Pill } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";
import { money } from "@/lib/prive/forecast";
import Link from "next/link";

type Tab = "all" | "readiness" | "alerts";

export default function GmHomePage() {
 const { derived: d, dispatch } = usePrive();
 const [activeTab, setActiveTab] = useState<Tab>("all");

 const pendingCount = d.pendingApprovals.filter((p) => !p.done).length;
 const ready = d.readiness.score >= 85;
 const readinessColor = ready
  ? "#15803D"
  : d.readiness.score >= 70
  ? "#B45309"
  : "#B91C1C";

 const handleApproveAll = () => {
  dispatch({ type: "increasePotatoOrder", lbs: 35 });
  dispatch({ type: "approveStaffing" });
 };

 return (
  <>
   {/* ── Page Header ─────────────────────────────────────────────────── */}
   <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
    <div>
     <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337] mb-1">
      Ballantyne #02 · Tomorrow's Outlook
     </p>
     <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-[#1C1917]">
      Command Center
     </h1>
     <p className="mt-1 text-sm text-[#78716C]">
      Everything Privé knows about tomorrow, ranked by financial impact.
     </p>
    </div>
    {pendingCount > 0 && (
     <div className="flex items-center gap-2 rounded-lg bg-[#B45309]/8 px-3.5 py-2 shrink-0">
      <AlertTriangle className="size-4 text-[#B45309] shrink-0" />
      <span className="text-[13px] font-bold text-[#92400E]">
       {pendingCount} action{pendingCount > 1 ? "s" : ""} pending
      </span>
     </div>
    )}
   </div>

   {/* ── Intel Banner ────────────────────────────────────────────────── */}
   <PriveIntelBanner
    summary={`Good morning Jordan. Tomorrow volume is projected +${d.tomorrow.vsTypicalPct}% above typical (${money(d.tomorrow.sales)}). ${pendingCount} approval(s) needed to reach 88% readiness.`}
    details={[
     `Russet Potato inventory short by ${d.potato.shortage} lbs (supplier cutoff 5:00 PM).`,
     `Saturday 4–8 PM peak block requires +${d.staffing.gap} staff member for full coverage.`,
     `${d.awaitingApproval} guest recovery draft(s) awaiting GM confirmation.`,
    ]}
    action={pendingCount > 0 ? handleApproveAll : undefined}
    actionLabel={pendingCount > 0 ? `Approve All Pending (${pendingCount})` : undefined}
   />

   <PageTabs
    tabs={[
     { id: "all", label: "Overview & Signals" },
     { id: "readiness", label: "Readiness Score", badge: `${d.readiness.score}%` },
     { id: "alerts", label: "Active Alerts", badge: d.alerts.length },
    ]}
    active={activeTab}
    onChange={(id) => setActiveTab(id as Tab)}
   />

   <div className="space-y-6">

    {/* ── KPI Row ─────────────────────────────────────────────────────── */}
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

    {/* ── Readiness Hero + Brief ───────────────────────────────────────── */}
    {(activeTab === "all" || activeTab === "readiness") && (
     <div className="grid gap-6 lg:grid-cols-12">

      {/* Readiness Score — visual centerpiece */}
      <div className="lg:col-span-5">
       <Card tone={ready ? "default" : "alert"} className="h-full">
        <SectionTitle hint="Tomorrow">Readiness Score</SectionTitle>

        {/* Giant score dial */}
        <div className="flex items-center gap-6 mb-4">
         <div className="relative flex size-28 shrink-0 items-center justify-center">
          <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 100 100">
           <circle cx="50" cy="50" r="44" fill="none" stroke="#E7E5E0" strokeWidth="9" />
           <circle
            cx="50" cy="50" r="44" fill="none"
            stroke={readinessColor}
            strokeWidth="9"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - d.readiness.score / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-700"
           />
          </svg>
          <div className="flex flex-col items-center">
           <span className="text-2xl font-black tabular-nums" style={{ color: readinessColor }}>
            {d.readiness.score}%
           </span>
           <span className="text-[9px] font-bold uppercase tracking-widest text-[#A8A29E]">Readiness</span>
          </div>
         </div>
         <div className="flex-1 space-y-2">
          <Pill tone={ready ? "teal" : "amber"}>
           {ready ? "Store Ready" : "Action Required"}
          </Pill>
          <p className="text-[12px] font-medium text-[#78716C] leading-snug">
           {ready
            ? "All operational drivers within tolerance for tomorrow's volume."
            : `Resolve ${pendingCount} pending action${pendingCount !== 1 ? "s" : ""} to reach 88% readiness.`
           }
          </p>
          {/* Mini trend sparkline */}
          <div className="flex items-center gap-2 mt-1">
           <Sparkline
            data={[61, 65, 68, 72, d.readiness.score]}
            color={readinessColor}
           />
           <span className="text-[10px] font-semibold text-[#A8A29E]">5-day trend</span>
          </div>
         </div>
        </div>

        <Meter value={d.readiness.score} tone={ready ? "teal" : d.readiness.score >= 70 ? "amber" : "red"} />

        {/* Risk items */}
        <ul className="mt-4 space-y-2">
         {d.readiness.risks.map((r) => (
          <li key={r.label} className="rounded-xl bg-white/40 backdrop-blur-sm shadow-sm px-3 py-2.5">
           <div className="flex items-center justify-between gap-2">
            <span className="text-[13px] font-semibold text-[#1C1917]">{r.label}</span>
            <Pill tone={r.probability > 50 ? "red" : "amber"}>{r.probability}% risk</Pill>
           </div>
           <p className="mt-1 text-xs font-medium text-[#78716C]">{r.detail}</p>
          </li>
         ))}
         {d.readiness.risks.length === 0 && (
          <li className="rounded-lg bg-[#15803D]/5 px-3 py-2.5 text-[13px] font-medium text-[#15803D] flex items-center gap-2">
           <CheckCircle2 className="size-4 shrink-0" />
           No open risks — all drivers inside tolerance.
          </li>
         )}
        </ul>

        <button
         type="button"
         onClick={() => dispatch({ type: "askPriveTrigger", question: "Can we handle tomorrow?" })}
         className="mt-4 flex w-full items-center gap-2.5 rounded-lg border bg-[#881337]/5 px-3 py-2.5 text-left text-[13px] font-semibold text-[#881337] transition-colors hover:bg-[#881337]/10"
        >
         <span className="opacity-70">✦</span>
         Ask Privé: &ldquo;Can we handle tomorrow?&rdquo;
        </button>
       </Card>
      </div>

      {/* Morning Brief */}
      <div className="lg:col-span-7 space-y-4">
       <MorningBrief />

       {/* Quick-action links */}
       <Card>
        <SectionTitle hint="Jump to">Priority Actions</SectionTitle>
        <div className="space-y-2">
         {[
          { href: "/gm/inventory", Icon: ShoppingCart, label: `Potato shortage — order +${d.potato.shortage} lbs before 5 PM cutoff`, tone: "warn" as const, done: d.potato.shortage === 0 },
          { href: "/gm/staffing", Icon: Users, label: `Staffing gap — ${d.staffing.gap > 0 ? `${d.staffing.gap} role(s) short for Saturday peak` : "Coverage confirmed"}`, tone: d.staffing.gap > 0 ? "warn" as const : "good" as const, done: d.staffing.gap === 0 },
          { href: "/gm/guests", Icon: MessageCircle, label: `Guest recovery — ${d.awaitingApproval} draft response${d.awaitingApproval !== 1 ? "s" : ""} awaiting approval`, tone: d.awaitingApproval > 0 ? "warn" as const : "good" as const, done: d.awaitingApproval === 0 },
         ].map(({ href, Icon, label, tone, done }) => (
          <Link
           key={href}
           href={href}
           className="flex items-center gap-3 rounded-lg bg-white/60 backdrop-blur-md shadow-sm hover:bg-white/15 group"
          >
           <div className={`grid size-7 shrink-0 place-items-center rounded-md ${done ? "bg-[#15803D]/10" : "bg-[#B45309]/10"}`}>
            {done
             ? <CheckCircle2 className="size-4 text-[#15803D]" />
             : <Icon className="size-4 text-[#B45309]" />
            }
           </div>
           <span className={`flex-1 font-medium text-[13px] ${done ? "text-[#78716C] line-through" : "text-[#1C1917]"}`}>
            {label}
           </span>
           {!done && (
            <ChevronRight className="size-4 text-[#A8A29E] group-hover:text-[#881337] group-hover:translate-x-0.5 transition-all shrink-0" />
           )}
          </Link>
         ))}
        </div>
       </Card>
      </div>
     </div>
    )}

    {/* ── Operational Alerts ───────────────────────────────────────────── */}
    {(activeTab === "all" || activeTab === "alerts") && (
     <Card>
      <SectionTitle hint={`${d.alerts.length} active`}>Prioritized Operational Signals</SectionTitle>
      {d.alerts.length === 0 ? (
       <div className="flex items-center gap-3 rounded-lg bg-[#15803D]/5 p-4">
        <CheckCircle2 className="size-5 text-[#15803D] shrink-0" />
        <p className="text-sm font-semibold text-[#15803D]">No operational alerts active — store running cleanly.</p>
       </div>
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

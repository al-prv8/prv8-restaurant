"use client";

import { useState } from "react";
import {
 TrendingUp, Users, ShoppingCart,
 MessageCircle, ChevronRight, CheckCircle2, AlertTriangle, Zap
} from "lucide-react";
import { MorningBrief, AlertCard } from "@/components/prive/panels";
import { Card, Metric, SectionTitle, PageTabs, PriveIntelBanner, Sparkline, Meter, Pill, RadialGauge, KpiRow } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";
import { money } from "@/lib/prive/forecast";
import Link from "next/link";

import { playSuccessChime } from "@/lib/prive/audio";

type Tab = "all" | "readiness" | "alerts";

function HourlySalesLaborChart() {
  const [activeIdx, setActiveIdx] = useState<number | null>(6);

  const hours = [
    { time: "10 AM", sales: 320, labor: 110 },
    { time: "11 AM", sales: 580, labor: 160 },
    { time: "12 PM", sales: 890, labor: 220 },
    { time: "1 PM",  sales: 750, labor: 200 },
    { time: "2 PM",  sales: 420, labor: 140 },
    { time: "3 PM",  sales: 310, labor: 120 },
    { time: "4 PM",  sales: 520, labor: 190 },
    { time: "5 PM",  sales: 840, labor: 250 },
    { time: "6 PM",  sales: 980, labor: 270 },
    { time: "7 PM",  sales: 910, labor: 260 },
    { time: "8 PM",  sales: 640, labor: 190 },
    { time: "9 PM",  sales: 380, labor: 130 },
  ];

  const maxSales = 1000;
  const activeData = activeIdx !== null ? hours[activeIdx] : hours[6];

  return (
    <div className="bg-white border border-[#E7E5E0] rounded-xl p-5 my-6">
      <div className="flex items-center justify-between border-b border-[#E7E5E0] pb-3 mb-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#881337]">Tomorrow's Curve</div>
          <div className="text-base font-black text-[#1C1917]">Hourly Sales vs Labor Cost Dual-Axis Curve</div>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <span className="flex items-center gap-1.5 text-[#15803D]">
            <span className="size-2 rounded-full bg-[#15803D]" /> Sales ($/hr)
          </span>
          <span className="flex items-center gap-1.5 text-[#881337]">
            <span className="size-2 rounded-full bg-[#881337]" /> Labor Cost ($/hr)
          </span>
        </div>
      </div>

      <div className="relative h-44 w-full pt-4">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 600 120" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="30" x2="600" y2="30" stroke="#E7E5E0" strokeDasharray="4 4" strokeWidth="1" />
          <line x1="0" y1="70" x2="600" y2="70" stroke="#E7E5E0" strokeDasharray="4 4" strokeWidth="1" />

          {/* Sales Gradient Area */}
          <defs>
            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#15803D" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#15803D" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area under sales curve */}
          <path
            d={`M 0,120 ${hours.map((h, i) => `L ${(i * 600) / 11},${120 - (h.sales / maxSales) * 110}`).join(" ")} L 600,120 Z`}
            fill="url(#salesGrad)"
          />

          {/* Sales Curve Line */}
          <path
            d={`M ${hours.map((h, i) => `${(i * 600) / 11},${120 - (h.sales / maxSales) * 110}`).join(" L ")}`}
            fill="none"
            stroke="#15803D"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Labor Curve Line */}
          <path
            d={`M ${hours.map((h, i) => `${(i * 600) / 11},${120 - (h.labor / maxSales) * 110}`).join(" L ")}`}
            fill="none"
            stroke="#881337"
            strokeWidth="2.5"
            strokeDasharray="4 2"
            strokeLinecap="round"
          />

          {/* Interactive Data Nodes */}
          {hours.map((h, i) => {
            const x = (i * 600) / 11;
            const ySales = 120 - (h.sales / maxSales) * 110;
            const isHover = activeIdx === i;
            return (
              <g key={h.time} className="cursor-pointer" onMouseEnter={() => setActiveIdx(i)}>
                <circle
                  cx={x}
                  cy={ySales}
                  r={isHover ? 6 : 3.5}
                  className={`transition-all ${isHover ? "fill-[#881337] stroke-white stroke-2" : "fill-[#15803D]"}`}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hourly X-Axis Labels */}
      <div className="flex justify-between text-[10px] font-bold text-[#A8A29E] uppercase tracking-wider mt-2 border-t border-[#E7E5E0] pt-2">
        {hours.map((h, i) => (
          <span
            key={h.time}
            onMouseEnter={() => setActiveIdx(i)}
            className={`cursor-pointer transition-colors ${activeIdx === i ? "text-[#881337] font-black" : ""}`}
          >
            {h.time}
          </span>
        ))}
      </div>

      {/* Active Hover Tooltip Card */}
      {activeData && (
        <div className="mt-3 rounded-xl bg-white p-3 border border-[#E7E5E0] shadow-sm flex items-center justify-between text-xs">
          <div>
            <span className="font-black text-[#1C1917]">{activeData.time} Peak Forecast:</span>{" "}
            <span className="text-[#78716C]">Sales:</span> <strong className="text-[#15803D]">${activeData.sales}/hr</strong> ·{" "}
            <span className="text-[#78716C]">Labor Cost:</span> <strong className="text-[#881337]">${activeData.labor}/hr</strong>
          </div>
          <div className="font-bold text-[#15803D] bg-[#15803D]/10 px-2.5 py-0.5 rounded-full text-[11px]">
            Labor Ratio: {Math.round((activeData.labor / activeData.sales) * 100)}%
          </div>
        </div>
      )}
    </div>
  );
}

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

 const hour = new Date().getHours();
 const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

 return (
  <>
   {/* ── Page Header ─────────────────────────────────────────────────── */}
   <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
    <div>
     <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337] mb-1">
      Ballantyne #02 · Saturday, August 16
     </p>
     <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-[#1C1917]">
      {greeting}, Jordan.
     </h1>
     <p className="mt-1 text-sm font-medium text-[#78716C]">
      Everything Privé knows about tomorrow, ranked by financial impact.
     </p>
    </div>
    {pendingCount > 0 && (
     <div className="flex items-center gap-2 rounded-xl bg-[#B45309]/10 border border-[#B45309]/30 px-4 py-2 shrink-0">
      <AlertTriangle className="size-4 text-[#B45309] shrink-0" />
      <span className="text-xs font-bold text-[#92400E]">
       {pendingCount} action{pendingCount > 1 ? "s" : ""} pending sign-off
      </span>
     </div>
    )}
   </div>

   {/* ── Location Hero Strip ──────────────────────────────────────────── */}
   <div className="mb-6 relative h-[160px] sm:h-[200px] w-full overflow-hidden rounded-xl border border-[#E7E5E0] shadow-sm">
    <img
     src="/kitchen-hero.jpg"
     alt="Ballantyne kitchen in service"
     className="absolute inset-0 w-full h-full object-cover object-center"
    />
    {/* dark overlay for readability */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#1C1917]/80 via-[#1C1917]/30 to-transparent" />
    <div className="absolute inset-0 flex items-end p-4 sm:p-5">
     <div className="flex items-end justify-between w-full">
      <div>
       <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-1">
        Ballantyne #02 · Line Kitchen
       </div>
       <div className="text-lg font-black text-white leading-tight sm:text-xl">
        The Morning Table
       </div>
       <div className="text-xs font-medium text-white/70 mt-0.5">
        Charlotte, NC · Open 6 AM – 10 PM
       </div>
      </div>
      <div className="flex items-center gap-1.5 rounded-full bg-[#15803D] px-3 py-1.5 text-[11px] font-black text-white shadow-lg shrink-0">
       <span className="size-1.5 rounded-full bg-white animate-pulse" />
       Kitchen In Service
      </div>
     </div>
    </div>
   </div>

   {/* ── Intel Banner ────────────────────────────────────────────────── */}
   <PriveIntelBanner
    summary={`Tomorrow volume is projected +${d.tomorrow.vsTypicalPct}% above typical (${money(d.tomorrow.sales)}). ${pendingCount} approval(s) needed to reach 88% readiness.`}
    details={[
     `Russet Potato inventory short by ${d.potato.shortage} lbs (supplier cutoff 5:00 PM).`,
     `Saturday 4–8 PM peak block requires +${d.staffing.gap} staff member for full coverage.`,
     `${d.awaitingApproval} guest recovery draft(s) awaiting GM confirmation.`,
    ]}
    action={pendingCount > 0 ? handleApproveAll : undefined}
    actionLabel={pendingCount > 0 ? `Approve All Pending (${pendingCount})` : undefined}
   />

   {/* ── 1-Click Hero Quick Action Chips ── */}
   <div className="mb-6 rounded-xl bg-white border border-[#E7E5E0] shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div className="text-xs font-bold uppercase tracking-wider text-[#881337] flex items-center gap-1.5 shrink-0">
     <Zap className="size-3.5" /> 1-Click GM Actions:
    </div>
    <div className="flex flex-wrap items-center gap-2 flex-1">
     <button
      type="button"
      onClick={() => {
       playSuccessChime();
       dispatch({ type: "increasePotatoOrder", lbs: 35 });
      }}
      disabled={d.potato.shortage === 0}
      className={`rounded-md px-2.5 py-1.5 text-xs font-bold transition-all ${
       d.potato.shortage === 0
        ? "bg-[#15803D]/10 text-[#15803D] border border-[#15803D]/30"
        : "bg-[#881337] text-white hover:bg-[#6B0F2A] active:scale-95"
      }`}
     >
      {d.potato.shortage === 0 ? "✓ Potato Order Increased (+35 lbs)" : "🥔 Order +35 lbs Potatoes"}
     </button>

     <button
      type="button"
      onClick={() => {
       playSuccessChime();
       dispatch({ type: "approveStaffing" });
      }}
      disabled={d.staffing.gap === 0}
      className={`rounded-md px-2.5 py-1.5 text-xs font-bold transition-all ${
       d.staffing.gap === 0
        ? "bg-[#15803D]/10 text-[#15803D] border border-[#15803D]/30"
        : "bg-[#881337] text-white hover:bg-[#6B0F2A] active:scale-95"
      }`}
     >
      {d.staffing.gap === 0 ? "✓ Staff Shift Approved" : "👥 Approve Saturday Peak Server"}
     </button>

     <button
      type="button"
      onClick={() => {
       playSuccessChime();
       dispatch({ type: "completeCertification" });
      }}
      disabled={d.expiringCerts === 0}
      className={`rounded-md px-2.5 py-1.5 text-xs font-bold transition-all ${
       d.expiringCerts === 0
        ? "bg-[#15803D]/10 text-[#15803D] border border-[#15803D]/30"
        : "bg-[#881337] text-white hover:bg-[#6B0F2A] active:scale-95"
      }`}
     >
      {d.expiringCerts === 0 ? "✓ ServSafe Renewed" : "📜 Renew Andre ServSafe Cert"}
     </button>
    </div>
   </div>

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

    {/* ── KPI Row & Interactive Dual-Axis Chart ─────────────────────────── */}
    {(activeTab === "all" || activeTab === "readiness") && (
     <>
      <KpiRow
       items={[
        {
         label: "Tomorrow Sales",
         value: money(d.tomorrow.sales),
         sub: `${d.tomorrow.transactions.toLocaleString()} txns · ${d.tomorrow.vsTypicalPct > 0 ? "+" : ""}${d.tomorrow.vsTypicalPct}% vs typical`,
         tone: "good",
        },
        {
         label: "Labor Projected",
         value: `${d.staffing.projectedLaborPct}%`,
         sub: `Target ${d.staffing.targetLaborPct}% · ${d.staffing.gap > 0 ? `${d.staffing.gap} gap` : "Covered"}`,
         tone: d.staffing.projectedLaborPct > d.staffing.targetLaborPct ? "warn" : "good",
        },
        {
         label: "Guest Complaints",
         value: `${d.openComplaints}`,
         sub: `${d.awaitingApproval} awaiting GM approval`,
         tone: d.openComplaints > 0 ? "warn" : "good",
        },
       ]}
      />

      {(d.potato.shortage > 0 || d.staffing.gap > 0 || d.awaitingApproval > 0 || d.expiringCerts > 0) && (
       <Card className="mb-6">
        <SectionTitle hint="Prioritized">NEEDS YOUR ATTENTION</SectionTitle>
        <div className="flex flex-col gap-2">
         {d.potato.shortage > 0 && (
          <Link href="/gm/inventory" className="flex items-start gap-3 rounded-lg border-l-4 border-[#B91C1C] bg-[#FEF2F2] px-4 py-3 hover:bg-[#FEE2E2] transition-colors">
           <span className="text-lg">🔴</span>
           <div className="flex-1">
            <div className="text-sm font-bold text-[#991B1B]">Potato shortage</div>
            <div className="text-xs text-[#7F1D1D] mt-0.5">Order +{d.potato.shortage} lbs before 5 PM cutoff</div>
           </div>
           <ChevronRight className="size-4 text-[#B91C1C]" />
          </Link>
         )}
         {d.awaitingApproval > 0 && (
          <Link href="/gm/guests" className="flex items-start gap-3 rounded-lg border-l-4 border-[#B91C1C] bg-[#FEF2F2] px-4 py-3 hover:bg-[#FEE2E2] transition-colors">
           <span className="text-lg">🔴</span>
           <div className="flex-1">
            <div className="text-sm font-bold text-[#991B1B]">Guest complaints awaiting approval</div>
            <div className="text-xs text-[#7F1D1D] mt-0.5">{d.awaitingApproval} draft response(s) need GM confirmation</div>
           </div>
           <ChevronRight className="size-4 text-[#B91C1C]" />
          </Link>
         )}
         {d.expiringCerts > 0 && (
          <Link href="/gm/staffing" className="flex items-start gap-3 rounded-lg border-l-4 border-[#B45309] bg-[#FFFBEB] px-4 py-3 hover:bg-[#FEF3C7] transition-colors">
           <span className="text-lg">🟠</span>
           <div className="flex-1">
            <div className="text-sm font-bold text-[#92400E]">Expiring Certifications</div>
            <div className="text-xs text-[#78350F] mt-0.5">{d.expiringCerts} staff member(s) need cert renewal</div>
           </div>
           <ChevronRight className="size-4 text-[#B45309]" />
          </Link>
         )}
         {d.staffing.gap > 0 && (
          <Link href="/gm/staffing" className="flex items-start gap-3 rounded-lg border-l-4 border-[#4F46E5] bg-[#EEF2FF] px-4 py-3 hover:bg-[#E0E7FF] transition-colors">
           <span className="text-lg">🔵</span>
           <div className="flex-1">
            <div className="text-sm font-bold text-[#3730A3]">Staffing gap projected</div>
            <div className="text-xs text-[#312E81] mt-0.5">Saturday 4-8 PM peak requires +{d.staffing.gap} staff for full coverage</div>
           </div>
           <ChevronRight className="size-4 text-[#4F46E5]" />
          </Link>
         )}
        </div>
       </Card>
      )}

      <HourlySalesLaborChart />
     </>
    )}

    {/* ── Readiness Hero + Brief ───────────────────────────────────────── */}
    {(activeTab === "all" || activeTab === "readiness") && (
     <div className="grid gap-6 lg:grid-cols-12">

      {/* Readiness Score Centerpiece */}
      <div className="lg:col-span-5">
       <Card tone={ready ? "default" : "alert"} className="h-full">
        <SectionTitle hint="Tomorrow">Store Readiness Meter</SectionTitle>

        <div className="flex items-center gap-6 mb-4">
         <RadialGauge value={d.readiness.score} size={110} strokeWidth={9} />
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
          <li key={r.label} className="rounded-lg border border-[#F3F2F0] bg-[#F7F5F2] px-3 py-2.5">
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
         className="mt-4 flex w-full items-center gap-2.5 rounded-xl border border-[#881337]/20 bg-[#881337]/5 px-3 py-2.5 text-left text-[13px] font-bold text-[#881337] transition-colors hover:bg-[#881337]/10"
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
        <SectionTitle hint="Jump to">Priority Operational Actions</SectionTitle>
        <div className="space-y-2">
         {[
          { href: "/gm/inventory", Icon: ShoppingCart, label: `Potato shortage — order +${d.potato.shortage} lbs before 5 PM cutoff`, tone: "warn" as const, done: d.potato.shortage === 0 },
          { href: "/gm/staffing", Icon: Users, label: `Staffing gap — ${d.staffing.gap > 0 ? `${d.staffing.gap} role(s) short for Saturday peak` : "Coverage confirmed"}`, tone: d.staffing.gap > 0 ? "warn" as const : "good" as const, done: d.staffing.gap === 0 },
          { href: "/gm/guests", Icon: MessageCircle, label: `Guest recovery — ${d.awaitingApproval} draft response${d.awaitingApproval !== 1 ? "s" : ""} awaiting approval`, tone: d.awaitingApproval > 0 ? "warn" as const : "good" as const, done: d.awaitingApproval === 0 },
         ].map(({ href, Icon, label, tone, done }) => (
          <Link
           key={href}
           href={href}
           className="flex items-center gap-3 rounded-lg bg-[#F7F5F2] border border-[#F3F2F0] hover:bg-[#F3F1EE] p-3 group transition-all"
          >
           <div className={`grid size-7 shrink-0 place-items-center rounded-lg ${done ? "bg-[#15803D]/10 text-[#15803D]" : "bg-[#B45309]/10 text-[#B45309]"}`}>
            {done
             ? <CheckCircle2 className="size-4" />
             : <Icon className="size-4" />
            }
           </div>
           <span className={`flex-1 font-bold text-[13px] ${done ? "text-[#78716C] line-through" : "text-[#1C1917]"}`}>
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
       <div className="flex items-center gap-3 rounded-xl bg-[#15803D]/10 p-4">
        <CheckCircle2 className="size-5 text-[#15803D] shrink-0" />
        <p className="text-sm font-bold text-[#15803D]">No operational alerts active — store running cleanly.</p>
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

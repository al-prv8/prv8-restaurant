"use client";

import { CheckCircle2 } from "lucide-react";
import { Card, Pill, SectionTitle, PriveIntelBanner, KpiRow, DataTable, THead, Th, Tr, Td } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";
import { money } from "@/lib/prive/forecast";

export default function GmStaffingPage() {
 const { state, derived: d, dispatch } = usePrive();
 const s = d.staffing;

 const HOURLY_COVERAGE = [
  { time: "10 AM", scheduled: 4, recommended: 4, peak: false },
  { time: "12 PM", scheduled: 8, recommended: 8, peak: true },
  { time: "2 PM", scheduled: 6, recommended: 6, peak: false },
  { time: "4 PM", scheduled: 5, recommended: 7, peak: true, gap: true },
  { time: "6 PM", scheduled: 6, recommended: 8, peak: true, gap: true },
  { time: "8 PM", scheduled: 5, recommended: 5, peak: false },
  { time: "10 PM", scheduled: 3, recommended: 3, peak: false },
 ];

 return (
  <>
   <div className="mb-8">
    <p className="text-[10px] font-bold uppercase tracking-widest text-[#881337] mb-1.5">Labor Operations</p>
    <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">Staffing & Labor Coverage</h1>
    <p className="mt-2 max-w-3xl text-sm font-medium text-[#78716C]">
     Labor forecast against peak transaction volume, recommended vs scheduled staffing levels.
    </p>
   </div>

   <PriveIntelBanner
    summary={
     s.gap > 0
      ? `Staffing is ${s.gap} role(s) short during Saturday 4:00 PM – 8:00 PM dinner peak.`
      : "Staffing coverage is fully balanced against peak transaction volume."
    }
    details={[
     `Labor Projected: ${s.projectedLaborPct}% of sales against ${s.targetLaborPct}% target (${money(s.projectedLaborCost)}).`,
     `Scheduled Staff: ${s.scheduledStaff} vs recommended ${s.recommendedStaff} (${s.laborHoursNeeded} labor hours).`,
     "Stagger closing shift out-times to eliminate 14 overtime hours.",
    ]}
    action={s.gap > 0 ? () => dispatch({ type: "sendShiftOffer" }) : undefined}
    actionLabel={s.gap > 0 ? "Broadcast Shift Opportunity" : undefined}
   />

   {/* Staffing Coverage Bar Chart */}
   <div className="mb-6 rounded-xl bg-white border border-[#E7E5E0] shadow-sm p-5">
    <div className="flex items-center justify-between border-b border-[#E7E5E0] pb-3 mb-5">
     <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#881337]">Hourly Coverage Chart</div>
      <div className="text-base font-black text-[#1C1917]">Scheduled vs. Required, Saturday Shift</div>
     </div>
     <Pill tone={s.gap > 0 ? "amber" : "teal"}>
      {s.gap > 0 ? `${s.gap} role gap` : "Fully Staffed"}
     </Pill>
    </div>

    {/* Legend */}
    <div className="flex items-center gap-5 mb-4 text-[11px] font-bold text-[#78716C]">
     <span className="flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-sm bg-[#881337]" />Scheduled</span>
     <span className="flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-sm bg-[#E7E5E0]" />Required</span>
     {s.gap > 0 && <span className="flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-sm bg-[#B45309]/40" />Gap Zone</span>}
    </div>

    {/* SVG Bar Chart */}
    <div className="w-full overflow-x-auto">
     <svg viewBox="0 0 560 140" className="w-full" style={{ minWidth: 320 }}>
      {/* Y-axis gridlines */}
      {[2, 4, 6, 8, 10].map((v) => (
       <g key={v}>
        <line x1="32" y1={120 - v * 11} x2="552" y2={120 - v * 11} stroke="#F3F2F0" strokeWidth="1" />
        <text x="28" y={120 - v * 11 + 4} textAnchor="end" fontSize="9" fill="#A8A29E" fontWeight="600">{v}</text>
       </g>
      ))}

      {/* Bars */}
      {HOURLY_COVERAGE.map((h, i) => {
       const x = 40 + i * 74;
       const barW = 22;
       const recH = h.recommended * 11;
       const schH = h.scheduled * 11;
       const isGap = h.gap && s.gap > 0;
       return (
        <g key={h.time}>
         {/* Required bar (background) */}
         <rect x={x} y={120 - recH} width={barW * 2 + 4} height={recH} fill="#F3F2F0" rx="3" />
         {/* Scheduled bar */}
         <rect x={x} y={120 - schH} width={barW * 2 + 4} height={schH} fill={isGap ? "#B45309" : "#881337"} rx="3" opacity="0.9" />
         {/* Gap shading overlay */}
         {isGap && (
          <rect x={x} y={120 - recH} width={barW * 2 + 4} height={recH - schH} fill="#B45309" rx="3" opacity="0.2" />
         )}
         {/* Count label */}
         <text x={x + barW + 2} y={120 - schH - 4} textAnchor="middle" fontSize="10" fontWeight="800" fill={isGap ? "#B45309" : "#881337"}>{h.scheduled}</text>
         {/* Time label */}
         <text x={x + barW + 2} y="134" textAnchor="middle" fontSize="9" fontWeight="700" fill="#A8A29E">{h.time}</text>
        </g>
       );
      })}

      {/* X baseline */}
      <line x1="32" y1="120" x2="552" y2="120" stroke="#E7E5E0" strokeWidth="1.5" />
     </svg>
    </div>

    {/* Gap callout */}
    {s.gap > 0 && (
     <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#B45309]/10 border border-[#B45309]/20 px-3 py-2 text-xs font-bold text-[#92400E]">
      <span className="shrink-0">⚠</span>
      <span>4 PM, 6 PM: {s.gap} role{s.gap > 1 ? "s" : ""} short of recommended coverage, dinner peak risk</span>
     </div>
    )}
   </div>

   <KpiRow items={[
    { label: "Staff Gap Count", value: s.gap > 0 ? `${s.gap} roles` : "0 roles", sub: "Peak block Saturday 4, 8 PM", tone: s.gap > 0 ? "warn" : "good" },
    { label: "Projected Labor %", value: `${s.projectedLaborPct}%`, sub: `${money(s.projectedLaborCost)} total cost`, tone: s.projectedLaborPct > s.targetLaborPct ? "bad" : "neutral" },
    { label: "Target Labor %", value: `${s.targetLaborPct}%`, sub: "Based on projected sales", tone: "neutral" }
   ]} />

   <div className="grid gap-6 lg:grid-cols-12">
    <div className="lg:col-span-6">
     <Card className="h-full">
      <SectionTitle hint="Saturday Peak Distribution">Hourly Staffing Coverage Timeline</SectionTitle>
      <DataTable>
       <THead>
        <Tr>
         <Th>Time</Th>
         <Th>Coverage</Th>
         <Th className="text-right">Staff</Th>
        </Tr>
       </THead>
       <tbody>
        {HOURLY_COVERAGE.map((h) => (
         <Tr key={h.time}>
          <Td className="w-16 font-semibold text-xs text-[#78716C]">{h.time}</Td>
          <Td>
           <div className="h-2 w-full rounded-full bg-[#F3F2F0] overflow-hidden flex">
            <div
             className={`h-full rounded-full transition-all ${
              h.gap && s.gap > 0 ? "bg-[#B45309]" : "bg-[#881337]"
             }`}
             style={{ width: `${(h.scheduled / 10) * 100}%` }}
            />
           </div>
          </Td>
          <Td className="w-24 text-right text-xs tabular-nums font-semibold text-[#1C1917]">
           {h.scheduled} / {h.recommended}
           {h.gap && s.gap > 0 ? <span className="text-[#B91C1C] font-bold ml-1">(-{s.gap})</span> : null}
          </Td>
         </Tr>
        ))}
       </tbody>
      </DataTable>
     </Card>
    </div>

    <div className="lg:col-span-6">
     <Card className="h-full">
      <SectionTitle hint="Shift Opportunities">Saturday Peak Broadcast (4:00 PM – 8:00 PM)</SectionTitle>
      <div className="space-y-3">
       <div className="rounded-lg border border-[#E7E5E0] bg-white p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2">
         <span className="font-bold text-sm text-[#1C1917]">Saturday Peak Shift</span>
         <Pill tone={state.shiftOfferSent ? "teal" : "amber"}>
          {state.shiftOfferSent ? "Broadcast Active" : "Action Required"}
         </Pill>
        </div>
        <p className="text-sm font-medium text-[#78716C]">
         {state.shiftOfferSent
          ? "Broadcast sent to 4 qualified servers. Maya Robinson has expressed interest."
          : "1 shift gap identified for Saturday peak dinner rush. Broadcast opportunity to qualified team members."}
        </p>

        <div className="pt-3 flex flex-col gap-3">
         {!state.shiftOfferSent ? (
          <button
           onClick={() => dispatch({ type: "sendShiftOffer" })}
           className="w-full rounded-lg bg-[#881337] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#6B0F2A] transition-all"
          >
           Broadcast Shift Opportunity
          </button>
         ) : null}

         {state.shiftAccepted && state.extraStaffApproved < 2 ? (
          <button
           onClick={() => dispatch({ type: "approveStaffing" })}
           className="w-full rounded-lg bg-[#881337] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#6B0F2A] transition-all"
          >
           Approve Maya Robinson's Shift
          </button>
         ) : null}

         {state.extraStaffApproved >= 2 ? (
          <div className="text-sm font-bold text-[#15803D] flex items-center gap-2">
           <CheckCircle2 className="size-5 shrink-0" />
           <span>Shift coverage approved & added to 7shifts schedule!</span>
           <span className="text-[#78716C] font-medium text-[10px] ml-auto uppercase tracking-wider">Approved by GM</span>
          </div>
         ) : null}
        </div>
       </div>
      </div>
     </Card>
    </div>
   </div>
  </>
 );
}

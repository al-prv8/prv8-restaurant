"use client";

import { CheckCircle2 } from "lucide-react";
import { Card, Pill, SectionTitle, PriveIntelBanner } from "@/components/prive/ui";
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
    <h1 className="text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">Staffing & Labor Coverage</h1>
    <p className="mt-2 max-w-3xl text-sm font-medium text-[#78716C]">
     Labor forecast against peak transaction volume — recommended vs scheduled staffing levels.
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

   <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
    <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
     <div className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-1">Staff Gap Count</div>
     <div className={`text-3xl font-black tabular-nums ${s.gap > 0 ? "text-[#B45309]" : "text-[#15803D]"}`}>
      {s.gap > 0 ? `${s.gap} roles` : "0 roles"}
     </div>
     <div className="text-sm font-medium text-[#78716C] mt-1">Peak block Saturday 4–8 PM</div>
    </div>
    <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
     <div className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-1">Projected Labor %</div>
     <div className={`text-3xl font-black tabular-nums ${s.projectedLaborPct > s.targetLaborPct ? "text-[#B91C1C]" : "text-[#1C1917]"}`}>
      {s.projectedLaborPct}%
     </div>
     <div className="text-sm font-medium text-[#78716C] mt-1">{money(s.projectedLaborCost)} total cost</div>
    </div>
    <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
     <div className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-1">Target Labor %</div>
     <div className="text-3xl font-black tabular-nums text-[#1C1917]">{s.targetLaborPct}%</div>
     <div className="text-sm font-medium text-[#78716C] mt-1">Based on projected sales</div>
    </div>
   </div>

   <div className="grid gap-6 lg:grid-cols-12">
    <div className="lg:col-span-6">
     <Card className="h-full">
      <SectionTitle hint="Saturday Peak Distribution">Hourly Staffing Coverage Timeline</SectionTitle>
      <div className="space-y-3">
       {HOURLY_COVERAGE.map((h) => (
        <div key={h.time} className="flex items-center justify-between gap-3 text-xs font-semibold">
         <span className="w-12 text-[#78716C]">{h.time}</span>
         <div className="flex-1 h-3 rounded-full bg-[#E7E5E0] overflow-hidden flex">
          <div
           className={`h-full rounded-full transition-all ${
            h.gap && s.gap > 0 ? "bg-[#B45309]" : "bg-[#881337]"
           }`}
           style={{ width: `${(h.scheduled / 10) * 100}%` }}
          />
         </div>
         <span className="w-24 text-right tabular-nums text-[#1C1917]">
          {h.scheduled} / {h.recommended} staff
          {h.gap && s.gap > 0 ? <span className="text-[#B91C1C] font-bold ml-1">(-{s.gap})</span> : null}
         </span>
        </div>
       ))}
      </div>
     </Card>
    </div>

    <div className="lg:col-span-6">
     <Card className="h-full">
      <SectionTitle hint="Shift Opportunities">Saturday Peak Broadcast (4:00 PM – 8:00 PM)</SectionTitle>
      <div className="space-y-3">
       <div className={`rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5 shadow-sm space-y-3 ${!state.shiftOfferSent ? "border-l-4" : ""}`}>
        <div className="flex items-center justify-between gap-2">
         <span className="font-bold text-sm text-[#1C1917]">Saturday Peak Shift (4:00 PM – 8:00 PM)</span>
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
           <CheckCircle2 className="size-5" /> Shift coverage approved & added to 7shifts schedule!
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

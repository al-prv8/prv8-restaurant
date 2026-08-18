"use client";

import { useState } from "react";
import { Card, SectionTitle, Button, Pill, KpiRow, PriveIntelBanner, Pagination } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export default function EmployeeSchedulePage() {
 const { state, derived: d, dispatch } = usePrive();
 const [currentPage, setCurrentPage] = useState(1);
 const pageSize = 4;

 const SHIFTS = [
  { day: "Today", time: "10:00 AM, 4:00 PM", role: "Section 3 · Server", hours: "6.0 hrs", status: "Confirmed", tone: "teal" as const },
  { day: "Friday", time: "11:00 AM, 5:00 PM", role: "Section 1 · Server", hours: "6.0 hrs", status: "Scheduled", tone: "indigo" as const },
  { day: "Sunday", time: "10:00 AM, 4:00 PM", role: "Section 2 · Server", hours: "6.0 hrs", status: "Scheduled", tone: "indigo" as const },
  { day: "Next Tuesday", time: "11:00 AM, 5:00 PM", role: "Section 4 · Server", hours: "6.0 hrs", status: "Scheduled", tone: "indigo" as const },
 ];

 if (state.shiftAccepted && state.extraStaffApproved > 0) {
  SHIFTS.splice(2, 0, {
   day: "Saturday",
   time: "4:00 PM – 8:00 PM",
   role: "Peak Block · Server",
   hours: "4.0 hrs",
   status: "Picked Up",
   tone: "teal" as const,
  });
 }

 const totalPages = Math.ceil(SHIFTS.length / pageSize);
 const paginatedShifts = SHIFTS.slice((currentPage - 1) * pageSize, currentPage * pageSize);

 return (
  <>
   <div className="mb-8 space-y-1">
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337]">Ballantyne #02 · Your Schedule</p>
    <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">Schedule & Open Shifts</h1>
    <p className="text-sm font-medium text-[#78716C]">Your upcoming shifts and open pickup opportunities at Ballantyne #02.</p>
   </div>

   <div className="mb-6 rounded-xl bg-white border border-[#E7E5E0] p-5 text-center shadow-xs">
     <h2 className="text-sm font-bold text-[#78716C] uppercase tracking-wider mb-2">Current Shift · Today</h2>
     <div className="text-4xl sm:text-5xl font-black tracking-tight text-[#1C1917] tabular-nums">
      10:00 AM, 4:00 PM
     </div>
     <p className="mt-2 text-sm font-bold text-[#15803D]">Confirmed · Section 3 · Server</p>
   </div>

   <PriveIntelBanner
    summary={state.shiftAccepted
     ? "You picked up the Saturday 4, 8 PM peak block. Your estimated weekly earnings are $503.75."
     : "There is 1 open shift this week: Saturday 4, 8 PM peak block. Picking it up adds $62.00 to your paycheck."
    }
    details={[
     "Your current confirmed hours this week: 28.5 hrs (target: 32 hrs).",
     "Allergen Awareness training module is due before your next shift.",
    ]}
    action={!state.shiftAccepted ? () => {} : undefined}
    actionLabel={!state.shiftAccepted ? "View Open Shift" : undefined}
   />

   <div className="space-y-6">
    <div className="mb-6">
      <KpiRow items={[
        { label: "Weekly Scheduled", value: state.shiftAccepted ? "32.5 hrs" : "28.5 hrs", sub: state.shiftAccepted ? "+4.0 hrs Saturday" : "Target: 32 hrs" },
        { label: "Estimated Pay", value: state.shiftAccepted ? "$503.75" : "$441.75", sub: state.shiftAccepted ? "+$62.00 earnings boost!" : "Base wage $15.50/hr", tone: "good" },
        { label: "Shift Openings", value: state.shiftAccepted ? "0 Available" : "1 Available", sub: state.shiftAccepted ? "Shift claimed" : "Saturday 4–8 PM peak", tone: state.shiftAccepted ? "good" : "warn" }
      ]} />
    </div>

    <div className="grid gap-6 lg:grid-cols-12">
     <div className="lg:col-span-6 space-y-6">
      <div className="rounded-xl bg-white border border-[#E7E5E0] p-5 h-full shadow-sm">
       <SectionTitle hint="Ballantyne #02 · Peak Demand">Open Shift Pickup Opportunity</SectionTitle>
       <div className="mt-4 mb-2 text-3xl font-black text-[#1C1917] tracking-tight tabular-nums">
         Saturday, 4:00 – 8:00 PM
       </div>

       {/* Live Paycheck Estimator Banner */}
       <div className="my-3 rounded-lg bg-[#F0FDF4] border border-[#15803D]/20 p-3 flex items-center justify-between">
         <div>
           <div className="text-[10px] font-bold uppercase tracking-wider text-[#15803D]">Live Paycheck Estimator</div>
           <div className="text-xs font-bold text-[#1C1917] mt-0.5">4.0 hrs @ $15.50/hr</div>
         </div>
         <div className="text-base font-black text-[#15803D]">+$62.00 Pay Boost</div>
       </div>

       <p className="text-sm text-[#78716C] leading-relaxed font-medium">
        Peak block. Privé forecasts <strong>{d.tomorrow.transactions.toLocaleString()} transactions</strong>{" "}
        tomorrow ({d.tomorrow.vsTypicalPct > 0 ? "+" : ""}
        {d.tomorrow.vsTypicalPct}% vs typical) and your manager is short {Math.max(d.staffing.gap, 1)} team member(s).
       </p>
       <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
        <Button onClick={() => dispatch({ type: "acceptShift" })} disabled={state.shiftAccepted} className="w-full sm:w-auto bg-[#B45309] text-white hover:bg-[#B45309]/90 border-none font-bold">
         {state.shiftAccepted ? "Interest Submitted" : "I'm Interested in this Shift"}
        </Button>
        {state.shiftAccepted ? (
         <Pill tone={state.extraStaffApproved > 0 ? "teal" : "amber"}>
          {state.extraStaffApproved > 0 ? "Approved by GM" : "Waiting on GM approval"}
         </Pill>
        ) : (
         <span className="text-xs font-bold text-[#78716C]">Approx. 4.0 hrs · $15.50/hr</span>
        )}
       </div>
      </div>
     </div>

     <div className="lg:col-span-6 space-y-6">
      <div className="rounded-xl bg-white border border-[#E7E5E0] p-5 h-full shadow-sm">
       <SectionTitle hint={`${SHIFTS.length} Shifts`}>Scheduled Shifts</SectionTitle>
       <div className="mt-4">
        {paginatedShifts.map((s) => (
         <div key={s.day} className="flex items-center justify-between border-b border-[#F3F2F0] py-3 last:border-0">
          <div>
           <div className="font-black text-base text-[#1C1917]">{s.day} · {s.time}</div>
           <div className="text-xs font-bold text-[#A8A29E] mt-1">{s.role} · {s.hours}</div>
          </div>
          <Pill tone={s.tone}>{s.status}</Pill>
         </div>
        ))}
       </div>

       <div className="mt-4">
        <Pagination
         currentPage={currentPage}
         totalPages={totalPages}
         onPageChange={setCurrentPage}
         totalItems={SHIFTS.length}
         pageSize={pageSize}
        />
       </div>
      </div>
     </div>
    </div>
   </div>
  </>
 );
}

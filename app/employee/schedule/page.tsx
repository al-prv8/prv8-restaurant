"use client";

import { useState } from "react";
import { Card, SectionTitle, Button, Pill, Metric, PriveIntelBanner, Pagination } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export default function EmployeeSchedulePage() {
 const { state, derived: d, dispatch } = usePrive();
 const [currentPage, setCurrentPage] = useState(1);
 const pageSize = 4;

 const SHIFTS = [
  { day: "Today", time: "10:00 AM – 4:00 PM", role: "Section 3 · Server", hours: "6.0 hrs", status: "Confirmed", tone: "teal" as const },
  { day: "Friday", time: "11:00 AM – 5:00 PM", role: "Section 1 · Server", hours: "6.0 hrs", status: "Scheduled", tone: "indigo" as const },
  { day: "Sunday", time: "10:00 AM – 4:00 PM", role: "Section 2 · Server", hours: "6.0 hrs", status: "Scheduled", tone: "indigo" as const },
  { day: "Next Tuesday", time: "11:00 AM – 5:00 PM", role: "Section 4 · Server", hours: "6.0 hrs", status: "Scheduled", tone: "indigo" as const },
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

   <div className="mb-8 rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-6 text-center">
     <h2 className="text-sm font-bold text-[#78716C] uppercase tracking-wider mb-2">Current Shift · Today</h2>
     <div className="text-4xl sm:text-5xl font-black tracking-tight text-[#1C1917] tabular-nums">
      10:00 AM – 4:00 PM
     </div>
     <p className="mt-2 text-sm font-bold text-[#15803D]">Confirmed · Section 3 · Server</p>
   </div>

   <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-3">
     <Metric label="Weekly Scheduled" value="28.5 hrs" sub="Target: 32 hrs" />
     <Metric label="Estimated Pay" value="$441.75" sub="Base wage $15.50/hr" tone="good" />
     <Metric label="Shift Openings" value="1 Available" sub="Saturday 4–8 PM peak" tone="warn" />
    </div>

    <div className="grid gap-6 lg:grid-cols-12">
     <div className="lg:col-span-6 space-y-6">
      <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5 h-full">
       <SectionTitle hint="Ballantyne #02 · Peak Demand">Open Shift Pickup Opportunity</SectionTitle>
       <div className="mt-4 mb-4 text-3xl font-black text-[#1C1917] tracking-tight tabular-nums">
         Saturday, 4:00 – 8:00 PM
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
      <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5 h-full">
       <SectionTitle hint={`${SHIFTS.length} Shifts`}>Scheduled Shifts</SectionTitle>
       <div className="mt-4 space-y-3">
        {paginatedShifts.map((s) => (
         <div key={s.day} className="flex items-center justify-between rounded-2xl bg-white/40 backdrop-blur-sm shadow-sm ring-1 ring-black/[0.04] p-4 text-sm shadow-sm transition-colors">
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

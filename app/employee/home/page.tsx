"use client";

import { Card, SectionTitle, Metric } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export default function EmployeeHomePage() {
 const { state } = usePrive();

 return (
  <>
   <div className="mb-8 space-y-1">
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337]">Ballantyne #02 · Today's Shift</p>
    <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">Good morning, Maya.</h1>
    <p className="text-sm font-medium text-[#78716C]">Here's your shift overview and key tasks for the day.</p>
   </div>

   <div className="grid gap-6 lg:grid-cols-12">
    <div className="lg:col-span-8 space-y-6">
     <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-8 flex flex-col items-center justify-center text-center">
      <h2 className="text-sm font-bold text-[#78716C] uppercase tracking-wider mb-2">Your Shift Today</h2>
      <div className="text-4xl sm:text-5xl font-black tracking-tight text-[#1C1917] tabular-nums">
       10:00 AM – 4:00 PM
      </div>
      <p className="mt-3 text-sm font-medium text-[#78716C]">Section 3 · Server · 6.0 hrs</p>
     </div>

     <div className="grid gap-4 sm:grid-cols-2">
       <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5 flex flex-col justify-between">
        <span className="text-sm font-bold text-[#78716C]">Hours This Week</span>
        <span className="text-3xl font-black tabular-nums text-[#1C1917] mt-2">28.5 <span className="text-sm text-[#A8A29E]">hrs</span></span>
       </div>
       <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5 flex flex-col justify-between">
        <span className="text-sm font-bold text-[#78716C]">Training Due</span>
        <span className="text-3xl font-black tabular-nums text-[#B45309] mt-2">1 <span className="text-sm text-[#A8A29E]">module</span></span>
       </div>
     </div>
    </div>

    <div className="lg:col-span-4 space-y-6">
      <div className="rounded-2xl bg-white/40 backdrop-blur-md shadow-md ring-1 ring-black/[0.04] p-5">
       <h3 className="text-sm font-bold text-[#1C1917] mb-3">Quick Actions</h3>
       <div className="space-y-2">
         <button className="w-full text-left px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm shadow-sm text-sm font-medium text-[#1C1917] hover:bg-white/80 transition-colors">View Full Schedule</button>
         <button className="w-full text-left px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm shadow-sm text-sm font-medium text-[#1C1917] hover:bg-white/80 transition-colors">Start Training Module</button>
       </div>
      </div>
    </div>
   </div>
  </>
 );
}

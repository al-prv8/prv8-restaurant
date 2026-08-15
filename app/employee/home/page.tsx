"use client";

import { useState, useEffect } from "react";
import { Clock, Calendar, CheckCircle2, Award, Flame, Utensils, ChevronRight } from "lucide-react";
import { Card, SectionTitle, Pill, Button } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";
import Link from "next/link";

export default function EmployeeHomePage() {
 const { state, derived: d, dispatch } = usePrive();
 const [clockedIn, setClockedIn] = useState(false);
 const [onBreak, setOnBreak] = useState(false);
 const [elapsedSeconds, setElapsedSeconds] = useState(0);

 useEffect(() => {
  if (!clockedIn) return;
  const interval = setInterval(() => {
   setElapsedSeconds((prev) => prev + 1);
  }, 1000);
  return () => clearInterval(interval);
 }, [clockedIn]);

 const formatTimer = (totalSec: number) => {
  const hrs = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
 };

 return (
  <>
   {/* Page Header */}
   <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
    <div>
     <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337] mb-1">
      Ballantyne #02 · Employee Portal
     </p>
     <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">
      Good morning, Maya.
     </h1>
     <p className="mt-1 text-sm font-medium text-[#78716C]">
      Here's your shift schedule, team roster, and kitchen notes for today.
     </p>
    </div>

    <div className="flex items-center gap-3">
     <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] px-4 py-2 flex items-center gap-2 text-xs font-bold text-[#15803D]">
      <Flame className="size-4 text-[#15803D]" /> 12-Day Attendance Streak
     </div>
    </div>
   </div>

   <div className="grid gap-6 lg:grid-cols-12">
    {/* Main Left Column */}
    <div className="lg:col-span-8 space-y-6">
     {/* Shift Hero & Clock-In HUD */}
     <div className="rounded-2xl bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] ring-1 ring-black/[0.03] p-6 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none" />

      <div className="flex items-center justify-between border-b border-[#E7E5E0] pb-3 mb-4">
       <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Today's Shift · Section 3 Server</span>
       <Pill tone={clockedIn ? (onBreak ? "amber" : "teal") : "neutral"}>
        {clockedIn ? (onBreak ? "On Meal Break" : "Shift Active") : "Not Clocked In"}
       </Pill>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 my-2">
       <div>
        <div className="text-4xl sm:text-5xl font-black tracking-tight text-[#1C1917] tabular-nums">
         10:00 AM – 4:00 PM
        </div>
        <div className="text-sm font-medium text-[#78716C] mt-2">
         6.0 Hours Scheduled · Base Wage $15.50/hr + Tips
        </div>
       </div>

       {clockedIn ? (
        <div className="text-center sm:text-right bg-[#15803D]/10 p-4 rounded-2xl border border-[#15803D]/20">
         <div className="text-[10px] font-bold uppercase tracking-wider text-[#15803D]">Shift Timer</div>
         <div className="text-3xl font-black tabular-nums text-[#15803D] my-1">{formatTimer(elapsedSeconds)}</div>
         <div className="text-[11px] font-semibold text-[#15803D]">Shift Active</div>
        </div>
       ) : null}
      </div>

      <div className="mt-6 pt-4 border-t border-[#E7E5E0] flex flex-wrap gap-3">
       {!clockedIn ? (
        <button
         onClick={() => setClockedIn(true)}
         className="flex-1 rounded-xl bg-[#881337] px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-[#6B0F2A] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
         <Clock className="size-4" /> Clock In to Shift (10:00 AM)
        </button>
       ) : (
        <>
         <button
          onClick={() => setOnBreak(!onBreak)}
          className={`flex-1 rounded-xl px-5 py-3 text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 ${
           onBreak ? "bg-[#15803D] text-white" : "bg-[#B45309] text-white hover:bg-[#92400E]"
          }`}
         >
          {onBreak ? "End Break & Resume Shift" : "Start 30-Min Meal Break"}
         </button>
         <button
          onClick={() => {
           setClockedIn(false);
           setOnBreak(false);
           setElapsedSeconds(0);
          }}
          className="rounded-xl bg-white/80 border border-white/80 px-5 py-3 text-sm font-bold text-[#1C1917] hover:bg-white transition-all"
         >
          Clock Out
         </button>
        </>
       )}
      </div>
     </div>

     {/* Weekly Hours & Earnings Metrics */}
     <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
       <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Hours Scheduled This Week</span>
       <div className="text-3xl font-black tabular-nums text-[#1C1917] mt-2">
        {state.shiftAccepted ? "32.5 hrs" : "28.5 hrs"}
       </div>
       <div className="w-full bg-[#E7E5E0] h-2 rounded-full mt-3 overflow-hidden">
        <div className="bg-[#881337] h-full" style={{ width: state.shiftAccepted ? "88%" : "72%" }} />
       </div>
       <div className="text-xs font-medium text-[#78716C] mt-2">Target: 32.0 hrs</div>
      </div>

      <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
       <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Estimated Paycheck</span>
       <div className="text-3xl font-black tabular-nums text-[#15803D] mt-2">
        {state.shiftAccepted ? "$503.75" : "$441.75"}
       </div>
       <div className="w-full bg-[#15803D]/20 h-2 rounded-full mt-3 overflow-hidden">
        <div className="bg-[#15803D] h-full" style={{ width: state.shiftAccepted ? "95%" : "80%" }} />
       </div>
       <div className="text-xs font-medium text-[#78716C] mt-2">Includes base wage + tip credit</div>
      </div>
     </div>

     {/* Shift Roster Lineup */}
     <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
      <SectionTitle hint="On Duty Today">Your Shift Lineup (Ballantyne #02)</SectionTitle>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
       <div className="rounded-xl bg-white/50 border border-white/80 p-4">
        <div className="text-xs font-bold text-[#A8A29E] uppercase tracking-wider">Line Cook / BOH</div>
        <div className="text-sm font-black text-[#1C1917] mt-1">Andre Vega</div>
        <div className="text-xs font-medium text-[#15803D] mt-1">✓ On Duty</div>
       </div>

       <div className="rounded-xl bg-white/50 border border-white/80 p-4">
        <div className="text-xs font-bold text-[#A8A29E] uppercase tracking-wider">Section 1 Server</div>
        <div className="text-sm font-black text-[#1C1917] mt-1">Sarah Jenkins</div>
        <div className="text-xs font-medium text-[#15803D] mt-1">✓ On Duty</div>
       </div>

       <div className="rounded-xl bg-white/50 border border-white/80 p-4">
        <div className="text-xs font-bold text-[#A8A29E] uppercase tracking-wider">Section 2 Server</div>
        <div className="text-sm font-black text-[#1C1917] mt-1">Marcus Chen</div>
        <div className="text-xs font-medium text-[#15803D] mt-1">✓ On Duty</div>
       </div>
      </div>
     </div>
    </div>

    {/* Right Sidebar Column */}
    <div className="lg:col-span-4 space-y-6">
     {/* Kitchen Daily Focus Notes */}
     <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-md ring-1 ring-black/[0.04] p-5 space-y-4">
      <SectionTitle hint="Shift Notes">Kitchen Focus & Specials</SectionTitle>

      <div className="rounded-xl bg-[#881337]/5 border border-[#881337]/15 p-4 space-y-2">
       <div className="text-xs font-bold text-[#881337] uppercase tracking-wider flex items-center gap-1.5">
        <Utensils className="size-3.5" /> Featured Daily Special
       </div>
       <div className="text-sm font-black text-[#1C1917]">Carolina Peach French Toast ($16.50)</div>
       <p className="text-xs text-[#78716C] font-medium leading-relaxed">
        Fresh Palmetto peaches, brioche, bourbon maple glaze. Recommend pairing with Mimosa flight.
       </p>
      </div>

      <div className="rounded-xl bg-[#B45309]/10 border border-[#B45309]/20 p-4 space-y-2">
       <div className="text-xs font-bold text-[#92400E] uppercase tracking-wider flex items-center gap-1.5">
        <span>⚠️</span> Allergen Safety Protocol
       </div>
       <p className="text-xs text-[#92400E] font-medium leading-relaxed">
        Section 3 tables: Gluten-free fryer is reserved. Always confirm purple cookware tag with Andre.
       </p>
      </div>
     </div>

     {/* Quick Actions Navigation */}
     <div className="rounded-2xl bg-white/40 backdrop-blur-md shadow-md ring-1 ring-black/[0.04] p-5 space-y-3">
      <SectionTitle>Employee Quick Links</SectionTitle>
      
      <Link href="/employee/schedule" className="flex items-center justify-between p-3 rounded-xl bg-white/60 hover:bg-white/90 transition-all font-bold text-xs text-[#1C1917] group">
       <span>Schedule & Open Shift Pickup</span>
       <ChevronRight className="size-4 text-[#A8A29E] group-hover:text-[#881337]" />
      </Link>

      <Link href="/employee/training" className="flex items-center justify-between p-3 rounded-xl bg-white/60 hover:bg-white/90 transition-all font-bold text-xs text-[#1C1917] group">
       <span>Training Modules & ServSafe Watch</span>
       <ChevronRight className="size-4 text-[#A8A29E] group-hover:text-[#881337]" />
      </Link>

      <Link href="/employee/announcements" className="flex items-center justify-between p-3 rounded-xl bg-white/60 hover:bg-white/90 transition-all font-bold text-xs text-[#1C1917] group">
       <span>Corporate SOP & Policy Q&A</span>
       <ChevronRight className="size-4 text-[#A8A29E] group-hover:text-[#881337]" />
      </Link>
     </div>
    </div>
   </div>
  </>
 );
}

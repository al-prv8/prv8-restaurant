"use client";

import { Card, Pill, SectionTitle, Meter, PriveIntelBanner } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export default function GmFacilityPage() {
  const { derived: d } = usePrive();

  const openTasks = d.facility.tasks.filter(t => t.state !== "ok").length;
  const overdueTasks = d.facility.tasks.filter(t => t.state === "overdue").length;
  const completedTasks = d.facility.tasks.filter(t => t.state === "ok").length;

  return (
    <>
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#881337] mb-1.5">Operations & Maintenance</p>
        <h1 className="text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">Facility Readiness</h1>
        <p className="mt-2 max-w-3xl text-sm font-medium text-[#78716C]">
          Readiness scores and outstanding cleaning or maintenance tasks for Ballantyne #02.
        </p>
      </div>

      <PriveIntelBanner
        summary={`Facility readiness score is ${d.facility.score}%. Kitchen (${d.facility.detail.kitchen}%), Restrooms (${d.facility.detail.restrooms}%).`}
        details={[
          "Overdue Task: Hood & vent cleaning (overdue by 2 days).",
          "Overdue Task: Mid-day restroom check (missed 11:00 AM slot).",
          "Health inspection audit risk currently low (92% pass probability).",
        ]}
      />

      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-1">Open Tasks</div>
          <div className="text-3xl font-black tabular-nums text-[#1C1917]">{openTasks}</div>
          <div className="text-sm font-medium text-[#78716C] mt-1">Pending completion</div>
        </div>
        <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-1">Overdue</div>
          <div className={`text-3xl font-black tabular-nums ${overdueTasks > 0 ? "text-[#B91C1C]" : "text-[#15803D]"}`}>
            {overdueTasks}
          </div>
          <div className="text-sm font-medium text-[#78716C] mt-1">Requires immediate action</div>
        </div>
        <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-1">Completed Today</div>
          <div className="text-3xl font-black tabular-nums text-[#15803D]">{completedTasks}</div>
          <div className="text-sm font-medium text-[#78716C] mt-1">Logged in system</div>
        </div>
      </div>

      {/* 5-Zone Interactive Facility Radar Heatmap */}
      <div className="mb-8 rounded-2xl bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] ring-1 ring-black/[0.03] p-6 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none" />
        
        <div className="flex items-center justify-between border-b border-[#E7E5E0] pb-4 mb-6">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337] flex items-center gap-1.5 mb-1">
              <span className="size-2 rounded-full bg-[#15803D] animate-ping" /> Live Facility Telemetry
            </div>
            <h3 className="text-xl font-black tracking-tight text-[#1C1917]">5-Zone Facility Heatmap</h3>
          </div>
          <Pill tone="teal">Radar Sweep Active</Pill>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 p-4 shadow-sm flex flex-col justify-between hover:bg-white/80 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Kitchen Line</span>
              <span className="size-2 rounded-full bg-[#15803D]" />
            </div>
            <div className="text-3xl font-black tabular-nums text-[#15803D] my-2">{d.facility.detail.kitchen}%</div>
            <div className="w-full bg-[#15803D]/20 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#15803D] h-full" style={{ width: `${d.facility.detail.kitchen}%` }} />
            </div>
            <div className="text-[10px] font-semibold text-[#78716C] mt-2">Zone 1 · Optimal</div>
          </div>

          <div className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 p-4 shadow-sm flex flex-col justify-between hover:bg-white/80 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Dining Room</span>
              <span className="size-2 rounded-full bg-[#15803D]" />
            </div>
            <div className="text-3xl font-black tabular-nums text-[#15803D] my-2">{d.facility.detail.dining}%</div>
            <div className="w-full bg-[#15803D]/20 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#15803D] h-full" style={{ width: `${d.facility.detail.dining}%` }} />
            </div>
            <div className="text-[10px] font-semibold text-[#78716C] mt-2">Zone 2 · Optimal</div>
          </div>

          <div className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 p-4 shadow-sm flex flex-col justify-between hover:bg-white/80 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Back of House</span>
              <span className="size-2 rounded-full bg-[#15803D]" />
            </div>
            <div className="text-3xl font-black tabular-nums text-[#15803D] my-2">{d.facility.detail.boh}%</div>
            <div className="w-full bg-[#15803D]/20 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#15803D] h-full" style={{ width: `${d.facility.detail.boh}%` }} />
            </div>
            <div className="text-[10px] font-semibold text-[#78716C] mt-2">Zone 3 · Optimal</div>
          </div>

          <div className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 p-4 shadow-sm flex flex-col justify-between hover:bg-white/80 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Restrooms</span>
              <span className="size-2 rounded-full bg-[#B45309] animate-pulse" />
            </div>
            <div className="text-3xl font-black tabular-nums text-[#B45309] my-2">{d.facility.detail.restrooms}%</div>
            <div className="w-full bg-[#B45309]/20 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#B45309] h-full" style={{ width: `${d.facility.detail.restrooms}%` }} />
            </div>
            <div className="text-[10px] font-semibold text-[#B45309] mt-2">Zone 4 · Check Due</div>
          </div>

          <div className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 p-4 shadow-sm flex flex-col justify-between hover:bg-white/80 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Exterior / Patio</span>
              <span className="size-2 rounded-full bg-[#15803D]" />
            </div>
            <div className="text-3xl font-black tabular-nums text-[#15803D] my-2">{d.facility.detail.exterior}%</div>
            <div className="w-full bg-[#15803D]/20 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#15803D] h-full" style={{ width: `${d.facility.detail.exterior}%` }} />
            </div>
            <div className="text-[10px] font-semibold text-[#78716C] mt-2">Zone 5 · Optimal</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-6 space-y-6">
          <Card>
            <SectionTitle hint={`${d.facility.score}% overall`}>Area Readiness Scores</SectionTitle>
            <Meter value={d.facility.score} tone={d.facility.score >= 90 ? "teal" : "amber"} />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {Object.entries(d.facility.detail).map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between rounded-xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] px-4 py-3"
                >
                  <span className="text-sm font-bold capitalize text-[#1C1917]">{k}</span>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-16 overflow-hidden rounded-full bg-[#E7E5E0]">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${v}%`, background: v >= 90 ? "#15803D" : "#F59E0B" }}
                      />
                    </div>
                    <span className="w-10 text-right text-sm font-black text-[#1C1917] tabular-nums">{v}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <Card>
            <SectionTitle hint={`${d.facility.tasks.length} items`}>Cleaning & Maintenance Schedule</SectionTitle>
            <div className="space-y-3">
              {d.facility.tasks.map((t) => (
                <div
                  key={t.label}
                  className={`flex items-center justify-between gap-2 rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-4 shadow-sm ${
                    t.state === "overdue" ? "" : 
                    t.state === "due" ? "" : 
                    ""
                  }`}
                >
                  <span className="font-bold text-sm text-[#1C1917]">{t.label}</span>
                  <Pill tone={t.state === "overdue" ? "red" : t.state === "due" ? "amber" : "neutral"}>
                    {t.due}
                  </Pill>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

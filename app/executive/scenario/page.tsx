"use client";

import { Sliders, Zap } from "lucide-react";
import { Card, SectionTitle, ConfidenceTag, KpiRow, PriveIntelBanner } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";
import { money, moneyShort } from "@/lib/prive/forecast";

export default function ExecutiveScenarioPage() {
 const { state, derived: d, dispatch } = usePrive();
 const s = d.scenario;

 const PRESETS = [
  { label: "Baseline Ops (0%)", uplift: 0, desc: "Standard operating forecast" },
  { label: "Summer LTO Surge (+15%)", uplift: 15, desc: "High promotional traffic" },
  { label: "Peak Holiday Rush (+25%)", uplift: 25, desc: "Max volume stress test" },
  { label: "Weather Shift (-10%)", uplift: -10, desc: "Rainy weekend slowdown" },
 ];

 return (
  <>
   <div className="mb-8">
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337] mb-2">Enterprise · What-If Engine</p>
    <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">What-If Scenario Engine</h1>
    <p className="mt-2 max-w-3xl text-sm font-medium text-[#78716C]">
     Model portfolio-wide traffic shifts in real time. Privé recalculates revenue, labor hours, inventory exposure, and service risk dynamically.
    </p>
   </div>

   <PriveIntelBanner
    summary={state.scenarioUplift === 0
     ? "Baseline operations active. Adjust the scenario slider to model traffic surges, slowdowns, or promotional events across all 12 locations."
     : state.scenarioUplift > 0
     ? `A ${state.scenarioUplift}% traffic increase requires ${d.scenario.extraStaffNeeded} additional team members and ${d.scenario.laborHoursDelta} extra labor hours across 12 locations.`
     : `A ${Math.abs(state.scenarioUplift)}% traffic contraction frees ${Math.abs(d.scenario.laborHoursDelta)} labor hours and reduces service risk to ${d.scenario.serviceRiskPct}%.`
    }
    details={[
     "All projections are recalculated in real time from the trailing 90-day operational data series.",
     "Human approval is required before any scenario triggers a staffing change or inventory pre-order.",
     `Current confidence level: ${d.scenario.confidence}. Revenue model uncertainty window: ± 3.2%.`,
    ]}
   />

   <div className="grid gap-6 lg:grid-cols-12">
    <div className="space-y-6 lg:col-span-12">
     {/* Preset Stress Test Quick Selectors */}
     <div className="mb-6">
      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#A8A29E] flex items-center gap-1.5 mb-3">
       <Zap className="size-3.5 text-[#881337]" /> Quick Scenario Presets
      </span>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
       {PRESETS.map((p) => (
        <button
         key={p.label}
         type="button"
         onClick={() => dispatch({ type: "scenario", uplift: p.uplift })}
         className={`flex flex-col items-center justify-center rounded-xl p-4 text-center transition-all duration-200 ${
          state.scenarioUplift === p.uplift
           ? "bg-[#881337] text-white border-[#881337] shadow-md scale-[1.02]"
           : "bg-white border border-[#E7E5E0] text-[#1C1917] shadow-sm hover:bg-[#F7F5F2]"
         }`}
        >
         <span className="text-sm font-black mb-1">{p.label}</span>
         <span className={`text-[11px] font-medium ${state.scenarioUplift === p.uplift ? "text-white/80" : "text-[#78716C]"}`}>{p.desc}</span>
        </button>
       ))}
      </div>
     </div>

     <Card tone="intel">
      <SectionTitle hint="Recalculated live from historical 90-day series">Scenario Uplift Simulation</SectionTitle>
      
      <div className="rounded-xl bg-[#F7F5F2] border border-[#F3F2F0] p-8 space-y-8 mt-4 text-center relative overflow-hidden">
       <div className="flex flex-col items-center gap-2 relative z-10">
        <label className="text-xs font-bold uppercase tracking-widest text-[#78716C] flex items-center gap-2">
         <Sliders className="size-4 text-[#881337]" /> Simulated Weekend Traffic Adjustment
        </label>
        <div className="text-6xl md:text-7xl font-black tabular-nums tracking-tighter text-[#1C1917] my-2">
         {state.scenarioUplift === 0 ? "0%" : `${state.scenarioUplift > 0 ? "+" : ""}${state.scenarioUplift}%`}
        </div>
        <div className="text-sm font-bold text-[#881337]">
         {state.scenarioUplift === 0 ? "Baseline Operations" : state.scenarioUplift > 0 ? "Traffic Surge Simulation" : "Traffic Contraction Simulation"}
        </div>
       </div>
       
       <div className="max-w-2xl mx-auto relative z-10">
        <input
         type="range"
         min={-20}
         max={40}
         step={1}
         value={state.scenarioUplift}
         onChange={(ev) => dispatch({ type: "scenario", uplift: Number(ev.target.value) })}
         className="w-full accent-[#881337] h-2.5 bg-[#E7E5E0] rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-[#78716C] font-bold uppercase tracking-wider mt-4">
         <span>−20%</span>
         <span>Baseline (0%)</span>
         <span>+15% Target</span>
         <span>+40% Max</span>
        </div>
       </div>
      </div>

      <div className="mt-8">
       <KpiRow items={[
         { label: "Revenue Impact", value: money(s.revenueDelta), sub: `Total: ${moneyShort(s.revenueTotal)}`, tone: s.revenueDelta >= 0 ? "good" : "bad" },
         { label: "Extra Transactions", value: `+${s.transactionDelta.toLocaleString()}`, sub: "Across 12 locations", tone: "neutral" },
         { label: "Labor Required", value: `${s.laborHoursDelta > 0 ? "+" : ""}${s.laborHoursDelta} hrs`, sub: `${s.extraStaffNeeded} extra team members`, tone: s.laborHoursDelta > 0 ? "warn" : "good" },
         { label: "Service Risk", value: `${s.serviceRiskPct}%`, sub: "Service breach probability", tone: s.serviceRiskPct > 50 ? "bad" : "warn" }
       ]} />
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between border-t border-[#E7E5E0] pt-4">
       <div className="flex items-center gap-3">
         <div className="text-[10px] font-bold uppercase tracking-widest text-[#A8A29E]">Confidence Level</div>
         <ConfidenceTag level={s.confidence} />
       </div>
       <div className="text-[10px] font-semibold uppercase tracking-widest text-[#A8A29E] mt-3 sm:mt-0 flex items-center gap-1.5">
        <Zap className="size-3" /> Live Model Recalculation Active
       </div>
      </div>
     </Card>
    </div>
   </div>
  </>
 );
}

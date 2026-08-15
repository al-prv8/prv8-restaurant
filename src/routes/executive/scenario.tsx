import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Sliders, Zap } from "lucide-react";
import { Card, SectionTitle, Metric, ConfidenceTag, Button } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";
import { money, moneyShort } from "@/lib/prive/forecast";

export const Route = createFileRoute("/executive/scenario")({
  head: () => ({ meta: [{ title: "What-If Scenario Engine — Executive · Privé" }] }),
  component: ExecutiveScenarioPage,
});

function ExecutiveScenarioPage() {
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">What-If Scenario Engine</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#101828]/60">
          Model portfolio-wide traffic shifts in real time. Privé recalculates revenue, labor hours, inventory exposure, and service risk dynamically.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-12">
          {/* Preset Stress Test Quick Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#101828]/50 flex items-center gap-1.5 mr-1">
              <Zap className="size-3.5 text-[#7C3AED]" /> Quick Scenario Presets:
            </span>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => dispatch({ type: "scenario", uplift: p.uplift })}
                className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-all shadow-xs ${
                  state.scenarioUplift === p.uplift
                    ? "border-[#7C3AED] bg-[#7C3AED] text-white shadow-[#7C3AED]/25"
                    : "border-[#101828]/12 bg-white text-[#101828]/70 hover:bg-[#101828]/5 hover:text-[#101828]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <Card tone="intel">
            <SectionTitle hint="Recalculated live from historical 90-day series">Scenario Uplift Simulation</SectionTitle>
            
            <div className="rounded-xl border border-[#7C3AED]/20 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between gap-4">
                <label className="text-base font-bold text-[#101828] flex items-center gap-2">
                  <Sliders className="size-4 text-[#7C3AED]" /> Simulated Weekend Traffic Adjustment
                </label>
                <span className="rounded-full bg-[#7C3AED]/10 px-3.5 py-1 text-sm font-bold text-[#7C3AED] tabular-nums border border-[#7C3AED]/20">
                  {state.scenarioUplift === 0 ? "Baseline (0%)" : `${state.scenarioUplift > 0 ? "+" : ""}${state.scenarioUplift}%`}
                </span>
              </div>
              
              <input
                type="range"
                min={-20}
                max={40}
                step={1}
                value={state.scenarioUplift}
                onChange={(ev) => dispatch({ type: "scenario", uplift: Number(ev.target.value) })}
                className="w-full accent-[#7C3AED] cursor-pointer"
              />
              <div className="flex justify-between text-xs text-[#101828]/50 font-semibold">
                <span>−20% (Contraction)</span>
                <span>Baseline (0%)</span>
                <span>+15% (LTO Target)</span>
                <span>+40% (Max Peak)</span>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Metric label="Revenue Impact" value={money(s.revenueDelta)} sub={`Total revenue ${moneyShort(s.revenueTotal)}`} tone={s.revenueDelta >= 0 ? "good" : "bad"} />
              <Metric label="Extra Transactions" value={s.transactionDelta.toLocaleString()} sub="Across 12 locations" />
              <Metric label="Labor Hours Required" value={`${s.laborHoursDelta > 0 ? "+" : ""}${s.laborHoursDelta} hrs`} sub={`${s.extraStaffNeeded} extra team members needed`} tone={s.laborHoursDelta > 0 ? "warn" : "good"} />
              <Metric label="Inventory Exposure" value={`${s.inventoryExposureSkus} SKUs`} sub="Projected short of demand" tone={s.inventoryExposureSkus ? "warn" : "good"} />
              <Metric label="Service Breach Risk" value={`${s.serviceRiskPct}%`} sub="Service-time threshold probability" tone={s.serviceRiskPct > 50 ? "bad" : "warn"} />
              <div className="flex flex-col justify-between rounded-xl border border-[#101828]/8 bg-white p-4 shadow-sm">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#101828]/45">Confidence Level</div>
                <div className="mt-2">
                  <ConfidenceTag level={s.confidence} />
                </div>
                <div className="mt-1 text-[11px] text-[#101828]/50">Based on 6-week moving avg</div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[#101828]/8 pt-3 text-xs text-[#101828]/45">
              <span>Sources: Toast POS · Restaurant365 · Paycor · Privé Scenario Engine</span>
              <span className="font-semibold text-[#7C3AED]">✦ Live Model Recalculation</span>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

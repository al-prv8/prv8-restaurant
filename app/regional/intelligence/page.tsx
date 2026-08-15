"use client";

import { Card, SectionTitle, Metric, Meter, PriveIntelBanner } from "@/components/prive/ui";
import { AskPriveConsole } from "@/components/prive/AskPrive";
import { usePrive } from "@/lib/prive/store";
import { TROUBLED_RESTAURANT_ID } from "@/lib/prive/data";

export default function RegionalIntelligencePage() {
 const { derived: d } = usePrive();
 const troubled = d.health.find((h) => h.restaurant.id === TROUBLED_RESTAURANT_ID);

 return (
  <>
   <div className="mb-8">
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337] mb-2">Carolinas Region · AI Intelligence</p>
    <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">Regional Intelligence Console</h1>
    <p className="mt-2 max-w-3xl text-sm font-medium text-[#78716C]">
     Query Privé about cross-store operational patterns, labor drift, and guest complaint correlations across all 12 Carolinas locations.
    </p>
   </div>

   <div className="mb-6 rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-0 overflow-hidden">
     <PriveIntelBanner
     summary={`Charlotte #03 score flagged at ${troubled?.score ?? 58}% — 6 consecutive weeks of margin erosion.`}
     details={[
      "Primary Root Cause: Staffing turnover rose first (+14.2%), complaints followed 2 weeks later.",
      "Recommended Action: GM performance review + targeted retention bonus before summer LTO launch.",
     ]}
    />
   </div>

   <div className="space-y-6">
    {troubled ? (
     <Card tone="alert" className="border-l-4">
      <SectionTitle hint={`Health ${troubled.score}`}>Priority Store Breakdown — {troubled.restaurant.name}</SectionTitle>
      <Meter value={troubled.score} tone={troubled.score >= 85 ? "teal" : troubled.score >= 74 ? "amber" : "red"} />
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
       <Metric label="Turnover Delta" value={`${troubled.restaurant.turnoverDelta > 0 ? "+" : ""}${troubled.restaurant.turnoverDelta}%`} sub="vs region avg" tone={troubled.restaurant.turnoverDelta > 5 ? "bad" : "neutral"} />
       <Metric label="Complaints Delta" value={`${troubled.restaurant.complaintDelta > 0 ? "+" : ""}${troubled.restaurant.complaintDelta}%`} sub="vs region avg" tone={troubled.restaurant.complaintDelta > 10 ? "bad" : "neutral"} />
       <Metric label="Labor Cost Variance" value={`${troubled.restaurant.laborDelta > 0 ? "+" : ""}${troubled.restaurant.laborDelta} pts`} sub="vs labor target" tone={troubled.restaurant.laborDelta > 1 ? "warn" : "neutral"} />
       <Metric label="Training Completion" value={`${troubled.restaurant.trainingDelta}%`} sub="completion delta" tone={troubled.restaurant.trainingDelta < 0 ? "warn" : "good"} />
      </div>
      <div className="mt-6 rounded-2xl bg-white/40 backdrop-blur-sm shadow-sm ring-1 ring-black/[0.04] p-5 text-sm font-medium text-white leading-relaxed">
       <div className="text-[10px] font-bold uppercase tracking-wider text-[#A8A29E] mb-2">✦ Privé Pattern Match Insight</div>
       <p>
        Sales have declined six consecutive weeks at Charlotte #03. The deterioration correlates with staffing instability: turnover rose first, guest complaints surged 2 weeks later, and labor drifted +1.4 pts above target as remaining staff logged overtime. Privé recommends a GM performance review and retention incentive before the summer LTO launch.
       </p>
      </div>
     </Card>
    ) : null}

    <Card tone="intel" className="min-h-[520px]">
     <SectionTitle>Ask Privé Regional Assistant</SectionTitle>
     <AskPriveConsole persona="regional" />
    </Card>
   </div>
  </>
 );
}

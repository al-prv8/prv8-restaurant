import { createFileRoute } from "@tanstack/react-router";
import { Brain, AlertTriangle } from "lucide-react";
import { Card, SectionTitle, Metric, Meter, PriveIntelBanner } from "@/components/prive/ui";
import { AskPriveConsole } from "@/components/prive/AskPrive";
import { usePrive } from "@/lib/prive/store";
import { TROUBLED_RESTAURANT_ID } from "@/lib/prive/data";

export const Route = createFileRoute("/regional/intelligence")({
  head: () => ({ meta: [{ title: "Regional Intelligence — Regional · Privé" }] }),
  component: RegionalIntelligencePage,
});

function RegionalIntelligencePage() {
  const { derived: d } = usePrive();
  const troubled = d.health.find((h) => h.restaurant.id === TROUBLED_RESTAURANT_ID);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Regional Intelligence Console</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#101828]/60">
          Query Privé about cross-store operational patterns, labor drift, and guest complaint correlations across all 12 Carolinas locations.
        </p>
      </div>

      <PriveIntelBanner
        summary={`Charlotte #03 score flagged at ${troubled?.score ?? 58}% — 6 consecutive weeks of margin erosion.`}
        details={[
          "Primary Root Cause: Staffing turnover rose first (+14.2%), complaints followed 2 weeks later.",
          "Recommended Action: GM performance review + targeted retention bonus before summer LTO launch.",
        ]}
      />

      <div className="space-y-6">
        {troubled ? (
          <Card tone="alert">
            <SectionTitle hint={`Health ${troubled.score}`}>Priority Store Breakdown — {troubled.restaurant.name}</SectionTitle>
            <Meter value={troubled.score} tone={troubled.score >= 85 ? "teal" : troubled.score >= 74 ? "amber" : "red"} />
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              <Metric label="Turnover Delta" value={`${troubled.restaurant.turnoverDelta > 0 ? "+" : ""}${troubled.restaurant.turnoverDelta}%`} sub="vs region avg" tone={troubled.restaurant.turnoverDelta > 5 ? "bad" : "neutral"} />
              <Metric label="Complaints Delta" value={`${troubled.restaurant.complaintDelta > 0 ? "+" : ""}${troubled.restaurant.complaintDelta}%`} sub="vs region avg" tone={troubled.restaurant.complaintDelta > 10 ? "bad" : "neutral"} />
              <Metric label="Labor Cost Variance" value={`${troubled.restaurant.laborDelta > 0 ? "+" : ""}${troubled.restaurant.laborDelta} pts`} sub="vs labor target" tone={troubled.restaurant.laborDelta > 1 ? "warn" : "neutral"} />
              <Metric label="Training Completion" value={`${troubled.restaurant.trainingDelta}%`} sub="completion delta" tone={troubled.restaurant.trainingDelta < 0 ? "warn" : "good"} />
            </div>
            <div className="mt-4 rounded-xl border border-[#7C3AED]/25 bg-[#7C3AED]/[0.05] p-3.5 text-xs font-medium text-[#101828]/80 leading-relaxed space-y-1">
              <div className="font-bold text-[#7C3AED]">✦ Privé Pattern Match Insight:</div>
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

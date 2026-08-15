import { createFileRoute } from "@tanstack/react-router";
import { Download, TrendingUp, DollarSign, Users, AlertCircle } from "lucide-react";
import { Card, Metric, SectionTitle, Pill, Button } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";
import { money, moneyShort } from "@/lib/prive/forecast";

export const Route = createFileRoute("/executive/pulse")({
  head: () => ({ meta: [{ title: "Enterprise Pulse — Executive · Privé" }] }),
  component: ExecutivePulsePage,
});

function ExecutivePulsePage() {
  const { derived: d } = usePrive();
  const e = d.enterprise;

  const handleExportBrief = () => {
    const text = `PRIVÉ ENTERPRISE BRIEF - CAROLINAS REGION\nMonth Revenue: ${money(e.monthRevenue)}\nEBITDA Margin Delta: ${e.marginDelta} pts\nLabor %: ${e.laborPct}%\nRecovery Spend: ${money(e.recoverySpend)}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Prive_Executive_Brief.txt";
    a.click();
  };

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Enterprise Pulse</h1>
          <p className="mt-1 max-w-3xl text-sm text-[#101828]/60">
            12 restaurants · month-to-date financial performance vs plan.
          </p>
        </div>
        <Button variant="ghost" onClick={handleExportBrief} className="shrink-0">
          <Download className="size-4" /> Export Executive Brief
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-12">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric
              label="Month Revenue"
              value={moneyShort(e.monthRevenue)}
              sub={`Same-store sales ${e.sameStoreSalesPct > 0 ? "+" : ""}${e.sameStoreSalesPct}%`}
              tone="good"
              sparkline={[1100000, 1150000, 1180000, 1220000, 1250000, e.monthRevenue]}
            />
            <Metric
              label="Margin Variance"
              value={`${e.marginDelta > 0 ? "+" : ""}${e.marginDelta} pts`}
              sub="MTD EBITDA vs plan"
              tone={e.marginDelta < 0 ? "warn" : "good"}
            />
            <Metric
              label="Enterprise Labor"
              value={`${e.laborPct}%`}
              sub="Target 25.6% across 12 stores"
              tone={e.laborPct > 25.6 ? "warn" : "good"}
              sparkline={[25.1, 25.4, 25.8, 26.1, 26.4, e.laborPct]}
            />
            <Metric
              label="Recovery Spend"
              value={money(e.recoverySpend)}
              sub="Issued MTD · Single-use credits"
            />
          </div>

          <Card tone="intel">
            <SectionTitle hint="Updated 6:00 AM">Morning Enterprise Summary</SectionTitle>
            <p className="text-sm font-medium leading-relaxed text-[#101828]/80">
              Enterprise revenue is pacing +3.2% ahead of budget across the 12 Carolinas locations. EBITDA margin is lagging by 1.2 points, driven primarily by overtime and elevated turnover at Charlotte #03.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[#101828]/8 bg-white p-3.5 shadow-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#101828]/50">Top Performer</div>
                <div className="text-sm font-bold text-[#0B7A6C] mt-1">Ballantyne #02 (Score 88)</div>
                <div className="text-xs text-[#101828]/60 mt-0.5">+4.2% revenue growth</div>
              </div>

              <div className="rounded-xl border border-[#101828]/8 bg-white p-3.5 shadow-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#101828]/50">Primary Margin Driver</div>
                <div className="text-sm font-bold text-[#92400E] mt-1">Labor Variance (+0.8%)</div>
                <div className="text-xs text-[#101828]/60 mt-0.5">14 overtime hours</div>
              </div>

              <div className="rounded-xl border border-[#101828]/8 bg-white p-3.5 shadow-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#101828]/50">Turnover Watch</div>
                <div className="text-sm font-bold text-[#B02A37] mt-1">{e.turnoverRiskStores} Stores Flagged</div>
                <div className="text-xs text-[#101828]/60 mt-0.5">Charlotte #03 high risk</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

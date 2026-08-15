"use client";

import { Download, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { Card, SectionTitle, Button } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";
import { money, moneyShort } from "@/lib/prive/forecast";

export default function ExecutivePulsePage() {
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
   <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
     <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">Enterprise Pulse</h1>
     <p className="mt-2 max-w-3xl text-sm font-medium text-[#78716C]">
      12 restaurants · month-to-date financial performance vs plan.
     </p>
    </div>
    <Button variant="ghost" onClick={handleExportBrief} className="shrink-0 bg-white/10 backdrop-blur-xl hover:bg-white/15 shadow-sm font-bold">
     <Download className="size-4 mr-2" /> Export Executive Brief
    </Button>
   </div>

   <div className="grid gap-6 lg:grid-cols-12">
    <div className="space-y-8 lg:col-span-12">
     
     {/* Top Metric Cards */}
     <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-6 flex flex-col justify-between min-h-[140px]">
       <div className="text-[11px] font-black tracking-widest uppercase text-[#78716C]">Month Revenue</div>
       <div className="mt-2 flex items-center gap-2">
        <div className="text-3xl font-black text-[#1C1917] tabular-nums">{moneyShort(e.monthRevenue)}</div>
        <TrendingUp className="size-5 text-[#15803D]" />
       </div>
       <div className="mt-2 text-xs font-semibold text-[#15803D]">
        Same-store sales {e.sameStoreSalesPct > 0 ? "+" : ""}{e.sameStoreSalesPct}%
       </div>
      </div>

      <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-6 flex flex-col justify-between min-h-[140px]">
       <div className="text-[11px] font-black tracking-widest uppercase text-[#78716C]">Margin Variance</div>
       <div className="mt-2 flex items-center gap-2">
        <div className="text-3xl font-black text-[#1C1917] tabular-nums">{e.marginDelta > 0 ? "+" : ""}{e.marginDelta} pts</div>
        {e.marginDelta < 0 ? <TrendingDown className="size-5 text-[#B91C1C]" /> : <TrendingUp className="size-5 text-[#15803D]" />}
       </div>
       <div className={`mt-2 text-xs font-semibold ${e.marginDelta < 0 ? "text-[#B91C1C]" : "text-[#15803D]"}`}>
        MTD EBITDA vs plan
       </div>
      </div>

      <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-6 flex flex-col justify-between min-h-[140px]">
       <div className="text-[11px] font-black tracking-widest uppercase text-[#78716C]">Enterprise Labor</div>
       <div className="mt-2 flex items-center gap-2">
        <div className="text-3xl font-black text-[#1C1917] tabular-nums">{e.laborPct}%</div>
        {e.laborPct > 25.6 ? <TrendingUp className="size-5 text-[#B91C1C]" /> : <TrendingDown className="size-5 text-[#15803D]" />}
       </div>
       <div className={`mt-2 text-xs font-semibold ${e.laborPct > 25.6 ? "text-[#B91C1C]" : "text-[#15803D]"}`}>
        Target 25.6% across 12 stores
       </div>
      </div>

      <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-6 flex flex-col justify-between min-h-[140px]">
       <div className="text-[11px] font-black tracking-widest uppercase text-[#78716C]">Recovery Spend</div>
       <div className="mt-2 flex items-center gap-2">
        <div className="text-3xl font-black text-[#1C1917] tabular-nums">{moneyShort(e.recoverySpend)}</div>
        <TrendingUp className="size-5 text-[#B45309]" />
       </div>
       <div className="mt-2 text-xs font-semibold text-[#78716C]">
        Issued MTD · Single-use credits
       </div>
      </div>
      
      <div className="rounded-2xl bg-[#B91C1C]/10 backdrop-blur-sm p-6 shadow-sm flex flex-col justify-between min-h-[140px]">
       <div className="text-[11px] font-black tracking-widest uppercase text-[#B91C1C]">At-Risk Stores</div>
       <div className="mt-2 flex items-center gap-2">
        <div className="text-3xl font-black text-[#B91C1C] tabular-nums">{e.atRiskStores ?? 2}</div>
        <AlertTriangle className="size-5 text-[#B91C1C]" />
       </div>
       <div className="mt-2 text-xs font-semibold text-[#B91C1C]">
        Requires immediate intervention
       </div>
      </div>
     </div>

     <Card tone="intel">
      <SectionTitle hint="Updated 6:00 AM">Morning Enterprise Summary</SectionTitle>
      <p className="text-base font-medium leading-relaxed text-[#44403C] mt-2">
       Enterprise revenue is pacing <strong className="text-[#15803D]">+3.2% ahead of budget</strong> across the 12 Carolinas locations. EBITDA margin is lagging by <strong className="text-[#B91C1C]">1.2 points</strong>, driven primarily by overtime and elevated turnover at Charlotte #03.
      </p>

      {/* Financial Margin Waterfall Chart */}
      <div className="mt-8 pt-6 border-t border-[#E7E5E0]">
       <div className="flex items-center justify-between mb-4">
        <div>
         <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#881337]">Executive Financial Waterfall</div>
         <h4 className="text-base font-black text-[#1C1917]">Month-to-Date Profitability Breakdown</h4>
        </div>
        <span className="text-xs font-bold text-[#15803D] bg-[#15803D]/10 px-3 py-1 rounded-full">
         44.9% EBITDA Margin
        </span>
       </div>

       <div className="grid gap-3 sm:grid-cols-5 mt-4">
        {/* Step 1: Gross Revenue */}
        <div className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 p-4 shadow-sm flex flex-col justify-between">
         <div className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">1. Gross Revenue</div>
         <div className="text-xl font-black text-[#15803D] tabular-nums mt-2">+$1.24M</div>
         <div className="w-full bg-[#15803D]/20 h-2 rounded-full mt-3 overflow-hidden">
          <div className="bg-[#15803D] h-full w-full" />
         </div>
         <div className="text-[10px] font-semibold text-[#78716C] mt-2">100% Topline</div>
        </div>

        {/* Step 2: Food Cost */}
        <div className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 p-4 shadow-sm flex flex-col justify-between">
         <div className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">2. Food & COGS</div>
         <div className="text-xl font-black text-[#B91C1C] tabular-nums mt-2">-$364.5K</div>
         <div className="w-full bg-[#B91C1C]/20 h-2 rounded-full mt-3 overflow-hidden">
          <div className="bg-[#B91C1C] h-full w-[29.4%]" />
         </div>
         <div className="text-[10px] font-semibold text-[#78716C] mt-2">29.4% Revenue</div>
        </div>

        {/* Step 3: Labor Cost */}
        <div className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 p-4 shadow-sm flex flex-col justify-between">
         <div className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">3. Direct Labor</div>
         <div className="text-xl font-black text-[#B91C1C] tabular-nums mt-2">-$317.4K</div>
         <div className="w-full bg-[#B91C1C]/20 h-2 rounded-full mt-3 overflow-hidden">
          <div className="bg-[#B91C1C] h-full w-[25.6%]" />
         </div>
         <div className="text-[10px] font-semibold text-[#78716C] mt-2">25.6% Revenue</div>
        </div>

        {/* Step 4: Recovery Credits */}
        <div className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 p-4 shadow-sm flex flex-col justify-between">
         <div className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">4. Guest Recovery</div>
         <div className="text-xl font-black text-[#B45309] tabular-nums mt-2">-$1.25K</div>
         <div className="w-full bg-[#B45309]/20 h-2 rounded-full mt-3 overflow-hidden">
          <div className="bg-[#B45309] h-full w-[4%]" />
         </div>
         <div className="text-[10px] font-semibold text-[#78716C] mt-2">0.1% Single-use</div>
        </div>

        {/* Step 5: Net EBITDA Margin */}
        <div className="rounded-2xl bg-[#881337] text-white p-4 shadow-md flex flex-col justify-between">
         <div className="text-[10px] font-bold uppercase tracking-wider text-white/70">5. Net EBITDA</div>
         <div className="text-xl font-black text-white tabular-nums mt-2">+$556.7K</div>
         <div className="w-full bg-white/20 h-2 rounded-full mt-3 overflow-hidden">
          <div className="bg-white h-full w-[44.9%]" />
         </div>
         <div className="text-[10px] font-semibold text-white/80 mt-2">44.9% Net Margin</div>
        </div>
       </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
       <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5 shadow-sm flex flex-col justify-between min-h-[120px]">
        <div className="text-[11px] font-black uppercase tracking-widest text-[#A8A29E]">Top Performer</div>
        <div className="text-lg font-black text-[#1C1917] mt-2">Ballantyne #02</div>
        <div className="text-sm font-bold text-[#15803D] mt-1">+4.2% revenue growth</div>
       </div>

       <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5 shadow-sm flex flex-col justify-between min-h-[120px]">
        <div className="text-[11px] font-black uppercase tracking-widest text-[#A8A29E]">Primary Margin Driver</div>
        <div className="text-lg font-black text-[#1C1917] mt-2">Labor Variance</div>
        <div className="text-sm font-bold text-[#B45309] mt-1">14 overtime hours</div>
       </div>

       <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5 shadow-sm flex flex-col justify-between min-h-[120px]">
        <div className="text-[11px] font-black uppercase tracking-widest text-[#A8A29E]">Turnover Watch</div>
        <div className="text-lg font-black text-[#1C1917] mt-2">{e.turnoverRiskStores} Stores Flagged</div>
        <div className="text-sm font-bold text-[#B91C1C] mt-1">Charlotte #03 high risk</div>
       </div>
      </div>
     </Card>
    </div>
   </div>
  </>
 );
}

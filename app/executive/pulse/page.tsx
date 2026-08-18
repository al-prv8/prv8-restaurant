"use client";

import { Download, TrendingUp, TrendingDown, AlertTriangle, Sparkles } from "lucide-react";
import { Card, SectionTitle, Button, PriveIntelBanner } from "@/components/prive/ui";
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
     <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337] mb-1">
      CAROLINAS REGION · C-SUITE INTELLIGENCE
     </p>
     <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">Enterprise Pulse</h1>
     <p className="mt-2 max-w-3xl text-sm font-medium text-[#78716C]">
      12 restaurants, month-to-date financial performance vs plan.
     </p>
    </div>
    <Button variant="ghost" onClick={handleExportBrief} className="shrink-0 shadow-sm font-bold">
     <Download className="size-4 mr-2" /> Export Executive Brief
    </Button>
   </div>

   <PriveIntelBanner
    summary={`EBITDA margin is tracking +${e.marginDelta} pts above Q3 plan. Labor efficiency is the primary driver across 9 of 12 Carolinas stores.`}
    details={[
     `Month-to-date revenue: ${moneyShort(e.monthRevenue)} — same-store sales ${e.sameStoreSalesPct > 0 ? "+" : ""}${e.sameStoreSalesPct}% vs prior period.`,
     `Recovery spend of ${money(e.recoverySpend)} represents ${(e.recoverySpend / (e.monthRevenue || 1) * 100).toFixed(1)}% of revenue, within acceptable range.`,
     "2 stores flagged for operational review: Charlotte #03 (58%) and Uptown #07 (64%).",
    ]}
   />

   <div className="grid gap-6 lg:grid-cols-12">
    <div className="space-y-8 lg:col-span-12">
     
     {/* Top Metric Cards */}
     <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div className="rounded-xl bg-white border border-[#E7E5E0] p-4 shadow-sm flex flex-col justify-between min-h-[120px]">
       <div className="text-[11px] font-black tracking-widest uppercase text-[#78716C]">Month Revenue</div>
       <div className="mt-2 flex items-center gap-2">
        <div className="text-3xl font-black text-[#1C1917] tabular-nums">{moneyShort(e.monthRevenue)}</div>
        <TrendingUp className="size-5 text-[#15803D]" />
       </div>
       <div className="mt-2 text-xs font-semibold text-[#15803D]">
        Same-store sales {e.sameStoreSalesPct > 0 ? "+" : ""}{e.sameStoreSalesPct}%
       </div>
      </div>

      <div className="rounded-xl bg-white border border-[#E7E5E0] p-4 shadow-sm flex flex-col justify-between min-h-[120px]">
       <div className="text-[11px] font-black tracking-widest uppercase text-[#78716C]">Margin Variance</div>
       <div className="mt-2 flex items-center gap-2">
        <div className="text-3xl font-black text-[#1C1917] tabular-nums">{e.marginDelta > 0 ? "+" : ""}{e.marginDelta} pts</div>
        {e.marginDelta < 0 ? <TrendingDown className="size-5 text-[#B91C1C]" /> : <TrendingUp className="size-5 text-[#15803D]" />}
       </div>
       <div className={`mt-2 text-xs font-semibold ${e.marginDelta < 0 ? "text-[#B91C1C]" : "text-[#15803D]"}`}>
        MTD EBITDA vs plan
       </div>
      </div>

      <div className="rounded-xl bg-white border border-[#E7E5E0] p-4 shadow-sm flex flex-col justify-between min-h-[120px]">
       <div className="text-[11px] font-black tracking-widest uppercase text-[#78716C]">Enterprise Labor</div>
       <div className="mt-2 flex items-center gap-2">
        <div className="text-3xl font-black text-[#1C1917] tabular-nums">{e.laborPct}%</div>
        {e.laborPct > 25.6 ? <TrendingUp className="size-5 text-[#B91C1C]" /> : <TrendingDown className="size-5 text-[#15803D]" />}
       </div>
       <div className={`mt-2 text-xs font-semibold ${e.laborPct > 25.6 ? "text-[#B91C1C]" : "text-[#15803D]"}`}>
        Target 25.6% across 12 stores
       </div>
      </div>

      <div className="rounded-xl bg-white border border-[#E7E5E0] p-4 shadow-sm flex flex-col justify-between min-h-[120px]">
       <div className="text-[11px] font-black tracking-widest uppercase text-[#78716C]">Recovery Spend</div>
       <div className="mt-2 flex items-center gap-2">
        <div className="text-3xl font-black text-[#1C1917] tabular-nums">{moneyShort(e.recoverySpend)}</div>
        <TrendingUp className="size-5 text-[#B45309]" />
       </div>
       <div className="mt-2 text-xs font-semibold text-[#78716C]">
        Issued MTD · Single-use credits
       </div>
      </div>
      
      <div className="rounded-xl bg-[#FEF2F2] border border-[#B91C1C]/20 p-4 shadow-sm flex flex-col justify-between min-h-[120px]">
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
      <p className="text-base font-medium leading-relaxed text-[#44403C] mt-2 mb-6">
       Enterprise revenue is pacing <strong className="text-[#15803D]">+3.2% ahead of budget</strong> across the 12 Carolinas locations. EBITDA margin is lagging by <strong className="text-[#B91C1C]">1.2 points</strong>, driven primarily by overtime and elevated turnover at Charlotte #03.
      </p>

      {/* Predictive Narrative */}
      <div className="mb-8">
       <h3 className="text-sm font-black text-[#1C1917] flex items-center gap-2 mb-2">
        <Sparkles className="size-4 text-[#881337]" /> What Privé Anticipates
       </h3>
       <p className="text-sm font-medium text-[#44403C] leading-relaxed">
        Based on current run-rates, Enterprise EBITDA is forecasted to close at <strong className="text-[#15803D]">45.2%</strong> (+$42K above plan). Overtime at Charlotte #03 will normalize by week 3 if recent hiring patterns hold.
       </p>
      </div>

      {/* Financial Margin Waterfall Chart */}
      <div className="pt-6 border-t border-[#E7E5E0]">
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
        <div className="rounded-lg bg-white border border-[#E7E5E0] p-4 shadow-sm flex flex-col justify-between">
         <div className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">1. Gross Revenue</div>
         <div className="text-xl font-black text-[#15803D] tabular-nums mt-2">+$1.24M</div>
         <div className="w-full bg-[#15803D]/20 h-2 rounded-full mt-3 overflow-hidden">
          <div className="bg-[#15803D] h-full w-full" />
         </div>
         <div className="text-[10px] font-semibold text-[#78716C] mt-2">100% Topline</div>
        </div>

        {/* Step 2: Food Cost */}
        <div className="rounded-lg bg-white border border-[#E7E5E0] p-4 shadow-sm flex flex-col justify-between">
         <div className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">2. Food & COGS</div>
         <div className="text-xl font-black text-[#B91C1C] tabular-nums mt-2">-$364.5K</div>
         <div className="w-full bg-[#B91C1C]/20 h-2 rounded-full mt-3 overflow-hidden">
          <div className="bg-[#B91C1C] h-full w-[29.4%]" />
         </div>
         <div className="text-[10px] font-semibold text-[#78716C] mt-2">29.4% Revenue</div>
        </div>

        {/* Step 3: Labor Cost */}
        <div className="rounded-lg bg-white border border-[#E7E5E0] p-4 shadow-sm flex flex-col justify-between">
         <div className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">3. Direct Labor</div>
         <div className="text-xl font-black text-[#B91C1C] tabular-nums mt-2">-$317.4K</div>
         <div className="w-full bg-[#B91C1C]/20 h-2 rounded-full mt-3 overflow-hidden">
          <div className="bg-[#B91C1C] h-full w-[25.6%]" />
         </div>
         <div className="text-[10px] font-semibold text-[#78716C] mt-2">25.6% Revenue</div>
        </div>

        {/* Step 4: Recovery Credits */}
        <div className="rounded-lg bg-white border border-[#E7E5E0] p-4 shadow-sm flex flex-col justify-between">
         <div className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">4. Guest Recovery</div>
         <div className="text-xl font-black text-[#B45309] tabular-nums mt-2">-$1.25K</div>
         <div className="w-full bg-[#B45309]/20 h-2 rounded-full mt-3 overflow-hidden">
          <div className="bg-[#B45309] h-full w-[4%]" />
         </div>
         <div className="text-[10px] font-semibold text-[#78716C] mt-2">0.1% Single-use</div>
        </div>

        {/* Step 5: Net EBITDA Margin */}
        <div className="rounded-lg bg-[#881337] text-white p-4 shadow-md flex flex-col justify-between">
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
       <div className="rounded-lg bg-white border border-[#E7E5E0] p-4 shadow-sm flex flex-col justify-between min-h-[120px]">
        <div className="text-[11px] font-black uppercase tracking-widest text-[#A8A29E]">Top Performer</div>
        <div className="text-lg font-black text-[#1C1917] mt-2">Ballantyne #02</div>
        <div className="text-sm font-bold text-[#15803D] mt-1">+4.2% revenue growth</div>
       </div>

       <div className="rounded-lg bg-white border border-[#E7E5E0] p-4 shadow-sm flex flex-col justify-between min-h-[120px]">
        <div className="text-[11px] font-black uppercase tracking-widest text-[#A8A29E]">Primary Margin Driver</div>
        <div className="text-lg font-black text-[#1C1917] mt-2">Labor Variance</div>
        <div className="text-sm font-bold text-[#B45309] mt-1">14 overtime hours</div>
       </div>

       <div className="rounded-lg bg-white border border-[#E7E5E0] p-4 shadow-sm flex flex-col justify-between min-h-[120px]">
        <div className="text-[11px] font-black uppercase tracking-widest text-[#A8A29E]">Turnover Watch</div>
        <div className="text-lg font-black text-[#1C1917] mt-2">{e.turnoverRiskStores} Stores Flagged</div>
        <div className="text-sm font-bold text-[#B91C1C] mt-1">Charlotte #03 high risk</div>
       </div>
      </div>

      {/* Guest Sentiment Trend — 8-Week Line Chart */}
      <div className="pt-6 border-t border-[#E7E5E0]">
       <div className="flex items-center justify-between mb-4">
        <div>
         <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#881337]">Guest Sentiment</div>
         <h4 className="text-base font-black text-[#1C1917]">Enterprise Satisfaction Score — 8-Week Trend</h4>
        </div>
        <span className="text-xs font-bold text-[#15803D] bg-[#15803D]/10 px-3 py-1 rounded-full">4.2 / 5.0 avg</span>
       </div>

       {(() => {
        const weeks = [
         { week: "W1", score: 4.5 },
         { week: "W2", score: 4.3 },
         { week: "W3", score: 4.4 },
         { week: "W4", score: 4.1 },
         { week: "W5", score: 3.9 },
         { week: "W6", score: 4.0 },
         { week: "W7", score: 4.2 },
         { week: "W8", score: 4.2 },
        ];
        const W = 520, H = 90, PAD_L = 32, PAD_B = 20;
        const minScore = 3.5, maxScore = 5.0;
        const px = (i: number) => PAD_L + (i / (weeks.length - 1)) * (W - PAD_L);
        const py = (v: number) => H - PAD_B - ((v - minScore) / (maxScore - minScore)) * (H - PAD_B - 8);
        const pts = weeks.map((w, i) => ({ x: px(i), y: py(w.score) }));
        function getSmoothBezier(p: { x: number; y: number }[]) {
          if (p.length === 0) return "";
          let path = `M ${p[0].x.toFixed(1)},${p[0].y.toFixed(1)}`;
          for (let i = 0; i < p.length - 1; i++) {
            const p0 = p[i === 0 ? i : i - 1];
            const p1 = p[i];
            const p2 = p[i + 1];
            const p3 = p[i + 2 < p.length ? i + 2 : i + 1];
            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;
            path += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
          }
          return path;
        }

        const pathD = getSmoothBezier(pts);
        const areaD = `${pathD} L ${px(weeks.length - 1).toFixed(1)},${(H - PAD_B).toFixed(1)} L ${px(0).toFixed(1)},${(H - PAD_B).toFixed(1)} Z`;
        const trend = weeks[weeks.length - 1].score >= weeks[0].score;
        const lineColor = trend ? "#15803D" : "#B91C1C";

        return (
         <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${W + 20} ${H + 8}`} className="w-full" style={{ minWidth: 280 }}>
           {/* Y-axis gridlines */}
           {[3.5, 4.0, 4.5, 5.0].map(v => {
            const y = py(v);
            return (
             <g key={v}>
              <line x1={PAD_L} y1={y} x2={W} y2={y} stroke="#F3F2F0" strokeWidth="1" />
              <text x={PAD_L - 4} y={y + 3.5} textAnchor="end" fontSize="8" fill="#A8A29E" fontWeight="600">{v.toFixed(1)}</text>
             </g>
            );
           })}
           {/* Target line at 4.3 */}
           {(() => {
            const y = py(4.3);
            return (
             <>
              <line x1={PAD_L} y1={y} x2={W} y2={y} stroke="#B45309" strokeWidth="1" strokeDasharray="4 3" />
              <text x={W + 2} y={y + 3} fontSize="8" fill="#B45309" fontWeight="700">Target</text>
             </>
            );
           })()}
           {/* Area fill */}
           <path d={areaD} fill={lineColor} opacity="0.07" />
           {/* Line */}
           <path d={pathD} fill="none" stroke={lineColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
           {/* Data points */}
           {weeks.map((w, i) => (
            <g key={w.week}>
             <circle cx={px(i)} cy={py(w.score)} r="4" fill="white" stroke={lineColor} strokeWidth="2" />
             <text x={px(i)} y={H - PAD_B + 12} textAnchor="middle" fontSize="8" fill="#A8A29E" fontWeight="600">{w.week}</text>
            </g>
           ))}
           {/* Baseline */}
           <line x1={PAD_L} y1={H - PAD_B} x2={W} y2={H - PAD_B} stroke="#E7E5E0" strokeWidth="1.5" />
          </svg>
         </div>
        );
       })()}

       {/* 3-location driver callout */}
       <div className="mt-3 rounded-lg bg-[#FEF2F2] border border-[#B91C1C]/20 px-4 py-3 text-xs font-medium text-[#B91C1C]">
        <span className="font-bold">Sentiment Pressure:</span> Charlotte #03, Raleigh #07, and Greensboro #11 account for 61% of negative guest feedback. Primary driver: extended wait times during dinner peak.
       </div>
      </div>
     </Card>
    </div>
   </div>
  </>
 );
}

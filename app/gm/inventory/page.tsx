"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle, Truck } from "lucide-react";
import { Card, Pill, SectionTitle, PageTabs, PriveIntelBanner, Pagination, KpiRow, DataTable, THead, Th, Tr, Td, StatusDot } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

type Tab = "all" | "atRisk" | "healthy";

export default function GmInventoryPage() {
 const { state, derived: d, dispatch } = usePrive();
 const [activeTab, setActiveTab] = useState<Tab>("all");
 const [buffer, setBuffer] = useState(15);
 const [currentPageRisk, setCurrentPageRisk] = useState(1);
 const [currentPageHealthy, setCurrentPageHealthy] = useState(1);
 const pageSize = 10;

 const riskItems = d.depletion.filter((i) => i.risk !== "Healthy");
 const healthyItems = d.depletion.filter((i) => i.risk === "Healthy");

 const totalPagesRisk = Math.ceil(riskItems.length / pageSize);
 const paginatedRisk = riskItems.slice((currentPageRisk - 1) * pageSize, currentPageRisk * pageSize);

 const totalPagesHealthy = Math.ceil(healthyItems.length / pageSize);
 const paginatedHealthy = healthyItems.slice((currentPageHealthy - 1) * pageSize, currentPageHealthy * pageSize);

 return (
  <>
   <div className="mb-8">
    <p className="text-[10px] font-bold uppercase tracking-widest text-[#881337] mb-1.5">Supply Chain</p>
    <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">Inventory & Depletion</h1>
    <p className="mt-2 max-w-3xl text-sm font-medium text-[#78716C]">
     Depletion forecast against tomorrow's projected demand, every number recalculates live from the forecast engine.
    </p>
   </div>

   <PriveIntelBanner
    summary={
     d.potato.shortage > 0
      ? `Russet Potatoes projected to run short by ${d.potato.shortage} lbs tomorrow (depletion at ${d.potato.depletionTime ?? "close"}).`
      : "Inventory covers forecast demand across every tracked SKU."
    }
    details={[
     `Carolina Produce order cutoff in 2h 14m (5:00 PM cutoff for 6:00 AM delivery).`,
     `Forecast Demand: ${d.tomorrow.transactions.toLocaleString()} txns × 0.30 lbs = ${d.potato.projectedUsage} lbs required.`,
     `Alternative Action: 11-mile inventory transfer from Charlotte #01 (40 lbs available).`,
    ]}
    action={d.potato.shortage > 0 ? () => dispatch({ type: "increasePotatoOrder", lbs: Math.max(20, Math.ceil(d.potato.shortage)) }) : undefined}
    actionLabel={d.potato.shortage > 0 ? `Order +${Math.ceil(d.potato.shortage)} lbs Russet Potatoes` : undefined}
   />

   {/* Interactive Reorder Threshold Drag Slider */}
   <div className="mb-6 rounded-xl bg-white border border-[#E7E5E0] shadow-sm p-5">
    <div className="flex items-center justify-between border-b border-[#E7E5E0] pb-3 mb-4">
     <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#881337]">Inventory Par Engine</div>
      <div className="text-base font-black text-[#1C1917]">Interactive Par Buffer Slider</div>
     </div>
     <Pill tone="teal">Buffer Capped</Pill>
    </div>

    <div className="space-y-3">
     <div className="flex items-center justify-between text-xs font-bold text-[#1C1917]">
      <span>Safety Par Buffer: +{buffer}%</span>
      <span className="text-[#78716C]">Triggers Reorder at {Math.round(40 * (1 + buffer / 100))} lbs</span>
     </div>

     <input
      type="range"
      min="5"
      max="40"
      value={buffer}
      onChange={(e) => setBuffer(Number(e.target.value))}
      className="w-full h-2 bg-[#E7E5E0] rounded-lg appearance-none cursor-pointer accent-[#881337]"
     />

     <div className="flex justify-between text-[10px] font-bold uppercase text-[#A8A29E]">
      <span>5% (Lean Par)</span>
      <span>20% (Standard)</span>
      <span>40% (Peak Weekend Buffer)</span>
     </div>
    </div>
   </div>

   <div className="mb-8">
    <KpiRow items={[
     { label: "Shortage Amount", value: d.potato.shortage > 0 ? `${d.potato.shortage} lbs` : "0 lbs", subtext: "Across all tracked SKUs", tone: d.potato.shortage > 0 ? "critical" : "neutral" },
     { label: "Order Status", value: d.potato.shortage > 0 ? "Pending" : "Fulfilled", subtext: "Supplier: Carolina Produce", tone: d.potato.shortage > 0 ? "warning" : "positive" },
     { label: "Supplier Cutoff", value: "2h 14m", subtext: "5:00 PM for 6:00 AM delivery" },
    ]} />
   </div>

   {/* Potato Depletion Forecast Chart */}
   {d.potato.shortage > 0 && (
    <div className="mb-6 rounded-xl bg-white border border-[#E7E5E0] shadow-sm p-5">
     <div className="flex items-center justify-between border-b border-[#E7E5E0] pb-3 mb-5">
      <div>
       <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#881337]">Depletion Forecast</div>
       <div className="text-base font-black text-[#1C1917]">Russet Potatoes — Projected Inventory Through Close</div>
      </div>
      <Pill tone="red">Shortage Projected</Pill>
     </div>

     {(() => {
      // Build depletion curve: 8 AM open → 10 PM close, 15 hours
      const onHand = d.potato.onHand ?? 40;
      const projected = d.potato.projectedUsage ?? (onHand + d.potato.shortage);
      const depletionHour = projected > 0 ? Math.round((onHand / projected) * 15) : 15;
      const hours = Array.from({ length: 16 }, (_, i) => {
       const remaining = Math.max(0, onHand - (projected / 15) * i);
       return { h: i, remaining };
      });
      const maxStock = onHand * 1.05;
      const W = 520, H = 120, PAD_L = 36, PAD_B = 24;
      const px = (i: number) => PAD_L + (i / 15) * (W - PAD_L);
      const py = (v: number) => H - PAD_B - (v / maxStock) * (H - PAD_B - 8);
      const pts = hours.map((p, i) => ({ x: px(i), y: py(p.remaining) }));
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
      const areaD = `${pathD} L ${px(15).toFixed(1)},${(H - PAD_B).toFixed(1)} L ${px(0).toFixed(1)},${(H - PAD_B).toFixed(1)} Z`;
      const depX = px(depletionHour);
      const labelHour = 8 + depletionHour;
      const depLabel = `${labelHour > 12 ? labelHour - 12 : labelHour}:00 ${labelHour >= 12 ? "PM" : "AM"}`;
      const timeLabels = ["8 AM","10 AM","12 PM","2 PM","4 PM","6 PM","8 PM","10 PM"];

      return (
       <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${W + 10} ${H + 10}`} className="w-full" style={{ minWidth: 300 }}>
         {/* Y gridlines */}
         {[0, 25, 50, 75, 100].map(pct => {
          const v = (pct / 100) * maxStock;
          const y = py(v);
          return (
           <g key={pct}>
            <line x1={PAD_L} y1={y} x2={W} y2={y} stroke="#F3F2F0" strokeWidth="1" />
            <text x={PAD_L - 4} y={y + 3.5} textAnchor="end" fontSize="8" fill="#A8A29E">{Math.round(v)}lb</text>
           </g>
          );
         })}

         {/* Reorder threshold line */}
         {(() => {
          const parLevel = onHand * 0.25;
          const y = py(parLevel);
          return (
           <>
            <line x1={PAD_L} y1={y} x2={W} y2={y} stroke="#B45309" strokeWidth="1" strokeDasharray="4 3" />
            <text x={W + 4} y={y + 3} fontSize="8" fill="#B45309" fontWeight="700">Par</text>
           </>
          );
         })()}

         {/* Area fill */}
         <path d={areaD} fill="#881337" opacity="0.08" />
         {/* Line */}
         <path d={pathD} fill="none" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

         {/* Depletion marker */}
         {depletionHour < 15 && (
          <g>
           <line x1={depX} y1={8} x2={depX} y2={H - PAD_B} stroke="#B91C1C" strokeWidth="1.5" strokeDasharray="3 2" />
           <rect x={depX - 22} y="8" width="44" height="14" rx="3" fill="#B91C1C" />
           <text x={depX} y="18.5" textAnchor="middle" fontSize="8" fontWeight="800" fill="white">Runs Out</text>
           <text x={depX} y="30" textAnchor="middle" fontSize="8" fontWeight="700" fill="#B91C1C">{depLabel}</text>
          </g>
         )}

         {/* X-axis baseline */}
         <line x1={PAD_L} y1={H - PAD_B} x2={W} y2={H - PAD_B} stroke="#E7E5E0" strokeWidth="1.5" />

         {/* Time labels */}
         {timeLabels.map((label, i) => (
          <text key={i} x={px(i * (15 / 7))} y={H - PAD_B + 12} textAnchor="middle" fontSize="8" fill="#A8A29E" fontWeight="600">{label}</text>
         ))}
        </svg>
       </div>
      );
     })()}

     <div className="mt-3 flex items-center gap-4 text-[11px] font-bold text-[#78716C]">
      <span className="flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-sm bg-[#881337]/80" />Current Stock</span>
      <span className="flex items-center gap-1.5"><span className="inline-block w-5 h-0.5 bg-[#B45309]" style={{borderTop: "1.5px dashed #B45309", background: "none"}} />Par Level</span>
      <span className="flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-sm bg-[#B91C1C]" />Depletion Point</span>
     </div>
    </div>
   )}

   <PageTabs
    tabs={[
     { id: "all", label: "All SKUs" },
     { id: "atRisk", label: "At-Risk SKUs", badge: riskItems.length },
     { id: "healthy", label: "Healthy SKUs", badge: healthyItems.length },
    ]}
    active={activeTab}
    onChange={(tab) => {
     setActiveTab(tab as Tab);
     setCurrentPageRisk(1);
     setCurrentPageHealthy(1);
    }}
   />

   <div className="space-y-6">
    <div className="grid gap-6 lg:grid-cols-12">
     <div className="lg:col-span-7 space-y-6">
      {(activeTab === "all" || activeTab === "atRisk") && (
       <Card>
        <SectionTitle hint={`${riskItems.length} SKUs Flagged`}>At-Risk Inventory</SectionTitle>
        {riskItems.length === 0 ? (
         <div className="rounded-xl bg-[#15803D]/10 p-5 text-sm font-semibold text-[#15803D] flex items-center gap-2">
          <CheckCircle className="size-5" /> Every tracked SKU covers forecast demand for tomorrow.
         </div>
        ) : (
         <div className="mt-4">
          <DataTable>
           <THead><tr><Th>SKU</Th><Th>On Hand</Th><Th>Projected Use</Th><Th>Shortage</Th><Th>Status</Th><Th>Action</Th></tr></THead>
           <tbody>
            {paginatedRisk.map(i => (
             <Tr key={i.itemId}>
              <Td><span className="font-semibold">{i.name}</span></Td>
              <Td className="tabular-nums">{i.onHand} {i.unit}</Td>
              <Td className="tabular-nums">{i.projectedUsage} {i.unit}</Td>
              <Td className="tabular-nums">{i.shortage > 0 ? <span className="text-[#B91C1C] font-bold">-{i.shortage} {i.unit}</span> : <span className="text-[#15803D]">Covered</span>}</Td>
              <Td><StatusDot tone={i.risk === 'Critical' ? 'red' : i.risk === 'At Risk' ? 'amber' : 'green'} /> <span className="ml-1.5 text-xs">{i.risk}</span></Td>
              <Td>{i.shortage > 0 ? <button onClick={() => dispatch({type:'increasePotatoOrder', lbs: Math.ceil(i.shortage)})} className="text-xs font-bold text-[#881337] hover:underline">Order Now</button> : null}</Td>
             </Tr>
            ))}
           </tbody>
          </DataTable>
         </div>
        )}

        <div className="mt-4">
         <Pagination
          currentPage={currentPageRisk}
          totalPages={totalPagesRisk}
          onPageChange={setCurrentPageRisk}
          totalItems={riskItems.length}
          pageSize={pageSize}
         />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
         <button
          onClick={() =>
           dispatch({ type: "increasePotatoOrder", lbs: Math.max(20, Math.ceil(d.potato.shortage)) })
          }
          disabled={d.potato.shortage === 0}
          className="flex-1 rounded-lg bg-[#881337] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#6B0F2A] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
         >
          Increase Potato Order{d.potato.shortage > 0 ? ` +${Math.ceil(d.potato.shortage)} lbs` : ""}
         </button>
         <button
          onClick={() => dispatch({ type: "transferInventory", lbs: 40 })}
          disabled={state.transferRequested}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-white border border-[#E7E5E0] px-4 py-3 text-sm font-bold text-[#1C1917] shadow-sm hover:bg-[#F9F8F6] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
         >
          <Truck className="size-4" />
          {state.transferRequested ? "Transfer Requested" : "Transfer 40 lbs from Charlotte #01"}
         </button>
        </div>
       </Card>
      )}
     </div>

     <div className="lg:col-span-5 space-y-6">
      {(activeTab === "all" || activeTab === "healthy") && healthyItems.length > 0 && (
       <Card>
        <SectionTitle hint={`${healthyItems.length} SKUs`}>Healthy Inventory</SectionTitle>
        <div className="space-y-0 mt-2">
         {paginatedHealthy.map((i) => (
          <div
           key={i.itemId}
           className="flex items-center justify-between border-b border-[#F3F2F0] py-2.5 text-sm"
          >
           <span className="text-[#1C1917] font-bold">{i.name}</span>
           <Pill tone="teal">{i.onHand} {i.unit}</Pill>
          </div>
         ))}
        </div>

        <div className="mt-4">
         <Pagination
          currentPage={currentPageHealthy}
          totalPages={totalPagesHealthy}
          onPageChange={setCurrentPageHealthy}
          totalItems={healthyItems.length}
          pageSize={pageSize}
         />
        </div>
       </Card>
      )}
     </div>
    </div>
   </div>
  </>
 );
}

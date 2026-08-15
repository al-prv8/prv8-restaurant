"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle, Truck } from "lucide-react";
import { Card, Pill, SectionTitle, PageTabs, PriveIntelBanner, Pagination } from "@/components/prive/ui";
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
    <h1 className="text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">Inventory & Depletion</h1>
    <p className="mt-2 max-w-3xl text-sm font-medium text-[#78716C]">
     Depletion forecast against tomorrow's projected demand — every number recalculates live from the forecast engine.
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
   <div className="mb-6 rounded-2xl bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] ring-1 ring-black/[0.03] p-5">
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

   <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
    <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
     <div className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-1">Shortage Amount</div>
     <div className={`text-3xl font-black tabular-nums ${d.potato.shortage > 0 ? "text-[#B91C1C]" : "text-[#15803D]"}`}>
      {d.potato.shortage > 0 ? `${d.potato.shortage} lbs` : "0 lbs"}
     </div>
     <div className="text-sm font-medium text-[#78716C] mt-1">Across all tracked SKUs</div>
    </div>
    <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
     <div className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-1">Order Status</div>
     <div className={`text-3xl font-black tabular-nums ${d.potato.shortage > 0 ? "text-[#B45309]" : "text-[#15803D]"}`}>
      {d.potato.shortage > 0 ? "Pending" : "Fulfilled"}
     </div>
     <div className="text-sm font-medium text-[#78716C] mt-1">Supplier: Carolina Produce</div>
    </div>
    <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
     <div className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-1">Supplier Cutoff</div>
     <div className="text-3xl font-black tabular-nums text-[#1C1917]">2h 14m</div>
     <div className="text-sm font-medium text-[#78716C] mt-1">5:00 PM for 6:00 AM delivery</div>
    </div>
   </div>

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
         <div className="space-y-4">
          {paginatedRisk.map((i) => (
           <div key={i.itemId} className={`rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5 shadow-sm ${i.shortage > 0 ? "" : ""}`}>
            <div className="flex items-center justify-between gap-2">
             <span className="text-lg font-bold text-[#1C1917]">{i.name}</span>
             <Pill tone={i.risk === "Critical" ? "red" : i.risk === "At Risk" ? "amber" : "neutral"}>
              {i.risk}
             </Pill>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-sm text-[#78716C] font-medium">
             <span className="flex flex-col">
              <span className="text-xs uppercase tracking-wider mb-1">On hand</span>
              <span className="text-xl font-black text-[#1C1917] tabular-nums">{i.onHand} {i.unit}</span>
             </span>
             <span className="flex flex-col">
              <span className="text-xs uppercase tracking-wider mb-1">Projected use</span>
              <span className="text-xl font-black text-[#1C1917] tabular-nums">{i.projectedUsage} {i.unit}</span>
             </span>
             <span className="flex flex-col">
              <span className="text-xs uppercase tracking-wider mb-1">Status</span>
              {i.shortage > 0 ? (
               <span className="text-[#B91C1C] font-black text-xl tabular-nums">Short {i.shortage} {i.unit}</span>
              ) : (
               <span className="text-[#15803D] font-bold">Covers demand</span>
              )}
             </span>
            </div>
            {i.depletionTime ? (
             <p className="mt-3 text-sm font-bold text-[#B91C1C] flex items-center gap-2">
              <AlertTriangle className="size-4 shrink-0" /> Projected to deplete at {i.depletionTime} — {i.hoursToDepletion?.toFixed(1)}h into service
             </p>
            ) : null}
           </div>
          ))}
         </div>
        )}

        <Pagination
         currentPage={currentPageRisk}
         totalPages={totalPagesRisk}
         onPageChange={setCurrentPageRisk}
         totalItems={riskItems.length}
         pageSize={pageSize}
        />

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
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-white/60 backdrop-blur-md px-4 py-3 text-sm font-bold text-[#1C1917] shadow-sm hover:bg-white/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="space-y-3">
         {paginatedHealthy.map((i) => (
          <div
           key={i.itemId}
           className="flex items-center justify-between rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-4 text-sm shadow-sm"
          >
           <span className="text-[#1C1917] font-bold">{i.name}</span>
           <Pill tone="teal">{i.onHand} {i.unit}</Pill>
          </div>
         ))}
        </div>

        <Pagination
         currentPage={currentPageHealthy}
         totalPages={totalPagesHealthy}
         onPageChange={setCurrentPageHealthy}
         totalItems={healthyItems.length}
         pageSize={pageSize}
        />
       </Card>
      )}
     </div>
    </div>
   </div>
  </>
 );
}

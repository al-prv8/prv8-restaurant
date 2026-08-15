"use client";

import { useState } from "react";
import { Card, Pill, SectionTitle, PageTabs, Pagination } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";
import type { Restaurant } from "@/lib/prive/data";

type Tab = "all" | "healthy" | "action";

function getStoreReasons(r: Restaurant, state: string): string[] {
 if (state === "Healthy") {
  return [
   "Operating within target margin (+3.2% revenue growth).",
   "Roster staffing fully covered for peak shifts.",
   "Guest sentiment score 4.5+ with zero overdue complaints.",
  ];
 }
 const items: string[] = [];
 if (r.turnoverDelta > 5) items.push(`Elevated turnover risk (+${r.turnoverDelta}% vs region)`);
 if (r.laborDelta > 2) items.push(`Labor cost variance (+${r.laborDelta}% above target)`);
 if (r.complaintDelta > 2) items.push(`Guest complaint rate surge (+${r.complaintDelta} per 1k txns)`);
 if (items.length === 0) items.push("Requires operational audit and manager check-in.");
 return items;
}

export default function RegionalPortfolioPage() {
 const { state, derived: d, dispatch } = usePrive();
 const [activeTab, setActiveTab] = useState<Tab>("all");
 const [currentPage, setCurrentPage] = useState(1);
 const pageSize = 10;

 const selectedHealth = d.health.find((x) => x.restaurant.id === state.regionalRestaurantId) ?? d.health[0];
 const filteredHealth = d.health.filter((x) => {
  if (activeTab === "healthy") return x.state === "Healthy";
  if (activeTab === "action") return x.state === "Watch" || x.state === "Action Required" || x.state === "Critical";
  return true;
 });

 const totalPages = Math.ceil(filteredHealth.length / pageSize);
 const paginatedHealth = filteredHealth.slice((currentPage - 1) * pageSize, currentPage * pageSize);

 const selectedReasons = selectedHealth ? getStoreReasons(selectedHealth.restaurant, selectedHealth.state) : [];

 const healthyCount = d.health.filter(x => x.state === "Healthy").length;
 const watchCount = d.health.filter(x => x.state === "Watch").length;
 const actionCount = d.health.filter(x => x.state === "Action Required" || x.state === "Critical").length;

 return (
  <>
   <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div>
     <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337] mb-2">Carolinas Region · 12 Locations</p>
     <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">Carolinas Portfolio</h1>
     <p className="mt-2 max-w-3xl text-sm font-medium text-[#78716C]">
      Composite health scores updated continuously across Charlotte, Raleigh & Greensboro.
     </p>
    </div>
    
    <div className="flex gap-3">
     <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] py-3 flex flex-col justify-center min-w-[120px]">
      <div className="text-3xl font-black text-[#15803D] leading-none mb-1">{healthyCount}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-[#78716C] leading-tight">Healthy</div>
     </div>
     <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] py-3 flex flex-col justify-center min-w-[120px]">
      <div className="text-3xl font-black text-[#B45309] leading-none mb-1">{watchCount}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-[#78716C] leading-tight">Watch List</div>
     </div>
     <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] py-3 flex flex-col justify-center min-w-[120px]">
      <div className="text-3xl font-black text-[#B91C1C] leading-none mb-1">{actionCount}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-[#78716C] leading-tight">Action Reqd</div>
     </div>
    </div>
   </div>

   <PageTabs
    tabs={[
     { id: "all", label: "All 12 Locations" },
     { id: "healthy", label: "Healthy Locations", badge: healthyCount },
     { id: "action", label: "Action / Watch Needed", badge: watchCount + actionCount },
    ]}
    active={activeTab}
    onChange={(tab) => {
     setActiveTab(tab as Tab);
     setCurrentPage(1);
    }}
   />

   <div className="grid gap-6 lg:grid-cols-12">
    <div className="space-y-6 lg:col-span-7">
     <Card>
      <SectionTitle hint={`${filteredHealth.length} Stores`}>Location Health Matrix</SectionTitle>
      <div className="space-y-3">
       {paginatedHealth.map(({ restaurant: r, score, state: s }) => {
        const isSelected = r.id === (selectedHealth?.restaurant.id ?? "");
        const reasons = getStoreReasons(r, s);
        const scoreColor = score >= 85 ? "bg-[#15803D]" : score >= 70 ? "bg-[#B45309]" : "bg-[#B91C1C]";
        const textColor = score >= 85 ? "text-[#15803D]" : score >= 70 ? "text-[#B45309]" : "text-[#B91C1C]";
        
        return (
         <button
          key={r.id}
          type="button"
          onClick={() => dispatch({ type: "regionalRestaurant", id: r.id })}
          className={`w-full flex items-center justify-between gap-3 rounded-2xl p-4 text-left transition-all ${
           isSelected
            ? `bg-white/50 backdrop-blur-md shadow-lg ring-1 ring-[#1C1917]/10`
            : `bg-white/40 backdrop-blur-sm shadow-sm ring-1 ring-black/[0.04] hover:bg-white/15`
          }`}
         >
          <div className="min-w-0 flex-1">
           <div className="flex items-center gap-2">
            <span className="text-base font-black text-[#1C1917] truncate">{r.name}</span>
            <span className="text-xs font-semibold text-[#A8A29E] uppercase tracking-wide">({r.city})</span>
           </div>
           <p className="text-xs font-medium text-[#78716C] truncate mt-1">{reasons[0]}</p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
           <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
             <div className={`text-xl font-black tabular-nums ${textColor}`}>{score}</div>
             <div className="w-16 h-1.5 bg-[#E7E5E0] rounded-full overflow-hidden">
              <div className={`h-full ${scoreColor} transition-all duration-500`} style={{ width: `${score}%` }} />
             </div>
            </div>
           </div>
           <div className="w-24 text-right">
             <Pill tone={s === "Healthy" ? "teal" : s === "Watch" ? "amber" : "red"}>{s}</Pill>
           </div>
          </div>
         </button>
        );
       })}
      </div>

      <Pagination
       currentPage={currentPage}
       totalPages={totalPages}
       onPageChange={setCurrentPage}
       totalItems={filteredHealth.length}
       pageSize={pageSize}
      />
     </Card>
    </div>

    <div className="space-y-6 lg:col-span-5">
     {selectedHealth ? (
      <Card tone="intel" className="border-l-4">
       <SectionTitle hint={`Selected: ${selectedHealth.restaurant.name}`}>Store Analysis</SectionTitle>
       <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E7E5E0] pb-3">
         <span className="text-xl font-black text-[#1C1917]">{selectedHealth.restaurant.name}</span>
         <Pill tone={selectedHealth.state === "Healthy" ? "teal" : selectedHealth.state === "Watch" ? "amber" : "red"}>{selectedHealth.state}</Pill>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
         <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-4 flex flex-col justify-center items-center text-center">
          <div className="text-[10px] font-black tracking-widest text-[#A8A29E] uppercase mb-1">Health Score</div>
          <div className={`text-5xl font-black tabular-nums tracking-tighter ${selectedHealth.score >= 85 ? "text-[#15803D]" : selectedHealth.score >= 70 ? "text-[#B45309]" : "text-[#B91C1C]"}`}>
           {selectedHealth.score}
          </div>
         </div>
         <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-4 flex flex-col justify-center">
          <div className="text-[10px] font-black tracking-widest text-[#A8A29E] uppercase mb-1">Ownership Model</div>
          <div className="text-lg font-bold text-[#1C1917] truncate">{selectedHealth.restaurant.ownership}</div>
         </div>
        </div>

        <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5 space-y-3">
         <div className="text-[10px] font-bold uppercase tracking-wider text-[#A8A29E] mb-2">Root Cause Insights</div>
         <ul className="space-y-3 font-medium text-[#44403C] text-sm">
          {selectedReasons.map((r, i) => (
           <li key={i} className="flex gap-3 items-start">
            <div className="w-1.5 h-1.5 rounded-full bg-[#881337] mt-1.5 shrink-0" />
            <span className="leading-snug">{r}</span>
           </li>
          ))}
         </ul>
        </div>
       </div>
      </Card>
     ) : null}
    </div>
   </div>
  </>
 );
}

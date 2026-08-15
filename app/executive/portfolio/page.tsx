"use client";

import { useState } from "react";
import { Card, SectionTitle, Pill, stateTone, Pagination } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export default function ExecutivePortfolioPage() {
 const { derived: d } = usePrive();
 const e = d.enterprise;
 const [currentPage, setCurrentPage] = useState(1);
 const pageSize = 10;

 const totalPages = Math.ceil(d.health.length / pageSize);
 const paginatedHealth = d.health.slice((currentPage - 1) * pageSize, currentPage * pageSize);

 const healthyCount = d.health.filter(x => x.state === "Healthy").length;
 const watchCount = d.health.filter(x => x.state === "Watch").length;
 const actionCount = d.health.filter(x => x.state === "Action Required" || x.state === "Critical").length;

 return (
  <>
   <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div>
     <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337] mb-2">Enterprise · Portfolio Health</p>
     <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">Portfolio Health</h1>
     <p className="mt-2 max-w-3xl text-sm font-medium text-[#78716C]">All 12 locations ranked by composite health score.</p>
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
   
   <div className="grid gap-5">
    <Card>
     <SectionTitle hint={`${e.atRiskStores} need attention`}>Portfolio Health Rankings ({d.health.length} Locations)</SectionTitle>
     <div className="space-y-2 mt-4">
      {paginatedHealth.map((h, i) => {
       const rank = (currentPage - 1) * pageSize + i + 1;
       const bgClass = i % 2 === 0 ? "bg-white" : "bg-white/30";
       const scoreColor = h.score >= 85 ? "bg-[#15803D]" : h.score >= 70 ? "bg-[#B45309]" : "bg-[#B91C1C]";
       const textColor = h.score >= 85 ? "text-[#15803D]" : h.score >= 70 ? "text-[#B45309]" : "text-[#B91C1C]";

       return (
        <div key={h.restaurant.id} className={`flex items-center justify-between gap-4 rounded-2xl p-4 shadow-lg ring-1 ring-black/[0.04] ${bgClass}`}>
         <div className="flex items-center gap-4">
          <div className="text-lg font-black text-[#A8A29E] w-6 text-center tabular-nums">#{rank}</div>
          <div>
           <div className="text-base font-black text-[#1C1917]">{h.restaurant.name}</div>
           <div className="text-xs font-semibold text-[#A8A29E] mt-0.5 uppercase tracking-wide">{h.restaurant.city} · {h.restaurant.ownership}</div>
          </div>
         </div>
         <div className="flex items-center gap-6">
          <div className="flex flex-col items-end gap-1">
           <div className="flex items-center gap-3">
            <div className={`text-2xl font-black tabular-nums ${textColor}`}>{h.score}</div>
            <div className="w-20 h-1.5 bg-[#E7E5E0] rounded-full overflow-hidden">
             <div className={`h-full ${scoreColor} transition-all duration-500`} style={{ width: `${h.score}%` }} />
            </div>
           </div>
           <div className="text-[9px] font-black text-[#A8A29E] uppercase tracking-widest mr-[92px]">Health</div>
          </div>
          <div className="w-24 text-right">
           <Pill tone={stateTone(h.state)}>{h.state}</Pill>
          </div>
         </div>
        </div>
       );
      })}
     </div>

     <div className="mt-4">
      <Pagination
       currentPage={currentPage}
       totalPages={totalPages}
       onPageChange={setCurrentPage}
       totalItems={d.health.length}
       pageSize={pageSize}
      />
     </div>
    </Card>
   </div>
  </>
 );
}

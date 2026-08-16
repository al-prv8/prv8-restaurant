"use client";

import { useState } from "react";
import { Card, Pill, SectionTitle, PageTabs, Pagination, KpiRow, DataTable, THead, Th, Tr, Td, StatusDot } from "@/components/prive/ui";
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
 const [compareStoreId, setCompareStoreId] = useState<string>("mt-clt-01");
 const pageSize = 10;

 const selectedHealth = d.health.find((x) => x.restaurant.id === state.regionalRestaurantId) ?? d.health[0];
 const compareHealth = d.health.find((x) => x.restaurant.id === compareStoreId);
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
    
    <KpiRow items={[
     { label: 'Healthy', value: String(healthyCount), tone: 'good' },
     { label: 'Watch List', value: String(watchCount), tone: 'warn' },
     { label: 'Action Reqd', value: String(actionCount), tone: 'bad' }
    ]} />
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

    {/* Cross-Location Readiness Bar Chart */}
    <div className="lg:col-span-12">
     <div className="rounded-xl bg-white border border-[#E7E5E0] shadow-sm p-5">
      <div className="flex items-center justify-between border-b border-[#E7E5E0] pb-3 mb-5">
       <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#881337]">Cross-Location Comparison</div>
        <div className="text-base font-black text-[#1C1917]">All 12 Locations — Composite Readiness Score</div>
       </div>
       <div className="flex items-center gap-4 text-[11px] font-bold text-[#78716C]">
        <span className="flex items-center gap-1.5"><span className="inline-block size-2 rounded-full bg-[#15803D]" />≥85 Healthy</span>
        <span className="flex items-center gap-1.5"><span className="inline-block size-2 rounded-full bg-[#B45309]" />70–84 Watch</span>
        <span className="flex items-center gap-1.5"><span className="inline-block size-2 rounded-full bg-[#B91C1C]" />&lt;70 Action</span>
       </div>
      </div>
      <div className="space-y-2">
       {[...d.health]
        .sort((a, b) => b.score - a.score)
        .map(({ restaurant: r, score, state: s }) => {
         const isSelected = r.id === (selectedHealth?.restaurant.id ?? "");
         const color = score >= 85 ? "#15803D" : score >= 70 ? "#B45309" : "#B91C1C";
         const pct = Math.round((score / 100) * 100);
         return (
          <div
           key={r.id}
           onClick={() => dispatch({ type: "regionalRestaurant", id: r.id })}
           className={`flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors ${isSelected ? "bg-[#F7F5F2] ring-1 ring-[#881337]/30" : "hover:bg-[#F7F5F2]"}`}
          >
           <div className="w-36 shrink-0 text-[11px] font-bold text-[#1C1917] truncate">{r.name}</div>
           <div className="flex-1 h-4 bg-[#F3F2F0] rounded-full overflow-hidden">
            <div
             className="h-full rounded-full transition-all"
             style={{ width: `${pct}%`, backgroundColor: color }}
            />
           </div>
           <div className="w-10 shrink-0 text-right text-[11px] font-black tabular-nums" style={{ color }}>{score}</div>
           <div className="w-20 shrink-0">
            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
             s === "Healthy" ? "bg-[#15803D]/10 text-[#15803D]" :
             s === "Watch" ? "bg-[#B45309]/10 text-[#B45309]" :
             "bg-[#B91C1C]/10 text-[#B91C1C]"
            }`}>{s}</span>
           </div>
          </div>
         );
        })}
      </div>
     </div>
    </div>

    <div className="space-y-6 lg:col-span-7">
     <Card>
      <SectionTitle hint={`${filteredHealth.length} Stores`}>Location Health Matrix</SectionTitle>
      <DataTable>
       <THead>
        <Tr>
         <Th>#</Th>
         <Th>Location</Th>
         <Th>City</Th>
         <Th>Health Score</Th>
         <Th>Status</Th>
         <Th>Labor Δ</Th>
         <Th>Turnover Δ</Th>
        </Tr>
       </THead>
       <tbody>
        {paginatedHealth.map(({ restaurant: r, score, state: s }, i) => {
         const isSelected = r.id === (selectedHealth?.restaurant.id ?? "");
         return (
          <Tr
           key={r.id}
           onClick={() => dispatch({ type: "regionalRestaurant", id: r.id })}
           selected={isSelected}
           className="cursor-pointer hover:bg-[#F7F5F2]"
          >
           <Td className="text-[#A8A29E]">{(currentPage - 1) * pageSize + i + 1}</Td>
           <Td className="font-bold text-[#1C1917]">{r.name}</Td>
           <Td>{r.city}</Td>
           <Td>
            <div className="flex items-center gap-2">
             <span className={`font-black tabular-nums ${score >= 85 ? "text-[#15803D]" : score >= 70 ? "text-[#B45309]" : "text-[#B91C1C]"}`}>{score}</span>
            </div>
           </Td>
           <Td>
            <StatusDot tone={s === "Healthy" ? "good" : s === "Watch" ? "warn" : "bad"} />
            <span className="ml-1">{s}</span>
           </Td>
           <Td>{r.laborDelta > 0 ? `+${r.laborDelta}` : r.laborDelta}%</Td>
           <Td>{r.turnoverDelta > 0 ? `+${r.turnoverDelta}` : r.turnoverDelta}%</Td>
          </Tr>
         );
        })}
       </tbody>
      </DataTable>

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
     {/* Dual Store Comparison Glass HUD Trigger / Panel */}
     <div className="rounded-xl bg-white border border-[#E7E5E0] p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-[#E7E5E0] pb-3">
       <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#881337]">Regional Intelligence</div>
        <div className="text-base font-black text-[#1C1917]">Side-by-Side Store Comparison</div>
       </div>
       <Pill tone="teal">Dual Store HUD</Pill>
      </div>

      <div className="grid grid-cols-2 gap-3">
       <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-[#A8A29E] block mb-1">Store A</label>
        <div className="rounded-xl bg-white/80 border border-white/80 p-2.5 text-xs font-bold text-[#1C1917]">
         {selectedHealth.restaurant.name}
        </div>
       </div>

       <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-[#A8A29E] block mb-1">Compare vs Store B</label>
        <select
         value={compareStoreId}
         onChange={(e) => setCompareStoreId(e.target.value)}
         className="w-full rounded-xl bg-white/80 border border-white/80 p-2 text-xs font-bold text-[#1C1917] outline-none"
        >
         {d.health.map((h) => (
          <option key={h.restaurant.id} value={h.restaurant.id}>
           {h.restaurant.name} ({h.score} pts)
          </option>
         ))}
        </select>
       </div>
      </div>

      {compareHealth ? (
       <div className="space-y-3 pt-2">
        <div className="grid grid-cols-2 gap-3 text-center">
         <div className="rounded-xl bg-white/50 p-3 border border-white/60">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] mb-1">{selectedHealth.restaurant.name}</div>
          <div className={`text-3xl font-black tabular-nums ${selectedHealth.score >= 85 ? "text-[#15803D]" : selectedHealth.score >= 70 ? "text-[#B45309]" : "text-[#B91C1C]"}`}>
           {selectedHealth.score}
          </div>
          <div className="text-[11px] font-medium text-[#78716C] mt-1">Labor: +{selectedHealth.restaurant.laborDelta} pts</div>
         </div>

         <div className="rounded-xl bg-white/50 p-3 border border-white/60">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] mb-1">{compareHealth.restaurant.name}</div>
          <div className={`text-3xl font-black tabular-nums ${compareHealth.score >= 85 ? "text-[#15803D]" : compareHealth.score >= 70 ? "text-[#B45309]" : "text-[#B91C1C]"}`}>
           {compareHealth.score}
          </div>
          <div className="text-[11px] font-medium text-[#78716C] mt-1">Labor: +{compareHealth.restaurant.laborDelta} pts</div>
         </div>
        </div>

        <div className="rounded-xl bg-[#881337]/5 border border-[#881337]/15 p-3 text-xs font-medium text-[#881337]">
         <span className="font-bold">Variance Analysis · </span>
         {selectedHealth.score > compareHealth.score
          ? `${selectedHealth.restaurant.name} leads by +${selectedHealth.score - compareHealth.score} pts in overall operational stability.`
          : `${compareHealth.restaurant.name} leads by +${compareHealth.score - selectedHealth.score} pts. Transfer surplus inventory to balance.`}
        </div>
       </div>
      ) : null}
     </div>

     {selectedHealth ? (
      <Card tone="intel" >
       <SectionTitle hint={`Selected: ${selectedHealth.restaurant.name}`}>Store Analysis</SectionTitle>
       <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E7E5E0] pb-3">
         <span className="text-xl font-black text-[#1C1917]">{selectedHealth.restaurant.name}</span>
         <Pill tone={selectedHealth.state === "Healthy" ? "teal" : selectedHealth.state === "Watch" ? "amber" : "red"}>{selectedHealth.state}</Pill>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl bg-white border border-[#E7E5E0] p-4 shadow-sm flex flex-col justify-center items-center text-center">
          <div className="text-[10px] font-black tracking-widest text-[#A8A29E] uppercase mb-1">Health Score</div>
          <div className={`text-5xl font-black tabular-nums tracking-tighter ${selectedHealth.score >= 85 ? "text-[#15803D]" : selectedHealth.score >= 70 ? "text-[#B45309]" : "text-[#B91C1C]"}`}>
           {selectedHealth.score}
          </div>
         </div>
          <div className="rounded-xl bg-white border border-[#E7E5E0] p-4 shadow-sm flex flex-col justify-center">
          <div className="text-[10px] font-black tracking-widest text-[#A8A29E] uppercase mb-1">Ownership Model</div>
          <div className="text-lg font-bold text-[#1C1917] truncate">{selectedHealth.restaurant.ownership}</div>
         </div>
        </div>

         <div className="rounded-xl bg-white border border-[#E7E5E0] p-4 shadow-sm space-y-3">
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

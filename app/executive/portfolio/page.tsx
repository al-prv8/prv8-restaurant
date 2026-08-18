"use client";

import { useState } from "react";
import { Card, SectionTitle, Pill, stateTone, Pagination, KpiRow, DataTable, THead, Th, Tr, Td, PriveIntelBanner } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export default function ExecutivePortfolioPage() {
 const { derived: d } = usePrive();
 const e = d.enterprise;
 const [currentPage, setCurrentPage] = useState(1);
 const [sortBy, setSortBy] = useState<"score" | "name" | "city">("score");
 const pageSize = 10;

 const sortedHealth = [...d.health].sort((a, b) => {
  if (sortBy === "score") return b.score - a.score;
  if (sortBy === "name") return a.restaurant.name.localeCompare(b.restaurant.name);
  if (sortBy === "city") return a.restaurant.city.localeCompare(b.restaurant.city);
  return 0;
 });

 const totalPages = Math.ceil(sortedHealth.length / pageSize);
 const paginatedHealth = sortedHealth.slice((currentPage - 1) * pageSize, currentPage * pageSize);

 const healthyCount = d.health.filter(x => x.state === "Healthy").length;
 const watchCount = d.health.filter(x => x.state === "Watch").length;
 const actionCount = d.health.filter(x => x.state === "Action Required" || x.state === "Critical").length;

 return (
  <>
   <div className="mb-8">
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337] mb-2">Enterprise · Portfolio Health</p>
    <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">Portfolio Health</h1>
    <p className="mt-2 max-w-3xl text-sm font-medium text-[#78716C]">All 12 locations ranked by composite health score.</p>
   </div>

   <KpiRow items={[
    { label: "Healthy", value: healthyCount.toString(), tone: "good" },
    { label: "Watch List", value: watchCount.toString(), tone: "warn" },
    { label: "Action Reqd", value: actionCount.toString(), tone: "bad" }
   ]} />

   <PriveIntelBanner
    summary={`${actionCount} location${actionCount !== 1 ? "s" : ""} require immediate executive attention. Combined recovery opportunity estimated at $42,000 in EBITDA over 90 days.`}
    details={[
     "Charlotte #03 (58% health): 6-week decline driven by turnover. Priority: retention bonus + GM review.",
     `${healthyCount} of 12 locations are healthy, outperforming the national franchise benchmark of 65%.`,
     "Ballantyne #02 leads the portfolio at 96% health, +8.2% sales vs plan.",
    ]}
   />
   
   <div className="grid gap-5">
    <Card>
     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E5E0] pb-4 mb-4">
      <SectionTitle hint={`${e.atRiskStores} need attention`}>Portfolio Health Rankings ({d.health.length} Locations)</SectionTitle>
      
      {/* Sorting Control Buttons */}
      <div className="flex items-center gap-2">
       <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8A29E]">Sort By:</span>
       <button
        type="button"
        onClick={() => setSortBy("score")}
        className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
         sortBy === "score" ? "bg-[#881337] text-white border border-[#881337]" : "border border-[#E7E5E0] text-[#78716C] hover:bg-[#F7F5F2]"
        }`}
       >
        Health Score
       </button>
       <button
        type="button"
        onClick={() => setSortBy("name")}
        className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
         sortBy === "name" ? "bg-[#881337] text-white border border-[#881337]" : "border border-[#E7E5E0] text-[#78716C] hover:bg-[#F7F5F2]"
        }`}
       >
        Store Name
       </button>
       <button
        type="button"
        onClick={() => setSortBy("city")}
        className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
         sortBy === "city" ? "bg-[#881337] text-white border border-[#881337]" : "border border-[#E7E5E0] text-[#78716C] hover:bg-[#F7F5F2]"
        }`}
       >
        City
       </button>
      </div>
     </div>

     <DataTable>
      <THead>
       <tr>
        <Th>Rank</Th>
        <Th>Location</Th>
        <Th>City</Th>
        <Th>Ownership</Th>
        <Th>Health Score</Th>
        <Th>Status</Th>
       </tr>
      </THead>
      <tbody>
       {paginatedHealth.map((h, i) => {
        const rank = (currentPage - 1) * pageSize + i + 1;
        const scoreColor = h.score >= 85 ? "bg-[#15803D]" : h.score >= 70 ? "bg-[#B45309]" : "bg-[#B91C1C]";
        const textColor = h.score >= 85 ? "text-[#15803D]" : h.score >= 70 ? "text-[#B45309]" : "text-[#B91C1C]";

        return (
         <Tr key={h.restaurant.id}>
          <Td className="font-black text-[#A8A29E]">#{rank}</Td>
          <Td className="font-black text-[#1C1917]">{h.restaurant.name}</Td>
          <Td className="font-semibold text-[#78716C]">{h.restaurant.city}</Td>
          <Td className="font-semibold text-[#78716C]">{h.restaurant.ownership}</Td>
          <Td>
           <div className="flex items-center gap-3">
            <div className={`text-lg font-black tabular-nums ${textColor}`}>{h.score}</div>
            <div className="w-20 h-1.5 bg-[#E7E5E0] rounded-full overflow-hidden">
             <div className={`h-full ${scoreColor} transition-all duration-500`} style={{ width: `${h.score}%` }} />
            </div>
           </div>
          </Td>
          <Td>
           <Pill tone={stateTone(h.state)}>{h.state}</Pill>
          </Td>
         </Tr>
        );
       })}
      </tbody>
     </DataTable>

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

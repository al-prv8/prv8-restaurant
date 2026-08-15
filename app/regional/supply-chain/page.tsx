"use client";

import { useState } from "react";
import { Truck } from "lucide-react";
import { Card, SectionTitle, Button, Pill, PriveIntelBanner, Pagination } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export default function RegionalSupplyChainPage() {
 const { state, derived: d, dispatch } = usePrive();
 const [currentPage, setCurrentPage] = useState(1);
 const pageSize = 5;

 const totalPages = Math.ceil(d.supplyChain.length / pageSize);
 const paginatedSupplyChain = d.supplyChain.slice((currentPage - 1) * pageSize, currentPage * pageSize);

 const locationsWithRisk = d.supplyChain.filter(s => s.avocadoShortage > 0 || s.shortSkus > 0).length;
 const criticalItems = d.supplyChain.reduce((acc, curr) => acc + curr.shortSkus, 0);

 return (
  <>
   <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div>
     <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337] mb-2">Carolinas Region · Supply Chain</p>
     <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">Supply Chain Risk</h1>
     <p className="mt-2 max-w-3xl text-sm font-medium text-[#78716C]">
      Cross-location inventory exposure, supplier delivery cutoffs, and inter-store transfer opportunities.
     </p>
    </div>
    
    <div className="flex gap-3">
     <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] py-3 flex flex-col justify-center min-w-[120px]">
      <div className="text-3xl font-black text-[#B91C1C] leading-none mb-1">{locationsWithRisk}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-[#78716C] leading-tight">Locations<br/>At Risk</div>
     </div>
     <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] py-3 flex flex-col justify-center min-w-[120px]">
      <div className="text-3xl font-black text-[#B45309] leading-none mb-1">{criticalItems}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-[#78716C] leading-tight">Critical<br/>SKUs Short</div>
     </div>
    </div>
   </div>

   <div className="mb-6 rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-0 overflow-hidden">
    <PriveIntelBanner
     summary={`Carolina Produce supply chain active across 12 locations. Avocado shortage projected for weekend LTO.`}
     details={[
      "Avocado shortage identified across 3 stores due to unexpected LTO demand surge.",
      "Recommended Action: Increase Friday regional avocado order by 14% to prevent weekend menu outages.",
     ]}
     action={!state.avocadoOrderIncreased ? () => dispatch({ type: "increaseAvocadoOrder" }) : undefined}
     actionLabel={!state.avocadoOrderIncreased ? "Increase Friday Avocado Order +14%" : undefined}
    />
   </div>

   <div className="space-y-6">
    <Card>
     <SectionTitle hint={`${d.supplyChain.length} Locations`}>Cross-Location Supply Chain Status</SectionTitle>
     <div className="space-y-3">
      {paginatedSupplyChain.map((s) => {
       const hasRisk = s.avocadoShortage > 0 || s.belowPar;
       
       return (
        <div key={s.restaurant.id} className={`flex items-center justify-between gap-3 rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-4`}>
         <div>
          <div className="text-base font-black text-[#1C1917]">{s.restaurant.name}</div>
          <div className="text-sm font-medium text-[#78716C] mt-1">
           {s.shortSkus} SKU(s) projected short · Avocados: <span className={s.avocadoShortage > 0 ? "text-[#B91C1C] font-bold" : "text-[#15803D] font-bold"}>{s.avocadoShortage > 0 ? `short ${s.avocadoShortage} cases` : "covers demand"}</span>
          </div>
         </div>
         <div className="text-right">
          <Pill tone={s.avocadoShortage > 0 ? "red" : s.belowPar ? "amber" : "teal"}>{s.belowPar ? "Below Par" : "At Par"}</Pill>
         </div>
        </div>
       );
      })}
     </div>

     <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      totalItems={d.supplyChain.length}
      pageSize={pageSize}
     />

     <div className="mt-6 pt-4 border-t border-[#E7E5E0] flex flex-wrap gap-3">
      <Button
       variant="primary"
       onClick={() => dispatch({ type: "increaseAvocadoOrder" })}
       disabled={state.avocadoOrderIncreased}
       className="px-6 py-2.5"
      >
       <Truck className="size-4 mr-2" />
       {state.avocadoOrderIncreased ? "Friday Order Increased +14% (Confirmed)" : "Increase Regional Avocado Order 14%"}
      </Button>
     </div>
    </Card>
   </div>
  </>
 );
}

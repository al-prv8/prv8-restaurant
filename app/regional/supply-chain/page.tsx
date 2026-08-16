"use client";

import { useState } from "react";
import { Truck } from "lucide-react";
import { Card, SectionTitle, Button, Pill, PriveIntelBanner, Pagination, KpiRow, DataTable, THead, Th, Tr, Td, StatusDot } from "@/components/prive/ui";
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
    
    <KpiRow items={[
     { label: 'Locations At Risk', value: String(locationsWithRisk), tone: 'bad' },
     { label: 'Critical SKUs Short', value: String(criticalItems), tone: 'warn' }
    ]} />
   </div>

   <div className="mb-6">
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

   {/* Cross-Location Transit Distance & Route Visualizer */}
   <div className="mb-6 rounded-xl bg-white border border-[#E7E5E0] p-5">
    <div className="flex items-center justify-between border-b border-[#E7E5E0] pb-3 mb-4">
     <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#881337]">Inter-Store Inventory Logistics</div>
      <div className="text-base font-black text-[#1C1917]">Recommended Cross-Store Transfer Route</div>
     </div>
     <Pill tone={state.transferRequested ? "teal" : "amber"}>
      {state.transferRequested ? "Transfer Dispatched" : "Transfer Available"}
     </Pill>
    </div>

    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg bg-[#F7F5F2] border border-[#E7E5E0] p-4">
     <div className="flex items-center gap-3">
      <div className="size-10 rounded-xl bg-[#881337]/10 flex items-center justify-center text-[#881337] font-black">
       <Truck className="size-5" />
      </div>
      <div>
       <div className="text-sm font-black text-[#1C1917]">Charlotte #01 ➔ Ballantyne #02</div>
       <div className="text-xs font-medium text-[#78716C]">11 miles · 18 min transit delivery · 35 lbs Russet Potatoes</div>
      </div>
     </div>

     <Button
      variant="primary"
      onClick={() => dispatch({ type: "transferInventory", lbs: 35 })}
      disabled={state.transferRequested}
      className="shrink-0 text-xs px-4 py-2 font-bold"
     >
      {state.transferRequested ? "✓ Transfer Dispatched (18 min)" : "Dispatch Transfer (18 min)"}
     </Button>
    </div>
   </div>

   <div className="space-y-6">
    <Card>
     <SectionTitle hint={`${d.supplyChain.length} Locations`}>Cross-Location Supply Chain Status</SectionTitle>
     <DataTable>
      <THead>
       <Tr>
        <Th>Location</Th>
        <Th>Short SKUs</Th>
        <Th>Avocado Status</Th>
        <Th>Par Level</Th>
       </Tr>
      </THead>
      <tbody>
       {paginatedSupplyChain.map((s) => {
        return (
         <Tr key={s.restaurant.id}>
          <Td className="font-bold text-[#1C1917]">{s.restaurant.name}</Td>
          <Td>{s.shortSkus}</Td>
          <Td>
           {s.avocadoShortage > 0 ? (
            <span className="text-[#B91C1C] font-bold">Short {s.avocadoShortage} cases</span>
           ) : (
            <span className="text-[#15803D] font-bold">Covers Demand</span>
           )}
          </Td>
          <Td>
           <Pill tone={s.avocadoShortage > 0 ? "red" : s.belowPar ? "amber" : "teal"}>{s.belowPar ? "Below Par" : "At Par"}</Pill>
          </Td>
         </Tr>
        );
       })}
      </tbody>
     </DataTable>

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

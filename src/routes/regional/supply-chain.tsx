import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Truck, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, SectionTitle, Button, Pill, PriveIntelBanner, Pagination } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export const Route = createFileRoute("/regional/supply-chain")({
  head: () => ({ meta: [{ title: "Supply Chain — Regional · Privé" }] }),
  component: RegionalSupplyChainPage,
});

function RegionalSupplyChainPage() {
  const { state, derived: d, dispatch } = usePrive();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.ceil(d.supplyChain.length / pageSize);
  const paginatedSupplyChain = d.supplyChain.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Supply Chain & Inventory Risk</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#101828]/60">
          Cross-location inventory exposure, supplier delivery cutoffs, and inter-store transfer opportunities.
        </p>
      </div>

      <PriveIntelBanner
        summary={`Carolina Produce supply chain active across 12 locations. Avocado shortage projected for weekend LTO.`}
        details={[
          "Avocado shortage identified across 3 stores due to unexpected LTO demand surge.",
          "Recommended Action: Increase Friday regional avocado order by 14% to prevent weekend menu outages.",
        ]}
        action={!state.avocadoOrderIncreased ? () => dispatch({ type: "increaseAvocadoOrder" }) : undefined}
        actionLabel={!state.avocadoOrderIncreased ? "Increase Friday Avocado Order +14%" : undefined}
      />

      <div className="space-y-6">
        <Card>
          <SectionTitle hint={`${d.supplyChain.length} Locations`}>Cross-Location Supply Chain Status</SectionTitle>
          <div className="space-y-2.5">
            {paginatedSupplyChain.map((s) => (
              <div key={s.restaurant.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#101828]/8 bg-white p-3.5 shadow-xs">
                <div>
                  <div className="text-sm font-bold text-[#101828]">{s.restaurant.name}</div>
                  <div className="text-xs font-semibold text-[#101828]/55 mt-0.5">
                    {s.shortSkus} SKU(s) projected short · Avocados: {s.avocadoShortage > 0 ? `short ${s.avocadoShortage} cases` : "covers demand"}
                  </div>
                </div>
                <Pill tone={s.avocadoShortage > 0 ? "amber" : "teal"}>{s.belowPar ? "Below Par" : "At Par"}</Pill>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={d.supplyChain.length}
            pageSize={pageSize}
          />

          <div className="mt-4 pt-3 border-t border-[#101828]/8 flex flex-wrap gap-2">
            <Button
              variant="primary"
              onClick={() => dispatch({ type: "increaseAvocadoOrder" })}
              disabled={state.avocadoOrderIncreased}
            >
              <Truck className="size-3.5" />
              {state.avocadoOrderIncreased ? "Friday Order Increased +14% (Confirmed)" : "Increase Regional Avocado Order 14%"}
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

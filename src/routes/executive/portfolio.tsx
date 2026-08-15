import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card, SectionTitle, Pill, stateTone, Pagination } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export const Route = createFileRoute("/executive/portfolio")({
  head: () => ({ meta: [{ title: "Portfolio Health — Executive · Privé" }] }),
  component: ExecutivePortfolioPage,
});

function ExecutivePortfolioPage() {
  const { derived: d } = usePrive();
  const e = d.enterprise;
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil(d.health.length / pageSize);
  const paginatedHealth = d.health.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Portfolio Health</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#101828]/60">All 12 locations ranked by composite health score.</p>
      </div>
      
      <div className="grid gap-5">
        <Card>
          <SectionTitle hint={`${e.atRiskStores} need attention`}>Portfolio Health Rankings ({d.health.length} Locations)</SectionTitle>
          <div className="space-y-2.5">
            {paginatedHealth.map((h) => (
              <div key={h.restaurant.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#101828]/8 bg-white p-3.5 shadow-xs">
                <div>
                  <div className="text-sm font-bold text-[#101828]">{h.restaurant.name}</div>
                  <div className="text-xs font-semibold text-[#101828]/50">{h.restaurant.city} · {h.restaurant.ownership}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-base font-extrabold tabular-nums text-[#5146E5]">{h.score}</div>
                    <div className="text-[10px] font-bold text-[#101828]/40 uppercase">Score</div>
                  </div>
                  <Pill tone={stateTone(h.state)}>{h.state}</Pill>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={d.health.length}
            pageSize={pageSize}
          />
        </Card>
      </div>
    </>
  );
}

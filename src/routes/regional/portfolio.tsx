import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card, Pill, SectionTitle, PageTabs, Pagination } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";
import type { Restaurant } from "@/lib/prive/data";

export const Route = createFileRoute("/regional/portfolio")({
  head: () => ({ meta: [{ title: "Carolinas Portfolio — Regional · Privé" }] }),
  component: RegionalPortfolioPage,
});

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

function RegionalPortfolioPage() {
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

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Carolinas Portfolio</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#101828]/60">
          12 locations across Charlotte, Raleigh & Greensboro — composite health scores updated continuously.
        </p>
      </div>

      <PageTabs
        tabs={[
          { id: "all", label: "All 12 Locations" },
          { id: "healthy", label: "Healthy Locations", badge: d.health.filter((x) => x.state === "Healthy").length },
          { id: "action", label: "Action / Watch Needed", badge: d.health.filter((x) => x.state !== "Healthy").length },
        ]}
        active={activeTab}
        onChange={(tab) => {
          setActiveTab(tab);
          setCurrentPage(1);
        }}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Card>
            <SectionTitle hint={`${filteredHealth.length} Stores`}>Location Health Matrix</SectionTitle>
            <div className="space-y-2.5">
              {paginatedHealth.map(({ restaurant: r, score, state: s }) => {
                const isSelected = r.id === (selectedHealth?.restaurant.id ?? "");
                const reasons = getStoreReasons(r, s);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => dispatch({ type: "regionalRestaurant", id: r.id })}
                    className={`w-full flex items-center justify-between gap-3 rounded-xl border p-3.5 text-left text-sm transition-all ${
                      isSelected
                        ? "border-[#5146E5] bg-[#5146E5]/10 shadow-xs"
                        : "border-[#101828]/8 bg-white hover:bg-[#101828]/5"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#101828] truncate">{r.name}</span>
                        <span className="text-xs text-[#101828]/50">({r.city})</span>
                      </div>
                      <p className="text-xs text-[#101828]/60 truncate mt-0.5">{reasons[0]}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-base font-extrabold tabular-nums text-[#5146E5]">{score}</div>
                        <div className="text-[10px] text-[#101828]/50 font-bold uppercase">Health</div>
                      </div>
                      <Pill tone={s === "Healthy" ? "teal" : s === "Watch" ? "amber" : "red"}>{s}</Pill>
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
          <Card tone="intel">
            <SectionTitle hint={`Selected: ${selectedHealth.restaurant.name}`}>Store Analysis</SectionTitle>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#101828]/8 pb-2">
                <span className="text-sm font-bold text-[#101828]">{selectedHealth.restaurant.name}</span>
                <Pill tone={selectedHealth.state === "Healthy" ? "teal" : "amber"}>{selectedHealth.state}</Pill>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-white border border-[#101828]/8 p-2.5">
                  <div className="text-[10px] font-bold text-[#101828]/50 uppercase">Health Score</div>
                  <div className="text-xl font-bold tabular-nums text-[#5146E5]">{selectedHealth.score} / 100</div>
                </div>
                <div className="rounded-lg bg-white border border-[#101828]/8 p-2.5">
                  <div className="text-[10px] font-bold text-[#101828]/50 uppercase">General Manager</div>
                  <div className="text-sm font-bold text-[#101828] truncate">{selectedHealth.restaurant.gmName}</div>
                </div>
              </div>

              <div className="rounded-xl bg-[#101828]/[0.03] border border-[#101828]/8 p-3 text-xs space-y-1">
                <div className="font-bold text-[#101828]/50 uppercase text-[10px]">Root Cause Insights:</div>
                <ul className="space-y-1 font-medium text-[#101828]/80 list-disc pl-4">
                  {selectedReasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

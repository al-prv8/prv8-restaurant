import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, AlertTriangle, CheckCircle, Truck } from "lucide-react";
import { Card, Metric, Pill, SectionTitle, Button, PageTabs, PriveIntelBanner, Pagination } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export const Route = createFileRoute("/gm/inventory")({
  head: () => ({
    meta: [{ title: "Inventory — GM · Privé" }],
  }),
  component: GmInventory,
});

type Tab = "all" | "atRisk" | "healthy";

function GmInventory() {
  const { state, derived: d, dispatch } = usePrive();
  const [activeTab, setActiveTab] = useState<Tab>("all");
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Inventory & Depletion</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#101828]/60">
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

      <PageTabs
        tabs={[
          { id: "all", label: "All SKUs" },
          { id: "atRisk", label: "At-Risk SKUs", badge: riskItems.length },
          { id: "healthy", label: "Healthy SKUs", badge: healthyItems.length },
        ]}
        active={activeTab}
        onChange={(tab) => {
          setActiveTab(tab);
          setCurrentPageRisk(1);
          setCurrentPageHealthy(1);
        }}
      />

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Metric
            label="SKUs at Risk"
            value={`${riskItems.length}`}
            sub={`of ${d.depletion.length} tracked SKUs`}
            tone={riskItems.length ? "warn" : "good"}
          />
          <Metric
            label="Potato Shortage"
            value={d.potato.shortage > 0 ? `${d.potato.shortage} lbs` : "None"}
            sub={d.potato.depletionTime ? `Depletes at ${d.potato.depletionTime}` : "Covers forecast demand"}
            tone={d.potato.shortage > 0 ? "warn" : "good"}
          />
          <Metric
            label="On Hand"
            value={`${d.potato.onHand} lbs`}
            sub={`Par: ${d.potato.parLevel} lbs · Need: ${d.potato.projectedUsage} lbs`}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-6">
            {(activeTab === "all" || activeTab === "atRisk") && (
              <Card>
                <SectionTitle hint={`${riskItems.length} SKUs Flagged`}>At-Risk Inventory</SectionTitle>
                {riskItems.length === 0 ? (
                  <div className="rounded-xl border border-[#0F9D8A]/30 bg-[#0F9D8A]/10 p-4 text-sm font-semibold text-[#0B7A6C] flex items-center gap-2">
                    <CheckCircle className="size-4" /> Every tracked SKU covers forecast demand for tomorrow.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paginatedRisk.map((i) => (
                      <div key={i.itemId} className="rounded-xl border border-[#101828]/8 bg-white p-3.5 shadow-sm">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold">{i.name}</span>
                          <Pill tone={i.risk === "Critical" ? "red" : i.risk === "At Risk" ? "amber" : "neutral"}>
                            {i.risk}
                          </Pill>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-[#101828]/60 font-medium">
                          <span>On hand: <strong>{i.onHand} {i.unit}</strong></span>
                          <span>Projected use: <strong>{i.projectedUsage} {i.unit}</strong></span>
                          <span>
                            {i.shortage > 0 ? (
                              <span className="text-[#92400E] font-bold">Short: {i.shortage} {i.unit}</span>
                            ) : (
                              <span>Covers demand</span>
                            )}
                          </span>
                        </div>
                        {i.depletionTime ? (
                          <p className="mt-2 text-xs font-semibold text-[#B02A37] flex items-center gap-1.5">
                            <AlertTriangle className="size-3.5 shrink-0" /> Projected to deplete at {i.depletionTime} — {i.hoursToDepletion?.toFixed(1)}h into service
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

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    onClick={() =>
                      dispatch({ type: "increasePotatoOrder", lbs: Math.max(20, Math.ceil(d.potato.shortage)) })
                    }
                    disabled={d.potato.shortage === 0}
                  >
                    Increase Potato Order{d.potato.shortage > 0 ? ` +${Math.ceil(d.potato.shortage)} lbs` : ""}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => dispatch({ type: "transferInventory", lbs: 40 })}
                    disabled={state.transferRequested}
                  >
                    <Truck className="size-3.5" />
                    {state.transferRequested ? "Transfer Requested" : "Transfer 40 lbs from Charlotte #01"}
                  </Button>
                </div>
              </Card>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            {(activeTab === "all" || activeTab === "healthy") && healthyItems.length > 0 && (
              <Card>
                <SectionTitle hint={`${healthyItems.length} SKUs`}>Healthy Inventory</SectionTitle>
                <div className="space-y-2">
                  {paginatedHealthy.map((i) => (
                    <div
                      key={i.itemId}
                      className="flex items-center justify-between rounded-lg border border-[#101828]/8 bg-white p-3 text-sm"
                    >
                      <span className="text-[#101828]/70 font-medium">{i.name}</span>
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

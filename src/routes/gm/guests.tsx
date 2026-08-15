import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle, Gift } from "lucide-react";
import { Card, Metric, Pill, SectionTitle, Button, PageTabs, PriveIntelBanner, Pagination } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export const Route = createFileRoute("/gm/guests")({
  head: () => ({ meta: [{ title: "Guest Complaints — GM · Privé" }] }),
  component: GmGuests,
});

type Tab = "all" | "awaiting" | "resolved";

function GmGuests() {
  const { derived: d, dispatch } = usePrive();
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;

  const awaiting = d.gmComplaints.filter((c) => c.status === "Awaiting Approval");
  const resolved = d.gmComplaints.filter((c) => c.status === "Resolved" || c.status === "Rejected");

  const filteredComplaints = d.gmComplaints.filter((c) => {
    if (activeTab === "awaiting") return c.status === "Awaiting Approval";
    if (activeTab === "resolved") return c.status === "Resolved" || c.status === "Rejected";
    return true;
  });

  const totalPages = Math.ceil(filteredComplaints.length / pageSize);
  const paginatedComplaints = filteredComplaints.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Guest Complaint Center</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#101828]/60">
          Privé drafts guest responses and calculates recovery gift credits. No funds are issued without explicit GM approval.
        </p>
      </div>

      <PriveIntelBanner
        summary={`${awaiting.length} guest recovery draft(s) await GM approval. Privé has drafted responses and calculated single-use credits.`}
        details={[
          `Tomorrow's volume projects ${d.complaintForecast.expected} expected new complaint(s) (${d.complaintForecast.ratePer1000} per 1k transactions).`,
          "All recovery credits use cryptographic single-use tokens mapped to verified guest emails to prevent fraud.",
        ]}
      />

      <PageTabs
        tabs={[
          { id: "all", label: "All Complaints" },
          { id: "awaiting", label: "Awaiting Approval", badge: awaiting.length },
          { id: "resolved", label: "Resolved / Cleared", badge: resolved.length },
        ]}
        active={activeTab}
        onChange={(tab) => {
          setActiveTab(tab);
          setCurrentPage(1);
        }}
      />

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Metric label="Awaiting Approval" value={`${awaiting.length}`} sub="Guest recovery drafts" tone={awaiting.length ? "warn" : "good"} />
          <Metric label="Store Sentiment" value="4.4 ⭐" sub="Based on 142 reviews" tone="good" />
          <Metric label="Tomorrow Forecast" value={`${d.complaintForecast.expected} expected`} sub={`${d.complaintForecast.ratePer1000}/1k txns`} />
        </div>

        <Card>
          <SectionTitle hint={`${filteredComplaints.length} Complaints`}>Guest Feedback Queue</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            {paginatedComplaints.map((c) => (
              <div key={c.id} className="rounded-xl border border-[#101828]/10 bg-white p-4 shadow-xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 border-b border-[#101828]/8 pb-2">
                    <div>
                      <span className="font-bold text-sm text-[#101828]">{c.customer}</span>
                      <span className="text-xs text-[#101828]/50 ml-2">· {c.type}</span>
                    </div>
                    <Pill tone={c.status === "Awaiting Approval" ? "amber" : c.status === "Resolved" ? "teal" : "neutral"}>
                      {c.status}
                    </Pill>
                  </div>

                  <p className="text-xs text-[#101828]/80 font-medium italic">"{c.issueText}"</p>

                  <div className="rounded-lg bg-[#5146E5]/8 border border-[#5146E5]/20 p-3 text-xs space-y-1">
                    <span className="font-bold text-[#5146E5] uppercase text-[10px]">Privé Drafted Response:</span>
                    <p className="text-[#101828]/80 font-medium">{c.draftedResponse}</p>
                    <div className="text-[11px] font-bold text-[#0B7A6C] pt-1">
                      Recommended Credit: ${c.suggestedCredit}
                    </div>
                  </div>
                </div>

                {c.status === "Awaiting Approval" ? (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-[#101828]/8">
                    <Button
                      variant="primary"
                      onClick={() => dispatch({ type: "approveComplaint", id: c.id, amount: c.suggestedCredit })}
                      className="py-1.5 px-3 text-xs flex-1"
                    >
                      <Gift className="size-3.5" />
                      Approve & Send ${c.suggestedCredit} Credit
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => dispatch({ type: "rejectComplaint", id: c.id })}
                      className="py-1.5 px-3 text-xs"
                    >
                      Apology Only
                    </Button>
                  </div>
                ) : (
                  <div className="text-xs font-bold text-[#0B7A6C] flex items-center gap-1.5 pt-2 border-t border-[#101828]/8">
                    <CheckCircle className="size-4" /> Complaint resolved & logged in CRM.
                  </div>
                )}
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredComplaints.length}
            pageSize={pageSize}
          />
        </Card>
      </div>
    </>
  );
}

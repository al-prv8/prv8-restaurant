import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCircle2, Megaphone, ShieldCheck } from "lucide-react";
import { Card, Pill, SectionTitle, Button, PriveIntelBanner, Pagination } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export const Route = createFileRoute("/gm/communications")({
  head: () => ({ meta: [{ title: "Communications — GM · Privé" }] }),
  component: GmCommunications,
});

function GmCommunications() {
  const { derived: d, dispatch } = usePrive();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const unacknowledgedCount = d.comms.filter((c) => !c.acknowledged).length;
  const totalPages = Math.ceil(d.comms.length / pageSize);
  const paginatedComms = d.comms.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleAcknowledgeAll = () => {
    d.comms.forEach((c) => {
      if (!c.acknowledged) {
        dispatch({ type: "acknowledge", id: c.id, title: c.title });
      }
    });
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Corporate Communications</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#101828]/60">
          Corporate broadcasts, seasonal LTO launches, and policy updates requiring store manager sign-off.
        </p>
      </div>

      <PriveIntelBanner
        summary={`${unacknowledgedCount > 0 ? `${unacknowledgedCount} unacknowledged broadcast(s) require GM sign-off.` : "All corporate broadcasts and policy updates are acknowledged."}`}
        details={[
          "Unacknowledged high-priority broadcasts impact regional audit scores.",
          "Summer LTO prep checklist items must be distributed to shift leads before Friday.",
        ]}
        action={unacknowledgedCount > 0 ? handleAcknowledgeAll : undefined}
        actionLabel={unacknowledgedCount > 0 ? `Acknowledge All (${unacknowledgedCount})` : undefined}
      />

      <div className="space-y-6">
        <Card>
          <SectionTitle hint={`${d.comms.length} Broadcasts`}>Corporate Announcements & SOPs</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            {paginatedComms.map((a) => (
              <div key={a.id} className="rounded-xl border border-[#101828]/8 bg-white p-4 shadow-xs flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 border-b border-[#101828]/8 pb-2">
                    <span className="font-bold text-sm text-[#101828]">{a.title}</span>
                    <Pill tone={a.acknowledged ? "teal" : "amber"}>
                      {a.acknowledged ? "Acknowledged" : "Pending Sign-Off"}
                    </Pill>
                  </div>
                  <p className="text-xs text-[#101828]/50 font-semibold">
                    {a.from} · {a.date}
                  </p>
                  <p className="text-xs text-[#101828]/75 leading-relaxed font-medium">{a.summary}</p>
                </div>

                {!a.acknowledged ? (
                  <div className="pt-2 border-t border-[#101828]/8">
                    <Button
                      variant="primary"
                      onClick={() => dispatch({ type: "acknowledge", id: a.id, title: a.title })}
                      className="w-full py-1.5 text-xs"
                    >
                      <ShieldCheck className="size-3.5" />
                      Sign Off & Acknowledge
                    </Button>
                  </div>
                ) : (
                  <div className="text-xs font-bold text-[#0B7A6C] flex items-center gap-1.5 pt-2 border-t border-[#101828]/8">
                    <CheckCircle2 className="size-4" /> Signed off & recorded in audit ledger
                  </div>
                )}
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={d.comms.length}
            pageSize={pageSize}
          />
        </Card>
      </div>
    </>
  );
}

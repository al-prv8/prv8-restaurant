import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, SectionTitle, Button, Pill, Pagination } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export const Route = createFileRoute("/guest/credits")({
  head: () => ({ meta: [{ title: "Recovery Credits — Guest · Privé" }] }),
  component: GuestCreditsPage,
});

function GuestCreditsPage() {
  const { state, dispatch } = usePrive();
  const liveComplaint = state.complaints.find((c) => c.id.startsWith("c-live-"));
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const totalPages = Math.ceil(state.giftCredits.length / pageSize);
  const paginatedCredits = state.giftCredits.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Recovery Credits</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#101828]/60">Single-use dining credits issued after manager approval — fraud-controlled and tracked.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Card>
            <SectionTitle hint={`${state.giftCredits.length} Issued`}>Your Active & Redeemed Credits</SectionTitle>
            {state.giftCredits.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#101828]/15 p-6 text-center">
                <p className="text-sm font-semibold text-[#101828]/70">
                  No credits issued yet.
                </p>
                <p className="mt-1.5 text-xs text-[#101828]/50">
                  {liveComplaint
                    ? "Your GM is reviewing the recommendation — you'll be notified when it's approved."
                    : "Simulate a guest call in Guest Service, then approve the recovery in the GM command center."}
                </p>
                {!liveComplaint ? (
                  <div className="mt-4">
                    <Link to="/guest/service">
                      <Button variant="violet">Go to Guest Service</Button>
                    </Link>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="space-y-3">
                {paginatedCredits.map((g) => (
                  <div key={g.code} className="flex items-center justify-between gap-3 rounded-xl border border-[#101828]/8 bg-white p-4 shadow-sm">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-[#101828]">{g.code}</span>
                        <Pill tone={g.redeemed ? "neutral" : "teal"}>${g.amount} Credit</Pill>
                      </div>
                      <div className="text-xs text-[#101828]/55 mt-1">
                        Issued to {g.customer} · Valid through {g.expires}
                      </div>
                    </div>
                    <Button
                      variant={g.redeemed ? "ghost" : "primary"}
                      disabled={g.redeemed}
                      onClick={() => dispatch({ type: "redeemCredit", code: g.code })}
                    >
                      {g.redeemed ? "Redeemed" : "Redeem Now"}
                    </Button>
                  </div>
                ))}

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={state.giftCredits.length}
                  pageSize={pageSize}
                />
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <Card tone="intel">
            <SectionTitle>Credit Security & Rules</SectionTitle>
            <ul className="space-y-2 text-xs font-medium text-[#101828]/70 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#0F9D8A] font-bold">✓</span>
                Single-use barcode issued directly to verified phone or email.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0F9D8A] font-bold">✓</span>
                Automatically synced with Toast POS checkout for instant redemption.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0F9D8A] font-bold">✓</span>
                Audit logged to prevent fraudulent re-issuance or duplicate redemption.
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
